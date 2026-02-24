import { formatNumber, formatMoney, formatPercent } from '../../engine/utils.js';

export class TechnologyPanel {
    constructor(engine) {
        this.engine = engine;
        this.activeBranch = 'military';
    }

    render(container) {
        const country = this.engine.getPlayerCountry();
        if (!country) {
            container.innerHTML = '<h2>Технологии</h2><p>Страна не выбрана.</p>';
            return;
        }

        const tech = this.engine.getSystem('technology');
        if (!tech) {
            container.innerHTML = '<h2>Технологии</h2><p>Система технологий недоступна.</p>';
            return;
        }

        const status = tech.getResearchStatus(country.id);
        const techLevel = status ? status.techLevel : { military: 0, civilian: 0, industrial: 0, digital: 0 };
        const currentResearch = status ? status.currentResearch : null;
        const researchSpeed = status ? status.researchSpeed : 1.0;
        const estimatedMonths = status ? status.estimatedMonths : null;
        const researchedTechs = country.researchedTechs || new Set();

        const branchNames = {
            military: 'Военные',
            civilian: 'Гражданские',
            industrial: 'Промышленные',
            digital: 'Цифровые'
        };

        const branchColors = {
            military: '#f44336',
            civilian: '#4caf50',
            industrial: '#ff9800',
            digital: '#2196f3'
        };

        // Get current research tech details
        let currentTechName = '';
        let currentTechBranch = '';
        let currentProgress = 0;
        if (currentResearch) {
            const techDef = tech._findTech(currentResearch.techId);
            currentTechName = techDef ? techDef.name : currentResearch.techId;
            currentTechBranch = branchNames[currentResearch.branch] || currentResearch.branch;
            currentProgress = currentResearch.progress || 0;
        }

        // Build tech tree for active branch
        const branchTechs = tech.techTree[this.activeBranch] || [];

        container.innerHTML = `
            <h2>Технологии — ${country.flag} ${country.name}</h2>

            <!-- Tech Levels Overview -->
            <div class="card">
                <h3>Уровень технологий</h3>
                <div class="card-grid">
                    ${Object.keys(branchNames).map(branch => `
                        <div>
                            <div class="stat-row">
                                <span class="stat-label">${branchNames[branch]}</span>
                                <span class="stat-value" style="color: ${branchColors[branch]}">${techLevel[branch]}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${techLevel[branch]}%; background: ${branchColors[branch]}"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Current Research -->
            <div class="card">
                <h3>Текущее исследование</h3>
                ${currentResearch ? `
                    <div class="stat-row">
                        <span class="stat-label">Технология</span>
                        <span class="stat-value">${currentTechName}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Ветка</span>
                        <span class="stat-value">${currentTechBranch}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Прогресс</span>
                        <span class="stat-value">${currentProgress.toFixed(1)}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${currentProgress}%; background: #ffc107; ${currentProgress < 100 ? 'animation: pulse 1.5s infinite;' : ''}"></div>
                    </div>
                    ${estimatedMonths != null ? `
                        <div class="stat-row">
                            <span class="stat-label">Осталось (мес.)</span>
                            <span class="stat-value">~${estimatedMonths}</span>
                        </div>
                    ` : ''}
                    <button class="btn btn-danger btn-small" id="cancel-research-btn" style="margin-top: 8px;">Отменить исследование</button>
                ` : '<p>Нет текущего исследования</p>'}
            </div>

            <!-- Research Speed -->
            <div class="card">
                <h3>Скорость исследований</h3>
                <div class="stat-row">
                    <span class="stat-label">Множитель скорости</span>
                    <span class="stat-value">${researchSpeed.toFixed(2)}x</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Грамотность</span>
                    <span class="stat-value">${formatPercent(country.literacy ?? 0.5)}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Расходы на науку</span>
                    <span class="stat-value">${formatPercent(country.budget?.scienceSpending ?? country.economy?.budget?.spending?.science ?? 0)}</span>
                </div>
            </div>

            <!-- Tech Tree -->
            <div class="card">
                <h3>Древо технологий</h3>

                <!-- Sub-tabs for branches -->
                <div class="sub-tabs">
                    ${Object.keys(branchNames).map(branch => `
                        <div class="sub-tab ${this.activeBranch === branch ? 'active' : ''}" data-branch="${branch}">
                            ${branchNames[branch]}
                        </div>
                    `).join('')}
                </div>

                <!-- Tech nodes for the active branch -->
                <div class="card-grid" style="margin-top: 12px;">
                    ${branchTechs.map(t => {
                        const isResearched = researchedTechs.has(t.id);
                        const isResearching = currentResearch && currentResearch.techId === t.id;
                        const reqsMet = t.requires.every(rId => researchedTechs.has(rId));
                        const isAvailable = !isResearched && !isResearching && reqsMet && !currentResearch;
                        const isLocked = !isResearched && !isResearching && !reqsMet;

                        let borderColor = '#555';
                        let opacity = '1';
                        let statusLabel = '';
                        let cursorStyle = 'default';

                        if (isResearched) {
                            borderColor = '#4caf50';
                            statusLabel = 'Исследовано';
                        } else if (isResearching) {
                            borderColor = '#ffc107';
                            statusLabel = `Исследуется (${(currentResearch.progress || 0).toFixed(0)}%)`;
                        } else if (isAvailable) {
                            borderColor = '#2196f3';
                            statusLabel = 'Доступно';
                            cursorStyle = 'pointer';
                        } else if (isLocked) {
                            borderColor = '#333';
                            opacity = '0.5';
                            statusLabel = 'Заблокировано';
                        } else {
                            statusLabel = 'Занято';
                            opacity = '0.7';
                        }

                        const reqNames = t.requires.map(rId => {
                            const rTech = tech._findTech(rId);
                            return rTech ? rTech.name : rId;
                        });

                        const effectsList = t.effects ? Object.entries(t.effects).map(([k, v]) => {
                            return `${k}: x${v}`;
                        }).join(', ') : '';

                        return `
                            <div class="tech-node ${isAvailable ? 'tech-available' : ''}"
                                 data-tech-id="${t.id}"
                                 data-branch="${this.activeBranch}"
                                 style="border: 2px solid ${borderColor}; opacity: ${opacity}; cursor: ${cursorStyle}; padding: 10px; border-radius: 8px;${isResearching ? ' animation: pulse 1.5s infinite;' : ''}">
                                <div style="font-weight: bold; margin-bottom: 4px;">${t.name}</div>
                                <div style="font-size: 0.85em; color: #aaa;">Уровень: ${t.tier} | Стоимость: ${t.cost}</div>
                                <div style="font-size: 0.8em; color: ${borderColor}; margin-top: 4px;">${statusLabel}</div>
                                ${reqNames.length > 0 ? `<div style="font-size: 0.75em; color: #888; margin-top: 4px;">Требуется: ${reqNames.join(', ')}</div>` : ''}
                                ${effectsList ? `<div style="font-size: 0.75em; color: #aaa; margin-top: 4px;">Эффекты: ${effectsList}</div>` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        this.postRender(container);
    }

    postRender(container) {
        const country = this.engine.getPlayerCountry();
        if (!country) return;

        const tech = this.engine.getSystem('technology');
        if (!tech) return;

        // Sub-tab switching
        const subTabs = container.querySelectorAll('.sub-tab');
        subTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.activeBranch = tab.dataset.branch;
                this.render(container);
            });
        });

        // Click on available tech nodes to start research
        const techNodes = container.querySelectorAll('.tech-available');
        techNodes.forEach(node => {
            node.addEventListener('click', () => {
                const techId = node.dataset.techId;
                const branch = node.dataset.branch;
                const result = tech.startResearch(country.id, branch, techId);

                if (result && !result.success && result.reason) {
                    this.engine.notify(result.reason, 'warning', country.id);
                }

                this.render(container);
            });
        });

        // Cancel research button
        const cancelBtn = container.querySelector('#cancel-research-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                const result = tech.cancelResearch(country.id);

                if (result && !result.success && result.reason) {
                    this.engine.notify(result.reason, 'warning', country.id);
                }

                this.render(container);
            });
        }
    }
}
