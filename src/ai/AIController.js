import { clamp, randRange } from '../engine/utils.js';

export class AIController {
  constructor() {
    this.name = 'ai';
    this.engine = null;
    this.aiDecisionInterval = 0; // months since last major decision
  }

  init() {
    // AI personality profiles based on country ideology
    this.personalities = {
      aggressive: { warThreshold: 0.3, expansionism: 0.8, diplomacyWeight: 0.3 },
      balanced: { warThreshold: 0.5, expansionism: 0.5, diplomacyWeight: 0.6 },
      peaceful: { warThreshold: 0.8, expansionism: 0.2, diplomacyWeight: 0.9 },
      isolationist: { warThreshold: 0.7, expansionism: 0.1, diplomacyWeight: 0.3 },
    };
  }

  getPersonality(country) {
    const dem = country.ideology.democracy;
    const eco = country.ideology.economy;

    if (dem < 0.3 && eco < 0.4) return this.personalities.aggressive;
    if (dem > 0.7) return this.personalities.peaceful;
    if (dem < 0.4 && eco > 0.6) return this.personalities.balanced;
    return this.personalities.balanced;
  }

  monthlyUpdate(date) {
    this.aiDecisionInterval++;

    for (const [id, country] of this.engine.countries) {
      if (id === this.engine.playerCountryId) continue;

      // Basic monthly AI: adjust budget
      this.adjustBudget(country);

      // Every 3 months: strategic decisions
      if (this.aiDecisionInterval % 3 === 0) {
        this.makeStrategicDecisions(country);
      }

      // Every 6 months: diplomatic moves
      if (this.aiDecisionInterval % 6 === 0) {
        this.makeDiplomaticMoves(country);
      }

      // Every 12 months: military decisions
      if (this.aiDecisionInterval % 12 === 0) {
        this.makeMilitaryDecisions(country);
      }

      // Auto-research
      this.manageResearch(country);
    }
  }

  adjustBudget(country) {
    const economy = this.engine.getSystem('economy');
    if (!economy) return;

    // If debt is too high, increase taxes and cut spending
    if (country.debtToGDP > 1.0) {
      country.budget.taxRate = clamp(country.budget.taxRate + 0.005, 0.1, 0.6);
      // Cut least essential spending
      country.budget.socialSpending = clamp(country.budget.socialSpending - 0.002, 0.01, 0.2);
    }

    // If economy is struggling, adjust
    if (country.gdpGrowth < -0.02) {
      country.budget.infrastructureSpending = clamp(
        country.budget.infrastructureSpending + 0.002, 0.01, 0.1
      );
    }

    // If stability is low, increase social/military spending
    if (country.stabilityIndex < 0.4) {
      country.budget.socialSpending = clamp(country.budget.socialSpending + 0.003, 0.01, 0.15);
      country.budget.militarySpending = clamp(country.budget.militarySpending + 0.002, 0.01, 0.15);
    }

    // If approval is low, cut taxes or increase social
    if (country.approvalRating < 0.3) {
      if (Math.random() < 0.5) {
        country.budget.taxRate = clamp(country.budget.taxRate - 0.005, 0.1, 0.6);
      } else {
        country.budget.socialSpending = clamp(country.budget.socialSpending + 0.003, 0.01, 0.15);
      }
    }

    // Manage unemployment through sector investment
    if (country.unemployment > 0.15) {
      country.budget.infrastructureSpending = clamp(
        country.budget.infrastructureSpending + 0.003, 0.01, 0.1
      );
    }
  }

  makeStrategicDecisions(country) {
    const personality = this.getPersonality(country);
    const economy = this.engine.getSystem('economy');
    const politics = this.engine.getSystem('politics');

    // Invest in weakest sector
    if (economy) {
      const sectors = country.sectors;
      let weakest = null;
      let weakestLevel = 100;
      for (const [name, sector] of Object.entries(sectors)) {
        if (sector.level < weakestLevel) {
          weakestLevel = sector.level;
          weakest = name;
        }
      }
      if (weakest && weakestLevel < 40) {
        economy.investInSector(country.id, weakest, country.gdp * 0.001);
      }
    }

    // Anti-corruption if corruption is high
    if (politics && country.corruptionIndex > 0.5 && country.ideology.democracy > 0.5) {
      politics.enactPolicy(country.id, 'anti_corruption');
    }

    // Authoritarian countries might use censorship
    if (politics && country.ideology.democracy < 0.3 && country.stabilityIndex < 0.5) {
      politics.enactPolicy(country.id, 'censorship');
    }
  }

