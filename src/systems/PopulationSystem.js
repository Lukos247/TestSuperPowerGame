import { clamp } from '../engine/utils.js';

/**
 * PopulationSystem - Manages demographics, health, education, and workforce
 * for all countries in the simulation.
 *
 * Country population properties expected:
 *   population, populationGrowth, literacy, healthIndex, unemployment, emigrationRate
 *
 * Budget properties that influence outcomes:
 *   budget.educationSpending, budget.healthcareSpending, budget.socialSpending
 */
export class PopulationSystem {
  constructor() {
    this.engine = null;

    // Tracks delayed education investment impact per country.
    // Maps countryId -> array of { amount, monthsRemaining }
    this._educationPipeline = new Map();

    // Active epidemics per country.
    // Maps countryId -> { severity, monthsRemaining, workforcePenalty }
    this._activeEpidemics = new Map();
  }

  // ------------------------------------------------------------------ name
  get name() {
    return 'population';
  }

  // ------------------------------------------------------------------ init
  init() {
    // Ensure every country has sensible defaults for population fields so the
    // rest of the system can operate without null-checks.
    for (const [id, country] of this.engine.countries) {
      country.population        = country.population        ?? 10_000_000;
      country.populationGrowth  = country.populationGrowth  ?? 0.01;
      country.literacy          = clamp(country.literacy     ?? 0.5, 0, 1);
      country.healthIndex       = clamp(country.healthIndex  ?? 0.5, 0, 1);
      country.unemployment      = clamp(country.unemployment ?? 0.08, 0, 1);
      country.emigrationRate    = clamp(country.emigrationRate ?? 0.001, 0, 1);

      if (!country.budget) {
        country.budget = {};
      }
      country.budget.educationSpending  = country.budget.educationSpending  ?? 0.5;
      country.budget.healthcareSpending = country.budget.healthcareSpending ?? 0.5;
      country.budget.socialSpending     = country.budget.socialSpending     ?? 0.5;

      this._educationPipeline.set(id, []);
    }
  }

  // ---------------------------------------------------------- monthlyUpdate
  monthlyUpdate(date) {
    for (const [id, country] of this.engine.countries) {
      this._updateHealth(id, country);
      this._updateEpidemics(id, country);
      this._updateEducation(id, country);
      this._updateEmployment(id, country);
      this._updateMigration(id, country);
      this._updatePopulationGrowth(id, country);
      this._updateSocialUnrest(id, country);
    }
  }

  // ======================================================================
  //  POPULATION GROWTH / DECLINE
  // ======================================================================
  _updatePopulationGrowth(id, country) {
    // --- Adjust the underlying annual growth rate based on conditions ------
    let effectiveAnnualRate = country.populationGrowth;

    // Health bonus / penalty: healthIndex 0.5 is neutral; above adds up to
    // +0.005/yr, below subtracts up to -0.01/yr
    effectiveAnnualRate += (country.healthIndex - 0.5) * 0.02;

    // GDP per capita effect (wealthier nations tend toward lower birth rate
    // but lower death rate; net small positive for mid-range, slight negative
    // at very high GDP/cap)
    const gdpPerCapita = this._getGdpPerCapita(country);
    if (gdpPerCapita > 50_000) {
      effectiveAnnualRate -= 0.002; // rich-country demographic slowdown
    } else if (gdpPerCapita > 20_000) {
      effectiveAnnualRate += 0.001;
    }

    // War casualties – reduce population directly, also dampen growth rate
    const warCasualties = this._getMonthlyWarCasualties(id, country);
    effectiveAnnualRate -= warCasualties > 0 ? 0.002 : 0;

    // Emigration drags growth
    effectiveAnnualRate -= country.emigrationRate;

    // Active epidemic dampens growth via elevated death rate
    const epidemic = this._activeEpidemics.get(id);
    if (epidemic) {
      effectiveAnnualRate -= epidemic.severity * 0.05;
    }

    // Clamp so growth never exceeds plausible bounds
    effectiveAnnualRate = clamp(effectiveAnnualRate, -0.05, 0.04);

    // --- Apply monthly fraction of annual rate ----
    const monthlyChange = country.population * (effectiveAnnualRate / 12);
    country.population = Math.max(1000, Math.round(country.population + monthlyChange - warCasualties));

    // Store effective rate back so UI / other systems can read it
    country.populationGrowth = effectiveAnnualRate;
  }

