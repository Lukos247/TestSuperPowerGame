// SuperPower Game - Comprehensive Country Data
// All names in Russian, realistic 2024 data
// ES Module

// ============================================================
// Alliance / Organization Members
// ============================================================

export const NATO_MEMBERS = [
  'usa', 'gbr', 'fra', 'deu', 'can', 'ita', 'esp', 'tur', 'pol', 'nld',
  'bel', 'nor', 'dnk', 'prt', 'cze', 'rou', 'bgr', 'hun', 'svk', 'hrv',
  'svn', 'est', 'lva', 'ltu', 'alb', 'mne', 'mkd', 'grc', 'isl', 'lux', 'fin', 'swe'
];

export const EU_MEMBERS = [
  'deu', 'fra', 'ita', 'esp', 'nld', 'bel', 'pol', 'rou', 'cze', 'grc',
  'prt', 'swe', 'hun', 'aut', 'bgr', 'dnk', 'fin', 'svk', 'irl', 'hrv',
  'ltu', 'svn', 'lva', 'est', 'cyp', 'lux', 'mlt'
];

export const BRICS_MEMBERS = [
  'bra', 'rus', 'ind', 'chn', 'zaf', 'egy', 'eth', 'irn', 'sau', 'are'
];

export const G7_MEMBERS = ['usa', 'gbr', 'fra', 'deu', 'ita', 'can', 'jpn'];

// ============================================================
// Major Country Definitions (~40 detailed countries)
// ============================================================

