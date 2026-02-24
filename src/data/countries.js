// Alliance membership arrays
export const NATO_MEMBERS = [
  'usa','gbr','fra','deu','ita','can','tur','esp','pol','nld',
  'bel','nor','grc','cze','rou','hun','bgr','svk','hrv','svn',
  'ltu','lva','est','alb','mne','mkd','dnk','prt','lux','isl','fin','swe'
];

export const EU_MEMBERS = [
  'fra','deu','ita','esp','pol','nld','bel','grc','cze','rou',
  'hun','bgr','svk','hrv','svn','ltu','lva','est','aut','dnk',
  'prt','irl','lux','fin','swe','cyp','mlt'
];

export const BRICS_MEMBERS = ['bra','rus','ind','chn','zaf','egy','irn','sau','are','eth'];
export const G7_MEMBERS = ['usa','gbr','fra','deu','ita','can','jpn'];

// Compact country definitions: [id, name, nameEn, flag, region, gdp, pop, democ, eco_ideo, tier]
// tier: 1=superpower, 2=major, 3=regional, 4=developing, 5=least developed
const MAJOR_COUNTRIES_RAW = [
  // Superpowers & Major Powers
  ['usa','США','United States','🇺🇸','north_america',25500e9,331e6,0.80,0.75,1],
  ['chn','Китай','China','🇨🇳','east_asia',17900e9,1412e6,0.15,0.45,1],
  ['rus','Россия','Russia','🇷🇺','europe',2240e9,144e6,0.25,0.50,2],
  ['ind','Индия','India','🇮🇳','south_asia',3390e9,1428e6,0.65,0.60,2],
  ['jpn','Япония','Japan','🇯🇵','east_asia',4230e9,125e6,0.82,0.72,2],
  ['deu','Германия','Germany','🇩🇪','europe',4080e9,84e6,0.88,0.68,2],
  ['gbr','Великобритания','United Kingdom','🇬🇧','europe',3070e9,67e6,0.85,0.73,2],
  ['fra','Франция','France','🇫🇷','europe',2780e9,68e6,0.83,0.62,2],
  ['bra','Бразилия','Brazil','🇧🇷','south_america',2130e9,215e6,0.62,0.58,2],
  ['kor','Южная Корея','South Korea','🇰🇷','east_asia',1670e9,52e6,0.80,0.72,2],
  // Major Economies
  ['ita','Италия','Italy','🇮🇹','europe',2010e9,59e6,0.78,0.62,2],
  ['can','Канада','Canada','🇨🇦','north_america',2140e9,40e6,0.87,0.72,2],
  ['aus','Австралия','Australia','🇦🇺','oceania',1680e9,26e6,0.86,0.74,2],
  ['esp','Испания','Spain','🇪🇸','europe',1400e9,48e6,0.80,0.62,2],
  ['mex','Мексика','Mexico','🇲🇽','north_america',1290e9,129e6,0.55,0.60,3],
  ['idn','Индонезия','Indonesia','🇮🇩','southeast_asia',1320e9,275e6,0.58,0.55,3],
  ['tur','Турция','Turkey','🇹🇷','middle_east',906e9,85e6,0.42,0.55,3],
  ['sau','Саудовская Аравия','Saudi Arabia','🇸🇦','middle_east',1060e9,36e6,0.12,0.55,2],
  ['irn','Иран','Iran','🇮🇷','middle_east',367e9,88e6,0.15,0.30,3],
  ['isr','Израиль','Israel','🇮🇱','middle_east',525e9,9.4e6,0.72,0.70,2],
  // Regional Powers
  ['pol','Польша','Poland','🇵🇱','europe',688e9,38e6,0.72,0.65,3],
  ['ukr','Украина','Ukraine','🇺🇦','europe',160e9,37e6,0.55,0.50,3],
  ['egy','Египет','Egypt','🇪🇬','africa',398e9,105e6,0.28,0.45,3],
  ['pak','Пакистан','Pakistan','🇵🇰','south_asia',350e9,230e6,0.35,0.48,3],
  ['nga','Нигерия','Nigeria','🇳🇬','africa',477e9,220e6,0.42,0.52,3],
  ['zaf','ЮАР','South Africa','🇿🇦','africa',399e9,60e6,0.62,0.58,3],
  ['arg','Аргентина','Argentina','🇦🇷','south_america',641e9,46e6,0.65,0.50,3],
  ['col','Колумбия','Colombia','🇨🇴','south_america',343e9,52e6,0.60,0.60,3],
  ['tha','Таиланд','Thailand','🇹🇭','southeast_asia',495e9,72e6,0.45,0.60,3],
  ['vnm','Вьетнам','Vietnam','🇻🇳','southeast_asia',409e9,99e6,0.18,0.50,3],
  ['prk','КНДР','North Korea','🇰🇵','east_asia',18e9,26e6,0.03,0.05,4],
  ['swe','Швеция','Sweden','🇸🇪','europe',586e9,10.5e6,0.92,0.68,2],
  ['nor','Норвегия','Norway','🇳🇴','europe',579e9,5.5e6,0.93,0.68,2],
  ['che','Швейцария','Switzerland','🇨🇭','europe',818e9,8.8e6,0.90,0.75,2],
  ['nld','Нидерланды','Netherlands','🇳🇱','europe',991e9,17.6e6,0.88,0.72,2],
  ['bel','Бельгия','Belgium','🇧🇪','europe',578e9,11.6e6,0.85,0.68,2],
  ['grc','Греция','Greece','🇬🇷','europe',219e9,10.4e6,0.72,0.58,3],
  ['cze','Чехия','Czech Republic','🇨🇿','europe',291e9,10.8e6,0.78,0.68,3],
  ['rou','Румыния','Romania','🇷🇴','europe',301e9,19e6,0.65,0.62,3],
  ['kaz','Казахстан','Kazakhstan','🇰🇿','central_asia',220e9,19.4e6,0.22,0.52,3],
  // Additional significant countries
  ['are','ОАЭ','UAE','🇦🇪','middle_east',507e9,10e6,0.18,0.72,2],
  ['sgp','Сингапур','Singapore','🇸🇬','southeast_asia',397e9,5.9e6,0.55,0.85,2],
  ['phl','Филиппины','Philippines','🇵🇭','southeast_asia',404e9,115e6,0.52,0.58,3],
  ['mys','Малайзия','Malaysia','🇲🇾','southeast_asia',407e9,33e6,0.48,0.62,3],
  ['chl','Чили','Chile','🇨🇱','south_america',301e9,19.5e6,0.72,0.72,3],
  ['per','Перу','Peru','🇵🇪','south_america',242e9,34e6,0.55,0.60,3],
  ['ven','Венесуэла','Venezuela','🇻🇪','south_america',92e9,28e6,0.15,0.15,4],
  ['cub','Куба','Cuba','🇨🇺','north_america',107e9,11e6,0.10,0.10,4],
  ['eth','Эфиопия','Ethiopia','🇪🇹','africa',126e9,123e6,0.25,0.40,4],
  ['ken','Кения','Kenya','🇰🇪','africa',113e9,55e6,0.48,0.55,4],
];

