import { clamp } from '../engine/utils.js';

export class DiplomacySystem {
  constructor() {
    this.engine = null;

    // Track war history: Map<string, { startYear, endYear }>
    // Key format: `${countryAId}-${countryBId}` (sorted alphabetically)
    this.warHistory = [];

    // Next alliance ID counter
    this._nextAllianceId = 1;
  }

  // ---------------------------------------------------------------------------
  // System identity
  // ---------------------------------------------------------------------------

  get name() {
    return 'diplomacy';
  }

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------

  init() {
    // Ensure every country has the diplomacy-related properties initialised
    for (const [id, country] of this.engine.countries) {
      if (!country.relations) country.relations = {};
      if (!country.alliances) country.alliances = [];
      if (!country.sanctions) country.sanctions = [];
      if (!country.tradeAgreements) country.tradeAgreements = [];

      // Normalise alliances: if stored as plain strings, convert to objects
      country.alliances = country.alliances.map(a => {
        if (typeof a === 'string') {
          return { id: a.toLowerCase().replace(/\s+/g, '_'), name: a, members: [], type: 'political' };
        }
        return a;
      });

      // Normalise sanctions: ensure they are objects
      country.sanctions = country.sanctions.filter(s => s && typeof s === 'object');
    }

    // Build alliance member lists from country data
    const allianceMembers = new Map();
    for (const [id, country] of this.engine.countries) {
      for (const alliance of country.alliances) {
        if (!allianceMembers.has(alliance.id)) {
          allianceMembers.set(alliance.id, { ...alliance, members: [] });
        }
        allianceMembers.get(alliance.id).members.push(id);
      }
    }
    // Sync members back to each country's alliance objects
    for (const [, country] of this.engine.countries) {
      for (const alliance of country.alliances) {
        const fullAlliance = allianceMembers.get(alliance.id);
        if (fullAlliance) alliance.members = [...fullAlliance.members];
      }
    }

    // Synchronise the global organisations map with alliance data that might
    // already exist on countries (loaded from save / scenario data).
    this._syncOrganizations();
  }

  // ---------------------------------------------------------------------------
  // Monthly update
  // ---------------------------------------------------------------------------

  monthlyUpdate(date) {
    const countries = this.engine.getAllCountries();

    for (const country of countries) {
      this._applyRelationsDrift(country, countries);
      this._applyTradeAgreementRelationsBonus(country);
      this._applyWarRelationsPenalty(country, date);
      this._applySanctionsRelationsPenalty(country);
      this._applyConflictZoneVolatility(country, countries);
      this._applySanctionsEconomicEffects(country);
      this._applyTradeAgreementEconomicEffects(country);
    }
  }

  // ---------------------------------------------------------------------------
  // Relations drift: slowly move towards ideological baseline
  // ---------------------------------------------------------------------------

  _applyRelationsDrift(country, allCountries) {
    for (const other of allCountries) {
      if (other.id === country.id) continue;

      const current = this.getRelation(country.id, other.id);
      const baseline = this._computeIdeologicalBaseline(country, other);

      // Drift 2 % of the gap per month
      const drift = (baseline - current) * 0.02;
      this._adjustRelation(country.id, other.id, drift);
    }
  }

  // ---------------------------------------------------------------------------
  // Trade agreements improve relations +0.5/month
  // ---------------------------------------------------------------------------

  _applyTradeAgreementRelationsBonus(country) {
    for (const agreement of country.tradeAgreements) {
      this._adjustRelation(country.id, agreement.partnerId, 0.5);
    }
  }

  // ---------------------------------------------------------------------------
  // Wars decrease relations with enemy and their allies
  // ---------------------------------------------------------------------------