  // ======================================================================
  //  HEALTH
  // ======================================================================
  _updateHealth(id, country) {
    const spending = clamp(country.budget.healthcareSpending ?? 0.5, 0, 1);

    // Health index drifts toward a target determined by spending.
    // Target = spending * 0.9 (can't reach 1.0 with spending alone).
    const target = spending * 0.9;
    const delta = (target - country.healthIndex) * 0.02; // 2 % convergence / month
    country.healthIndex = clamp(country.healthIndex + delta, 0, 1);

    // --- Epidemic chance ---
    // Base monthly chance 0.2 % at healthIndex 1, up to 2 % at healthIndex 0.
    const epidemicChance = 0.002 + (1 - country.healthIndex) * 0.018;
    if (!this._activeEpidemics.has(id) && Math.random() < epidemicChance) {
      this._startEpidemic(id, country);
    }
  }

  _startEpidemic(id, country) {
    // Severity 0.1 – 0.8 inversely related to health index
    const severity = clamp(0.1 + (1 - country.healthIndex) * 0.7, 0.1, 0.8);
    const duration = Math.ceil(2 + severity * 6); // 2-8 months

    const epidemic = {
      severity,
      monthsRemaining: duration,
      workforcePenalty: severity * 0.1, // up to 8 % workforce reduction
    };
    this._activeEpidemics.set(id, epidemic);

    this.engine.notify(
      `Epidemic outbreak in ${country.name || id}! Severity: ${(severity * 100).toFixed(0)}%`,
      'danger',
      id,
    );
    this.engine.events.emit('epidemic', { countryId: id, epidemic });
  }

  _updateEpidemics(id, country) {
    const epidemic = this._activeEpidemics.get(id);
    if (!epidemic) return;

    // Direct population loss each month the epidemic rages
    const monthlyLoss = Math.round(country.population * epidemic.severity * 0.001);
    country.population = Math.max(1000, country.population - monthlyLoss);

    epidemic.monthsRemaining--;
    if (epidemic.monthsRemaining <= 0) {
      this._activeEpidemics.delete(id);
      this.engine.notify(
        `The epidemic in ${country.name || id} has subsided.`,
        'info',
        id,
      );
      this.engine.events.emit('epidemicEnded', { countryId: id });
    }
  }

  // ======================================================================
  //  EDUCATION / LITERACY
  // ======================================================================
  _updateEducation(id, country) {
    const spending = clamp(country.budget.educationSpending ?? 0.5, 0, 1);

    // --- Immediate (slow) literacy gain from spending ---
    // At maximum spending literacy rises ~0.001 / month; at zero it decays.
    const immediateGain = (spending - 0.3) * (0.001 / 0.7); // 0 at 0.3, 0.001 at 1.0
    country.literacy = clamp(country.literacy + immediateGain, 0, 1);

    // --- Delayed pipeline: big investments take years to mature ---
    const pipeline = this._educationPipeline.get(id);
    if (pipeline) {
      // Push new investment entry (matures over 24-60 months)
      if (spending > 0.5) {
        const excess = spending - 0.5; // 0-0.5
        pipeline.push({
          amount: excess * 0.0005, // literacy boost when it matures
          monthsRemaining: Math.round(24 + (1 - excess) * 36),
        });
      }

      // Tick down existing entries
      for (let i = pipeline.length - 1; i >= 0; i--) {
        pipeline[i].monthsRemaining--;
        if (pipeline[i].monthsRemaining <= 0) {
          country.literacy = clamp(country.literacy + pipeline[i].amount, 0, 1);
          pipeline.splice(i, 1);
        }
      }
    }

    // --- Education feedback into tech research speed ---
    // Emit so TechSystem (or others) can pick it up
    this.engine.events.emit('literacyUpdated', {
      countryId: id,
      literacy: country.literacy,
      researchMultiplier: 0.5 + country.literacy * 1.0, // 0.5x – 1.5x
      productivityMultiplier: 0.7 + country.literacy * 0.6, // 0.7x – 1.3x
    });
  }

