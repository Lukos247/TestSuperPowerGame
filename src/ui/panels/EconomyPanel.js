import { formatNumber, formatMoney, formatPercent } from '../../engine/utils.js';

export class EconomyPanel {
    constructor(engine) {
        this.engine = engine;
    }

    render(container) {
        const country = this.engine.getPlayerCountry();
        const economy = this.engine.getSystem('economy');
        const eco = country.economy;
        const budget = eco.budget;

        const gdpGrowth = eco.gdpGrowth || 0;
        const gdpGrowthColor = gdpGrowth >= 0 ? '#4caf50' : '#f44336';
        const gdpGrowthSign = gdpGrowth >= 0 ? '+' : '';
        const gdpPerCapita = country.population > 0 ? eco.gdp / country.population : 0;

        const sectors = [
            { key: 'agriculture', name: 'Сельское хозяйство', data: eco.sectors.agriculture },
            { key: 'industry', name: 'Промышленность', data: eco.sectors.industry },
            { key: 'services', name: 'Услуги', data: eco.sectors.services },
            { key: 'tech', name: 'Технологии', data: eco.sectors.tech }
        ];

        const spendingCategories = [
            { key: 'military', name: 'Военные расходы' },
            { key: 'education', name: 'Образование' },
            { key: 'healthcare', name: 'Здравоохранение' },
            { key: 'infrastructure', name: 'Инфраструктура' },
            { key: 'social', name: 'Социальные расходы' },
            { key: 'science', name: 'Наука' },
            { key: 'intelligence', name: 'Разведка' }
        ];

        const totalRevenue = eco.gdp * (budget.taxRate || 0.2);
        const totalSpending = spendingCategories.reduce((sum, cat) => {
            return sum + (budget.spending[cat.key] || 0);
        }, 0);
        const budgetBalance = totalRevenue - (totalSpending * eco.gdp);
        const balanceColor = budgetBalance >= 0 ? '#4caf50' : '#f44336';
        const balanceLabel = budgetBalance >= 0 ? 'Профицит' : 'Дефицит';

        container.innerHTML = `
            <h2>Экономика — ${country.name}</h2>

            <!-- GDP Overview -->
            <div class="card">
                <h3>Обзор ВВП</h3>
                <div class="card-grid">
                    <div class="stat-row">
                        <span class="stat-label">ВВП</span>
                        <span class="stat-value">${formatMoney(eco.gdp)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Рост ВВП</span>
                        <span class="stat-value" style="color: ${gdpGrowthColor}">
                            ${gdpGrowthSign}${formatPercent(gdpGrowth)}
                        </span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">ВВП на душу населения</span>
                        <span class="stat-value">${formatMoney(gdpPerCapita)}</span>
                    </div>
                </div>
            </div>

            <!-- Sectors -->
            <div class="card">
                <h3>Секторы экономики</h3>
                <div class="card-grid">
                    ${sectors.map(sector => `
                        <div class="sector-bar">
                            <h4>${sector.name}</h4>
                            <div class="stat-row">
                                <span class="stat-label">Уровень</span>
                                <span class="stat-value">${formatNumber(sector.data.level)}</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${Math.min(sector.data.level, 100)}%"></div>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Доля выпуска</span>
                                <span class="stat-value">${formatPercent(sector.data.output || 0)}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Занятость</span>
                                <span class="stat-value">${formatPercent(sector.data.employment || 0)}</span>
                            </div>
                            <button class="btn btn-primary invest-btn" data-sector="${sector.key}">
                                Инвестировать
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Budget Management -->
            <div class="card">
                <h3>Управление бюджетом</h3>

                <!-- Revenue -->
                <h4>Доходы</h4>
                <div class="budget-item">
                    <div class="slider-container">
                        <span class="stat-label">Ставка налога</span>
                        <input type="range" class="tax-rate-slider" min="0.05" max="0.6" step="0.01"
                               value="${budget.taxRate || 0.2}">
                        <span class="stat-value tax-rate-display">${formatPercent(budget.taxRate || 0.2)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Общий доход</span>
                        <span class="stat-value">${formatMoney(totalRevenue)}</span>
                    </div>
                </div>

                <!-- Spending -->
                <h4>Расходы</h4>
                ${spendingCategories.map(cat => `
                    <div class="budget-item">
                        <div class="slider-container">
                            <span class="stat-label">${cat.name}</span>
                            <input type="range" class="spending-slider" data-category="${cat.key}"
                                   min="0" max="0.2" step="0.005"
                                   value="${budget.spending[cat.key] || 0}">
                            <span class="stat-value spending-display" data-category="${cat.key}">
                                ${formatPercent(budget.spending[cat.key] || 0)}
                            </span>
                        </div>
                    </div>
                `).join('')}

                <!-- Balance -->
                <div class="stat-row" style="margin-top: 16px; font-weight: bold;">
                    <span class="stat-label">${balanceLabel}</span>
                    <span class="stat-value" style="color: ${balanceColor}">
                        ${formatMoney(Math.abs(budgetBalance))}
                    </span>
                </div>
            </div>

            <!-- Financial Indicators -->
            <div class="card">
                <h3>Финансовые показатели</h3>
                <div class="card-grid">
                    <div class="stat-row">
                        <span class="stat-label">Государственный долг</span>
                        <span class="stat-value">${formatMoney(eco.debt || 0)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Долг / ВВП</span>
                        <span class="stat-value">
                            ${eco.gdp > 0 ? formatPercent((eco.debt || 0) / eco.gdp) : '0%'}
                        </span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Валютные резервы</span>
                        <span class="stat-value">${formatMoney(eco.foreignReserves || 0)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Торговый баланс</span>
                        <span class="stat-value">${formatMoney(eco.tradeBalance || 0)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Инфляция</span>
                        <span class="stat-value">${formatPercent(eco.inflation || 0)}</span>
                    </div>
                </div>
            </div>
        `;

        // --- Event Listeners ---

        // Tax rate slider
        const taxSlider = container.querySelector('.tax-rate-slider');
        const taxDisplay = container.querySelector('.tax-rate-display');
        if (taxSlider) {
            taxSlider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                taxDisplay.textContent = formatPercent(value);
                economy.setTaxRate(country.id, value);
            });
        }

        // Spending sliders
        const spendingSliders = container.querySelectorAll('.spending-slider');
        spendingSliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const category = e.target.dataset.category;
                const value = parseFloat(e.target.value);
                const display = container.querySelector(`.spending-display[data-category="${category}"]`);
                if (display) {
                    display.textContent = formatPercent(value);
                }
                economy.setBudgetAllocation(country.id, category, value);
            });
        });

        // Invest buttons
        const investButtons = container.querySelectorAll('.invest-btn');
        investButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const sector = btn.dataset.sector;
                economy.investInSector(country.id, sector);
            });
        });
    }
}
