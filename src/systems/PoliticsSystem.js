import { clamp } from '../engine/utils.js';

/**
 * PoliticsSystem - Manages political simulation for all countries.
 *
 * Country political properties expected:
 *   approvalRating (0-1), democracyIndex (0-1), corruptionIndex (0-1), stabilityIndex (0-1)
 *   ideology: { democracy: 0-1, economy: 0-1 }
 *   parties: [{ name, support (0-1), ideology: { democracy, economy } }]
 */
export class PoliticsSystem {
  constructor() {
    this.engine = null;

    // Track per-country persistent political state not stored on the country object itself
    this._countryState = new Map();
  }

  get name() {
    return 'politics';
  }

  // ----------------------------------------------------------------
  // Initialization
  // ----------------------------------------------------------------

  init() {
    // Build internal tracking state for every country already registered
    for (const [id, country] of this.engine.countries) {
      this._ensureCountryState(id, country);
    }
  }

  /**
   * Lazily ensures internal bookkeeping exists for a country.
   */
  _ensureCountryState(countryId, country) {
    if (this._countryState.has(countryId)) return this._countryState.get(countryId);

    const state = {
      lastElectionYear: country._lastElectionYear ?? (this.engine.date.year - Math.floor(Math.random() * 4)),
      lowApprovalMonths: 0,          // consecutive months with approval < 0.1 (revolution tracker)
      protestActive: false,
      coupCooldownMonths: 0,         // prevent repeated coups
      activePolicies: new Map(),     // policyKey -> { monthsRemaining, effects }
    };

    this._countryState.set(countryId, state);
    return state;
  }

  // ----------------------------------------------------------------
  // Monthly update (called by GameEngine on day 1 of each month)
  // ----------------------------------------------------------------

  monthlyUpdate(date) {
    for (const [id, country] of this.engine.countries) {
      const state = this._ensureCountryState(id, country);

      this._tickActivePolicies(id, country, state);
      this._updateApproval(id, country, state);
      this._updatePartySupport(id, country, state);
      this._updateCorruption(id, country, state);
      this._updateStability(id, country, state);
      this._updateDemocracy(id, country, state);
      this._checkProtests(id, country, state);
      this._checkCoup(id, country, state, date);
      this._checkRevolution(id, country, state, date);
      this._checkElections(id, country, state, date);

      if (state.coupCooldownMonths > 0) {
        state.coupCooldownMonths--;
      }
    }
  }

  // ----------------------------------------------------------------
  // Approval Rating
  // ----------------------------------------------------------------

  _updateApproval(countryId, country, state) {
    let delta = 0;

    // --- Economic performance ---
    const gdpGrowth = country.gdpGrowth ?? 0;          // e.g. 0.03 = 3 %
    const unemployment = country.unemployment ?? 0.05;  // 0-1
    const inflation = country.inflation ?? 0.03;        // 0-1

    // Positive GDP growth boosts approval; negative hurts more
    delta += gdpGrowth * 0.8;
    // Low unemployment is good (baseline ~5 %)
    delta -= (unemployment - 0.05) * 0.6;
    // Inflation above 5 % hurts
    delta -= Math.max(0, inflation - 0.05) * 0.5;

    // --- Military situation (war fatigue) ---
    const atWar = country.atWar ?? false;
    const warMonths = country.warMonths ?? 0;
    if (atWar) {
      // War fatigue grows logarithmically
      delta -= 0.01 * Math.log2(1 + warMonths);
    }

    // --- Corruption ---
    delta -= country.corruptionIndex * 0.04;

    // --- Active protest penalty ---
    if (state.protestActive) {
      delta -= 0.005;
    }

    // --- Random noise (small) ---
    delta += (Math.random() - 0.5) * 0.01;

    country.approvalRating = clamp(country.approvalRating + delta, 0, 1);
  }

  // ----------------------------------------------------------------
  // Party Support
  // ----------------------------------------------------------------

