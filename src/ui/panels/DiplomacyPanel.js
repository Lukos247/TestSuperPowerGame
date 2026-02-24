import { formatNumber, formatMoney, formatPercent } from '../../engine/utils.js';

export class DiplomacyPanel {
    constructor(engine) {
        this.engine = engine;
        this.sortColumn = 'relations';
        this.sortAsc = false;
    }

    render(container) {
        const country = this.engine.getPlayerCountry();
        if (!country) {
            container.innerHTML = '<h2>Дипломатия</h2><p>Страна не выбрана.</p>';
            return;
        }

        const diplomacy = this.engine.getSystem('diplomacy');
        const military = this.engine.getSystem('military');
        const allCountries = this.engine.getAllCountries().filter(c => c.id !== country.id);

        // Sort countries
        const sorted = this._sortCountries(allCountries, country, diplomacy, military);

        // Active alliances
        const alliances = country.alliances || [];

        // Trade agreements
        const tradeAgreements = country.tradeAgreements || [];

        // Active sanctions (imposed on player and by player)
        const sanctionsOnPlayer = country.sanctions || [];
        const sanctionsByPlayer = diplomacy ? diplomacy.getSanctionsBy(country.id) : [];

        container.innerHTML = `
            <h2>Дипломатия — ${country.flag} ${country.name}</h2>

            <!-- Relations Table -->
            <div class="card">
                <h3>Отношения со странами</h3>
                <div style="overflow-x: auto;">
                    <table class="data-table" id="diplomacy-relations-table">
                        <thead>
                            <tr>
                                <th class="sortable-header" data-sort="name">Страна</th>
                                <th class="sortable-header" data-sort="relations">Отношения</th>
                                <th class="sortable-header" data-sort="ideology">Идеология</th>
                                <th class="sortable-header" data-sort="gdp">ВВП</th>
                                <th class="sortable-header" data-sort="military">Военная мощь</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sorted.map(c => {
                                const relation = diplomacy ? diplomacy.getRelation(country.id, c.id) : 0;
                                const relColor = relation > 0 ? '#4caf50' : relation < 0 ? '#f44336' : '#888';
                                const relSign = relation > 0 ? '+' : '';
                                const milStrength = military ? military.calculateMilitaryStrength(c) : 0;
                                const ideology = c.ideology || {};
                                const demLabel = (ideology.democracy ?? 0.5) > 0.6 ? 'Демократия' : (ideology.democracy ?? 0.5) < 0.4 ? 'Авторитаризм' : 'Смешанная';
                                const ecoLabel = (ideology.economy ?? 0.5) > 0.6 ? 'Рыночная' : (ideology.economy ?? 0.5) < 0.4 ? 'Плановая' : 'Смешанная';

                                return `
                                    <tr>
                                        <td>${c.flag || ''} ${c.name}</td>
                                        <td>
                                            <span style="color: ${relColor}; font-weight: bold;">${relSign}${relation.toFixed(0)}</span>
                                            <div class="relation-bar"><div class="relation-marker" style="left: ${(relation + 100) / 2}%"></div></div>
                                        </td>
                                        <td>${demLabel} / ${ecoLabel}</td>
                                        <td>${formatMoney(c.gdp || 0)}</td>
                                        <td>${formatNumber(milStrength)}</td>
                                        <td>
                                            <button class="btn btn-small btn-primary diplomacy-action" data-target="${c.id}" data-action="trade">Торговое соглашение</button>
                                            <button class="btn btn-small btn-primary diplomacy-action" data-target="${c.id}" data-action="alliance">Альянс</button>
                                            <button class="btn btn-small btn-danger diplomacy-action" data-target="${c.id}" data-action="sanctions">Санкции</button>
                                            <button class="btn btn-small btn-primary diplomacy-action" data-target="${c.id}" data-action="aid">Помощь</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Active Alliances -->
            <div class="card">
                <h3>Активные альянсы</h3>
                ${alliances.length > 0 ? `
                    <div class="card-grid">
                        ${alliances.map(a => `
                            <div style="padding: 8px; border: 1px solid #444; border-radius: 6px;">
                                <div class="stat-row">
                                    <span class="stat-label">Название</span>
                                    <span class="stat-value">${a.name || 'Безымянный альянс'}</span>
                                </div>
                                <div class="stat-row">
                                    <span class="stat-label">Тип</span>
                                    <span class="stat-value">${a.type === 'military' ? 'Военный' : a.type === 'economic' ? 'Экономический' : 'Политический'}</span>
                                </div>
                                <div class="stat-row">
                                    <span class="stat-label">Участники</span>
                                    <span class="stat-value">${(a.members || []).map(mId => {
                                        const mc = this.engine.getCountry(mId);
                                        return mc ? (mc.flag || '') + ' ' + mc.name : mId;
                                    }).join(', ')}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p>Нет активных альянсов.</p>'}
            </div>

            <!-- Trade Agreements -->
            <div class="card">
                <h3>Торговые соглашения</h3>
                ${tradeAgreements.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Партнёр</th>
                                <th>Бонус</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tradeAgreements.map(ta => {
                                const partner = this.engine.getCountry(ta.partnerId);
                                const partnerName = partner ? (partner.flag || '') + ' ' + partner.name : ta.partnerId;
                                return `
                                    <tr>
                                        <td>${partnerName}</td>
                                        <td>${formatPercent(ta.bonus || 0)}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                ` : '<p>Нет активных торговых соглашений.</p>'}
            </div>

            <!-- Active Sanctions -->
            <div class="card">
                <h3>Санкции</h3>

                <h4>Санкции против нас</h4>
                ${sanctionsOnPlayer.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Наложены</th>
                                <th>Тип</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sanctionsOnPlayer.map(s => {
                                const imposer = this.engine.getCountry(s.imposedBy);
                                const imposerName = imposer ? (imposer.flag || '') + ' ' + imposer.name : s.imposedBy;
                                const typeLabel = s.type === 'economic' ? 'Экономические' : s.type === 'arms' ? 'Оружейные' : 'Полные';
                                return `
                                    <tr>
                                        <td>${imposerName}</td>
                                        <td>${typeLabel}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                ` : '<p>Нет санкций против нас.</p>'}

                <h4 style="margin-top: 12px;">Наши санкции</h4>
                ${sanctionsByPlayer.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Цель</th>
                                <th>Тип</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sanctionsByPlayer.map(s => {
                                const target = this.engine.getCountry(s.targetId);
                                const targetName = target ? (target.flag || '') + ' ' + target.name : s.targetId;
                                const typeLabel = s.type === 'economic' ? 'Экономические' : s.type === 'arms' ? 'Оружейные' : 'Полные';
                                return `
                                    <tr>
                                        <td>${targetName}</td>
                                        <td>${typeLabel}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                ` : '<p>Мы не наложили санкций.</p>'}
            </div>
        `;

        this.postRender(container);
    }

    postRender(container) {
        const country = this.engine.getPlayerCountry();
        if (!country) return;

        const diplomacy = this.engine.getSystem('diplomacy');

        // Sort column headers
        const headers = container.querySelectorAll('.sortable-header');
        headers.forEach(header => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                const col = header.dataset.sort;
                if (this.sortColumn === col) {
                    this.sortAsc = !this.sortAsc;
                } else {
                    this.sortColumn = col;
                    this.sortAsc = false;
                }
                this.render(container);
            });
        });

        // Diplomacy action buttons
        const actionButtons = container.querySelectorAll('.diplomacy-action');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const action = btn.dataset.action;

                if (!diplomacy) return;

                let result;
                switch (action) {
                    case 'trade':
                        result = diplomacy.proposeTradeAgreement(country.id, targetId);
                        break;
                    case 'alliance':
                        result = diplomacy.proposeAlliance(country.id, targetId, 'political');
                        break;
                    case 'sanctions':
                        result = diplomacy.imposeSanctions(country.id, targetId, 'economic');
                        break;
                    case 'aid':
                        const aidAmount = (country.gdp || 1e9) * 0.001;
                        result = diplomacy.sendAid(country.id, targetId, aidAmount);
                        break;
                }

                if (result && !result.success && result.reason) {
                    this.engine.notify(result.reason, 'warning', country.id);
                }

                this.render(container);
            });
        });
    }

    _sortCountries(countries, playerCountry, diplomacy, military) {
        const sorted = [...countries];
        sorted.sort((a, b) => {
            let valA, valB;
            switch (this.sortColumn) {
                case 'name':
                    valA = a.name || '';
                    valB = b.name || '';
                    return this.sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
                case 'relations':
                    valA = diplomacy ? diplomacy.getRelation(playerCountry.id, a.id) : 0;
                    valB = diplomacy ? diplomacy.getRelation(playerCountry.id, b.id) : 0;
                    break;
                case 'ideology':
                    valA = (a.ideology?.democracy ?? 0.5);
                    valB = (b.ideology?.democracy ?? 0.5);
                    break;
                case 'gdp':
                    valA = a.gdp || 0;
                    valB = b.gdp || 0;
                    break;
                case 'military':
                    valA = military ? military.calculateMilitaryStrength(a) : 0;
                    valB = military ? military.calculateMilitaryStrength(b) : 0;
                    break;
                default:
                    valA = 0;
                    valB = 0;
            }
            return this.sortAsc ? valA - valB : valB - valA;
        });
        return sorted;
    }
}
