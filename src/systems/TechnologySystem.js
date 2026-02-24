import { clamp } from '../engine/utils.js';

export class TechnologySystem {
  constructor() {
    this.engine = null;
    this.techTree = {};
  }

  get name() {
    return 'technology';
  }

  init() {
    this.techTree = {
      military: [
        { id: 'advanced_firearms', name: 'Совр. стрелковое оружие', cost: 50, requires: [], effects: { infantry_power: 1.1 }, tier: 1 },
        { id: 'composite_armor', name: 'Композитная броня', cost: 80, requires: ['advanced_firearms'], effects: { armor_power: 1.15 }, tier: 2 },
        { id: 'stealth_tech', name: 'Стелс-технологии', cost: 150, requires: ['composite_armor'], effects: { air_power: 1.3 }, tier: 3 },
        { id: 'hypersonic_missiles', name: 'Гиперзвуковые ракеты', cost: 200, requires: ['stealth_tech'], effects: { missile_power: 1.5 }, tier: 4 },
        { id: 'cyber_warfare', name: 'Кибервооружения', cost: 120, requires: [], effects: { espionage_bonus: 1.2, military_power: 1.05 }, tier: 2 },
        { id: 'drone_warfare', name: 'Беспилотные системы', cost: 100, requires: ['advanced_firearms'], effects: { air_power: 1.2, infantry_power: 1.1 }, tier: 2 },
        { id: 'missile_defense', name: 'ПРО', cost: 180, requires: ['hypersonic_missiles'], effects: { defense_bonus: 1.3 }, tier: 4 },
        { id: 'space_weapons', name: 'Космическое оружие', cost: 300, requires: ['missile_defense', 'cyber_warfare'], effects: { military_power: 1.2 }, tier: 5 },
      ],
      civilian: [
        { id: 'renewable_energy', name: 'Возобновляемая энергетика', cost: 60, requires: [], effects: { gdp_bonus: 1.02, stability: 1.05 }, tier: 1 },
        { id: 'biotech', name: 'Биотехнологии', cost: 100, requires: ['renewable_energy'], effects: { health_bonus: 1.1, gdp_bonus: 1.03 }, tier: 2 },
        { id: 'quantum_computing', name: 'Квантовые компьютеры', cost: 200, requires: ['biotech'], effects: { research_speed: 1.3, gdp_bonus: 1.05 }, tier: 3 },
        { id: 'advanced_medicine', name: 'Передовая медицина', cost: 80, requires: [], effects: { health_bonus: 1.15, population_growth: 1.02 }, tier: 1 },
        { id: 'education_tech', name: 'Обр. технологии', cost: 50, requires: [], effects: { literacy_bonus: 1.1, research_speed: 1.1 }, tier: 1 },
        { id: 'space_program', name: 'Космическая программа', cost: 250, requires: ['quantum_computing'], effects: { prestige: 1.2, tech_bonus: 1.1 }, tier: 4 },
      ],
      industrial: [
        { id: 'automation', name: 'Автоматизация', cost: 70, requires: [], effects: { industry_output: 1.15, unemployment: 1.05 }, tier: 1 },
        { id: 'advanced_materials', name: 'Новые материалы', cost: 90, requires: ['automation'], effects: { industry_output: 1.1, military_equipment: 1.1 }, tier: 2 },
        { id: 'robotics', name: 'Робототехника', cost: 130, requires: ['automation'], effects: { industry_output: 1.2, unemployment: 1.1 }, tier: 2 },
        { id: 'nanotech', name: 'Нанотехнологии', cost: 200, requires: ['advanced_materials', 'robotics'], effects: { industry_output: 1.25, gdp_bonus: 1.05 }, tier: 3 },
        { id: 'nuclear_energy', name: 'Ядерная энергетика', cost: 120, requires: [], effects: { industry_output: 1.1, gdp_bonus: 1.03 }, tier: 1 },
        { id: 'green_industry', name: 'Зелёная промышленность', cost: 100, requires: ['renewable_energy'], effects: { stability: 1.05, gdp_bonus: 1.02 }, tier: 2 },
      ],
      digital: [
        { id: 'internet_infra', name: 'Интернет-инфраструктура', cost: 40, requires: [], effects: { services_output: 1.1, gdp_bonus: 1.02 }, tier: 1 },
        { id: 'ai_basic', name: 'Базовый ИИ', cost: 80, requires: ['internet_infra'], effects: { research_speed: 1.15, services_output: 1.1 }, tier: 2 },
        { id: 'big_data', name: 'Большие данные', cost: 60, requires: ['internet_infra'], effects: { espionage_bonus: 1.1, services_output: 1.05 }, tier: 1 },
        { id: 'ai_advanced', name: 'Продвинутый ИИ', cost: 180, requires: ['ai_basic', 'big_data'], effects: { gdp_bonus: 1.08, research_speed: 1.2 }, tier: 3 },
        { id: 'blockchain', name: 'Блокчейн', cost: 50, requires: ['internet_infra'], effects: { corruption_reduction: 1.05, services_output: 1.03 }, tier: 1 },
        { id: 'digital_governance', name: 'Цифровое управление', cost: 100, requires: ['big_data', 'blockchain'], effects: { corruption_reduction: 1.1, stability: 1.05 }, tier: 2 },
      ]
    };

    // Initialize tech tracking for all countries
    for (const [, country] of this.engine.countries) {
      this._initCountryTech(country);
    }

    // Listen for new countries being added
    this.engine.events.on('countryAdded', (country) => {
      this._initCountryTech(country);
    });
  }