  _updatePartySupport(countryId, country, state) {
    if (!country.parties || country.parties.length === 0) return;

    // Determine the "desired" ideology direction of the population based on conditions
    const desiredDemocracy = this._getDesiredDemocracy(country);
    const desiredEconomy = this._getDesiredEconomy(country);

    let totalSupport = 0;

    for (const party of country.parties) {
      // Alignment with what people want
      const demDist = Math.abs(party.ideology.democracy - desiredDemocracy);
      const ecoDist = Math.abs(party.ideology.economy - desiredEconomy);
      const alignment = 1 - (demDist + ecoDist) / 2; // 0 = totally misaligned, 1 = perfect

      // Ruling party gets penalised / rewarded by approval
      const isRuling = party === country.parties[0]; // convention: first party is ruling
      let supportDelta = 0;

      if (isRuling) {
        supportDelta += (country.approvalRating - 0.5) * 0.04;
      } else {
        // Opposition benefits from low approval
        supportDelta += (0.5 - country.approvalRating) * 0.02;
      }

      // Alignment pull
      supportDelta += (alignment - 0.5) * 0.02;

      // Small random drift
      supportDelta += (Math.random() - 0.5) * 0.005;

      party.support = clamp(party.support + supportDelta, 0.01, 1);
      totalSupport += party.support;
    }

    // Normalise so total support sums to 1
    if (totalSupport > 0) {
      for (const party of country.parties) {
        party.support /= totalSupport;
      }
    }
  }

  _getDesiredDemocracy(country) {
    // People with high education and low corruption want more democracy
    const education = country.educationIndex ?? 0.5;
    return clamp(0.3 + education * 0.5 - country.corruptionIndex * 0.2, 0, 1);
  }

  _getDesiredEconomy(country) {
    // High unemployment pushes toward interventionism (low economy value = state-controlled)
    // High inflation pushes toward free market reforms (high economy value)
    const unemployment = country.unemployment ?? 0.05;
    const inflation = country.inflation ?? 0.03;
    return clamp(0.5 - unemployment * 1.5 + inflation * 1.0, 0, 1);
  }

  // ----------------------------------------------------------------
  // Corruption
  // ----------------------------------------------------------------

  _updateCorruption(countryId, country, state) {
    // Corruption naturally creeps upward
    let delta = 0.002;

    // Anti-corruption spending counters growth
    const budget = country.budget ?? {};
    const antiCorruptionSpending = budget.antiCorruption ?? 0;
    const gdp = country.gdp ?? 1e9;

    // Spending as fraction of GDP
    const spendingRatio = antiCorruptionSpending / gdp;
    // Effective reduction scales with spending; diminishing returns
    delta -= Math.min(0.015, spendingRatio * 50);

    // Active anti-corruption policy gives additional push
    if (state.activePolicies.has('anti_corruption')) {
      delta -= 0.005;
    }

    // Democracy helps fight corruption organically
    delta -= country.democracyIndex * 0.002;

    country.corruptionIndex = clamp(country.corruptionIndex + delta, 0, 1);
  }

  // ----------------------------------------------------------------
  // Stability
  // ----------------------------------------------------------------

  _updateStability(countryId, country, state) {
    // Stability target based on multiple factors
    const approvalFactor = country.approvalRating * 0.35;
    const democracyFactor = country.democracyIndex * 0.2;
    const corruptionPenalty = country.corruptionIndex * 0.25;
    const unemployment = country.unemployment ?? 0.05;
    const unemploymentPenalty = Math.max(0, unemployment - 0.06) * 1.5;

    const target = clamp(approvalFactor + democracyFactor - corruptionPenalty - unemploymentPenalty + 0.3, 0, 1);

    // Move toward target gradually
    const diff = target - country.stabilityIndex;
    country.stabilityIndex = clamp(country.stabilityIndex + diff * 0.1, 0, 1);

    // Protest drags stability down directly
    if (state.protestActive) {
      country.stabilityIndex = clamp(country.stabilityIndex - 0.02, 0, 1);
    }
  }

  // ----------------------------------------------------------------
  // Democracy
  // ----------------------------------------------------------------

  _updateDemocracy(countryId, country, state) {
    let delta = 0;

    // Education slowly pushes toward more democracy
    const education = country.educationIndex ?? 0.5;
    delta += (education - 0.5) * 0.003;

    // High stability allows democratic institutions to strengthen
    if (country.stabilityIndex > 0.6) {
      delta += 0.001;
    }

    // Very low stability can erode democracy
    if (country.stabilityIndex < 0.25) {
      delta -= 0.003;
    }

    // External pressure (e.g. from allies or global norms) nudges toward democracy
    const externalPressure = country.externalDemocracyPressure ?? 0; // -1 to 1
    delta += externalPressure * 0.002;

    // Corruption undermines democratic institutions
    if (country.corruptionIndex > 0.6) {
      delta -= 0.001;
    }

    country.democracyIndex = clamp(country.democracyIndex + delta, 0, 1);

    // Also gently adjust country ideology.democracy toward actual democracy index
    if (country.ideology) {
      const ideoDiff = country.democracyIndex - country.ideology.democracy;
      country.ideology.democracy = clamp(country.ideology.democracy + ideoDiff * 0.02, 0, 1);
    }
  }

