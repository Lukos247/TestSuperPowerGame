import { formatNumber, formatMoney, formatPercent } from '../../engine/utils.js';

export class OverviewPanel {
  constructor(engine) {
    this.engine = engine;
  }

  render(container) {
    const country = this.engine.getPlayerCountry();
    if (!country) {
      container.innerHTML = '<div class="card"><h3>No country selected</h3></div>';
      return;
    }

    const militarySystem = this.engine.getSystem('military');
    const totalStrength = militarySystem
      ? militarySystem.calculateMilitaryStrength(country)
      : 0;
    const activeWars = militarySystem
      ? militarySystem.getWarsForCountry(country.id)
      : [];

    // --- Derived values ---
    const approvalPct = (country.approvalRating * 100).toFixed(1);
    const stabilityPct = (country.stabilityIndex * 100).toFixed(1);
    const democracyPct = (country.democracyIndex * 100).toFixed(1);
    const corruptionPct = (country.corruptionIndex * 100).toFixed(1);

    const gdpGrowthStr = (country.gdpGrowth * 100).toFixed(1);
    const gdpGrowthSign = country.gdpGrowth >= 0 ? '+' : '';
    const gdpGrowthClass = country.gdpGrowth >= 0 ? 'green' : 'red';

    const inflationStr = (country.inflation * 100).toFixed(1);
    const debtToGDPStr = (country.debtToGDP * 100).toFixed(0);
    const tradeBalClass = country.tradeBalance >= 0 ? 'green' : 'red';

    const population = country.population || 0;
    const popGrowth = country.populationGrowth || 0;
    const popGrowthStr = (popGrowth * 100).toFixed(2);
    const literacy = country.literacy != null ? country.literacy : (country.educationIndex || 0);
    const healthIndex = country.healthIndex || 0;
    const unemployment = country.unemployment || 0;

    // Technology levels
    const techLevel = country.techLevel || {};
    const techMilitary = techLevel.military || 0;
    const techCivilian = techLevel.civilian || 0;
    const techIndustrial = techLevel.industrial || 0;
    const techDigital = techLevel.digital || 0;

    // Espionage
    const agentCount = country.agentCount || 0;
    const counterintelligence = country.counterintelligence || 0;
    const espionageSystem = this.engine.getSystem('espionage');
    const activeOps = espionageSystem && typeof espionageSystem.getActiveOperations === 'function'
      ? espionageSystem.getActiveOperations(country.id)
      : [];

    // Budget breakdown
    const budget = country.budget || {};
    const budgetItems = [
      { label: 'Military', key: 'militarySpending', color: '#ef5350' },
      { label: 'Education', key: 'educationSpending', color: '#4fc3f7' },
      { label: 'Healthcare', key: 'healthcareSpending', color: '#66bb6a' },
      { label: 'Infrastructure', key: 'infrastructureSpending', color: '#ffa726' },
      { label: 'Social', key: 'socialSpending', color: '#ab47bc' },
      { label: 'Science', key: 'scienceSpending', color: '#26c6da' },
      { label: 'Intelligence', key: 'intelligenceSpending', color: '#78909c' },
    ];

    const totalSpending = budgetItems.reduce((sum, item) => sum + (budget[item.key] || 0), 0);
    const taxRate = budget.taxRate || 0;
    const budgetBalance = taxRate - totalSpending;
    const budgetBalanceClass = budgetBalance >= 0 ? 'green' : 'red';
    const budgetBalanceSign = budgetBalance >= 0 ? '+' : '';

    // Approval progress bar color
    const approvalColor = country.approvalRating >= 0.5 ? 'green'
      : country.approvalRating >= 0.25 ? 'yellow' : 'red';

    // Stability progress bar color
    const stabilityColor = country.stabilityIndex >= 0.6 ? 'green'
      : country.stabilityIndex >= 0.3 ? 'yellow' : 'red';

    // War fatigue color
    const warFatigue = country.warFatigue || 0;
    const warFatigueColor = warFatigue <= 30 ? 'green'
      : warFatigue <= 60 ? 'yellow' : 'red';

    container.innerHTML = `
      <!-- Country Header -->
      <div class="card" style="display: flex; align-items: center; gap: 16px;">
        <span class="flag" style="font-size: 32px; width: 48px; height: 32px; line-height: 32px;">${country.flag || ''}</span>
        <div>
          <h3 style="margin-bottom: 2px; font-size: 18px;">${country.name}</h3>
          <span class="stat-label">${country.region || ''} ${country.continent ? '/ ' + country.continent : ''}</span>
        </div>
      </div>

      <!-- Key Metrics Grid -->
      <div class="card-grid">

        <!-- Economy Card -->
        <div class="card">
          <h3>Economy</h3>
          <div class="stat-row">
            <span class="stat-label">GDP</span>
            <span class="stat-value">${formatMoney(country.gdp)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">GDP Growth</span>
            <span class="stat-value" style="color: var(--${gdpGrowthClass === 'green' ? 'success' : 'danger'})">${gdpGrowthSign}${gdpGrowthStr}%</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Inflation</span>
            <span class="stat-value">${inflationStr}%</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Debt / GDP</span>
            <span class="stat-value" style="color: var(--${country.debtToGDP > 0.8 ? 'danger' : country.debtToGDP > 0.5 ? 'warning' : 'success'})">${debtToGDPStr}%</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Trade Balance</span>
            <span class="stat-value" style="color: var(--${country.tradeBalance >= 0 ? 'success' : 'danger'})">${formatMoney(country.tradeBalance)}</span>
          </div>
        </div>

        <!-- Politics Card -->
        <div class="card">
          <h3>Politics</h3>
          <div class="stat-row">
            <span class="stat-label">Approval Rating</span>
            <span class="stat-value">${approvalPct}%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill ${approvalColor}" style="width: ${Math.min(country.approvalRating * 100, 100)}%"></div></div>
          <div class="stat-row" style="margin-top: 8px;">
            <span class="stat-label">Stability</span>
            <span class="stat-value">${stabilityPct}%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill ${stabilityColor}" style="width: ${Math.min(country.stabilityIndex * 100, 100)}%"></div></div>
          <div class="stat-row" style="margin-top: 8px;">
            <span class="stat-label">Democracy Index</span>
            <span class="stat-value">${democracyPct}%</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Corruption</span>
            <span class="stat-value" style="color: var(--${country.corruptionIndex > 0.5 ? 'danger' : country.corruptionIndex > 0.3 ? 'warning' : 'success'})">${corruptionPct}%</span>
          </div>
        </div>

        <!-- Military Card -->
        <div class="card">
          <h3>Military</h3>
          <div class="stat-row">
            <span class="stat-label">Total Strength</span>
            <span class="stat-value">${formatNumber(totalStrength)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Active Wars</span>
            <span class="stat-value" style="color: var(--${activeWars.length > 0 ? 'danger' : 'success'})">${activeWars.length}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">War Fatigue</span>
            <span class="stat-value">${warFatigue.toFixed(0)}</span>
          </div>
          <div class="progress-bar"><div class="progress-fill ${warFatigueColor}" style="width: ${Math.min(warFatigue, 100)}%"></div></div>
          <div class="stat-row" style="margin-top: 8px;">
            <span class="stat-label">Military Budget</span>
            <span class="stat-value">${formatMoney(country.militaryBudget || 0)}</span>
          </div>
        </div>

        <!-- Population Card -->
        <div class="card">
          <h3>Population</h3>
          <div class="stat-row">
            <span class="stat-label">Population</span>
            <span class="stat-value">${formatNumber(population)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Growth Rate</span>
            <span class="stat-value" style="color: var(--${popGrowth >= 0 ? 'success' : 'danger'})">${popGrowth >= 0 ? '+' : ''}${popGrowthStr}%</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Literacy</span>
            <span class="stat-value">${(literacy * 100).toFixed(1)}%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill blue" style="width: ${Math.min(literacy * 100, 100)}%"></div></div>
          <div class="stat-row" style="margin-top: 8px;">
            <span class="stat-label">Health Index</span>
            <span class="stat-value">${(healthIndex * 100).toFixed(1)}%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill green" style="width: ${Math.min(healthIndex * 100, 100)}%"></div></div>
          <div class="stat-row" style="margin-top: 8px;">
            <span class="stat-label">Unemployment</span>
            <span class="stat-value" style="color: var(--${unemployment > 0.15 ? 'danger' : unemployment > 0.08 ? 'warning' : 'success'})">${(unemployment * 100).toFixed(1)}%</span>
          </div>
        </div>

        <!-- Technology Card -->
        <div class="card">
          <h3>Technology</h3>
          <div class="stat-row">
            <span class="stat-label">Military Tech</span>
            <span class="stat-value">${techMilitary.toFixed(0)}</span>
          </div>
          <div class="progress-bar"><div class="progress-fill red" style="width: ${Math.min(techMilitary, 100)}%"></div></div>
          <div class="stat-row" style="margin-top: 8px;">
            <span class="stat-label">Civilian Tech</span>
            <span class="stat-value">${techCivilian.toFixed(0)}</span>
          </div>
          <div class="progress-bar"><div class="progress-fill blue" style="width: ${Math.min(techCivilian, 100)}%"></div></div>
          <div class="stat-row" style="margin-top: 8px;">
            <span class="stat-label">Industrial Tech</span>
            <span class="stat-value">${techIndustrial.toFixed(0)}</span>
          </div>
          <div class="progress-bar"><div class="progress-fill yellow" style="width: ${Math.min(techIndustrial, 100)}%"></div></div>
          <div class="stat-row" style="margin-top: 8px;">
            <span class="stat-label">Digital Tech</span>
            <span class="stat-value">${techDigital.toFixed(0)}</span>
          </div>
          <div class="progress-bar"><div class="progress-fill green" style="width: ${Math.min(techDigital, 100)}%"></div></div>
        </div>

        <!-- Espionage Card -->
        <div class="card">
          <h3>Espionage</h3>
          <div class="stat-row">
            <span class="stat-label">Agents</span>
            <span class="stat-value">${agentCount}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Counterintelligence</span>
            <span class="stat-value">${counterintelligence.toFixed(0)}</span>
          </div>
          <div class="progress-bar"><div class="progress-fill blue" style="width: ${Math.min(counterintelligence, 100)}%"></div></div>
          <div class="stat-row" style="margin-top: 8px;">
            <span class="stat-label">Active Operations</span>
            <span class="stat-value">${activeOps.length}</span>
          </div>
        </div>

      </div>

      <!-- Budget Overview -->
      <div class="card" style="margin-top: 12px;">
        <h3>Budget Overview</h3>
        <div class="stat-row" style="margin-bottom: 8px;">
          <span class="stat-label">Tax Revenue</span>
          <span class="stat-value">${(taxRate * 100).toFixed(1)}% of GDP</span>
        </div>
        <div class="stat-row" style="margin-bottom: 8px;">
          <span class="stat-label">Total Spending</span>
          <span class="stat-value">${(totalSpending * 100).toFixed(1)}% of GDP</span>
        </div>
        <div class="stat-row" style="margin-bottom: 12px;">
          <span class="stat-label">Balance</span>
          <span class="stat-value" style="color: var(--${budgetBalance >= 0 ? 'success' : 'danger'})">${budgetBalanceSign}${(budgetBalance * 100).toFixed(1)}% of GDP</span>
        </div>
        ${budgetItems.map(item => {
          const value = budget[item.key] || 0;
          const pctOfGDP = (value * 100).toFixed(1);
          const barWidth = totalSpending > 0 ? ((value / totalSpending) * 100).toFixed(1) : 0;
          return `
            <div style="margin-bottom: 6px;">
              <div class="stat-row">
                <span class="stat-label">${item.label}</span>
                <span class="stat-value">${pctOfGDP}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${barWidth}%; background: ${item.color};"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}
