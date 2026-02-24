import { clamp, randRange } from '../engine/utils.js';

const UNIT_TYPES = ['infantry', 'armor', 'air', 'navy', 'missiles', 'nuclear'];

const TYPE_MULTIPLIERS = {
  infantry: 1,
  armor: 3,
  air: 5,
  navy: 4,
  missiles: 8,
  nuclear: 100,
};

// Cost per unit for recruitment (in millions of $)
const RECRUITMENT_COST = {
  infantry: 0.05,
  armor: 2,
  air: 15,
  navy: 50,
  missiles: 10,
  nuclear: 500,
};

// Monthly maintenance cost per unit (in millions of $)
const MAINTENANCE_COST = {
  infantry: 0.005,
  armor: 0.3,
  air: 2,
  navy: 5,
  missiles: 1,
  nuclear: 50,
};

// Cost to upgrade equipment by 1 point per unit (in millions of $)
const EQUIPMENT_UPGRADE_COST = {
  infantry: 0.01,
  armor: 0.5,
  air: 3,
  navy: 8,
  missiles: 2,
  nuclear: 100,
};

// Cost to train units by 1 point per unit (in millions of $)
const TRAINING_COST = {
  infantry: 0.003,
  armor: 0.1,
  air: 0.5,
  navy: 1,
  missiles: 0.5,
  nuclear: 10,
};

// Casualty rates per combat round (percentage of forces lost)
const BASE_CASUALTY_RATE = 0.02;

let nextWarId = 1;

export class MilitarySystem {
  get name() {
    return 'military';
  }

  init() {
    this.wars = [];
  }

  // ---------------------------------------------------------------------------
  // Monthly Update
  // ---------------------------------------------------------------------------

  monthlyUpdate(date) {
    for (const [countryId, country] of this.engine.countries) {
      this._updateMilitaryBudget(country);
      this._distributeBudget(country);
      this._degradeWithoutSpending(country);
      this._updateWarFatigue(country);
      this._updateMorale(country);
    }

    // Auto-resolve active wars
    this._resolveActiveWars(date);
  }

  // ---------------------------------------------------------------------------
  // Budget Calculation & Distribution
  // ---------------------------------------------------------------------------

  /**
   * Compute the country's military budget from GDP and budget allocation.
   */
  _updateMilitaryBudget(country) {
    const gdp = country.gdp || 0;
    const militaryPct = (country.budget && country.budget.militarySpending) || 0;
    country.militaryBudget = militaryPct * gdp;
  }

