import { formatNumber, formatMoney, formatPercent } from '../../engine/utils.js';

export class WorldPanel {
    constructor(engine) {
        this.engine = engine;
        this.activeRanking = 'gdp';
    }

    render(container) {
        const country = this.engine.getPlayerCountry();
        if (!country) {
            container.innerHTML = '<h2>Мировой обзор</h2><p>Страна не выбрана.</p>';
            return;
        }

        const allCountries = this.engine.getAllCountries();
        const military = this.engine.getSystem('military');
        const technology = this.engine.getSystem('technology');

        // --- Compute rankings ---
        const rankByGdp = [...allCountries].sort((a, b) => (b.gdp || 0) - (a.gdp || 0)).slice(0, 20);
        const rankByMilitary = [...allCountries].sort((a, b) => {
            const sA = military ? military.calculateMilitaryStrength(a) : 0;
            const sB = military ? military.calculateMilitaryStrength(b) : 0;
            return sB - sA;
        }).slice(0, 20);
        const rankByPopulation = [...allCountries].sort((a, b) => (b.population || 0) - (a.population || 0)).slice(0, 20);

        const rankByTech = [...allCountries].sort((a, b) => {
            const avgA = this._getAvgTechLevel(a);
            const avgB = this._getAvgTechLevel(b);
            return avgB - avgA;
        }).slice(0, 20);

        const rankByStability = [...allCountries].sort((a, b) => {
            const sA = a.stabilityIndex ?? a.stability ?? 0.5;
            const sB = b.stabilityIndex ?? b.stability ?? 0.5;
            return sB - sA;
        }).slice(0, 20);

        // --- Global Stats ---
        let totalWorldPop = 0;
        let totalGdp = 0;
        let totalGdpGrowth = 0;
        let totalDemocracy = 0;
        let countCountries = allCountries.length;

        for (const c of allCountries) {
            totalWorldPop += c.population || 0;
            totalGdp += c.gdp || 0;
            totalGdpGrowth += c.gdpGrowth ?? c.economy?.gdpGrowth ?? 0;
            totalDemocracy += c.democracyIndex ?? (c.ideology?.democracy ?? 0.5);
        }

        const avgGdpGrowth = countCountries > 0 ? totalGdpGrowth / countCountries : 0;
        const avgDemocracy = countCountries > 0 ? totalDemocracy / countCountries : 0.5;

        // Active wars
        const activeWars = military ? military.wars.filter(w => !w.ended) : [];

        // Ranking tabs config
        const rankingTabs = {
            gdp: 'ВВП',
            military: 'Военная мощь',
            population: 'Население',
            tech: 'Технологии',
            stability: 'Стабильность'
        };

        // Build active ranking table
        let rankingRows = '';
        let rankingHeader = '';

        switch (this.activeRanking) {
            case 'gdp':
                rankingHeader = '<th>#</th><th>Страна</th><th>ВВП</th>';
                rankingRows = rankByGdp.map((c, i) => `
                    <tr${c.id === country.id ? ' style="background: rgba(33,150,243,0.15);"' : ''}>
                        <td>${i + 1}</td>
                        <td>${c.flag || ''} ${c.name}</td>
                        <td>${formatMoney(c.gdp || 0)}</td>
                    </tr>
                `).join('');
                break;

            case 'military':
                rankingHeader = '<th>#</th><th>Страна</th><th>Военная мощь</th>';
                rankingRows = rankByMilitary.map((c, i) => {
                    const str = military ? military.calculateMilitaryStrength(c) : 0;
                    return `
                        <tr${c.id === country.id ? ' style="background: rgba(33,150,243,0.15);"' : ''}>
                            <td>${i + 1}</td>
                            <td>${c.flag || ''} ${c.name}</td>
                            <td>${formatNumber(str)}</td>
                        </tr>
                    `;
                }).join('');
                break;

            case 'population':
                rankingHeader = '<th>#</th><th>Страна</th><th>Население</th>';
                rankingRows = rankByPopulation.map((c, i) => `
                    <tr${c.id === country.id ? ' style="background: rgba(33,150,243,0.15);"' : ''}>
                        <td>${i + 1}</td>
                        <td>${c.flag || ''} ${c.name}</td>
                        <td>${formatNumber(c.population || 0)}</td>
                    </tr>
                `).join('');
                break;

            case 'tech':
                rankingHeader = '<th>#</th><th>Страна</th><th>Средний ур. технологий</th>';
                rankingRows = rankByTech.map((c, i) => {
                    const avg = this._getAvgTechLevel(c);
                    return `
                        <tr${c.id === country.id ? ' style="background: rgba(33,150,243,0.15);"' : ''}>
                            <td>${i + 1}</td>
                            <td>${c.flag || ''} ${c.name}</td>
                            <td>${avg.toFixed(1)}%</td>
                        </tr>
                    `;
                }).join('');
                break;

            case 'stability':
                rankingHeader = '<th>#</th><th>Страна</th><th>Стабильность</th>';
                rankingRows = rankByStability.map((c, i) => {
                    const stab = c.stabilityIndex ?? c.stability ?? 0.5;
                    return `
                        <tr${c.id === country.id ? ' style="background: rgba(33,150,243,0.15);"' : ''}>
                            <td>${i + 1}</td>
                            <td>${c.flag || ''} ${c.name}</td>
                            <td>${formatPercent(stab)}</td>
                        </tr>
                    `;
                }).join('');
                break;
        }

        container.innerHTML = `
            <h2>Мировой обзор</h2>

            <!-- Global Stats -->
            <div class="card">
                <h3>Глобальная статистика</h3>
                <div class="card-grid">
                    <div class="stat-row">
                        <span class="stat-label">Мировое население</span>
                        <span class="stat-value">${formatNumber(totalWorldPop)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Мировой ВВП</span>
                        <span class="stat-value">${formatMoney(totalGdp)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Средний рост ВВП</span>
                        <span class="stat-value" style="color: ${avgGdpGrowth >= 0 ? '#4caf50' : '#f44336'}">
                            ${avgGdpGrowth >= 0 ? '+' : ''}${formatPercent(avgGdpGrowth)}
                        </span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Средний индекс демократии</span>
                        <span class="stat-value">${formatPercent(avgDemocracy)}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Активные войны</span>
                        <span class="stat-value" style="color: ${activeWars.length > 0 ? '#f44336' : '#4caf50'}">${activeWars.length}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Количество стран</span>
                        <span class="stat-value">${countCountries}</span>
                    </div>
                </div>
            </div>

            <!-- World Rankings -->
            <div class="card">
                <h3>Мировые рейтинги (топ-20)</h3>

                <!-- Sub-tabs for ranking categories -->
                <div class="sub-tabs">
                    ${Object.keys(rankingTabs).map(key => `
                        <div class="sub-tab ${this.activeRanking === key ? 'active' : ''}" data-ranking="${key}">
                            ${rankingTabs[key]}
                        </div>
                    `).join('')}
                </div>

                <div style="overflow-x: auto; margin-top: 12px;">
                    <table class="data-table">
                        <thead>
                            <tr>${rankingHeader}</tr>
                        </thead>
                        <tbody>
                            ${rankingRows}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Active Conflicts -->
            <div class="card">
                <h3>Активные конфликты</h3>
                ${activeWars.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Нападающие</th>
                                <th>Защищающиеся</th>
                                <th>Начало</th>
                                <th>Битвы</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${activeWars.map(war => {
                                const attackerNames = war.attackers.map(id => {
                                    const c = this.engine.getCountry(id);
                                    return c ? (c.flag || '') + ' ' + c.name : id;
                                }).join(', ');
                                const defenderNames = war.defenders.map(id => {
                                    const c = this.engine.getCountry(id);
                                    return c ? (c.flag || '') + ' ' + c.name : id;
                                }).join(', ');
                                const startDate = war.startDate ? `${war.startDate.month}/${war.startDate.year}` : '?';
                                const battleCount = war.battles ? war.battles.length : 0;

                                return `
                                    <tr>
                                        <td>${attackerNames}</td>
                                        <td>${defenderNames}</td>
                                        <td>${startDate}</td>
                                        <td>${battleCount}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                ` : '<p>В мире нет активных конфликтов.</p>'}
            </div>
        `;

        this.postRender(container);
    }

    postRender(container) {
        // Sub-tab switching for rankings
        const subTabs = container.querySelectorAll('.sub-tab');
        subTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.activeRanking = tab.dataset.ranking;
                this.render(container);
            });
        });
    }

    _getAvgTechLevel(country) {
        const tl = country.techLevel;
        if (!tl) return 0;
        const branches = ['military', 'civilian', 'industrial', 'digital'];
        let sum = 0;
        let count = 0;
        for (const b of branches) {
            if (tl[b] != null) {
                sum += tl[b];
                count++;
            }
        }
        return count > 0 ? sum / count : 0;
    }
}