  // ======================================================================
  //  EMPLOYMENT / UNEMPLOYMENT
  // ======================================================================
  _updateEmployment(id, country) {
    // Gather economic indicators
    const economySystem = this.engine.getSystem('economy');
    const gdpGrowth = economySystem?.getGdpGrowth?.(id) ?? this.engine.globalState.globalGrowthRate;

    // GDP growth pushes unemployment down; contraction pushes it up.
    // Sensitivity: 1 % GDP growth ≈ 0.3 % unemployment reduction / month
    const growthEffect = -gdpGrowth * 0.025;

    // Sector employment contribution (if economy system tracks sectors)
    const sectorEffect = this._getSectorEmploymentDelta(id);

    // Automation / tech increases productivity but can raise unemployment
    const techSystem = this.engine.getSystem('technology');
    const automationLevel = techSystem?.getAutomationLevel?.(id) ?? 0;
    const automationEffect = automationLevel * 0.0005; // small upward pressure

    // Social spending acts as a jobs programme / safety net (indirect)
    const socialSpending = clamp(country.budget.socialSpending ?? 0.5, 0, 1);
    const socialEffect = -(socialSpending - 0.3) * 0.002;

    const totalDelta = growthEffect + sectorEffect + automationEffect + socialEffect;
    country.unemployment = clamp(country.unemployment + totalDelta, 0.02, 0.60);
  }

  _getSectorEmploymentDelta(id) {
    const economySystem = this.engine.getSystem('economy');
    if (!economySystem || !economySystem.getSectorEmployment) return 0;

    const sectorData = economySystem.getSectorEmployment(id);
    if (!sectorData) return 0;

    // Net hiring across all sectors expressed as small monthly delta
    return clamp(sectorData.netHiringRate ?? 0, -0.01, 0.01);
  }

  // ======================================================================
  //  MIGRATION
  // ======================================================================
  _updateMigration(id, country) {
    // --- EMIGRATION ---
    // People leave when: unemployment high, stability low, wars ongoing
    let emigrationPressure = 0;

    emigrationPressure += Math.max(0, country.unemployment - 0.10) * 0.05;

    const stability = country.stability ?? 0.5;
    emigrationPressure += Math.max(0, 0.5 - stability) * 0.04;

    const atWar = this._isAtWar(id);
    if (atWar) {
      emigrationPressure += 0.01;
    }

    // Emigration rate converges toward the pressure with some inertia
    country.emigrationRate = clamp(
      country.emigrationRate + (emigrationPressure - country.emigrationRate) * 0.1,
      0,
      0.05,
    );

    const emigrants = Math.round(country.population * (country.emigrationRate / 12));

    // --- IMMIGRATION ---
    // People come when: high GDP/capita, high stability, high freedom
    let immigrationPull = 0;

    const gdpPerCapita = this._getGdpPerCapita(country);
    if (gdpPerCapita > 20_000) {
      immigrationPull += Math.min((gdpPerCapita - 20_000) / 200_000, 0.02);
    }

    if (stability > 0.6) {
      immigrationPull += (stability - 0.6) * 0.02;
    }

    const freedom = country.freedomIndex ?? country.politicalFreedom ?? 0.5;
    if (freedom > 0.5) {
      immigrationPull += (freedom - 0.5) * 0.015;
    }

    const immigrants = Math.round(country.population * (immigrationPull / 12));

    // Net migration applied to population
    const netMigration = immigrants - emigrants;
    country.population = Math.max(1000, country.population + netMigration);

    // Store for UI / stats
    country._lastEmigrants = emigrants;
    country._lastImmigrants = immigrants;
    country._lastNetMigration = netMigration;
  }

  // ======================================================================
  //  SOCIAL UNREST FEEDBACK
  // ======================================================================
  _updateSocialUnrest(id, country) {
    // --- High unemployment -> lower approval ---
    if (country.unemployment > 0.12) {
      const excess = country.unemployment - 0.12;
      const approvalHit = excess * 0.5; // every 1 % above 12 % = 0.5 % approval drop
      this.engine.events.emit('approvalChange', {
        countryId: id,
        delta: -approvalHit,
        reason: 'unemployment',
      });
    }

    // --- Low health -> protests ---
    if (country.healthIndex < 0.35) {
      const severity = (0.35 - country.healthIndex) / 0.35; // 0-1
      this.engine.events.emit('protest', {
        countryId: id,
        cause: 'health',
        severity,
      });

      if (severity > 0.5) {
        this.engine.notify(
          `Health crisis protests in ${country.name || id}!`,
          'warning',
          id,
        );
      }
    }

    // --- High unemployment -> protests ---
    if (country.unemployment > 0.20) {
      const severity = clamp((country.unemployment - 0.20) / 0.30, 0, 1);
      this.engine.events.emit('protest', {
        countryId: id,
        cause: 'unemployment',
        severity,
      });

      if (severity > 0.4) {
        this.engine.notify(
          `Unemployment protests in ${country.name || id}!`,
          'warning',
          id,
        );
      }
    }

    // --- Active epidemic -> panic, approval loss ---
    const epidemic = this._activeEpidemics.get(id);
    if (epidemic) {
      this.engine.events.emit('approvalChange', {
        countryId: id,
        delta: -epidemic.severity * 0.02,
        reason: 'epidemic',
      });
    }
  }