  // ----------------------------------------------------------------
  // Protests
  // ----------------------------------------------------------------

  _checkProtests(countryId, country, state) {
    if (country.approvalRating < 0.25) {
      if (!state.protestActive) {
        state.protestActive = true;

        this.engine.events.emit('protests_started', {
          countryId,
          approval: country.approvalRating,
        });

        this.engine.notify(
          `Protests have erupted in ${country.name} due to low government approval.`,
          'warning',
          countryId
        );
      }

      // Ongoing protest effects: reduce productivity
      if (country.productivityModifier !== undefined) {
        country.productivityModifier = clamp(country.productivityModifier - 0.01, -0.3, 1);
      } else {
        country.productivityModifier = -0.01;
      }
    } else if (country.approvalRating >= 0.3) {
      // Protests subside once approval recovers above 0.3 (hysteresis)
      if (state.protestActive) {
        state.protestActive = false;

        this.engine.events.emit('protests_ended', { countryId });

        this.engine.notify(
          `Protests in ${country.name} have subsided.`,
          'info',
          countryId
        );

        // Restore productivity modifier gradually handled elsewhere; reset here
        if (country.productivityModifier !== undefined) {
          country.productivityModifier = Math.min(country.productivityModifier + 0.05, 0);
        }
      }
    }
  }

  // ----------------------------------------------------------------
  // Coup d'etat
  // ----------------------------------------------------------------

  _checkCoup(countryId, country, state, date) {
    if (state.coupCooldownMonths > 0) return;
    if (country.approvalRating >= 0.15 || country.stabilityIndex >= 0.3) return;

    // Probability of coup scales with how bad things are
    const severity = (0.15 - country.approvalRating) + (0.3 - country.stabilityIndex);
    const coupChance = clamp(severity * 0.3, 0, 0.25); // max 25 % per month

    if (Math.random() > coupChance) return;

    // --- Execute coup ---
    this._executeCoup(countryId, country, state, date);
  }

  _executeCoup(countryId, country, state, date) {
    // Stability drops sharply
    country.stabilityIndex = clamp(country.stabilityIndex - 0.25, 0, 1);

    // Democracy takes a hit
    country.democracyIndex = clamp(country.democracyIndex - 0.15, 0, 1);

    // Ideology shifts: coups tend to push away from current direction
    if (country.ideology) {
      // Random ideological shift
      country.ideology.democracy = clamp(
        country.ideology.democracy + (Math.random() - 0.6) * 0.3,
        0,
        1
      );
      country.ideology.economy = clamp(
        country.ideology.economy + (Math.random() - 0.5) * 0.2,
        0,
        1
      );
    }

    // Shuffle parties: a military/new faction takes power
    if (country.parties && country.parties.length > 0) {
      // Reduce all existing party support
      for (const party of country.parties) {
        party.support *= 0.6;
      }

      // "New regime" party pushed to front
      const coupParty = {
        name: 'Military Council',
        support: 0.4,
        ideology: {
          democracy: clamp(country.democracyIndex - 0.1, 0, 1),
          economy: country.ideology ? country.ideology.economy : 0.5,
        },
      };
      country.parties.unshift(coupParty);

      // Renormalise support
      const total = country.parties.reduce((s, p) => s + p.support, 0);
      for (const party of country.parties) {
        party.support /= total;
      }
    }

    // Approval resets to a moderate level (new leader benefit)
    country.approvalRating = clamp(0.35 + Math.random() * 0.15, 0, 1);

    // Cooldown to prevent chain coups
    state.coupCooldownMonths = 24;

    // Reset low-approval counter
    state.lowApprovalMonths = 0;
    state.protestActive = false;

    this.engine.events.emit('coup', {
      countryId,
      date: { ...date },
    });

    this.engine.notify(
      `A coup d'etat has occurred in ${country.name}! The military has seized power.`,
      'critical',
      countryId
    );
  }

  // ----------------------------------------------------------------
  // Revolution
  // ----------------------------------------------------------------

