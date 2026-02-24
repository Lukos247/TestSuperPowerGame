import { formatNumber, formatMoney, formatPercent } from '../../engine/utils.js';

export class EspionagePanel {
    constructor(engine) {
        this.engine = engine;
    }

    render(container) {
        const country = this.engine.getPlayerCountry();
        if (!country) {
            container.innerHTML = '<h2>Разведка</h2><p>Страна не выбрана.</p>';
            return;
        }

        const espionage = this.engine.getSystem('espionage');
        if (!espionage) {
            container.innerHTML = '<h2>Разведка</h2><p>Система разведки недоступна.</p>';
            return;
        }

        const agentCount = country.agentCount ?? 0;
        const counterintelligence = country.counterintelligence ?? 50;
        const intelligenceBudget = (country.budget?.intelligenceSpending ?? 0) * (country.gdp ?? 0);

        const allCountries = this.engine.getAllCountries().filter(c => c.id !== country.id);
        const activeOps = espionage.getActiveOperations(country.id);
        const completedOps = espionage.getCompletedOperations(country.id);

        // Active ops from us
        const agentsOnMissions = activeOps.length;
        const availableAgents = agentCount - agentsOnMissions;

        // Operation types for dropdown
        const operationTypes = [
            { key: 'intelligence', name: 'Разведка' },
            { key: 'sabotage', name: 'Саботаж' },
            { key: 'steal_tech', name: 'Кража технологий' },
            { key: 'destabilize', name: 'Дестабилизация' },
            { key: 'coup', name: 'Переворот' },
            { key: 'propaganda', name: 'Пропаганда' },
        ];

        // Result labels
        const resultLabels = {
            success: '<span style="color: #4caf50;">Успех</span>',
            failed: '<span style="color: #ff9800;">Провал</span>',
            caught: '<span style="color: #f44336;">Пойман</span>',
            cancelled: '<span style="color: #888;">Отменено</span>',
        };

        container.innerHTML = `
            <h2>Разведка — ${country.flag} ${country.name}</h2>

            <!-- Intelligence Overview -->
            <div class="card">
                <h3>Обзор разведки</h3>
                <div class="card-grid">
                    <div class="stat-row">
                        <span class="stat-label">Агентов всего</span>
                        <span class="stat-value">${agentCount}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">На миссиях</span>
                        <span class="stat-value">${agentsOnMissions}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Доступно</span>
                        <span class="stat-value">${availableAgents}</span>
                    </div>
                </div>
                <div style="margin-top: 8px;">
                    <div class="stat-row">
                        <span class="stat-label">Контрразведка</span>
                        <span class="stat-value">${counterintelligence.toFixed(0)}/100</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${counterintelligence}%; background: ${counterintelligence > 70 ? '#4caf50' : counterintelligence > 40 ? '#ff9800' : '#f44336'}"></div>
                    </div>
                </div>
                <div class="stat-row" style="margin-top: 8px;">
                    <span class="stat-label">Бюджет разведки</span>
                    <span class="stat-value">${formatMoney(intelligenceBudget)}</span>
                </div>
            </div>

            <!-- Launch Operation -->
            <div class="card">
                <h3>Запустить операцию</h3>
                <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end;">
                    <div>
                        <label style="display: block; margin-bottom: 4px; font-size: 0.9em; color: #aaa;">Цель</label>
                        <select id="espionage-target-select" style="padding: 6px 10px; border-radius: 4px; border: 1px solid #555; background: #1e1e1e; color: #eee; min-width: 180px;">
                            ${allCountries.map(c => `
                                <option value="${c.id}">${c.flag || ''} ${c.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 4px; font-size: 0.9em; color: #aaa;">Тип операции</label>
                        <select id="espionage-type-select" style="padding: 6px 10px; border-radius: 4px; border: 1px solid #555; background: #1e1e1e; color: #eee; min-width: 180px;">
                            ${operationTypes.map(op => `
                                <option value="${op.key}">${op.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div>
                        <button class="btn btn-primary" id="launch-operation-btn">Запустить</button>
                    </div>
                </div>
            </div>

            <!-- Active Operations -->
            <div class="card">
                <h3>Активные операции</h3>
                ${activeOps.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Цель</th>
                                <th>Тип</th>
                                <th>Прогресс</th>
                                <th>Осталось (мес.)</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${activeOps.map(op => {
                                const target = this.engine.getCountry(op.targetId);
                                const targetName = target ? (target.flag || '') + ' ' + target.name : op.targetId;
                                const totalDuration = op.totalDuration || 1;
                                const elapsed = totalDuration - op.remainingDuration;
                                const progressPct = (elapsed / totalDuration) * 100;
                                const detected = op.detected ? 'Обнаружено!' : 'Скрытно';
                                const detectedColor = op.detected ? '#f44336' : '#4caf50';

                                return `
                                    <tr>
                                        <td>${targetName}</td>
                                        <td>${op.name || op.type}</td>
                                        <td>
                                            <div class="progress-bar" style="min-width: 80px;">
                                                <div class="progress-fill" style="width: ${progressPct}%; background: #ffc107;"></div>
                                            </div>
                                        </td>
                                        <td>${op.remainingDuration}</td>
                                        <td style="color: ${detectedColor}">${detected}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                ` : '<p>Нет активных операций.</p>'}
            </div>

            <!-- Completed Operations -->
            <div class="card">
                <h3>Завершённые операции</h3>
                ${completedOps.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Цель</th>
                                <th>Тип</th>
                                <th>Результат</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${completedOps.slice(-20).reverse().map(op => {
                                const target = this.engine.getCountry(op.targetId);
                                const targetName = target ? (target.flag || '') + ' ' + target.name : op.targetId;
                                const resultLabel = resultLabels[op.result] || op.result;

                                return `
                                    <tr>
                                        <td>${targetName}</td>
                                        <td>${op.name || op.type}</td>
                                        <td>${resultLabel}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                ` : '<p>Нет завершённых операций.</p>'}
            </div>

            <!-- Counter-Intelligence -->
            <div class="card">
                <h3>Контрразведка</h3>
                <p style="color: #aaa; margin-bottom: 8px;">Усиление контрразведки временно повышает защиту от вражеских операций.</p>
                <button class="btn btn-primary" id="boost-counterintel-btn">Усилить контрразведку</button>
            </div>
        `;

        this.postRender(container);
    }

    postRender(container) {
        const country = this.engine.getPlayerCountry();
        if (!country) return;

        const espionage = this.engine.getSystem('espionage');
        if (!espionage) return;

        // Launch operation button
        const launchBtn = container.querySelector('#launch-operation-btn');
        if (launchBtn) {
            launchBtn.addEventListener('click', () => {
                const targetSelect = container.querySelector('#espionage-target-select');
                const typeSelect = container.querySelector('#espionage-type-select');

                if (!targetSelect || !typeSelect) return;

                const targetId = targetSelect.value;
                const operationType = typeSelect.value;

                const result = espionage.launchOperation(country.id, targetId, operationType);

                if (result && !result.success && result.reason) {
                    this.engine.notify(result.reason, 'warning', country.id);
                } else if (result && result.success) {
                    this.engine.notify(`Операция запущена!`, 'info', country.id);
                }

                this.render(container);
            });
        }

        // Boost counterintelligence button
        const boostBtn = container.querySelector('#boost-counterintel-btn');
        if (boostBtn) {
            boostBtn.addEventListener('click', () => {
                const result = espionage.boostCounterintel(country.id);

                if (result && !result.success && result.reason) {
                    this.engine.notify(result.reason, 'warning', country.id);
                } else if (result && result.success) {
                    this.engine.notify('Контрразведка усилена!', 'info', country.id);
                }

                this.render(container);
            });
        }
    }
}