  // ======================================================================
  //  WORKFORCE CALCULATION
  // ======================================================================
  getWorkforce(countryId) {
    const country = this.engine.getCountry(countryId);
    if (!country) return null;

    const totalWorkforce = Math.round(country.population * 0.65);
    const epidemic = this._activeEpidemics.get(countryId);
    const epidemicPenalty = epidemic ? epidemic.workforcePenalty : 0;

    const effectiveUnemployment = clamp(country.unemployment + epidemicPenalty, 0, 1);
    const employedWorkforce = Math.round(totalWorkforce * (1 - effectiveUnemployment));

    return {
      total: totalWorkforce,
      employed: employedWorkforce,
      unemployed: totalWorkforce - employedWorkforce,
      unemploymentRate: effectiveUnemployment,
      epidemicPenalty,
    };
  }

  // ======================================================================
  //  POPULATION STATS (public API)
  // ======================================================================
  getPopulationStats(countryId) {
    const country = this.engine.getCountry(countryId);
    if (!country) return null;

    const workforce = this.getWorkforce(countryId);
    const epidemic = this._activeEpidemics.get(countryId);
    const pipeline = this._educationPipeline.get(countryId) || [];

    return {
      population: country.population,
      populationGrowth: country.populationGrowth,
      literacy: country.literacy,
      healthIndex: country.healthIndex,
      unemployment: country.unemployment,
      emigrationRate: country.emigrationRate,

      workforce,

      migration: {
        emigrants: country._lastEmigrants ?? 0,
        immigrants: country._lastImmigrants ?? 0,
        netMigration: country._lastNetMigration ?? 0,
      },

      education: {
        spending: country.budget.educationSpending,
        pendingInvestments: pipeline.length,
        researchMultiplier: 0.5 + country.literacy * 1.0,
        productivityMultiplier: 0.7 + country.literacy * 0.6,
      },

      health: {
        spending: country.budget.healthcareSpending,
        epidemic: epidemic
          ? {
              severity: epidemic.severity,
              monthsRemaining: epidemic.monthsRemaining,
              workforcePenalty: epidemic.workforcePenalty,
            }
          : null,
      },

      social: {
        spending: country.budget.socialSpending,
        unrestRisk: this._getUnrestRisk(country),
      },
    };
  }

  // ======================================================================
  //  INTERNAL HELPERS
  // ======================================================================

  /**
   * Approximate GDP per capita. Prefers economy system data, falls back to
   * a stored property, and finally a default.
   */
  _getGdpPerCapita(country) {
    if (country.population <= 0) return 0;

    const economySystem = this.engine.getSystem('economy');
    if (economySystem && typeof economySystem.getGdp === 'function') {
      const gdp = economySystem.getGdp(country.id);
      if (gdp != null) return gdp / country.population;
    }

    if (country.gdp != null) {
      return country.gdp / country.population;
    }

    return country.gdpPerCapita ?? 10_000;
  }

  /**
   * Monthly war casualties. Queries the military / diplomacy system if
   * available, otherwise returns 0.
   */
  _getMonthlyWarCasualties(id, country) {
    const militarySystem = this.engine.getSystem('military');
    if (militarySystem && typeof militarySystem.getMonthlyCasualties === 'function') {
      return militarySystem.getMonthlyCasualties(id) ?? 0;
    }
    return 0;
  }

  /**
   * Whether the country is currently at war.
   */
  _isAtWar(id) {
    const diplomacySystem = this.engine.getSystem('diplomacy');
    if (diplomacySystem && typeof diplomacySystem.isAtWar === 'function') {
      return diplomacySystem.isAtWar(id);
    }

    const militarySystem = this.engine.getSystem('military');
    if (militarySystem && typeof militarySystem.isAtWar === 'function') {
      return militarySystem.isAtWar(id);
    }

    return false;
  }

  /**
   * Composite unrest risk score 0-1 based on unemployment and health.
   */
  _getUnrestRisk(country) {
    let risk = 0;
    if (country.unemployment > 0.12) {
      risk += clamp((country.unemployment - 0.12) / 0.38, 0, 0.5);
    }
    if (country.healthIndex < 0.4) {
      risk += clamp((0.4 - country.healthIndex) / 0.4, 0, 0.5);
    }
    return clamp(risk, 0, 1);
  }
}
