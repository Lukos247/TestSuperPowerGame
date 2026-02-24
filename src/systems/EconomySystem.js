import { clamp } from '../engine/utils.js';

export class EconomySystem {
  get name() {
    return 'economy';
  }

  init() {
    // Cache for previous-year GDP snapshots used in yearly growth reporting
    this.previousYearGDP = new Map();

    // Track consecutive months of negative growth per country for recession detection
    this.negativeGrowthMonths = new Map();

    // Snapshot starting GDP for all countries
    for (const [id, country] of this.engine.countries) {
      this.previousYearGDP.set(id, country.gdp);
      this.negativeGrowthMonths.set(id, 0);
    }
  }

  // ---------------------------------------------------------------------------
  // Daily tick -- lightweight bookkeeping only
  // ---------------------------------------------------------------------------
  update(date) {
    // Daily fluctuations in foreign reserves from trade (1/30 of monthly trade balance)
    for (const [id, country] of this.engine.countries) {
      const dailyTrade = country.tradeBalance / 30;
      country.foreignReserves += dailyTrade;
      if (country.foreignReserves < 0) {
        country.foreignReserves = 0;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Monthly update -- core economic simulation
  // ---------------------------------------------------------------------------
  monthlyUpdate(date) {
    for (const [id, country] of this.engine.countries) {
      this._updateCountryEconomy(id, country, date);
    }
  }

  _updateCountryEconomy(id, country, date) {
    const budget = country.budget;
    const sectors = country.sectors;

    // ------------------------------------------------------------------
    // 1. Sector-weighted productivity index (0 .. 1)
    // ------------------------------------------------------------------
    const sectorProductivity = this._calcSectorProductivity(sectors);

    // ------------------------------------------------------------------
    // 2. GDP growth rate for this month (annualized rate / 12)
    // ------------------------------------------------------------------
    const monthlyGrowth = this._calcMonthlyGDPGrowth(country, sectorProductivity);
    country.gdp *= (1 + monthlyGrowth);
    country.gdpGrowth = monthlyGrowth * 12; // annualized for display

    // ------------------------------------------------------------------
    // 3. Inflation
    // ------------------------------------------------------------------
    country.inflation = this._calcInflation(country);

    // ------------------------------------------------------------------
    // 4. Trade balance
    // ------------------------------------------------------------------
    country.tradeBalance = this._calcTradeBalance(country);

    // ------------------------------------------------------------------
    // 5. Budget: revenue, expenses, deficit
    // ------------------------------------------------------------------
    const monthlyGDP = country.gdp / 12;
    const revenue = monthlyGDP * budget.taxRate;

    const totalSpendingRate =
      budget.militarySpending +
      budget.educationSpending +
      budget.healthcareSpending +
      budget.infrastructureSpending +
      budget.socialSpending +
      budget.scienceSpending +
      budget.intelligenceSpending;

    const expenses = monthlyGDP * totalSpendingRate;
    const deficit = expenses - revenue;

    // ------------------------------------------------------------------
    // 6. Debt servicing
    // ------------------------------------------------------------------
    const interestRate = this._calcInterestRate(country);
    const monthlyInterest = (country.debt * interestRate) / 12;

    // ------------------------------------------------------------------
    // 7. Update debt
    // ------------------------------------------------------------------
    if (deficit > 0) {
      country.debt += deficit + monthlyInterest;
    } else {
      // Surplus reduces debt, but interest still accrues
      country.debt += monthlyInterest + deficit; // deficit is negative here
    }
    country.debt = Math.max(0, country.debt);
    country.debtToGDP = country.gdp > 0 ? country.debt / country.gdp : 0;

    // ------------------------------------------------------------------
    // 8. Dutch disease
    // ------------------------------------------------------------------
    this._applyDutchDisease(sectors);

    // ------------------------------------------------------------------
    // 9. Foreign investment flows
    // ------------------------------------------------------------------
    this._updateForeignInvestment(country);

    // ------------------------------------------------------------------
    // 10. Foreign reserves adjustment
    // ------------------------------------------------------------------
    // Reserves grow from trade surplus and foreign investment, shrink from deficit
    const reserveDelta = -deficit * 0.3 + country.tradeBalance * 0.08;
    country.foreignReserves += reserveDelta;
    country.foreignReserves = Math.max(0, country.foreignReserves);

    // ------------------------------------------------------------------
    // 11. Sector growth from spending
    // ------------------------------------------------------------------
    this._applySectorGrowthFromSpending(country);

    // ------------------------------------------------------------------
    // 12. Crisis detection
    // ------------------------------------------------------------------
    this._detectCrises(id, country, date);
  }

  // =========================================================================
  //  CALCULATION HELPERS
  // =========================================================================

  /**
   * Weighted productivity index from sector levels (0..100).
   * Services and tech are weighted more heavily in modern economies.
   */
  _calcSectorProductivity(sectors) {
    const weights = { agriculture: 0.10, industry: 0.25, services: 0.35, tech: 0.30 };
    let total = 0;
    for (const [key, w] of Object.entries(weights)) {
      const sector = sectors[key];
      if (sector) {
        total += (sector.level / 100) * w;
      }
    }
    return clamp(total, 0, 1);
  }

  /**
   * Monthly GDP growth (not annualized).
   *
   * Base growth comes from:
   *   - Sector productivity index
   *   - Global growth tailwind
   *   - Infrastructure spending (long-run capacity)
   *   - Education spending (human capital)
   *   - Science spending (tech multiplier)
   *   - Trade balance contribution
   *
   * Drags:
   *   - High inflation erodes growth
   *   - High debt burden crowds out investment
   *   - Excessive tax rates dampen the private sector
   */
  _calcMonthlyGDPGrowth(country, sectorProductivity) {
    const budget = country.budget;
    const globalGrowth = this.engine.globalState.globalGrowthRate;

    // Base growth: sector productivity scaled to a reasonable annual ~3-6% band
    let annualGrowth = sectorProductivity * 0.06; // max ~6% from sectors alone

    // Global growth tailwind (+/- contribution)
    annualGrowth += globalGrowth * 0.3;

    // Infrastructure spending bonus (diminishing returns past 0.08)
    const infraBonus = Math.sqrt(budget.infrastructureSpending / 0.08) * 0.015;
    annualGrowth += clamp(infraBonus, 0, 0.025);

    // Education human-capital bonus (slow but powerful)
    const eduBonus = Math.sqrt(budget.educationSpending / 0.06) * 0.01;
    annualGrowth += clamp(eduBonus, 0, 0.02);

    // Science / tech multiplier
    const sciBonus = (budget.scienceSpending || 0) * 0.15;
    annualGrowth += clamp(sciBonus, 0, 0.02);

    // Trade balance contribution: surplus adds, deficit drags
    if (country.gdp > 0) {
      const tradeRatio = country.tradeBalance / country.gdp;
      annualGrowth += clamp(tradeRatio * 0.5, -0.02, 0.02);
    }

    // ---- Drags ----

    // Inflation drag: mild inflation is fine, high inflation punishes growth
    if (country.inflation > 0.04) {
      const excessInflation = country.inflation - 0.04;
      annualGrowth -= excessInflation * 0.6;
    }

    // Debt burden drag: debt service crowds out productive spending
    if (country.debtToGDP > 0.6) {
      const excessDebt = country.debtToGDP - 0.6;
      annualGrowth -= excessDebt * 0.03;
    }

    // Excessive taxation drag: beyond 0.35 starts to hurt
    if (budget.taxRate > 0.35) {
      const excessTax = budget.taxRate - 0.35;
      annualGrowth -= excessTax * 0.1;
    }

    // Very low taxation also weakens public services (below 0.10)
    if (budget.taxRate < 0.10) {
      annualGrowth -= (0.10 - budget.taxRate) * 0.05;
    }

    // Small random noise (±0.5% annualized)
    annualGrowth += (Math.random() - 0.5) * 0.005;

    // Clamp to plausible annual range and convert to monthly
    annualGrowth = clamp(annualGrowth, -0.15, 0.20);
    return annualGrowth / 12;
  }

  /**
   * Inflation model.
   *
   * Drivers:
   *   - Government spending relative to GDP (money supply proxy)
   *   - Oil price shocks
   *   - Trade deficit (imported inflation)
   *   - Global inflation baseline
   *
   * Anchors:
   *   - Higher tax rates drain money (deflationary)
   *   - High interest rates (implicit via debt cost) slow spending
   */
  _calcInflation(country) {
    const budget = country.budget;
    const oilPrice = this.engine.globalState.oilPrice;
    const baseInflation = this.engine.globalState.globalInflation || 0.03;

    let inflation = baseInflation;

    // Government spending push: total spending above 0.30 of GDP is inflationary
    const totalSpending =
      budget.militarySpending +
      budget.educationSpending +
      budget.healthcareSpending +
      budget.infrastructureSpending +
      budget.socialSpending +
      budget.scienceSpending +
      budget.intelligenceSpending;

    if (totalSpending > 0.30) {
      inflation += (totalSpending - 0.30) * 0.15;
    }

    // Deficit spending is directly inflationary
    const revenue = budget.taxRate;
    if (totalSpending > revenue) {
      inflation += (totalSpending - revenue) * 0.08;
    }

    // Oil price effect: baseline is $75; every $25 above that adds ~0.5%
    const oilDelta = (oilPrice - 75) / 25;
    inflation += oilDelta * 0.005;

    // Trade deficit imports inflation
    if (country.gdp > 0 && country.tradeBalance < 0) {
      const deficitRatio = Math.abs(country.tradeBalance) / country.gdp;
      inflation += deficitRatio * 0.1;
    }

    // Inertia: inflation doesn't swing wildly month-to-month
    const prevInflation = country.inflation || baseInflation;
    inflation = prevInflation * 0.7 + inflation * 0.3;

    return clamp(inflation, -0.02, 0.50);
  }

  /**
   * Trade balance based on sector outputs and oil price.
   *
   * Industry and tech export; services are mixed; agriculture is mostly domestic.
   */
  _calcTradeBalance(country) {
    const sectors = country.sectors;
    const gdp = country.gdp;
    const oilPrice = this.engine.globalState.oilPrice;

    // Export potential
    const industryExports = (sectors.industry.output || 0) * gdp * 0.4;
    const techExports = (sectors.tech.output || 0) * gdp * 0.5;
    const agriExports = (sectors.agriculture.output || 0) * gdp * 0.1;
    const serviceExports = (sectors.services.output || 0) * gdp * 0.15;

    const totalExports = industryExports + techExports + agriExports + serviceExports;

    // Import needs: countries import what they don't produce domestically
    const domesticCoverage =
      (sectors.agriculture.output || 0) * 0.3 +
      (sectors.industry.output || 0) * 0.3 +
      (sectors.services.output || 0) * 0.2 +
      (sectors.tech.output || 0) * 0.2;

    const importNeed = (1 - clamp(domesticCoverage, 0, 0.85)) * gdp * 0.3;

    // Energy import cost (scales with oil price and inversely with industry)
    const energyImport = gdp * 0.03 * (oilPrice / 75);

    const totalImports = importNeed + energyImport;

    // Smooth transition with previous balance to prevent wild swings
    const rawBalance = totalExports - totalImports;
    const prevBalance = country.tradeBalance || 0;
    return prevBalance * 0.6 + rawBalance * 0.4;
  }

  /**
   * Interest rate on sovereign debt.
   * Low debt-to-GDP and stability give favorable rates; high debt is penalized.
   */
  _calcInterestRate(country) {
    let rate = 0.03; // base 3%

    // Debt-to-GDP premium
    if (country.debtToGDP > 0.6) {
      rate += (country.debtToGDP - 0.6) * 0.04;
    }
    if (country.debtToGDP > 1.0) {
      rate += (country.debtToGDP - 1.0) * 0.08; // accelerating penalty
    }

    // Stability discount/premium (stability is 0..100 if present)
    const stability = country.stability != null ? country.stability : 50;
    rate += (50 - stability) * 0.0005; // +/- up to 2.5%

    // Inflation premium: lenders demand compensation
    if (country.inflation > 0.05) {
      rate += (country.inflation - 0.05) * 0.5;
    }

    return clamp(rate, 0.005, 0.30);
  }

  /**
   * Dutch disease: if any single sector's output exceeds 50% of GDP, other
   * sectors slowly atrophy as capital and labor concentrate.
   */
  _applyDutchDisease(sectors) {
    const sectorKeys = ['agriculture', 'industry', 'services', 'tech'];
    for (const key of sectorKeys) {
      const sector = sectors[key];
      if (sector && sector.output > 0.50) {
        const severity = (sector.output - 0.50) * 0.02; // up to ~1% level drain/month
        for (const otherKey of sectorKeys) {
          if (otherKey !== key) {
            const other = sectors[otherKey];
            if (other) {
              other.level = clamp(other.level - severity * 100, 0, 100);
              other.output = clamp(other.output - severity * 0.1, 0, 1);
            }
          }
        }
      }
    }
  }

  /**
   * Foreign investment inflows/outflows.
   *
   * Attractive factors: low tax, high stability, low corruption, strong tech.
   * Unattractive: high corruption, instability, extreme taxes.
   */
  _updateForeignInvestment(country) {
    const stability = country.stability != null ? country.stability : 50;
    const corruption = country.corruption != null ? country.corruption : 50;
    const taxRate = country.budget.taxRate;
    const techLevel = country.sectors.tech ? country.sectors.tech.level : 0;

    // Attractiveness score (-1..+1)
    let attractiveness = 0;
    attractiveness += (stability - 50) / 100;       // stability contribution
    attractiveness -= (corruption - 30) / 150;       // corruption drag
    attractiveness -= (taxRate - 0.25) * 1.5;        // tax competitiveness
    attractiveness += (techLevel / 100) * 0.3;       // tech draws investment

    attractiveness = clamp(attractiveness, -0.5, 0.5);

    // Convert to dollar flow (fraction of GDP)
    const investmentFlow = attractiveness * 0.005 * country.gdp;

    // Investment boosts tech and industry levels slightly
    if (investmentFlow > 0) {
      const boost = (investmentFlow / country.gdp) * 10; // tiny level boost
      if (country.sectors.tech) {
        country.sectors.tech.level = clamp(country.sectors.tech.level + boost * 0.6, 0, 100);
      }
      if (country.sectors.industry) {
        country.sectors.industry.level = clamp(country.sectors.industry.level + boost * 0.4, 0, 100);
      }
    }

    // Outflows hurt reserves
    country.foreignReserves += investmentFlow / 12;
    country.foreignReserves = Math.max(0, country.foreignReserves);
  }

  /**
   * Government spending gradually improves related sector levels.
   */
  _applySectorGrowthFromSpending(country) {
    const budget = country.budget;
    const sectors = country.sectors;

    // Education -> services and tech human capital
    if (sectors.services) {
      sectors.services.level = clamp(
        sectors.services.level + budget.educationSpending * 1.5,
        0, 100
      );
    }
    if (sectors.tech) {
      sectors.tech.level = clamp(
        sectors.tech.level + budget.educationSpending * 1.0 + (budget.scienceSpending || 0) * 2.0,
        0, 100
      );
    }

    // Infrastructure -> industry and agriculture
    if (sectors.industry) {
      sectors.industry.level = clamp(
        sectors.industry.level + budget.infrastructureSpending * 1.5,
        0, 100
      );
    }
    if (sectors.agriculture) {
      sectors.agriculture.level = clamp(
        sectors.agriculture.level + budget.infrastructureSpending * 0.8,
        0, 100
      );
    }

    // Natural decay: without investment sectors slowly decline (0.05 level/month)
    for (const key of ['agriculture', 'industry', 'services', 'tech']) {
      if (sectors[key]) {
        sectors[key].level = clamp(sectors[key].level - 0.05, 0, 100);
      }
    }

    // Re-normalize sector output shares so they sum close to 1.0
    this._normalizeSectorOutputs(sectors);
  }

  /**
   * Keep sector outputs summing roughly to 1.0, redistributing based on levels.
   */
  _normalizeSectorOutputs(sectors) {
    const keys = ['agriculture', 'industry', 'services', 'tech'];
    let totalLevel = 0;
    for (const key of keys) {
      if (sectors[key]) {
        totalLevel += sectors[key].level;
      }
    }
    if (totalLevel === 0) return;

    for (const key of keys) {
      if (sectors[key]) {
        const target = sectors[key].level / totalLevel;
        // Smooth transition (don't snap instantly)
        sectors[key].output = sectors[key].output * 0.9 + target * 0.1;
        sectors[key].output = clamp(sectors[key].output, 0, 1);
      }
    }
  }

  // =========================================================================
  //  CRISIS DETECTION
  // =========================================================================

  _detectCrises(countryId, country, date) {
    const isPlayer = countryId === this.engine.playerCountryId;

    // --- Hyperinflation ---
    if (country.inflation > 0.15) {
      this.engine.events.emit('economicCrisis', {
        type: 'hyperinflation',
        countryId,
        severity: country.inflation,
        date: { ...date },
      });
      if (isPlayer) {
        this.engine.notify(
          `Hyperinflation crisis! Inflation has reached ${(country.inflation * 100).toFixed(1)}%.`,
          'danger',
          countryId
        );
      }
      // Hyperinflation damages all sectors and reserves
      const damage = (country.inflation - 0.15) * 0.5;
      for (const key of ['agriculture', 'industry', 'services', 'tech']) {
        if (country.sectors[key]) {
          country.sectors[key].level = clamp(country.sectors[key].level - damage, 0, 100);
        }
      }
      country.foreignReserves *= (1 - damage * 0.02);
      country.foreignReserves = Math.max(0, country.foreignReserves);
    }

    // --- Sovereign debt crisis ---
    if (country.debtToGDP > 1.5) {
      const defaultProbability = clamp((country.debtToGDP - 1.5) * 0.3, 0, 0.5);
      this.engine.events.emit('economicCrisis', {
        type: 'debtDefault',
        countryId,
        severity: country.debtToGDP,
        defaultProbability,
        date: { ...date },
      });
      if (isPlayer) {
        this.engine.notify(
          `Sovereign debt crisis! Debt-to-GDP ratio is ${(country.debtToGDP * 100).toFixed(0)}%. Risk of default.`,
          'danger',
          countryId
        );
      }
      // Credit crunch: higher interest makes debt spiral worse
      country.debt *= 1 + defaultProbability * 0.01;
    }

    // --- Unemployment / Depression ---
    const unemployment = this._estimateUnemployment(country);
    if (unemployment > 0.25) {
      this.engine.events.emit('economicCrisis', {
        type: 'depression',
        countryId,
        unemployment,
        date: { ...date },
      });
      if (isPlayer) {
        this.engine.notify(
          `Economic depression! Unemployment has reached ${(unemployment * 100).toFixed(1)}%.`,
          'danger',
          countryId
        );
      }
      // Depression feedback: GDP contracts, stability drops
      country.gdp *= 0.998; // additional 0.2% monthly contraction
      if (country.stability != null) {
        country.stability = clamp(country.stability - 1, 0, 100);
      }
    }

    // --- Recession tracking ---
    if (country.gdpGrowth < 0) {
      const months = (this.negativeGrowthMonths.get(countryId) || 0) + 1;
      this.negativeGrowthMonths.set(countryId, months);
      if (months === 6 && isPlayer) {
        this.engine.notify(
          'The economy has entered a recession (6 consecutive months of negative growth).',
          'warning',
          countryId
        );
        this.engine.events.emit('economicCrisis', {
          type: 'recession',
          countryId,
          months,
          date: { ...date },
        });
      }
    } else {
      this.negativeGrowthMonths.set(countryId, 0);
    }
  }

  /**
   * Estimate unemployment from sector employment fractions and sector health.
   * Full employment is ~0.95 (natural rate of ~5%).
   */
  _estimateUnemployment(country) {
    const sectors = country.sectors;
    let totalEmployment = 0;
    for (const key of ['agriculture', 'industry', 'services', 'tech']) {
      if (sectors[key]) {
        // Effective employment = employment share * sector health
        const health = sectors[key].level / 100;
        totalEmployment += (sectors[key].employment || 0) * health;
      }
    }
    // Natural rate of unemployment is ~4-5%
    const unemployment = 1 - clamp(totalEmployment, 0, 0.96);
    return clamp(unemployment, 0.04, 0.80);
  }

  // ---------------------------------------------------------------------------
  // Yearly update -- GDP growth reporting and annual adjustments
  // ---------------------------------------------------------------------------
  yearlyUpdate(date) {
    for (const [id, country] of this.engine.countries) {
      const prevGDP = this.previousYearGDP.get(id) || country.gdp;
      const annualGrowthRate = prevGDP > 0
        ? (country.gdp - prevGDP) / prevGDP
        : 0;

      // Store for next year comparison
      this.previousYearGDP.set(id, country.gdp);

      // Update the displayed annual growth rate
      country.gdpGrowth = annualGrowthRate;

      // Emit yearly report event
      this.engine.events.emit('yearlyEconomicReport', {
        countryId: id,
        year: date.year - 1, // reporting on the year that just ended
        gdp: country.gdp,
        gdpGrowth: annualGrowthRate,
        inflation: country.inflation,
        debt: country.debt,
        debtToGDP: country.debtToGDP,
        tradeBalance: country.tradeBalance,
        foreignReserves: country.foreignReserves,
      });

      // Notify player of their annual report
      if (id === this.engine.playerCountryId) {
        const growthStr = (annualGrowthRate * 100).toFixed(1);
        const sign = annualGrowthRate >= 0 ? '+' : '';
        this.engine.notify(
          `Annual economic report (${date.year - 1}): GDP growth ${sign}${growthStr}%, ` +
          `Inflation ${(country.inflation * 100).toFixed(1)}%, ` +
          `Debt-to-GDP ${(country.debtToGDP * 100).toFixed(0)}%.`,
          annualGrowthRate >= 0 ? 'info' : 'warning',
          id
        );
      }

      // Annual structural adjustments:
      // Sector employment slowly adjusts toward output shares
      this._adjustEmploymentToOutput(country);
    }
  }

  /**
   * Employment shares drift toward output shares over time (labor mobility).
   */
  _adjustEmploymentToOutput(country) {
    for (const key of ['agriculture', 'industry', 'services', 'tech']) {
      const sector = country.sectors[key];
      if (sector) {
        const target = sector.output || 0;
        // 20% adjustment per year toward target
        sector.employment = sector.employment * 0.8 + target * 0.2;
        sector.employment = clamp(sector.employment, 0, 1);
      }
    }
  }

  // =========================================================================
  //  PLAYER ACTION METHODS
  // =========================================================================

  /**
   * Set the tax rate for a country.
   * @param {string} countryId
   * @param {number} rate - Value between 0 and 1
   * @returns {{ success: boolean, message?: string }}
   */
  setTaxRate(countryId, rate) {
    const country = this.engine.getCountry(countryId);
    if (!country) {
      return { success: false, message: 'Country not found.' };
    }

    const clamped = clamp(rate, 0, 1);
    const oldRate = country.budget.taxRate;
    country.budget.taxRate = clamped;

    this.engine.events.emit('taxRateChanged', {
      countryId,
      oldRate,
      newRate: clamped,
    });

    // Large tax changes cause immediate stability impact
    const delta = Math.abs(clamped - oldRate);
    if (delta > 0.05 && country.stability != null) {
      const stabilityHit = delta * 20; // up to -2 per 0.10 change
      country.stability = clamp(country.stability - stabilityHit, 0, 100);
    }

    return { success: true };
  }

  /**
   * Set a specific budget spending category.
   * @param {string} countryId
   * @param {string} category - One of: militarySpending, educationSpending, etc.
   * @param {number} rate - Value between 0 and 1
   * @returns {{ success: boolean, message?: string }}
   */
  setBudgetAllocation(countryId, category, rate) {
    const country = this.engine.getCountry(countryId);
    if (!country) {
      return { success: false, message: 'Country not found.' };
    }

    const validCategories = [
      'militarySpending',
      'educationSpending',
      'healthcareSpending',
      'infrastructureSpending',
      'socialSpending',
      'scienceSpending',
      'intelligenceSpending',
    ];

    if (!validCategories.includes(category)) {
      return { success: false, message: `Invalid budget category: ${category}` };
    }

    const clamped = clamp(rate, 0, 1);
    const oldRate = country.budget[category];
    country.budget[category] = clamped;

    // Check if total spending exceeds a reasonable ceiling (warn but allow)
    const totalSpending =
      country.budget.militarySpending +
      country.budget.educationSpending +
      country.budget.healthcareSpending +
      country.budget.infrastructureSpending +
      country.budget.socialSpending +
      country.budget.scienceSpending +
      country.budget.intelligenceSpending;

    this.engine.events.emit('budgetChanged', {
      countryId,
      category,
      oldRate,
      newRate: clamped,
      totalSpending,
    });

    let message;
    if (totalSpending > country.budget.taxRate) {
      message = `Warning: Total spending (${(totalSpending * 100).toFixed(1)}%) exceeds tax revenue (${(country.budget.taxRate * 100).toFixed(1)}%). Running a deficit.`;
    }

    return { success: true, message };
  }

  /**
   * Direct investment to boost a specific sector.
   * The amount is spent from foreign reserves (or increases debt if reserves are insufficient).
   *
   * @param {string} countryId
   * @param {string} sector - One of: agriculture, industry, services, tech
   * @param {number} amount - Dollar amount to invest
   * @returns {{ success: boolean, message?: string }}
   */
  investInSector(countryId, sector, amount) {
    const country = this.engine.getCountry(countryId);
    if (!country) {
      return { success: false, message: 'Country not found.' };
    }

    const validSectors = ['agriculture', 'industry', 'services', 'tech'];
    if (!validSectors.includes(sector)) {
      return { success: false, message: `Invalid sector: ${sector}` };
    }

    if (amount <= 0) {
      return { success: false, message: 'Investment amount must be positive.' };
    }

    const sectorData = country.sectors[sector];
    if (!sectorData) {
      return { success: false, message: `Sector ${sector} not found on country.` };
    }

    // Cost scaling: investing at higher levels is progressively more expensive
    // Effectiveness = amount relative to GDP, with diminishing returns
    const gdpFraction = country.gdp > 0 ? amount / country.gdp : 0;
    const effectiveness = Math.sqrt(gdpFraction) * 50; // sqrt for diminishing returns

    // Apply level boost
    const oldLevel = sectorData.level;
    sectorData.level = clamp(sectorData.level + effectiveness, 0, 100);
    const actualBoost = sectorData.level - oldLevel;

    // Deduct from reserves first, remainder goes to debt
    if (country.foreignReserves >= amount) {
      country.foreignReserves -= amount;
    } else {
      const remainder = amount - country.foreignReserves;
      country.foreignReserves = 0;
      country.debt += remainder;
      country.debtToGDP = country.gdp > 0 ? country.debt / country.gdp : 0;
    }

    this.engine.events.emit('sectorInvestment', {
      countryId,
      sector,
      amount,
      levelBefore: oldLevel,
      levelAfter: sectorData.level,
    });

    return {
      success: true,
      message: `Invested in ${sector}: level +${actualBoost.toFixed(1)} (now ${sectorData.level.toFixed(1)}).`,
    };
  }
}
