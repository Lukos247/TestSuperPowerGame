import { formatNumber, formatMoney, formatPercent } from '../../engine/utils.js';

export class PopulationPanel {
    constructor(engine) {
        this.engine = engine;
    }

    render(container) {
        const country = this.engine.getPlayerCountry();
        if (!country) {
            container.innerHTML = '<h2>Население</h2><p>Страна не выбрана.</p>';
            return;
        }

        const popSystem = this.engine.getSystem('population');
        const stats = popSystem ? popSystem.getPopulationStats(country.id) : null;

        const population = stats ? stats.population : (country.population || 0);
        const growthRate = stats ? stats.populationGrowth : (country.populationGrowth || 0);
        const literacy = stats ? stats.literacy : (country.literacy || 0.5);
        const healthIndex = stats ? stats.healthIndex : (country.healthIndex || 0.5);
        const unemployment = stats ? stats.unemployment : (country.unemployment || 0.08);

        const workforce = stats ? stats.workforce : null;
        const totalWorkforce = workforce ? workforce.total : Math.round(population * 0.65);
        const employed = workforce ? workforce.employed : Math.round(totalWorkforce * (1 - unemployment));
        const unemployed = workforce ? workforce.unemployed : totalWorkforce - employed;
        const unemploymentRate = workforce ? workforce.unemploymentRate : unemployment;

        const migration = stats ? stats.migration : { emigrants: 0, immigrants: 0, netMigration: 0 };
        const emigrationRate = country.emigrationRate || 0;
        const immigrationPull = population > 0 && migration.immigrants > 0 ? (migration.immigrants * 12) / population : 0;
        const netMigration = migration.netMigration || 0;

        const education = stats ? stats.education : { spending: 0.5, researchMultiplier: 1.0, productivityMultiplier: 1.0 };
        const health = stats ? stats.health : { spending: 0.5, epidemic: null };

        // Projected population in 10 years (simple compound)
        const projectedPop = population * Math.pow(1 + growthRate, 10);

        // Life expectancy estimate based on health index
        const lifeExpectancy = Math.round(55 + healthIndex * 35);

        // Unemployment color
        const unemploymentColor = unemploymentRate > 0.15 ? '#f44336' : unemploymentRate > 0.08 ? '#ff9800' : '#4caf50';

        // Growth rate color
        const growthColor = growthRate >= 0 ? '#4caf50' : '#f44336';
        const growthSign = growthRate >= 0 ? '+' : '';

        // Net migration color
        const netMigColor = netMigration >= 0 ? '#4caf50' : '#f44336';
        const netMigSign = netMigration >= 0 ? '+' : '';

        container.innerHTML = `
            <h2>Население — ${country.flag} ${country.name}</h2>

            <!-- Demographics -->
            <div class="card">
                <h3>Демография</h3>
                <div class="card-grid">
                    <div class="stat-row">
                        <span class="stat-label">Население</span>
                        <span class="stat-value">${formatNumber(population)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Темп роста (год)</span>
                        <span class="stat-value" style="color: ${growthColor}">
                            ${growthSign}${formatPercent(growthRate)}
                        </span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Прогноз на 10 лет</span>
                        <span class="stat-value">${formatNumber(projectedPop)}</span>
                    </div>
                </div>
            </div>

            <!-- Workforce -->
            <div class="card">
                <h3>Рабочая сила</h3>
                <div class="card-grid">
                    <div class="stat-row">
                        <span class="stat-label">Всего трудоспособных</span>
                        <span class="stat-value">${formatNumber(totalWorkforce)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Занятые</span>
                        <span class="stat-value">${formatNumber(employed)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Безработные</span>
                        <span class="stat-value" style="color: ${unemploymentColor}">${formatNumber(unemployed)}</span>
                    </div>
                </div>
                <div style="margin-top: 8px;">
                    <div class="stat-row">
                        <span class="stat-label">Уровень безработицы</span>
                        <span class="stat-value" style="color: ${unemploymentColor}">${formatPercent(unemploymentRate)}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(unemploymentRate * 100, 100)}%; background: ${unemploymentColor}"></div>
                    </div>
                </div>
                ${workforce && workforce.epidemicPenalty > 0 ? `
                    <div class="stat-row" style="margin-top: 4px;">
                        <span class="stat-label">Штраф от эпидемии</span>
                        <span class="stat-value" style="color: #f44336">+${formatPercent(workforce.epidemicPenalty)}</span>
                    </div>
                ` : ''}
            </div>

            <!-- Education -->
            <div class="card">
                <h3>Образование</h3>
                <div class="stat-row">
                    <span class="stat-label">Грамотность</span>
                    <span class="stat-value">${formatPercent(literacy)}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${literacy * 100}%; background: #2196f3"></div>
                </div>
                <div class="card-grid" style="margin-top: 8px;">
                    <div class="stat-row">
                        <span class="stat-label">Расходы на образование</span>
                        <span class="stat-value">${formatPercent(education.spending)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Множитель исследований</span>
                        <span class="stat-value">${education.researchMultiplier.toFixed(2)}x</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Множитель продуктивности</span>
                        <span class="stat-value">${education.productivityMultiplier.toFixed(2)}x</span>
                    </div>
                </div>
            </div>

            <!-- Health -->
            <div class="card">
                <h3>Здоровье</h3>
                <div class="stat-row">
                    <span class="stat-label">Индекс здоровья</span>
                    <span class="stat-value">${formatPercent(healthIndex)}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${healthIndex * 100}%; background: ${healthIndex > 0.6 ? '#4caf50' : healthIndex > 0.35 ? '#ff9800' : '#f44336'}"></div>
                </div>
                <div class="card-grid" style="margin-top: 8px;">
                    <div class="stat-row">
                        <span class="stat-label">Ожидаемая продолжительность жизни</span>
                        <span class="stat-value">${lifeExpectancy} лет</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Расходы на здравоохранение</span>
                        <span class="stat-value">${formatPercent(health.spending)}</span>
                    </div>
                </div>
                ${health.epidemic ? `
                    <div style="margin-top: 8px; padding: 8px; border: 1px solid #f44336; border-radius: 6px; background: rgba(244,67,54,0.1);">
                        <div class="stat-row">
                            <span class="stat-label" style="color: #f44336;">Эпидемия!</span>
                            <span class="stat-value" style="color: #f44336;">Тяжесть: ${(health.epidemic.severity * 100).toFixed(0)}%</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Осталось месяцев</span>
                            <span class="stat-value">${health.epidemic.monthsRemaining}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Штраф рабочей силе</span>
                            <span class="stat-value">${formatPercent(health.epidemic.workforcePenalty)}</span>
                        </div>
                    </div>
                ` : ''}
            </div>

            <!-- Migration -->
            <div class="card">
                <h3>Миграция</h3>
                <div class="card-grid">
                    <div class="stat-row">
                        <span class="stat-label">Эмиграция (мес.)</span>
                        <span class="stat-value" style="color: #f44336">${formatNumber(migration.emigrants)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Иммиграция (мес.)</span>
                        <span class="stat-value" style="color: #4caf50">${formatNumber(migration.immigrants)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Чистая миграция (мес.)</span>
                        <span class="stat-value" style="color: ${netMigColor}">${netMigSign}${formatNumber(netMigration)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Темп эмиграции (год)</span>
                        <span class="stat-value">${formatPercent(emigrationRate)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Темп иммиграции (год)</span>
                        <span class="stat-value">${formatPercent(immigrationPull)}</span>
                    </div>
                </div>
            </div>

            <!-- Quality of Life Indicators -->
            <div class="card">
                <h3>Качество жизни</h3>
                <div class="card-grid">
                    <div>
                        <div class="stat-row">
                            <span class="stat-label">Грамотность</span>
                            <span class="stat-value">${formatPercent(literacy)}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${literacy * 100}%; background: #2196f3"></div>
                        </div>
                    </div>
                    <div>
                        <div class="stat-row">
                            <span class="stat-label">Здоровье</span>
                            <span class="stat-value">${formatPercent(healthIndex)}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${healthIndex * 100}%; background: #4caf50"></div>
                        </div>
                    </div>
                    <div>
                        <div class="stat-row">
                            <span class="stat-label">Занятость</span>
                            <span class="stat-value">${formatPercent(1 - unemploymentRate)}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(1 - unemploymentRate) * 100}%; background: #ff9800"></div>
                        </div>
                    </div>
                    <div>
                        <div class="stat-row">
                            <span class="stat-label">Стабильность</span>
                            <span class="stat-value">${formatPercent(country.stabilityIndex ?? country.stability ?? 0.5)}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(country.stabilityIndex ?? country.stability ?? 0.5) * 100}%; background: #9c27b0"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.postRender(container);
    }

    postRender(container) {
        // PopulationPanel is informational; no interactive event listeners needed.
        // This method exists for interface consistency with other panels.
    }
}