  _checkRevolution(countryId, country, state, date) {
    if (country.approvalRating < 0.1) {
      state.lowApprovalMonths++;
    } else {
      state.lowApprovalMonths = Math.max(0, state.lowApprovalMonths - 2);
    }

    // Revolution after extended period of abysmal approval (12+ months)
    if (state.lowApprovalMonths < 12) return;

    const revolutionChance = clamp((state.lowApprovalMonths - 12) * 0.05, 0, 0.4);
    if (Math.random() > revolutionChance) return;

    this._executeRevolution(countryId, country, state, date);
  }

  _executeRevolution(countryId, country, state, date) {
    // A revolution is more dramatic than a coup

    // Stability crashes
    country.stabilityIndex = clamp(country.stabilityIndex - 0.4, 0, 1);

    // Major ideological shift: tends to swing toward what people want
    const desiredDem = this._getDesiredDemocracy(country);
    const desiredEco = this._getDesiredEconomy(country);

    if (country.ideology) {
      country.ideology.democracy = clamp(
        desiredDem + (Math.random() - 0.5) * 0.3,
        0,
        1
      );
      country.ideology.economy = clamp(
        desiredEco + (Math.random() - 0.5) * 0.3,
        0,
        1
      );
    }

    // Democracy may increase (popular revolution) or decrease (authoritarian takeover)
    country.democracyIndex = clamp(desiredDem + (Math.random() - 0.5) * 0.2, 0, 1);

    // Corruption resets somewhat (new regime purges)
    country.corruptionIndex = clamp(country.corruptionIndex - 0.2, 0, 1);

    // Parties completely reshuffled
    if (country.parties) {
      country.parties = [
        {
          name: 'Revolutionary Front',
          support: 0.5,
          ideology: {
            democracy: country.ideology ? country.ideology.democracy : 0.5,
            economy: country.ideology ? country.ideology.economy : 0.5,
          },
        },
        {
          name: 'Reformist Party',
          support: 0.3,
          ideology: {
            democracy: clamp((country.ideology?.democracy ?? 0.5) + 0.15, 0, 1),
            economy: clamp((country.ideology?.economy ?? 0.5) + 0.1, 0, 1),
          },
        },
        {
          name: 'Old Guard',
          support: 0.2,
          ideology: {
            democracy: clamp((country.ideology?.democracy ?? 0.5) - 0.2, 0, 1),
            economy: clamp((country.ideology?.economy ?? 0.5) - 0.1, 0, 1),
          },
        },
      ];
    }

    // Approval resets
    country.approvalRating = clamp(0.4 + Math.random() * 0.2, 0, 1);

    state.lowApprovalMonths = 0;
    state.protestActive = false;
    state.coupCooldownMonths = 36; // long cooldown after revolution

    this.engine.events.emit('revolution', {
      countryId,
      date: { ...date },
    });

    this.engine.notify(
      `A revolution has swept through ${country.name}! The government has been overthrown.`,
      'critical',
      countryId
    );
  }

  // ----------------------------------------------------------------
  // Elections
  // ----------------------------------------------------------------

  _checkElections(countryId, country, state, date) {
    // Only democracies hold elections
    if (country.democracyIndex <= 0.5) return;
    if (!country.parties || country.parties.length < 2) return;

    const yearsSinceElection = date.year - state.lastElectionYear;
    if (yearsSinceElection < 4) return;

    // Elections happen in the first month of the election year
    if (date.month !== 1) return;

    this._holdElection(countryId, country, state, date);
  }