// Remaining countries for completeness
const OTHER_COUNTRIES_RAW = [
  ['aut','Австрия','Austria','🇦🇹','europe',471e9,9e6,0.85,0.68,2],
  ['prt','Португалия','Portugal','🇵🇹','europe',252e9,10.3e6,0.80,0.62,3],
  ['irl','Ирландия','Ireland','🇮🇪','europe',533e9,5.1e6,0.88,0.78,2],
  ['dnk','Дания','Denmark','🇩🇰','europe',400e9,5.9e6,0.92,0.72,2],
  ['fin','Финляндия','Finland','🇫🇮','europe',282e9,5.5e6,0.90,0.68,2],
  ['hun','Венгрия','Hungary','🇭🇺','europe',188e9,9.7e6,0.55,0.60,3],
  ['bgr','Болгария','Bulgaria','🇧🇬','europe',90e9,6.5e6,0.58,0.62,3],
  ['svk','Словакия','Slovakia','🇸🇰','europe',115e9,5.4e6,0.68,0.65,3],
  ['hrv','Хорватия','Croatia','🇭🇷','europe',68e9,3.9e6,0.65,0.62,3],
  ['svn','Словения','Slovenia','🇸🇮','europe',62e9,2.1e6,0.75,0.65,3],
  ['ltu','Литва','Lithuania','🇱🇹','europe',67e9,2.8e6,0.78,0.68,3],
  ['lva','Латвия','Latvia','🇱🇻','europe',41e9,1.8e6,0.75,0.68,3],
  ['est','Эстония','Estonia','🇪🇪','europe',38e9,1.3e6,0.82,0.72,3],
  ['srb','Сербия','Serbia','🇷🇸','europe',63e9,6.7e6,0.52,0.55,3],
  ['blr','Беларусь','Belarus','🇧🇾','europe',72e9,9.4e6,0.12,0.35,3],
  ['geo','Грузия','Georgia','🇬🇪','europe',24e9,3.7e6,0.52,0.60,4],
  ['arm','Армения','Armenia','🇦🇲','europe',19e9,3e6,0.48,0.55,4],
  ['aze','Азербайджан','Azerbaijan','🇦🇿','central_asia',54e9,10.1e6,0.18,0.50,3],
  ['uzb','Узбекистан','Uzbekistan','🇺🇿','central_asia',80e9,35e6,0.15,0.45,4],
  ['tkm','Туркменистан','Turkmenistan','🇹🇲','central_asia',45e9,6.3e6,0.05,0.30,4],
  ['kgz','Кыргызстан','Kyrgyzstan','🇰🇬','central_asia',11e9,6.7e6,0.32,0.48,4],
  ['tjk','Таджикистан','Tajikistan','🇹🇯','central_asia',11e9,10e6,0.10,0.40,5],
  ['irq','Ирак','Iraq','🇮🇶','middle_east',264e9,43e6,0.30,0.42,3],
  ['syr','Сирия','Syria','🇸🇾','middle_east',11e9,22e6,0.08,0.25,5],
  ['jor','Иордания','Jordan','🇯🇴','middle_east',47e9,11e6,0.35,0.55,4],
  ['lbn','Ливан','Lebanon','🇱🇧','middle_east',19e9,5.5e6,0.40,0.50,4],
  ['kwt','Кувейт','Kuwait','🇰🇼','middle_east',175e9,4.3e6,0.28,0.60,2],
  ['qat','Катар','Qatar','🇶🇦','middle_east',220e9,2.9e6,0.18,0.65,2],
  ['omn','Оман','Oman','🇴🇲','middle_east',104e9,4.6e6,0.15,0.55,3],
  ['bhr','Бахрейн','Bahrain','🇧🇭','middle_east',44e9,1.5e6,0.22,0.62,3],
  ['yem','Йемен','Yemen','🇾🇪','middle_east',21e9,33e6,0.10,0.30,5],
  ['afg','Афганистан','Afghanistan','🇦🇫','south_asia',14e9,41e6,0.05,0.25,5],
  ['bgd','Бангладеш','Bangladesh','🇧🇩','south_asia',460e9,170e6,0.42,0.50,4],
  ['lka','Шри-Ланка','Sri Lanka','🇱🇰','south_asia',75e9,22e6,0.48,0.52,4],
  ['npl','Непал','Nepal','🇳🇵','south_asia',40e9,30e6,0.42,0.45,4],
  ['mmr','Мьянма','Myanmar','🇲🇲','southeast_asia',59e9,55e6,0.12,0.35,4],
  ['khm','Камбоджа','Cambodia','🇰🇭','southeast_asia',30e9,17e6,0.15,0.48,4],
  ['lao','Лаос','Laos','🇱🇦','southeast_asia',19e9,7.5e6,0.08,0.40,5],
  ['twn','Тайвань','Taiwan','🇹🇼','east_asia',790e9,23.6e6,0.82,0.75,2],
  ['mng','Монголия','Mongolia','🇲🇳','east_asia',17e9,3.4e6,0.55,0.55,4],
  ['nzl','Новая Зеландия','New Zealand','🇳🇿','oceania',247e9,5.1e6,0.88,0.72,2],
  ['dza','Алжир','Algeria','🇩🇿','africa',192e9,45e6,0.22,0.40,3],
  ['mar','Марокко','Morocco','🇲🇦','africa',134e9,37e6,0.35,0.52,3],
  ['tun','Тунис','Tunisia','🇹🇳','africa',46e9,12e6,0.48,0.50,4],
  ['lby','Ливия','Libya','🇱🇾','africa',42e9,7e6,0.12,0.38,4],
  ['sdn','Судан','Sudan','🇸🇩','africa',34e9,46e6,0.10,0.30,5],
  ['ago','Ангола','Angola','🇦🇴','africa',107e9,35e6,0.18,0.42,4],
  ['cod','ДР Конго','DR Congo','🇨🇩','africa',64e9,100e6,0.15,0.35,5],
  ['tza','Танзания','Tanzania','🇹🇿','africa',79e9,65e6,0.35,0.48,4],
  ['gha','Гана','Ghana','🇬🇭','africa',73e9,33e6,0.55,0.55,4],
  ['cmr','Камерун','Cameroon','🇨🇲','africa',45e9,28e6,0.28,0.42,4],
  ['civ','Кот-д\'Ивуар','Ivory Coast','🇨🇮','africa',70e9,28e6,0.32,0.50,4],
  ['sen','Сенегал','Senegal','🇸🇳','africa',28e9,17e6,0.52,0.52,4],
  ['moz','Мозамбик','Mozambique','🇲🇿','africa',17e9,32e6,0.28,0.42,5],
  ['mdg','Мадагаскар','Madagascar','🇲🇬','africa',14e9,29e6,0.32,0.42,5],
  ['uga','Уганда','Uganda','🇺🇬','africa',46e9,47e6,0.30,0.48,4],
  ['zwe','Зимбабве','Zimbabwe','🇿🇼','africa',28e9,16e6,0.18,0.35,5],
  ['ecu','Эквадор','Ecuador','🇪🇨','south_america',115e9,18e6,0.52,0.55,3],
  ['bol','Боливия','Bolivia','🇧🇴','south_america',44e9,12e6,0.42,0.38,4],
  ['pry','Парагвай','Paraguay','🇵🇾','south_america',41e9,7e6,0.48,0.55,4],
  ['ury','Уругвай','Uruguay','🇺🇾','south_america',71e9,3.4e6,0.78,0.65,3],
  ['dom','Доминикана','Dominican Republic','🇩🇴','north_america',113e9,11e6,0.52,0.58,3],
  ['cri','Коста-Рика','Costa Rica','🇨🇷','north_america',68e9,5.2e6,0.72,0.62,3],
  ['pan','Панама','Panama','🇵🇦','north_america',77e9,4.4e6,0.55,0.65,3],
  ['gtm','Гватемала','Guatemala','🇬🇹','north_america',95e9,18e6,0.38,0.55,4],
  ['hnd','Гондурас','Honduras','🇭🇳','north_america',31e9,10e6,0.35,0.52,4],
  ['slv','Сальвадор','El Salvador','🇸🇻','north_america',33e9,6.3e6,0.38,0.55,4],
  ['nic','Никарагуа','Nicaragua','🇳🇮','north_america',15e9,6.8e6,0.15,0.40,4],
  ['alb','Албания','Albania','🇦🇱','europe',18e9,2.8e6,0.48,0.58,4],
  ['mkd','Сев. Македония','North Macedonia','🇲🇰','europe',14e9,1.8e6,0.48,0.55,4],
  ['mne','Черногория','Montenegro','🇲🇪','europe',6e9,0.62e6,0.50,0.55,4],
  ['bih','Босния','Bosnia','🇧🇦','europe',22e9,3.2e6,0.42,0.50,4],
  ['mda','Молдова','Moldova','🇲🇩','europe',14e9,2.6e6,0.48,0.52,4],
  ['isl','Исландия','Iceland','🇮🇸','europe',27e9,0.38e6,0.92,0.72,2],
  ['lux','Люксембург','Luxembourg','🇱🇺','europe',86e9,0.65e6,0.88,0.75,2],
  ['mlt','Мальта','Malta','🇲🇹','europe',18e9,0.52e6,0.78,0.68,3],
  ['cyp','Кипр','Cyprus','🇨🇾','europe',28e9,1.2e6,0.72,0.65,3],
];

