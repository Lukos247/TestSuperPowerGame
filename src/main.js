import { GameEngine } from './engine/GameEngine.js';
import { createCountries, initializeDiplomacy } from './data/countries.js';
import { EconomySystem } from './systems/EconomySystem.js';
import { PoliticsSystem } from './systems/PoliticsSystem.js';
import { MilitarySystem } from './systems/MilitarySystem.js';
import { DiplomacySystem } from './systems/DiplomacySystem.js';
import { TechnologySystem } from './systems/TechnologySystem.js';
import { PopulationSystem } from './systems/PopulationSystem.js';
import { EspionageSystem } from './systems/EspionageSystem.js';
import { AIController } from './ai/AIController.js';
import { UIManager } from './ui/UIManager.js';

// Initialize game
const engine = new GameEngine();

// Load country data
const countries = createCountries();
for (const [id, country] of countries) {
  engine.countries.set(id, country);
}

// Initialize diplomacy relations
initializeDiplomacy(engine.countries);

// Register all systems (order matters - dependencies first)
engine.registerSystem(new PopulationSystem());
engine.registerSystem(new EconomySystem());
engine.registerSystem(new PoliticsSystem());
engine.registerSystem(new TechnologySystem());
engine.registerSystem(new MilitarySystem());
engine.registerSystem(new DiplomacySystem());
engine.registerSystem(new EspionageSystem());
engine.registerSystem(new AIController());

// Initialize UI
const ui = new UIManager(engine);
ui.init();

// Expose engine to console for debugging
window.__engine = engine;
window.__ui = ui;

console.log(`SuperPower initialized with ${engine.countries.size} countries`);
console.log('Systems registered:', engine.systems.map(s => s.name).join(', '));
console.log('Use window.__engine to access game state from console');