  _applyWarRelationsPenalty(country, date) {
    // Active wars: look for war history entries without endYear
    for (const war of this.warHistory) {
      if (war.endYear) continue; // already ended

      const isParticipant =
        war.attackerId === country.id || war.defenderId === country.id;
      if (!isParticipant) continue;

      const enemyId =
        war.attackerId === country.id ? war.defenderId : war.attackerId;

      // Direct enemy: -3 per month
      this._adjustRelation(country.id, enemyId, -3);

      // Enemy allies: -1 per month
      const enemy = this.engine.getCountry(enemyId);
      if (enemy && enemy.alliances) {
        for (const alliance of enemy.alliances) {
          for (const memberId of alliance.members) {
            if (memberId !== country.id && memberId !== enemyId) {
              this._adjustRelation(country.id, memberId, -1);
            }
          }
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Sanctions decrease relations
  // ---------------------------------------------------------------------------

  _applySanctionsRelationsPenalty(country) {
    for (const sanction of country.sanctions) {
      // The country being sanctioned loses relations with imposer
      this._adjustRelation(country.id, sanction.imposedBy, -1);
    }

    // Also check sanctions this country has imposed on others
    for (const [, other] of this.engine.countries) {
      if (other.id === country.id) continue;
      for (const sanction of other.sanctions) {
        if (sanction.imposedBy === country.id) {
          this._adjustRelation(country.id, other.id, -0.5);
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Neighboring countries in conflict zones have volatile relations
  // ---------------------------------------------------------------------------

  _applyConflictZoneVolatility(country, allCountries) {
    // If a country's stability is low, neighbours get random relation swings
    if (!country.stability || country.stability > 40) return;
    if (!country.region) return;

    for (const other of allCountries) {
      if (other.id === country.id) continue;
      if (other.region !== country.region) continue;

      // Random swing proportional to instability: -2 to +2
      const swing = (Math.random() - 0.5) * 4 * ((100 - (country.stability || 50)) / 100);
      this._adjustRelation(country.id, other.id, swing);
    }
  }

  // ---------------------------------------------------------------------------
  // Sanctions economic effects
  // ---------------------------------------------------------------------------

  _applySanctionsEconomicEffects(country) {
    if (!country.sanctions || country.sanctions.length === 0) return;

    for (const sanction of country.sanctions) {
      let gdpPenalty = 0;
      let tradePenalty = 0;

      switch (sanction.type) {
        case 'economic':
          gdpPenalty = 0.002;   // -0.2 % GDP growth per month
          tradePenalty = 0.01;  // -1 % trade balance per month
          break;
        case 'arms':
          gdpPenalty = 0.001;
          tradePenalty = 0.005;
          break;
        case 'full':
          gdpPenalty = 0.004;
          tradePenalty = 0.02;
          break;
      }

      if (country.gdp) {
        country.gdp *= (1 - gdpPenalty);
      }
      if (country.tradeBalance !== undefined) {
        country.tradeBalance -= (country.gdp || 0) * tradePenalty;
      }

      // Imposer also takes a small hit
      const imposer = this.engine.getCountry(sanction.imposedBy);
      if (imposer && imposer.gdp) {
        imposer.gdp *= (1 - gdpPenalty * 0.2);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Trade agreement economic effects
  // ---------------------------------------------------------------------------

  _applyTradeAgreementEconomicEffects(country) {
    if (!country.tradeAgreements || country.tradeAgreements.length === 0) return;

    for (const agreement of country.tradeAgreements) {
      const partner = this.engine.getCountry(agreement.partnerId);
      if (!partner) continue;

      const bonus = agreement.bonus || 0.1;

      // Boost trade balance for both parties monthly
      // Magnitude is proportional to the smaller GDP
      const smallerGdp = Math.min(country.gdp || 0, partner.gdp || 0);
      const monthlyBoost = smallerGdp * bonus * 0.001; // 0.1 % of smaller GDP * bonus

      if (country.tradeBalance !== undefined) {
        country.tradeBalance += monthlyBoost;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Relation helpers
  // ---------------------------------------------------------------------------

  getRelation(countryAId, countryBId) {
    const country = this.engine.getCountry(countryAId);
    if (!country || !country.relations) return 0;
    return country.relations[countryBId] || 0;
  }

  setRelation(countryAId, countryBId, value) {
    const clamped = clamp(value, -100, 100);

    const a = this.engine.getCountry(countryAId);
    const b = this.engine.getCountry(countryBId);

    if (a) {
      if (!a.relations) a.relations = {};
      a.relations[countryBId] = clamped;
    }
    if (b) {
      if (!b.relations) b.relations = {};
      b.relations[countryAId] = clamped;
    }
  }

  _adjustRelation(countryAId, countryBId, delta) {
    const current = this.getRelation(countryAId, countryBId);
    this.setRelation(countryAId, countryBId, current + delta);
  }

  // ---------------------------------------------------------------------------
  // Relation modifiers / baseline computation
  // ---------------------------------------------------------------------------

  _computeIdeologicalBaseline(countryA, countryB) {
    let baseline = 0;

    // 1. Ideological similarity (-40 to +40)
    baseline += this._ideologicalSimilarity(countryA, countryB);

    // 2. Trade volume bonus (0 to +15)
    baseline += this._tradeVolumeBonus(countryA, countryB);

    // 3. Alliance membership bonus (0 to +25)
    baseline += this._allianceMembershipBonus(countryA, countryB);

    // 4. War history penalty (0 to -40, decays over years)
    baseline += this._warHistoryPenalty(countryA.id, countryB.id);

    // 5. Cultural/regional proximity (0 to +10)
    baseline += this._regionalProximityBonus(countryA, countryB);

    return clamp(baseline, -100, 100);
  }

  /**
   * Compare ideology.democracy and ideology.economy.
   * Each ranges 0-100. If both are similar, high positive; if opposite, negative.
   * Returns -40 to +40.
   */
  _ideologicalSimilarity(a, b) {
    const aIdeology = a.ideology || {};
    const bIdeology = b.ideology || {};

    const demA = aIdeology.democracy ?? 50;
    const demB = bIdeology.democracy ?? 50;
    const ecoA = aIdeology.economy ?? 50;
    const ecoB = bIdeology.economy ?? 50;

    // Distance 0 = perfect match -> +40; distance 100 = polar opposite -> -40
    const demDist = Math.abs(demA - demB) / 100;
    const ecoDist = Math.abs(ecoA - ecoB) / 100;
    const avgDist = (demDist + ecoDist) / 2;

    return 40 - avgDist * 80; // 0 dist -> +40, 1 dist -> -40
  }

  /**
   * More trade = better relations. +0 to +15.
   */
  _tradeVolumeBonus(a, b) {
    // Use trade agreements as a proxy for trade volume
    const hasAgreement = (a.tradeAgreements || []).some(
      (t) => t.partnerId === b.id
    );
    if (hasAgreement) return 15;

    // If no agreement, minor bonus if they share an economic alliance
    const sharedEconAlliance = this._shareAllianceOfType(a, b, 'economic');
    if (sharedEconAlliance) return 5;

    return 0;
  }

  /**
   * Being in the same alliance = +relations. Up to +25 for multiple alliances.
   */
  _allianceMembershipBonus(a, b) {
    let bonus = 0;
    for (const alliance of a.alliances || []) {
      if (alliance.members.includes(b.id)) {
        bonus += alliance.type === 'military' ? 15 : 10;
      }
    }
    return Math.min(bonus, 25);
  }

  /**
   * Recent wars = penalty. Decays over 20 years. 0 to -40.
   */
  _warHistoryPenalty(aId, bId) {
    let worstPenalty = 0;
    const currentYear = this.engine.date.year;

    for (const war of this.warHistory) {
      const involves =
        (war.attackerId === aId && war.defenderId === bId) ||
        (war.attackerId === bId && war.defenderId === aId);
      if (!involves) continue;

      const endYear = war.endYear || currentYear;
      const yearsSince = currentYear - endYear;
      // Full penalty is -40, decays linearly over 20 years
      const decay = clamp(1 - yearsSince / 20, 0, 1);
      const penalty = -40 * decay;

      if (penalty < worstPenalty) {
        worstPenalty = penalty;
      }
    }

    return worstPenalty;
  }

  /**
   * Same region = slight bonus of +10.
   */
  _regionalProximityBonus(a, b) {
    if (a.region && b.region && a.region === b.region) {
      return 10;
    }
    return 0;
  }

  // ---------------------------------------------------------------------------
  // Alliance system
  // ---------------------------------------------------------------------------

  /**
   * Form a new bilateral alliance between two countries.
   * Requires relations > 30.
   * Returns the new alliance object, or null if prerequisites not met.
   */
  formAlliance(country1Id, country2Id, type = 'political') {
    const relation = this.getRelation(country1Id, country2Id);
    if (relation <= 30) {
      return { success: false, reason: 'Relations too low (need > 30)' };
    }

    const validTypes = ['military', 'economic', 'political'];
    if (!validTypes.includes(type)) {
      return { success: false, reason: `Invalid alliance type: ${type}` };
    }

    const country1 = this.engine.getCountry(country1Id);
    const country2 = this.engine.getCountry(country2Id);
    if (!country1 || !country2) {
      return { success: false, reason: 'Country not found' };
    }

    const allianceId = `alliance_${this._nextAllianceId++}`;
    const country1Name = country1.name || country1Id;
    const country2Name = country2.name || country2Id;

    const alliance = {
      id: allianceId,
      name: `${country1Name}-${country2Name} ${type} pact`,
      members: [country1Id, country2Id],
      type,
    };

    // Add to both countries
    country1.alliances.push({ ...alliance });
    country2.alliances.push({ ...alliance });

    // Register in global organisations
    this.engine.globalState.organizations.set(allianceId, alliance);

    // Relations boost on formation
    this._adjustRelation(country1Id, country2Id, 10);

    this.engine.events.emit('allianceFormed', {
      alliance,
      country1Id,
      country2Id,
    });

    this.engine.notify(
      `${country1Name} and ${country2Name} formed a ${type} alliance`,
      'diplomacy',
      country1Id
    );

    return { success: true, alliance };
  }

  /**
   * Join an existing alliance. Requires relations > 20 with the majority of members.
   */
  joinAlliance(countryId, allianceId) {
    const country = this.engine.getCountry(countryId);
    if (!country) return { success: false, reason: 'Country not found' };

    // Find the alliance from global orgs
    const alliance = this.engine.globalState.organizations.get(allianceId);
    if (!alliance) return { success: false, reason: 'Alliance not found' };

    // Already a member?
    if (alliance.members.includes(countryId)) {
      return { success: false, reason: 'Already a member' };
    }

    // Check relations with most members (> 50 % must be above 20)
    let aboveThreshold = 0;
    for (const memberId of alliance.members) {
      if (this.getRelation(countryId, memberId) > 20) {
        aboveThreshold++;
      }
    }

    if (aboveThreshold <= alliance.members.length / 2) {
      return {
        success: false,
        reason: 'Relations too low with most alliance members (need > 20 with majority)',
      };
    }

    // Add country
    alliance.members.push(countryId);
    country.alliances.push({ ...alliance });

    // Synchronize the updated member list on every member's copy
    this._syncAllianceMembersAcrossCountries(allianceId, alliance.members);

    // Boost relations with all members
    for (const memberId of alliance.members) {
      if (memberId !== countryId) {
        this._adjustRelation(countryId, memberId, 5);
      }
    }

    this.engine.events.emit('allianceJoined', { countryId, allianceId });

    this.engine.notify(
      `${country.name || countryId} joined alliance "${alliance.name}"`,
      'diplomacy',
      countryId
    );

    return { success: true };
  }

  /**
   * Leave an alliance. Hurts relations with all members.
   */
  leaveAlliance(countryId, allianceId) {
    const country = this.engine.getCountry(countryId);
    if (!country) return { success: false, reason: 'Country not found' };

    const alliance = this.engine.globalState.organizations.get(allianceId);
    if (!alliance) return { success: false, reason: 'Alliance not found' };

    const memberIdx = alliance.members.indexOf(countryId);
    if (memberIdx === -1) {
      return { success: false, reason: 'Not a member of this alliance' };
    }

    // Remove from global alliance
    alliance.members.splice(memberIdx, 1);

    // Remove from country's local list
    country.alliances = country.alliances.filter((a) => a.id !== allianceId);

    // Synchronize remaining members
    this._syncAllianceMembersAcrossCountries(allianceId, alliance.members);

    // Hurt relations with all remaining members
    for (const memberId of alliance.members) {
      this._adjustRelation(countryId, memberId, -15);
    }

    // If only one member left, disband
    if (alliance.members.length <= 1) {
      this._disbandAlliance(allianceId);
    }

    this.engine.events.emit('allianceLeft', { countryId, allianceId });

    this.engine.notify(
      `${country.name || countryId} left alliance "${alliance.name}"`,
      'diplomacy',
      countryId
    );

    return { success: true };
  }

  /**
   * Check if alliance members defend each other. Returns list of ally country IDs
   * that would come to the defender's aid.
   */
  getAllianceDefenders(defenderId) {
    const defender = this.engine.getCountry(defenderId);
    if (!defender) return [];

    const defenderSet = new Set();

    for (const alliance of defender.alliances || []) {
      if (alliance.type === 'military') {
        for (const memberId of alliance.members) {
          if (memberId !== defenderId) {
            defenderSet.add(memberId);
          }
        }
      }
    }

    return Array.from(defenderSet);
  }

  _syncAllianceMembersAcrossCountries(allianceId, currentMembers) {
    for (const memberId of currentMembers) {
      const member = this.engine.getCountry(memberId);
      if (!member) continue;
      const localAlliance = (member.alliances || []).find(
        (a) => a.id === allianceId
      );
      if (localAlliance) {
        localAlliance.members = [...currentMembers];
      }
    }
  }

  _disbandAlliance(allianceId) {
    const alliance = this.engine.globalState.organizations.get(allianceId);
    if (!alliance) return;

    // Remove from remaining members' local lists
    for (const memberId of alliance.members) {
      const member = this.engine.getCountry(memberId);
      if (member) {
        member.alliances = member.alliances.filter((a) => a.id !== allianceId);
      }
    }

    this.engine.globalState.organizations.delete(allianceId);

    this.engine.events.emit('allianceDisbanded', { allianceId });
  }

  _shareAllianceOfType(countryA, countryB, type) {
    for (const alliance of countryA.alliances || []) {
      if (alliance.type === type && alliance.members.includes(countryB.id)) {
        return alliance;
      }
    }
    return null;
  }

  _syncOrganizations() {
    const orgs = this.engine.globalState.organizations;

    for (const [, country] of this.engine.countries) {
      for (const alliance of country.alliances || []) {
        if (!orgs.has(alliance.id)) {
          orgs.set(alliance.id, { ...alliance });

          // Ensure the id counter stays ahead
          const numMatch = (alliance.id || '').match(/alliance_(\d+)/);
          if (numMatch) {
            const num = parseInt(numMatch[1], 10);
            if (num >= this._nextAllianceId) {
              this._nextAllianceId = num + 1;
            }
          }
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Sanctions system
  // ---------------------------------------------------------------------------

  /**
   * Impose sanctions from one country on another.
   * Reduces trade, hurts both economies but target more.
   */
  imposeSanctions(fromId, targetId, type = 'economic') {
    const from = this.engine.getCountry(fromId);
    const target = this.engine.getCountry(targetId);

    if (!from || !target) {
      return { success: false, reason: 'Country not found' };
    }

    const validTypes = ['economic', 'arms', 'full'];
    if (!validTypes.includes(type)) {
      return { success: false, reason: `Invalid sanction type: ${type}` };
    }

    // Check for existing identical sanctions
    const existing = target.sanctions.find(
      (s) => s.imposedBy === fromId && s.type === type
    );
    if (existing) {
      return { success: false, reason: 'Identical sanctions already in place' };
    }

    const sanction = {
      targetId,
      imposedBy: fromId,
      type,
    };

    target.sanctions.push(sanction);

    // Immediate relations hit
    this._adjustRelation(fromId, targetId, -15);

    // Cancel trade agreements between the two
    if (type === 'full' || type === 'economic') {
      this._cancelTradeAgreementsBetween(fromId, targetId);
    }

    this.engine.events.emit('sanctionsImposed', {
      fromId,
      targetId,
      type,
    });

    this.engine.notify(
      `${from.name || fromId} imposed ${type} sanctions on ${target.name || targetId}`,
      'diplomacy',
      fromId
    );

    return { success: true, sanction };
  }

  /**
   * Lift sanctions from one country on another.
   */
  liftSanctions(fromId, targetId) {
    const target = this.engine.getCountry(targetId);
    if (!target) return { success: false, reason: 'Target country not found' };

    const before = target.sanctions.length;
    target.sanctions = target.sanctions.filter(
      (s) => !(s.imposedBy === fromId)
    );
    const removed = before - target.sanctions.length;

    if (removed === 0) {
      return { success: false, reason: 'No sanctions found to lift' };
    }

    // Small relations improvement
    this._adjustRelation(fromId, targetId, 5);

    this.engine.events.emit('sanctionsLifted', { fromId, targetId });

    const from = this.engine.getCountry(fromId);
    this.engine.notify(
      `${(from && from.name) || fromId} lifted sanctions on ${target.name || targetId}`,
      'diplomacy',
      fromId
    );

    return { success: true, count: removed };
  }

  // ---------------------------------------------------------------------------
  // Trade agreements
  // ---------------------------------------------------------------------------

  /**
   * Propose a trade agreement. AI decides based on relations & ideology.
   * Returns result including whether the partner accepted.
   */
  proposeTradeAgreement(fromId, toId) {
    const from = this.engine.getCountry(fromId);
    const to = this.engine.getCountry(toId);

    if (!from || !to) {
      return { success: false, reason: 'Country not found' };
    }

    // Already have an agreement?
    const existing = (from.tradeAgreements || []).find(
      (a) => a.partnerId === toId
    );
    if (existing) {
      return { success: false, reason: 'Trade agreement already exists' };
    }

    // Check if sanctioned
    const isSanctioned = (to.sanctions || []).some(
      (s) => s.imposedBy === fromId
    );
    const isSanctionedReverse = (from.sanctions || []).some(
      (s) => s.imposedBy === toId
    );
    if (isSanctioned || isSanctionedReverse) {
      return { success: false, reason: 'Cannot form trade agreement while sanctions are active' };
    }

    const relation = this.getRelation(fromId, toId);

    // AI acceptance: based on relations, ideological similarity, and randomness
    const acceptanceScore = relation / 100 + this._ideologicalSimilarity(from, to) / 80;
    const threshold = 0.1; // fairly easy to accept if relations are positive
    const accepted = acceptanceScore > threshold || relation > 40;

    if (!accepted) {
      this.engine.events.emit('tradeAgreementRejected', { fromId, toId });
      return { success: false, reason: 'Proposal rejected by partner' };
    }

    // Determine bonus based on economic compatibility
    const bonus = clamp(0.05 + relation / 200, 0, 1);

    const agreement = { partnerId: toId, bonus };
    const reverseAgreement = { partnerId: fromId, bonus };

    from.tradeAgreements.push(agreement);
    to.tradeAgreements.push(reverseAgreement);

    // Small relations boost
    this._adjustRelation(fromId, toId, 5);

    this.engine.events.emit('tradeAgreementFormed', {
      fromId,
      toId,
      bonus,
    });

    this.engine.notify(
      `${from.name || fromId} and ${to.name || toId} signed a trade agreement`,
      'diplomacy',
      fromId
    );

    return { success: true, agreement };
  }

  /**
   * Cancel a trade agreement. Hurts relations.
   */
  cancelTradeAgreement(fromId, toId) {
    return this._cancelTradeAgreementsBetween(fromId, toId, true);
  }

  _cancelTradeAgreementsBetween(countryAId, countryBId, notifyAndPenalize = false) {
    const a = this.engine.getCountry(countryAId);
    const b = this.engine.getCountry(countryBId);

    let removed = false;

    if (a && a.tradeAgreements) {
      const before = a.tradeAgreements.length;
      a.tradeAgreements = a.tradeAgreements.filter(
        (t) => t.partnerId !== countryBId
      );
      if (a.tradeAgreements.length < before) removed = true;
    }

    if (b && b.tradeAgreements) {
      b.tradeAgreements = b.tradeAgreements.filter(
        (t) => t.partnerId !== countryAId
      );
    }

    if (!removed) {
      return { success: false, reason: 'No trade agreement found between these countries' };
    }

    if (notifyAndPenalize) {
      this._adjustRelation(countryAId, countryBId, -10);

      this.engine.events.emit('tradeAgreementCancelled', {
        fromId: countryAId,
        toId: countryBId,
      });

      this.engine.notify(
        `Trade agreement between ${(a && a.name) || countryAId} and ${(b && b.name) || countryBId} cancelled`,
        'diplomacy',
        countryAId
      );
    }

    return { success: true };
  }

  // ---------------------------------------------------------------------------
  // AI diplomacy evaluation
  // ---------------------------------------------------------------------------

  /**
   * Evaluate how desirable a war against `targetId` is for `countryId`.
   * Returns a score from -100 (terrible idea) to +100 (highly desirable).
   */
  evaluateWarDesirability(countryId, targetId) {
    const country = this.engine.getCountry(countryId);
    const target = this.engine.getCountry(targetId);
    if (!country || !target) return -100;

    let score = 0;

    // 1. Relations: very negative relations increase desirability
    const relation = this.getRelation(countryId, targetId);
    score += -relation * 0.4; // -100 relation -> +40 score

    // 2. Military balance: stronger = more desirable
    const myMilitary = country.military?.strength || country.militaryPower || 0;
    const theirMilitary = target.military?.strength || target.militaryPower || 0;

    if (theirMilitary > 0) {
      const ratio = myMilitary / theirMilitary;
      score += clamp((ratio - 1) * 30, -30, 30);
    }

    // 3. Alliance defenders: target has many allies -> less desirable
    const defenders = this.getAllianceDefenders(targetId);
    score -= defenders.length * 10;

    // 4. Own alliance support
    const myDefenders = this.getAllianceDefenders(countryId);
    score += myDefenders.length * 5;

    // 5. Resource motivation: target has more resources
    if (target.resources) {
      const resourceValue = Object.values(target.resources).reduce(
        (s, v) => s + (typeof v === 'number' ? v : 0),
        0
      );
      score += clamp(resourceValue / 100, 0, 15);
    }

    // 6. War weariness: recent wars are a deterrent
    const recentWars = this.warHistory.filter(
      (w) =>
        (w.attackerId === countryId || w.defenderId === countryId) &&
        (!w.endYear || this.engine.date.year - w.endYear < 5)
    );
    score -= recentWars.length * 15;

    // 7. Nuclear deterrent
    if (target.nuclear || (target.military && target.military.nuclear)) {
      score -= 50;
    }

    return clamp(Math.round(score), -100, 100);
  }

  /**
   * Evaluate how valuable an alliance with `targetId` would be for `countryId`.
   * Returns a score from -100 to +100.
   */
  evaluateAllianceValue(countryId, targetId) {
    const country = this.engine.getCountry(countryId);
    const target = this.engine.getCountry(targetId);
    if (!country || !target) return -100;

    let score = 0;

    // 1. Relations: good relations increase value
    const relation = this.getRelation(countryId, targetId);
    score += relation * 0.4;

    // 2. Ideological similarity
    score += this._ideologicalSimilarity(country, target) * 0.5;

    // 3. Military strength of target (strong allies are valuable)
    const theirMilitary = target.military?.strength || target.militaryPower || 0;
    const myMilitary = country.military?.strength || country.militaryPower || 0;
    if (myMilitary > 0) {
      score += clamp((theirMilitary / myMilitary) * 10, 0, 20);
    }

    // 4. Economic strength (wealthy allies are valuable)
    const theirGdp = target.gdp || 0;
    const myGdp = country.gdp || 0;
    if (myGdp > 0) {
      score += clamp((theirGdp / myGdp) * 10, 0, 20);
    }

    // 5. Regional proximity bonus
    if (country.region && target.region && country.region === target.region) {
      score += 10;
    }

    // 6. Already in too many alliances - diminishing returns
    const existingAlliances = (country.alliances || []).length;
    score -= existingAlliances * 3;

    // 7. War history penalty
    score += this._warHistoryPenalty(countryId, targetId) * 0.5;

    return clamp(Math.round(score), -100, 100);
  }

  // ---------------------------------------------------------------------------
  // Player actions
  // ---------------------------------------------------------------------------

  /**
   * Send foreign aid. Money transfer that improves relations.
   */
  sendAid(fromId, toId, amount) {
    const from = this.engine.getCountry(fromId);
    const to = this.engine.getCountry(toId);

    if (!from || !to) {
      return { success: false, reason: 'Country not found' };
    }

    if (amount <= 0) {
      return { success: false, reason: 'Amount must be positive' };
    }

    // Check if sender can afford it
    const senderBudget = from.budget ?? from.treasury ?? Infinity;
    if (amount > senderBudget) {
      return { success: false, reason: 'Insufficient funds' };
    }

    // Transfer money
    if (from.budget !== undefined) from.budget -= amount;
    else if (from.treasury !== undefined) from.treasury -= amount;

    if (to.budget !== undefined) to.budget += amount;
    else if (to.treasury !== undefined) to.treasury += amount;

    // Improve relations proportional to aid amount relative to recipient GDP
    const recipientGdp = to.gdp || 1e9;
    const relationsGain = clamp((amount / recipientGdp) * 500, 1, 30);
    this._adjustRelation(fromId, toId, relationsGain);

    this.engine.events.emit('aidSent', { fromId, toId, amount });

    this.engine.notify(
      `${from.name || fromId} sent aid to ${to.name || toId}`,
      'diplomacy',
      fromId
    );

    return { success: true, relationsGain };
  }

  /**
   * Demand tribute from a weaker country. Only works if military is much stronger.
   * Returns result including whether the target complied.
   */
  demandTribute(fromId, toId) {
    const from = this.engine.getCountry(fromId);
    const to = this.engine.getCountry(toId);

    if (!from || !to) {
      return { success: false, reason: 'Country not found' };
    }

    const myMilitary = from.military?.strength || from.militaryPower || 0;
    const theirMilitary = to.military?.strength || to.militaryPower || 0;

    // Require at least 3x military superiority
    if (theirMilitary > 0 && myMilitary / theirMilitary < 3) {
      return {
        success: false,
        reason: 'Military not strong enough to demand tribute (need 3x superiority)',
      };
    }

    const relation = this.getRelation(fromId, toId);

    // Compliance chance: based on military ratio and current relations
    const militaryRatio = theirMilitary > 0 ? myMilitary / theirMilitary : 10;
    const complianceChance = clamp(0.3 + (militaryRatio - 3) * 0.1 - relation / 200, 0, 0.95);

    const complied = Math.random() < complianceChance;

    if (!complied) {
      // Refusal: big relations hit
      this._adjustRelation(fromId, toId, -20);

      this.engine.events.emit('tributeDemandRejected', { fromId, toId });

      this.engine.notify(
        `${to.name || toId} refused tribute demand from ${from.name || fromId}`,
        'diplomacy',
        fromId
      );

      return { success: false, reason: 'Target refused to comply' };
    }

    // Tribute amount: ~2 % of target GDP
    const tributeAmount = (to.gdp || 1e9) * 0.02;

    if (to.budget !== undefined) to.budget -= tributeAmount;
    else if (to.treasury !== undefined) to.treasury -= tributeAmount;

    if (from.budget !== undefined) from.budget += tributeAmount;
    else if (from.treasury !== undefined) from.treasury += tributeAmount;

    // Relations hit even on compliance
    this._adjustRelation(fromId, toId, -10);

    // Other countries disapprove of bullying
    for (const [, other] of this.engine.countries) {
      if (other.id === fromId || other.id === toId) continue;
      this._adjustRelation(fromId, other.id, -2);
    }

    this.engine.events.emit('tributePaid', { fromId, toId, amount: tributeAmount });

    this.engine.notify(
      `${to.name || toId} paid tribute to ${from.name || fromId}`,
      'diplomacy',
      fromId
    );

    return { success: true, amount: tributeAmount };
  }

  /**
   * Player proposes an alliance. Wrapper around formAlliance with notification.
   */
  proposeAlliance(fromId, toId, type = 'political') {
    const from = this.engine.getCountry(fromId);
    const to = this.engine.getCountry(toId);

    if (!from || !to) {
      return { success: false, reason: 'Country not found' };
    }

    // AI acceptance evaluation
    const value = this.evaluateAllianceValue(toId, fromId);
    const relation = this.getRelation(fromId, toId);

    // AI accepts if the alliance has positive value and relations are above threshold
    if (value < 0 && relation <= 50) {
      this.engine.events.emit('allianceProposalRejected', {
        fromId,
        toId,
        type,
      });

      this.engine.notify(
        `${to.name || toId} rejected alliance proposal from ${from.name || fromId}`,
        'diplomacy',
        fromId
      );

      return { success: false, reason: 'Proposal rejected by target country' };
    }

    return this.formAlliance(fromId, toId, type);
  }

  // ---------------------------------------------------------------------------
  // War tracking helpers (used by a WarSystem or externally)
  // ---------------------------------------------------------------------------

  /**
   * Record a war starting between two countries.
   */
  recordWarStart(attackerId, defenderId) {
    this.warHistory.push({
      attackerId,
      defenderId,
      startYear: this.engine.date.year,
      endYear: null,
    });

    // Immediate massive relations drop
    this.setRelation(attackerId, defenderId, -100);

    this.engine.events.emit('warStarted', { attackerId, defenderId });
  }

  /**
   * Record a war ending between two countries.
   */
  recordWarEnd(attackerId, defenderId) {
    for (const war of this.warHistory) {
      if (
        war.endYear === null &&
        ((war.attackerId === attackerId && war.defenderId === defenderId) ||
          (war.attackerId === defenderId && war.defenderId === attackerId))
      ) {
        war.endYear = this.engine.date.year;
        break;
      }
    }

    this.engine.events.emit('warEnded', { attackerId, defenderId });
  }

  // ---------------------------------------------------------------------------
  // Query helpers
  // ---------------------------------------------------------------------------

  /**
   * Get all sanctions imposed on a country.
   */
  getSanctionsOn(countryId) {
    const country = this.engine.getCountry(countryId);
    if (!country) return [];
    return country.sanctions || [];
  }

  /**
   * Get all sanctions imposed by a country.
   */
  getSanctionsBy(countryId) {
    const results = [];
    for (const [, country] of this.engine.countries) {
      for (const sanction of country.sanctions || []) {
        if (sanction.imposedBy === countryId) {
          results.push({ ...sanction, targetId: country.id });
        }
      }
    }
    return results;
  }

  /**
   * Get all alliances a country belongs to.
   */
  getAlliances(countryId) {
    const country = this.engine.getCountry(countryId);
    if (!country) return [];
    return country.alliances || [];
  }

  /**
   * Get all trade agreements for a country.
   */
  getTradeAgreements(countryId) {
    const country = this.engine.getCountry(countryId);
    if (!country) return [];
    return country.tradeAgreements || [];
  }

  /**
   * Get a full diplomatic summary between two countries.
   */
  getDiplomaticSummary(countryAId, countryBId) {
    const a = this.engine.getCountry(countryAId);
    const b = this.engine.getCountry(countryBId);

    if (!a || !b) return null;

    const relation = this.getRelation(countryAId, countryBId);

    const sharedAlliances = (a.alliances || []).filter((al) =>
      al.members.includes(countryBId)
    );

    const hasTradeAgreement = (a.tradeAgreements || []).some(
      (t) => t.partnerId === countryBId
    );

    const sanctionsAOnB = (b.sanctions || []).filter(
      (s) => s.imposedBy === countryAId
    );
    const sanctionsBOnA = (a.sanctions || []).filter(
      (s) => s.imposedBy === countryBId
    );

    const atWar = this.warHistory.some(
      (w) =>
        w.endYear === null &&
        ((w.attackerId === countryAId && w.defenderId === countryBId) ||
          (w.attackerId === countryBId && w.defenderId === countryAId))
    );

    let status;
    if (atWar) status = 'war';
    else if (relation > 60) status = 'friendly';
    else if (relation > 20) status = 'cordial';
    else if (relation > -20) status = 'neutral';
    else if (relation > -60) status = 'tense';
    else status = 'hostile';

    return {
      relation,
      status,
      sharedAlliances,
      hasTradeAgreement,
      sanctionsAOnB,
      sanctionsBOnA,
      atWar,
      ideologicalSimilarity: this._ideologicalSimilarity(a, b),
      regionalProximity: a.region === b.region,
    };
  }
}
