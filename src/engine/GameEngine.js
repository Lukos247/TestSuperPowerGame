import { EventBus } from './EventBus.js';

export class GameEngine {
  constructor() {
    this.events = new EventBus();
    this.systems = [];
    this.countries = new Map();
    this.playerCountryId = null;
    this.paused = true;
    this.speed = 1; // 1, 2, 5
    this.tickInterval = null;
    this.baseTickMs = 1000; // 1 real second = 1 game day at speed 1

    // Game date
    this.date = { year: 2024, month: 1, day: 1 };

    // Notifications
    this.notifications = [];

    // Global state
    this.globalState = {
      oilPrice: 75, // $ per barrel
      globalGrowthRate: 0.03,
      globalInflation: 0.03,
      organizations: new Map(),
    };
  }

  registerSystem(system) {
    this.systems.push(system);
    system.engine = this;
    if (system.init) system.init();
  }

  getCountry(id) {
    return this.countries.get(id);
  }

  getPlayerCountry() {
    return this.countries.get(this.playerCountryId);
  }

  getAllCountries() {
    return Array.from(this.countries.values());
  }

  setSpeed(speed) {
    this.speed = speed;
    if (!this.paused) {
      this.stopLoop();
      this.startLoop();
    }
    this.events.emit('speedChanged', speed);
  }

  togglePause() {
    if (this.paused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  pause() {
    this.paused = true;
    this.stopLoop();
    this.events.emit('paused');
  }

  resume() {
    this.paused = false;
    this.startLoop();
    this.events.emit('resumed');
  }

  startLoop() {
    if (this.tickInterval) clearInterval(this.tickInterval);
    this.tickInterval = setInterval(() => this.tick(), this.baseTickMs / this.speed);
  }

  stopLoop() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  tick() {
    // Advance date
    this.advanceDate();

    // Update all systems
    for (const system of this.systems) {
      if (system.update) {
        system.update(this.date);
      }
    }

    this.events.emit('tick', this.date);

    // Monthly update
    if (this.date.day === 1) {
      for (const system of this.systems) {
        if (system.monthlyUpdate) {
          system.monthlyUpdate(this.date);
        }
      }
      this.events.emit('monthTick', this.date);
    }

    // Yearly update
    if (this.date.month === 1 && this.date.day === 1) {
      for (const system of this.systems) {
        if (system.yearlyUpdate) {
          system.yearlyUpdate(this.date);
        }
      }
      this.events.emit('yearTick', this.date);
    }
  }

  advanceDate() {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.date.day++;
    if (this.date.day > daysInMonth[this.date.month - 1]) {
      this.date.day = 1;
      this.date.month++;
      if (this.date.month > 12) {
        this.date.month = 1;
        this.date.year++;
      }
    }
  }

  notify(message, type = 'info', countryId = null) {
    const notification = {
      message,
      type,
      date: { ...this.date },
      countryId,
      id: Date.now() + Math.random(),
    };
    this.notifications.unshift(notification);
    if (this.notifications.length > 200) {
      this.notifications.length = 200;
    }
    this.events.emit('notification', notification);
  }

  formatDate(date) {
    date = date || this.date;
    const months = [
      'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
      'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
    ];
    return `${this.date.day} ${months[date.month - 1]} ${date.year}`;
  }

  getSystem(name) {
    return this.systems.find(s => s.name === name);
  }
}