function getMajorCountries() {
  return [
    // ===================== UNITED STATES =====================
    {
      id: 'usa',
      name: 'США',
      nameEn: 'United States',
      flag: '\u{1F1FA}\u{1F1F8}',
      region: 'north_america',
      gdp: 25500e9,
      gdpGrowth: 0.021,
      inflation: 0.032,
      debt: 33000e9,
      debtToGDP: 1.29,
      foreignReserves: 250e9,
      tradeBalance: -800e9,
      sectors: {
        agriculture: { level: 45, output: 0.01, employment: 0.02 },
        industry: { level: 75, output: 0.18, employment: 0.19 },
        services: { level: 90, output: 0.65, employment: 0.65 },
        tech: { level: 95, output: 0.16, employment: 0.14 }
      },
      budget: {
        taxRate: 0.27,
        militarySpending: 0.035,
        educationSpending: 0.05,
        healthcareSpending: 0.08,
        infrastructureSpending: 0.03,
        socialSpending: 0.06,
        scienceSpending: 0.03,
        intelligenceSpending: 0.01
      },
      approvalRating: 0.45,
      democracyIndex: 0.79,
      corruptionIndex: 0.33,
      stabilityIndex: 0.82,
      ideology: { democracy: 0.8, economy: 0.7 },
      parties: [
        { name: 'Демократическая партия', support: 0.48, ideology: { democracy: 0.85, economy: 0.55 } },
        { name: 'Республиканская партия', support: 0.45, ideology: { democracy: 0.75, economy: 0.85 } }
      ],
      militaryBudget: 877e9,
      units: {
        infantry: { count: 480000, equipment: 85, training: 80, morale: 75 },
        armor: { count: 6000, equipment: 80, training: 78, morale: 75 },
        air: { count: 5200, equipment: 90, training: 85, morale: 80 },
        navy: { count: 490, equipment: 88, training: 82, morale: 78 },
        missiles: { count: 400, equipment: 92, training: 85, morale: 80 },
        nuclear: { count: 5500, equipment: 95, training: 90, morale: 85 }
      },
      warFatigue: 0,
      population: 331e6,
      populationGrowth: 0.004,
      literacy: 0.99,
      healthIndex: 0.82,
      unemployment: 0.036,
      emigrationRate: 0.002,
      techLevel: { military: 90, civilian: 88, industrial: 82, digital: 92 },
      intelligenceBudget: 85e9,
      agentCount: 50,
      counterintelligence: 80,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== CHINA =====================
    {
      id: 'chn',
      name: 'Китай',
      nameEn: 'China',
      flag: '\u{1F1E8}\u{1F1F3}',
      region: 'east_asia',
      gdp: 17900e9,
      gdpGrowth: 0.052,
      inflation: 0.02,
      debt: 14000e9,
      debtToGDP: 0.78,
      foreignReserves: 3200e9,
      tradeBalance: 820e9,
      sectors: {
        agriculture: { level: 40, output: 0.07, employment: 0.25 },
        industry: { level: 80, output: 0.39, employment: 0.28 },
        services: { level: 65, output: 0.42, employment: 0.35 },
        tech: { level: 82, output: 0.12, employment: 0.12 }
      },
      budget: {
        taxRate: 0.22,
        militarySpending: 0.016,
        educationSpending: 0.04,
        healthcareSpending: 0.055,
        infrastructureSpending: 0.06,
        socialSpending: 0.04,
        scienceSpending: 0.025,
        intelligenceSpending: 0.008
      },
      approvalRating: 0.70,
      democracyIndex: 0.21,
      corruptionIndex: 0.55,
      stabilityIndex: 0.78,
      ideology: { democracy: 0.15, economy: 0.45 },
      parties: [
        { name: 'Коммунистическая партия Китая', support: 0.92, ideology: { democracy: 0.1, economy: 0.45 } }
      ],
      militaryBudget: 292e9,
      units: {
        infantry: { count: 975000, equipment: 72, training: 70, morale: 70 },
        armor: { count: 5900, equipment: 68, training: 65, morale: 68 },
        air: { count: 3200, equipment: 75, training: 70, morale: 72 },
        navy: { count: 370, equipment: 72, training: 68, morale: 70 },
        missiles: { count: 600, equipment: 80, training: 75, morale: 75 },
        nuclear: { count: 350, equipment: 78, training: 75, morale: 78 }
      },
      warFatigue: 0,
      population: 1412e6,
      populationGrowth: -0.001,
      literacy: 0.97,
      healthIndex: 0.76,
      unemployment: 0.052,
      emigrationRate: 0.001,
      techLevel: { military: 78, civilian: 80, industrial: 85, digital: 82 },
      intelligenceBudget: 25e9,
      agentCount: 45,
      counterintelligence: 75,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== RUSSIA =====================
    {
      id: 'rus',
      name: 'Россия',
      nameEn: 'Russia',
      flag: '\u{1F1F7}\u{1F1FA}',
      region: 'europe',
      gdp: 2240e9,
      gdpGrowth: 0.015,
      inflation: 0.06,
      debt: 305e9,
      debtToGDP: 0.14,
      foreignReserves: 580e9,
      tradeBalance: 150e9,
      sectors: {
        agriculture: { level: 35, output: 0.04, employment: 0.06 },
        industry: { level: 60, output: 0.32, employment: 0.27 },
        services: { level: 55, output: 0.54, employment: 0.55 },
        tech: { level: 55, output: 0.10, employment: 0.12 }
      },
      budget: {
        taxRate: 0.20,
        militarySpending: 0.04,
        educationSpending: 0.035,
        healthcareSpending: 0.035,
        infrastructureSpending: 0.025,
        socialSpending: 0.05,
        scienceSpending: 0.01,
        intelligenceSpending: 0.012
      },
      approvalRating: 0.65,
      democracyIndex: 0.28,
      corruptionIndex: 0.71,
      stabilityIndex: 0.60,
      ideology: { democracy: 0.25, economy: 0.45 },
      parties: [
        { name: 'Единая Россия', support: 0.55, ideology: { democracy: 0.2, economy: 0.5 } },
        { name: 'КПРФ', support: 0.15, ideology: { democracy: 0.2, economy: 0.2 } },
        { name: 'ЛДПР', support: 0.10, ideology: { democracy: 0.15, economy: 0.55 } }
      ],
      militaryBudget: 90e9,
      units: {
        infantry: { count: 420000, equipment: 65, training: 65, morale: 60 },
        armor: { count: 12500, equipment: 55, training: 58, morale: 55 },
        air: { count: 4100, equipment: 70, training: 68, morale: 62 },
        navy: { count: 310, equipment: 60, training: 62, morale: 58 },
        missiles: { count: 800, equipment: 82, training: 78, morale: 72 },
        nuclear: { count: 6255, equipment: 80, training: 82, morale: 75 }
      },
      warFatigue: 0.3,
      population: 144e6,
      populationGrowth: -0.003,
      literacy: 0.998,
      healthIndex: 0.68,
      unemployment: 0.039,
      emigrationRate: 0.005,
      techLevel: { military: 75, civilian: 62, industrial: 58, digital: 60 },
      intelligenceBudget: 15e9,
      agentCount: 45,
      counterintelligence: 78,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== INDIA =====================
    {
      id: 'ind',
      name: 'Индия',
      nameEn: 'India',
      flag: '\u{1F1EE}\u{1F1F3}',
      region: 'south_asia',
      gdp: 3730e9,
      gdpGrowth: 0.065,
      inflation: 0.055,
      debt: 2400e9,
      debtToGDP: 0.64,
      foreignReserves: 620e9,
      tradeBalance: -240e9,
      sectors: {
        agriculture: { level: 30, output: 0.17, employment: 0.42 },
        industry: { level: 50, output: 0.26, employment: 0.25 },
        services: { level: 60, output: 0.48, employment: 0.28 },
        tech: { level: 68, output: 0.09, employment: 0.05 }
      },
      budget: {
        taxRate: 0.17,
        militarySpending: 0.024,
        educationSpending: 0.03,
        healthcareSpending: 0.02,
        infrastructureSpending: 0.04,
        socialSpending: 0.03,
        scienceSpending: 0.007,
        intelligenceSpending: 0.005
      },
      approvalRating: 0.60,
      democracyIndex: 0.66,
      corruptionIndex: 0.60,
      stabilityIndex: 0.65,
      ideology: { democracy: 0.65, economy: 0.55 },
      parties: [
        { name: 'Бхаратия Джаната Парти', support: 0.45, ideology: { democracy: 0.55, economy: 0.6 } },
        { name: 'Индийский национальный конгресс', support: 0.30, ideology: { democracy: 0.7, economy: 0.45 } }
      ],
      militaryBudget: 81e9,
      units: {
        infantry: { count: 1200000, equipment: 55, training: 60, morale: 65 },
        armor: { count: 4600, equipment: 52, training: 55, morale: 60 },
        air: { count: 2100, equipment: 60, training: 62, morale: 65 },
        navy: { count: 150, equipment: 58, training: 60, morale: 62 },
        missiles: { count: 200, equipment: 65, training: 62, morale: 65 },
        nuclear: { count: 164, equipment: 60, training: 65, morale: 70 }
      },
      warFatigue: 0,
      population: 1428e6,
      populationGrowth: 0.008,
      literacy: 0.77,
      healthIndex: 0.62,
      unemployment: 0.072,
      emigrationRate: 0.003,
      techLevel: { military: 58, civilian: 55, industrial: 50, digital: 65 },
      intelligenceBudget: 5e9,
      agentCount: 35,
      counterintelligence: 55,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },
    // ===================== JAPAN =====================
    {
      id: 'jpn',
      name: 'Япония',
      nameEn: 'Japan',
      flag: '\u{1F1EF}\u{1F1F5}',
      region: 'east_asia',
      gdp: 4230e9,
      gdpGrowth: 0.011,
      inflation: 0.033,
      debt: 9800e9,
      debtToGDP: 2.32,
      foreignReserves: 1230e9,
      tradeBalance: -60e9,
      sectors: {
        agriculture: { level: 50, output: 0.01, employment: 0.03 },
        industry: { level: 88, output: 0.29, employment: 0.25 },
        services: { level: 85, output: 0.60, employment: 0.60 },
        tech: { level: 92, output: 0.10, employment: 0.12 }
      },
      budget: {
        taxRate: 0.30,
        militarySpending: 0.012,
        educationSpending: 0.035,
        healthcareSpending: 0.08,
        infrastructureSpending: 0.04,
        socialSpending: 0.09,
        scienceSpending: 0.032,
        intelligenceSpending: 0.004
      },
      approvalRating: 0.40,
      democracyIndex: 0.83,
      corruptionIndex: 0.27,
      stabilityIndex: 0.90,
      ideology: { democracy: 0.82, economy: 0.72 },
      parties: [
        { name: 'Либерально-демократическая партия', support: 0.40, ideology: { democracy: 0.75, economy: 0.7 } },
        { name: 'Конституционно-демократическая партия', support: 0.18, ideology: { democracy: 0.85, economy: 0.45 } }
      ],
      militaryBudget: 50e9,
      units: {
        infantry: { count: 150000, equipment: 82, training: 78, morale: 72 },
        armor: { count: 600, equipment: 80, training: 75, morale: 72 },
        air: { count: 750, equipment: 85, training: 80, morale: 75 },
        navy: { count: 155, equipment: 84, training: 82, morale: 76 },
        missiles: { count: 100, equipment: 78, training: 75, morale: 72 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 125e6,
      populationGrowth: -0.004,
      literacy: 0.999,
      healthIndex: 0.92,
      unemployment: 0.026,
      emigrationRate: 0.001,
      techLevel: { military: 82, civilian: 90, industrial: 88, digital: 88 },
      intelligenceBudget: 4e9,
      agentCount: 20,
      counterintelligence: 65,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== GERMANY =====================
    {
      id: 'deu',
      name: 'Германия',
      nameEn: 'Germany',
      flag: '\u{1F1E9}\u{1F1EA}',
      region: 'europe',
      gdp: 4070e9,
      gdpGrowth: 0.008,
      inflation: 0.06,
      debt: 2800e9,
      debtToGDP: 0.69,
      foreignReserves: 295e9,
      tradeBalance: 180e9,
      sectors: {
        agriculture: { level: 55, output: 0.01, employment: 0.01 },
        industry: { level: 90, output: 0.27, employment: 0.24 },
        services: { level: 85, output: 0.62, employment: 0.63 },
        tech: { level: 85, output: 0.10, employment: 0.12 }
      },
      budget: {
        taxRate: 0.38,
        militarySpending: 0.015,
        educationSpending: 0.045,
        healthcareSpending: 0.09,
        infrastructureSpending: 0.025,
        socialSpending: 0.12,
        scienceSpending: 0.031,
        intelligenceSpending: 0.003
      },
      approvalRating: 0.38,
      democracyIndex: 0.86,
      corruptionIndex: 0.20,
      stabilityIndex: 0.85,
      ideology: { democracy: 0.9, economy: 0.65 },
      parties: [
        { name: 'ХДС/ХСС', support: 0.30, ideology: { democracy: 0.88, economy: 0.65 } },
        { name: 'СДПГ', support: 0.22, ideology: { democracy: 0.9, economy: 0.45 } },
        { name: 'Зелёные', support: 0.15, ideology: { democracy: 0.92, economy: 0.4 } },
        { name: 'АдГ', support: 0.18, ideology: { democracy: 0.55, economy: 0.7 } }
      ],
      militaryBudget: 55e9,
      units: {
        infantry: { count: 63000, equipment: 72, training: 75, morale: 68 },
        armor: { count: 300, equipment: 78, training: 72, morale: 68 },
        air: { count: 620, equipment: 80, training: 76, morale: 70 },
        navy: { count: 65, equipment: 75, training: 72, morale: 68 },
        missiles: { count: 50, equipment: 72, training: 70, morale: 68 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 84e6,
      populationGrowth: 0.001,
      literacy: 0.99,
      healthIndex: 0.88,
      unemployment: 0.031,
      emigrationRate: 0.002,
      techLevel: { military: 78, civilian: 85, industrial: 90, digital: 82 },
      intelligenceBudget: 3e9,
      agentCount: 20,
      counterintelligence: 62,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== UNITED KINGDOM =====================
    {
      id: 'gbr',
      name: 'Великобритания',
      nameEn: 'United Kingdom',
      flag: '\u{1F1EC}\u{1F1E7}',
      region: 'europe',
      gdp: 3070e9,
      gdpGrowth: 0.01,
      inflation: 0.065,
      debt: 2800e9,
      debtToGDP: 0.91,
      foreignReserves: 180e9,
      tradeBalance: -120e9,
      sectors: {
        agriculture: { level: 50, output: 0.01, employment: 0.01 },
        industry: { level: 72, output: 0.18, employment: 0.18 },
        services: { level: 88, output: 0.72, employment: 0.72 },
        tech: { level: 82, output: 0.09, employment: 0.09 }
      },
      budget: {
        taxRate: 0.33,
        militarySpending: 0.022,
        educationSpending: 0.045,
        healthcareSpending: 0.075,
        infrastructureSpending: 0.025,
        socialSpending: 0.10,
        scienceSpending: 0.017,
        intelligenceSpending: 0.006
      },
      approvalRating: 0.35,
      democracyIndex: 0.84,
      corruptionIndex: 0.22,
      stabilityIndex: 0.80,
      ideology: { democracy: 0.88, economy: 0.68 },
      parties: [
        { name: 'Консервативная партия', support: 0.30, ideology: { democracy: 0.8, economy: 0.75 } },
        { name: 'Лейбористская партия', support: 0.42, ideology: { democracy: 0.85, economy: 0.4 } }
      ],
      militaryBudget: 68e9,
      units: {
        infantry: { count: 82000, equipment: 78, training: 78, morale: 72 },
        armor: { count: 230, equipment: 75, training: 74, morale: 70 },
        air: { count: 700, equipment: 82, training: 80, morale: 75 },
        navy: { count: 75, equipment: 80, training: 78, morale: 74 },
        missiles: { count: 50, equipment: 82, training: 78, morale: 75 },
        nuclear: { count: 225, equipment: 85, training: 82, morale: 78 }
      },
      warFatigue: 0,
      population: 67e6,
      populationGrowth: 0.003,
      literacy: 0.99,
      healthIndex: 0.85,
      unemployment: 0.038,
      emigrationRate: 0.003,
      techLevel: { military: 82, civilian: 82, industrial: 75, digital: 85 },
      intelligenceBudget: 8e9,
      agentCount: 30,
      counterintelligence: 75,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== FRANCE =====================
    {
      id: 'fra',
      name: 'Франция',
      nameEn: 'France',
      flag: '\u{1F1EB}\u{1F1F7}',
      region: 'europe',
      gdp: 2780e9,
      gdpGrowth: 0.012,
      inflation: 0.052,
      debt: 3100e9,
      debtToGDP: 1.12,
      foreignReserves: 240e9,
      tradeBalance: -100e9,
      sectors: {
        agriculture: { level: 55, output: 0.02, employment: 0.03 },
        industry: { level: 72, output: 0.17, employment: 0.20 },
        services: { level: 82, output: 0.70, employment: 0.68 },
        tech: { level: 78, output: 0.11, employment: 0.09 }
      },
      budget: {
        taxRate: 0.45,
        militarySpending: 0.019,
        educationSpending: 0.05,
        healthcareSpending: 0.09,
        infrastructureSpending: 0.03,
        socialSpending: 0.14,
        scienceSpending: 0.022,
        intelligenceSpending: 0.005
      },
      approvalRating: 0.30,
      democracyIndex: 0.82,
      corruptionIndex: 0.30,
      stabilityIndex: 0.72,
      ideology: { democracy: 0.85, economy: 0.55 },
      parties: [
        { name: 'Ренессанс (Макрон)', support: 0.25, ideology: { democracy: 0.85, economy: 0.65 } },
        { name: 'Национальное объединение', support: 0.28, ideology: { democracy: 0.55, economy: 0.55 } },
        { name: 'Непокорённая Франция', support: 0.20, ideology: { democracy: 0.75, economy: 0.25 } }
      ],
      militaryBudget: 56e9,
      units: {
        infantry: { count: 115000, equipment: 75, training: 76, morale: 70 },
        armor: { count: 400, equipment: 72, training: 72, morale: 68 },
        air: { count: 950, equipment: 80, training: 78, morale: 72 },
        navy: { count: 180, equipment: 78, training: 76, morale: 72 },
        missiles: { count: 80, equipment: 78, training: 75, morale: 72 },
        nuclear: { count: 290, equipment: 82, training: 80, morale: 78 }
      },
      warFatigue: 0,
      population: 68e6,
      populationGrowth: 0.002,
      literacy: 0.99,
      healthIndex: 0.86,
      unemployment: 0.072,
      emigrationRate: 0.002,
      techLevel: { military: 80, civilian: 80, industrial: 75, digital: 78 },
      intelligenceBudget: 6e9,
      agentCount: 25,
      counterintelligence: 70,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },
    // ===================== BRAZIL =====================
    {
      id: 'bra',
      name: 'Бразилия',
      nameEn: 'Brazil',
      flag: '\u{1F1E7}\u{1F1F7}',
      region: 'south_america',
      gdp: 1920e9,
      gdpGrowth: 0.029,
      inflation: 0.046,
      debt: 1600e9,
      debtToGDP: 0.83,
      foreignReserves: 340e9,
      tradeBalance: 60e9,
      sectors: {
        agriculture: { level: 55, output: 0.06, employment: 0.10 },
        industry: { level: 55, output: 0.21, employment: 0.22 },
        services: { level: 60, output: 0.63, employment: 0.58 },
        tech: { level: 45, output: 0.10, employment: 0.10 }
      },
      budget: {
        taxRate: 0.33,
        militarySpending: 0.013,
        educationSpending: 0.06,
        healthcareSpending: 0.04,
        infrastructureSpending: 0.02,
        socialSpending: 0.10,
        scienceSpending: 0.012,
        intelligenceSpending: 0.003
      },
      approvalRating: 0.40,
      democracyIndex: 0.68,
      corruptionIndex: 0.62,
      stabilityIndex: 0.60,
      ideology: { democracy: 0.7, economy: 0.5 },
      parties: [
        { name: 'Партия трудящихся', support: 0.35, ideology: { democracy: 0.7, economy: 0.35 } },
        { name: 'Либеральная партия', support: 0.30, ideology: { democracy: 0.55, economy: 0.7 } }
      ],
      militaryBudget: 20e9,
      units: {
        infantry: { count: 220000, equipment: 50, training: 52, morale: 55 },
        armor: { count: 470, equipment: 45, training: 48, morale: 52 },
        air: { count: 700, equipment: 55, training: 55, morale: 55 },
        navy: { count: 95, equipment: 52, training: 55, morale: 55 },
        missiles: { count: 20, equipment: 40, training: 45, morale: 50 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 215e6,
      populationGrowth: 0.005,
      literacy: 0.93,
      healthIndex: 0.68,
      unemployment: 0.082,
      emigrationRate: 0.002,
      techLevel: { military: 48, civilian: 55, industrial: 52, digital: 58 },
      intelligenceBudget: 2e9,
      agentCount: 15,
      counterintelligence: 42,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== SOUTH KOREA =====================
    {
      id: 'kor',
      name: 'Южная Корея',
      nameEn: 'South Korea',
      flag: '\u{1F1F0}\u{1F1F7}',
      region: 'east_asia',
      gdp: 1665e9,
      gdpGrowth: 0.026,
      inflation: 0.035,
      debt: 980e9,
      debtToGDP: 0.59,
      foreignReserves: 420e9,
      tradeBalance: 30e9,
      sectors: {
        agriculture: { level: 45, output: 0.02, employment: 0.05 },
        industry: { level: 85, output: 0.33, employment: 0.25 },
        services: { level: 80, output: 0.53, employment: 0.58 },
        tech: { level: 90, output: 0.12, employment: 0.12 }
      },
      budget: {
        taxRate: 0.27,
        militarySpending: 0.027,
        educationSpending: 0.045,
        healthcareSpending: 0.06,
        infrastructureSpending: 0.035,
        socialSpending: 0.06,
        scienceSpending: 0.045,
        intelligenceSpending: 0.005
      },
      approvalRating: 0.42,
      democracyIndex: 0.82,
      corruptionIndex: 0.38,
      stabilityIndex: 0.80,
      ideology: { democracy: 0.8, economy: 0.7 },
      parties: [
        { name: 'Сила народа', support: 0.42, ideology: { democracy: 0.78, economy: 0.72 } },
        { name: 'Демократическая партия', support: 0.45, ideology: { democracy: 0.82, economy: 0.5 } }
      ],
      militaryBudget: 46e9,
      units: {
        infantry: { count: 500000, equipment: 72, training: 72, morale: 68 },
        armor: { count: 2500, equipment: 70, training: 68, morale: 65 },
        air: { count: 1500, equipment: 78, training: 75, morale: 70 },
        navy: { count: 90, equipment: 72, training: 70, morale: 68 },
        missiles: { count: 100, equipment: 75, training: 72, morale: 70 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 52e6,
      populationGrowth: -0.002,
      literacy: 0.98,
      healthIndex: 0.88,
      unemployment: 0.028,
      emigrationRate: 0.003,
      techLevel: { military: 78, civilian: 88, industrial: 85, digital: 90 },
      intelligenceBudget: 3e9,
      agentCount: 20,
      counterintelligence: 62,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== ITALY =====================
    {
      id: 'ita',
      name: 'Италия',
      nameEn: 'Italy',
      flag: '\u{1F1EE}\u{1F1F9}',
      region: 'europe',
      gdp: 2010e9,
      gdpGrowth: 0.007,
      inflation: 0.058,
      debt: 2900e9,
      debtToGDP: 1.44,
      foreignReserves: 195e9,
      tradeBalance: 40e9,
      sectors: {
        agriculture: { level: 50, output: 0.02, employment: 0.04 },
        industry: { level: 75, output: 0.23, employment: 0.26 },
        services: { level: 78, output: 0.66, employment: 0.62 },
        tech: { level: 62, output: 0.09, employment: 0.08 }
      },
      budget: {
        taxRate: 0.42,
        militarySpending: 0.015,
        educationSpending: 0.04,
        healthcareSpending: 0.065,
        infrastructureSpending: 0.02,
        socialSpending: 0.13,
        scienceSpending: 0.013,
        intelligenceSpending: 0.003
      },
      approvalRating: 0.38,
      democracyIndex: 0.78,
      corruptionIndex: 0.44,
      stabilityIndex: 0.70,
      ideology: { democracy: 0.82, economy: 0.6 },
      parties: [
        { name: 'Братья Италии', support: 0.30, ideology: { democracy: 0.6, economy: 0.65 } },
        { name: 'Демократическая партия', support: 0.22, ideology: { democracy: 0.85, economy: 0.45 } },
        { name: 'Движение 5 звёзд', support: 0.15, ideology: { democracy: 0.7, economy: 0.4 } }
      ],
      militaryBudget: 30e9,
      units: {
        infantry: { count: 96000, equipment: 68, training: 68, morale: 62 },
        armor: { count: 200, equipment: 65, training: 64, morale: 60 },
        air: { count: 550, equipment: 72, training: 70, morale: 65 },
        navy: { count: 60, equipment: 70, training: 68, morale: 62 },
        missiles: { count: 30, equipment: 65, training: 62, morale: 60 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 59e6,
      populationGrowth: -0.003,
      literacy: 0.99,
      healthIndex: 0.85,
      unemployment: 0.078,
      emigrationRate: 0.003,
      techLevel: { military: 68, civilian: 75, industrial: 72, digital: 70 },
      intelligenceBudget: 2e9,
      agentCount: 15,
      counterintelligence: 55,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== CANADA =====================
    {
      id: 'can',
      name: 'Канада',
      nameEn: 'Canada',
      flag: '\u{1F1E8}\u{1F1E6}',
      region: 'north_america',
      gdp: 2140e9,
      gdpGrowth: 0.015,
      inflation: 0.039,
      debt: 1200e9,
      debtToGDP: 0.56,
      foreignReserves: 105e9,
      tradeBalance: -20e9,
      sectors: {
        agriculture: { level: 50, output: 0.02, employment: 0.02 },
        industry: { level: 68, output: 0.25, employment: 0.20 },
        services: { level: 82, output: 0.62, employment: 0.68 },
        tech: { level: 72, output: 0.11, employment: 0.10 }
      },
      budget: {
        taxRate: 0.33,
        militarySpending: 0.013,
        educationSpending: 0.05,
        healthcareSpending: 0.075,
        infrastructureSpending: 0.03,
        socialSpending: 0.08,
        scienceSpending: 0.016,
        intelligenceSpending: 0.003
      },
      approvalRating: 0.35,
      democracyIndex: 0.89,
      corruptionIndex: 0.22,
      stabilityIndex: 0.88,
      ideology: { democracy: 0.9, economy: 0.65 },
      parties: [
        { name: 'Либеральная партия', support: 0.35, ideology: { democracy: 0.88, economy: 0.55 } },
        { name: 'Консервативная партия', support: 0.38, ideology: { democracy: 0.82, economy: 0.72 } }
      ],
      militaryBudget: 27e9,
      units: {
        infantry: { count: 42000, equipment: 72, training: 75, morale: 72 },
        armor: { count: 80, equipment: 68, training: 70, morale: 68 },
        air: { count: 370, equipment: 75, training: 75, morale: 72 },
        navy: { count: 30, equipment: 70, training: 72, morale: 70 },
        missiles: { count: 20, equipment: 65, training: 68, morale: 68 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 39e6,
      populationGrowth: 0.008,
      literacy: 0.99,
      healthIndex: 0.88,
      unemployment: 0.052,
      emigrationRate: 0.002,
      techLevel: { military: 72, civilian: 80, industrial: 70, digital: 82 },
      intelligenceBudget: 2.5e9,
      agentCount: 15,
      counterintelligence: 58,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },
    // ===================== AUSTRALIA =====================
    {
      id: 'aus',
      name: 'Австралия',
      nameEn: 'Australia',
      flag: '\u{1F1E6}\u{1F1FA}',
      region: 'oceania',
      gdp: 1680e9,
      gdpGrowth: 0.02,
      inflation: 0.065,
      debt: 580e9,
      debtToGDP: 0.35,
      foreignReserves: 62e9,
      tradeBalance: 100e9,
      sectors: {
        agriculture: { level: 55, output: 0.03, employment: 0.03 },
        industry: { level: 65, output: 0.26, employment: 0.21 },
        services: { level: 82, output: 0.62, employment: 0.68 },
        tech: { level: 70, output: 0.09, employment: 0.08 }
      },
      budget: {
        taxRate: 0.28,
        militarySpending: 0.02,
        educationSpending: 0.05,
        healthcareSpending: 0.065,
        infrastructureSpending: 0.03,
        socialSpending: 0.07,
        scienceSpending: 0.018,
        intelligenceSpending: 0.004
      },
      approvalRating: 0.42,
      democracyIndex: 0.87,
      corruptionIndex: 0.25,
      stabilityIndex: 0.90,
      ideology: { democracy: 0.88, economy: 0.7 },
      parties: [
        { name: 'Лейбористская партия', support: 0.45, ideology: { democracy: 0.88, economy: 0.5 } },
        { name: 'Либеральная партия', support: 0.38, ideology: { democracy: 0.85, economy: 0.75 } }
      ],
      militaryBudget: 32e9,
      units: {
        infantry: { count: 30000, equipment: 75, training: 78, morale: 75 },
        armor: { count: 60, equipment: 72, training: 72, morale: 72 },
        air: { count: 250, equipment: 80, training: 78, morale: 75 },
        navy: { count: 50, equipment: 78, training: 78, morale: 75 },
        missiles: { count: 30, equipment: 70, training: 68, morale: 70 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 26e6,
      populationGrowth: 0.011,
      literacy: 0.99,
      healthIndex: 0.88,
      unemployment: 0.035,
      emigrationRate: 0.003,
      techLevel: { military: 72, civilian: 80, industrial: 68, digital: 82 },
      intelligenceBudget: 2e9,
      agentCount: 12,
      counterintelligence: 58,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== SPAIN =====================
    {
      id: 'esp',
      name: 'Испания',
      nameEn: 'Spain',
      flag: '\u{1F1EA}\u{1F1F8}',
      region: 'europe',
      gdp: 1400e9,
      gdpGrowth: 0.022,
      inflation: 0.035,
      debt: 1560e9,
      debtToGDP: 1.11,
      foreignReserves: 85e9,
      tradeBalance: -30e9,
      sectors: {
        agriculture: { level: 48, output: 0.03, employment: 0.04 },
        industry: { level: 62, output: 0.20, employment: 0.20 },
        services: { level: 75, output: 0.68, employment: 0.68 },
        tech: { level: 55, output: 0.09, employment: 0.08 }
      },
      budget: {
        taxRate: 0.35,
        militarySpending: 0.012,
        educationSpending: 0.04,
        healthcareSpending: 0.06,
        infrastructureSpending: 0.025,
        socialSpending: 0.11,
        scienceSpending: 0.012,
        intelligenceSpending: 0.003
      },
      approvalRating: 0.35,
      democracyIndex: 0.80,
      corruptionIndex: 0.36,
      stabilityIndex: 0.72,
      ideology: { democracy: 0.84, economy: 0.6 },
      parties: [
        { name: 'ИСРП', support: 0.32, ideology: { democracy: 0.85, economy: 0.42 } },
        { name: 'Народная партия', support: 0.35, ideology: { democracy: 0.78, economy: 0.72 } }
      ],
      militaryBudget: 17e9,
      units: {
        infantry: { count: 75000, equipment: 62, training: 65, morale: 62 },
        armor: { count: 330, equipment: 58, training: 60, morale: 58 },
        air: { count: 520, equipment: 68, training: 68, morale: 62 },
        navy: { count: 55, equipment: 65, training: 66, morale: 62 },
        missiles: { count: 20, equipment: 55, training: 58, morale: 58 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 47e6,
      populationGrowth: 0.001,
      literacy: 0.98,
      healthIndex: 0.86,
      unemployment: 0.122,
      emigrationRate: 0.003,
      techLevel: { military: 62, civilian: 72, industrial: 65, digital: 72 },
      intelligenceBudget: 1.5e9,
      agentCount: 12,
      counterintelligence: 52,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== MEXICO =====================
    {
      id: 'mex',
      name: 'Мексика',
      nameEn: 'Mexico',
      flag: '\u{1F1F2}\u{1F1FD}',
      region: 'north_america',
      gdp: 1320e9,
      gdpGrowth: 0.031,
      inflation: 0.048,
      debt: 700e9,
      debtToGDP: 0.53,
      foreignReserves: 200e9,
      tradeBalance: -15e9,
      sectors: {
        agriculture: { level: 35, output: 0.04, employment: 0.13 },
        industry: { level: 55, output: 0.31, employment: 0.25 },
        services: { level: 58, output: 0.58, employment: 0.55 },
        tech: { level: 40, output: 0.07, employment: 0.07 }
      },
      budget: {
        taxRate: 0.16,
        militarySpending: 0.005,
        educationSpending: 0.04,
        healthcareSpending: 0.03,
        infrastructureSpending: 0.02,
        socialSpending: 0.05,
        scienceSpending: 0.004,
        intelligenceSpending: 0.002
      },
      approvalRating: 0.50,
      democracyIndex: 0.60,
      corruptionIndex: 0.69,
      stabilityIndex: 0.52,
      ideology: { democracy: 0.62, economy: 0.55 },
      parties: [
        { name: 'Морена', support: 0.45, ideology: { democracy: 0.6, economy: 0.4 } },
        { name: 'НПД', support: 0.20, ideology: { democracy: 0.7, economy: 0.7 } }
      ],
      militaryBudget: 8e9,
      units: {
        infantry: { count: 220000, equipment: 42, training: 45, morale: 48 },
        armor: { count: 50, equipment: 38, training: 40, morale: 42 },
        air: { count: 400, equipment: 48, training: 50, morale: 48 },
        navy: { count: 40, equipment: 45, training: 48, morale: 48 },
        missiles: { count: 10, equipment: 35, training: 38, morale: 40 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 129e6,
      populationGrowth: 0.008,
      literacy: 0.95,
      healthIndex: 0.72,
      unemployment: 0.035,
      emigrationRate: 0.006,
      techLevel: { military: 38, civilian: 52, industrial: 50, digital: 55 },
      intelligenceBudget: 1e9,
      agentCount: 10,
      counterintelligence: 38,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== INDONESIA =====================
    {
      id: 'idn',
      name: 'Индонезия',
      nameEn: 'Indonesia',
      flag: '\u{1F1EE}\u{1F1E9}',
      region: 'southeast_asia',
      gdp: 1320e9,
      gdpGrowth: 0.051,
      inflation: 0.04,
      debt: 400e9,
      debtToGDP: 0.30,
      foreignReserves: 137e9,
      tradeBalance: 35e9,
      sectors: {
        agriculture: { level: 35, output: 0.13, employment: 0.29 },
        industry: { level: 48, output: 0.38, employment: 0.22 },
        services: { level: 50, output: 0.44, employment: 0.42 },
        tech: { level: 35, output: 0.05, employment: 0.07 }
      },
      budget: {
        taxRate: 0.12,
        militarySpending: 0.008,
        educationSpending: 0.03,
        healthcareSpending: 0.015,
        infrastructureSpending: 0.025,
        socialSpending: 0.03,
        scienceSpending: 0.002,
        intelligenceSpending: 0.002
      },
      approvalRating: 0.55,
      democracyIndex: 0.66,
      corruptionIndex: 0.62,
      stabilityIndex: 0.62,
      ideology: { democracy: 0.6, economy: 0.55 },
      parties: [
        { name: 'ПДИП', support: 0.25, ideology: { democracy: 0.6, economy: 0.45 } },
        { name: 'Голкар', support: 0.15, ideology: { democracy: 0.55, economy: 0.6 } }
      ],
      militaryBudget: 9e9,
      units: {
        infantry: { count: 300000, equipment: 42, training: 48, morale: 55 },
        armor: { count: 400, equipment: 38, training: 42, morale: 48 },
        air: { count: 400, equipment: 48, training: 50, morale: 52 },
        navy: { count: 120, equipment: 45, training: 48, morale: 52 },
        missiles: { count: 30, equipment: 38, training: 40, morale: 45 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 276e6,
      populationGrowth: 0.008,
      literacy: 0.96,
      healthIndex: 0.65,
      unemployment: 0.055,
      emigrationRate: 0.003,
      techLevel: { military: 38, civilian: 45, industrial: 42, digital: 50 },
      intelligenceBudget: 1e9,
      agentCount: 10,
      counterintelligence: 40,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },
    // ===================== TURKEY =====================
    {
      id: 'tur',
      name: 'Турция',
      nameEn: 'Turkey',
      flag: '\u{1F1F9}\u{1F1F7}',
      region: 'middle_east',
      gdp: 905e9,
      gdpGrowth: 0.04,
      inflation: 0.50,
      debt: 280e9,
      debtToGDP: 0.31,
      foreignReserves: 130e9,
      tradeBalance: -50e9,
      sectors: {
        agriculture: { level: 38, output: 0.06, employment: 0.18 },
        industry: { level: 58, output: 0.28, employment: 0.26 },
        services: { level: 60, output: 0.56, employment: 0.48 },
        tech: { level: 42, output: 0.10, employment: 0.08 }
      },
      budget: {
        taxRate: 0.24,
        militarySpending: 0.018,
        educationSpending: 0.04,
        healthcareSpending: 0.035,
        infrastructureSpending: 0.035,
        socialSpending: 0.04,
        scienceSpending: 0.01,
        intelligenceSpending: 0.005
      },
      approvalRating: 0.45,
      democracyIndex: 0.42,
      corruptionIndex: 0.60,
      stabilityIndex: 0.55,
      ideology: { democracy: 0.42, economy: 0.55 },
      parties: [
        { name: 'Партия справедливости и развития', support: 0.42, ideology: { democracy: 0.35, economy: 0.55 } },
        { name: 'НРП', support: 0.30, ideology: { democracy: 0.7, economy: 0.45 } }
      ],
      militaryBudget: 16e9,
      units: {
        infantry: { count: 355000, equipment: 58, training: 62, morale: 65 },
        armor: { count: 2400, equipment: 52, training: 58, morale: 60 },
        air: { count: 1050, equipment: 62, training: 65, morale: 62 },
        navy: { count: 115, equipment: 55, training: 58, morale: 58 },
        missiles: { count: 80, equipment: 55, training: 55, morale: 58 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0.1,
      population: 85e6,
      populationGrowth: 0.006,
      literacy: 0.96,
      healthIndex: 0.72,
      unemployment: 0.10,
      emigrationRate: 0.004,
      techLevel: { military: 58, civilian: 55, industrial: 55, digital: 55 },
      intelligenceBudget: 3e9,
      agentCount: 18,
      counterintelligence: 55,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== SAUDI ARABIA =====================
    {
      id: 'sau',
      name: 'Саудовская Аравия',
      nameEn: 'Saudi Arabia',
      flag: '\u{1F1F8}\u{1F1E6}',
      region: 'middle_east',
      gdp: 1060e9,
      gdpGrowth: 0.035,
      inflation: 0.025,
      debt: 270e9,
      debtToGDP: 0.25,
      foreignReserves: 450e9,
      tradeBalance: 150e9,
      sectors: {
        agriculture: { level: 20, output: 0.02, employment: 0.06 },
        industry: { level: 55, output: 0.45, employment: 0.22 },
        services: { level: 55, output: 0.46, employment: 0.62 },
        tech: { level: 35, output: 0.07, employment: 0.10 }
      },
      budget: {
        taxRate: 0.05,
        militarySpending: 0.06,
        educationSpending: 0.05,
        healthcareSpending: 0.045,
        infrastructureSpending: 0.06,
        socialSpending: 0.03,
        scienceSpending: 0.008,
        intelligenceSpending: 0.008
      },
      approvalRating: 0.65,
      democracyIndex: 0.18,
      corruptionIndex: 0.52,
      stabilityIndex: 0.75,
      ideology: { democracy: 0.1, economy: 0.6 },
      parties: [],
      militaryBudget: 75e9,
      units: {
        infantry: { count: 127000, equipment: 72, training: 55, morale: 58 },
        armor: { count: 1100, equipment: 75, training: 52, morale: 55 },
        air: { count: 900, equipment: 78, training: 60, morale: 58 },
        navy: { count: 55, equipment: 65, training: 52, morale: 52 },
        missiles: { count: 120, equipment: 70, training: 55, morale: 55 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0.05,
      population: 36e6,
      populationGrowth: 0.015,
      literacy: 0.95,
      healthIndex: 0.76,
      unemployment: 0.055,
      emigrationRate: 0.001,
      techLevel: { military: 60, civilian: 55, industrial: 50, digital: 55 },
      intelligenceBudget: 5e9,
      agentCount: 18,
      counterintelligence: 55,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== IRAN =====================
    {
      id: 'irn',
      name: 'Иран',
      nameEn: 'Iran',
      flag: '\u{1F1EE}\u{1F1F7}',
      region: 'middle_east',
      gdp: 400e9,
      gdpGrowth: 0.025,
      inflation: 0.40,
      debt: 45e9,
      debtToGDP: 0.11,
      foreignReserves: 130e9,
      tradeBalance: 20e9,
      sectors: {
        agriculture: { level: 30, output: 0.11, employment: 0.18 },
        industry: { level: 45, output: 0.38, employment: 0.32 },
        services: { level: 42, output: 0.45, employment: 0.42 },
        tech: { level: 38, output: 0.06, employment: 0.08 }
      },
      budget: {
        taxRate: 0.09,
        militarySpending: 0.025,
        educationSpending: 0.04,
        healthcareSpending: 0.04,
        infrastructureSpending: 0.025,
        socialSpending: 0.05,
        scienceSpending: 0.008,
        intelligenceSpending: 0.008
      },
      approvalRating: 0.35,
      democracyIndex: 0.22,
      corruptionIndex: 0.75,
      stabilityIndex: 0.45,
      ideology: { democracy: 0.15, economy: 0.35 },
      parties: [
        { name: 'Консерваторы', support: 0.55, ideology: { democracy: 0.1, economy: 0.35 } },
        { name: 'Реформисты', support: 0.35, ideology: { democracy: 0.4, economy: 0.45 } }
      ],
      militaryBudget: 25e9,
      units: {
        infantry: { count: 400000, equipment: 42, training: 55, morale: 62 },
        armor: { count: 1600, equipment: 38, training: 48, morale: 55 },
        air: { count: 500, equipment: 35, training: 45, morale: 52 },
        navy: { count: 100, equipment: 40, training: 48, morale: 55 },
        missiles: { count: 300, equipment: 62, training: 60, morale: 65 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0.05,
      population: 88e6,
      populationGrowth: 0.009,
      literacy: 0.88,
      healthIndex: 0.68,
      unemployment: 0.095,
      emigrationRate: 0.005,
      techLevel: { military: 52, civilian: 42, industrial: 45, digital: 42 },
      intelligenceBudget: 4e9,
      agentCount: 25,
      counterintelligence: 60,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== ISRAEL =====================
    {
      id: 'isr',
      name: 'Израиль',
      nameEn: 'Israel',
      flag: '\u{1F1EE}\u{1F1F1}',
      region: 'middle_east',
      gdp: 525e9,
      gdpGrowth: 0.035,
      inflation: 0.04,
      debt: 310e9,
      debtToGDP: 0.59,
      foreignReserves: 200e9,
      tradeBalance: -15e9,
      sectors: {
        agriculture: { level: 55, output: 0.01, employment: 0.01 },
        industry: { level: 72, output: 0.17, employment: 0.17 },
        services: { level: 80, output: 0.65, employment: 0.65 },
        tech: { level: 92, output: 0.17, employment: 0.17 }
      },
      budget: {
        taxRate: 0.33,
        militarySpending: 0.052,
        educationSpending: 0.06,
        healthcareSpending: 0.055,
        infrastructureSpending: 0.025,
        socialSpending: 0.05,
        scienceSpending: 0.045,
        intelligenceSpending: 0.015
      },
      approvalRating: 0.42,
      democracyIndex: 0.73,
      corruptionIndex: 0.38,
      stabilityIndex: 0.58,
      ideology: { democracy: 0.72, economy: 0.7 },
      parties: [
        { name: 'Ликуд', support: 0.30, ideology: { democracy: 0.6, economy: 0.72 } },
        { name: 'Еш Атид', support: 0.18, ideology: { democracy: 0.78, economy: 0.65 } }
      ],
      militaryBudget: 24e9,
      units: {
        infantry: { count: 170000, equipment: 82, training: 88, morale: 82 },
        armor: { count: 2200, equipment: 82, training: 85, morale: 80 },
        air: { count: 580, equipment: 88, training: 90, morale: 82 },
        navy: { count: 65, equipment: 75, training: 78, morale: 75 },
        missiles: { count: 200, equipment: 90, training: 88, morale: 82 },
        nuclear: { count: 90, equipment: 85, training: 85, morale: 82 }
      },
      warFatigue: 0.15,
      population: 9.5e6,
      populationGrowth: 0.015,
      literacy: 0.98,
      healthIndex: 0.86,
      unemployment: 0.035,
      emigrationRate: 0.004,
      techLevel: { military: 88, civilian: 88, industrial: 72, digital: 92 },
      intelligenceBudget: 8e9,
      agentCount: 35,
      counterintelligence: 85,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },
    // ===================== POLAND =====================
    {
      id: 'pol',
      name: 'Польша',
      nameEn: 'Poland',
      flag: '\u{1F1F5}\u{1F1F1}',
      region: 'europe',
      gdp: 688e9,
      gdpGrowth: 0.035,
      inflation: 0.068,
      debt: 380e9,
      debtToGDP: 0.55,
      foreignReserves: 170e9,
      tradeBalance: -10e9,
      sectors: {
        agriculture: { level: 40, output: 0.03, employment: 0.09 },
        industry: { level: 62, output: 0.29, employment: 0.30 },
        services: { level: 65, output: 0.58, employment: 0.55 },
        tech: { level: 52, output: 0.10, employment: 0.06 }
      },
      budget: {
        taxRate: 0.32,
        militarySpending: 0.04,
        educationSpending: 0.045,
        healthcareSpending: 0.05,
        infrastructureSpending: 0.03,
        socialSpending: 0.08,
        scienceSpending: 0.012,
        intelligenceSpending: 0.004
      },
      approvalRating: 0.42,
      democracyIndex: 0.72,
      corruptionIndex: 0.42,
      stabilityIndex: 0.75,
      ideology: { democracy: 0.72, economy: 0.62 },
      parties: [
        { name: 'Гражданская коалиция', support: 0.35, ideology: { democracy: 0.82, economy: 0.65 } },
        { name: 'Право и справедливость', support: 0.32, ideology: { democracy: 0.55, economy: 0.55 } }
      ],
      militaryBudget: 27e9,
      units: {
        infantry: { count: 114000, equipment: 62, training: 65, morale: 68 },
        armor: { count: 900, equipment: 58, training: 60, morale: 62 },
        air: { count: 460, equipment: 65, training: 65, morale: 65 },
        navy: { count: 30, equipment: 52, training: 55, morale: 58 },
        missiles: { count: 40, equipment: 58, training: 58, morale: 60 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 38e6,
      populationGrowth: -0.002,
      literacy: 0.99,
      healthIndex: 0.80,
      unemployment: 0.029,
      emigrationRate: 0.004,
      techLevel: { military: 58, civilian: 65, industrial: 62, digital: 68 },
      intelligenceBudget: 1.5e9,
      agentCount: 12,
      counterintelligence: 52,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== UKRAINE =====================
    {
      id: 'ukr',
      name: 'Украина',
      nameEn: 'Ukraine',
      flag: '\u{1F1FA}\u{1F1E6}',
      region: 'europe',
      gdp: 160e9,
      gdpGrowth: -0.05,
      inflation: 0.12,
      debt: 105e9,
      debtToGDP: 0.66,
      foreignReserves: 40e9,
      tradeBalance: -20e9,
      sectors: {
        agriculture: { level: 45, output: 0.10, employment: 0.14 },
        industry: { level: 42, output: 0.22, employment: 0.24 },
        services: { level: 45, output: 0.58, employment: 0.52 },
        tech: { level: 48, output: 0.10, employment: 0.10 }
      },
      budget: {
        taxRate: 0.22,
        militarySpending: 0.20,
        educationSpending: 0.04,
        healthcareSpending: 0.03,
        infrastructureSpending: 0.015,
        socialSpending: 0.06,
        scienceSpending: 0.005,
        intelligenceSpending: 0.008
      },
      approvalRating: 0.60,
      democracyIndex: 0.56,
      corruptionIndex: 0.67,
      stabilityIndex: 0.30,
      ideology: { democracy: 0.65, economy: 0.55 },
      parties: [
        { name: 'Слуга народа', support: 0.40, ideology: { democracy: 0.65, economy: 0.55 } },
        { name: 'Европейская солидарность', support: 0.18, ideology: { democracy: 0.75, economy: 0.65 } }
      ],
      militaryBudget: 44e9,
      units: {
        infantry: { count: 700000, equipment: 50, training: 72, morale: 82 },
        armor: { count: 1500, equipment: 42, training: 65, morale: 78 },
        air: { count: 200, equipment: 38, training: 55, morale: 72 },
        navy: { count: 15, equipment: 30, training: 45, morale: 65 },
        missiles: { count: 100, equipment: 55, training: 62, morale: 78 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0.5,
      population: 37e6,
      populationGrowth: -0.01,
      literacy: 0.998,
      healthIndex: 0.65,
      unemployment: 0.15,
      emigrationRate: 0.02,
      techLevel: { military: 50, civilian: 52, industrial: 42, digital: 58 },
      intelligenceBudget: 2e9,
      agentCount: 18,
      counterintelligence: 55,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== EGYPT =====================
    {
      id: 'egy',
      name: 'Египет',
      nameEn: 'Egypt',
      flag: '\u{1F1EA}\u{1F1EC}',
      region: 'africa',
      gdp: 400e9,
      gdpGrowth: 0.04,
      inflation: 0.25,
      debt: 165e9,
      debtToGDP: 0.41,
      foreignReserves: 35e9,
      tradeBalance: -35e9,
      sectors: {
        agriculture: { level: 30, output: 0.12, employment: 0.25 },
        industry: { level: 38, output: 0.32, employment: 0.25 },
        services: { level: 42, output: 0.50, employment: 0.42 },
        tech: { level: 25, output: 0.06, employment: 0.08 }
      },
      budget: {
        taxRate: 0.15,
        militarySpending: 0.012,
        educationSpending: 0.025,
        healthcareSpending: 0.015,
        infrastructureSpending: 0.03,
        socialSpending: 0.06,
        scienceSpending: 0.005,
        intelligenceSpending: 0.005
      },
      approvalRating: 0.50,
      democracyIndex: 0.27,
      corruptionIndex: 0.67,
      stabilityIndex: 0.52,
      ideology: { democracy: 0.2, economy: 0.45 },
      parties: [
        { name: 'Мустакбаль Ватан', support: 0.60, ideology: { democracy: 0.15, economy: 0.5 } }
      ],
      militaryBudget: 6e9,
      units: {
        infantry: { count: 340000, equipment: 48, training: 52, morale: 55 },
        armor: { count: 4000, equipment: 45, training: 48, morale: 50 },
        air: { count: 900, equipment: 52, training: 55, morale: 52 },
        navy: { count: 60, equipment: 42, training: 45, morale: 48 },
        missiles: { count: 80, equipment: 48, training: 48, morale: 50 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 110e6,
      populationGrowth: 0.017,
      literacy: 0.73,
      healthIndex: 0.62,
      unemployment: 0.072,
      emigrationRate: 0.003,
      techLevel: { military: 45, civilian: 38, industrial: 35, digital: 40 },
      intelligenceBudget: 2e9,
      agentCount: 15,
      counterintelligence: 48,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== PAKISTAN =====================
    {
      id: 'pak',
      name: 'Пакистан',
      nameEn: 'Pakistan',
      flag: '\u{1F1F5}\u{1F1F0}',
      region: 'south_asia',
      gdp: 340e9,
      gdpGrowth: 0.02,
      inflation: 0.25,
      debt: 280e9,
      debtToGDP: 0.82,
      foreignReserves: 12e9,
      tradeBalance: -30e9,
      sectors: {
        agriculture: { level: 28, output: 0.22, employment: 0.37 },
        industry: { level: 35, output: 0.20, employment: 0.24 },
        services: { level: 40, output: 0.52, employment: 0.32 },
        tech: { level: 28, output: 0.06, employment: 0.07 }
      },
      budget: {
        taxRate: 0.11,
        militarySpending: 0.035,
        educationSpending: 0.02,
        healthcareSpending: 0.012,
        infrastructureSpending: 0.015,
        socialSpending: 0.02,
        scienceSpending: 0.003,
        intelligenceSpending: 0.006
      },
      approvalRating: 0.35,
      democracyIndex: 0.38,
      corruptionIndex: 0.72,
      stabilityIndex: 0.38,
      ideology: { democracy: 0.38, economy: 0.45 },
      parties: [
        { name: 'ПМЛ(Н)', support: 0.35, ideology: { democracy: 0.45, economy: 0.55 } },
        { name: 'ПТИ', support: 0.40, ideology: { democracy: 0.5, economy: 0.55 } }
      ],
      militaryBudget: 10e9,
      units: {
        infantry: { count: 560000, equipment: 42, training: 52, morale: 58 },
        armor: { count: 2800, equipment: 40, training: 48, morale: 55 },
        air: { count: 900, equipment: 48, training: 52, morale: 55 },
        navy: { count: 30, equipment: 38, training: 42, morale: 48 },
        missiles: { count: 150, equipment: 55, training: 55, morale: 60 },
        nuclear: { count: 170, equipment: 52, training: 58, morale: 62 }
      },
      warFatigue: 0.05,
      population: 230e6,
      populationGrowth: 0.018,
      literacy: 0.58,
      healthIndex: 0.52,
      unemployment: 0.065,
      emigrationRate: 0.005,
      techLevel: { military: 48, civilian: 35, industrial: 32, digital: 38 },
      intelligenceBudget: 3e9,
      agentCount: 22,
      counterintelligence: 52,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== NIGERIA =====================
    {
      id: 'nga',
      name: 'Нигерия',
      nameEn: 'Nigeria',
      flag: '\u{1F1F3}\u{1F1EC}',
      region: 'africa',
      gdp: 477e9,
      gdpGrowth: 0.03,
      inflation: 0.22,
      debt: 100e9,
      debtToGDP: 0.21,
      foreignReserves: 36e9,
      tradeBalance: 10e9,
      sectors: {
        agriculture: { level: 22, output: 0.24, employment: 0.35 },
        industry: { level: 32, output: 0.30, employment: 0.12 },
        services: { level: 38, output: 0.42, employment: 0.45 },
        tech: { level: 22, output: 0.04, employment: 0.08 }
      },
      budget: {
        taxRate: 0.06,
        militarySpending: 0.006,
        educationSpending: 0.015,
        healthcareSpending: 0.008,
        infrastructureSpending: 0.012,
        socialSpending: 0.015,
        scienceSpending: 0.001,
        intelligenceSpending: 0.002
      },
      approvalRating: 0.30,
      democracyIndex: 0.43,
      corruptionIndex: 0.75,
      stabilityIndex: 0.38,
      ideology: { democracy: 0.45, economy: 0.5 },
      parties: [
        { name: 'ВПК', support: 0.45, ideology: { democracy: 0.4, economy: 0.55 } },
        { name: 'НДП', support: 0.35, ideology: { democracy: 0.45, economy: 0.5 } }
      ],
      militaryBudget: 3e9,
      units: {
        infantry: { count: 135000, equipment: 32, training: 38, morale: 40 },
        armor: { count: 350, equipment: 28, training: 32, morale: 35 },
        air: { count: 100, equipment: 35, training: 38, morale: 38 },
        navy: { count: 25, equipment: 28, training: 32, morale: 35 },
        missiles: { count: 10, equipment: 25, training: 28, morale: 30 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0.1,
      population: 223e6,
      populationGrowth: 0.024,
      literacy: 0.62,
      healthIndex: 0.48,
      unemployment: 0.33,
      emigrationRate: 0.004,
      techLevel: { military: 28, civilian: 30, industrial: 28, digital: 35 },
      intelligenceBudget: 0.5e9,
      agentCount: 8,
      counterintelligence: 30,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },
    // ===================== SOUTH AFRICA =====================
    {
      id: 'zaf',
      name: 'ЮАР',
      nameEn: 'South Africa',
      flag: '\u{1F1FF}\u{1F1E6}',
      region: 'africa',
      gdp: 399e9,
      gdpGrowth: 0.012,
      inflation: 0.058,
      debt: 260e9,
      debtToGDP: 0.65,
      foreignReserves: 60e9,
      tradeBalance: 10e9,
      sectors: {
        agriculture: { level: 28, output: 0.03, employment: 0.05 },
        industry: { level: 42, output: 0.26, employment: 0.22 },
        services: { level: 55, output: 0.63, employment: 0.60 },
        tech: { level: 35, output: 0.08, employment: 0.13 }
      },
      budget: {
        taxRate: 0.26,
        militarySpending: 0.01,
        educationSpending: 0.06,
        healthcareSpending: 0.04,
        infrastructureSpending: 0.02,
        socialSpending: 0.07,
        scienceSpending: 0.008,
        intelligenceSpending: 0.003
      },
      approvalRating: 0.35,
      democracyIndex: 0.72,
      corruptionIndex: 0.56,
      stabilityIndex: 0.52,
      ideology: { democracy: 0.7, economy: 0.5 },
      parties: [
        { name: 'АНК', support: 0.42, ideology: { democracy: 0.6, economy: 0.4 } },
        { name: 'Демократический альянс', support: 0.25, ideology: { democracy: 0.78, economy: 0.7 } }
      ],
      militaryBudget: 4e9,
      units: {
        infantry: { count: 40000, equipment: 38, training: 45, morale: 45 },
        armor: { count: 190, equipment: 32, training: 38, morale: 40 },
        air: { count: 220, equipment: 42, training: 45, morale: 42 },
        navy: { count: 30, equipment: 35, training: 40, morale: 42 },
        missiles: { count: 10, equipment: 30, training: 32, morale: 35 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 60e6,
      populationGrowth: 0.008,
      literacy: 0.87,
      healthIndex: 0.58,
      unemployment: 0.33,
      emigrationRate: 0.004,
      techLevel: { military: 38, civilian: 48, industrial: 42, digital: 50 },
      intelligenceBudget: 1e9,
      agentCount: 10,
      counterintelligence: 42,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== ARGENTINA =====================
    {
      id: 'arg',
      name: 'Аргентина',
      nameEn: 'Argentina',
      flag: '\u{1F1E6}\u{1F1F7}',
      region: 'south_america',
      gdp: 640e9,
      gdpGrowth: -0.01,
      inflation: 1.4,
      debt: 400e9,
      debtToGDP: 0.63,
      foreignReserves: 28e9,
      tradeBalance: 10e9,
      sectors: {
        agriculture: { level: 52, output: 0.07, employment: 0.05 },
        industry: { level: 42, output: 0.23, employment: 0.21 },
        services: { level: 55, output: 0.60, employment: 0.62 },
        tech: { level: 38, output: 0.10, employment: 0.12 }
      },
      budget: {
        taxRate: 0.29,
        militarySpending: 0.007,
        educationSpending: 0.05,
        healthcareSpending: 0.06,
        infrastructureSpending: 0.015,
        socialSpending: 0.08,
        scienceSpending: 0.005,
        intelligenceSpending: 0.002
      },
      approvalRating: 0.45,
      democracyIndex: 0.71,
      corruptionIndex: 0.58,
      stabilityIndex: 0.50,
      ideology: { democracy: 0.72, economy: 0.55 },
      parties: [
        { name: 'Свобода наступает', support: 0.48, ideology: { democracy: 0.6, economy: 0.85 } },
        { name: 'Союз за Родину', support: 0.30, ideology: { democracy: 0.65, economy: 0.3 } }
      ],
      militaryBudget: 5e9,
      units: {
        infantry: { count: 50000, equipment: 38, training: 42, morale: 45 },
        armor: { count: 250, equipment: 32, training: 35, morale: 40 },
        air: { count: 250, equipment: 40, training: 42, morale: 42 },
        navy: { count: 40, equipment: 35, training: 38, morale: 40 },
        missiles: { count: 10, equipment: 28, training: 30, morale: 35 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 46e6,
      populationGrowth: 0.006,
      literacy: 0.99,
      healthIndex: 0.76,
      unemployment: 0.065,
      emigrationRate: 0.004,
      techLevel: { military: 35, civilian: 52, industrial: 42, digital: 55 },
      intelligenceBudget: 0.5e9,
      agentCount: 8,
      counterintelligence: 35,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== COLOMBIA =====================
    {
      id: 'col',
      name: 'Колумбия',
      nameEn: 'Colombia',
      flag: '\u{1F1E8}\u{1F1F4}',
      region: 'south_america',
      gdp: 335e9,
      gdpGrowth: 0.035,
      inflation: 0.095,
      debt: 190e9,
      debtToGDP: 0.57,
      foreignReserves: 58e9,
      tradeBalance: -12e9,
      sectors: {
        agriculture: { level: 32, output: 0.07, employment: 0.16 },
        industry: { level: 38, output: 0.25, employment: 0.20 },
        services: { level: 48, output: 0.60, employment: 0.55 },
        tech: { level: 30, output: 0.08, employment: 0.09 }
      },
      budget: {
        taxRate: 0.19,
        militarySpending: 0.032,
        educationSpending: 0.04,
        healthcareSpending: 0.05,
        infrastructureSpending: 0.025,
        socialSpending: 0.04,
        scienceSpending: 0.003,
        intelligenceSpending: 0.003
      },
      approvalRating: 0.35,
      democracyIndex: 0.65,
      corruptionIndex: 0.61,
      stabilityIndex: 0.50,
      ideology: { democracy: 0.65, economy: 0.55 },
      parties: [
        { name: 'Пакто Историко', support: 0.35, ideology: { democracy: 0.65, economy: 0.35 } },
        { name: 'Демократический центр', support: 0.25, ideology: { democracy: 0.6, economy: 0.7 } }
      ],
      militaryBudget: 10e9,
      units: {
        infantry: { count: 220000, equipment: 42, training: 55, morale: 55 },
        armor: { count: 100, equipment: 35, training: 42, morale: 48 },
        air: { count: 300, equipment: 48, training: 52, morale: 52 },
        navy: { count: 35, equipment: 38, training: 42, morale: 48 },
        missiles: { count: 10, equipment: 32, training: 35, morale: 40 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0.05,
      population: 52e6,
      populationGrowth: 0.005,
      literacy: 0.95,
      healthIndex: 0.68,
      unemployment: 0.10,
      emigrationRate: 0.005,
      techLevel: { military: 38, civilian: 45, industrial: 38, digital: 48 },
      intelligenceBudget: 1e9,
      agentCount: 10,
      counterintelligence: 42,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== THAILAND =====================
    {
      id: 'tha',
      name: 'Таиланд',
      nameEn: 'Thailand',
      flag: '\u{1F1F9}\u{1F1ED}',
      region: 'southeast_asia',
      gdp: 500e9,
      gdpGrowth: 0.028,
      inflation: 0.022,
      debt: 310e9,
      debtToGDP: 0.62,
      foreignReserves: 224e9,
      tradeBalance: 20e9,
      sectors: {
        agriculture: { level: 38, output: 0.08, employment: 0.30 },
        industry: { level: 55, output: 0.33, employment: 0.23 },
        services: { level: 58, output: 0.51, employment: 0.40 },
        tech: { level: 38, output: 0.08, employment: 0.07 }
      },
      budget: {
        taxRate: 0.17,
        militarySpending: 0.014,
        educationSpending: 0.03,
        healthcareSpending: 0.03,
        infrastructureSpending: 0.025,
        socialSpending: 0.03,
        scienceSpending: 0.01,
        intelligenceSpending: 0.003
      },
      approvalRating: 0.45,
      democracyIndex: 0.45,
      corruptionIndex: 0.64,
      stabilityIndex: 0.55,
      ideology: { democracy: 0.42, economy: 0.6 },
      parties: [
        { name: 'Пхыа Тхай', support: 0.35, ideology: { democracy: 0.5, economy: 0.55 } },
        { name: 'Движение вперёд', support: 0.30, ideology: { democracy: 0.75, economy: 0.6 } }
      ],
      militaryBudget: 7e9,
      units: {
        infantry: { count: 250000, equipment: 42, training: 48, morale: 50 },
        armor: { count: 700, equipment: 38, training: 42, morale: 45 },
        air: { count: 550, equipment: 48, training: 50, morale: 48 },
        navy: { count: 70, equipment: 42, training: 45, morale: 48 },
        missiles: { count: 20, equipment: 35, training: 38, morale: 42 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 72e6,
      populationGrowth: 0.001,
      literacy: 0.94,
      healthIndex: 0.72,
      unemployment: 0.012,
      emigrationRate: 0.002,
      techLevel: { military: 42, civilian: 52, industrial: 55, digital: 52 },
      intelligenceBudget: 1e9,
      agentCount: 10,
      counterintelligence: 42,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== VIETNAM =====================
    {
      id: 'vnm',
      name: 'Вьетнам',
      nameEn: 'Vietnam',
      flag: '\u{1F1FB}\u{1F1F3}',
      region: 'southeast_asia',
      gdp: 410e9,
      gdpGrowth: 0.065,
      inflation: 0.035,
      debt: 150e9,
      debtToGDP: 0.37,
      foreignReserves: 95e9,
      tradeBalance: 15e9,
      sectors: {
        agriculture: { level: 32, output: 0.12, employment: 0.35 },
        industry: { level: 52, output: 0.38, employment: 0.30 },
        services: { level: 45, output: 0.42, employment: 0.30 },
        tech: { level: 38, output: 0.08, employment: 0.05 }
      },
      budget: {
        taxRate: 0.18,
        militarySpending: 0.02,
        educationSpending: 0.04,
        healthcareSpending: 0.03,
        infrastructureSpending: 0.035,
        socialSpending: 0.03,
        scienceSpending: 0.005,
        intelligenceSpending: 0.004
      },
      approvalRating: 0.65,
      democracyIndex: 0.24,
      corruptionIndex: 0.63,
      stabilityIndex: 0.72,
      ideology: { democracy: 0.15, economy: 0.5 },
      parties: [
        { name: 'Коммунистическая партия Вьетнама', support: 0.90, ideology: { democracy: 0.1, economy: 0.45 } }
      ],
      militaryBudget: 7.5e9,
      units: {
        infantry: { count: 420000, equipment: 38, training: 52, morale: 65 },
        armor: { count: 1500, equipment: 32, training: 45, morale: 58 },
        air: { count: 280, equipment: 42, training: 48, morale: 58 },
        navy: { count: 60, equipment: 38, training: 45, morale: 55 },
        missiles: { count: 50, equipment: 42, training: 45, morale: 55 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 100e6,
      populationGrowth: 0.009,
      literacy: 0.96,
      healthIndex: 0.68,
      unemployment: 0.023,
      emigrationRate: 0.003,
      techLevel: { military: 38, civilian: 42, industrial: 48, digital: 48 },
      intelligenceBudget: 1e9,
      agentCount: 12,
      counterintelligence: 48,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },
    // ===================== NORTH KOREA =====================
    {
      id: 'prk',
      name: 'КНДР',
      nameEn: 'North Korea',
      flag: '\u{1F1F0}\u{1F1F5}',
      region: 'east_asia',
      gdp: 18e9,
      gdpGrowth: 0.005,
      inflation: 0.10,
      debt: 5e9,
      debtToGDP: 0.28,
      foreignReserves: 2e9,
      tradeBalance: -1e9,
      sectors: {
        agriculture: { level: 18, output: 0.22, employment: 0.35 },
        industry: { level: 32, output: 0.45, employment: 0.30 },
        services: { level: 15, output: 0.28, employment: 0.25 },
        tech: { level: 28, output: 0.05, employment: 0.10 }
      },
      budget: {
        taxRate: 0.0,
        militarySpending: 0.25,
        educationSpending: 0.02,
        healthcareSpending: 0.01,
        infrastructureSpending: 0.02,
        socialSpending: 0.02,
        scienceSpending: 0.01,
        intelligenceSpending: 0.015
      },
      approvalRating: 0.95,
      democracyIndex: 0.05,
      corruptionIndex: 0.88,
      stabilityIndex: 0.65,
      ideology: { democracy: 0.02, economy: 0.05 },
      parties: [
        { name: 'Трудовая партия Кореи', support: 0.99, ideology: { democracy: 0.02, economy: 0.05 } }
      ],
      militaryBudget: 4e9,
      units: {
        infantry: { count: 1100000, equipment: 25, training: 52, morale: 60 },
        armor: { count: 4500, equipment: 22, training: 38, morale: 48 },
        air: { count: 900, equipment: 20, training: 32, morale: 42 },
        navy: { count: 70, equipment: 18, training: 28, morale: 38 },
        missiles: { count: 200, equipment: 55, training: 55, morale: 65 },
        nuclear: { count: 50, equipment: 42, training: 48, morale: 65 }
      },
      warFatigue: 0,
      population: 26e6,
      populationGrowth: 0.004,
      literacy: 1.0,
      healthIndex: 0.45,
      unemployment: 0.03,
      emigrationRate: 0.0001,
      techLevel: { military: 40, civilian: 15, industrial: 22, digital: 10 },
      intelligenceBudget: 1e9,
      agentCount: 20,
      counterintelligence: 65,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== SWEDEN =====================
    {
      id: 'swe',
      name: 'Швеция',
      nameEn: 'Sweden',
      flag: '\u{1F1F8}\u{1F1EA}',
      region: 'europe',
      gdp: 585e9,
      gdpGrowth: 0.015,
      inflation: 0.065,
      debt: 220e9,
      debtToGDP: 0.38,
      foreignReserves: 62e9,
      tradeBalance: 25e9,
      sectors: {
        agriculture: { level: 55, output: 0.01, employment: 0.02 },
        industry: { level: 78, output: 0.24, employment: 0.18 },
        services: { level: 85, output: 0.64, employment: 0.70 },
        tech: { level: 82, output: 0.11, employment: 0.10 }
      },
      budget: {
        taxRate: 0.44,
        militarySpending: 0.015,
        educationSpending: 0.065,
        healthcareSpending: 0.085,
        infrastructureSpending: 0.03,
        socialSpending: 0.14,
        scienceSpending: 0.033,
        intelligenceSpending: 0.003
      },
      approvalRating: 0.42,
      democracyIndex: 0.92,
      corruptionIndex: 0.15,
      stabilityIndex: 0.92,
      ideology: { democracy: 0.95, economy: 0.6 },
      parties: [
        { name: 'Социал-демократы', support: 0.32, ideology: { democracy: 0.92, economy: 0.4 } },
        { name: 'Умеренная партия', support: 0.22, ideology: { democracy: 0.88, economy: 0.72 } }
      ],
      militaryBudget: 9e9,
      units: {
        infantry: { count: 25000, equipment: 72, training: 75, morale: 72 },
        armor: { count: 120, equipment: 70, training: 72, morale: 70 },
        air: { count: 200, equipment: 78, training: 78, morale: 72 },
        navy: { count: 35, equipment: 72, training: 72, morale: 70 },
        missiles: { count: 30, equipment: 68, training: 68, morale: 68 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 10.5e6,
      populationGrowth: 0.005,
      literacy: 0.99,
      healthIndex: 0.92,
      unemployment: 0.075,
      emigrationRate: 0.002,
      techLevel: { military: 72, civilian: 85, industrial: 78, digital: 88 },
      intelligenceBudget: 1.2e9,
      agentCount: 10,
      counterintelligence: 55,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== NORWAY =====================
    {
      id: 'nor',
      name: 'Норвегия',
      nameEn: 'Norway',
      flag: '\u{1F1F3}\u{1F1F4}',
      region: 'europe',
      gdp: 482e9,
      gdpGrowth: 0.018,
      inflation: 0.055,
      debt: 190e9,
      debtToGDP: 0.39,
      foreignReserves: 82e9,
      tradeBalance: 80e9,
      sectors: {
        agriculture: { level: 48, output: 0.02, employment: 0.02 },
        industry: { level: 72, output: 0.35, employment: 0.19 },
        services: { level: 82, output: 0.55, employment: 0.72 },
        tech: { level: 72, output: 0.08, employment: 0.07 }
      },
      budget: {
        taxRate: 0.40,
        militarySpending: 0.018,
        educationSpending: 0.06,
        healthcareSpending: 0.085,
        infrastructureSpending: 0.035,
        socialSpending: 0.12,
        scienceSpending: 0.02,
        intelligenceSpending: 0.003
      },
      approvalRating: 0.50,
      democracyIndex: 0.95,
      corruptionIndex: 0.12,
      stabilityIndex: 0.95,
      ideology: { democracy: 0.95, economy: 0.62 },
      parties: [
        { name: 'Лейбористская партия', support: 0.28, ideology: { democracy: 0.92, economy: 0.42 } },
        { name: 'Хёйре', support: 0.25, ideology: { democracy: 0.9, economy: 0.72 } }
      ],
      militaryBudget: 8e9,
      units: {
        infantry: { count: 16000, equipment: 75, training: 78, morale: 75 },
        armor: { count: 52, equipment: 72, training: 72, morale: 72 },
        air: { count: 120, equipment: 82, training: 80, morale: 75 },
        navy: { count: 25, equipment: 78, training: 78, morale: 75 },
        missiles: { count: 15, equipment: 72, training: 70, morale: 70 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 5.5e6,
      populationGrowth: 0.005,
      literacy: 0.99,
      healthIndex: 0.94,
      unemployment: 0.035,
      emigrationRate: 0.002,
      techLevel: { military: 72, civilian: 82, industrial: 72, digital: 85 },
      intelligenceBudget: 1e9,
      agentCount: 8,
      counterintelligence: 55,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== SWITZERLAND =====================
    {
      id: 'che',
      name: 'Швейцария',
      nameEn: 'Switzerland',
      flag: '\u{1F1E8}\u{1F1ED}',
      region: 'europe',
      gdp: 818e9,
      gdpGrowth: 0.015,
      inflation: 0.022,
      debt: 220e9,
      debtToGDP: 0.27,
      foreignReserves: 850e9,
      tradeBalance: 60e9,
      sectors: {
        agriculture: { level: 55, output: 0.01, employment: 0.03 },
        industry: { level: 82, output: 0.25, employment: 0.20 },
        services: { level: 90, output: 0.66, employment: 0.70 },
        tech: { level: 82, output: 0.08, employment: 0.07 }
      },
      budget: {
        taxRate: 0.28,
        militarySpending: 0.007,
        educationSpending: 0.05,
        healthcareSpending: 0.09,
        infrastructureSpending: 0.03,
        socialSpending: 0.08,
        scienceSpending: 0.03,
        intelligenceSpending: 0.002
      },
      approvalRating: 0.55,
      democracyIndex: 0.92,
      corruptionIndex: 0.14,
      stabilityIndex: 0.96,
      ideology: { democracy: 0.92, economy: 0.75 },
      parties: [
        { name: 'Швейцарская народная партия', support: 0.28, ideology: { democracy: 0.75, economy: 0.75 } },
        { name: 'Социал-демократическая партия', support: 0.18, ideology: { democracy: 0.9, economy: 0.4 } }
      ],
      militaryBudget: 6e9,
      units: {
        infantry: { count: 20000, equipment: 78, training: 75, morale: 72 },
        armor: { count: 130, equipment: 72, training: 70, morale: 70 },
        air: { count: 140, equipment: 80, training: 78, morale: 72 },
        navy: { count: 0, equipment: 0, training: 0, morale: 0 },
        missiles: { count: 20, equipment: 70, training: 68, morale: 68 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 8.8e6,
      populationGrowth: 0.006,
      literacy: 0.99,
      healthIndex: 0.94,
      unemployment: 0.022,
      emigrationRate: 0.003,
      techLevel: { military: 72, civilian: 88, industrial: 82, digital: 85 },
      intelligenceBudget: 1e9,
      agentCount: 8,
      counterintelligence: 55,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== NETHERLANDS =====================
    {
      id: 'nld',
      name: 'Нидерланды',
      nameEn: 'Netherlands',
      flag: '\u{1F1F3}\u{1F1F1}',
      region: 'europe',
      gdp: 1010e9,
      gdpGrowth: 0.015,
      inflation: 0.048,
      debt: 520e9,
      debtToGDP: 0.51,
      foreignReserves: 42e9,
      tradeBalance: 90e9,
      sectors: {
        agriculture: { level: 60, output: 0.02, employment: 0.02 },
        industry: { level: 78, output: 0.18, employment: 0.16 },
        services: { level: 88, output: 0.70, employment: 0.73 },
        tech: { level: 82, output: 0.10, employment: 0.09 }
      },
      budget: {
        taxRate: 0.39,
        militarySpending: 0.015,
        educationSpending: 0.05,
        healthcareSpending: 0.08,
        infrastructureSpending: 0.025,
        socialSpending: 0.10,
        scienceSpending: 0.02,
        intelligenceSpending: 0.003
      },
      approvalRating: 0.42,
      democracyIndex: 0.90,
      corruptionIndex: 0.18,
      stabilityIndex: 0.88,
      ideology: { democracy: 0.92, economy: 0.72 },
      parties: [
        { name: 'НПС', support: 0.25, ideology: { democracy: 0.82, economy: 0.72 } },
        { name: 'ПСТ-ЗЛ', support: 0.16, ideology: { democracy: 0.9, economy: 0.35 } }
      ],
      militaryBudget: 15e9,
      units: {
        infantry: { count: 22000, equipment: 72, training: 75, morale: 72 },
        armor: { count: 50, equipment: 75, training: 72, morale: 70 },
        air: { count: 120, equipment: 82, training: 78, morale: 72 },
        navy: { count: 30, equipment: 75, training: 75, morale: 72 },
        missiles: { count: 15, equipment: 68, training: 68, morale: 68 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 17.7e6,
      populationGrowth: 0.003,
      literacy: 0.99,
      healthIndex: 0.90,
      unemployment: 0.035,
      emigrationRate: 0.003,
      techLevel: { military: 72, civilian: 85, industrial: 78, digital: 88 },
      intelligenceBudget: 1.2e9,
      agentCount: 10,
      counterintelligence: 55,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },
    // ===================== BELGIUM =====================
    {
      id: 'bel',
      name: 'Бельгия',
      nameEn: 'Belgium',
      flag: '\u{1F1E7}\u{1F1EA}',
      region: 'europe',
      gdp: 580e9,
      gdpGrowth: 0.012,
      inflation: 0.035,
      debt: 610e9,
      debtToGDP: 1.05,
      foreignReserves: 35e9,
      tradeBalance: 15e9,
      sectors: {
        agriculture: { level: 52, output: 0.01, employment: 0.01 },
        industry: { level: 70, output: 0.21, employment: 0.18 },
        services: { level: 80, output: 0.69, employment: 0.72 },
        tech: { level: 68, output: 0.09, employment: 0.09 }
      },
      budget: {
        taxRate: 0.44,
        militarySpending: 0.011,
        educationSpending: 0.06,
        healthcareSpending: 0.08,
        infrastructureSpending: 0.025,
        socialSpending: 0.12,
        scienceSpending: 0.025,
        intelligenceSpending: 0.002
      },
      approvalRating: 0.38,
      democracyIndex: 0.86,
      corruptionIndex: 0.25,
      stabilityIndex: 0.78,
      ideology: { democracy: 0.9, economy: 0.62 },
      parties: [
        { name: 'Нов-ВА', support: 0.22, ideology: { democracy: 0.72, economy: 0.72 } },
        { name: 'Вооруит', support: 0.15, ideology: { democracy: 0.88, economy: 0.65 } }
      ],
      militaryBudget: 6e9,
      units: {
        infantry: { count: 24000, equipment: 68, training: 70, morale: 65 },
        armor: { count: 50, equipment: 65, training: 65, morale: 62 },
        air: { count: 90, equipment: 75, training: 72, morale: 68 },
        navy: { count: 10, equipment: 62, training: 65, morale: 62 },
        missiles: { count: 10, equipment: 58, training: 58, morale: 58 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 11.6e6,
      populationGrowth: 0.003,
      literacy: 0.99,
      healthIndex: 0.88,
      unemployment: 0.058,
      emigrationRate: 0.003,
      techLevel: { military: 65, civilian: 78, industrial: 72, digital: 78 },
      intelligenceBudget: 0.8e9,
      agentCount: 8,
      counterintelligence: 48,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== GREECE =====================
    {
      id: 'grc',
      name: 'Греция',
      nameEn: 'Greece',
      flag: '\u{1F1EC}\u{1F1F7}',
      region: 'europe',
      gdp: 220e9,
      gdpGrowth: 0.02,
      inflation: 0.04,
      debt: 400e9,
      debtToGDP: 1.82,
      foreignReserves: 12e9,
      tradeBalance: -25e9,
      sectors: {
        agriculture: { level: 38, output: 0.04, employment: 0.11 },
        industry: { level: 45, output: 0.15, employment: 0.15 },
        services: { level: 62, output: 0.72, employment: 0.65 },
        tech: { level: 38, output: 0.09, employment: 0.09 }
      },
      budget: {
        taxRate: 0.38,
        militarySpending: 0.035,
        educationSpending: 0.035,
        healthcareSpending: 0.045,
        infrastructureSpending: 0.02,
        socialSpending: 0.10,
        scienceSpending: 0.01,
        intelligenceSpending: 0.003
      },
      approvalRating: 0.38,
      democracyIndex: 0.78,
      corruptionIndex: 0.48,
      stabilityIndex: 0.62,
      ideology: { democracy: 0.8, economy: 0.55 },
      parties: [
        { name: 'Новая демократия', support: 0.40, ideology: { democracy: 0.78, economy: 0.68 } },
        { name: 'СИРИЗА', support: 0.22, ideology: { democracy: 0.8, economy: 0.32 } }
      ],
      militaryBudget: 8e9,
      units: {
        infantry: { count: 90000, equipment: 55, training: 60, morale: 58 },
        armor: { count: 1200, equipment: 48, training: 52, morale: 55 },
        air: { count: 560, equipment: 62, training: 62, morale: 58 },
        navy: { count: 65, equipment: 55, training: 58, morale: 58 },
        missiles: { count: 20, equipment: 52, training: 52, morale: 52 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 10.4e6,
      populationGrowth: -0.004,
      literacy: 0.98,
      healthIndex: 0.82,
      unemployment: 0.115,
      emigrationRate: 0.005,
      techLevel: { military: 55, civilian: 62, industrial: 48, digital: 62 },
      intelligenceBudget: 0.8e9,
      agentCount: 8,
      counterintelligence: 45,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== CZECH REPUBLIC =====================
    {
      id: 'cze',
      name: 'Чехия',
      nameEn: 'Czech Republic',
      flag: '\u{1F1E8}\u{1F1FF}',
      region: 'europe',
      gdp: 290e9,
      gdpGrowth: 0.025,
      inflation: 0.09,
      debt: 120e9,
      debtToGDP: 0.41,
      foreignReserves: 145e9,
      tradeBalance: 10e9,
      sectors: {
        agriculture: { level: 42, output: 0.02, employment: 0.03 },
        industry: { level: 72, output: 0.35, employment: 0.37 },
        services: { level: 68, output: 0.55, employment: 0.53 },
        tech: { level: 58, output: 0.08, employment: 0.07 }
      },
      budget: {
        taxRate: 0.34,
        militarySpending: 0.014,
        educationSpending: 0.04,
        healthcareSpending: 0.065,
        infrastructureSpending: 0.03,
        socialSpending: 0.08,
        scienceSpending: 0.018,
        intelligenceSpending: 0.003
      },
      approvalRating: 0.35,
      democracyIndex: 0.81,
      corruptionIndex: 0.42,
      stabilityIndex: 0.82,
      ideology: { democracy: 0.82, economy: 0.68 },
      parties: [
        { name: 'СПОЛ', support: 0.28, ideology: { democracy: 0.82, economy: 0.68 } },
        { name: 'АНО', support: 0.30, ideology: { democracy: 0.65, economy: 0.6 } }
      ],
      militaryBudget: 4e9,
      units: {
        infantry: { count: 26000, equipment: 62, training: 65, morale: 62 },
        armor: { count: 130, equipment: 58, training: 60, morale: 58 },
        air: { count: 100, equipment: 68, training: 68, morale: 62 },
        navy: { count: 0, equipment: 0, training: 0, morale: 0 },
        missiles: { count: 15, equipment: 55, training: 55, morale: 55 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 10.8e6,
      populationGrowth: 0.001,
      literacy: 0.99,
      healthIndex: 0.84,
      unemployment: 0.024,
      emigrationRate: 0.003,
      techLevel: { military: 58, civilian: 72, industrial: 72, digital: 72 },
      intelligenceBudget: 0.6e9,
      agentCount: 8,
      counterintelligence: 48,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== ROMANIA =====================
    {
      id: 'rou',
      name: 'Румыния',
      nameEn: 'Romania',
      flag: '\u{1F1F7}\u{1F1F4}',
      region: 'europe',
      gdp: 301e9,
      gdpGrowth: 0.045,
      inflation: 0.08,
      debt: 160e9,
      debtToGDP: 0.53,
      foreignReserves: 55e9,
      tradeBalance: -20e9,
      sectors: {
        agriculture: { level: 35, output: 0.04, employment: 0.21 },
        industry: { level: 52, output: 0.28, employment: 0.30 },
        services: { level: 55, output: 0.58, employment: 0.42 },
        tech: { level: 50, output: 0.10, employment: 0.07 }
      },
      budget: {
        taxRate: 0.26,
        militarySpending: 0.025,
        educationSpending: 0.03,
        healthcareSpending: 0.04,
        infrastructureSpending: 0.025,
        socialSpending: 0.07,
        scienceSpending: 0.005,
        intelligenceSpending: 0.003
      },
      approvalRating: 0.35,
      democracyIndex: 0.69,
      corruptionIndex: 0.56,
      stabilityIndex: 0.65,
      ideology: { democracy: 0.72, economy: 0.6 },
      parties: [
        { name: 'ПСД', support: 0.30, ideology: { democracy: 0.6, economy: 0.45 } },
        { name: 'НЛП', support: 0.25, ideology: { democracy: 0.75, economy: 0.65 } }
      ],
      militaryBudget: 7e9,
      units: {
        infantry: { count: 40000, equipment: 48, training: 52, morale: 52 },
        armor: { count: 350, equipment: 42, training: 45, morale: 48 },
        air: { count: 120, equipment: 52, training: 55, morale: 52 },
        navy: { count: 15, equipment: 38, training: 42, morale: 45 },
        missiles: { count: 15, equipment: 42, training: 42, morale: 45 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 19e6,
      populationGrowth: -0.005,
      literacy: 0.99,
      healthIndex: 0.76,
      unemployment: 0.055,
      emigrationRate: 0.008,
      techLevel: { military: 45, civilian: 58, industrial: 52, digital: 62 },
      intelligenceBudget: 0.5e9,
      agentCount: 8,
      counterintelligence: 42,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },

    // ===================== KAZAKHSTAN =====================
    {
      id: 'kaz',
      name: 'Казахстан',
      nameEn: 'Kazakhstan',
      flag: '\u{1F1F0}\u{1F1FF}',
      region: 'central_asia',
      gdp: 220e9,
      gdpGrowth: 0.04,
      inflation: 0.10,
      debt: 50e9,
      debtToGDP: 0.23,
      foreignReserves: 35e9,
      tradeBalance: 20e9,
      sectors: {
        agriculture: { level: 28, output: 0.05, employment: 0.15 },
        industry: { level: 48, output: 0.35, employment: 0.20 },
        services: { level: 45, output: 0.52, employment: 0.55 },
        tech: { level: 28, output: 0.08, employment: 0.10 }
      },
      budget: {
        taxRate: 0.18,
        militarySpending: 0.01,
        educationSpending: 0.03,
        healthcareSpending: 0.02,
        infrastructureSpending: 0.035,
        socialSpending: 0.04,
        scienceSpending: 0.003,
        intelligenceSpending: 0.004
      },
      approvalRating: 0.50,
      democracyIndex: 0.30,
      corruptionIndex: 0.65,
      stabilityIndex: 0.62,
      ideology: { democracy: 0.25, economy: 0.55 },
      parties: [
        { name: 'Аманат', support: 0.70, ideology: { democracy: 0.2, economy: 0.55 } }
      ],
      militaryBudget: 2.5e9,
      units: {
        infantry: { count: 40000, equipment: 42, training: 48, morale: 52 },
        armor: { count: 900, equipment: 38, training: 42, morale: 48 },
        air: { count: 200, equipment: 45, training: 48, morale: 50 },
        navy: { count: 10, equipment: 30, training: 32, morale: 38 },
        missiles: { count: 40, equipment: 42, training: 42, morale: 48 },
        nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
      },
      warFatigue: 0,
      population: 19.5e6,
      populationGrowth: 0.012,
      literacy: 0.998,
      healthIndex: 0.68,
      unemployment: 0.048,
      emigrationRate: 0.003,
      techLevel: { military: 40, civilian: 45, industrial: 42, digital: 45 },
      intelligenceBudget: 0.8e9,
      agentCount: 10,
      counterintelligence: 45,
      relations: {},
      alliances: [],
      sanctions: [],
      tradeAgreements: [],
      militaryStrength: 0
    },
  ];
}

// ============================================================
// Remaining Countries - Simplified auto-generated data
// ============================================================

// Development tiers: 1=very low, 2=low, 3=lower-middle, 4=upper-middle, 5=high, 6=very high
const REMAINING_COUNTRIES = [
  // Europe (remaining)
  { id: 'aut', name: 'Австрия', nameEn: 'Austria', flag: '\u{1F1E6}\u{1F1F9}', region: 'europe', tier: 6, pop: 9.1e6, gdp: 471e9, mil: 3.5e9 },
  { id: 'prt', name: 'Португалия', nameEn: 'Portugal', flag: '\u{1F1F5}\u{1F1F9}', region: 'europe', tier: 5, pop: 10.3e6, gdp: 252e9, mil: 4e9 },
  { id: 'fin', name: 'Финляндия', nameEn: 'Finland', flag: '\u{1F1EB}\u{1F1EE}', region: 'europe', tier: 6, pop: 5.5e6, gdp: 280e9, mil: 4.5e9 },
  { id: 'dnk', name: 'Дания', nameEn: 'Denmark', flag: '\u{1F1E9}\u{1F1F0}', region: 'europe', tier: 6, pop: 5.9e6, gdp: 395e9, mil: 5e9 },
  { id: 'irl', name: 'Ирландия', nameEn: 'Ireland', flag: '\u{1F1EE}\u{1F1EA}', region: 'europe', tier: 6, pop: 5.1e6, gdp: 530e9, mil: 1.2e9 },
  { id: 'hun', name: 'Венгрия', nameEn: 'Hungary', flag: '\u{1F1ED}\u{1F1FA}', region: 'europe', tier: 5, pop: 10e6, gdp: 188e9, mil: 2.5e9 },
  { id: 'svk', name: 'Словакия', nameEn: 'Slovakia', flag: '\u{1F1F8}\u{1F1F0}', region: 'europe', tier: 5, pop: 5.4e6, gdp: 115e9, mil: 2e9 },
  { id: 'bgr', name: 'Болгария', nameEn: 'Bulgaria', flag: '\u{1F1E7}\u{1F1EC}', region: 'europe', tier: 4, pop: 6.5e6, gdp: 89e9, mil: 1.5e9 },
  { id: 'hrv', name: 'Хорватия', nameEn: 'Croatia', flag: '\u{1F1ED}\u{1F1F7}', region: 'europe', tier: 5, pop: 3.9e6, gdp: 68e9, mil: 1e9 },
  { id: 'svn', name: 'Словения', nameEn: 'Slovenia', flag: '\u{1F1F8}\u{1F1EE}', region: 'europe', tier: 5, pop: 2.1e6, gdp: 62e9, mil: 0.7e9 },
  { id: 'est', name: 'Эстония', nameEn: 'Estonia', flag: '\u{1F1EA}\u{1F1EA}', region: 'europe', tier: 5, pop: 1.3e6, gdp: 38e9, mil: 0.8e9 },
  { id: 'lva', name: 'Латвия', nameEn: 'Latvia', flag: '\u{1F1F1}\u{1F1FB}', region: 'europe', tier: 5, pop: 1.8e6, gdp: 39e9, mil: 0.8e9 },
  { id: 'ltu', name: 'Литва', nameEn: 'Lithuania', flag: '\u{1F1F1}\u{1F1F9}', region: 'europe', tier: 5, pop: 2.8e6, gdp: 67e9, mil: 1.5e9 },
  { id: 'srb', name: 'Сербия', nameEn: 'Serbia', flag: '\u{1F1F7}\u{1F1F8}', region: 'europe', tier: 4, pop: 6.6e6, gdp: 63e9, mil: 1.3e9 },
  { id: 'blr', name: 'Беларусь', nameEn: 'Belarus', flag: '\u{1F1E7}\u{1F1FE}', region: 'europe', tier: 4, pop: 9.2e6, gdp: 70e9, mil: 1e9 },
  { id: 'mda', name: 'Молдова', nameEn: 'Moldova', flag: '\u{1F1F2}\u{1F1E9}', region: 'europe', tier: 3, pop: 2.6e6, gdp: 14e9, mil: 0.1e9 },
  { id: 'alb', name: 'Албания', nameEn: 'Albania', flag: '\u{1F1E6}\u{1F1F1}', region: 'europe', tier: 3, pop: 2.8e6, gdp: 18e9, mil: 0.2e9 },
  { id: 'mne', name: 'Черногория', nameEn: 'Montenegro', flag: '\u{1F1F2}\u{1F1EA}', region: 'europe', tier: 4, pop: 0.62e6, gdp: 6e9, mil: 0.1e9 },
  { id: 'mkd', name: 'Северная Македония', nameEn: 'North Macedonia', flag: '\u{1F1F2}\u{1F1F0}', region: 'europe', tier: 3, pop: 1.8e6, gdp: 13e9, mil: 0.2e9 },
  { id: 'bih', name: 'Босния и Герцеговина', nameEn: 'Bosnia and Herzegovina', flag: '\u{1F1E7}\u{1F1E6}', region: 'europe', tier: 3, pop: 3.2e6, gdp: 23e9, mil: 0.2e9 },
  { id: 'isl', name: 'Исландия', nameEn: 'Iceland', flag: '\u{1F1EE}\u{1F1F8}', region: 'europe', tier: 6, pop: 0.38e6, gdp: 25e9, mil: 0 },
  { id: 'lux', name: 'Люксембург', nameEn: 'Luxembourg', flag: '\u{1F1F1}\u{1F1FA}', region: 'europe', tier: 6, pop: 0.65e6, gdp: 82e9, mil: 0.5e9 },
  { id: 'cyp', name: 'Кипр', nameEn: 'Cyprus', flag: '\u{1F1E8}\u{1F1FE}', region: 'europe', tier: 5, pop: 1.2e6, gdp: 28e9, mil: 0.5e9 },
  { id: 'mlt', name: 'Мальта', nameEn: 'Malta', flag: '\u{1F1F2}\u{1F1F9}', region: 'europe', tier: 5, pop: 0.52e6, gdp: 18e9, mil: 0.1e9 },
  { id: 'geo', name: 'Грузия', nameEn: 'Georgia', flag: '\u{1F1EC}\u{1F1EA}', region: 'europe', tier: 3, pop: 3.7e6, gdp: 20e9, mil: 0.4e9 },
  { id: 'arm', name: 'Армения', nameEn: 'Armenia', flag: '\u{1F1E6}\u{1F1F2}', region: 'europe', tier: 3, pop: 2.8e6, gdp: 19e9, mil: 0.7e9 },
  { id: 'aze', name: 'Азербайджан', nameEn: 'Azerbaijan', flag: '\u{1F1E6}\u{1F1FF}', region: 'europe', tier: 4, pop: 10.1e6, gdp: 55e9, mil: 3e9 },

  // Middle East (remaining)
  { id: 'irq', name: 'Ирак', nameEn: 'Iraq', flag: '\u{1F1EE}\u{1F1F6}', region: 'middle_east', tier: 3, pop: 43e6, gdp: 264e9, mil: 7e9 },
  { id: 'are', name: 'ОАЭ', nameEn: 'United Arab Emirates', flag: '\u{1F1E6}\u{1F1EA}', region: 'middle_east', tier: 6, pop: 10e6, gdp: 507e9, mil: 22e9 },
  { id: 'qat', name: 'Катар', nameEn: 'Qatar', flag: '\u{1F1F6}\u{1F1E6}', region: 'middle_east', tier: 6, pop: 2.9e6, gdp: 221e9, mil: 4e9 },
  { id: 'kwt', name: 'Кувейт', nameEn: 'Kuwait', flag: '\u{1F1F0}\u{1F1FC}', region: 'middle_east', tier: 5, pop: 4.3e6, gdp: 175e9, mil: 7e9 },
  { id: 'omn', name: 'Оман', nameEn: 'Oman', flag: '\u{1F1F4}\u{1F1F2}', region: 'middle_east', tier: 5, pop: 4.6e6, gdp: 100e9, mil: 6e9 },
  { id: 'bhr', name: 'Бахрейн', nameEn: 'Bahrain', flag: '\u{1F1E7}\u{1F1ED}', region: 'middle_east', tier: 5, pop: 1.5e6, gdp: 44e9, mil: 1.5e9 },
  { id: 'jor', name: 'Иордания', nameEn: 'Jordan', flag: '\u{1F1EF}\u{1F1F4}', region: 'middle_east', tier: 3, pop: 11e6, gdp: 47e9, mil: 2e9 },
  { id: 'lbn', name: 'Ливан', nameEn: 'Lebanon', flag: '\u{1F1F1}\u{1F1E7}', region: 'middle_east', tier: 3, pop: 5.5e6, gdp: 22e9, mil: 0.5e9 },
  { id: 'syr', name: 'Сирия', nameEn: 'Syria', flag: '\u{1F1F8}\u{1F1FE}', region: 'middle_east', tier: 1, pop: 22e6, gdp: 11e9, mil: 1.5e9 },
  { id: 'yem', name: 'Йемен', nameEn: 'Yemen', flag: '\u{1F1FE}\u{1F1EA}', region: 'middle_east', tier: 1, pop: 33e6, gdp: 22e9, mil: 1e9 },

  // Central Asia (remaining)
  { id: 'uzb', name: 'Узбекистан', nameEn: 'Uzbekistan', flag: '\u{1F1FA}\u{1F1FF}', region: 'central_asia', tier: 3, pop: 35e6, gdp: 80e9, mil: 1.5e9 },
  { id: 'tkm', name: 'Туркменистан', nameEn: 'Turkmenistan', flag: '\u{1F1F9}\u{1F1F2}', region: 'central_asia', tier: 3, pop: 6.3e6, gdp: 45e9, mil: 0.5e9 },
  { id: 'tji', name: 'Таджикистан', nameEn: 'Tajikistan', flag: '\u{1F1F9}\u{1F1EF}', region: 'central_asia', tier: 2, pop: 10e6, gdp: 11e9, mil: 0.1e9 },
  { id: 'kgz', name: 'Кыргызстан', nameEn: 'Kyrgyzstan', flag: '\u{1F1F0}\u{1F1EC}', region: 'central_asia', tier: 2, pop: 6.7e6, gdp: 10e9, mil: 0.1e9 },
  { id: 'afg', name: 'Афганистан', nameEn: 'Afghanistan', flag: '\u{1F1E6}\u{1F1EB}', region: 'central_asia', tier: 1, pop: 41e6, gdp: 15e9, mil: 0.3e9 },
  { id: 'mng', name: 'Монголия', nameEn: 'Mongolia', flag: '\u{1F1F2}\u{1F1F3}', region: 'central_asia', tier: 3, pop: 3.4e6, gdp: 17e9, mil: 0.1e9 },
  // South Asia (remaining)
  { id: 'bgd', name: 'Бангладеш', nameEn: 'Bangladesh', flag: '\u{1F1E7}\u{1F1E9}', region: 'south_asia', tier: 2, pop: 170e6, gdp: 460e9, mil: 4e9 },
  { id: 'lka', name: 'Шри-Ланка', nameEn: 'Sri Lanka', flag: '\u{1F1F1}\u{1F1F0}', region: 'south_asia', tier: 3, pop: 22e6, gdp: 75e9, mil: 2e9 },
  { id: 'npl', name: 'Непал', nameEn: 'Nepal', flag: '\u{1F1F3}\u{1F1F5}', region: 'south_asia', tier: 2, pop: 30e6, gdp: 40e9, mil: 0.4e9 },
  { id: 'mmr', name: 'Мьянма', nameEn: 'Myanmar', flag: '\u{1F1F2}\u{1F1F2}', region: 'south_asia', tier: 2, pop: 55e6, gdp: 65e9, mil: 2.5e9 },

  // East Asia (remaining)
  { id: 'twn', name: 'Тайвань', nameEn: 'Taiwan', flag: '\u{1F1F9}\u{1F1FC}', region: 'east_asia', tier: 6, pop: 23.5e6, gdp: 790e9, mil: 16e9 },

  // Southeast Asia (remaining)
  { id: 'phl', name: 'Филиппины', nameEn: 'Philippines', flag: '\u{1F1F5}\u{1F1ED}', region: 'southeast_asia', tier: 3, pop: 115e6, gdp: 404e9, mil: 4e9 },
  { id: 'mys', name: 'Малайзия', nameEn: 'Malaysia', flag: '\u{1F1F2}\u{1F1FE}', region: 'southeast_asia', tier: 4, pop: 33e6, gdp: 400e9, mil: 4e9 },
  { id: 'sgp', name: 'Сингапур', nameEn: 'Singapore', flag: '\u{1F1F8}\u{1F1EC}', region: 'southeast_asia', tier: 6, pop: 5.9e6, gdp: 397e9, mil: 11e9 },
  { id: 'khm', name: 'Камбоджа', nameEn: 'Cambodia', flag: '\u{1F1F0}\u{1F1ED}', region: 'southeast_asia', tier: 2, pop: 17e6, gdp: 30e9, mil: 0.5e9 },
  { id: 'lao', name: 'Лаос', nameEn: 'Laos', flag: '\u{1F1F1}\u{1F1E6}', region: 'southeast_asia', tier: 2, pop: 7.5e6, gdp: 19e9, mil: 0.03e9 },
  { id: 'brn', name: 'Бруней', nameEn: 'Brunei', flag: '\u{1F1E7}\u{1F1F3}', region: 'southeast_asia', tier: 5, pop: 0.45e6, gdp: 14e9, mil: 0.5e9 },
  { id: 'tls', name: 'Восточный Тимор', nameEn: 'Timor-Leste', flag: '\u{1F1F9}\u{1F1F1}', region: 'southeast_asia', tier: 2, pop: 1.3e6, gdp: 2e9, mil: 0.02e9 },

  // Africa (remaining)
  { id: 'dza', name: 'Алжир', nameEn: 'Algeria', flag: '\u{1F1E9}\u{1F1FF}', region: 'africa', tier: 3, pop: 45e6, gdp: 190e9, mil: 10e9 },
  { id: 'mar', name: 'Марокко', nameEn: 'Morocco', flag: '\u{1F1F2}\u{1F1E6}', region: 'africa', tier: 3, pop: 37e6, gdp: 134e9, mil: 5e9 },
  { id: 'tun', name: 'Тунис', nameEn: 'Tunisia', flag: '\u{1F1F9}\u{1F1F3}', region: 'africa', tier: 3, pop: 12e6, gdp: 46e9, mil: 1e9 },
  { id: 'lby', name: 'Ливия', nameEn: 'Libya', flag: '\u{1F1F1}\u{1F1FE}', region: 'africa', tier: 3, pop: 7e6, gdp: 42e9, mil: 2e9 },
  { id: 'eth', name: 'Эфиопия', nameEn: 'Ethiopia', flag: '\u{1F1EA}\u{1F1F9}', region: 'africa', tier: 1, pop: 120e6, gdp: 126e9, mil: 1e9 },
  { id: 'ken', name: 'Кения', nameEn: 'Kenya', flag: '\u{1F1F0}\u{1F1EA}', region: 'africa', tier: 2, pop: 54e6, gdp: 113e9, mil: 1e9 },
  { id: 'tza', name: 'Танзания', nameEn: 'Tanzania', flag: '\u{1F1F9}\u{1F1FF}', region: 'africa', tier: 2, pop: 63e6, gdp: 75e9, mil: 0.6e9 },
  { id: 'gha', name: 'Гана', nameEn: 'Ghana', flag: '\u{1F1EC}\u{1F1ED}', region: 'africa', tier: 2, pop: 33e6, gdp: 73e9, mil: 0.4e9 },
  { id: 'civ', name: "Кот-д'Ивуар", nameEn: 'Ivory Coast', flag: '\u{1F1E8}\u{1F1EE}', region: 'africa', tier: 2, pop: 28e6, gdp: 70e9, mil: 0.5e9 },
  { id: 'cmr', name: 'Камерун', nameEn: 'Cameroon', flag: '\u{1F1E8}\u{1F1F2}', region: 'africa', tier: 2, pop: 27e6, gdp: 44e9, mil: 0.5e9 },
  { id: 'ago', name: 'Ангола', nameEn: 'Angola', flag: '\u{1F1E6}\u{1F1F4}', region: 'africa', tier: 2, pop: 35e6, gdp: 80e9, mil: 2e9 },
  { id: 'moz', name: 'Мозамбик', nameEn: 'Mozambique', flag: '\u{1F1F2}\u{1F1FF}', region: 'africa', tier: 1, pop: 33e6, gdp: 17e9, mil: 0.2e9 },
  { id: 'mdg', name: 'Мадагаскар', nameEn: 'Madagascar', flag: '\u{1F1F2}\u{1F1EC}', region: 'africa', tier: 1, pop: 29e6, gdp: 14e9, mil: 0.08e9 },
  { id: 'cod', name: 'ДР Конго', nameEn: 'DR Congo', flag: '\u{1F1E8}\u{1F1E9}', region: 'africa', tier: 1, pop: 99e6, gdp: 56e9, mil: 0.5e9 },
  { id: 'sdn', name: 'Судан', nameEn: 'Sudan', flag: '\u{1F1F8}\u{1F1E9}', region: 'africa', tier: 1, pop: 46e6, gdp: 26e9, mil: 1e9 },
  { id: 'uga', name: 'Уганда', nameEn: 'Uganda', flag: '\u{1F1FA}\u{1F1EC}', region: 'africa', tier: 1, pop: 47e6, gdp: 42e9, mil: 0.4e9 },
  { id: 'sen', name: 'Сенегал', nameEn: 'Senegal', flag: '\u{1F1F8}\u{1F1F3}', region: 'africa', tier: 2, pop: 17e6, gdp: 28e9, mil: 0.3e9 },
  { id: 'zwe', name: 'Зимбабве', nameEn: 'Zimbabwe', flag: '\u{1F1FF}\u{1F1FC}', region: 'africa', tier: 1, pop: 16e6, gdp: 19e9, mil: 0.3e9 },
  { id: 'zmb', name: 'Замбия', nameEn: 'Zambia', flag: '\u{1F1FF}\u{1F1F2}', region: 'africa', tier: 2, pop: 20e6, gdp: 22e9, mil: 0.3e9 },
  { id: 'mli', name: 'Мали', nameEn: 'Mali', flag: '\u{1F1F2}\u{1F1F1}', region: 'africa', tier: 1, pop: 22e6, gdp: 19e9, mil: 0.5e9 },
  { id: 'ner', name: 'Нигер', nameEn: 'Niger', flag: '\u{1F1F3}\u{1F1EA}', region: 'africa', tier: 1, pop: 26e6, gdp: 15e9, mil: 0.3e9 },
  { id: 'bfa', name: 'Буркина-Фасо', nameEn: 'Burkina Faso', flag: '\u{1F1E7}\u{1F1EB}', region: 'africa', tier: 1, pop: 22e6, gdp: 19e9, mil: 0.4e9 },
  { id: 'tcd', name: 'Чад', nameEn: 'Chad', flag: '\u{1F1F9}\u{1F1E9}', region: 'africa', tier: 1, pop: 17e6, gdp: 12e9, mil: 0.3e9 },
  { id: 'som', name: 'Сомали', nameEn: 'Somalia', flag: '\u{1F1F8}\u{1F1F4}', region: 'africa', tier: 1, pop: 17e6, gdp: 8e9, mil: 0.1e9 },
  { id: 'rwa', name: 'Руанда', nameEn: 'Rwanda', flag: '\u{1F1F7}\u{1F1FC}', region: 'africa', tier: 2, pop: 14e6, gdp: 12e9, mil: 0.1e9 },
  { id: 'bdi', name: 'Бурунди', nameEn: 'Burundi', flag: '\u{1F1E7}\u{1F1EE}', region: 'africa', tier: 1, pop: 13e6, gdp: 3e9, mil: 0.07e9 },
  { id: 'ben', name: 'Бенин', nameEn: 'Benin', flag: '\u{1F1E7}\u{1F1EF}', region: 'africa', tier: 2, pop: 13e6, gdp: 17e9, mil: 0.1e9 },
  { id: 'tgo', name: 'Того', nameEn: 'Togo', flag: '\u{1F1F9}\u{1F1EC}', region: 'africa', tier: 1, pop: 8.8e6, gdp: 8e9, mil: 0.1e9 },
  { id: 'sle', name: 'Сьерра-Леоне', nameEn: 'Sierra Leone', flag: '\u{1F1F8}\u{1F1F1}', region: 'africa', tier: 1, pop: 8.4e6, gdp: 4e9, mil: 0.03e9 },
  { id: 'lbr', name: 'Либерия', nameEn: 'Liberia', flag: '\u{1F1F1}\u{1F1F7}', region: 'africa', tier: 1, pop: 5.2e6, gdp: 4e9, mil: 0.02e9 },
  { id: 'mrt', name: 'Мавритания', nameEn: 'Mauritania', flag: '\u{1F1F2}\u{1F1F7}', region: 'africa', tier: 2, pop: 4.7e6, gdp: 10e9, mil: 0.2e9 },
  { id: 'eri', name: 'Эритрея', nameEn: 'Eritrea', flag: '\u{1F1EA}\u{1F1F7}', region: 'africa', tier: 1, pop: 3.6e6, gdp: 2e9, mil: 0.08e9 },
  { id: 'gnq', name: 'Экваториальная Гвинея', nameEn: 'Equatorial Guinea', flag: '\u{1F1EC}\u{1F1F6}', region: 'africa', tier: 3, pop: 1.6e6, gdp: 12e9, mil: 0.1e9 },
  { id: 'gab', name: 'Габон', nameEn: 'Gabon', flag: '\u{1F1EC}\u{1F1E6}', region: 'africa', tier: 3, pop: 2.3e6, gdp: 18e9, mil: 0.3e9 },
  { id: 'bwa', name: 'Ботсвана', nameEn: 'Botswana', flag: '\u{1F1E7}\u{1F1FC}', region: 'africa', tier: 3, pop: 2.4e6, gdp: 18e9, mil: 0.5e9 },
  { id: 'nam', name: 'Намибия', nameEn: 'Namibia', flag: '\u{1F1F3}\u{1F1E6}', region: 'africa', tier: 3, pop: 2.5e6, gdp: 13e9, mil: 0.4e9 },
  { id: 'mus', name: 'Маврикий', nameEn: 'Mauritius', flag: '\u{1F1F2}\u{1F1FA}', region: 'africa', tier: 4, pop: 1.3e6, gdp: 13e9, mil: 0.03e9 },
  { id: 'cog', name: 'Конго', nameEn: 'Republic of the Congo', flag: '\u{1F1E8}\u{1F1EC}', region: 'africa', tier: 2, pop: 5.9e6, gdp: 15e9, mil: 0.3e9 },
  { id: 'gin', name: 'Гвинея', nameEn: 'Guinea', flag: '\u{1F1EC}\u{1F1F3}', region: 'africa', tier: 1, pop: 14e6, gdp: 16e9, mil: 0.2e9 },
  // South America (remaining)
  { id: 'chl', name: 'Чили', nameEn: 'Chile', flag: '\u{1F1E8}\u{1F1F1}', region: 'south_america', tier: 5, pop: 19.5e6, gdp: 300e9, mil: 5e9 },
  { id: 'per', name: 'Перу', nameEn: 'Peru', flag: '\u{1F1F5}\u{1F1EA}', region: 'south_america', tier: 3, pop: 34e6, gdp: 240e9, mil: 2.5e9 },
  { id: 'ven', name: 'Венесуэла', nameEn: 'Venezuela', flag: '\u{1F1FB}\u{1F1EA}', region: 'south_america', tier: 2, pop: 28e6, gdp: 100e9, mil: 2e9 },
  { id: 'ecu', name: 'Эквадор', nameEn: 'Ecuador', flag: '\u{1F1EA}\u{1F1E8}', region: 'south_america', tier: 3, pop: 18e6, gdp: 115e9, mil: 2.5e9 },
  { id: 'bol', name: 'Боливия', nameEn: 'Bolivia', flag: '\u{1F1E7}\u{1F1F4}', region: 'south_america', tier: 2, pop: 12e6, gdp: 44e9, mil: 0.5e9 },
  { id: 'pry', name: 'Парагвай', nameEn: 'Paraguay', flag: '\u{1F1F5}\u{1F1FE}', region: 'south_america', tier: 3, pop: 7.4e6, gdp: 41e9, mil: 0.4e9 },
  { id: 'ury', name: 'Уругвай', nameEn: 'Uruguay', flag: '\u{1F1FA}\u{1F1FE}', region: 'south_america', tier: 5, pop: 3.4e6, gdp: 62e9, mil: 1e9 },
  { id: 'guy', name: 'Гайана', nameEn: 'Guyana', flag: '\u{1F1EC}\u{1F1FE}', region: 'south_america', tier: 3, pop: 0.8e6, gdp: 15e9, mil: 0.07e9 },
  { id: 'sur', name: 'Суринам', nameEn: 'Suriname', flag: '\u{1F1F8}\u{1F1F7}', region: 'south_america', tier: 3, pop: 0.6e6, gdp: 3.5e9, mil: 0.04e9 },

  // North/Central America & Caribbean (remaining)
  { id: 'cub', name: 'Куба', nameEn: 'Cuba', flag: '\u{1F1E8}\u{1F1FA}', region: 'north_america', tier: 3, pop: 11e6, gdp: 110e9, mil: 1.5e9 },
  { id: 'gtm', name: 'Гватемала', nameEn: 'Guatemala', flag: '\u{1F1EC}\u{1F1F9}', region: 'north_america', tier: 2, pop: 18e6, gdp: 86e9, mil: 0.3e9 },
  { id: 'hnd', name: 'Гондурас', nameEn: 'Honduras', flag: '\u{1F1ED}\u{1F1F3}', region: 'north_america', tier: 2, pop: 10e6, gdp: 29e9, mil: 0.4e9 },
  { id: 'slv', name: 'Сальвадор', nameEn: 'El Salvador', flag: '\u{1F1F8}\u{1F1FB}', region: 'north_america', tier: 2, pop: 6.3e6, gdp: 33e9, mil: 0.3e9 },
  { id: 'nic', name: 'Никарагуа', nameEn: 'Nicaragua', flag: '\u{1F1F3}\u{1F1EE}', region: 'north_america', tier: 2, pop: 6.8e6, gdp: 15e9, mil: 0.1e9 },
  { id: 'cri', name: 'Коста-Рика', nameEn: 'Costa Rica', flag: '\u{1F1E8}\u{1F1F7}', region: 'north_america', tier: 4, pop: 5.1e6, gdp: 68e9, mil: 0 },
  { id: 'pan', name: 'Панама', nameEn: 'Panama', flag: '\u{1F1F5}\u{1F1E6}', region: 'north_america', tier: 4, pop: 4.3e6, gdp: 77e9, mil: 0 },
  { id: 'dom', name: 'Доминиканская Республика', nameEn: 'Dominican Republic', flag: '\u{1F1E9}\u{1F1F4}', region: 'north_america', tier: 3, pop: 11e6, gdp: 100e9, mil: 0.5e9 },
  { id: 'hti', name: 'Гаити', nameEn: 'Haiti', flag: '\u{1F1ED}\u{1F1F9}', region: 'north_america', tier: 1, pop: 11.5e6, gdp: 20e9, mil: 0 },
  { id: 'jam', name: 'Ямайка', nameEn: 'Jamaica', flag: '\u{1F1EF}\u{1F1F2}', region: 'north_america', tier: 3, pop: 2.8e6, gdp: 17e9, mil: 0.2e9 },
  { id: 'tto', name: 'Тринидад и Тобаго', nameEn: 'Trinidad and Tobago', flag: '\u{1F1F9}\u{1F1F9}', region: 'north_america', tier: 4, pop: 1.4e6, gdp: 24e9, mil: 0.2e9 },

  // Oceania (remaining)
  { id: 'nzl', name: 'Новая Зеландия', nameEn: 'New Zealand', flag: '\u{1F1F3}\u{1F1FF}', region: 'oceania', tier: 6, pop: 5.1e6, gdp: 247e9, mil: 3e9 },
  { id: 'png', name: 'Папуа — Новая Гвинея', nameEn: 'Papua New Guinea', flag: '\u{1F1F5}\u{1F1EC}', region: 'oceania', tier: 2, pop: 10e6, gdp: 30e9, mil: 0.1e9 },
  { id: 'fji', name: 'Фиджи', nameEn: 'Fiji', flag: '\u{1F1EB}\u{1F1EF}', region: 'oceania', tier: 3, pop: 0.9e6, gdp: 5e9, mil: 0.05e9 },
];

// ============================================================
// Country Generator for simplified entries
// ============================================================

const TIER_PARAMS = {
  1: { // Very low development
    gdpGrowth: 0.025, inflation: 0.15, debtToGDP: 0.45,
    sectors: {
      agriculture: { level: 15, output: 0.30, employment: 0.55 },
      industry: { level: 18, output: 0.20, employment: 0.12 },
      services: { level: 20, output: 0.42, employment: 0.28 },
      tech: { level: 5, output: 0.08, employment: 0.05 }
    },
    budget: {
      taxRate: 0.08, militarySpending: 0.015, educationSpending: 0.015,
      healthcareSpending: 0.01, infrastructureSpending: 0.01,
      socialSpending: 0.015, scienceSpending: 0.001, intelligenceSpending: 0.001
    },
    approvalRating: 0.30, democracyIndex: 0.25, corruptionIndex: 0.78, stabilityIndex: 0.30,
    ideology: { democracy: 0.2, economy: 0.3 },
    literacy: 0.50, healthIndex: 0.40, unemployment: 0.15, populationGrowth: 0.025,
    techLevel: { military: 15, civilian: 15, industrial: 12, digital: 12 },
    unitMult: 0.15, equipMult: 0.20, trainMult: 0.25, moraleMult: 0.30,
    counterintelligence: 20, agentCount: 3
  },
  2: { // Low development
    gdpGrowth: 0.04, inflation: 0.08, debtToGDP: 0.40,
    sectors: {
      agriculture: { level: 22, output: 0.22, employment: 0.42 },
      industry: { level: 28, output: 0.25, employment: 0.18 },
      services: { level: 30, output: 0.45, employment: 0.32 },
      tech: { level: 12, output: 0.08, employment: 0.08 }
    },
    budget: {
      taxRate: 0.12, militarySpending: 0.012, educationSpending: 0.025,
      healthcareSpending: 0.015, infrastructureSpending: 0.015,
      socialSpending: 0.02, scienceSpending: 0.002, intelligenceSpending: 0.002
    },
    approvalRating: 0.35, democracyIndex: 0.38, corruptionIndex: 0.65, stabilityIndex: 0.42,
    ideology: { democracy: 0.35, economy: 0.4 },
    literacy: 0.68, healthIndex: 0.52, unemployment: 0.10, populationGrowth: 0.02,
    techLevel: { military: 22, civilian: 25, industrial: 22, digital: 22 },
    unitMult: 0.25, equipMult: 0.28, trainMult: 0.32, moraleMult: 0.38,
    counterintelligence: 28, agentCount: 5
  },
  3: { // Lower-middle
    gdpGrowth: 0.035, inflation: 0.06, debtToGDP: 0.48,
    sectors: {
      agriculture: { level: 30, output: 0.12, employment: 0.28 },
      industry: { level: 38, output: 0.28, employment: 0.24 },
      services: { level: 42, output: 0.50, employment: 0.40 },
      tech: { level: 22, output: 0.10, employment: 0.08 }
    },
    budget: {
      taxRate: 0.16, militarySpending: 0.015, educationSpending: 0.03,
      healthcareSpending: 0.025, infrastructureSpending: 0.02,
      socialSpending: 0.03, scienceSpending: 0.004, intelligenceSpending: 0.003
    },
    approvalRating: 0.40, democracyIndex: 0.50, corruptionIndex: 0.55, stabilityIndex: 0.55,
    ideology: { democracy: 0.48, economy: 0.5 },
    literacy: 0.82, healthIndex: 0.65, unemployment: 0.07, populationGrowth: 0.012,
    techLevel: { military: 32, civilian: 38, industrial: 35, digital: 38 },
    unitMult: 0.35, equipMult: 0.38, trainMult: 0.42, moraleMult: 0.48,
    counterintelligence: 35, agentCount: 7
  },
  4: { // Upper-middle
    gdpGrowth: 0.03, inflation: 0.045, debtToGDP: 0.50,
    sectors: {
      agriculture: { level: 38, output: 0.06, employment: 0.15 },
      industry: { level: 52, output: 0.28, employment: 0.25 },
      services: { level: 58, output: 0.56, employment: 0.52 },
      tech: { level: 38, output: 0.10, employment: 0.08 }
    },
    budget: {
      taxRate: 0.22, militarySpending: 0.014, educationSpending: 0.04,
      healthcareSpending: 0.035, infrastructureSpending: 0.025,
      socialSpending: 0.045, scienceSpending: 0.008, intelligenceSpending: 0.003
    },
    approvalRating: 0.42, democracyIndex: 0.60, corruptionIndex: 0.48, stabilityIndex: 0.65,
    ideology: { democracy: 0.58, economy: 0.58 },
    literacy: 0.92, healthIndex: 0.74, unemployment: 0.06, populationGrowth: 0.008,
    techLevel: { military: 42, civilian: 52, industrial: 48, digital: 52 },
    unitMult: 0.45, equipMult: 0.48, trainMult: 0.52, moraleMult: 0.55,
    counterintelligence: 42, agentCount: 8
  },
  5: { // High development
    gdpGrowth: 0.02, inflation: 0.035, debtToGDP: 0.55,
    sectors: {
      agriculture: { level: 48, output: 0.02, employment: 0.04 },
      industry: { level: 68, output: 0.24, employment: 0.22 },
      services: { level: 72, output: 0.64, employment: 0.65 },
      tech: { level: 58, output: 0.10, employment: 0.09 }
    },
    budget: {
      taxRate: 0.32, militarySpending: 0.015, educationSpending: 0.045,
      healthcareSpending: 0.06, infrastructureSpending: 0.03,
      socialSpending: 0.08, scienceSpending: 0.015, intelligenceSpending: 0.003
    },
    approvalRating: 0.42, democracyIndex: 0.78, corruptionIndex: 0.32, stabilityIndex: 0.80,
    ideology: { democracy: 0.78, economy: 0.65 },
    literacy: 0.98, healthIndex: 0.84, unemployment: 0.045, populationGrowth: 0.003,
    techLevel: { military: 62, civilian: 72, industrial: 68, digital: 72 },
    unitMult: 0.60, equipMult: 0.62, trainMult: 0.65, moraleMult: 0.65,
    counterintelligence: 52, agentCount: 10
  },
  6: { // Very high development
    gdpGrowth: 0.015, inflation: 0.025, debtToGDP: 0.45,
    sectors: {
      agriculture: { level: 55, output: 0.01, employment: 0.02 },
      industry: { level: 78, output: 0.20, employment: 0.18 },
      services: { level: 85, output: 0.68, employment: 0.72 },
      tech: { level: 78, output: 0.11, employment: 0.08 }
    },
    budget: {
      taxRate: 0.38, militarySpending: 0.013, educationSpending: 0.055,
      healthcareSpending: 0.08, infrastructureSpending: 0.03,
      socialSpending: 0.10, scienceSpending: 0.025, intelligenceSpending: 0.003
    },
    approvalRating: 0.45, democracyIndex: 0.88, corruptionIndex: 0.20, stabilityIndex: 0.90,
    ideology: { democracy: 0.88, economy: 0.68 },
    literacy: 0.99, healthIndex: 0.90, unemployment: 0.035, populationGrowth: 0.002,
    techLevel: { military: 72, civilian: 82, industrial: 78, digital: 85 },
    unitMult: 0.75, equipMult: 0.72, trainMult: 0.75, moraleMult: 0.72,
    counterintelligence: 58, agentCount: 12
  }
};

function generateCountryFromTemplate(template) {
  const tier = TIER_PARAMS[template.tier];
  const pop = template.pop;
  const gdp = template.gdp;
  const milBudget = template.mil;

  // Scale military units based on population and budget
  const popScale = Math.min(pop / 50e6, 3);
  const budgetScale = Math.min(milBudget / 5e9, 3);
  const milScale = (popScale + budgetScale) / 2;

  const infantryBase = Math.round(pop * 0.002 * milScale);
  const armorBase = Math.round(milScale * 200);
  const airBase = Math.round(milScale * 120);
  const navyBase = Math.round(milScale * 15);
  const missileBase = Math.round(milScale * 10);

  return {
    id: template.id,
    name: template.name,
    nameEn: template.nameEn,
    flag: template.flag,
    region: template.region,
    gdp: gdp,
    gdpGrowth: tier.gdpGrowth + (Math.random() - 0.5) * 0.01,
    inflation: tier.inflation + (Math.random() - 0.5) * 0.02,
    debt: gdp * tier.debtToGDP,
    debtToGDP: tier.debtToGDP,
    foreignReserves: gdp * (0.05 + Math.random() * 0.1),
    tradeBalance: gdp * (Math.random() - 0.5) * 0.08,
    sectors: JSON.parse(JSON.stringify(tier.sectors)),
    budget: JSON.parse(JSON.stringify(tier.budget)),
    approvalRating: tier.approvalRating + (Math.random() - 0.5) * 0.1,
    democracyIndex: tier.democracyIndex + (Math.random() - 0.5) * 0.1,
    corruptionIndex: tier.corruptionIndex + (Math.random() - 0.5) * 0.1,
    stabilityIndex: tier.stabilityIndex + (Math.random() - 0.5) * 0.1,
    ideology: { ...tier.ideology },
    parties: [],
    militaryBudget: milBudget,
    units: {
      infantry: {
        count: Math.max(500, infantryBase),
        equipment: Math.round(tier.equipMult * 100),
        training: Math.round(tier.trainMult * 100),
        morale: Math.round(tier.moraleMult * 100)
      },
      armor: {
        count: Math.max(0, armorBase),
        equipment: Math.round(tier.equipMult * 95),
        training: Math.round(tier.trainMult * 95),
        morale: Math.round(tier.moraleMult * 95)
      },
      air: {
        count: Math.max(0, airBase),
        equipment: Math.round(tier.equipMult * 100 + 5),
        training: Math.round(tier.trainMult * 100 + 3),
        morale: Math.round(tier.moraleMult * 100)
      },
      navy: {
        count: Math.max(0, navyBase),
        equipment: Math.round(tier.equipMult * 92),
        training: Math.round(tier.trainMult * 92),
        morale: Math.round(tier.moraleMult * 92)
      },
      missiles: {
        count: Math.max(0, missileBase),
        equipment: Math.round(tier.equipMult * 90),
        training: Math.round(tier.trainMult * 90),
        morale: Math.round(tier.moraleMult * 90)
      },
      nuclear: { count: 0, equipment: 0, training: 0, morale: 0 }
    },
    warFatigue: 0,
    population: pop,
    populationGrowth: tier.populationGrowth + (Math.random() - 0.5) * 0.005,
    literacy: Math.min(1.0, tier.literacy + (Math.random() - 0.5) * 0.05),
    healthIndex: tier.healthIndex + (Math.random() - 0.5) * 0.05,
    unemployment: tier.unemployment + (Math.random() - 0.5) * 0.02,
    emigrationRate: 0.003 + Math.random() * 0.003,
    techLevel: { ...tier.techLevel },
    intelligenceBudget: milBudget * 0.05,
    agentCount: tier.agentCount,
    counterintelligence: tier.counterintelligence,
    relations: {},
    alliances: [],
    sanctions: [],
    tradeAgreements: [],
    militaryStrength: 0
  };
}

// ============================================================
// Diplomacy Initialization
// ============================================================

const HISTORICAL_RIVALRIES = [
  { a: 'usa', b: 'rus', value: -60 },
  { a: 'usa', b: 'chn', value: -40 },
  { a: 'usa', b: 'irn', value: -80 },
  { a: 'usa', b: 'prk', value: -90 },
  { a: 'usa', b: 'cub', value: -50 },
  { a: 'usa', b: 'ven', value: -40 },
  { a: 'rus', b: 'ukr', value: -80 },
  { a: 'rus', b: 'pol', value: -40 },
  { a: 'rus', b: 'gbr', value: -50 },
  { a: 'rus', b: 'est', value: -45 },
  { a: 'rus', b: 'lva', value: -45 },
  { a: 'rus', b: 'ltu', value: -45 },
  { a: 'rus', b: 'geo', value: -60 },
  { a: 'ind', b: 'pak', value: -70 },
  { a: 'ind', b: 'chn', value: -30 },
  { a: 'isr', b: 'irn', value: -90 },
  { a: 'isr', b: 'syr', value: -80 },
  { a: 'isr', b: 'lbn', value: -60 },
  { a: 'isr', b: 'irq', value: -50 },
  { a: 'sau', b: 'irn', value: -70 },
  { a: 'kor', b: 'prk', value: -80 },
  { a: 'jpn', b: 'prk', value: -70 },
  { a: 'jpn', b: 'chn', value: -30 },
  { a: 'jpn', b: 'kor', value: -10 },
  { a: 'grc', b: 'tur', value: -40 },
  { a: 'arm', b: 'aze', value: -70 },
  { a: 'arm', b: 'tur', value: -50 },
  { a: 'chn', b: 'twn', value: -50 },
  { a: 'chn', b: 'vnm', value: -20 },
  { a: 'mar', b: 'dza', value: -40 },
  { a: 'eth', b: 'eri', value: -50 },
  { a: 'eth', b: 'egy', value: -30 },
  { a: 'srb', b: 'hrv', value: -30 },
  { a: 'srb', b: 'alb', value: -40 },
];

const HISTORICAL_FRIENDSHIPS = [
  { a: 'usa', b: 'gbr', value: 70 },
  { a: 'usa', b: 'isr', value: 65 },
  { a: 'usa', b: 'jpn', value: 60 },
  { a: 'usa', b: 'kor', value: 55 },
  { a: 'usa', b: 'aus', value: 60 },
  { a: 'usa', b: 'can', value: 75 },
  { a: 'usa', b: 'deu', value: 50 },
  { a: 'usa', b: 'fra', value: 45 },
  { a: 'usa', b: 'twn', value: 50 },
  { a: 'gbr', b: 'aus', value: 65 },
  { a: 'gbr', b: 'can', value: 60 },
  { a: 'gbr', b: 'nzl', value: 65 },
  { a: 'deu', b: 'fra', value: 60 },
  { a: 'deu', b: 'nld', value: 55 },
  { a: 'deu', b: 'aut', value: 55 },
  { a: 'fra', b: 'bel', value: 50 },
  { a: 'rus', b: 'blr', value: 65 },
  { a: 'rus', b: 'chn', value: 35 },
  { a: 'rus', b: 'ind', value: 40 },
  { a: 'rus', b: 'srb', value: 45 },
  { a: 'rus', b: 'prk', value: 30 },
  { a: 'rus', b: 'irn', value: 30 },
  { a: 'rus', b: 'syr', value: 40 },
  { a: 'chn', b: 'prk', value: 35 },
  { a: 'chn', b: 'pak', value: 45 },
  { a: 'chn', b: 'mmr', value: 25 },
  { a: 'jpn', b: 'aus', value: 40 },
  { a: 'jpn', b: 'ind', value: 35 },
  { a: 'sau', b: 'are', value: 50 },
  { a: 'sau', b: 'egy', value: 35 },
  { a: 'sau', b: 'usa', value: 30 },
  { a: 'tur', b: 'aze', value: 50 },
  { a: 'irn', b: 'syr', value: 45 },
  { a: 'irn', b: 'irq', value: 25 },
  { a: 'ind', b: 'jpn', value: 35 },
  { a: 'ind', b: 'aus', value: 30 },
  { a: 'bra', b: 'arg', value: 30 },
  { a: 'pol', b: 'ukr', value: 40 },
  { a: 'pol', b: 'usa', value: 45 },
  { a: 'nor', b: 'swe', value: 55 },
  { a: 'swe', b: 'fin', value: 55 },
  { a: 'nor', b: 'dnk', value: 55 },
  { a: 'nld', b: 'bel', value: 50 },
  { a: 'esp', b: 'prt', value: 40 },
  { a: 'cze', b: 'svk', value: 45 },
];

export function initializeDiplomacy(countries) {
  // Helper to set relation symmetrically
  function setRelation(id1, id2, value) {
    const c1 = countries.get(id1);
    const c2 = countries.get(id2);
    if (!c1 || !c2) return;

    if (!c1.relations[id2]) c1.relations[id2] = 0;
    if (!c2.relations[id1]) c2.relations[id1] = 0;

    c1.relations[id2] = Math.max(-100, Math.min(100, c1.relations[id2] + value));
    c2.relations[id1] = Math.max(-100, Math.min(100, c2.relations[id1] + value));
  }

  // 1) NATO alliance bonus
  for (let i = 0; i < NATO_MEMBERS.length; i++) {
    for (let j = i + 1; j < NATO_MEMBERS.length; j++) {
      setRelation(NATO_MEMBERS[i], NATO_MEMBERS[j], 50);
    }
  }

  // 2) EU bonus
  for (let i = 0; i < EU_MEMBERS.length; i++) {
    for (let j = i + 1; j < EU_MEMBERS.length; j++) {
      setRelation(EU_MEMBERS[i], EU_MEMBERS[j], 60);
    }
  }

  // 3) BRICS bonus
  for (let i = 0; i < BRICS_MEMBERS.length; i++) {
    for (let j = i + 1; j < BRICS_MEMBERS.length; j++) {
      setRelation(BRICS_MEMBERS[i], BRICS_MEMBERS[j], 25);
    }
  }

  // 4) G7 bonus
  for (let i = 0; i < G7_MEMBERS.length; i++) {
    for (let j = i + 1; j < G7_MEMBERS.length; j++) {
      setRelation(G7_MEMBERS[i], G7_MEMBERS[j], 30);
    }
  }

  // 5) Same-region bonus
  const allCountries = Array.from(countries.values());
  for (let i = 0; i < allCountries.length; i++) {
    for (let j = i + 1; j < allCountries.length; j++) {
      if (allCountries[i].region === allCountries[j].region) {
        setRelation(allCountries[i].id, allCountries[j].id, 10);
      }
    }
  }

  // 6) Ideological similarity bonus
  for (let i = 0; i < allCountries.length; i++) {
    for (let j = i + 1; j < allCountries.length; j++) {
      const c1 = allCountries[i];
      const c2 = allCountries[j];
      const demDiff = Math.abs(c1.ideology.democracy - c2.ideology.democracy);
      const econDiff = Math.abs(c1.ideology.economy - c2.ideology.economy);
      const similarity = 1 - (demDiff + econDiff) / 2;
      // Bonus up to +15 for very similar, penalty up to -10 for very different
      const bonus = Math.round(similarity * 25 - 10);
      if (bonus !== 0) {
        setRelation(c1.id, c2.id, bonus);
      }
    }
  }

  // 7) Historical rivalries (applied LAST so they override)
  for (const rivalry of HISTORICAL_RIVALRIES) {
    const c1 = countries.get(rivalry.a);
    const c2 = countries.get(rivalry.b);
    if (!c1 || !c2) continue;
    // Set directly to ensure rivalry is felt
    c1.relations[rivalry.b] = Math.max(-100, (c1.relations[rivalry.b] || 0) + rivalry.value);
    c2.relations[rivalry.a] = Math.max(-100, (c2.relations[rivalry.a] || 0) + rivalry.value);
  }

  // 8) Historical friendships
  for (const friendship of HISTORICAL_FRIENDSHIPS) {
    setRelation(friendship.a, friendship.b, friendship.value);
  }

  // 9) Set alliance arrays
  for (const id of NATO_MEMBERS) {
    const c = countries.get(id);
    if (c && !c.alliances.includes('NATO')) c.alliances.push('NATO');
  }
  for (const id of EU_MEMBERS) {
    const c = countries.get(id);
    if (c && !c.alliances.includes('EU')) c.alliances.push('EU');
  }
  for (const id of BRICS_MEMBERS) {
    const c = countries.get(id);
    if (c && !c.alliances.includes('BRICS')) c.alliances.push('BRICS');
  }
  for (const id of G7_MEMBERS) {
    const c = countries.get(id);
    if (c && !c.alliances.includes('G7')) c.alliances.push('G7');
  }

  // 10) Set some initial sanctions
  const sanctionedByWest = ['rus', 'prk', 'irn', 'syr'];
  const westernSanctioners = ['usa', 'gbr', 'fra', 'deu', 'can', 'jpn', 'aus'];
  for (const target of sanctionedByWest) {
    const tc = countries.get(target);
    if (!tc) continue;
    for (const source of westernSanctioners) {
      const sc = countries.get(source);
      if (!sc) continue;
      if (!sc.sanctions.includes(target)) sc.sanctions.push(target);
    }
  }

  // 11) Set some initial trade agreements
  // USMCA
  const usmcaMembers = ['usa', 'can', 'mex'];
  for (const id of usmcaMembers) {
    const c = countries.get(id);
    if (c && !c.tradeAgreements.includes('USMCA')) c.tradeAgreements.push('USMCA');
  }
  // EU single market (all EU members)
  for (const id of EU_MEMBERS) {
    const c = countries.get(id);
    if (c && !c.tradeAgreements.includes('EU_SINGLE_MARKET')) c.tradeAgreements.push('EU_SINGLE_MARKET');
  }
  // RCEP
  const rcepMembers = ['chn', 'jpn', 'kor', 'aus', 'nzl', 'idn', 'tha', 'vnm', 'phl', 'mys', 'sgp', 'brn', 'khm', 'lao', 'mmr'];
  for (const id of rcepMembers) {
    const c = countries.get(id);
    if (c && !c.tradeAgreements.includes('RCEP')) c.tradeAgreements.push('RCEP');
  }
  // MERCOSUR
  const mercosurMembers = ['bra', 'arg', 'ury', 'pry'];
  for (const id of mercosurMembers) {
    const c = countries.get(id);
    if (c && !c.tradeAgreements.includes('MERCOSUR')) c.tradeAgreements.push('MERCOSUR');
  }
  // African Union
  const auMembers = ['egy', 'nga', 'zaf', 'eth', 'ken', 'tza', 'gha', 'dza', 'mar', 'cmr', 'ago', 'cod', 'sdn', 'uga', 'moz', 'mdg', 'sen', 'mli', 'ner', 'bfa', 'tcd', 'rwa', 'bdi', 'tun', 'lby', 'civ', 'ben', 'tgo', 'gin', 'sle', 'lbr', 'mrt', 'som', 'eri', 'gnq', 'gab', 'bwa', 'nam', 'mus', 'cog', 'zmb', 'zwe'];
  for (const id of auMembers) {
    const c = countries.get(id);
    if (c && !c.tradeAgreements.includes('AU')) c.tradeAgreements.push('AU');
  }

  return countries;
}

// ============================================================
// Main Export: createCountries()
// ============================================================

export function createCountries() {
  const countries = new Map();

  // 1) Add major countries with detailed data
  const majorCountries = getMajorCountries();
  for (const country of majorCountries) {
    countries.set(country.id, country);
  }

  // 2) Generate remaining countries from templates
  for (const template of REMAINING_COUNTRIES) {
    if (!countries.has(template.id)) {
      countries.set(template.id, generateCountryFromTemplate(template));
    }
  }

  // 3) Compute military strength for all countries
  for (const country of countries.values()) {
    country.militaryStrength = computeMilitaryStrength(country);
  }

  return countries;
}

// ============================================================
// Military Strength Calculator
// ============================================================

function computeMilitaryStrength(country) {
  const { units, techLevel, militaryBudget } = country;
  let strength = 0;

  // Infantry contribution
  strength += units.infantry.count * 0.001 *
    (units.infantry.equipment + units.infantry.training + units.infantry.morale) / 300;

  // Armor contribution (heavier weight)
  strength += units.armor.count * 0.05 *
    (units.armor.equipment + units.armor.training + units.armor.morale) / 300;

  // Air power (very significant)
  strength += units.air.count * 0.08 *
    (units.air.equipment + units.air.training + units.air.morale) / 300;

  // Naval power
  strength += units.navy.count * 0.2 *
    (units.navy.equipment + units.navy.training + units.navy.morale) / 300;

  // Missiles
  strength += units.missiles.count * 0.15 *
    (units.missiles.equipment + units.missiles.training + units.missiles.morale) / 300;

  // Nuclear (massive deterrent value)
  if (units.nuclear.count > 0) {
    strength += Math.min(units.nuclear.count, 500) * 0.5 *
      (units.nuclear.equipment + units.nuclear.training + units.nuclear.morale) / 300;
  }

  // Tech level modifier (average of all tech levels)
  const avgTech = (techLevel.military + techLevel.civilian + techLevel.industrial + techLevel.digital) / 4;
  strength *= (0.5 + avgTech / 100);

  // Budget modifier (logarithmic to avoid runaway)
  strength *= (0.5 + Math.log10(Math.max(militaryBudget, 1e8)) / 12);

  return Math.round(strength * 10) / 10;
}

// ============================================================
// Utility exports
// ============================================================

export function getCountryById(countries, id) {
  return countries.get(id);
}

export function getCountriesByRegion(countries, region) {
  return Array.from(countries.values()).filter(c => c.region === region);
}

export function getCountriesByAlliance(countries, alliance) {
  return Array.from(countries.values()).filter(c => c.alliances.includes(alliance));
}

export function getTopCountriesByMilitary(countries, n = 10) {
  return Array.from(countries.values())
    .sort((a, b) => b.militaryStrength - a.militaryStrength)
    .slice(0, n);
}

export function getTopCountriesByGDP(countries, n = 10) {
  return Array.from(countries.values())
    .sort((a, b) => b.gdp - a.gdp)
    .slice(0, n);
}

export function getTopCountriesByPopulation(countries, n = 10) {
  return Array.from(countries.values())
    .sort((a, b) => b.population - a.population)
    .slice(0, n);
}