// ------- Factory for building country objects -------

const TIER_PROFILES = {
  1: { // Superpower
    milMul: 1.0, techBase: [85,85,80,88], corruption: [0.2,0.4], stability: [0.75,0.90],
    taxRate: [0.22,0.30], debtRatio: [0.6,1.3], reserves: 0.01, tradeBalRatio: [-0.03,0.02],
    infRate: [0.02,0.04], milSpend: [0.02,0.04], eduSpend: [0.04,0.06], healthSpend: [0.05,0.09],
    infraSpend: [0.02,0.04], socialSpend: [0.04,0.07], sciSpend: [0.02,0.04], intelSpend: [0.005,0.015],
    literacy: [0.95,0.99], health: [0.78,0.88], unemp: [0.03,0.06], popGrowth: [0.002,0.008],
    agents: [35,55], counterIntel: [70,90],
  },
  2: { // Major power
    milMul: 0.5, techBase: [60,65,60,65], corruption: [0.25,0.50], stability: [0.65,0.85],
    taxRate: [0.20,0.35], debtRatio: [0.3,1.0], reserves: 0.008, tradeBalRatio: [-0.02,0.03],
    infRate: [0.02,0.05], milSpend: [0.015,0.035], eduSpend: [0.03,0.06], healthSpend: [0.04,0.08],
    infraSpend: [0.02,0.04], socialSpend: [0.03,0.06], sciSpend: [0.015,0.03], intelSpend: [0.003,0.01],
    literacy: [0.92,0.99], health: [0.72,0.85], unemp: [0.03,0.08], popGrowth: [0.001,0.006],
    agents: [20,40], counterIntel: [55,75],
  },
  3: { // Regional power
    milMul: 0.25, techBase: [35,40,35,40], corruption: [0.35,0.65], stability: [0.45,0.75],
    taxRate: [0.15,0.30], debtRatio: [0.2,0.8], reserves: 0.005, tradeBalRatio: [-0.04,0.02],
    infRate: [0.03,0.08], milSpend: [0.015,0.04], eduSpend: [0.02,0.05], healthSpend: [0.02,0.06],
    infraSpend: [0.015,0.035], socialSpend: [0.02,0.05], sciSpend: [0.005,0.02], intelSpend: [0.002,0.008],
    literacy: [0.80,0.96], health: [0.55,0.75], unemp: [0.05,0.15], popGrowth: [0.005,0.015],
    agents: [10,25], counterIntel: [35,60],
  },
  4: { // Developing
    milMul: 0.1, techBase: [15,20,15,18], corruption: [0.45,0.75], stability: [0.35,0.65],
    taxRate: [0.10,0.22], debtRatio: [0.2,0.7], reserves: 0.003, tradeBalRatio: [-0.06,0.01],
    infRate: [0.04,0.12], milSpend: [0.01,0.03], eduSpend: [0.015,0.04], healthSpend: [0.015,0.04],
    infraSpend: [0.01,0.03], socialSpend: [0.01,0.04], sciSpend: [0.003,0.01], intelSpend: [0.001,0.005],
    literacy: [0.60,0.88], health: [0.40,0.62], unemp: [0.06,0.20], popGrowth: [0.010,0.025],
    agents: [5,15], counterIntel: [20,45],
  },
  5: { // Least developed
    milMul: 0.04, techBase: [5,8,5,5], corruption: [0.60,0.85], stability: [0.20,0.50],
    taxRate: [0.08,0.18], debtRatio: [0.3,0.9], reserves: 0.002, tradeBalRatio: [-0.08,-0.01],
    infRate: [0.06,0.20], milSpend: [0.01,0.04], eduSpend: [0.01,0.03], healthSpend: [0.01,0.03],
    infraSpend: [0.005,0.02], socialSpend: [0.005,0.03], sciSpend: [0.001,0.005], intelSpend: [0.001,0.003],
    literacy: [0.30,0.65], health: [0.28,0.48], unemp: [0.10,0.30], popGrowth: [0.020,0.035],
    agents: [2,8], counterIntel: [10,30],
  },
};