  /**
   * Distribute the monthly military budget across maintenance, equipment
   * upkeep and training.  Any surplus after maintenance is split between
   * equipment improvement and training improvement for all unit types.
   */
  _distributeBudget(country) {
    if (!country.units) return;

    const monthlyBudget = (country.militaryBudget || 0) / 12;

    // 1. Calculate total maintenance cost
    let totalMaintenance = 0;
    for (const type of UNIT_TYPES) {
      const unit = country.units[type];
      if (!unit) continue;
      totalMaintenance += unit.count * MAINTENANCE_COST[type];
    }

    // 2. Pay maintenance first
    const maintenanceCoverage = totalMaintenance > 0
      ? Math.min(1, monthlyBudget / totalMaintenance)
      : 1;

    let surplus = Math.max(0, monthlyBudget - totalMaintenance);

    // 3. Split surplus: 60% equipment, 40% training
    const equipmentPool = surplus * 0.6;
    const trainingPool = surplus * 0.4;

    // Count total units for even distribution
    let totalUnits = 0;
    for (const type of UNIT_TYPES) {
      const unit = country.units[type];
      if (unit) totalUnits += unit.count;
    }

    for (const type of UNIT_TYPES) {
      const unit = country.units[type];
      if (!unit || unit.count === 0) continue;

      const unitShare = unit.count / (totalUnits || 1);

      // Equipment improvement from surplus
      if (equipmentPool > 0 && unit.equipment < 100) {
        const allocated = equipmentPool * unitShare;
        const costPerPoint = unit.count * EQUIPMENT_UPGRADE_COST[type];
        const pointsGained = costPerPoint > 0 ? allocated / costPerPoint : 0;
        unit.equipment = clamp(unit.equipment + pointsGained, 0, 100);
      }

      // Training improvement from surplus
      if (trainingPool > 0 && unit.training < 100) {
        const allocated = trainingPool * unitShare;
        const costPerPoint = unit.count * TRAINING_COST[type];
        const pointsGained = costPerPoint > 0 ? allocated / costPerPoint : 0;
        unit.training = clamp(unit.training + pointsGained, 0, 100);
      }

      // If maintenance is underfunded, morale drops
      if (maintenanceCoverage < 1) {
        const penalty = (1 - maintenanceCoverage) * 5;
        unit.morale = clamp(unit.morale - penalty, 0, 100);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Degradation
  // ---------------------------------------------------------------------------

  /**
   * Equipment and training naturally degrade each month without adequate
   * spending.  The degradation is slow so that well-funded militaries
   * essentially negate it via _distributeBudget.
   */
  _degradeWithoutSpending(country) {
    if (!country.units) return;

    for (const type of UNIT_TYPES) {
      const unit = country.units[type];
      if (!unit || unit.count === 0) continue;

      // Equipment degrades 0.5-1.5 points per month
      unit.equipment = clamp(unit.equipment - randRange(0.5, 1.5), 0, 100);

      // Training degrades 0.3-1.0 points per month
      unit.training = clamp(unit.training - randRange(0.3, 1.0), 0, 100);
    }
  }

  // ---------------------------------------------------------------------------
  // War Fatigue & Morale
  // ---------------------------------------------------------------------------

  /**
   * War fatigue grows while a country is involved in any active war and
   * slowly recovers during peacetime.
   */
  _updateWarFatigue(country) {
    const atWar = this._isCountryAtWar(country.id);

    if (atWar) {
      // Fatigue increases 1-3 per month while at war
      country.warFatigue = clamp(
        (country.warFatigue || 0) + randRange(1, 3),
        0,
        100,
      );
    } else {
      // Fatigue decreases 1-2 per month during peace
      country.warFatigue = clamp(
        (country.warFatigue || 0) - randRange(1, 2),
        0,
        100,
      );
    }
  }

  /**
   * Morale is influenced by war fatigue, budget adequacy, and recent combat
   * outcomes.  A high war-fatigue country with poor funding will see morale
   * plummet.
   */
  _updateMorale(country) {
    if (!country.units) return;

    const fatiguePenalty = (country.warFatigue || 0) * 0.05; // up to -5
    const gdp = country.gdp || 1;
    const budgetRatio = (country.militaryBudget || 0) / gdp;
    // Countries spending >= 3% of GDP get a small morale boost
    const budgetBonus = budgetRatio >= 0.03 ? 1 : -1;

    for (const type of UNIT_TYPES) {
      const unit = country.units[type];
      if (!unit || unit.count === 0) continue;

      let moraleShift = budgetBonus - fatiguePenalty;

      // Recent victories / defeats are encoded via events; small random drift
      moraleShift += randRange(-0.5, 0.5);

      unit.morale = clamp(unit.morale + moraleShift, 0, 100);
    }
  }

  // ---------------------------------------------------------------------------
  // Strength Calculation
  // ---------------------------------------------------------------------------

  /**
   * Calculate the total military strength of a country.
   * For each unit type:
   *   strength = count * (equipment/100) * (training/100) * (morale/100) * typeMultiplier
   */
  calculateMilitaryStrength(country) {
    if (typeof country === 'string') {
      country = this.engine.getCountry(country);
    }
    if (!country || !country.units) return 0;

    let total = 0;
    for (const type of UNIT_TYPES) {
      const unit = country.units[type];
      if (!unit || unit.count === 0) continue;

      const effectiveness =
        (unit.equipment / 100) *
        (unit.training / 100) *
        (unit.morale / 100);

      total += unit.count * effectiveness * TYPE_MULTIPLIERS[type];
    }
    return total;
  }

  // ---------------------------------------------------------------------------
  // Combat Resolution
  // ---------------------------------------------------------------------------

  /**
   * Resolve a single combat round between two countries.
   * - Attacker has a 0.9x modifier (slight disadvantage).
   * - Defender gets a terrain bonus (1.1x).
   * - Supply lines reduce effectiveness for distant operations.
   * Returns { winner, attackerLosses, defenderLosses }
   */
  resolveCombat(attackerId, defenderId) {
    const attacker = this.engine.getCountry(attackerId);
    const defender = this.engine.getCountry(defenderId);
    if (!attacker || !defender) return null;

    let attackStrength = this.calculateMilitaryStrength(attacker);
    let defendStrength = this.calculateMilitaryStrength(defender);

    // Attacker disadvantage
    attackStrength *= 0.9;

    // Terrain bonus for defender
    defendStrength *= 1.1;

    // Supply line modifier for attacker (reduces effectiveness with distance)
    const supplyPenalty = this._calculateSupplyPenalty(attacker, defender);
    attackStrength *= supplyPenalty;

    // Naval requirement for overseas operations
    const navyPenalty = this._calculateNavalPenalty(attacker, defender);
    attackStrength *= navyPenalty;

    // War fatigue reduces strength
    const attackerFatigueMod = 1 - (attacker.warFatigue || 0) / 200; // up to 0.5x
    const defenderFatigueMod = 1 - (defender.warFatigue || 0) / 200;
    attackStrength *= attackerFatigueMod;
    defendStrength *= defenderFatigueMod;

    // Add small random factor so battles aren't perfectly deterministic
    attackStrength *= randRange(0.85, 1.15);
    defendStrength *= randRange(0.85, 1.15);

    // Determine winner
    const totalStrength = attackStrength + defendStrength;
    const attackerRatio = totalStrength > 0 ? attackStrength / totalStrength : 0.5;
    const defenderRatio = 1 - attackerRatio;

    // Casualties proportional to opposing strength
    const attackerCasualtyRate = BASE_CASUALTY_RATE * defenderRatio * randRange(0.8, 1.2);
    const defenderCasualtyRate = BASE_CASUALTY_RATE * attackerRatio * randRange(0.8, 1.2);

    const attackerLosses = this._applyCasualties(attacker, attackerCasualtyRate);
    const defenderLosses = this._applyCasualties(defender, defenderCasualtyRate);

    const winner = attackStrength > defendStrength ? attackerId : defenderId;

    // Morale impact of battle outcome
    this._applyBattleMoraleEffect(attacker, winner === attackerId);
    this._applyBattleMoraleEffect(defender, winner === defenderId);

    return {
      winner,
      attackerLosses,
      defenderLosses,
      attackStrength,
      defendStrength,
    };
  }

  /**
   * Apply casualties to a country's units. Returns total units lost.
   */
  _applyCasualties(country, casualtyRate) {
    if (!country.units) return 0;

    let totalLost = 0;
    for (const type of UNIT_TYPES) {
      const unit = country.units[type];
      if (!unit || unit.count === 0) continue;

      // Nuclear weapons are not consumed in normal combat
      if (type === 'nuclear') continue;

      const lost = Math.floor(unit.count * casualtyRate);
      unit.count = Math.max(0, unit.count - lost);
      totalLost += lost;

      // Equipment degrades faster during combat
      unit.equipment = clamp(unit.equipment - randRange(1, 3), 0, 100);
    }
    return totalLost;
  }

  /**
   * Winning a battle boosts morale; losing reduces it.
   */
  _applyBattleMoraleEffect(country, isWinner) {
    if (!country.units) return;

    const shift = isWinner ? randRange(2, 5) : -randRange(3, 7);
    for (const type of UNIT_TYPES) {
      const unit = country.units[type];
      if (!unit) continue;
      unit.morale = clamp(unit.morale + shift, 0, 100);
    }
  }

  // ---------------------------------------------------------------------------
  // Supply Lines
  // ---------------------------------------------------------------------------

  /**
   * Military effectiveness is reduced when fighting far from borders.
   * Uses a simple heuristic based on country continent / region properties.
   * Returns a multiplier between 0.5 and 1.0.
   */
  _calculateSupplyPenalty(attacker, defender) {
    // If countries share a border (same region), no penalty
    if (attacker.region && defender.region && attacker.region === defender.region) {
      return 1.0;
    }

    // If countries are on the same continent, moderate penalty
    if (
      attacker.continent &&
      defender.continent &&
      attacker.continent === defender.continent
    ) {
      return 0.85;
    }

    // Overseas / cross-continent operation: significant penalty
    return 0.65;
  }

  /**
   * Overseas operations without a navy suffer a heavy penalty.
   * Returns a multiplier between 0.3 and 1.0.
   */
  _calculateNavalPenalty(attacker, defender) {
    // Only applies if countries are on different continents
    if (
      attacker.continent &&
      defender.continent &&
      attacker.continent === defender.continent
    ) {
      return 1.0;
    }

    // Need navy for overseas ops
    const navy = attacker.units && attacker.units.navy;
    if (!navy || navy.count === 0) {
      return 0.3; // Severe penalty without any navy
    }

    // Scale based on navy strength relative to total military
    const totalStrength = this.calculateMilitaryStrength(attacker);
    if (totalStrength === 0) return 0.3;

    const navyStrength =
      navy.count *
      (navy.equipment / 100) *
      (navy.training / 100) *
      (navy.morale / 100) *
      TYPE_MULTIPLIERS.navy;

    const navyShare = navyStrength / totalStrength;
    // Good navy (>= 20% of strength) gives full effectiveness
    return clamp(0.5 + navyShare * 2.5, 0.5, 1.0);
  }

  // ---------------------------------------------------------------------------
  // War Management
  // ---------------------------------------------------------------------------

  /**
   * Declare war between two countries.
   * Allies of the defender automatically join the war on the defender's side.
   * Relations drop sharply.
   */
  declareWar(attackerId, defenderId) {
    const attacker = this.engine.getCountry(attackerId);
    const defender = this.engine.getCountry(defenderId);
    if (!attacker || !defender) return null;

    // Check if already at war with each other
    const existingWar = this.wars.find(
      (w) =>
        !w.ended &&
        ((w.attackers.includes(attackerId) && w.defenders.includes(defenderId)) ||
          (w.attackers.includes(defenderId) && w.defenders.includes(attackerId))),
    );
    if (existingWar) return existingWar;

    const warId = nextWarId++;
    const war = {
      id: warId,
      attackers: [attackerId],
      defenders: [defenderId],
      startDate: { ...this.engine.date },
      battles: [],
      ended: false,
      endDate: null,
      terms: null,
    };

    // Allies of defender join on the defender's side
    const diplomacy = this.engine.getSystem('diplomacy');
    if (diplomacy) {
      const defenderAllies = this._getAllies(defenderId, diplomacy);
      for (const allyId of defenderAllies) {
        if (allyId !== attackerId && !war.defenders.includes(allyId)) {
          war.defenders.push(allyId);
          this._setRelation(diplomacy, allyId, attackerId, -50);
        }
      }

      // Allies of attacker may join on the attacker's side
      const attackerAllies = this._getAllies(attackerId, diplomacy);
      for (const allyId of attackerAllies) {
        if (allyId !== defenderId && !war.attackers.includes(allyId) && !war.defenders.includes(allyId)) {
          war.attackers.push(allyId);
        }
      }

      // Relations impact
      this._setRelation(diplomacy, attackerId, defenderId, -80);
      for (const defId of war.defenders) {
        this._setRelation(diplomacy, attackerId, defId, -50);
      }
    }

    this.wars.push(war);

    // Emit event and notify
    this.engine.events.emit('warDeclared', {
      warId,
      attackerId,
      defenderId,
      war,
    });
    this.engine.notify(
      `${attacker.name} has declared war on ${defender.name}!`,
      'war',
      attackerId,
    );

    return war;
  }

  /**
   * End a war with specified terms.
   * terms: { victor, territoryChanges, reparations, ... }
   */
  makePeace(warId, terms = {}) {
    const war = this.wars.find((w) => w.id === warId);
    if (!war || war.ended) return null;

    war.ended = true;
    war.endDate = { ...this.engine.date };
    war.terms = terms;

    // Apply reparations if specified
    if (terms.reparations && terms.loser && terms.victor) {
      const loser = this.engine.getCountry(terms.loser);
      const victor = this.engine.getCountry(terms.victor);
      if (loser && victor) {
        const amount = terms.reparations;
        if (loser.treasury !== undefined) loser.treasury -= amount;
        if (victor.treasury !== undefined) victor.treasury += amount;
      }
    }

    // Apply occupation / resource transfer
    if (terms.occupation && terms.victor) {
      this._applyOccupation(terms.victor, terms.occupation);
    }

    // Partially restore relations between sides
    const diplomacy = this.engine.getSystem('diplomacy');
    if (diplomacy) {
      for (const atkId of war.attackers) {
        for (const defId of war.defenders) {
          // Relations improve slightly with peace but remain poor
          this._adjustRelation(diplomacy, atkId, defId, 20);
        }
      }
    }

    // Reduce war fatigue slowly now that peace is declared
    for (const id of [...war.attackers, ...war.defenders]) {
      const country = this.engine.getCountry(id);
      if (country) {
        country.warFatigue = clamp((country.warFatigue || 0) - 5, 0, 100);
      }
    }

    this.engine.events.emit('peaceDeclared', { warId, terms, war });

    const side1 = this.engine.getCountry(war.attackers[0]);
    const side2 = this.engine.getCountry(war.defenders[0]);
    this.engine.notify(
      `Peace declared between ${side1 ? side1.name : 'Unknown'} and ${side2 ? side2.name : 'Unknown'}.`,
      'peace',
    );

    return war;
  }

  /**
   * Auto-resolve all active wars each month.  Each war gets one combat round
   * between the leading attackers and defenders.
   */
  _resolveActiveWars(date) {
    for (const war of this.wars) {
      if (war.ended) continue;

      // Pick primary combatants (first in each list, or strongest)
      const primaryAttacker = this._getStrongestInCoalition(war.attackers);
      const primaryDefender = this._getStrongestInCoalition(war.defenders);

      if (!primaryAttacker || !primaryDefender) {
        // One side has no viable countries - auto end
        this.makePeace(war.id, {
          victor: primaryAttacker ? war.attackers[0] : war.defenders[0],
        });
        continue;
      }

      const result = this.resolveCombat(primaryAttacker, primaryDefender);
      if (!result) continue;

      war.battles.push({
        date: { ...date },
        attackerId: primaryAttacker,
        defenderId: primaryDefender,
        winner: result.winner,
        attackerLosses: result.attackerLosses,
        defenderLosses: result.defenderLosses,
      });

      // Apply secondary coalition combat (allies contribute)
      for (const atkId of war.attackers) {
        if (atkId === primaryAttacker) continue;
        for (const defId of war.defenders) {
          if (defId === primaryDefender) continue;
          const secondaryResult = this.resolveCombat(atkId, defId);
          if (secondaryResult) {
            war.battles.push({
              date: { ...date },
              attackerId: atkId,
              defenderId: defId,
              winner: secondaryResult.winner,
              attackerLosses: secondaryResult.attackerLosses,
              defenderLosses: secondaryResult.defenderLosses,
            });
          }
        }
      }

      // Occupation: winner of the month gains resources from the loser
      if (result.winner) {
        const loserId =
          result.winner === primaryAttacker ? primaryDefender : primaryAttacker;
        this._applyWarOccupationEffects(result.winner, loserId);
      }

      // Check for auto-peace conditions
      this._checkAutoPeace(war);

      // War cost increases over time
      this._applyWarCosts(war, date);
    }
  }

  /**
   * When a side is too weak or exhausted, auto-negotiate peace.
   */
  _checkAutoPeace(war) {
    // Check if either side has been effectively defeated
    const attackerStrength = war.attackers.reduce((sum, id) => {
      const c = this.engine.getCountry(id);
      return sum + (c ? this.calculateMilitaryStrength(c) : 0);
    }, 0);

    const defenderStrength = war.defenders.reduce((sum, id) => {
      const c = this.engine.getCountry(id);
      return sum + (c ? this.calculateMilitaryStrength(c) : 0);
    }, 0);

    // If one side is overwhelmingly defeated (< 10% of opponent)
    if (attackerStrength > 0 && defenderStrength / attackerStrength < 0.1) {
      this.makePeace(war.id, { victor: war.attackers[0] });
      return;
    }
    if (defenderStrength > 0 && attackerStrength / defenderStrength < 0.1) {
      this.makePeace(war.id, { victor: war.defenders[0] });
      return;
    }

    // If war fatigue on both sides is extreme, mutual peace
    const avgAttackerFatigue =
      war.attackers.reduce((sum, id) => {
        const c = this.engine.getCountry(id);
        return sum + (c ? c.warFatigue || 0 : 0);
      }, 0) / (war.attackers.length || 1);

    const avgDefenderFatigue =
      war.defenders.reduce((sum, id) => {
        const c = this.engine.getCountry(id);
        return sum + (c ? c.warFatigue || 0 : 0);
      }, 0) / (war.defenders.length || 1);

    if (avgAttackerFatigue > 90 && avgDefenderFatigue > 90) {
      this.makePeace(war.id, { victor: null }); // Stalemate
    }
  }

  /**
   * War costs escalate over time - treasury drain and increasing fatigue.
   */
  _applyWarCosts(war, date) {
    // Calculate months at war
    const monthsAtWar = this._monthsBetween(war.startDate, date);
    const costMultiplier = 1 + monthsAtWar * 0.1; // 10% more expensive each month

    for (const id of [...war.attackers, ...war.defenders]) {
      const country = this.engine.getCountry(id);
      if (!country) continue;

      // Additional treasury drain from war expenses
      const militaryBudget = country.militaryBudget || 0;
      const warCost = (militaryBudget / 12) * 0.2 * costMultiplier;
      if (country.treasury !== undefined) {
        country.treasury -= warCost;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Occupation Effects
  // ---------------------------------------------------------------------------

  /**
   * Winner siphons resources from the occupied territory each combat round.
   */
  _applyWarOccupationEffects(winnerId, loserId) {
    const winner = this.engine.getCountry(winnerId);
    const loser = this.engine.getCountry(loserId);
    if (!winner || !loser) return;

    // Winner extracts a fraction of loser's monthly GDP
    const extractionRate = 0.005; // 0.5% of loser GDP per month
    const extracted = (loser.gdp || 0) * extractionRate;

    if (winner.treasury !== undefined) winner.treasury += extracted;
    if (loser.treasury !== undefined) loser.treasury -= extracted;
  }

  /**
   * Apply occupation terms after peace (transfer of territory / resources).
   */
  _applyOccupation(victorId, occupationTerms) {
    const victor = this.engine.getCountry(victorId);
    if (!victor || !occupationTerms) return;

    // occupationTerms: { countryId, resourceTransfer }
    if (occupationTerms.countryId && occupationTerms.resourceTransfer) {
      const occupied = this.engine.getCountry(occupationTerms.countryId);
      if (occupied && occupied.treasury !== undefined && victor.treasury !== undefined) {
        const amount = occupationTerms.resourceTransfer;
        occupied.treasury -= amount;
        victor.treasury += amount;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Player Actions
  // ---------------------------------------------------------------------------

  /**
   * Recruit new units of the given type.
   * Costs money from the country treasury.
   * Returns true if successful, false if insufficient funds.
   */
  recruitUnits(countryId, unitType, count) {
    const country = this.engine.getCountry(countryId);
    if (!country || !country.units) return false;
    if (!UNIT_TYPES.includes(unitType)) return false;
    if (count <= 0) return false;

    const cost = count * RECRUITMENT_COST[unitType] * 1e6; // Convert from millions
    if (country.treasury !== undefined && country.treasury < cost) return false;

    // Deduct cost
    if (country.treasury !== undefined) country.treasury -= cost;

    const unit = country.units[unitType];
    if (!unit) {
      country.units[unitType] = {
        count: count,
        equipment: 50,
        training: 30,
        morale: 60,
      };
    } else {
      // New recruits dilute average equipment/training/morale
      const oldCount = unit.count;
      const newCount = oldCount + count;
      unit.equipment = (unit.equipment * oldCount + 50 * count) / newCount;
      unit.training = (unit.training * oldCount + 30 * count) / newCount;
      unit.morale = (unit.morale * oldCount + 60 * count) / newCount;
      unit.count = newCount;
    }

    this.engine.events.emit('unitsRecruited', {
      countryId,
      unitType,
      count,
      cost,
    });

    return true;
  }

  /**
   * Upgrade equipment for a unit type. Spends money to improve equipment rating.
   * Returns true if successful.
   */
  upgradeEquipment(countryId, unitType) {
    const country = this.engine.getCountry(countryId);
    if (!country || !country.units) return false;
    if (!UNIT_TYPES.includes(unitType)) return false;

    const unit = country.units[unitType];
    if (!unit || unit.count === 0) return false;
    if (unit.equipment >= 100) return false;

    const cost = unit.count * EQUIPMENT_UPGRADE_COST[unitType] * 1e6 * 5; // 5 points worth
    if (country.treasury !== undefined && country.treasury < cost) return false;

    if (country.treasury !== undefined) country.treasury -= cost;
    unit.equipment = clamp(unit.equipment + 5, 0, 100);

    this.engine.events.emit('equipmentUpgraded', {
      countryId,
      unitType,
      newLevel: unit.equipment,
      cost,
    });

    return true;
  }

  /**
   * Conduct training exercises for a unit type. Improves training rating.
   * Returns true if successful.
   */
  trainUnits(countryId, unitType) {
    const country = this.engine.getCountry(countryId);
    if (!country || !country.units) return false;
    if (!UNIT_TYPES.includes(unitType)) return false;

    const unit = country.units[unitType];
    if (!unit || unit.count === 0) return false;
    if (unit.training >= 100) return false;

    const cost = unit.count * TRAINING_COST[unitType] * 1e6 * 5; // 5 points worth
    if (country.treasury !== undefined && country.treasury < cost) return false;

    if (country.treasury !== undefined) country.treasury -= cost;
    unit.training = clamp(unit.training + 5, 0, 100);

    this.engine.events.emit('unitsTrained', {
      countryId,
      unitType,
      newLevel: unit.training,
      cost,
    });

    return true;
  }

  // ---------------------------------------------------------------------------
  // Helper / Query Methods
  // ---------------------------------------------------------------------------

  /**
   * Check if a country is currently involved in any active war.
   */
  _isCountryAtWar(countryId) {
    return this.wars.some(
      (w) =>
        !w.ended &&
        (w.attackers.includes(countryId) || w.defenders.includes(countryId)),
    );
  }

  /**
   * Get all active wars involving a given country.
   */
  getWarsForCountry(countryId) {
    return this.wars.filter(
      (w) =>
        !w.ended &&
        (w.attackers.includes(countryId) || w.defenders.includes(countryId)),
    );
  }

  /**
   * Get the strongest country in a coalition (list of country IDs).
   */
  _getStrongestInCoalition(countryIds) {
    let strongest = null;
    let maxStrength = -1;

    for (const id of countryIds) {
      const country = this.engine.getCountry(id);
      if (!country) continue;
      const strength = this.calculateMilitaryStrength(country);
      if (strength > maxStrength) {
        maxStrength = strength;
        strongest = id;
      }
    }
    return strongest;
  }

  /**
   * Get allies of a country from the diplomacy system.
   */
  _getAllies(countryId, diplomacy) {
    if (diplomacy && typeof diplomacy.getAllies === 'function') {
      return diplomacy.getAllies(countryId);
    }

    // Fallback: check relations for alliance-level values (>= 80)
    if (diplomacy && diplomacy.relations) {
      const allies = [];
      for (const [otherId] of this.engine.countries) {
        if (otherId === countryId) continue;
        const relation = this._getRelation(diplomacy, countryId, otherId);
        if (relation >= 80) allies.push(otherId);
      }
      return allies;
    }

    return [];
  }

  /**
   * Get relation value between two countries from the diplomacy system.
   */
  _getRelation(diplomacy, id1, id2) {
    if (diplomacy && typeof diplomacy.getRelation === 'function') {
      return diplomacy.getRelation(id1, id2);
    }
    if (diplomacy && diplomacy.relations) {
      const key = [id1, id2].sort().join(':');
      return diplomacy.relations.get ? diplomacy.relations.get(key) || 0 : 0;
    }
    return 0;
  }

  /**
   * Set relation value between two countries.
   */
  _setRelation(diplomacy, id1, id2, value) {
    if (diplomacy && typeof diplomacy.setRelation === 'function') {
      diplomacy.setRelation(id1, id2, value);
    } else if (diplomacy && diplomacy.relations) {
      const key = [id1, id2].sort().join(':');
      if (diplomacy.relations.set) {
        diplomacy.relations.set(key, clamp(value, -100, 100));
      }
    }
  }

  /**
   * Adjust (add to) relation value between two countries.
   */
  _adjustRelation(diplomacy, id1, id2, delta) {
    const current = this._getRelation(diplomacy, id1, id2);
    this._setRelation(diplomacy, id1, id2, current + delta);
  }

  /**
   * Calculate months between two game dates.
   */
  _monthsBetween(start, end) {
    return (end.year - start.year) * 12 + (end.month - start.month);
  }
}
