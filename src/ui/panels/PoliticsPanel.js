import { formatNumber, formatMoney, formatPercent } from '../../engine/utils.js';

export class PoliticsPanel {
    constructor(engine) {
        this.engine = engine;
    }

    render(container) {
        const country = this.engine.getPlayerCountry();
        const politics = this.engine.getSystem('politics');
        const pol = country.politics;

        const approval = pol.approval || 0;
        const stability = pol.stability || 0;
        const democracyIndex = pol.democracyIndex || 0;
        const corruptionIndex = pol.corruptionIndex || 0;

        const approvalColor = approval >= 0.6 ? '#4caf50' : approval >= 0.4 ? '#ff9800' : '#f44336';
        const stabilityColor = stability >= 0.6 ? '#4caf50' : stability >= 0.4 ? '#ff9800' : '#f44336';

        // Ideology positions (range -1 to 1, normalized to 0-100 for display)
        const demAutPosition = pol.ideology?.democracyAutocracy ?? 0;
        const demAutPercent = ((demAutPosition + 1) / 2) * 100;
        const econPosition = pol.ideology?.plannedFreemarket ?? 0;
        const econPercent = ((econPosition + 1) / 2) * 100;

        const parties = pol.parties || [];

        const policies = [
            { key: 'anti_corruption', name: 'Борьба с коррупцией' },
            { key: 'martial_law', name: 'Военное положение' },
            { key: 'press_freedom', name: 'Свобода прессы' },
            { key: 'censorship', name: 'Цензура' },
            { key: 'lower_taxes', name: 'Снизить налоги' },
            { key: 'raise_taxes', name: 'Повысить налоги' }
        ];

        const showProtestWarning = approval < 0.25;
        const showCoupWarning = stability < 0.3;

        container.innerHTML = `
            <h2>Политика — ${country.name}</h2>

            <!-- Government Overview -->
            <div class="card">
                <h3>Обзор правительства</h3>
                <div class="card-grid">
                    <div class="stat-row">
                        <span class="stat-label">Рейтинг одобрения</span>
                        <span class="stat-value" style="color: ${approvalColor}">
                            ${formatPercent(approval)}
                        </span>
                    </div>
                    <div class="progress-bar" style="height: 24px;">
                        <div class="progress-fill" style="width: ${approval * 100}%; background: ${approvalColor};"></div>
                    </div>

                    <div class="stat-row">
                        <span class="stat-label">Стабильность</span>
                        <span class="stat-value" style="color: ${stabilityColor}">
                            ${formatPercent(stability)}
                        </span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${stability * 100}%; background: ${stabilityColor};"></div>
                    </div>

                    <div class="stat-row">
                        <span class="stat-label">Индекс демократии</span>
                        <span class="stat-value">${formatNumber(democracyIndex * 10, 1)} / 10</span>
                    </div>

                    <div class="stat-row">
                        <span class="stat-label">Индекс коррупции</span>
                        <span class="stat-value">${formatPercent(corruptionIndex)}</span>
                    </div>
                </div>
            </div>

            <!-- Ideology -->
            <div class="card">
                <h3>Идеология</h3>

                <div class="stat-row">
                    <span class="stat-label">Демократия</span>
                    <span class="stat-label" style="text-align: right;">Автократия</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${demAutPercent}%; background: linear-gradient(to right, #2196f3, #f44336);"></div>
                </div>

                <div class="stat-row" style="margin-top: 12px;">
                    <span class="stat-label">Плановая экономика</span>
                    <span class="stat-label" style="text-align: right;">Свободный рынок</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${econPercent}%; background: linear-gradient(to right, #e91e63, #4caf50);"></div>
                </div>
            </div>

            <!-- Parties -->
            <div class="card">
                <h3>Политические партии</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Партия</th>
                            <th>Поддержка</th>
                            <th>Идеология</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${parties.length > 0 ? parties.map(party => `
                            <tr>
                                <td>${party.name}</td>
                                <td>${formatPercent(party.support || 0)}</td>
                                <td>${party.ideology || '—'}</td>
                            </tr>
                        `).join('') : `
                            <tr>
                                <td colspan="3" style="text-align: center;">Нет данных о партиях</td>
                            </tr>
                        `}
                    </tbody>
                </table>
            </div>

            <!-- Policies -->
            <div class="card">
                <h3>Политические решения</h3>
                <div class="card-grid">
                    ${policies.map(policy => `
                        <button class="btn btn-primary policy-btn" data-policy="${policy.key}">
                            ${policy.name}
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- Stability Warnings -->
            ${showProtestWarning || showCoupWarning ? `
                <div class="card" style="border-left: 4px solid #f44336;">
                    <h3 style="color: #f44336;">Предупреждения</h3>
                    ${showProtestWarning ? `
                        <div class="stat-row" style="background: rgba(244, 67, 54, 0.1); padding: 12px; border-radius: 4px; margin-bottom: 8px;">
                            <span class="stat-label" style="color: #f44336; font-weight: bold;">
                                ⚠ Крайне низкий рейтинг одобрения! Высокий риск массовых протестов и гражданских беспорядков.
                            </span>
                        </div>
                    ` : ''}
                    ${showCoupWarning ? `
                        <div class="stat-row" style="background: rgba(244, 67, 54, 0.1); padding: 12px; border-radius: 4px;">
                            <span class="stat-label" style="color: #f44336; font-weight: bold;">
                                ⚠ Критический уровень стабильности! Возможен государственный переворот.
                            </span>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
        `;

        // --- Event Listeners ---

        // Policy buttons
        const policyButtons = container.querySelectorAll('.policy-btn');
        policyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const policyName = btn.dataset.policy;
                politics.enactPolicy(country.id, policyName);
            });
        });
    }
}