  _holdElection(countryId, country, state, date) {
    state.lastElectionYear = date.year;

    // Determine winner by support (with some randomness for undecided voters)
    const results = country.parties.map((party) => {
      const noise = (Math.random() - 0.5) * 0.08;
      return {
        party,
        votes: clamp(party.support + noise, 0, 1),
      };
    });

    // Normalise votes to percentages
    const totalVotes = results.reduce((s, r) => s + r.votes, 0);
    for (const r of results) {
      r.votes /= totalVotes;
    }

    // Sort descending
    results.sort((a, b) => b.votes - a.votes);

    const winner = results[0].party;
    const previousRuling = country.parties[0];

    // Rearrange parties: winner becomes first (ruling)
    const winnerIdx = country.parties.indexOf(winner);
    if (winnerIdx > 0) {
      country.parties.splice(winnerIdx, 1);
      country.parties.unshift(winner);
    }

    // Winning party nudges country ideology
    if (country.ideology) {
      const shiftStrength = 0.05;
      country.ideology.democracy = clamp(
        country.ideology.democracy + (winner.ideology.democracy - country.ideology.democracy) * shiftStrength,
        0,
        1
      );
      country.ideology.economy = clamp(
        country.ideology.economy + (winner.ideology.economy - country.ideology.economy) * shiftStrength,
        0,
        1
      );
    }

    // Update party support to reflect election results
    for (const r of results) {
      r.party.support = r.votes;
    }

    // Small approval boost for new government
    if (winner !== previousRuling) {
      country.approvalRating = clamp(country.approvalRating + 0.1, 0, 1);
    }

    // Democracy gets a small boost from holding elections
    country.democracyIndex = clamp(country.democracyIndex + 0.01, 0, 1);

    const electionData = {
      countryId,
      date: { ...date },
      winner: winner.name,
      results: results.map((r) => ({
        name: r.party.name,
        votes: r.votes,
        ideology: { ...r.party.ideology },
      })),
      governmentChanged: winner !== previousRuling,
    };

    this.engine.events.emit('election', electionData);

    this.engine.notify(
      `Elections in ${country.name}: ${winner.name} wins with ${(results[0].votes * 100).toFixed(1)}% of the vote.${winner !== previousRuling ? ' A new government takes power!' : ''}`,
      'info',
      countryId
    );
  }

  // ----------------------------------------------------------------
  // Active Policies (tick durations)
  // ----------------------------------------------------------------

  _tickActivePolicies(countryId, country, state) {
    for (const [key, policy] of state.activePolicies) {
      if (policy.monthsRemaining !== Infinity) {
        policy.monthsRemaining--;
      }

      if (policy.monthsRemaining <= 0) {
        // Remove expired policy and undo lingering effects
        this._removePolicyEffects(country, key, policy);
        state.activePolicies.delete(key);

        this.engine.events.emit('policy_expired', {
          countryId,
          policy: key,
        });
      }
    }
  }

  // ----------------------------------------------------------------
  // Player Actions
  // ----------------------------------------------------------------

  /**
   * Enact a policy for a country.
   * @param {string} countryId
   * @param {string} policy - one of the policy keys below
   * @returns {{ success: boolean, message: string }}
   */
  enactPolicy(countryId, policy) {
    const country = this.engine.getCountry(countryId);
    if (!country) return { success: false, message: 'Country not found.' };

    const state = this._ensureCountryState(countryId, country);

    // Cannot stack the same policy
    if (state.activePolicies.has(policy)) {
      return { success: false, message: `Policy "${policy}" is already active.` };
    }

    const policyDef = POLICY_DEFINITIONS[policy];
    if (!policyDef) {
      return { success: false, message: `Unknown policy "${policy}".` };
    }

    // Apply immediate effects
    if (policyDef.immediate) {
      policyDef.immediate(country);
    }

    // Register ongoing policy
    state.activePolicies.set(policy, {
      monthsRemaining: policyDef.duration,       // months or Infinity
      effects: policyDef.effects ? { ...policyDef.effects } : {},
    });

    this.engine.events.emit('policy_enacted', {
      countryId,
      policy,
      duration: policyDef.duration,
    });

    this.engine.notify(
      `${country.name} has enacted the "${policyDef.label}" policy.`,
      'info',
      countryId
    );

    return { success: true, message: `Policy "${policyDef.label}" enacted.` };
  }

  /**
   * Gradually shift a country's ideology on the given axis.
   * @param {string} countryId
   * @param {'democracy' | 'economy'} axis
   * @param {number} direction - positive to increase, negative to decrease
   * @returns {{ success: boolean, message: string }}
   */
  adjustIdeology(countryId, axis, direction) {
    const country = this.engine.getCountry(countryId);
    if (!country) return { success: false, message: 'Country not found.' };
    if (!country.ideology) return { success: false, message: 'Country has no ideology data.' };
    if (axis !== 'democracy' && axis !== 'economy') {
      return { success: false, message: `Invalid axis "${axis}". Use "democracy" or "economy".` };
    }

    const step = 0.02 * Math.sign(direction);
    country.ideology[axis] = clamp(country.ideology[axis] + step, 0, 1);

    // Shifting ideology can affect approval depending on alignment with popular desire
    const desired = axis === 'democracy'
      ? this._getDesiredDemocracy(country)
      : this._getDesiredEconomy(country);

    const distBefore = Math.abs(country.ideology[axis] - step - desired);
    const distAfter = Math.abs(country.ideology[axis] - desired);

    if (distAfter < distBefore) {
      // Moving toward what people want: small approval boost
      country.approvalRating = clamp(country.approvalRating + 0.005, 0, 1);
    } else {
      // Moving away: small approval hit
      country.approvalRating = clamp(country.approvalRating - 0.005, 0, 1);
    }

    this.engine.events.emit('ideology_adjusted', {
      countryId,
      axis,
      direction: Math.sign(direction),
      newValue: country.ideology[axis],
    });

    return {
      success: true,
      message: `${axis} ideology shifted to ${country.ideology[axis].toFixed(2)}.`,
    };
  }

