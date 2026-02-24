import { clamp, randRange } from '../engine/utils.js';

/**
 * EspionageSystem - Manages intelligence operations, agents, and counter-intelligence
 * for a geopolitical strategy game.
 *
 * Country espionage properties expected:
 *   - budget.intelligenceSpending (fraction of GDP)
 *   - gdp (gross domestic product)
 *   - agentCount (0-100)
 *   - counterintelligence (0-100)
 *   - stability, approval, government (used by various operation effects)
 */

const OPERATIONS = {
  sabotage: {
    name: 'Саботаж',
    cost: 5,
    duration: 3,
    risk: 0.4,
    effects: 'Reduces target industry output temporarily',
  },
  steal_tech: {
    name: 'Кража технологий',
    cost: 8,
    duration: 6,
    risk: 0.5,
    effects: 'Gives 50% progress on target current research',
  },
  destabilize: {
    name: 'Дестабилизация',
    cost: 10,
    duration: 4,
    risk: 0.6,
    effects: 'Reduces target stability and approval',
  },
  coup: {
    name: 'Переворот',
    cost: 20,
    duration: 12,
    risk: 0.8,
    effects: 'Attempt regime change in target country',
  },
  intelligence: {
    name: 'Разведка',
    cost: 3,
    duration: 2,
    risk: 0.2,
    effects: 'Reveals target country hidden stats',
  },
  counter_espionage: {
    name: 'Контрразведка',
    cost: 4,
    duration: 1,
    risk: 0,
    effects: 'Boost counterintelligence temporarily',
  },
  propaganda: {
    name: 'Пропаганда',
    cost: 6,
    duration: 3,
    risk: 0.3,
    effects: 'Reduces target approval, increases own approval',
  },
};

let nextOperationId = 1;

export class EspionageSystem {
  get name() {
    return 'espionage';
  }