function lerp(a, b, t) { return a + (b - a) * t; }
function rr(min, max) { return min + Math.random() * (max - min); }
function ri(min, max) { return Math.floor(rr(min, max + 1)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function buildCountry(raw) {
  const [id, name, nameEn, flag, region, gdp, population, democracy, ecoIdeology, tier] = raw;
  const p = TIER_PROFILES[tier];
  const t = Math.random(); // random seed for variation within tier

  const gdpPerCapita = gdp / population;
  const devFactor = Math.min(1, gdpPerCapita / 60000); // 0-1 development factor

  // Sectors based on development level
  const agriLevel = Math.max(5, 60 - devFactor * 45 + ri(-5, 5));
  const indLevel = Math.max(5, 20 + devFactor * 55 + ri(-5, 5));
  const servLevel = Math.max(5, 15 + devFactor * 70 + ri(-5, 5));
  const techLevel2 = Math.max(3, devFactor * 85 + ri(-5, 5));

  // Sector output shares (roughly based on development)
  const agriOutput = Math.max(0.01, 0.35 - devFactor * 0.32);
  const indOutput = 0.15 + devFactor * 0.10 + rr(-0.03, 0.03);
  const techOutput = Math.max(0.01, devFactor * 0.20);
  const servOutput = Math.max(0.10, 1 - agriOutput - indOutput - techOutput);

  // Employment shares
  const agriEmp = Math.max(0.01, 0.50 - devFactor * 0.47);
  const indEmp = 0.12 + devFactor * 0.10;
  const techEmp = Math.max(0.01, devFactor * 0.15);
  const servEmp = Math.max(0.15, 1 - agriEmp - indEmp - techEmp);

  const taxRate = rr(...p.taxRate);
  const milSpend = rr(...p.milSpend);
  const debtRatio = rr(...p.debtRatio);

  // Military - scale by GDP and tier
  const milBudget = gdp * milSpend;
  const milScale = milBudget / 1e9; // billions

  // Nuclear only for known nuclear powers
  const nuclearPowers = { usa: 5500, rus: 6200, chn: 400, fra: 290, gbr: 225, ind: 170, pak: 170, isr: 90, prk: 50 };
  const nuclearCount = nuclearPowers[id] || 0;

  // Generate parties based on ideology
  const parties = generateParties(id, name, democracy, ecoIdeology);

  const country = {
    id,
    name,
    nameEn,
    flag,
    region,

    // Economy
    gdp,
    gdpGrowth: rr(0.005, 0.04) * (devFactor > 0.5 ? 0.7 : 1.3), // developing countries grow faster
    inflation: rr(...p.infRate),
    debt: gdp * debtRatio,
    debtToGDP: debtRatio,
    foreignReserves: gdp * rr(p.reserves * 0.5, p.reserves * 2),
    tradeBalance: gdp * rr(...p.tradeBalRatio),
    sectors: {
      agriculture: { level: agriLevel, output: agriOutput, employment: agriEmp },
      industry: { level: indLevel, output: indOutput, employment: indEmp },
      services: { level: servLevel, output: servOutput, employment: servEmp },
      tech: { level: techLevel2, output: techOutput, employment: techEmp },
    },
    budget: {
      taxRate,
      militarySpending: milSpend,
      educationSpending: rr(...p.eduSpend),
      healthcareSpending: rr(...p.healthSpend),
      infrastructureSpending: rr(...p.infraSpend),
      socialSpending: rr(...p.socialSpend),
      scienceSpending: rr(...p.sciSpend),
      intelligenceSpending: rr(...p.intelSpend),
    },

    // Politics
    approvalRating: rr(0.35, 0.65),
    democracyIndex: democracy,
    corruptionIndex: rr(...p.corruption),
    stabilityIndex: rr(...p.stability),
    ideology: {
      democracy,
      economy: ecoIdeology,
    },
    parties,

    // Military
    militaryBudget: milBudget,
    units: {
      infantry: {
        count: Math.floor(population * rr(0.002, 0.008) * p.milMul * (tier <= 2 ? 2 : 1)),
        equipment: ri(p.techBase[0] - 15, p.techBase[0] + 5),
        training: ri(p.techBase[0] - 20, p.techBase[0]),
        morale: ri(55, 80),
      },
      armor: {
        count: Math.floor(milScale * rr(3, 10)),
        equipment: ri(p.techBase[0] - 15, p.techBase[0] + 5),
        training: ri(p.techBase[0] - 20, p.techBase[0]),
        morale: ri(55, 80),
      },
      air: {
        count: Math.floor(milScale * rr(1, 6)),
        equipment: ri(p.techBase[0] - 10, p.techBase[0] + 5),
        training: ri(p.techBase[0] - 15, p.techBase[0] + 5),
        morale: ri(60, 82),
      },
      navy: {
        count: Math.floor(milScale * rr(0.2, 1.5)),
        equipment: ri(p.techBase[0] - 10, p.techBase[0] + 5),
        training: ri(p.techBase[0] - 15, p.techBase[0] + 5),
        morale: ri(60, 82),
      },
      missiles: {
        count: Math.floor(milScale * rr(0.5, 4)),
        equipment: ri(p.techBase[0] - 5, p.techBase[0] + 10),
        training: ri(p.techBase[0] - 10, p.techBase[0] + 5),
        morale: ri(65, 85),
      },
      nuclear: {
        count: nuclearCount,
        equipment: nuclearCount > 0 ? ri(80, 95) : 0,
        training: nuclearCount > 0 ? ri(80, 95) : 0,
        morale: nuclearCount > 0 ? ri(80, 90) : 0,
      },
    },
    warFatigue: 0,

    // Population
    population,
    populationGrowth: rr(...p.popGrowth),
    literacy: rr(...p.literacy),
    healthIndex: rr(...p.health),
    unemployment: rr(...p.unemp),
    emigrationRate: devFactor > 0.5 ? rr(0.001, 0.005) : rr(0.005, 0.015),

    // Technology
    techLevel: {
      military: p.techBase[0] + ri(-8, 8),
      civilian: p.techBase[1] + ri(-8, 8),
      industrial: p.techBase[2] + ri(-8, 8),
      digital: p.techBase[3] + ri(-8, 8),
    },

    // Espionage
    intelligenceBudget: milBudget * rr(0.05, 0.15),
    agentCount: ri(...p.agents),
    counterintelligence: ri(...p.counterIntel),

    // Diplomacy (initialized by initializeDiplomacy)
    relations: {},
    alliances: [],
    sanctions: [],
    tradeAgreements: [],

    // Runtime
    militaryStrength: 0,
  };

  // Apply specific overrides for major countries
  applyOverrides(country);

  return country;
}

function generateParties(id, name, democracy, economy) {
  if (democracy < 0.1) {
    return [
      { name: 'Правящая партия', support: 0.85, ideology: { democracy: democracy, economy } },
      { name: 'Оппозиция', support: 0.10, ideology: { democracy: democracy + 0.2, economy: economy + 0.1 } },
    ];
  }
  if (democracy < 0.4) {
    return [
      { name: 'Партия власти', support: 0.65, ideology: { democracy, economy } },
      { name: 'Умеренная оппозиция', support: 0.20, ideology: { democracy: democracy + 0.15, economy: economy + 0.1 } },
      { name: 'Радикальная оппозиция', support: 0.10, ideology: { democracy: democracy + 0.3, economy } },
    ];
  }
  // Democratic
  return [
    { name: 'Правоцентристы', support: 0.40 + rr(-0.08, 0.08), ideology: { democracy: democracy + 0.05, economy: Math.min(1, economy + 0.15) } },
    { name: 'Левоцентристы', support: 0.35 + rr(-0.08, 0.08), ideology: { democracy: democracy + 0.05, economy: Math.max(0, economy - 0.15) } },
    { name: 'Националисты', support: 0.12 + rr(-0.05, 0.05), ideology: { democracy: Math.max(0, democracy - 0.15), economy } },
    { name: 'Зелёные/Либералы', support: 0.08 + rr(-0.03, 0.03), ideology: { democracy: Math.min(1, democracy + 0.1), economy: Math.max(0, economy - 0.1) } },
  ];
}

// Specific overrides for well-known countries
function applyOverrides(c) {
  const overrides = {
    usa: {
      parties: [
        { name: 'Демократическая партия', support: 0.48, ideology: { democracy: 0.85, economy: 0.55 } },
        { name: 'Республиканская партия', support: 0.46, ideology: { democracy: 0.75, economy: 0.85 } },
      ],
      units: {
        infantry: { count: 480000, equipment: 88, training: 82, morale: 76 },
        armor: { count: 6300, equipment: 85, training: 80, morale: 75 },
        air: { count: 5200, equipment: 92, training: 88, morale: 82 },
        navy: { count: 490, equipment: 90, training: 85, morale: 80 },
        missiles: { count: 450, equipment: 92, training: 87, morale: 82 },
        nuclear: { count: 5500, equipment: 95, training: 92, morale: 85 },
      },
      techLevel: { military: 92, civilian: 90, industrial: 84, digital: 94 },
      foreignReserves: 250e9,
      debtToGDP: 1.24,
      debt: 31000e9,
      intelligenceBudget: 85e9,
      agentCount: 55,
      counterintelligence: 85,
    },
    chn: {
      parties: [
        { name: 'Коммунистическая партия Китая', support: 0.90, ideology: { democracy: 0.10, economy: 0.45 } },
      ],
      units: {
        infantry: { count: 975000, equipment: 72, training: 70, morale: 78 },
        armor: { count: 5800, equipment: 70, training: 68, morale: 75 },
        air: { count: 3200, equipment: 75, training: 72, morale: 78 },
        navy: { count: 370, equipment: 72, training: 70, morale: 78 },
        missiles: { count: 500, equipment: 80, training: 78, morale: 80 },
        nuclear: { count: 400, equipment: 82, training: 80, morale: 82 },
      },
      techLevel: { military: 78, civilian: 75, industrial: 82, digital: 80 },
      foreignReserves: 3100e9,
      intelligenceBudget: 45e9,
      agentCount: 50,
      counterintelligence: 75,
    },
    rus: {
      parties: [
        { name: 'Единая Россия', support: 0.60, ideology: { democracy: 0.20, economy: 0.50 } },
        { name: 'КПРФ', support: 0.15, ideology: { democracy: 0.15, economy: 0.20 } },
        { name: 'ЛДПР', support: 0.10, ideology: { democracy: 0.15, economy: 0.55 } },
        { name: 'Справедливая Россия', support: 0.08, ideology: { democracy: 0.25, economy: 0.35 } },
      ],
      units: {
        infantry: { count: 550000, equipment: 65, training: 62, morale: 60 },
        armor: { count: 12400, equipment: 58, training: 55, morale: 58 },
        air: { count: 4100, equipment: 68, training: 65, morale: 62 },
        navy: { count: 310, equipment: 60, training: 58, morale: 60 },
        missiles: { count: 600, equipment: 78, training: 75, morale: 70 },
        nuclear: { count: 6200, equipment: 82, training: 80, morale: 75 },
      },
      techLevel: { military: 72, civilian: 55, industrial: 55, digital: 58 },
      foreignReserves: 580e9,
      warFatigue: 35,
      intelligenceBudget: 25e9,
      agentCount: 45,
      counterintelligence: 78,
    },
    ind: {
      parties: [
        { name: 'Бхаратия Джаната', support: 0.40, ideology: { democracy: 0.62, economy: 0.62 } },
        { name: 'Индийский национальный конгресс', support: 0.28, ideology: { democracy: 0.70, economy: 0.50 } },
        { name: 'Региональные партии', support: 0.25, ideology: { democracy: 0.60, economy: 0.50 } },
      ],
      techLevel: { military: 52, civilian: 55, industrial: 48, digital: 62 },
      foreignReserves: 620e9,
    },
    jpn: {
      parties: [
        { name: 'Либерально-демократическая', support: 0.45, ideology: { democracy: 0.80, economy: 0.72 } },
        { name: 'Конституционно-демократическая', support: 0.22, ideology: { democracy: 0.85, economy: 0.50 } },
        { name: 'Комэйто', support: 0.12, ideology: { democracy: 0.80, economy: 0.60 } },
      ],
      techLevel: { military: 72, civilian: 88, industrial: 85, digital: 82 },
      foreignReserves: 1260e9,
    },
    deu: {
      parties: [
        { name: 'ХДС/ХСС', support: 0.30, ideology: { democracy: 0.88, economy: 0.68 } },
        { name: 'СДПГ', support: 0.22, ideology: { democracy: 0.90, economy: 0.45 } },
        { name: 'Зелёные', support: 0.15, ideology: { democracy: 0.92, economy: 0.40 } },
        { name: 'АдГ', support: 0.18, ideology: { democracy: 0.50, economy: 0.65 } },
      ],
      techLevel: { military: 68, civilian: 82, industrial: 85, digital: 75 },
    },
    gbr: {
      parties: [
        { name: 'Консерваторы', support: 0.32, ideology: { democracy: 0.82, economy: 0.75 } },
        { name: 'Лейбористы', support: 0.42, ideology: { democracy: 0.85, economy: 0.45 } },
        { name: 'Либерал-демократы', support: 0.12, ideology: { democracy: 0.90, economy: 0.60 } },
      ],
      techLevel: { military: 75, civilian: 80, industrial: 65, digital: 82 },
    },
    fra: {
      parties: [
        { name: 'Ренессанс', support: 0.28, ideology: { democracy: 0.82, economy: 0.65 } },
        { name: 'Национальное объединение', support: 0.30, ideology: { democracy: 0.50, economy: 0.58 } },
        { name: 'Социалисты', support: 0.15, ideology: { democracy: 0.85, economy: 0.35 } },
        { name: 'Непокорённая Франция', support: 0.18, ideology: { democracy: 0.78, economy: 0.20 } },
      ],
      techLevel: { military: 75, civilian: 78, industrial: 68, digital: 72 },
    },
    prk: {
      parties: [
        { name: 'Трудовая партия Кореи', support: 0.98, ideology: { democracy: 0.02, economy: 0.05 } },
      ],
      techLevel: { military: 42, civilian: 10, industrial: 25, digital: 8 },
      approvalRating: 0.95,
      stabilityIndex: 0.60,
      corruptionIndex: 0.90,
      foreignReserves: 0.5e9,
      tradeBalance: -2e9,
    },
    ukr: {
      warFatigue: 55,
      stabilityIndex: 0.42,
      approvalRating: 0.55,
      parties: [
        { name: 'Слуга народа', support: 0.35, ideology: { democracy: 0.62, economy: 0.55 } },
        { name: 'Европейская солидарность', support: 0.20, ideology: { democracy: 0.70, economy: 0.65 } },
        { name: 'Батькивщина', support: 0.12, ideology: { democracy: 0.65, economy: 0.50 } },
      ],
    },
    isr: {
      techLevel: { military: 85, civilian: 82, industrial: 72, digital: 88 },
      agentCount: 45,
      counterintelligence: 82,
    },
    kor: {
      parties: [
        { name: 'Сила народа', support: 0.42, ideology: { democracy: 0.78, economy: 0.72 } },
        { name: 'Демократическая партия', support: 0.45, ideology: { democracy: 0.82, economy: 0.52 } },
      ],
      techLevel: { military: 68, civilian: 82, industrial: 82, digital: 88 },
    },
    sau: {
      parties: [
        { name: 'Монархия', support: 0.80, ideology: { democracy: 0.08, economy: 0.55 } },
      ],
      sectors: {
        agriculture: { level: 15, output: 0.02, employment: 0.05 },
        industry: { level: 55, output: 0.42, employment: 0.22 },
        services: { level: 50, output: 0.45, employment: 0.60 },
        tech: { level: 30, output: 0.11, employment: 0.13 },
      },
      foreignReserves: 430e9,
    },
    irn: {
      parties: [
        { name: 'Консерваторы', support: 0.55, ideology: { democracy: 0.12, economy: 0.30 } },
        { name: 'Реформисты', support: 0.30, ideology: { democracy: 0.35, economy: 0.45 } },
      ],
      techLevel: { military: 55, civilian: 42, industrial: 48, digital: 38 },
    },
  };

  const ov = overrides[c.id];
  if (ov) {
    for (const [key, val] of Object.entries(ov)) {
      if (typeof val === 'object' && !Array.isArray(val) && val !== null) {
        c[key] = { ...c[key], ...val };
        // Deep merge for units
        if (key === 'units') {
          for (const [uKey, uVal] of Object.entries(val)) {
            c.units[uKey] = { ...c.units[uKey], ...uVal };
          }
        }
      } else {
        c[key] = val;
      }
    }
  }
}

// ------- Main export -------

export function createCountries() {
  const countries = new Map();

  const allRaw = [...MAJOR_COUNTRIES_RAW, ...OTHER_COUNTRIES_RAW];

  for (const raw of allRaw) {
    const country = buildCountry(raw);
    countries.set(country.id, country);
  }

  return countries;
}

// ------- Diplomacy initialization -------

export function initializeDiplomacy(countries) {
  const ids = Array.from(countries.keys());

  // Set base relations for all pairs
  for (const id1 of ids) {
    const c1 = countries.get(id1);
    for (const id2 of ids) {
      if (id1 === id2) continue;
      const c2 = countries.get(id2);

      let relation = 0;

      // Ideological similarity
      const demDiff = Math.abs(c1.ideology.democracy - c2.ideology.democracy);
      const ecoDiff = Math.abs(c1.ideology.economy - c2.ideology.economy);
      relation += (1 - demDiff) * 20 - 10; // -10 to +10
      relation += (1 - ecoDiff) * 10 - 5;  // -5 to +5

      // Same region bonus
      if (c1.region === c2.region) relation += 10;

      // NATO
      if (NATO_MEMBERS.includes(id1) && NATO_MEMBERS.includes(id2)) relation += 50;

      // EU
      if (EU_MEMBERS.includes(id1) && EU_MEMBERS.includes(id2)) relation += 60;

      // BRICS (weaker bond)
      if (BRICS_MEMBERS.includes(id1) && BRICS_MEMBERS.includes(id2)) relation += 20;

      c1.relations[id2] = Math.max(-100, Math.min(100, relation));
    }
  }

  // Historical rivalries and special relations
  const specialRelations = [
    // Rivalries
    ['usa', 'rus', -50], ['usa', 'chn', -30], ['usa', 'irn', -70], ['usa', 'prk', -90], ['usa', 'cub', -60], ['usa', 'ven', -50],
    ['rus', 'ukr', -80], ['rus', 'pol', -40], ['rus', 'gbr', -50], ['rus', 'geo', -60],
    ['ind', 'pak', -70], ['ind', 'chn', -30],
    ['isr', 'irn', -90], ['isr', 'syr', -80], ['isr', 'lbn', -60], ['isr', 'irq', -50],
    ['sau', 'irn', -70], ['sau', 'yem', -40],
    ['chn', 'twn', -60], ['chn', 'jpn', -30], ['chn', 'kor', -15],
    ['jpn', 'kor', -10], ['jpn', 'prk', -70],
    ['grc', 'tur', -30], ['arm', 'aze', -70], ['arm', 'tur', -60],
    ['srb', 'alb', -40], ['srb', 'hrv', -20],
    ['eth', 'egy', -20],
    // Strong friendships
    ['usa', 'gbr', 80], ['usa', 'can', 85], ['usa', 'aus', 75], ['usa', 'jpn', 65], ['usa', 'kor', 60], ['usa', 'isr', 75],
    ['rus', 'blr', 70], ['rus', 'chn', 40], ['rus', 'ind', 35], ['rus', 'irn', 30], ['rus', 'prk', 25], ['rus', 'cub', 35],
    ['chn', 'prk', 30], ['chn', 'pak', 50], ['chn', 'rus', 40],
    ['deu', 'fra', 75], ['deu', 'nld', 70], ['deu', 'aut', 75],
    ['gbr', 'aus', 75], ['gbr', 'can', 70], ['gbr', 'nzl', 72],
    ['sau', 'are', 60], ['sau', 'kwt', 55], ['sau', 'bhr', 55],
    ['ind', 'jpn', 35], ['ind', 'rus', 35],
    ['tur', 'aze', 65], ['tur', 'pak', 40],
    ['pol', 'ukr', 50], ['pol', 'usa', 55],
  ];

  for (const [id1, id2, value] of specialRelations) {
    const c1 = countries.get(id1);
    const c2 = countries.get(id2);
    if (c1 && c2) {
      c1.relations[id2] = Math.max(-100, Math.min(100, value));
      c2.relations[id1] = Math.max(-100, Math.min(100, value));
    }
  }

  // Set up alliances
  const natoAlliance = { id: 'nato', name: 'НАТО', members: [...NATO_MEMBERS], type: 'military' };
  const euAlliance = { id: 'eu', name: 'Евросоюз', members: [...EU_MEMBERS], type: 'economic' };
  const bricsAlliance = { id: 'brics', name: 'БРИКС', members: [...BRICS_MEMBERS], type: 'economic' };

  for (const id of NATO_MEMBERS) {
    const c = countries.get(id);
    if (c) c.alliances.push({ ...natoAlliance });
  }
  for (const id of EU_MEMBERS) {
    const c = countries.get(id);
    if (c) c.alliances.push({ ...euAlliance });
  }
  for (const id of BRICS_MEMBERS) {
    const c = countries.get(id);
    if (c) c.alliances.push({ ...bricsAlliance });
  }

  // Trade agreements within alliances
  for (const id1 of EU_MEMBERS) {
    for (const id2 of EU_MEMBERS) {
      if (id1 >= id2) continue;
      const c1 = countries.get(id1);
      const c2 = countries.get(id2);
      if (c1 && c2) {
        c1.tradeAgreements.push({ partnerId: id2, bonus: 0.15 });
        c2.tradeAgreements.push({ partnerId: id1, bonus: 0.15 });
      }
    }
  }

  // Major bilateral trade agreements
  const tradePartners = [
    ['usa', 'can', 0.20], ['usa', 'mex', 0.18], ['usa', 'jpn', 0.12], ['usa', 'kor', 0.10], ['usa', 'aus', 0.10],
    ['chn', 'kor', 0.10], ['chn', 'aus', 0.08], ['chn', 'bra', 0.08],
    ['jpn', 'aus', 0.08], ['jpn', 'kor', 0.08],
    ['rus', 'chn', 0.10], ['rus', 'ind', 0.06],
  ];

  for (const [id1, id2, bonus] of tradePartners) {
    const c1 = countries.get(id1);
    const c2 = countries.get(id2);
    if (c1 && c2) {
      if (!c1.tradeAgreements.find(t => t.partnerId === id2)) {
        c1.tradeAgreements.push({ partnerId: id2, bonus });
        c2.tradeAgreements.push({ partnerId: id1, bonus });
      }
    }
  }
}