  makeDiplomaticMoves(country) {
    const diplomacy = this.engine.getSystem('diplomacy');
    if (!diplomacy) return;

    const personality = this.getPersonality(country);
    const allCountries = this.engine.getAllCountries();

    // Look for alliance opportunities
    if (personality.diplomacyWeight > 0.5) {
      for (const other of allCountries) {
        if (other.id === country.id || other.id === this.engine.playerCountryId) continue;
        const relation = country.relations[other.id] || 0;

        // Propose alliance if relations are good and not already allied
        if (relation > 40 && !this.areAllied(country, other)) {
          if (Math.random() < 0.2) {
            diplomacy.proposeAlliance(country.id, other.id, 'economic');
          }
        }

        // Military alliance for very close countries
        if (relation > 60 && Math.random() < 0.1) {
          diplomacy.proposeAlliance(country.id, other.id, 'military');
        }
      }
    }

    // Propose trade agreements
    for (const other of allCountries) {
      if (other.id === country.id) continue;
      const relation = country.relations[other.id] || 0;

      if (relation > 20 && !this.hasTradeAgreement(country, other.id)) {
        if (Math.random() < 0.15) {
          diplomacy.proposeTradeAgreement(country.id, other.id);
        }
      }
    }

    // Impose sanctions on enemies (strong countries only)
    const military = this.engine.getSystem('military');
    if (military) {
      const myStrength = military.calculateMilitaryStrength(country);
      for (const other of allCountries) {
        if (other.id === country.id) continue;
        const relation = country.relations[other.id] || 0;

        if (relation < -50 && myStrength > 1000) {
          const hasSanctions = country.sanctions.some(s => s.targetId === other.id);
          if (!hasSanctions && Math.random() < 0.1) {
            diplomacy.imposeSanctions(country.id, other.id, 'economic');
          }
        }
      }
    }

    // Send aid to improve relations with weaker friendly countries
    for (const other of allCountries) {
      if (other.id === country.id) continue;
      const relation = country.relations[other.id] || 0;

      if (relation > 20 && other.gdp < country.gdp * 0.1 && country.debtToGDP < 0.8) {
        if (Math.random() < 0.05) {
          const aidAmount = country.gdp * 0.0001;
          diplomacy.sendAid(country.id, other.id, aidAmount);
        }
      }
    }
  }

  makeMilitaryDecisions(country) {
    const military = this.engine.getSystem('military');
    const diplomacy = this.engine.getSystem('diplomacy');
    if (!military || !diplomacy) return;

    const personality = this.getPersonality(country);
    const myStrength = military.calculateMilitaryStrength(country);
    const allCountries = this.engine.getAllCountries();

    // Recruit units if military is weak relative to neighbors
    const threats = this.assessThreats(country);
    if (threats.length > 0) {
      const maxThreatStrength = Math.max(...threats.map(t => military.calculateMilitaryStrength(t)));
      if (myStrength < maxThreatStrength * 0.8) {
        // Recruit more units
        const budgetForRecruit = country.militaryBudget * 0.1;
        const unitCost = country.gdp * 0.00001;
        const unitsToRecruit = Math.floor(budgetForRecruit / unitCost);

        if (unitsToRecruit > 0) {
          // Prioritize infantry for poor countries, tech for rich
          const gdpPerCapita = country.gdp / country.population;
          if (gdpPerCapita > 20000) {
            military.recruitUnits(country.id, 'air', Math.floor(unitsToRecruit * 0.01));
            military.recruitUnits(country.id, 'armor', Math.floor(unitsToRecruit * 0.02));
          } else {
            military.recruitUnits(country.id, 'infantry', unitsToRecruit * 100);
          }
        }

        // Increase military spending
        country.budget.militarySpending = clamp(
          country.budget.militarySpending + 0.005, 0.01, 0.15
        );
      }
    }

    // Consider declaring war
    if (personality.expansionism > 0.5 && country.warFatigue < 30) {
      for (const other of allCountries) {
        if (other.id === country.id || other.id === this.engine.playerCountryId) continue;

        const relation = country.relations[other.id] || 0;
        const otherStrength = military.calculateMilitaryStrength(other);
        const warDesirability = diplomacy.evaluateWarDesirability(country.id, other.id);

        if (
          relation < -40 &&
          myStrength > otherStrength * 1.5 &&
          warDesirability > personality.warThreshold &&
          Math.random() < personality.expansionism * 0.1
        ) {
          // Check if we're not already at war with too many countries
          const activeWars = military.wars.filter(w =>
            w.attackers.includes(country.id) || w.defenders.includes(country.id)
          );

          if (activeWars.length < 2) {
            military.declareWar(country.id, other.id);
            this.engine.notify(
              `${country.name} объявила войну ${other.name}!`,
              'danger',
              country.id
            );
          }
        }
      }
    }

    // Consider peace if war is going badly
    const activeWars = military.wars.filter(w =>
      w.attackers.includes(country.id) || w.defenders.includes(country.id)
    );

    for (const war of activeWars) {
      if (country.warFatigue > 60 || country.approvalRating < 0.2) {
        if (Math.random() < 0.2) {
          military.makePeace(war.id, { type: 'white_peace' });
          this.engine.notify(
            `${country.name} заключила мир`,
            'info',
            country.id
          );
        }
      }
    }

    // Upgrade equipment if affordable
    if (country.debtToGDP < 1.0) {
      const weakestUnit = Object.entries(country.units)
        .filter(([, u]) => u.count > 0)
        .sort((a, b) => a[1].equipment - b[1].equipment)[0];

      if (weakestUnit && weakestUnit[1].equipment < 60) {
        military.upgradeEquipment(country.id, weakestUnit[0]);
      }
    }
  }