  /**
   * Initialize technology tracking properties on a country.
   */
  _initCountryTech(country) {
    if (!country.researchedTechs) {
      country.researchedTechs = new Set();
    }
    if (!country.currentResearch) {
      country.currentResearch = null;
    }
    if (!country.techLevel) {
      country.techLevel = { military: 0, civilian: 0, industrial: 0, digital: 0 };
    }
  }

  // ---------------------------------------------------------------------------
  // Monthly update -- core research progression
  // ---------------------------------------------------------------------------

  monthlyUpdate(date) {
    for (const [countryId, country] of this.engine.countries) {
      this._initCountryTech(country);

      // AI countries auto-pick research when idle
      if (countryId !== this.engine.playerCountryId && !country.currentResearch) {
        this._aiPickResearch(country, countryId);
      }

      // Process active research
      if (country.currentResearch) {
        this._advanceResearch(country, countryId);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Research progression helpers
  // ---------------------------------------------------------------------------

  /**
   * Calculate the effective research speed multiplier for a country.
   * Influenced by literacy, digital tech level, and already-researched techs
   * that grant research_speed bonuses.
   */
  _getResearchSpeed(country) {
    let speed = 1.0;

    // Literacy bonus (assume 0-1 range, default 0.5)
    const literacy = country.literacy != null ? country.literacy : 0.5;
    speed *= 0.5 + literacy; // range 0.5 - 1.5

    // Digital tech level bonus (0-100 scaled to 1.0 - 1.5)
    const digitalLevel = (country.techLevel && country.techLevel.digital) || 0;
    speed *= 1 + digitalLevel / 200; // 0 => 1.0, 100 => 1.5

    // Bonuses from already-researched techs that affect research_speed
    for (const techId of country.researchedTechs) {
      const tech = this._findTech(techId);
      if (tech && tech.effects && tech.effects.research_speed) {
        speed *= tech.effects.research_speed;
      }
    }

    return speed;
  }

  /**
   * Advance current research for a country by one month of progress.
   */
  _advanceResearch(country, countryId) {
    const research = country.currentResearch;
    const tech = this._findTech(research.techId);
    if (!tech) {
      // Tech not found -- clear corrupt state
      country.currentResearch = null;
      return;
    }

    const gdp = country.gdp || 1e9;
    const scienceSpending = (country.budget && country.budget.scienceSpending) || 0.01;
    const researchSpeed = this._getResearchSpeed(country);

    // Progress formula: research investment relative to tech cost.
    // scienceSpending * gdp gives absolute monthly research budget in $.
    // Normalise by cost (in abstract research-points, scaled to billions).
    const investment = scienceSpending * gdp;
    const costNormalized = tech.cost * 1e9; // scale cost into dollar-equivalent
    const progressIncrement = (researchSpeed * investment / costNormalized) * 100;

    research.progress = clamp(research.progress + progressIncrement, 0, 100);

    if (research.progress >= 100) {
      this._completeResearch(country, countryId, tech, research.branch);
    }
  }

  /**
   * Mark a tech as researched, apply its effects, and emit notifications.
   */
  _completeResearch(country, countryId, tech, branch) {
    country.researchedTechs.add(tech.id);
    country.currentResearch = null;

    // Update the country's tech level for the corresponding branch
    this._recalcTechLevel(country, branch);

    // Apply immediate effects
    this._applyTechEffects(country, tech);

    // Notify
    this.engine.notify(
      `${country.name}: исследование "${tech.name}" завершено!`,
      'technology',
      countryId
    );

    this.engine.events.emit('techResearched', {
      countryId,
      techId: tech.id,
      branch,
      tech
    });
  }

  /**
   * Recalculate a branch's tech level (0-100) based on the fraction of that
   * branch's technologies that have been researched.
   */
  _recalcTechLevel(country, branch) {
    const branchTechs = this.techTree[branch];
    if (!branchTechs || branchTechs.length === 0) return;

    let researched = 0;
    for (const tech of branchTechs) {
      if (country.researchedTechs.has(tech.id)) {
        researched++;
      }
    }

    country.techLevel[branch] = clamp(
      Math.round((researched / branchTechs.length) * 100),
      0,
      100
    );
  }

  /**
   * Apply a completed tech's effects to the country (persistent modifiers).
   * Effects are stored as multipliers on the country so other systems can read them.
   */
  _applyTechEffects(country, tech) {
    if (!tech.effects) return;

    if (!country.techEffects) {
      country.techEffects = {};
    }

    for (const [key, multiplier] of Object.entries(tech.effects)) {
      if (!country.techEffects[key]) {
        country.techEffects[key] = 1.0;
      }
      country.techEffects[key] *= multiplier;
    }
  }

  // ---------------------------------------------------------------------------
  // AI research selection
  // ---------------------------------------------------------------------------

  /**
   * Automatically pick the next research target for an AI-controlled country.
   * Strategy: prioritise the branch that is weakest relative to the country's
   * needs, then choose the cheapest available tech in that branch.
   */
  _aiPickResearch(country, countryId) {
    // Determine branch priority weights based on country characteristics
    const weights = this._aiCalcBranchWeights(country);

    // Sort branches by weight (descending -- highest priority first)
    const sortedBranches = Object.keys(weights).sort(
      (a, b) => weights[b] - weights[a]
    );

    // Try each branch in priority order, pick cheapest available tech
    for (const branch of sortedBranches) {
      const available = this._getAvailableTechsForBranch(country, branch);
      if (available.length === 0) continue;

      // Sort by tier then cost -- prefer lower tier, then cheaper
      available.sort((a, b) => a.tier - b.tier || a.cost - b.cost);

      const chosen = available[0];
      country.currentResearch = {
        techId: chosen.id,
        branch,
        progress: 0
      };
      return;
    }
    // No tech available in any branch -- nothing to research
  }

  /**
   * Calculate priority weights for each branch for an AI country.
   */
  _aiCalcBranchWeights(country) {
    const techLevel = country.techLevel || { military: 0, civilian: 0, industrial: 0, digital: 0 };
    const weights = {
      military: 1.0,
      civilian: 1.0,
      industrial: 1.0,
      digital: 1.0
    };

    // Countries with high military spending or low stability lean military
    const milSpending = (country.budget && country.budget.militarySpending) || 0;
    if (milSpending > 0.03) weights.military += 0.5;

    const stability = country.stability != null ? country.stability : 50;
    if (stability < 40) weights.military += 0.3;

    // Countries with low GDP per capita lean industrial / civilian
    const gdpPerCapita = country.gdp && country.population
      ? country.gdp / country.population
      : 10000;
    if (gdpPerCapita < 5000) {
      weights.industrial += 0.5;
      weights.civilian += 0.3;
    }

    // Under-developed branches get a boost so AI diversifies
    for (const branch of Object.keys(weights)) {
      const level = techLevel[branch] || 0;
      weights[branch] += (100 - level) / 100; // 0-1 boost for underdeveloped
    }

    // Digital is a general booster -- always slightly attractive
    weights.digital += 0.2;

    return weights;
  }

  // ---------------------------------------------------------------------------
  // Player actions
  // ---------------------------------------------------------------------------

  /**
   * Begin researching a specific technology.
   * @param {string} countryId
   * @param {string} branch - one of 'military', 'civilian', 'industrial', 'digital'
   * @param {string} techId
   * @returns {{ success: boolean, reason?: string }}
   */
  startResearch(countryId, branch, techId) {
    const country = this.engine.getCountry(countryId);
    if (!country) {
      return { success: false, reason: 'Страна не найдена' };
    }

    this._initCountryTech(country);

    // Validate branch
    if (!this.techTree[branch]) {
      return { success: false, reason: 'Неизвестная ветка исследований' };
    }

    // Find the tech in the branch
    const tech = this.techTree[branch].find(t => t.id === techId);
    if (!tech) {
      return { success: false, reason: 'Технология не найдена в данной ветке' };
    }

    // Already researched?
    if (country.researchedTechs.has(techId)) {
      return { success: false, reason: 'Технология уже исследована' };
    }

    // Already researching something?
    if (country.currentResearch) {
      return { success: false, reason: 'Уже ведётся другое исследование. Сначала отмените текущее.' };
    }

    // Check prerequisites
    for (const reqId of tech.requires) {
      if (!country.researchedTechs.has(reqId)) {
        const reqTech = this._findTech(reqId);
        const reqName = reqTech ? reqTech.name : reqId;
        return { success: false, reason: `Необходимо сначала исследовать: ${reqName}` };
      }
    }

    // All checks passed -- start research
    country.currentResearch = {
      techId,
      branch,
      progress: 0
    };

    this.engine.events.emit('researchStarted', {
      countryId,
      techId,
      branch,
      tech
    });

    return { success: true };
  }

  /**
   * Cancel the current research for a country.
   * @param {string} countryId
   * @returns {{ success: boolean, reason?: string }}
   */
  cancelResearch(countryId) {
    const country = this.engine.getCountry(countryId);
    if (!country) {
      return { success: false, reason: 'Страна не найдена' };
    }

    if (!country.currentResearch) {
      return { success: false, reason: 'Нет активного исследования' };
    }

    const cancelled = { ...country.currentResearch };
    country.currentResearch = null;

    this.engine.events.emit('researchCancelled', {
      countryId,
      techId: cancelled.techId,
      branch: cancelled.branch,
      progress: cancelled.progress
    });

    return { success: true };
  }

  /**
   * Return a list of technologies that the country can begin researching.
   * A tech is available if:
   *   - It has not been researched yet
   *   - All its prerequisite techs have been researched
   *   - It is not currently being researched
   * @param {string} countryId
   * @returns {Array<{ branch: string, tech: object }>}
   */
  getAvailableTechs(countryId) {
    const country = this.engine.getCountry(countryId);
    if (!country) return [];

    this._initCountryTech(country);

    const available = [];

    for (const branch of Object.keys(this.techTree)) {
      const branchAvailable = this._getAvailableTechsForBranch(country, branch);
      for (const tech of branchAvailable) {
        available.push({ branch, tech });
      }
    }

    return available;
  }

  // ---------------------------------------------------------------------------
  // Tech espionage integration
  // ---------------------------------------------------------------------------

  /**
   * Apply a stolen technology to a country, granting 50% research progress.
   * If the country is not currently researching that tech, it starts a new
   * research entry at 50% progress. If already researching it, adds 50%.
   * @param {string} countryId
   * @param {string} techId
   * @returns {{ success: boolean, reason?: string }}
   */
  applyStolenTech(countryId, techId) {
    const country = this.engine.getCountry(countryId);
    if (!country) {
      return { success: false, reason: 'Страна не найдена' };
    }

    this._initCountryTech(country);

    if (country.researchedTechs.has(techId)) {
      return { success: false, reason: 'Технология уже исследована' };
    }

    const tech = this._findTech(techId);
    if (!tech) {
      return { success: false, reason: 'Технология не найдена' };
    }

    // Determine which branch this tech belongs to
    const branch = this._findTechBranch(techId);

    // Check prerequisites
    for (const reqId of tech.requires) {
      if (!country.researchedTechs.has(reqId)) {
        return { success: false, reason: 'Не выполнены необходимые предпосылки для этой технологии' };
      }
    }

    if (country.currentResearch && country.currentResearch.techId === techId) {
      // Already researching this tech -- add 50% progress
      country.currentResearch.progress = clamp(
        country.currentResearch.progress + 50,
        0,
        100
      );

      // Check if now complete
      if (country.currentResearch.progress >= 100) {
        this._completeResearch(country, countryId, tech, branch);
      }
    } else if (!country.currentResearch) {
      // Not researching anything -- start this tech at 50%
      country.currentResearch = {
        techId,
        branch,
        progress: 50
      };
    } else {
      // Researching something else -- queue stolen progress for when they start it
      if (!country.stolenTechProgress) {
        country.stolenTechProgress = {};
      }
      country.stolenTechProgress[techId] = (country.stolenTechProgress[techId] || 0) + 50;
    }

    this.engine.notify(
      `${country.name}: получены разведданные по технологии "${tech.name}" (+50% прогресса)`,
      'espionage',
      countryId
    );

    this.engine.events.emit('techStolen', {
      countryId,
      techId,
      branch,
      tech
    });

    return { success: true };
  }

  // ---------------------------------------------------------------------------
  // Query helpers
  // ---------------------------------------------------------------------------

  /**
   * Get full research status for a country.
   * @param {string} countryId
   * @returns {object|null}
   */
  getResearchStatus(countryId) {
    const country = this.engine.getCountry(countryId);
    if (!country) return null;

    this._initCountryTech(country);

    const status = {
      techLevel: { ...country.techLevel },
      researchedTechs: [...country.researchedTechs],
      currentResearch: country.currentResearch ? { ...country.currentResearch } : null,
      researchSpeed: this._getResearchSpeed(country),
      estimatedMonths: null
    };

    // Estimate months to complete current research
    if (country.currentResearch) {
      const tech = this._findTech(country.currentResearch.techId);
      if (tech) {
        const gdp = country.gdp || 1e9;
        const scienceSpending = (country.budget && country.budget.scienceSpending) || 0.01;
        const researchSpeed = this._getResearchSpeed(country);
        const investment = scienceSpending * gdp;
        const costNormalized = tech.cost * 1e9;
        const monthlyProgress = (researchSpeed * investment / costNormalized) * 100;

        if (monthlyProgress > 0) {
          const remaining = 100 - country.currentResearch.progress;
          status.estimatedMonths = Math.ceil(remaining / monthlyProgress);
        }
      }
    }

    return status;
  }

  /**
   * Get all researched techs with their full data for a country.
   * @param {string} countryId
   * @returns {Array<{ branch: string, tech: object }>}
   */
  getResearchedTechs(countryId) {
    const country = this.engine.getCountry(countryId);
    if (!country) return [];

    this._initCountryTech(country);

    const result = [];
    for (const techId of country.researchedTechs) {
      const branch = this._findTechBranch(techId);
      const tech = this._findTech(techId);
      if (tech && branch) {
        result.push({ branch, tech });
      }
    }
    return result;
  }

  /**
   * Get the aggregated tech effect multiplier for a country.
   * @param {string} countryId
   * @param {string} effectKey
   * @returns {number} multiplier (1.0 if no effect)
   */
  getTechEffect(countryId, effectKey) {
    const country = this.engine.getCountry(countryId);
    if (!country || !country.techEffects) return 1.0;
    return country.techEffects[effectKey] || 1.0;
  }

  // ---------------------------------------------------------------------------
  // Internal utilities
  // ---------------------------------------------------------------------------

  /**
   * Find a tech definition by id across all branches.
   * @param {string} techId
   * @returns {object|null}
   */
  _findTech(techId) {
    for (const branch of Object.keys(this.techTree)) {
      const tech = this.techTree[branch].find(t => t.id === techId);
      if (tech) return tech;
    }
    return null;
  }

  /**
   * Find which branch a tech belongs to.
   * @param {string} techId
   * @returns {string|null}
   */
  _findTechBranch(techId) {
    for (const branch of Object.keys(this.techTree)) {
      if (this.techTree[branch].some(t => t.id === techId)) {
        return branch;
      }
    }
    return null;
  }

  /**
   * Get available (researchable) techs for a country in a specific branch.
   * @param {object} country
   * @param {string} branch
   * @returns {Array<object>}
   */
  _getAvailableTechsForBranch(country, branch) {
    const branchTechs = this.techTree[branch];
    if (!branchTechs) return [];

    const currentResearchId = country.currentResearch
      ? country.currentResearch.techId
      : null;

    return branchTechs.filter(tech => {
      // Already researched
      if (country.researchedTechs.has(tech.id)) return false;

      // Currently being researched
      if (tech.id === currentResearchId) return false;

      // All prerequisites met
      for (const reqId of tech.requires) {
        if (!country.researchedTechs.has(reqId)) return false;
      }

      return true;
    });
  }
}