  init() {
    /** @type {Array} Active operations currently in progress */
    this.operations = [];

    /** @type {Array} Completed operations history */
    this.completedOps = [];
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /**
   * Compute the effective intelligence budget for a country (absolute value).
   */
  _getIntelligenceBudget(country) {
    const spending = country.budget?.intelligenceSpending ?? 0;
    const gdp = country.gdp ?? 0;
    return spending * gdp;
  }

  /**
   * Generate a unique operation id.
   */
  _generateOpId() {
    return nextOperationId++;
  }

  // ---------------------------------------------------------------------------
  // Monthly update
  // ---------------------------------------------------------------------------

  monthlyUpdate(date) {
    this._updateAgentCounts();
    this._processOperations(date);
    this._passiveCounterIntelligence(date);
  }

  /**
   * Slowly grow or shrink agent counts toward a level proportional to
   * intelligence budget. Countries with higher budgets can support more agents.
   */
  _updateAgentCounts() {
    for (const [, country] of this.engine.countries) {
      const budget = this._getIntelligenceBudget(country);

      // Target agent count is a function of budget — each billion supports ~10 agents, capped at 100
      const targetAgents = clamp(Math.floor((budget / 1e9) * 10), 0, 100);
      const current = country.agentCount ?? 0;

      if (current < targetAgents) {
        // Recruit: grow by 1-3 per month depending on gap
        const growth = clamp(Math.ceil((targetAgents - current) * 0.15), 1, 3);
        country.agentCount = clamp(current + growth, 0, 100);
      } else if (current > targetAgents) {
        // Shrink: lose 1-2 per month
        const loss = clamp(Math.ceil((current - targetAgents) * 0.1), 1, 2);
        country.agentCount = clamp(current - loss, 0, 100);
      }
    }
  }

  /**
   * Process all active operations: tick durations, resolve completions.
   */
  _processOperations(date) {
    const stillActive = [];

    for (const op of this.operations) {
      op.remainingDuration--;

      if (op.remainingDuration <= 0) {
        this._resolveOperation(op, date);
      } else {
        stillActive.push(op);
      }
    }

    this.operations = stillActive;
  }

  /**
   * When an operation finishes, determine success or failure and apply effects.
   */
  _resolveOperation(op, date) {
    const attacker = this.engine.getCountry(op.fromId);
    const target = op.targetId ? this.engine.getCountry(op.targetId) : null;
    const opDef = OPERATIONS[op.type];

    // Counter-espionage targets self, no opposed roll needed
    if (op.type === 'counter_espionage') {
      this._applyCounterEspionage(attacker, op);
      op.result = 'success';
      op.completedDate = { ...date };
      this.completedOps.push(op);
      this.engine.notify(
        `${opDef.name}: контрразведка усилена для ${attacker.name}`,
        'espionage',
        op.fromId
      );
      return;
    }

    // Calculate success chance
    const attackerBudget = this._getIntelligenceBudget(attacker);
    const attackerAgents = attacker.agentCount ?? 0;
    const targetCounterIntel = target?.counterintelligence ?? 50;
    const targetBudget = target ? this._getIntelligenceBudget(target) : 0;

    const attackPower = attackerAgents * 0.5 + (attackerBudget / 1e9) * 0.3;
    const defensePower = targetCounterIntel * 0.8 + (targetBudget / 1e9) * 0.2;

    // Avoid division by zero; if defense is 0, operation auto-succeeds
    const successChance = defensePower > 0
      ? clamp(attackPower / defensePower, 0.05, 0.95)
      : 0.95;

    const roll = Math.random();

    if (roll < successChance) {
      // Success
      this._applySuccessEffects(op, attacker, target, date);
      op.result = 'success';
      op.completedDate = { ...date };
      this.completedOps.push(op);

      this.engine.notify(
        `${opDef.name} против ${target.name}: операция успешна!`,
        'espionage',
        op.fromId
      );
    } else {
      // Failure
      const caught = Math.random() < opDef.risk;
      op.result = caught ? 'caught' : 'failed';
      op.completedDate = { ...date };
      this.completedOps.push(op);

      if (caught) {
        this._applyCaughtConsequences(op, attacker, target, date);
      } else {
        // Operation simply failed, agent returns safely
        this.engine.notify(
          `${opDef.name} против ${target.name}: операция провалена.`,
          'espionage',
          op.fromId
        );
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Success effects
  // ---------------------------------------------------------------------------

  _applySuccessEffects(op, attacker, target, date) {
    switch (op.type) {
      case 'sabotage':
        this._applySabotage(target);
        break;
      case 'steal_tech':
        this._applyStealTech(attacker, target);
        break;
      case 'destabilize':
        this._applyDestabilize(target);
        break;
      case 'coup':
        this._applyCoup(attacker, target, date);
        break;
      case 'intelligence':
        this._applyIntelligence(attacker, target);
        break;
      case 'propaganda':
        this._applyPropaganda(attacker, target);
        break;
      default:
        break;
    }
  }

  /**
   * Sabotage: temporarily reduce target GDP by 1-3%.
   */
  _applySabotage(target) {
    const reduction = randRange(0.01, 0.03);
    if (target.gdp != null) {
      target.gdp *= (1 - reduction);
    }
    // If the target has an industrial output modifier, reduce it as well
    if (target.industryModifier != null) {
      target.industryModifier = clamp(target.industryModifier - reduction, -1, 1);
    }
  }

  /**
   * Steal tech: give 50% progress on target's current research to the attacker.
   */
  _applyStealTech(attacker, target) {
    const researchSystem = this.engine.getSystem('research');
    if (researchSystem && typeof researchSystem.stealProgress === 'function') {
      researchSystem.stealProgress(attacker.id, target.id, 0.5);
    } else {
      // Fallback: directly copy research progress if available on the country
      if (target.currentResearch && attacker.researchProgress != null) {
        const stolen = (target.researchProgress ?? 0) * 0.5;
        attacker.researchProgress = (attacker.researchProgress ?? 0) + stolen;
      }
    }
  }

  /**
   * Destabilize: reduce target stability by 5-15 points.
   */
  _applyDestabilize(target) {
    const drop = randRange(5, 15);
    if (target.stability != null) {
      target.stability = clamp(target.stability - drop, 0, 100);
    }
    // Also slightly reduce approval
    if (target.approval != null) {
      target.approval = clamp(target.approval - randRange(2, 5), 0, 100);
    }
  }

  /**
   * Coup: if target stability < 30, attempt regime change.
   */
  _applyCoup(attacker, target, date) {
    if (target.stability != null && target.stability < 30) {
      // Successful coup — change government
      const previousGov = target.government;
      target.government = 'transitional';
      target.stability = clamp(target.stability - 20, 0, 100);
      if (target.approval != null) {
        target.approval = clamp(target.approval - 20, 0, 100);
      }

      this.engine.notify(
        `Переворот в ${target.name}! Правительство (${previousGov}) свергнуто.`,
        'critical',
        target.id
      );

      this.engine.events.emit('coup', {
        targetId: target.id,
        attackerId: attacker.id,
        previousGovernment: previousGov,
        date: { ...date },
      });
    } else {
      // Coup attempted but country is too stable — partial destabilization instead
      if (target.stability != null) {
        target.stability = clamp(target.stability - randRange(5, 10), 0, 100);
      }
      this.engine.notify(
        `Попытка переворота в ${target.name} не удалась, но страна дестабилизирована.`,
        'espionage',
        target.id
      );
    }
  }

  /**
   * Intelligence: reveal all stats of target to the player.
   */
  _applyIntelligence(attacker, target) {
    // Mark target as having revealed intelligence for the attacker
    if (!attacker.revealedCountries) {
      attacker.revealedCountries = new Set();
    }
    attacker.revealedCountries.add(target.id);

    this.engine.events.emit('intelligenceRevealed', {
      observerId: attacker.id,
      targetId: target.id,
      data: {
        gdp: target.gdp,
        stability: target.stability,
        approval: target.approval,
        agentCount: target.agentCount,
        counterintelligence: target.counterintelligence,
        military: target.military,
        nukes: target.nukes,
        government: target.government,
      },
    });
  }

  /**
   * Propaganda: reduce target approval by 3-8 points, increase own by a smaller amount.
   */
  _applyPropaganda(attacker, target) {
    const targetDrop = randRange(3, 8);
    const selfBoost = randRange(1, 4);

    if (target.approval != null) {
      target.approval = clamp(target.approval - targetDrop, 0, 100);
    }
    if (attacker.approval != null) {
      attacker.approval = clamp(attacker.approval + selfBoost, 0, 100);
    }
  }

  /**
   * Counter-espionage: boost counterintelligence temporarily.
   */
  _applyCounterEspionage(country, op) {
    const boost = randRange(10, 20);
    if (country.counterintelligence != null) {
      country.counterintelligence = clamp(country.counterintelligence + boost, 0, 100);
    } else {
      country.counterintelligence = clamp(50 + boost, 0, 100);
    }
  }

  // ---------------------------------------------------------------------------
  // Detection and consequences
  // ---------------------------------------------------------------------------

  /**
   * Caught agent: relations drop, diplomatic incident, agent lost.
   */
  _applyCaughtConsequences(op, attacker, target, date) {
    const opDef = OPERATIONS[op.type];

    // Lose an agent
    if (attacker.agentCount != null) {
      attacker.agentCount = clamp(attacker.agentCount - 1, 0, 100);
    }

    // Relations drop by 20-40 points
    const relationsDrop = randRange(20, 40);
    const diplomacySystem = this.engine.getSystem('diplomacy');
    if (diplomacySystem && typeof diplomacySystem.modifyRelations === 'function') {
      diplomacySystem.modifyRelations(op.fromId, op.targetId, -relationsDrop);
    } else {
      // Fallback: directly modify relations on countries if available
      if (target.relations && target.relations[op.fromId] != null) {
        target.relations[op.fromId] = clamp(target.relations[op.fromId] - relationsDrop, -100, 100);
      }
      if (attacker.relations && attacker.relations[op.targetId] != null) {
        attacker.relations[op.targetId] = clamp(attacker.relations[op.targetId] - relationsDrop, -100, 100);
      }
    }

    // Check if target is an ally — if so, alliance may break
    if (diplomacySystem && typeof diplomacySystem.isAllied === 'function') {
      if (diplomacySystem.isAllied(op.fromId, op.targetId)) {
        // High chance alliance breaks when caught spying on an ally
        if (Math.random() < 0.6) {
          if (typeof diplomacySystem.breakAlliance === 'function') {
            diplomacySystem.breakAlliance(op.fromId, op.targetId);
          }
          this.engine.notify(
            `Дипломатический скандал! Альянс с ${target.name} разорван из-за пойманного агента.`,
            'critical',
            op.fromId
          );
        }
      }
    }

    // Public scandal: attacker also loses some approval
    if (attacker.approval != null) {
      const approvalLoss = randRange(2, 6);
      attacker.approval = clamp(attacker.approval - approvalLoss, 0, 100);
    }

    this.engine.notify(
      `${opDef.name} против ${target.name}: агент пойман! Дипломатический инцидент.`,
      'critical',
      op.fromId
    );

    this.engine.events.emit('agentCaught', {
      attackerId: op.fromId,
      targetId: op.targetId,
      operationType: op.type,
      relationsDrop,
      date: { ...date },
    });
  }

  /**
   * Passive counter-intelligence: each country's CI has a chance to detect
   * ongoing operations targeting them.
   */
  _passiveCounterIntelligence(date) {
    for (const op of this.operations) {
      if (op.type === 'counter_espionage') continue; // Self-targeted, skip

      const target = this.engine.getCountry(op.targetId);
      if (!target) continue;

      const counterIntel = target.counterintelligence ?? 50;
      const opDef = OPERATIONS[op.type];

      // Detection chance per month: base from counterintel level, modified by op risk
      const detectionChance = (counterIntel / 100) * opDef.risk * 0.3;

      if (Math.random() < detectionChance) {
        // Detected! Country is alerted but doesn't necessarily know who
        const attacker = this.engine.getCountry(op.fromId);

        // 50% chance they identify the attacker
        if (Math.random() < 0.5 && attacker) {
          op.detected = true;
          op.detectedBy = op.targetId;

          this.engine.notify(
            `Контрразведка ${target.name} обнаружила операцию "${opDef.name}" из ${attacker.name}!`,
            'espionage',
            op.targetId
          );

          // Moderate relations penalty for being discovered (less than being caught)
          const relationsDrop = randRange(5, 15);
          const diplomacySystem = this.engine.getSystem('diplomacy');
          if (diplomacySystem && typeof diplomacySystem.modifyRelations === 'function') {
            diplomacySystem.modifyRelations(op.fromId, op.targetId, -relationsDrop);
          }
        } else {
          // They know something is happening but not who
          this.engine.notify(
            `Контрразведка ${target.name} обнаружила подозрительную деятельность.`,
            'espionage',
            op.targetId
          );
        }

        // Boost target counterintel slightly from vigilance
        if (target.counterintelligence != null) {
          target.counterintelligence = clamp(target.counterintelligence + 2, 0, 100);
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Player actions
  // ---------------------------------------------------------------------------

  /**
   * Launch an espionage operation from one country against another.
   * @param {string} fromId - Country launching the operation
   * @param {string} targetId - Target country (null for counter_espionage on self)
   * @param {string} operationType - Key from OPERATIONS
   * @returns {{ success: boolean, operation?: object, reason?: string }}
   */
  launchOperation(fromId, targetId, operationType) {
    const opDef = OPERATIONS[operationType];
    if (!opDef) {
      return { success: false, reason: 'Неизвестный тип операции' };
    }

    const attacker = this.engine.getCountry(fromId);
    if (!attacker) {
      return { success: false, reason: 'Страна-инициатор не найдена' };
    }

    // Counter-espionage targets self
    const effectiveTarget = operationType === 'counter_espionage' ? fromId : targetId;

    if (operationType !== 'counter_espionage') {
      const target = this.engine.getCountry(targetId);
      if (!target) {
        return { success: false, reason: 'Страна-цель не найдена' };
      }
      if (fromId === targetId) {
        return { success: false, reason: 'Нельзя проводить операцию против себя' };
      }
    }

    // Check agent availability — need at least 1 agent not on a mission
    const agentsOnMissions = this.operations.filter(op => op.fromId === fromId).length;
    const availableAgents = (attacker.agentCount ?? 0) - agentsOnMissions;

    if (availableAgents < 1) {
      return { success: false, reason: 'Нет доступных агентов' };
    }

    // Check budget — cost is in billions
    const budget = this._getIntelligenceBudget(attacker);
    const costInDollars = opDef.cost * 1e9;

    if (budget < costInDollars) {
      return { success: false, reason: 'Недостаточный бюджет разведки' };
    }

    const operation = {
      id: this._generateOpId(),
      fromId,
      targetId: effectiveTarget,
      type: operationType,
      name: opDef.name,
      cost: opDef.cost,
      totalDuration: opDef.duration,
      remainingDuration: opDef.duration,
      risk: opDef.risk,
      detected: false,
      detectedBy: null,
      result: null,
      launchDate: { ...this.engine.date },
      completedDate: null,
    };

    this.operations.push(operation);

    this.engine.events.emit('operationLaunched', {
      operationId: operation.id,
      fromId,
      targetId: effectiveTarget,
      type: operationType,
    });

    return { success: true, operation };
  }

  /**
   * Cancel an active operation by its id.
   * @param {number} operationId
   * @returns {{ success: boolean, reason?: string }}
   */
  cancelOperation(operationId) {
    const idx = this.operations.findIndex(op => op.id === operationId);
    if (idx === -1) {
      return { success: false, reason: 'Операция не найдена' };
    }

    const op = this.operations[idx];
    op.result = 'cancelled';
    op.completedDate = { ...this.engine.date };
    this.completedOps.push(op);
    this.operations.splice(idx, 1);

    this.engine.events.emit('operationCancelled', {
      operationId: op.id,
      fromId: op.fromId,
      targetId: op.targetId,
      type: op.type,
    });

    return { success: true };
  }

  /**
   * Spend extra resources to temporarily boost a country's counter-intelligence.
   * This is a shorthand that launches a counter_espionage operation on self.
   * @param {string} countryId
   * @returns {{ success: boolean, operation?: object, reason?: string }}
   */
  boostCounterintel(countryId) {
    return this.launchOperation(countryId, countryId, 'counter_espionage');
  }

  /**
   * Get all active operations launched by a given country.
   * @param {string} countryId
   * @returns {Array<object>}
   */
  getActiveOperations(countryId) {
    return this.operations.filter(op => op.fromId === countryId);
  }

  /**
   * Get all active operations targeting a given country.
   * @param {string} countryId
   * @returns {Array<object>}
   */
  getOperationsAgainst(countryId) {
    return this.operations.filter(op => op.targetId === countryId);
  }

  /**
   * Get completed operations history for a country (as attacker).
   * @param {string} countryId
   * @returns {Array<object>}
   */
  getCompletedOperations(countryId) {
    return this.completedOps.filter(op => op.fromId === countryId);
  }

  /**
   * Get the static operation definitions.
   * @returns {object}
   */
  getOperationTypes() {
    return { ...OPERATIONS };
  }
}