  manageResearch(country) {
    const tech = this.engine.getSystem('technology');
    if (!tech) return;

    // If no current research, pick one
    if (!country.currentResearch) {
      const available = tech.getAvailableTechs(country.id);
      if (available.length === 0) return;

      // AI prioritizes based on needs
      let bestTech = null;
      let bestScore = -1;

      for (const t of available) {
        let score = Math.random() * 0.3; // Some randomness

        // Military techs if threatened
        if (t.branch === 'military' && country.warFatigue > 0) score += 0.5;
        if (t.branch === 'military' && country.ideology.democracy < 0.4) score += 0.3;

        // Economic techs if economy is struggling
        if (t.branch === 'civilian' && country.gdpGrowth < 0.01) score += 0.4;
        if (t.branch === 'industrial' && country.sectors.industry.level < 50) score += 0.4;

        // Digital techs are always useful
        if (t.branch === 'digital') score += 0.2;

        // Prefer cheaper techs
        score += (1 - t.cost / 300) * 0.2;

        if (score > bestScore) {
          bestScore = score;
          bestTech = t;
        }
      }

      if (bestTech) {
        tech.startResearch(country.id, bestTech.branch, bestTech.id);
      }
    }
  }

  manageEspionage(country) {
    const espionage = this.engine.getSystem('espionage');
    if (!espionage) return;

    const personality = this.getPersonality(country);

    // Only spy if we have agents
    if (country.agentCount < 5) return;

    // Find targets
    const allCountries = this.engine.getAllCountries();
    for (const other of allCountries) {
      if (other.id === country.id || other.id === this.engine.playerCountryId) continue;

      const relation = country.relations[other.id] || 0;

      // Spy on enemies
      if (relation < -30 && Math.random() < 0.05) {
        const activeOps = espionage.getActiveOperations(country.id);
        if (activeOps.length < country.agentCount * 0.3) {
          if (relation < -60) {
            espionage.launchOperation(country.id, other.id, 'sabotage');
          } else {
            espionage.launchOperation(country.id, other.id, 'intelligence');
          }
        }
      }

      // Steal tech from advanced countries
      if (other.techLevel.civilian > country.techLevel.civilian + 20 && Math.random() < 0.03) {
        espionage.launchOperation(country.id, other.id, 'steal_tech');
      }
    }

    // Defensive: boost counter-intel if we detect threats
    if (country.counterintelligence < 50 && Math.random() < 0.1) {
      espionage.boostCounterintel(country.id);
    }
  }

  assessThreats(country) {
    const threats = [];
    const allCountries = this.engine.getAllCountries();

    for (const other of allCountries) {
      if (other.id === country.id) continue;
      const relation = country.relations[other.id] || 0;

      if (relation < -30) {
        threats.push(other);
      }
    }

    return threats;
  }

  areAllied(country1, country2) {
    return country1.alliances.some(a =>
      a.members && a.members.includes(country2.id)
    );
  }

  hasTradeAgreement(country, otherId) {
    return country.tradeAgreements.some(t => t.partnerId === otherId);
  }
}
