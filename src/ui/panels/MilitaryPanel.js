import { formatNumber, formatMoney, formatPercent } from '../../engine/utils.js';

export class MilitaryPanel {
    constructor(engine) {
        this.engine = engine;
    }

    render(container) {
        const country = this.engine.getPlayerCountry();
        const military = this.engine.getSystem('military');
        const mil = country.military;

        const unitTypes = [
            { key: 'infantry', name: 'Пехота' },
            { key: 'armor', name: 'Бронетехника' },
            { key: 'air', name: 'Авиация' },
            { key: 'navy', name: 'Флот' },
            { key: 'missiles', name: 'Ракеты' },
            { key: 'nuclear', name: 'Ядерное оружие' }
        ];

        // Compute total strength from all unit contributions
        const totalStrength = unitTypes.reduce((sum, ut) => {
            const unit = mil.units[ut.key];
            if (!unit) return sum;
            return sum + (unit.count || 0) * (unit.equipmentLevel || 0) * (unit.training || 0) * (unit.morale || 0);
        }, 0);

        const militaryBudget = country.economy.budget.spending.military || 0;
        const warFatigue = mil.warFatigue || 0;
        const warFatigueColor = warFatigue <= 0.3 ? '#4caf50' : warFatigue <= 0.6 ? '#ff9800' : '#f44336';

        const wars = mil.wars || [];

        // Build list of hostile countries for war declaration dropdown
        const allCountries = this.engine.getCountries ? this.engine.getCountries() : [];
        const hostileCountries = allCountries.filter(c => {
            if (c.id === country.id) return false;
            const diplomacy = this.engine.getSystem('diplomacy');
            if (!diplomacy) return true;
            const relations = diplomacy.getRelations ? diplomacy.getRelations(country.id, c.id) : null;
            return relations !== null && relations < 0;
        });

        const defaultRecruitAmount = 1000;

        container.innerHTML = `
            <h2>Военное дело — ${country.name}</h2>

            <!-- Military Overview -->
            <div class="card">
                <h3>Обзор вооружённых сил</h3>
                <div class="card-grid">
                    <div class="stat-row">
                        <span class="stat-label">Общая боевая мощь</span>
                        <span class="stat-value">${formatNumber(totalStrength)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Военный бюджет</span>
                        <span class="stat-value">${formatPercent(militaryBudget)} ВВП</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Военная усталость</span>
                        <span class="stat-value" style="color: ${warFatigueColor}">
                            ${formatPercent(warFatigue)}
                        </span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${warFatigue * 100}%; background: ${warFatigueColor};"></div>
                    </div>
                </div>
            </div>

            <!-- Units Table -->
            <div class="card">
                <h3>Подразделения</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Тип</th>
                            <th>Количество</th>
                            <th>Снаряжение</th>
                            <th>Подготовка</th>
                            <th>Мораль</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${unitTypes.map(ut => {
                            const unit = mil.units[ut.key] || {};
                            const equipLevel = unit.equipmentLevel || 0;
                            const training = unit.training || 0;
                            const morale = unit.morale || 0;
                            return `
                                <tr>
                                    <td><strong>${ut.name}</strong></td>
                                    <td>${formatNumber(unit.count || 0)}</td>
                                    <td>
                                        <div class="progress-bar" style="width: 80px; display: inline-block; vertical-align: middle;">
                                            <div class="progress-fill" style="width: ${equipLevel * 100}%;"></div>
                                        </div>
                                        <span>${formatPercent(equipLevel)}</span>
                                    </td>
                                    <td>
                                        <div class="progress-bar" style="width: 80px; display: inline-block; vertical-align: middle;">
                                            <div class="progress-fill" style="width: ${training * 100}%;"></div>
                                        </div>
                                        <span>${formatPercent(training)}</span>
                                    </td>
                                    <td>
                                        <div class="progress-bar" style="width: 80px; display: inline-block; vertical-align: middle;">
                                            <div class="progress-fill" style="width: ${morale * 100}%;"></div>
                                        </div>
                                        <span>${formatPercent(morale)}</span>
                                    </td>
                                    <td>
                                        <button class="btn btn-primary recruit-btn" data-unit="${ut.key}">Набор</button>
                                        <button class="btn btn-primary upgrade-btn" data-unit="${ut.key}">Улучшить</button>
                                        <button class="btn btn-primary train-btn" data-unit="${ut.key}">Тренировать</button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Active Wars -->
            <div class="card">
                <h3>Активные конфликты</h3>
                ${wars.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Конфликт</th>
                                <th>Участники</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${wars.map(war => `
                                <tr>
                                    <td>${war.name || 'Война'}</td>
                                    <td>${(war.belligerents || []).join(', ')}</td>
                                    <td>${war.status || 'В ходе'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : `
                    <div class="stat-row">
                        <span class="stat-label">Нет активных конфликтов</span>
                    </div>
                `}
            </div>

            <!-- War Actions -->
            <div class="card">
                <h3>Военные действия</h3>
                <div class="stat-row">
                    <span class="stat-label">Объявить войну</span>
                </div>
                <div class="card-grid" style="align-items: center;">
                    <select class="btn war-target-select" style="padding: 8px; min-width: 200px;">
                        <option value="">-- Выберите страну --</option>
                        ${hostileCountries.map(c => `
                            <option value="${c.id}">${c.name}</option>
                        `).join('')}
                    </select>
                    <button class="btn btn-primary declare-war-btn">Объявить войну</button>
                </div>
            </div>
        `;

        // --- Event Listeners ---

        // Recruit buttons
        const recruitButtons = container.querySelectorAll('.recruit-btn');
        recruitButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const unitType = btn.dataset.unit;
                military.recruitUnits(country.id, unitType, defaultRecruitAmount);
            });
        });

        // Upgrade buttons
        const upgradeButtons = container.querySelectorAll('.upgrade-btn');
        upgradeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const unitType = btn.dataset.unit;
                military.upgradeUnits(country.id, unitType);
            });
        });

        // Train buttons
        const trainButtons = container.querySelectorAll('.train-btn');
        trainButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const unitType = btn.dataset.unit;
                military.trainUnits(country.id, unitType);
            });
        });

        // Declare war button
        const declareWarBtn = container.querySelector('.declare-war-btn');
        const warTargetSelect = container.querySelector('.war-target-select');
        if (declareWarBtn && warTargetSelect) {
            declareWarBtn.addEventListener('click', () => {
                const targetId = warTargetSelect.value;
                if (!targetId) return;
                military.declareWar(country.id, targetId);
            });
        }
    }
}