  // ----------------------------------------------------------------
  // Policy removal helper
  // ----------------------------------------------------------------

  _removePolicyEffects(country, key, _policy) {
    const def = POLICY_DEFINITIONS[key];
    if (def && def.onExpire) {
      def.onExpire(country);
    }
  }
}

// ====================================================================
// Policy Definitions
// ====================================================================

const POLICY_DEFINITIONS = {
  raise_taxes: {
    label: 'Raise Taxes',
    duration: 12,
    immediate(country) {
      // Immediate unpopularity hit
      country.approvalRating = clamp(country.approvalRating - 0.05, 0, 1);
    },
    effects: {
      description: 'Higher tax revenue, reduced economic growth, lower approval.',
    },
    onExpire(_country) {
      // Effects simply stop
    },
  },

  lower_taxes: {
    label: 'Lower Taxes',
    duration: 12,
    immediate(country) {
      // Small popularity bump
      country.approvalRating = clamp(country.approvalRating + 0.04, 0, 1);
    },
    effects: {
      description: 'Lower tax revenue, stimulated economic growth, higher approval.',
    },
    onExpire(_country) {},
  },

  anti_corruption: {
    label: 'Anti-Corruption Campaign',
    duration: 24, // 2 years
    immediate(country) {
      // Initial corruption disruption
      country.corruptionIndex = clamp(country.corruptionIndex - 0.03, 0, 1);
      // Costs political capital
      country.approvalRating = clamp(country.approvalRating - 0.02, 0, 1);
    },
    effects: {
      // Ongoing corruption reduction is handled in _updateCorruption via activePolicies check
      description: 'Steadily reduces corruption. Costs budget resources.',
    },
    onExpire(_country) {},
  },

  martial_law: {
    label: 'Martial Law',
    duration: 6,
    immediate(country) {
      // Immediate stability boost
      country.stabilityIndex = clamp(country.stabilityIndex + 0.15, 0, 1);
      // Democracy and approval suffer
      country.democracyIndex = clamp(country.democracyIndex - 0.1, 0, 1);
      country.approvalRating = clamp(country.approvalRating - 0.1, 0, 1);
    },
    effects: {
      description: 'Stability increased. Democracy and approval reduced while active.',
    },
    onExpire(country) {
      // Partial rebound of democracy when martial law is lifted
      country.democracyIndex = clamp(country.democracyIndex + 0.03, 0, 1);
    },
  },

  press_freedom: {
    label: 'Press Freedom',
    duration: 18,
    immediate(country) {
      // Boost democracy
      country.democracyIndex = clamp(country.democracyIndex + 0.05, 0, 1);
      // If corruption is high, exposure lowers approval
      if (country.corruptionIndex > 0.4) {
        const exposurePenalty = (country.corruptionIndex - 0.4) * 0.15;
        country.approvalRating = clamp(country.approvalRating - exposurePenalty, 0, 1);
      }
    },
    effects: {
      description: 'Increases democracy. May expose corruption (lowering approval if corruption is high).',
    },
    onExpire(_country) {},
  },

  censorship: {
    label: 'Censorship',
    duration: 12,
    immediate(country) {
      // Suppress dissent: stability boost
      country.stabilityIndex = clamp(country.stabilityIndex + 0.08, 0, 1);
      // Democracy eroded
      country.democracyIndex = clamp(country.democracyIndex - 0.08, 0, 1);
      // Small approval boost from suppressed negative coverage
      country.approvalRating = clamp(country.approvalRating + 0.03, 0, 1);
    },
    effects: {
      description: 'Short-term stability boost. Erodes democracy.',
    },
    onExpire(country) {
      // Backlash when censorship is lifted
      country.approvalRating = clamp(country.approvalRating - 0.04, 0, 1);
      country.democracyIndex = clamp(country.democracyIndex + 0.02, 0, 1);
    },
  },
};
