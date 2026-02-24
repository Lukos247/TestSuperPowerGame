import { formatNumber, formatMoney, formatPercent } from '../engine/utils.js';
import { OverviewPanel } from './panels/OverviewPanel.js';
import { EconomyPanel } from './panels/EconomyPanel.js';
import { PoliticsPanel } from './panels/PoliticsPanel.js';
import { MilitaryPanel } from './panels/MilitaryPanel.js';
import { DiplomacyPanel } from './panels/DiplomacyPanel.js';
import { TechnologyPanel } from './panels/TechnologyPanel.js';
import { PopulationPanel } from './panels/PopulationPanel.js';
import { EspionagePanel } from './panels/EspionagePanel.js';
import { WorldPanel } from './panels/WorldPanel.js';

export class UIManager {
  constructor(engine) {
    this.engine = engine;
    this.currentPanel = 'overview';
    this.panels = {};
    this.updateThrottle = 0;
  }

  init() {
    this.panels = {
      overview: new OverviewPanel(this.engine),
      economy: new EconomyPanel(this.engine),
      politics: new PoliticsPanel(this.engine),
      military: new MilitaryPanel(this.engine),
      diplomacy: new DiplomacyPanel(this.engine),
      technology: new TechnologyPanel(this.engine),
      population: new PopulationPanel(this.engine),
      espionage: new EspionagePanel(this.engine),
      world: new WorldPanel(this.engine),
    };

    this.setupNavigation();
    this.setupGameControls();
    this.setupNotifications();
    this.setupCountrySelect();
    this.setupKeyboard();

    // Subscribe to engine events
    this.engine.events.on('tick', () => {
      this.updateThrottle++;
      // Update UI every 5 ticks for performance
      if (this.updateThrottle % 5 === 0) {
        this.updateTopBar();
        this.updateCurrentPanel();
      }
      this.updateDate();
    });

    this.engine.events.on('monthTick', () => {
      this.updateTopBar();
      this.updateCurrentPanel();
    });

    this.engine.events.on('notification', (notif) => {
      this.addNotification(notif);
    });

    this.engine.events.on('paused', () => this.updateSpeedButtons());
    this.engine.events.on('resumed', () => this.updateSpeedButtons());
    this.engine.events.on('speedChanged', () => this.updateSpeedButtons());
  }

  setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const panel = btn.dataset.panel;
        this.switchPanel(panel);
      });
    });
  }

  switchPanel(panelName) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.panel === panelName);
    });

    // Update panels
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    const panelEl = document.getElementById(`panel-${panelName}`);
    if (panelEl) {
      panelEl.classList.add('active');
    }

    this.currentPanel = panelName;
    this.updateCurrentPanel();
  }

  setupGameControls() {
    document.getElementById('btn-pause').addEventListener('click', () => {
      this.engine.togglePause();
    });

    document.getElementById('btn-speed1').addEventListener('click', () => {
      this.engine.setSpeed(1);
      if (this.engine.paused) this.engine.resume();
    });

    document.getElementById('btn-speed2').addEventListener('click', () => {
      this.engine.setSpeed(2);
      if (this.engine.paused) this.engine.resume();
    });

    document.getElementById('btn-speed3').addEventListener('click', () => {
      this.engine.setSpeed(5);
      if (this.engine.paused) this.engine.resume();
    });
  }

  updateSpeedButtons() {
    const paused = this.engine.paused;
    const speed = this.engine.speed;

    document.getElementById('btn-pause').classList.toggle('active', paused);
    document.getElementById('btn-speed1').classList.toggle('active', !paused && speed === 1);
    document.getElementById('btn-speed2').classList.toggle('active', !paused && speed === 2);
    document.getElementById('btn-speed3').classList.toggle('active', !paused && speed === 5);
  }

  setupNotifications() {
    // Initial empty
  }

  addNotification(notif) {
    const list = document.getElementById('notifications-list');
    const el = document.createElement('div');
    el.className = `notification ${notif.type}`;
    el.innerHTML = `
      <div class="notif-date">${this.engine.formatDate(notif.date)}</div>
      <div>${notif.message}</div>
    `;
    list.prepend(el);

    // Keep max 50 notifications in DOM
    while (list.children.length > 50) {
      list.removeChild(list.lastChild);
    }
  }

  setupCountrySelect() {
    const modal = document.getElementById('country-select-modal');
    const search = document.getElementById('country-search');
    const list = document.getElementById('country-list');

    // Show modal on start
    modal.classList.add('active');

    search.addEventListener('input', () => {
      this.renderCountryList(search.value);
    });

    this.renderCountryList('');
  }

  renderCountryList(filter) {
    const list = document.getElementById('country-list');
    list.innerHTML = '';

    const countries = this.engine.getAllCountries()
      .filter(c => {
        if (!filter) return true;
        const f = filter.toLowerCase();
        return c.name.toLowerCase().includes(f) || c.nameEn.toLowerCase().includes(f);
      })
      .sort((a, b) => b.gdp - a.gdp);

    for (const country of countries) {
      const el = document.createElement('div');
      el.className = 'country-option';
      el.innerHTML = `
        <div>
          <span class="flag">${country.flag}</span>
          <span class="country-name">${country.name}</span>
        </div>
        <span class="country-meta">ВВП: ${formatMoney(country.gdp)} | Нас.: ${formatNumber(country.population)}</span>
      `;
      el.addEventListener('click', () => {
        this.selectCountry(country.id);
      });
      list.appendChild(el);
    }
  }

  selectCountry(countryId) {
    this.engine.playerCountryId = countryId;
    const modal = document.getElementById('country-select-modal');
    modal.classList.remove('active');

    this.updateTopBar();
    this.updateCurrentPanel();

    this.engine.notify(`Вы управляете: ${this.engine.getPlayerCountry().name}`, 'success');
    this.engine.pause();
  }

  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.engine.togglePause();
      }
      if (e.code === 'Digit1') this.engine.setSpeed(1);
      if (e.code === 'Digit2') this.engine.setSpeed(2);
      if (e.code === 'Digit3') this.engine.setSpeed(5);

      // Panel shortcuts
      const panelKeys = {
        'KeyQ': 'overview',
        'KeyW': 'economy',
        'KeyE': 'politics',
        'KeyR': 'military',
        'KeyT': 'diplomacy',
        'KeyY': 'technology',
        'KeyU': 'population',
        'KeyI': 'espionage',
        'KeyO': 'world',
      };
      if (panelKeys[e.code] && !e.ctrlKey && !e.altKey) {
        // Only if not typing in an input
        if (document.activeElement.tagName !== 'INPUT') {
          this.switchPanel(panelKeys[e.code]);
        }
      }
    });
  }

  updateDate() {
    document.getElementById('current-date').textContent = this.engine.formatDate();
  }

  updateTopBar() {
    const country = this.engine.getPlayerCountry();
    if (!country) return;

    // Player country info
    document.getElementById('player-country-info').innerHTML = `
      <span class="flag">${country.flag}</span>
      <span>${country.name}</span>
    `;

    // Resources bar
    const gdpGrowthClass = country.gdpGrowth >= 0 ? 'positive' : 'negative';
    const tradeBalClass = country.tradeBalance >= 0 ? 'positive' : 'negative';

    document.getElementById('resources-bar').innerHTML = `
      <div class="resource-item">
        <span class="label">ВВП:</span>
        <span class="value">${formatMoney(country.gdp)}</span>
      </div>
      <div class="resource-item">
        <span class="label">Рост:</span>
        <span class="value ${gdpGrowthClass}">${(country.gdpGrowth * 100).toFixed(1)}%</span>
      </div>
      <div class="resource-item">
        <span class="label">Долг:</span>
        <span class="value">${(country.debtToGDP * 100).toFixed(0)}%</span>
      </div>
      <div class="resource-item">
        <span class="label">Одобр.:</span>
        <span class="value">${(country.approvalRating * 100).toFixed(0)}%</span>
      </div>
      <div class="resource-item">
        <span class="label">Стаб.:</span>
        <span class="value">${(country.stabilityIndex * 100).toFixed(0)}%</span>
      </div>
    `;
  }

  updateCurrentPanel() {
    const panel = this.panels[this.currentPanel];
    if (panel && panel.render) {
      const container = document.getElementById(`panel-${this.currentPanel}`);
      panel.render(container);
    }
  }
}
