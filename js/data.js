/* ============================================================================
   DARK SIDE OF THE WORLD CUP 2026 — DATA LAYER
   ----------------------------------------------------------------------------
   Voice: dark-funny & merciless. Facts do the stabbing; the wit twists it.
   Every factual claim carries a source id (see SOURCES). Values are tagged:
     "fact"       — happened / officially reported. Real & cited.
     "projection" — pre-/mid-tournament estimate. Labelled in the UI.
     "modeled"    — derived in-app from a stated method.
   ============================================================================ */

const TOURNAMENT = {
  start: "2026-06-11",
  end:   "2026-07-19",
  teams: 48, matches: 104, countries: 3, hostCityCount: 16
};

/* -------------------------------------------------------------------------- */
/*  16 HOST CITIES (official)  — source [S_HOSTS]                             */
/* -------------------------------------------------------------------------- */
const HOST_CITIES = [
  { id: "atl", city: "Atlanta",               country: "USA", venue: "Mercedes-Benz Stadium", lat: 33.755, lng: -84.400 },
  { id: "bos", city: "Boston",                country: "USA", venue: "Gillette Stadium (Foxborough)", lat: 42.091, lng: -71.264 },
  { id: "dal", city: "Dallas",                country: "USA", venue: "AT&T Stadium (Arlington)", lat: 32.747, lng: -97.093 },
  { id: "hou", city: "Houston",               country: "USA", venue: "NRG Stadium", lat: 29.685, lng: -95.411 },
  { id: "kc",  city: "Kansas City",           country: "USA", venue: "Arrowhead Stadium", lat: 39.049, lng: -94.484 },
  { id: "la",  city: "Los Angeles",           country: "USA", venue: "SoFi Stadium (Inglewood)", lat: 33.953, lng: -118.339 },
  { id: "mia", city: "Miami",                 country: "USA", venue: "Hard Rock Stadium", lat: 25.958, lng: -80.239 },
  { id: "nyc", city: "New York / New Jersey", country: "USA", venue: "MetLife Stadium — FINAL", lat: 40.813, lng: -74.074 },
  { id: "phi", city: "Philadelphia",          country: "USA", venue: "Lincoln Financial Field", lat: 39.901, lng: -75.168 },
  { id: "sf",  city: "San Francisco Bay Area",country: "USA", venue: "Levi's Stadium (Santa Clara)", lat: 37.403, lng: -121.970 },
  { id: "sea", city: "Seattle",               country: "USA", venue: "Lumen Field", lat: 47.595, lng: -122.332 },
  { id: "tor", city: "Toronto",               country: "CAN", venue: "BMO Field", lat: 43.633, lng: -79.418 },
  { id: "van", city: "Vancouver",             country: "CAN", venue: "BC Place", lat: 49.277, lng: -123.112 },
  { id: "gdl", city: "Guadalajara",           country: "MEX", venue: "Estadio Akron", lat: 20.681, lng: -103.463 },
  { id: "mex", city: "Mexico City",           country: "MEX", venue: "Estadio Azteca", lat: 19.303, lng: -99.150 },
  { id: "mty", city: "Monterrey",             country: "MEX", venue: "Estadio BBVA", lat: 25.669, lng: -100.244 }
];

/* -------------------------------------------------------------------------- */
/*  FAN-TRAVEL ORIGINS — representative large travelling fanbases [modeled]   */
/* -------------------------------------------------------------------------- */
const FAN_ORIGINS = [
  { id: "eng", nation: "England",      city: "London",       lat: 51.507, lng: -0.128, fans: 40000, hub: "nyc" },
  { id: "bra", nation: "Brazil",       city: "São Paulo",    lat: -23.55, lng: -46.633, fans: 45000, hub: "mia" },
  { id: "arg", nation: "Argentina",    city: "Buenos Aires", lat: -34.60, lng: -58.381, fans: 50000, hub: "mia" },
  { id: "ger", nation: "Germany",      city: "Berlin",       lat: 52.52,  lng: 13.405,  fans: 35000, hub: "nyc" },
  { id: "fra", nation: "France",       city: "Paris",        lat: 48.857, lng: 2.352,   fans: 30000, hub: "nyc" },
  { id: "esp", nation: "Spain",        city: "Madrid",       lat: 40.417, lng: -3.703,  fans: 28000, hub: "mia" },
  { id: "ned", nation: "Netherlands",  city: "Amsterdam",    lat: 52.370, lng: 4.895,   fans: 22000, hub: "phi" },
  { id: "cro", nation: "Croatia",      city: "Zagreb",       lat: 45.815, lng: 15.982,  fans: 9000,  hub: "nyc" },
  { id: "mar", nation: "Morocco",      city: "Casablanca",   lat: 33.573, lng: -7.590,  fans: 16000, hub: "nyc" },
  { id: "nga", nation: "Nigeria",      city: "Lagos",        lat: 6.524,  lng: 3.379,   fans: 12000, hub: "atl" },
  { id: "ksa", nation: "Saudi Arabia", city: "Riyadh",       lat: 24.713, lng: 46.675,  fans: 15000, hub: "la"  },
  { id: "jpn", nation: "Japan",        city: "Tokyo",        lat: 35.676, lng: 139.650, fans: 20000, hub: "sf"  },
  { id: "kor", nation: "South Korea",  city: "Seoul",        lat: 37.566, lng: 126.978, fans: 18000, hub: "la"  },
  { id: "aus", nation: "Australia",    city: "Sydney",       lat: -33.868,lng: 151.209, fans: 12000, hub: "sea" }
];

const EMISSION_METHOD = {
  kgCO2ePerPassengerKm: 0.25,
  carTonsPerYear: 4.6,
  charterKgPerKm: 11,          // whole-aircraft CO2e/km for a team charter jet (incl. RF), illustrative
  note: "Per-fan figure = great-circle distance × 2 (round trip) × 0.25 kg CO₂e/passenger-km, bundling non-CO₂ altitude effects via a radiative-forcing multiplier. Route total = per-fan × an illustrative travelling-fan estimate. Fan counts are order-of-magnitude assumptions, not ticketing data. Team-charter legs use ~11 kg CO₂e per aircraft-km (illustrative)."
};

/* -------------------------------------------------------------------------- */
/*  TEAM ITINERARIES — illustrative tournament routing (labelled in UI).     */
/*  `c` = host-city id, `m` = match label. Real fixtures vary; the point is   */
/*  the continental zig-zag every team is forced into. [modeled/illustrative] */
/* -------------------------------------------------------------------------- */
/* All 48 qualified nations. The 12 below carry hand-authored routes; the rest
   get plausible illustrative itineraries generated in teams.js (labelled). */
const TEAMS = [
  // --- hand-authored routes (kept for variety) ---
  { id: "arg", name: "Argentina", flag: "🇦🇷", conf: "CONMEBOL", color: "#7cb3e8", route: [
    { c: "mia", m: "Group · MD1" }, { c: "atl", m: "Group · MD2" }, { c: "dal", m: "Group · MD3" },
    { c: "hou", m: "Round of 32" }, { c: "kc", m: "Round of 16" }, { c: "la", m: "Quarter-final" },
    { c: "dal", m: "Semi-final" }, { c: "nyc", m: "FINAL" } ] },
  { id: "eng", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", conf: "UEFA", color: "#e35b5b", route: [
    { c: "nyc", m: "Group · MD1" }, { c: "bos", m: "Group · MD2" }, { c: "phi", m: "Group · MD3" },
    { c: "atl", m: "Round of 32" }, { c: "dal", m: "Round of 16" }, { c: "sf", m: "Quarter-final" },
    { c: "nyc", m: "Semi-final" } ] },
  { id: "bra", name: "Brazil", flag: "🇧🇷", conf: "CONMEBOL", color: "#f5d020", route: [
    { c: "mia", m: "Group · MD1" }, { c: "la", m: "Group · MD2" }, { c: "sf", m: "Group · MD3" },
    { c: "kc", m: "Round of 32" }, { c: "nyc", m: "Round of 16" } ] },
  { id: "usa", name: "USA", flag: "🇺🇸", conf: "CONCACAF", color: "#5b8ce3", route: [
    { c: "la", m: "Group · MD1" }, { c: "sea", m: "Group · MD2" }, { c: "sf", m: "Group · MD3" },
    { c: "dal", m: "Round of 32" }, { c: "kc", m: "Round of 16" } ] },
  { id: "mex", name: "Mexico", flag: "🇲🇽", conf: "CONCACAF", color: "#3fae6b", route: [
    { c: "mex", m: "Group · MD1" }, { c: "gdl", m: "Group · MD2" }, { c: "mty", m: "Group · MD3" },
    { c: "hou", m: "Round of 32" } ] },
  { id: "mar", name: "Morocco", flag: "🇲🇦", conf: "CAF", color: "#e0554d", route: [
    { c: "nyc", m: "Group · MD1" }, { c: "atl", m: "Group · MD2" }, { c: "mia", m: "Group · MD3" },
    { c: "kc", m: "Round of 32" }, { c: "la", m: "Round of 16" } ] },
  { id: "ger", name: "Germany", flag: "🇩🇪", conf: "UEFA", color: "#cfd6da", route: [
    { c: "phi", m: "Group · MD1" }, { c: "tor", m: "Group · MD2" }, { c: "bos", m: "Group · MD3" },
    { c: "nyc", m: "Round of 32" }, { c: "sf", m: "Round of 16" } ] },
  { id: "jpn", name: "Japan", flag: "🇯🇵", conf: "AFC", color: "#e86b8a", route: [
    { c: "sf", m: "Group · MD1" }, { c: "la", m: "Group · MD2" }, { c: "sea", m: "Group · MD3" },
    { c: "van", m: "Round of 32" } ] },
  { id: "por", name: "Portugal", flag: "🇵🇹", conf: "UEFA", color: "#4fd08a", route: [
    { c: "bos", m: "Group · MD1" }, { c: "nyc", m: "Group · MD2" }, { c: "phi", m: "Group · MD3" },
    { c: "mia", m: "Round of 32" }, { c: "atl", m: "Round of 16" }, { c: "kc", m: "Quarter-final" } ] },
  { id: "ned", name: "Netherlands", flag: "🇳🇱", conf: "UEFA", color: "#ff9d3c", route: [
    { c: "phi", m: "Group · MD1" }, { c: "tor", m: "Group · MD2" }, { c: "nyc", m: "Group · MD3" },
    { c: "kc", m: "Round of 32" }, { c: "sf", m: "Round of 16" } ] },
  { id: "can", name: "Canada", flag: "🇨🇦", conf: "CONCACAF", color: "#dd5555", route: [
    { c: "tor", m: "Group · MD1" }, { c: "van", m: "Group · MD2" }, { c: "sea", m: "Group · MD3" },
    { c: "la", m: "Round of 32" } ] },
  { id: "col", name: "Colombia", flag: "🇨🇴", conf: "CONMEBOL", color: "#f5c020", route: [
    { c: "mia", m: "Group · MD1" }, { c: "hou", m: "Group · MD2" }, { c: "dal", m: "Group · MD3" },
    { c: "kc", m: "Round of 32" }, { c: "la", m: "Round of 16" }, { c: "nyc", m: "Quarter-final" } ] },
  // --- remaining 36 (illustrative routes generated in teams.js) ---
  { id: "fra", name: "France",        flag: "🇫🇷", conf: "UEFA" },
  { id: "esp", name: "Spain",         flag: "🇪🇸", conf: "UEFA" },
  { id: "cro", name: "Croatia",       flag: "🇭🇷", conf: "UEFA" },
  { id: "bel", name: "Belgium",       flag: "🇧🇪", conf: "UEFA" },
  { id: "sui", name: "Switzerland",   flag: "🇨🇭", conf: "UEFA" },
  { id: "aut", name: "Austria",       flag: "🇦🇹", conf: "UEFA" },
  { id: "cze", name: "Czechia",       flag: "🇨🇿", conf: "UEFA" },
  { id: "nor", name: "Norway",        flag: "🇳🇴", conf: "UEFA" },
  { id: "swe", name: "Sweden",        flag: "🇸🇪", conf: "UEFA" },
  { id: "sco", name: "Scotland",      flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", conf: "UEFA" },
  { id: "tur", name: "Türkiye",       flag: "🇹🇷", conf: "UEFA" },
  { id: "bih", name: "Bosnia & Herz.",flag: "🇧🇦", conf: "UEFA" },
  { id: "uru", name: "Uruguay",       flag: "🇺🇾", conf: "CONMEBOL" },
  { id: "ecu", name: "Ecuador",       flag: "🇪🇨", conf: "CONMEBOL" },
  { id: "par", name: "Paraguay",      flag: "🇵🇾", conf: "CONMEBOL" },
  { id: "kor", name: "South Korea",   flag: "🇰🇷", conf: "AFC" },
  { id: "aus", name: "Australia",     flag: "🇦🇺", conf: "AFC" },
  { id: "irn", name: "Iran",          flag: "🇮🇷", conf: "AFC" },
  { id: "ksa", name: "Saudi Arabia",  flag: "🇸🇦", conf: "AFC" },
  { id: "qat", name: "Qatar",         flag: "🇶🇦", conf: "AFC" },
  { id: "jor", name: "Jordan",        flag: "🇯🇴", conf: "AFC" },
  { id: "uzb", name: "Uzbekistan",    flag: "🇺🇿", conf: "AFC" },
  { id: "irq", name: "Iraq",          flag: "🇮🇶", conf: "AFC" },
  { id: "egy", name: "Egypt",         flag: "🇪🇬", conf: "CAF" },
  { id: "sen", name: "Senegal",       flag: "🇸🇳", conf: "CAF" },
  { id: "tun", name: "Tunisia",       flag: "🇹🇳", conf: "CAF" },
  { id: "alg", name: "Algeria",       flag: "🇩🇿", conf: "CAF" },
  { id: "gha", name: "Ghana",         flag: "🇬🇭", conf: "CAF" },
  { id: "civ", name: "Ivory Coast",   flag: "🇨🇮", conf: "CAF" },
  { id: "rsa", name: "South Africa",  flag: "🇿🇦", conf: "CAF" },
  { id: "cpv", name: "Cape Verde",    flag: "🇨🇻", conf: "CAF" },
  { id: "cod", name: "DR Congo",      flag: "🇨🇩", conf: "CAF" },
  { id: "pan", name: "Panama",        flag: "🇵🇦", conf: "CONCACAF" },
  { id: "cuw", name: "Curaçao",       flag: "🇨🇼", conf: "CONCACAF" },
  { id: "hai", name: "Haiti",         flag: "🇭🇹", conf: "CONCACAF" },
  { id: "nzl", name: "New Zealand",   flag: "🇳🇿", conf: "OFC" }
];

const EMISSIONS_FACTS = {
  projectedTotalMt: 9.02, projectedRangeMt: [7.8, 15],
  spectatorTravelShare: 0.87, intlAttendanceShare: 0.35, intlTravelEmissionShare: 0.74,
  vsHistoricAverage: 2.0, src: ["S_SGR", "S_LBORO", "S_TIME", "S_EURONEWS", "S_GREENLY"]
  /* Greenly's independent June estimate: 7.8Mt CO2e, 87.8% from spectator travel —
     more than double Qatar 2022's reported 3.63Mt. The 9.02–15Mt range stands. */
};

/* -------------------------------------------------------------------------- */
/*  REAL-WORLD COMPARISON CONSTANTS — the emotional-damage engine             */
/*  Rough, defensible reference values. Used to recontextualise big numbers.  */
/* -------------------------------------------------------------------------- */
const COMPARE = {
  moonKm: 384400,              // Earth–Moon distance
  earthCircKm: 40075,          // equatorial circumference
  carTonsYear: 4.6,            // t CO2/yr, avg US car (EPA)
  personTonsYear: 4.7,        // global avg per-capita CO2/yr (~t)
  treesPerTonYear: 40,         // mature trees to absorb ~1 t CO2/yr (order-of-mag)
  smallCountryMt: { name: "Malta", mt: 2.0 }, // ~annual national emissions, illustrative
  // money
  medianUSRentMonth: 1600,     // ~US median asking rent
  supportiveHousingYear: 30000,// ~annual cost to house one person (supportive housing)
  nurseSalaryYear: 86000,      // ~US RN median
  teacherSalaryYear: 66000,    // ~US teacher median
  schoolLunchYear: 850         // ~cost of a year of school lunches per child
};

/* -------------------------------------------------------------------------- */
/*  PUBLIC COST / BUDGET  +  "substitution board" of alternatives            */
/* -------------------------------------------------------------------------- */
const BUDGET = {
  cityCosts: [
    { city: "Vancouver", currency: "CAD", promised: 260, projected: 729, basis: "projection",
      note: "Total public cost now $685M–$729M — nearly triple the province's 2022 estimate. The 'net cost to taxpayers' line keeps moving too.", src: ["S_CBC_VAN", "S_GLOBAL_VAN", "S_DH_VAN"] },
    { city: "Toronto",   currency: "CAD", promised: 45,  projected: 380, basis: "projection",
      note: "Council was told the bid would cost no more than $45M. It's $380M — and the city started charging $10 admission to its own fan festival to plug a $6.2M deficit.", src: ["S_STATELINE", "S_PBO", "S_CP24_TOR"] }
  ],
  headlines: [
    { label: "Canada's taxpayer tab, confirmed (PBO)", value: 1066, unit: "CAD millions", basis: "fact",
      note: "The Parliamentary Budget Officer's May report lands on $1,066M of public money — $82M for each of Canada's 13 games.", src: ["S_PBO", "S_CBC_PBO"] },
    { label: "U.S. federal security grants (FEMA)", value: 846, unit: "USD millions", basis: "fact",
      note: "FEMA handed out $846M — including a $625M FIFA World Cup Grant Program — to lock down 11 U.S. host cities.", src: ["S_FEMA", "S_ESPN_FUND"] },
    { label: "11 U.S. host cities' collective shortfall", value: 250, unit: "USD millions", basis: "projection",
      note: "Fortune: cities carry the costs while FIFA — running this tournament itself — keeps essentially all the revenue. Cities get no cut of tickets, concessions, merch or parking.", src: ["S_FORTUNE_PAY", "S_PROPUBLICA"] },
    { label: "Foxborough's public-safety bill", value: 7.8, unit: "USD millions", basis: "fact",
      note: "Local taxpayers flatly refused to pay; a Kraft-backed entity picked up the ~$7.8M tab.", src: ["S_STATELINE"] }
  ],
  /* The tournament arrived. The windfall didn't. [fact] */
  reality: {
    title: "Half-time economics: the boom that didn't show",
    items: [
      { n: "+3%", l: "Toronto bar & restaurant spending during the first two weeks — versus a $380M bill", cls: "red", src: ["S_CP24_TOR"] },
      { n: "72%", l: "Toronto hotel occupancy in week one, down from 88% a year earlier", cls: "red", src: ["S_CP24_TOR"] },
      { n: "80%", l: "of hotels in the 11 U.S. host cities reported bookings under forecast", cls: "amber", src: ["S_CFR"] },
      { n: "12 / 14", l: "of the last 14 World Cups produced net economic losses for their hosts", cls: "red", src: ["S_FORTUNE_PAY"] }
    ],
    quote: "The net contribution from hosting large-scale events like the Olympics or the World Cup is pretty close to zero.",
    quoteWho: "Moshe Lander, sports economist, Concordia University", quoteSrc: ["S_CP24_TOR"],
    note: "Vancouver's budget hostels sat half-empty in June; a luxury hotel reported occupancy 20–25% below a normal June. The province still projects a $1B+ visitor windfall — over five years.", noteSrc: ["S_CBC_HOTELS"]
  },
  // "What $846M of stadium security could have bought instead" — moral framing
  alternatives: {
    pot: 846, potLabel: "the U.S. federal security grant", currency: "USD millions", basis: "modeled",
    items: [
      { off: "Stadium security & surveillance", on: "People housed for a year", math: v => Math.round(v*1e6 / 30000), unit: "people", ref: "supportiveHousingYear" },
      { off: "Stadium security & surveillance", on: "Nurses' annual salaries", math: v => Math.round(v*1e6 / 86000), unit: "nurses", ref: "nurseSalaryYear" },
      { off: "Stadium security & surveillance", on: "Teachers' annual salaries", math: v => Math.round(v*1e6 / 66000), unit: "teachers", ref: "teacherSalaryYear" }
    ],
    note: "Illustrative swaps: the security grant divided by real per-unit costs. Cities don't actually get this choice — that's the point.",
    src: ["S_FEMA"]
  },
  tickets: {
    advertisedLow: 60, officialFinalMax: 6730, dynamicCat1: 32970, resaleFinalAvg: 12483,
    serviceFeePct: 15, euComplaintDate: "2026-03-24", basis: "fact",
    note: "Advertised 'from $60'. Dynamic pricing marched Front-Category Final seats to $32,970 on FIFA's own portal, resale peaked at a $12,483 average, and FIFA takes a 30% commission on every resale — a marketplace it chose not to price-cap. The knockouts brought a 39% resale collapse in a week as FIFA dumped 10,000+ tickets onto its own exchange; Category-1 Final listings still run $15,000–$38,000.",
    src: ["S_WCPASS", "S_GOAL_DYN", "S_BRIT_TIX", "S_LSE_TIX", "S_NW_TIX", "S_GOAL_FINAL"]
  },
  /* Who's investigating the ticket machine [fact] */
  probes: [
    { who: "New York & New Jersey", what: "AGs subpoenaed FIFA: prices raised on 90+ of 104 matches (average +34%), and new premium 'Front Categories' carved out of seats fans had already bought — quietly downgrading early buyers.",
      quote: "FIFA has turned buying a ticket to the World Cup into a gauntlet of confusion, fake scarcity, and impossibly high prices.", quoteWho: "NJ Attorney General Davenport", src: ["S_NYAG"] },
    { who: "Texas", what: "A parallel investigation under the state's Deceptive Trade Practices Act into the same seat-reclassification play at Arlington and Houston matches.", src: ["S_TXAG"] },
    { who: "California", what: "AG Bonta's formal inquiry into how seat categories were marketed versus what buyers actually got at SoFi and Levi's Stadium — together the broadest consumer-protection action ever aimed at a World Cup.", src: ["S_CAAG"] },
    { who: "Brussels", what: "Football Supporters Europe & Euroconsumers' EU complaint (filed 24 March) is still awaiting a Commission response; MEPs have tabled written questions while the Digital Fairness Act review looms.", src: ["S_GOAL_DYN", "S_LSE_TIX"] },
    { who: "S.D.N.Y. (StubHub)", what: "A proposed class action filed 30 June over cancelled and never-delivered World Cup tickets — one plaintiff paid $1,905, then waited at the stadium for seats that never arrived.", src: ["S_CBC_STUB"] }
  ],
  framing: {
    text: "The pitch to cities: a once-in-a-generation windfall. The delivery: security bills, infrastructure costs and a FIFA-demanded sales-tax break — while FIFA keeps the tournament revenue. Three weeks in, the reality-check numbers are arriving, and they look the way economists said they would.",
    src: ["S_PROPUBLICA", "S_ITEP", "S_BRIT_ECON", "S_FORTUNE_PAY"]
  }
};

/* -------------------------------------------------------------------------- */
/*  INFANTINO — the "Man of the Match" squad card                            */
/* -------------------------------------------------------------------------- */
const INFANTINO = {
  pay2025:    { value: 6.0, basis: "fact", src: ["S_ESPN_PAY"] },
  baseSalary: { value: 3.3, basis: "fact", src: ["S_ESPN_PAY", "S_FIFA_COMP"] },
  bonus2025:  { value: 2.78, basis: "fact", src: ["S_ESPN_PAY"] },
  schooling:  { value: 5000, basis: "fact", src: ["S_BDAY"] },
  // squad-card "season stats"
  statline: [
    { k: "2025 pay package", v: "$6.0M", sub: "$3.3M salary + a $2.78M bonus (up 33%) after the first Club World Cup.", src: ["S_ESPN_PAY"], est: false },
    { k: "Miles by 1 July", v: "39,005", sub: "ESPN's running tally of the presidential tour, three weeks in. The plan: two games a day, by private jet.", src: ["S_ESPN_TOUR"], est: false },
    { k: "Private-jet flights", v: "27", sub: "In the group stage alone — BBC Verify tracked a FIFA-linked jet to every city where he was photographed in the stands.", src: ["S_BBC_JET"], est: false },
    { k: "Fortnight of CO₂e", v: "516t", sub: "Roughly what 78 average people emit in an entire year. From one man's group stage.", src: ["S_BBC_JET"], est: false },
    { k: "Tickets gifted to Trump", v: "$15k", sub: "Ten Club World Cup final tickets, per Trump's own financial disclosure. Trump presents the trophy on 19 July.", src: ["S_CNBC_TRUMP"], est: false },
    { k: "MEPs demanding a probe", v: "50", sub: "An ethics investigation over the 'FIFA Peace Prize' Infantino handed Trump at the December draw.", src: ["S_IRISH_MEP"], est: false }
  ],
  /* BBC Verify / BBC Sport jet-tracking investigation, 28 June 2026 [fact] */
  jet: {
    basis: "fact", src: ["S_BBC_JET"],
    aircraft: "Gulfstream G650ER (Qatar Airways Executive)",
    flights: 27, matches: 24, miles: 31144, km: 50122, hoursInAir: 66,
    co2eTonnes: 516, personYearsEquiv: 78, fuelLitresPerHour: 1817, seats: 19,
    bigStats: [
      { n: "27", l: "flights during the group stage", cls: "red" },
      { n: "31,144", l: "miles flown — 1.25× around the Earth", cls: "red" },
      { n: "66+", l: "hours in the air in ~16 days", cls: "amber" },
      { n: "516t", l: "CO₂e — a year's emissions for 78 people", cls: "red" }
    ],
    itinerary: [
      { d: "13 June", t: "Vancouver → Miami. 2,800 miles home to bed after watching Australia–Türkiye." },
      { d: "15 June", t: "Miami → Seattle (2,700 mi) for Belgium–Egypt, then → Los Angeles (960 mi) for Iran–New Zealand. One man, one day, ~3,700 miles." },
      { d: "22 June", t: "Philadelphia → Teterboro, NJ — 92 miles, by private jet — for a Fox News interview. Then on to matches in Boston and Toronto." },
      { d: "26 June", t: "Miami → Dallas → Seattle for Egypt–Iran, wheels-up again five hours later, 2,700 miles back to Miami overnight." }
    ],
    hypocrisy: {
      pledge: "Whether we speak about climate, human rights, diseases or disabilities, we are committed to play our part.",
      pledgeWho: "Gianni Infantino, FIFA's 2026 sustainability & human rights strategy",
      response: "Sometimes travel is organised on commercial [including low-cost] airlines and sometimes it is on private charter, depending on which is more efficient and cost-effective under the circumstances.",
      responseWho: "FIFA representative, to BBC Sport",
      unanswered: "The BBC asked FIFA whether any flights were commercial, how many people ride the jet, and whether the emissions are offset. FIFA did not respond."
    },
    quotes: [
      { q: "Symptomatic of FIFA's failings on the environment and sustainability… completely at odds with the level of leadership that we need to see at the top of FIFA.", who: "Freddie Daley, Cool Down / Sussex University" },
      { q: "Private jets are five to 14 times more polluting than commercial planes and 50 times more than trains.", who: "Denise Auclair, Transport & Environment" }
    ],
    context: "At Qatar 2022 he attended all 64 matches — the stadiums were an hour's drive apart. In 2023 a Swiss regulator ruled FIFA had 'made false statements' calling that tournament carbon-neutral. FIFA has since pledged a 50% emissions cut by 2030 and net-zero by 2040. Then the group stage started. By 1 July, ESPN had the tour at 39,005 miles and counting — carbon accountants at Greenly project 300–500 further tonnes of CO₂ if the two-cities-a-day pace holds through the final.",
    contextSrc: ["S_BBC_JET", "S_ESPN_TOUR", "S_AFP_JET"]
  },
  /* Off-the-pitch conduct file — new items from late June / early July [fact] */
  offBall: [
    { tag: "The phone call", title: "A red card, reviewed by the White House",
      body: "US striker Folarin Balogun saw red against Bosnia. Trump phoned Infantino and asked FIFA to 'review' it. That Sunday, FIFA's Disciplinary Committee suspended the automatic ban — the first World Cup red-card reversal since 1962. UEFA: FIFA 'crossed a red line — unprecedented, incomprehensible and unjustifiable'. Belgium's appeal was ruled 'inadmissible'. Infantino insists FIFA's judicial bodies are independent.", src: ["S_ALJ_BALOGUN", "S_ESPN_CALL", "S_NPR_UEFA"] },
    { tag: "The gift", title: "$15,000 in tickets for Trump",
      body: "Trump's annual financial disclosure, released 30 June, lists ten Club World Cup final tickets worth $15,000 — given by Infantino personally. On 23 June, on Fox News, Infantino announced Trump will help present the World Cup trophy on 19 July.", src: ["S_CNBC_TRUMP"] },
    { tag: "The letter", title: "50 MEPs demand an ethics investigation",
      body: "On 29 June, 50 members of the European Parliament wrote to Infantino and the FIFA Council demanding an Ethics Committee investigation over the 'FIFA Peace Prize' he presented to Trump at the December draw — in a tournament they called 'mired in controversy, from high ticket prices to visa issues'.", src: ["S_IRISH_MEP"] },
    { tag: "The complaint", title: "'The biggest complaint FIFA has ever received'",
      body: "Governance group FairSquare's 'Reboot FIFA' campaign is collecting a public, class-action-style ethics complaint alleging four distinct violations of FIFA's political-neutrality rules — to be filed the moment the tournament ends.", src: ["S_FAIRSQ"] }
  ],
  runningTallyProjection: {
    basis: "projection", perDayUSD: 82000,
    note: "Illustrative model of daily private-jet, security-detail and entourage cost across the tournament window. Not an audited figure — a back-of-envelope for scale.",
    src: ["S_BBC_JET", "S_WIKI_GI", "S_HITC", "S_BDAY"]
  }
};

/* ==========================================================================
   CONTENT FOR THE REMAINING SEVEN MODULES
   ========================================================================== */

/* --- 08 · SCANDAL TIMELINE ------------------------------------------------ */
const SCANDALS = [
  { date: "Nov 2013", tag: "guilty plea", title: "Chuck Blazer flips",
    body: "The former CONCACAF exec pleads guilty to 10 charges — wire fraud, money laundering, tax offences — and starts wearing a wire for the FBI.", src: ["S_FIFAGATE"] },
  { date: "27 May 2015", tag: "dawn raid", title: "The Zurich arrests",
    body: "Plain-clothes police walk seven FIFA officials out of a luxury hotel two days before the FIFA Congress. The U.S. DOJ unseals a 47-count indictment alleging $150M+ in bribes over two decades.", src: ["S_DOJ", "S_FIFAGATE"] },
  { date: "Oct 2015", tag: "banned", title: "Blatter & Platini fall",
    body: "FIFA president Sepp Blatter and UEFA's Michel Platini are suspended, then banned, over a $2M payment. An era ends under caution.", src: ["S_FIFAGATE"] },
  { date: "3 Dec 2015", tag: "round two", title: "Sixteen more indicted",
    body: "A superseding U.S. indictment charges another 16 officials. FIFAgate is now the biggest corruption case in the sport's history.", src: ["S_DOJ", "S_FIFAGATE"] },
  { date: "Feb 2016", tag: "new boss", title: "Enter Gianni Infantino",
    body: "Infantino is elected president on a reform ticket. He will later run unopposed, move toward Miami, and take a $6M pay package.", src: ["S_WIKI_GI"] },
  { date: "Apr 2020", tag: "the votes", title: "Bribes tied to 2018 & 2022 hosts",
    body: "A U.S. indictment alleges bribes were paid to secure World Cup hosting votes for Russia (2018) and Qatar (2022).", src: ["S_FIFAGATE"] },
  { date: "2024", tag: "sportswash", title: "Aramco signs on",
    body: "FIFA makes Saudi Aramco — the world's single largest corporate greenhouse-gas emitter — a major worldwide partner, reportedly ~$100M/year.", src: ["S_IWF_ARAMCO", "S_FOSSILFREE"] },
  { date: "Dec 2025", tag: "the prize", title: "A 'FIFA Peace Prize' for Trump",
    body: "At the World Cup draw in Washington, Infantino personally presents Trump with a newly invented FIFA Peace Prize. Governance group FairSquare files an ethics complaint alleging violations of FIFA's political-neutrality rules — and starts collecting 'the biggest complaint FIFA has ever received'.", src: ["S_FAIRSQ"] },
  { date: "Dec 2025", tag: "quietly dropped", title: "DOJ walks away from FIFAgate",
    body: "Six months before the U.S. hosts the World Cup, prosecutors move to drop the bribery case against an ex-Fox executive and Full Play Group — one of the last FIFAgate prosecutions standing.", src: ["S_PBS_DROP", "S_SANDC_DOJ"] },
  { date: "Mar 2026", tag: "the fans", title: "Ticket revolt reaches Brussels",
    body: "Football Supporters Europe & Euroconsumers file an EU complaint over dynamic pricing that pushed Final seats toward $33,000. As of July, the Commission hasn't responded.", src: ["S_GOAL_DYN", "S_LSE_TIX"] },
  { date: "May 2026", tag: "subpoenaed", title: "New York & New Jersey subpoena FIFA",
    body: "State AGs open an investigation into the ticket machine: prices raised on 90+ of 104 matches, and premium 'Front Categories' carved out of seats fans had already bought. Texas follows with its own deceptive-trade-practices probe in June.", src: ["S_NYAG", "S_TXAG"] },
  { date: "2026", tag: "the state", title: "ICE 'a key part' of security",
    body: "As the tournament kicks off, ICE says its agents will play 'a key part' in security; 120+ rights groups issue a U.S. travel advisory. A dedicated ICE operation runs in New York/New Jersey for the length of the tournament.", src: ["S_CONVERSATION", "S_AMNESTY", "S_CTM_ICE"] },
  { date: "Jun 2026", tag: "integrity", title: "Spot-fixing suspicions reach the pitch",
    body: "Two players from different nations are referred to their federations over yellow-card spot-fixing suspicions — flagged by betting spikes on the booking markets. Tournament betting is projected at $50 billion.", src: ["S_YAHOO_FIX"] },
  { date: "29 Jun 2026", tag: "the letter", title: "50 MEPs demand an Infantino investigation",
    body: "Members of the European Parliament formally call on FIFA's Ethics Committee to investigate the president over the Trump peace prize, in a tournament they describe as 'mired in controversy'.", src: ["S_IRISH_MEP"] },
  { date: "5 Jul 2026", tag: "the red line", title: "Trump calls. FIFA folds.",
    body: "Trump phones Infantino about the USA's Balogun red card; FIFA's 'independent' Disciplinary Committee suspends the ban — the first World Cup red-card reversal since 1962. UEFA says FIFA 'crossed a red line'; Blatter, of all people, notes red cards 'are not overturned by political phone calls'. The US loses 4–1 anyway.", src: ["S_ALJ_BALOGUN", "S_ESPN_CALL", "S_NPR_UEFA"] }
];

/* --- 05 · FIFA FINANCE ---------------------------------------------------- */
const FINANCE = {
  revenueEventB: 8.9, cycleRevenueB: 13, budgetB: 3.76, reserves2024B: 4.76, taxExemptSince: 1994,
  stats: [
    { n: "$9B", l: "FIFA revenue expected from this one tournament — of a record $13B cycle", src: ["S_BIZMODEL", "S_FORBES_NUM"], est: false },
    { n: "$871M", l: "Total prize pot — doubled from Qatar; $50M to the winner", src: ["S_FORBES_NUM"], est: false },
    { n: "1994", l: "Tax-exempt in the U.S. since", src: ["S_BIZMODEL"], est: false },
    { n: "$4.76B", l: "FIFA reserves & cash, end of 2024", src: ["S_BIZMODEL"], est: false }
  ],
  taxItems: [
    { k: "U.S. federal", v: "Exempt", sub: "All 48 participating associations can seek 501(c)(3) exemption on tournament earnings after down-to-the-wire Treasury lobbying.", src: ["S_KPMG_TAX", "S_GLOBALTREAS"] },
    { k: "Mexico federal", v: "Exempt", sub: "FIFA and its corporate affiliates got a blanket exemption from Mexican federal taxes. All of them. For everything.", src: ["S_BIZMODEL"] },
    { k: "Host-city sales tax", v: "Waived", sub: "FIFA demanded sales-tax breaks on tickets — millions in revenue host cities never see.", src: ["S_ITEP"] }
  ],
  quote: "FIFA is best understood as a single-event rights business wearing the legal clothing of a non-profit — and the non-profit status keeps it tax-favoured.",
  quoteSrc: ["S_BIZMODEL"],
  // revenue vs the public bill it sits beside
  vs: { revenue: 8900, publicUS: 846, publicCanada: 1000, note: "FIFA's event revenue dwarfs the public security bills cities are left holding.", src: ["S_BIZMODEL", "S_FEMA", "S_CBC_PBO"] }
};

/* --- 07 · SPORTSWASHING / SPONSORS ---------------------------------------- */
const SPONSORS = [
  // Flagged (sourced) controversies first
  { name: "Aramco", tier: 1, role: "Energy partner (~$100M/yr)",
    controversy: "Saudi state oil giant — the single largest corporate GHG emitter (≈4.8% of global emissions, 2016–22). UN experts warn FIFA risks platforming 'greenwashing'; 130+ professional women footballers signed an open letter demanding FIFA drop the deal, and 72% of fans polled agree. Experts' summary of the deal's purpose: keep the conversation on football — 'not Yemen, not human rights, not Jamal Khashoggi'.", level: "red", src: ["S_IWF_ARAMCO", "S_FOSSILFREE", "S_CBC_ARAMCO", "S_MARKETPLACE"] },
  { name: "Qatar Airways", tier: 1, role: "Official airline",
    controversy: "State carrier of Qatar, whose 2022 World Cup build was dogged by migrant-worker deaths and abuse. Also the airline behind Infantino's private-jet hops.", level: "red", src: ["S_BHRRC", "S_HITC"] },
  { name: "Coca-Cola", tier: 1, role: "Beverage partner",
    controversy: "Named the world's #1 branded plastic polluter for six consecutive years in Break Free From Plastic's global brand audits. As the tournament kicked off, the 'Kick Big Soda Out' campaign — 97 health organisations, 522,000+ supporters — wrote to Infantino demanding FIFA end the deal: 'using the power of football to normalise unhealthy products'.", level: "amber", src: ["S_BFFP", "S_HPW_SODA"] },
  { name: "Anheuser-Busch InBev", tier: 2, role: "Beer partner (Budweiser)",
    controversy: "Pays a reported ~$75M per tournament for exclusive beer rights — then watched Qatar ban stadium beer two days before kickoff. Budweiser's since-deleted reply: 'Well, this is awkward.'", level: "amber", src: ["S_FORBES_BEER"] },
  { name: "Visa", tier: 1, role: "Payments partner",
    controversy: "Named alongside Coca-Cola when workers' groups asked FIFA's sponsors to lean on Qatar over labour conditions. Responded; criticised anyway for the pace.", level: "amber", src: ["S_BHRRC"] },
  { name: "Airbnb", tier: 3, role: "Regional partner",
    controversy: "Short-term-rental platform sponsoring the event as its own listings drive host-city rents and prices skyward (see Housing).", level: "amber", src: ["S_FORTUNE_AIRBNB"] },
  // The rest of the official commercial family (no specific controversy flagged here)
  { name: "Adidas", tier: 1, role: "Kit & match-ball partner", controversy: "", level: "none", src: [] },
  { name: "Hyundai · Kia", tier: 1, role: "Mobility partner",
    controversy: "Protesters in Guadalajara accused Hyundai of using its World Cup sponsorship as 'greenwashing through sports' to draw attention away from what they called a dirty supply chain.", level: "amber", src: ["S_BHRRC_HYU"] },
  { name: "Lenovo", tier: 1, role: "Technology partner", controversy: "", level: "none", src: [] },
  { name: "McDonald's", tier: 2, role: "Restaurant partner", controversy: "", level: "none", src: [] },
  { name: "Bank of America", tier: 2, role: "Official bank", controversy: "", level: "none", src: [] },
  { name: "Verizon", tier: 2, role: "Telecom partner", controversy: "", level: "none", src: [] },
  { name: "Frito-Lay", tier: 2, role: "Snacks partner", controversy: "", level: "none", src: [] },
  { name: "Mengniu", tier: 2, role: "Dairy partner", controversy: "", level: "none", src: [] },
  { name: "Unilever", tier: 2, role: "Personal-care partner", controversy: "", level: "none", src: [] },
  { name: "Hisense", tier: 2, role: "Electronics partner", controversy: "", level: "none", src: [] },
  { name: "The Home Depot", tier: 3, role: "Regional partner", controversy: "", level: "none", src: [] },
  { name: "Diageo", tier: 3, role: "Spirits partner", controversy: "", level: "none", src: [] },
  { name: "American Airlines", tier: 3, role: "Regional partner", controversy: "", level: "none", src: [] },
  { name: "Valvoline", tier: 3, role: "Regional partner", controversy: "", level: "none", src: [] },
  { name: "Rock-It Cargo", tier: 3, role: "Logistics partner", controversy: "", level: "none", src: [] }
];

/* --- 04 · POLICING & SURVEILLANCE ----------------------------------------- */
const POLICING = {
  securityText: "The U.S. government funnelled more than $1 billion to World Cup security — for transit hubs, stadiums and the areas around them.",
  securitySrc: ["S_CONVERSATION", "S_FEMA"],
  iceArrests167k: { value: "167,000+", note: "People arrested by ICE in and around the 11 U.S. host cities between January 2025 and March 2026 — the backdrop Human Rights Watch cited when it called for an 'ICE Truce' modelled on the Olympic Truce.", src: ["S_HRW_ICE"] },
  facialRec: [
    { city: "Boston", venue: "Gillette Stadium" },
    { city: "Miami", venue: "Hard Rock Stadium" },
    { city: "Atlanta", venue: "Mercedes-Benz Stadium" }
  ],
  facialRecNote: "Stadiums rolled out AI facial recognition for entry and payments — collecting biometrics of everyone in and around them. Since kick-off it's grown a menagerie: camera-equipped robot dogs patrol the Dallas and New Jersey stadiums, law-enforcement drones can monitor from 60,000 feet, and Seattle reactivated and expanded a CCTV network it had previously shut down over biometric-privacy concerns.",
  facialRecSrc: ["S_CONVERSATION", "S_GADGET", "S_TNW"],
  ice: "ICE said its agents would play 'a key part' in tournament security — and a new ICE operation began 13 June in New York/New Jersey, running to the end of the tournament. Los Angeles was assured civil enforcement wouldn't touch its matches; the sheriff passed along the caveat that the assurance was 'subject to change'. The precedent fans weigh: at the 2025 Club World Cup final, an asylum seeker attending with his two children was arrested over a family-photo drone, handed to ICE, detained three months and deported.",
  iceSrc: ["S_CONVERSATION", "S_CTM_ICE", "S_ALJ_NOICE", "S_HRW_CWC"],
  advisoryGroups: 120,
  advisoryRisks: ["Invasive social-media screening", "Searches of electronic devices", "Racial profiling", "Arrest & detention", "Deportation", "Even death"],
  advisorySrc: ["S_AMNESTY", "S_ACLU"],
  /* Who the border actually stopped once the tournament arrived [fact] */
  border: {
    note: "The travel advisory warned fans. It turned out to apply to the tournament's own participants:",
    items: [
      { who: "Aymen Hussein", role: "Iraq striker", what: "Detained ~7 hours at Chicago O'Hare, phone inspected; the team photographer was held 10+ hours and denied entry outright." },
      { who: "Omar Artan", role: "FIFA-accredited referee (Somalia)", what: "Turned away at Miami despite a valid visa and diplomatic passport — CBP cited 'vetting concerns'. He never officiated." },
      { who: "Senegal & Uzbekistan squads", role: "Full delegations", what: "Individually searched on arrival; narcotics dogs run over luggage and pre-stadium inspections." },
      { who: "Senegalese & Ivorian fans", role: "Supporters' associations", what: "Visa rejections en masse — Senegal is at its first World Cup of four with no home-based supporters present. 'They do not want to see their supporters.'" },
      { who: "Accredited journalists", role: "Press (Iran, multiple African nations)", what: "AIPS: 'many' regularly accredited colleagues denied visas or limited to single-entry — 'a long-standing and unacceptable problem'." }
    ],
    src: ["S_WAPO_ENTRY", "S_AFP_VISA", "S_JPOST_PRESS"]
  },
  quotes: [
    { q: "Security is often used as an excuse for agendas that have nothing to do with security at all.", who: "Jay Stanley, ACLU", src: ["S_CONVERSATION"] },
    { q: "Surveillance is infrastructure — it will outlast the current World Cup.", who: "Matthew Guariglia, EFF", src: ["S_CONVERSATION"] }
  ]
};

/* --- 03 · DISPLACEMENT & HOUSING ------------------------------------------ */
const DISPLACEMENT = {
  airbnbBefore: 216, airbnbAfter: 450, hotelSurgePct: 300, princetonNight: 6000,
  airbnbSrc: ["S_FORTUNE_AIRBNB", "S_AIRROI"],
  /* Tournament-window rental data, refreshed [fact] */
  gouging: {
    items: [
      { n: "+109%", l: "16-city average Airbnb rate for the tournament window, year over year ($216 → $450)", cls: "red", src: ["S_AIRROI"] },
      { n: "$554", l: "Vancouver's booked average per night — highest of all 16 hosts, up 81%", cls: "amber", src: ["S_AIRROI"] },
      { n: "+387%", l: "Monterrey's premium for one group match vs. the same date last year", cls: "red", src: ["S_AIRROI"] },
      { n: "50%", l: "occupancy at Vancouver's budget hostels in June — normally 90%+. Gouging met weak demand and won anyway.", cls: "amber", src: ["S_CBC_HOTELS"] }
    ]
  },
  beautification: "FIFA requires host cities to carry out 'beautification'. Vancouver's two-kilometre event zone around BC Place runs the length of the tournament over the Downtown Eastside. The host committee pledged no street sweeps — then city workers cleared tents and shelters along East Hastings mid-tournament while bylaw officers kept enforcing the daytime camping ban. The city's offer to residents: five temporary 'viewing and service' spaces, on five match days, for 50–160 people each.",
  beautificationSrc: ["S_PRISM", "S_AMNESTY", "S_VANSUN_DTES"],
  house: { city: "Atlanta", text: "Atlanta's 'Downtown Rising' plan raised $185M toward $235M and housed ~490 people before kick-off — against roughly 1,000 sleeping unsheltered nightly. A Fulton County judge warned the plan could produce arrests 'solely to make the city look nice'.", src: ["S_JAPANTODAY", "S_SHELTERFORCE"] },
  sweep: { city: "1996 precedent", text: "Hosting the '96 Olympics, Atlanta removed ~9,000 homeless people — detention, one-way bus tickets, 'Operation Olympus'. Ahead of Paris 2024, migrants were bused out until the Games ended.", src: ["S_JAPANTODAY"] },
  quote: "An event like FIFA doesn't feel inviting for people like us.",
  quoteWho: "Shawn Hefele, unhoused Downtown Eastside resident", quoteSrc: ["S_VANSUN_DTES"]
};

/* --- 02 · LABOUR ---------------------------------------------------------- */
const LABOR = {
  wages: [
    { lab: "Some hospitality staff, now", v: 10, cls: "red" },
    { lab: "Sheraton Philly strikers, now", v: 22, cls: "amber" },
    { lab: "Union demand / Philly wins", v: 30, cls: "green" },
    { lab: "Stadium cooks' union win", v: 40, cls: "green" }
  ],
  wageNote: "Long-time stadium hospitality workers earn as little as $10/hr. The mid-tournament fight is over $30: Philadelphia hotel workers struck for a $30/hr minimum by 2028 — and several hotels buckled. A union deal will lift some stadium cooks toward $40.",
  wageSrc: ["S_WHYY", "S_PBS_STADIUM", "S_INQ_STRIKE"],
  heat: "This is no longer a forecast: six of the first 24 matches were played at wet-bulb temperatures scientists class as dangerous, and workers are on site hours before kickoff through the hottest part of the day. Of the host states, only California and Washington have enforceable occupational heat standards — Florida and Texas prohibit their own cities from enacting any.",
  heatSrc: ["S_BHRRC_HEAT", "S_NYU_HEAT"],
  checks: "FIFA requires workers to submit to background checks that divulge immigration status as a condition of working — a privacy and enforcement flashpoint.",
  checksSrc: ["S_UNITEHERE"],
  /* Strike ledger — what actually happened once the whistle blew [fact] */
  strikes: [
    { tag: "Averted", city: "Los Angeles · SoFi Stadium", text: "2,000 food-service workers voted 96% to strike, then ratified a deal 99% the day before SoFi's first match — including the contractual right to walk off the job if ICE enters their workplace during a World Cup match.", src: ["S_NPR_SOFI", "S_PROSPECT"] },
    { tag: "Won", city: "Philadelphia · Sheraton Downtown", text: "About 200 workers walked out on 21 June, mid-tournament, timed to Philadelphia's matches — $22/hr, contractless since 2024. Nine days later they won: a path to a $30/hr minimum by 2028, lighter housekeeping quotas and better pensions. Hilton, Wyndham and Warwick properties settled around them.", src: ["S_INQ_STRIKE", "S_PHILLYVOICE"] },
    { tag: "Threatened", city: "Seattle · Embassy Suites", text: "94% of union members at Embassy Suites Pioneer Square voted to authorize a strike as the tournament opened.", src: ["S_TRAVELWK"] }
  ],
  strikeNote: "The through-line in every dispute: wages that don't cover rent in a host city, and a demand for protection from the immigration enforcement guarding the party.",
  strikeSrc: ["S_PROSPECT"]
};

/* --- 11 · MATCH REPORT — what actually happened once the whistle blew ------ */
const MATCHREPORT = {
  intro: "Four weeks of tournament. Here's the incident log FIFA's highlight reels skip — every entry sourced.",
  incidents: [
    { d: "5 Jul", tag: "the red line", title: "A red card, overturned by phone",
      body: "Trump called Infantino about Balogun's red card against Bosnia. FIFA's Disciplinary Committee suspended the automatic ban — the first World Cup red-card reversal since 1962. UEFA: 'unprecedented, incomprehensible and unjustifiable.' Belgium's appeal was ruled inadmissible. Belgium then won 4–1 with Balogun on the pitch.", src: ["S_ALJ_BALOGUN", "S_ESPN_CALL", "S_NPR_UEFA"] },
    { d: "4 Jul", tag: "heat", title: "The second-hottest World Cup match ever played",
      body: "Paraguay–France kicked off in Philadelphia at around 100°F under a heat dome — medics treated ~10 people at the fan fest. Scientists call FIFA's heat protocols 'inadequate' and 'impossible to justify': FIFPRO wants matches delayed at 28°C wet-bulb; FIFA's threshold is 32°C. The fix on offer is two three-minute water breaks — run even in air-conditioned stadiums, booed 'like clockwork', and, as Alan Shearer put it: 'It's not for player welfare. It's for adverts.'", src: ["S_AP_HEAT", "S_WHYY_JULY4", "S_BGLOBE_BREAKS"] },
    { d: "30 Jun", tag: "tragedy", title: "Four dead celebrating a win",
      body: "After Mexico beat Ecuador, crowd crushes along Paseo de la Reforma killed four fans — three by asphyxiation, one by cardiac arrest. For the England match the city doubled police to 6,000, capped the Angel of Independence at 25,000 and banned street alcohol; the Attorney General opened an investigation.", src: ["S_ESPN_CRUSH", "S_ESPN_MEXSEC"] },
    { d: "11 Jun", tag: "kick-off", title: "Tear gas at the opening ceremony",
      body: "Outside the Azteca, riot police met protesters — many of them relatives of Mexico's disappeared — with batons, shields and tear gas as they tried to reach the stadium perimeter. Inside: Shakira. The Zócalo fan zone maxed out at 50,000.", src: ["S_GULF_AZTECA"] },
    { d: "12 Jun", tag: "heat", title: "110 heat casualties at one fan festival",
      body: "Houston's fan-fest opening day, in the low-to-mid 90s°F: 110 heat-related medical incidents, four hospitalisations. The county judge says her requests to bolster heat preparations were mostly ignored.", src: ["S_FOXWX_HOU"] },
    { d: "~7 Jun", tag: "the u-turn", title: "FIFA banned water bottles. In this heat.",
      body: "Days before kick-off — with 90°F+ forecasts — FIFA banned fans' water bottles from stadiums. Fan groups called it 'just the latest money grab'. FIFA reversed after the backlash: one sealed 20oz disposable bottle each, reusables still banned.", src: ["S_ESPN_WATER"] },
    { d: "13 Jun", tag: "transit", title: "Commuters stranded for the shuttle lanes",
      body: "For Brazil–Morocco at MetLife, streets around Penn Station closed and NJ Transit was largely reserved for ticket holders. Regular commuters were stranded for hours between contradictory police directions.", src: ["S_NW_TRANSIT"] },
    { d: "18–30 Jun", tag: "heat", title: "Playing through the danger zone",
      body: "Six of the first 24 matches were played at wet-bulb temperatures classed as dangerous. A knockout game in Arlington kicked off at noon in 91°F; Kansas City and Philadelphia knockouts face heat indices of 110°F. FIFA's remedy: two three-minute water breaks — which broadcasters filled with commercials.", src: ["S_NYU_HEAT", "S_ALJ_HEAT"] },
    { d: "23 Jun", tag: "tragedy", title: "A death at a fan screening in Amman",
      body: "A crowd surge at a public screening of Jordan's group match in Hashemite Plaza killed one person and injured eight, at the country's first-ever World Cup.", src: ["S_ABC_AMMAN"] },
    { d: "~29 Jun", tag: "piracy", title: "The largest sports-piracy takedown in U.S. history",
      body: "The DOJ seized nearly 400 domains streaming World Cup matches — five times the Qatar 2022 haul. Many of the sites doubled as malware and credential-harvesting operations.", src: ["S_GIZ_PIRACY"] },
    { d: "Jun", tag: "integrity", title: "Yellow cards, suspicious markets",
      body: "Two players referred over spot-fixing suspicions after betting spikes on their bookings — one apparently engineered a suspension before a convenient fixture. FIFA restates its 'zero-tolerance policy'.", src: ["S_YAHOO_FIX"] },
    { d: "ongoing", tag: "the stands", title: "99.4% full — and half a stadium of no-shows",
      body: "Official group-stage occupancy hit 99.4% — of tickets scanned. Broadcasts kept showing empty premium blocks; volunteers were used to fill hospitality seats on camera. The record demand is real. So are the fans priced out of it.", src: ["S_SI_SEATS", "S_CFR"] }
  ]
};

/* --- 09 · HOST-CITY DOSSIERS ---------------------------------------------- */
/* Concise, real-where-documented notes. Shared pressures noted where city-   */
/* specific reporting is thin, and labelled as such.                          */
const CITY_DOSSIERS = {
  van: { bill: "Public cost up to ~$729M (CAD) — nearly triple the 2022 estimate. Budget hostels sat half-empty in June anyway.", flags: ["2-km event zone over the Downtown Eastside", "East Hastings tents cleared mid-tournament despite a no-sweeps pledge", "Booked Airbnbs at $554/night — highest of all 16 hosts"], src: ["S_GLOBAL_VAN", "S_VANSUN_DTES", "S_AIRROI", "S_CBC_HOTELS"] },
  tor: { bill: "Costs climbed from a promised $45M to ~$380M (CAD). The payoff so far: bar & restaurant spending up 3%, hotel occupancy down 16 points.", flags: ["Part of Canada's $1,066M taxpayer bill (PBO)", "$10 admission charged for the city's own fan festival"], src: ["S_STATELINE", "S_PBO", "S_CP24_TOR"] },
  atl: { bill: "Shares U.S. federal security grants; 'Downtown Rising' housed ~490 people pre-tournament — of ~1,000 sleeping unsheltered nightly.", flags: ["Facial recognition at Mercedes-Benz Stadium", "Judge warned the plan could produce arrests 'solely to make the city look nice'", "1996 Olympics displaced ~9,000"], src: ["S_JAPANTODAY", "S_SHELTERFORCE", "S_CONVERSATION"] },
  mia: { bill: "Surge pricing among the steepest; airport & hotel workers fighting for $25/hr.", flags: ["Facial recognition at Hard Rock Stadium", "First match played under an extreme-heat warning", "Infantino's adopted base"], src: ["S_CONVERSATION", "S_WHYY", "S_NYU_HEAT", "S_WIKI_GI"] },
  bos: { bill: "Foxborough's ~$7.8M public-safety bill; taxpayers refused, a Kraft-backed entity paid.", flags: ["Facial recognition at Gillette Stadium"], src: ["S_STATELINE", "S_CONVERSATION"] },
  la:  { bill: "SoFi's 2,000 food-service workers won their contract the day before kick-off — including the right to walk out if ICE enters.", flags: ["ICE assured it would stay away from matches — 'subject to change'", "National Special Security Event zones"], src: ["S_NPR_SOFI", "S_PROSPECT", "S_ALJ_NOICE"] },
  nyc: { bill: "Hosts the Final at MetLife — resale seats above $10,000, and ~$70M in city costs against a max $55M in added tax revenue.", flags: ["Dedicated ICE operation running the length of the tournament", "Commuters stranded when transit was reserved for ticket holders"], src: ["S_FORTUNE_PAY", "S_CTM_ICE", "S_NW_TRANSIT"] },
  dal: { bill: "Biggest venue (AT&T Stadium); heavy federal security footprint.", flags: ["Robot dogs patrol the stadium", "Noon kick-off at 91°F in the knockouts", "Asking Airbnb rates more than double what guests would pay"], src: ["S_TNW", "S_ALJ_HEAT", "S_AIRROI"] },
  hou: { bill: "Independent reporting: host cities like Houston spend big and make little. Fan-fest day one: 110 heat casualties.", flags: ["County judge says her heat warnings were ignored", "Games could top 90°F"], src: ["S_PROPUBLICA", "S_FOXWX_HOU", "S_BHRRC_HEAT"] },
  kc:  { bill: "Shares U.S. federal security grants; officials sought more federal help.", flags: ["Knockout heat index up to 110°F, open-air stadium", "Airbnb rates doubled"], src: ["S_STATELINE", "S_ALJ_HEAT", "S_AIRROI"] },
  phi: { bill: "Shares U.S. federal security grants and surge-pricing pressure.", flags: ["Sheraton workers struck mid-tournament for $30/hr", "Airbnb rates roughly doubled city-wide"], src: ["S_INQ_STRIKE", "S_FORTUNE_AIRBNB"] },
  sf:  { bill: "Levi's Stadium (Santa Clara); shares federal security footprint.", flags: ["Airbnb rates roughly doubled"], src: ["S_FORTUNE_AIRBNB"] },
  sea: { bill: "Lumen Field; shares federal security grants and surge pricing.", flags: ["Reactivated a CCTV network previously shut down over biometric-privacy concerns", "Embassy Suites workers voted 94% to authorize a strike"], src: ["S_CONVERSATION", "S_TRAVELWK"] },
  gdl: { bill: "Mexican venue in a federally tax-exempt tournament environment.", flags: ["FIFA & affiliates exempt from Mexican federal taxes"], src: ["S_BIZMODEL"] },
  mex: { bill: "Estadio Azteca — first stadium to host three World Cups; tax-exempt environment. Four fans died in celebration crushes on Reforma after the Ecuador win.", flags: ["FIFA & affiliates exempt from Mexican federal taxes", "Tear gas outside the opening ceremony", "Police presence doubled to 6,000 after the crush deaths"], src: ["S_BIZMODEL", "S_ESPN_CRUSH", "S_ESPN_MEXSEC", "S_GULF_AZTECA"] },
  mty: { bill: "Estadio BBVA; part of Mexico's tax-exempt hosting arrangement.", flags: ["FIFA & affiliates exempt from Mexican federal taxes"], src: ["S_BIZMODEL"] }
};

/* -------------------------------------------------------------------------- */
/*  MODULE / TILE REGISTRY — broadcast "stat bugs" with yellow/red cards      */
/*  card: "red" (worst offenders) | "yellow".  stat = the giant number.       */
/* -------------------------------------------------------------------------- */
const MODULES = [
  { id: "environment", status: "live", size: "xl", card: "red", group: "CLIMATE",
    stat: "9.02M", statUnit: "tonnes CO₂e", est: true,
    title: "The planet's own goal",
    teaser: "The most polluting World Cup ever recorded — roughly double the modern average. Turns out flying 48 teams and their fans across a continent for 104 matches is hard on the sky. Who could possibly have known.",
    render: "map" },
  { id: "budget", status: "live", size: "lg", card: "red", group: "PUBLIC MONEY",
    stat: "$1.07B", statUnit: "Canada's confirmed public tab", est: false,
    title: "Sold as a party. Billed as a mugging.",
    teaser: "The watchdog's final number: $1,066M of Canadian public money — $82M a game. Meanwhile Toronto's tournament bump for bars and restaurants came in at 3%, and four states are investigating the ticket machine.",
    render: "budget" },
  { id: "infantino", status: "live", size: "lg", card: "red", group: "MAN OF THE MATCH",
    stat: "27", statUnit: "private-jet flights, group stage", est: false,
    title: "He gave himself the armband",
    teaser: "BBC Verify tracked his jet: 27 flights, 24 matches, 31,144 miles and 516 tonnes of CO₂e in a fortnight — from the man who signed the tournament's climate pledge.",
    render: "infantino" },
  { id: "finance",     status: "live", size: "sm", card: "red", group: "THE MONEY",
    stat: "$8.9B", statUnit: "FIFA revenue, tax-favoured", est: false,
    title: "A non-profit that clears $8.9B",
    teaser: "Tax-exempt since 1994, budgeting ~$8.9B off this one tournament — while cities eat the costs.",
    render: "finance" },
  { id: "sportswash",  status: "live", size: "sm", card: "yellow", group: "SPONSORS",
    stat: "$100M", statUnit: "a year, from Aramco", est: false,
    title: "Brought to you by the top emitter",
    teaser: "The world's biggest corporate polluter is a lead sponsor of the 'greenest' World Cup ever. Meet the roster.",
    render: "sportswash" },
  { id: "policing",    status: "live", size: "sm", card: "red", group: "SURVEILLANCE",
    stat: "167k+", statUnit: "ICE arrests around host cities", est: false,
    title: "The security state, invited in",
    teaser: "Facial recognition, robot dogs and 60,000-ft drones at the turnstiles; a dedicated ICE operation in NY/NJ; and a border that detained players, refused a referee and kept whole fan bases home.",
    render: "policing" },
  { id: "timeline",    status: "live", size: "sm", card: "red", group: "RAP SHEET",
    stat: "40+", statUnit: "officials indicted", est: false,
    title: "A decade of FIFAgate",
    teaser: "From the 2015 dawn raids in Zurich to a peace prize for Trump, a red card reversed by phone call, and 50 MEPs demanding an ethics probe — on one scrollable thread.",
    render: "timeline" },
  { id: "displacement",status: "live", size: "sm", card: "yellow", group: "HOUSING",
    stat: "+109%", statUnit: "Airbnb rates, all 16 cities", est: false,
    title: "Priced out of your own city",
    teaser: "Rental rates doubled across every host city while budget hostels sit half-empty. Vancouver pledged no sweeps, then cleared East Hastings mid-tournament anyway.",
    render: "displacement" },
  { id: "labor",       status: "live", size: "sm", card: "yellow", group: "LABOUR",
    stat: "$10/hr", statUnit: "some stadium workers", est: false,
    title: "Cheap hands, 90° heat",
    teaser: "Six of the first 24 matches in dangerous heat, a mid-tournament hotel strike in Philadelphia, and a SoFi contract that had to spell out the right to flee ICE.",
    render: "labor" },
  { id: "matchreport", status: "live", size: "sm", card: "red", group: "MATCH REPORT",
    stat: "1962", statUnit: "last red-card reversal, until Trump called", est: false,
    title: "Four weeks in: the casualty list",
    teaser: "A red card overturned by presidential phone call, tear gas at the opening ceremony, 110 heat casualties at one fan fest, a death at a fan screening, and a record piracy takedown. The tournament diary FIFA doesn't keep.",
    render: "matchreport" },
  { id: "cities",      status: "live", size: "sm", card: "yellow", group: "THE LEAGUE",
    stat: "16", statUnit: "host cities, 16 case files", est: false,
    title: "16 cities, 16 case files",
    teaser: "Tap any host city for its own bill, sweeps and security plan.",
    render: "cities" }
];

/* -------------------------------------------------------------------------- */
/*  THE SKIT — "New Employee Orientation" motion comic. Host: BRENDA.          */
/*  One full illustration per scene (assets/skit/sceneN.jpg, includes Brenda). */
/*  `lines` type out one at a time; `dig` opens that harm's deep-dive module.  */
/*  `shot` describes the image to generate (shown on the placeholder).         */
/* -------------------------------------------------------------------------- */
const SKIT = [
  { img: "scene0", goal: 0, min: "0'", name: "BRENDA", dig: null,
    lines: ["Welcome to FIFA! You must be the new intern.",
            "I'm Brenda — VP of Vibes & Onboarding!",
            "Grab a lanyard. Orientation is a tight… 104 minutes."],
    sfx: "WELCOME!",
    shot: "Bright, gleaming FIFA HQ lobby in gold & green. BRENDA — a beaming corporate host in a blazer with a lanyard — arms thrown wide in welcome." },

  { img: "scene1", goal: 1, min: "1'", name: "BRENDA", dig: "environment",
    lines: ["First perk: TRAVEL! We fly 48 teams and their fans across a whole continent.",
            "It's the most sustainable World Cup EVER!"],
    smallprint: "*most polluting on record — 9 million tonnes of CO₂. But, like… sustainably.",
    sfx: "VROOOM!",
    shot: "Rooftop helipad crowded with private jets under a smoggy orange sky; one sad wilting potted plant in the corner. Brenda gesturing proudly at the jets." },

  { img: "scene2", goal: 2, min: "12'", name: "BRENDA", dig: "budget",
    lines: ["Here's the beautiful part: YOU don't pay for the stadiums.",
            "The taxpayers do! And we keep the ticket money.",
            "That's called synergy, sweetie."],
    smallprint: "*'synergy' is not a recognised legal defence.",
    sfx: "KA-CHING!",
    shot: "An office where a giant paper invoice/receipt unspools across the floor; a golden cash register. Brenda fanning a wad of cash, delighted." },

  { img: "scene3", goal: 3, min: "24'", name: "BRENDA", dig: "finance",
    lines: ["Fun fact: we're a non-profit!",
            "Tax-exempt since 1994.",
            "We'll clear nine billion this month and pay, in tax… (whispers) basically nothing."],
    sfx: "SHHH…",
    shot: "A bank vault stacked with gold bars, a big 'NON-PROFIT ✔' banner overhead. Brenda winking with a finger to her lips." },

  { img: "scene4", goal: 4, min: "38'", name: "BRENDA", dig: "sportswash",
    lines: ["Meet our sponsors!",
            "An oil giant, an airline, and the world's number-one plastic polluter.",
            "SO green. Don't overthink it."],
    sfx: "SO GREEN!",
    shot: "A press-conference sponsor wall plastered with invented logos (an oil drop, an airplane, a soda cup). Brenda presenting like a game-show host, arm extended." },

  { img: "scene5", goal: 5, min: "45+'", name: "BRENDA", dig: "displacement",
    lines: ["We 'beautify' the host cities!",
            "Rents double. And the folks sleeping downtown?",
            "Relocated. Somewhere. Off-camera. Smile!"],
    sfx: "SWEEP!",
    shot: "A giant broom sweeping tents and a shopping cart off the edge of a spotless 'FIFA Fan Zone' street. Brenda cheerfully holding the broom." },

  { img: "scene6", goal: 6, min: "58'", name: "BRENDA", dig: "labor",
    lines: ["Meet the team behind the team!",
            "Ten dollars an hour, ninety-degree heat.",
            "We call them 'passionate volunteers.'*"],
    smallprint: "*they are neither volunteers nor paid enough.",
    sfx: "98°F!",
    shot: "A blazing-hot stadium concourse; an exhausted worker sweating at a beer tap under a huge sun. Brenda relaxing in sunglasses with an iced drink." },

  { img: "scene7", goal: 7, min: "67'", name: "BRENDA", dig: "policing",
    lines: ["Security! The stadium knows your FACE now.",
            "And ICE is helping. For your safety.",
            "120 rights groups were so thrilled they issued a travel advisory!"],
    smallprint: "*the advisory lists profiling, device searches, detention and deportation. The fun stuff.",
    sfx: "SCAN…",
    shot: "Turnstiles bristling with security cameras; a green face-scan grid overlaid on a nervous fan. Brenda giving two big thumbs up." },

  { img: "scene8", goal: 8, min: "76'", name: "BRENDA", dig: "timeline",
    lines: ["Ancient history alert!",
            "In 2015 some officials got arrested for, um… 150 million in bribes.",
            "Totally different people now. Mostly."],
    sfx: "2015.",
    shot: "A wall of blurred generic mugshots beside a 2015 newspaper headline 'FIFA ARRESTS'. Brenda shrugging with exaggerated innocence." },

  { img: "scene9", goal: 9, min: "85'", name: "BRENDA", dig: "infantino",
    lines: ["And our fearless leader!",
            "Six million a year. A private jet to ten matches in seven days. Moved to Miami.",
            "He asks YOU to tighten your belt. Inspiring.",
            { img: "lick", t: "Some people call the culture here 'sycophantic'. I honestly don't see it." }],
    sfx: "№ 01",
    shot: "A gold throne beside a private jet, with a framed portrait of a smug generic executive (not a real person). Brenda gazing up adoringly." },

  { img: "scene10", goal: 10, min: "90'", name: "BRENDA", dig: "cities",
    lines: ["Sixteen host cities. Sixteen identical stories.",
            "Same fine print. Same bill. Same doorstep.",
            "Pick a city — any city!"],
    sfx: "×16",
    shot: "A cheery amusement-park style map of North America dotted with 16 little flags. Brenda pointing at it with a ruler like a tour guide." },

  { img: "scene11", goal: 10, min: "FT", name: "BRENDA", dig: null, end: true,
    lines: ["And that's orientation!",
            "Questions? No? Perfect.",
            "The gift shop's this way — the RECEIPTS are right below.",
            "Welcome to the family. The house always wins!"],
    sfx: "FULL TIME!",
    shot: "Confetti raining over the FIFA lobby; Brenda handing you a swag bag. A scoreboard behind her reads FIFA 10 – 0." }
];

/* -------------------------------------------------------------------------- */
/*  NEWS CRAWL — the bottom-of-broadcast ticker one-liners                     */
/* -------------------------------------------------------------------------- */
const CRAWL = [
  { t: "MOST POLLUTING WORLD CUP ON RECORD — up to 9.02M tonnes CO₂e, ~2× the modern average", s: "S_SGR" },
  { t: "CANADA'S FINAL BILL CONFIRMED: $1,066M of public money — $82M PER GAME", s: "S_PBO" },
  { t: "TRUMP CALLS, FIFA FOLDS: Balogun's red card reversed — first at a World Cup since 1962. UEFA: 'a red line'", s: "S_ALJ_BALOGUN" },
  { t: "FOUR STATES INVESTIGATE FIFA'S TICKET MACHINE — prices raised on 90+ of 104 matches", s: "S_NYAG" },
  { t: "KNOCKOUT RESALE PRICES COLLAPSE 39% IN A WEEK as FIFA dumps 10,000 tickets on its own marketplace", s: "S_NW_TIX" },
  { t: "BBC VERIFY TRACKS INFANTINO'S JET — 27 flights, 24 matches, 31,144 miles in the group stage alone", s: "S_BBC_JET" },
  { t: "ESPN: THE PRESIDENTIAL TOUR HITS 39,005 MILES by 1 July", s: "S_ESPN_TOUR" },
  { t: "92 MILES, BY PRIVATE JET: Philadelphia to New Jersey for a Fox News interview", s: "S_BBC_JET" },
  { t: "50 MEPs DEMAND AN ETHICS PROBE of Infantino over the 'FIFA Peace Prize' for Trump", s: "S_IRISH_MEP" },
  { t: "TRUMP'S DISCLOSURE: $15,000 in tickets, gifted by Infantino. He presents the trophy 19 July", s: "S_CNBC_TRUMP" },
  { t: "TORONTO'S $380M PARTY delivers a 3% bump for bars — and hotel occupancy DOWN 16 points", s: "S_CP24_TOR" },
  { t: "110 HEAT CASUALTIES at Houston's fan festival on day one", s: "S_FOXWX_HOU" },
  { t: "FOUR FANS DEAD in Mexico City celebration crushes; the AG investigates", s: "S_ESPN_CRUSH" },
  { t: "PARAGUAY–FRANCE AT ~100°F — the second-hottest World Cup match ever played", s: "S_AP_HEAT" },
  { t: "SIX OF THE FIRST 24 MATCHES played at wet-bulb temperatures classed as DANGEROUS", s: "S_NYU_HEAT" },
  { t: "HEAT DOME OVER THE KNOCKOUTS: 110°F heat indices in Kansas City & Philadelphia", s: "S_ALJ_HEAT" },
  { t: "'THE WORLD CUP MUST PAY ITS CARBON BILL' — calls grow for a climate responsibility fund", s: "S_ALJ_CARBON" },
  { t: "A REFEREE WITH A VALID VISA turned away at Miami; whole fan bases denied entry", s: "S_WAPO_ENTRY" },
  { t: "VANCOUVER PLEDGED NO SWEEPS — then cleared East Hastings tents mid-tournament", s: "S_VANSUN_DTES" },
  { t: "2015: SEVEN OFFICIALS ARRESTED in Zurich dawn raids; $150M+ in bribes alleged", s: "S_DOJ" }
];

/* -------------------------------------------------------------------------- */
/*  SOURCES                                                                    */
/* -------------------------------------------------------------------------- */
const SOURCES = {
  S_HOSTS:     { pub: "FIFA", title: "Host Countries and Cities — FIFA World Cup 2026", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/host-cities" },
  S_SGR:       { pub: "Scientists for Global Responsibility", title: "2026 FIFA Men's World Cup to be most polluting ever", url: "https://www.sgr.org.uk/resources/2026-fifa-men-s-world-cup-be-most-polluting-ever" },
  S_LBORO:     { pub: "Loughborough University", title: "FIFA Men's World Cup expansion risks 'most polluting ever'", url: "https://www.lboro.ac.uk/news-events/news/2026/june/fifa-mens-world-cup-risks/" },
  S_TIME:      { pub: "TIME", title: "What Will the Carbon Footprint of the 2026 FIFA World Cup Be?", url: "https://time.com/article/2026/06/03/carbon-emissions-2026-fifa-world-cup/" },
  S_EURONEWS:  { pub: "Euronews", title: "The dark side of the 2026 World Cup: record-breaking emissions and thousands of flights", url: "https://www.euronews.com/2026/06/05/the-dark-side-of-the-2026-world-cup-more-flights-more-emissions-more-climate-crisis" },
  S_CBC_VAN:   { pub: "CBC News", title: "Projected cost of hosting World Cup games in Vancouver grows to ~$700M", url: "https://www.cbc.ca/news/canada/british-columbia/fifa-world-cup-cost-estimate-vancouver-9.7216856" },
  S_GLOBAL_VAN:{ pub: "Global News", title: "FIFA World Cup now expected to cost B.C. between $685M and $729M", url: "https://globalnews.ca/news/11873858/fifa-world-cup-cost-vancouver-bc/" },
  S_DH_VAN:    { pub: "Daily Hive", title: "Total public cost of FIFA World Cup in Vancouver grows to up to $729 million", url: "https://dailyhive.com/vancouver/vancouver-fifa-world-cup-public-cost-update-may-2026" },
  S_CBC_PBO:   { pub: "CBC News", title: "Hosting FIFA World Cup will cost taxpayers $1B: watchdog report", url: "https://www.cbc.ca/news/politics/world-cup-cost-funding-report-pbo-9.7205647" },
  S_STATELINE: { pub: "Stateline", title: "The World Cup is around the corner. Are cities and states prepared?", url: "https://stateline.org/2026/03/31/the-world-cup-is-around-the-corner-are-cities-and-states-prepared/" },
  S_FEMA:      { pub: "FEMA", title: "FIFA World Cup 2026 — security grants", url: "https://www.fema.gov/fifa-world-cup-2026" },
  S_ESPN_FUND: { pub: "ESPN", title: "Why haven't World Cup host cities received $625M of critical funding?", url: "https://www.espn.com/soccer/story/_/id/48081576/" },
  S_PROPUBLICA:{ pub: "ProPublica", title: "How Much Money Will Host Cities Make From the 2026 World Cup? Not Much.", url: "https://www.propublica.org/article/world-cup-2026-host-cities-revenue-houston" },
  S_ITEP:      { pub: "ITEP", title: "Not-So-Free Kick: How the 2026 FIFA World Cup Will Cost Cities Millions", url: "https://itep.org/fifa-2026-world-cup-tickets-sales-tax-exemption/" },
  S_BRIT_ECON: { pub: "Britannica Money", title: "Economics of the FIFA World Cup", url: "https://www.britannica.com/money/economics-of-the-FIFA-World-Cup" },
  S_WCPASS:    { pub: "WorldCupPass", title: "FIFA World Cup 2026 Ticket Prices: Knockout Stage Breakdown", url: "https://worldcuppass.com/fifa-world-cup-2026-ticket-prices/" },
  S_GOAL_DYN:  { pub: "Goal.com", title: "FIFA World Cup 2026 dynamic pricing ticket guide", url: "https://www.goal.com/en/news/world-cup-dynamic-pricing-guide/bltd1aac4c9aae2cd85" },
  S_BRIT_TIX:  { pub: "Britannica", title: "How expensive is a 2026 FIFA World Cup ticket?", url: "https://www.britannica.com/question/How-expensive-is-a-2026-FIFA-World-Cup-ticket" },
  S_ESPN_PAY:  { pub: "ESPN", title: "Infantino lands $6M pay package following inaugural Club World Cup", url: "https://www.espn.com/soccer/story/_/id/48252606/" },
  S_BBC_JET:   { pub: "BBC Verify & BBC Sport", title: "27 flights, 24 matches: The carbon cost of Fifa president's World Cup tour", url: "https://www.bbc.com/sport/football/articles/cgev5wy0zg3o" },
  S_FIFA_COMP: { pub: "FIFA", title: "Compensation — FIFA Annual Report", url: "https://inside.fifa.com/official-documents/annual-report/2023/governance/compensation" },
  S_WIKI_GI:   { pub: "Wikipedia", title: "Gianni Infantino", url: "https://en.wikipedia.org/wiki/Gianni_Infantino" },
  S_BDAY:      { pub: "BusinessDay", title: "FIFA under fire for Infantino's lavish lifestyle", url: "https://businessday.ng/sports/article/fifa-under-fire-for-infantinos-lavish-lifestyle/" },
  S_HITC:      { pub: "HITC", title: "World Cup nation gives FIFA boss a private jet as $487.5m deal laid bare", url: "https://www.hitc.com/world-cup-nation-gives-fifa-boss-gianni-infantino-a-private-jet-as-487-5m-deal-laid-bare/" },
  S_DOJ:       { pub: "U.S. DOJ", title: "Nine FIFA Officials and Five Corporate Executives Indicted", url: "https://www.justice.gov/archives/opa/pr/nine-fifa-officials-and-five-corporate-executives-indicted-racketeering-conspiracy-and" },
  S_FIFAGATE:  { pub: "Wikipedia", title: "2015 FIFA corruption case", url: "https://en.wikipedia.org/wiki/2015_FIFA_corruption_case" },
  S_BIZMODEL:  { pub: "Business Model Analyst", title: "FIFA Business Model (2026): How Football's Non-Profit Makes $13 Billion", url: "https://businessmodelanalyst.com/fifa-business-model/" },
  S_KPMG_TAX:  { pub: "KPMG", title: "Reported FIFA 2026 World Cup tax deal allows teams to seek 501(c) tax-exempt status", url: "https://kpmg.com/us/en/taxnewsflash/news/2026/06/kpmg-article-fifa-2026-world-cup-tax-exemption.html" },
  S_GLOBALTREAS:{ pub: "The Global Treasurer", title: "FIFA Secures Last-Minute Federal Tax Breakthrough for 2026 World Cup Teams", url: "https://www.theglobaltreasurer.com/2026/04/30/fifa-secures-last-minute-federal-tax-breakthrough-for-2026-world-cup-teams/" },
  S_ACLU:      { pub: "ACLU", title: "The 2026 FIFA Men's World Cup: Know Your Rights, Know Your Risks", url: "https://www.aclu.org/campaigns-initiatives/the-2026-fifa-mens-world-cup-know-your-rights-know-your-risks" },
  S_AMNESTY:   { pub: "Amnesty International USA", title: "Over 120 Civil Society Groups Issue Travel Advisory for U.S. Ahead of FIFA World Cup", url: "https://www.amnestyusa.org/press-releases/over-120-civil-society-groups-issue-travel-advisory-for-u-s-ahead-of-fifa-world-cup/" },
  S_CONVERSATION:{ pub: "The Conversation", title: "World Cup propels surveillance to new heights", url: "https://theconversation.com/world-cup-propels-surveillance-to-new-heights-284712" },
  S_GADGET:    { pub: "Gadget Review", title: "World Cup 2026 Security Normalizes Mass Surveillance", url: "https://www.gadgetreview.com/world-cup-2026-security-normalizes-mass-surveillance" },
  S_IWF_ARAMCO:{ pub: "Inside World Football", title: "Criticism of FIFA's Aramco sponsorship amplifies ahead of 2026 World Cup", url: "https://www.insideworldfootball.com/2025/10/02/criticism-fifas-aramco-sponsorship-amplifies-ahead-2026-world-cup/" },
  S_FOSSILFREE:{ pub: "Fossil Free Football", title: "FIFA and the Aramco Sponsorship Deal — factsheet", url: "https://www.fossilfreefootball.org/2026/04/20/fifa-and-aramco-factsheet/" },
  S_CBC_ARAMCO:{ pub: "CBC Radio", title: "FIFA faces pressure to cut ties with Saudi oil sponsor", url: "https://www.cbc.ca/radio/whatonearth/fifa-world-cup-aramco-9.7224085" },
  S_BHRRC:     { pub: "Business & Human Rights Centre", title: "Workers' groups call on FIFA sponsors to act on Qatar conditions", url: "https://www.business-humanrights.org/en/latest-news/workers-groups-call-on-fifa-sponsors-to-act-on-qatar-conditions-coca-cola-visa-respond/" },
  S_PRISM:     { pub: "Prism", title: "Activists against World Cup: 'Football belongs to the people'", url: "https://prismreports.org/2026/06/09/world-cup-gentrification-displacement/" },
  S_JAPANTODAY:{ pub: "AP / Japan Today", title: "Some host cities are aiming to house, not arrest, homeless people ahead of the World Cup", url: "https://japantoday.com/category/2026-fifa-world-cup/some-host-cities-are-aiming-to-house-not-arrest-homeless-people-ahead-of-the-world-cup" },
  S_FORTUNE_AIRBNB:{ pub: "Fortune", title: "Airbnbs are topping $6,000 a night in World Cup housing frenzy", url: "https://fortune.com/2026/03/28/airbnb-nightly-rates-6000-world-cup-housing-frenzy/" },
  S_UNITEHERE: { pub: "UNITE HERE", title: "Union warns of possible labor disputes at World Cup stadiums, hotels and airports", url: "https://unitehere.org/press-releases/hospitality-workers-union-unite-here-warns-of-possible-labor-disputes-at-world-cup-host-stadiums-hotels-and-airports/" },
  S_WHYY:      { pub: "WHYY", title: "Group asks for living wages, labor rights for 2026 FIFA World Cup", url: "https://whyy.org/articles/2026-fifa-world-cup-living-wages-labor-rights/" },
  S_BHRRC_HEAT:{ pub: "Business & Human Rights Centre", title: "Scholars warn World Cup workers could face serious heat-related risks", url: "https://www.business-humanrights.org/en/latest-news/americas-scholars-warn-that-world-cup-workers-could-face-serious-heat-related-risks/" },
  S_PBS_STADIUM:{ pub: "PBS News", title: "Southern California stadium workers say they have a tentative deal, averting strike", url: "https://www.pbs.org/newshour/nation/southern-california-stadium-workers-say-they-have-a-tentative-deal-averting-strike-ahead-of-world-cup" },
  S_BFFP:      { pub: "Break Free From Plastic", title: "2023 Global Brand Audit: Coca-Cola again the top global plastic polluter", url: "https://www.breakfreefromplastic.org/2024/02/07/bffp-movement-unveils-2023-global-brand-audit-results/" },
  S_FORBES_BEER:{ pub: "Forbes", title: "Beer Banned From Qatar World Cup Stadiums After Last-Minute U-Turn", url: "https://www.forbes.com/sites/roberthart/2022/11/18/well-this-is-awkward-beer-banned-from-qatar-world-cup-stadiums-after-last-minute-u-turn/" },

  /* ---- added in the 3 July 2026 mid-tournament update ---- */
  S_ESPN_TOUR: { pub: "ESPN", title: "Where has Infantino been? FIFA president clocks up 39,000 miles on epic World Cup tour", url: "https://www.espn.com/soccer/story/_/id/49116383/infantino-fifa-presidents-epic-world-cup-tour" },
  S_AFP_JET:   { pub: "AFP (via Yahoo Sports)", title: "Infantino's World Cup dash on a private jet sparks climate backlash", url: "https://sports.yahoo.com/articles/infantinos-world-cup-dash-private-105000197.html" },
  S_CNBC_TRUMP:{ pub: "CNBC", title: "Trump got $15,000 in FIFA tickets from Gianni Infantino. Next up: Presenting the World Cup trophy", url: "https://www.cnbc.com/2026/07/01/trump-fifa-infantino-world-cup-financial-disclosure.html" },
  S_IRISH_MEP: { pub: "The Irish Times", title: "Irish MEPs join calls for investigation into Gianni Infantino over FIFA's Trump peace prize", url: "https://www.irishtimes.com/sport/soccer/2026/06/29/irish-meps-among-those-calling-for-investigation-of-fifas-infantino-over-trump-peace-prize/" },
  S_FAIRSQ:    { pub: "FairSquare", title: "Reboot FIFA campaign launches with class-action complaint against Gianni Infantino", url: "https://fairsq.org/reboot-fifa-campaign-launches-with-class-action-complaint-against-gianni-infantino/" },
  S_FORBES_NUM:{ pub: "Forbes", title: "The Numbers Behind The 2026 World Cup", url: "https://www.forbes.com/sites/brettknight/2026/07/01/the-numbers-behind-the-2026-world-cup/" },
  S_NYAG:      { pub: "NY Attorney General", title: "Attorneys General James and Davenport Subpoena FIFA Over World Cup Ticketing", url: "https://ag.ny.gov/press-release/2026/attorney-general-james-and-attorney-general-davenport-subpoena-fifa-over-world" },
  S_TXAG:      { pub: "Texas Attorney General", title: "Attorney General Ken Paxton Investigates FIFA to Ensure Fans Have Access to Accurate and Honest Pricing", url: "https://www.texasattorneygeneral.gov/news/releases/attorney-general-ken-paxton-investigates-fifa-ensure-fans-have-access-accurate-and-honest-pricing" },
  S_NW_TIX:    { pub: "Newsweek", title: "World Cup Ticket Prices Plunge as Knockout Stage Begins", url: "https://www.newsweek.com/world-cup-ticket-prices-plunge-as-knockout-stage-begins-12134662" },
  S_LSE_TIX:   { pub: "LSE EUROPP", title: "The EU must learn the lessons from FIFA's ticket pricing at the 2026 World Cup", url: "https://blogs.lse.ac.uk/europpblog/2026/06/30/fifa-world-cup-ticket-pricing-algorithmic-dynamic/" },
  S_CBC_STUB:  { pub: "CBC News", title: "StubHub sued in proposed class action over cancelled World Cup tickets", url: "https://www.cbc.ca/news/world/stubhub-cancelled-tickets-fifa-world-cup-class-action-lawsuit-9.7255509" },
  S_PBO:       { pub: "Parliamentary Budget Officer (Canada)", title: "Federal financial support for the 2026 FIFA Men's World Cup", url: "https://www.pbo-dpb.ca/en/publications/NT-2627-007-S--federal-financial-support-2026-fifa-men-world-cup--aide-financiere-federale-coupe-monde-masculine-fifa-2026" },
  S_CP24_TOR:  { pub: "CP24", title: "As the World Cup wraps up in Toronto, the economic impact of the games still remains unclear", url: "https://www.cp24.com/news/sports/2026/07/03/as-the-world-cup-wraps-up-in-toronto-the-economic-impact-of-the-games-still-remains-unclear/" },
  S_FORTUNE_PAY:{ pub: "Fortune", title: "How FIFA restructured the World Cup into its biggest payday ever, as host cities face a budget shortfall", url: "https://fortune.com/2026/06/19/fifa-biggest-payday-world-cup-history-host-cities-foot-bill/" },
  S_CBC_HOTELS:{ pub: "CBC News", title: "Province says World Cup is boosting B.C. economy, but some businesses report softer demand", url: "https://www.cbc.ca/news/canada/british-columbia/fifa-world-cup-impact-on-vancouver-businesses-9.7253545" },
  S_CFR:       { pub: "Council on Foreign Relations", title: "FIFA Promised a World Cup Economic Boom, But U.S. Stands May Be Emptier Than Usual", url: "https://www.cfr.org/articles/fifa-promised-a-world-cup-economic-boom-but-u-s-stands-may-be-emptier-than-usual" },
  S_SI_SEATS:  { pub: "Sports Illustrated", title: "Why Are There So Few Empty Seats at the 2026 World Cup?", url: "https://www.si.com/soccer/why-are-there-so-few-empty-seats-at-the-2026-world-cup" },
  S_HRW_ICE:   { pub: "Human Rights Watch", title: "The World Cup Needs an ICE Truce", url: "https://www.hrw.org/news/2026/04/07/the-world-cup-needs-an-ice-truce" },
  S_HRW_CWC:   { pub: "Human Rights Watch", title: "US: ICE Arrest at FIFA Event Spotlights Dangers for World Cup", url: "https://www.hrw.org/news/2025/12/03/us-ice-arrest-at-fifa-event-spotlights-dangers-for-world-cup" },
  S_CTM_ICE:   { pub: "CT Mirror", title: "ICE presence at World Cup looms. Fans and local leaders prepare", url: "https://ctmirror.org/2026/06/12/ice-world-cup-immigration/" },
  S_ALJ_NOICE: { pub: "Al Jazeera", title: "World Cup: No ICE deployment; extra security for Iran games in Los Angeles", url: "https://www.aljazeera.com/sports/2026/6/2/world-cup-no-ice-deployment-extra-security-for-iran-games-in-los-angeles" },
  S_TNW:       { pub: "TNW", title: "Robot dogs, hunter drones, and AI cameras: the tech securing the 2026 World Cup", url: "https://thenextweb.com/news/world-cup-2026-security-tech-robot-dogs-drones-ai" },
  S_WAPO_ENTRY:{ pub: "The Washington Post", title: "World Cup players and officials are being detained or barred entry into U.S.", url: "https://www.washingtonpost.com/immigration/2026/06/09/world-cup-players-officials-are-being-detained-or-barred-entry-into-us/" },
  S_JPOST_PRESS:{ pub: "The Jerusalem Post", title: "Accredited journalists denied visas for the World Cup, says AIPS", url: "https://www.jpost.com/international/article-898562" },
  S_AFP_VISA:  { pub: "AFP (via Yahoo Sports)", title: "Visa rejection dashes World Cup hopes of Ivory Coast and Senegal fans", url: "https://sports.yahoo.com/articles/visa-rejection-dashes-world-cup-175910022.html" },
  S_GREENLY:   { pub: "Greenly", title: "FIFA World Cup 2026: what's the real carbon footprint?", url: "https://greenly.earth/en-gb/leaf-media/data-stories/fifa-world-cup-2026whats-the-real-carbon-footprint" },
  S_F365:      { pub: "Football365", title: "FIFA embarrass themselves with laughable campaign ahead of historic World Cup low", url: "https://www.football365.com/news/fifa-shame-environmental-campaign-most-polluting-world-cup" },
  S_HPW_SODA:  { pub: "Health Policy Watch", title: "FIFA Urged To Kick Coca-Cola Out Of World Cup", url: "https://healthpolicy-watch.news/fifa-urged-to-kick-coca-cola-out-of-world-cup/" },
  S_BHRRC_HYU: { pub: "Business & Human Rights Centre", title: "Mexico: Protesters allege Hyundai's World Cup sponsorship is 'greenwashing through sports'", url: "https://www.business-humanrights.org/en/latest-news/mexico-protesters-allege-hyundais-sponsorship-of-the-world-cup-would-be-a-form-of-greenwashing-through-sports/" },
  S_MARKETPLACE:{ pub: "Marketplace", title: "Why Saudi Aramco is all over this World Cup", url: "https://www.marketplace.org/story/2026/07/02/why-saudi-aramco-is-all-over-this-world-cup" },
  S_AIRROI:    { pub: "AirROI", title: "World Cup 2026 Short-Term Rental Data (16 host cities)", url: "https://www.airroi.com/world-cup-2026-airbnb-data" },
  S_VANSUN_DTES:{ pub: "Vancouver Sun", title: "Vancouver's homeless residents get World Cup screenings but supports unchanged", url: "https://ca.news.yahoo.com/vancouvers-homeless-residents-world-cup-003324531.html" },
  S_SHELTERFORCE:{ pub: "Shelterforce", title: "Will the World Cup Fuel Arrests of Homeless People in Atlanta?", url: "https://shelterforce.org/2026/06/12/will-the-world-cup-fuel-arrests-of-homeless-people-in-atlanta/" },
  S_NPR_SOFI:  { pub: "NPR", title: "SoFi Stadium workers vote to authorize strike ahead of World Cup", url: "https://www.npr.org/2026/06/06/nx-s1-5848682/sofi-stadium-strike-world-cup" },
  S_PROSPECT:  { pub: "The American Prospect", title: "ICE Raids at World Cup Games? A Los Angeles Union Says, No Way!", url: "https://prospect.org/2026/06/09/ice-raids-world-cup-los-angeles-union-unite-here/" },
  S_INQ_STRIKE:{ pub: "The Philadelphia Inquirer", title: "Sheraton Philadelphia Downtown workers strike during the World Cup", url: "https://www.inquirer.com/news/sheraton-philadelphia-downtown-unite-here-strike-20260621.html" },
  S_NYU_HEAT:  { pub: "NYU Stern Center for Business & Human Rights", title: "Also In Play: Heat Stress Beyond the Pitch", url: "https://bhr.stern.nyu.edu/quick-take/also-in-play-heat-stress-beyond-the-pitch/" },
  S_FOXWX_HOU: { pub: "FOX Weather", title: "100+ suffer from heat exhaustion during fan festival for 2026 FIFA World Cup", url: "https://www.foxweather.com/weather-news/over-100-people-heat-exhaustion-2026-fifa-world-cup-opening-day" },
  S_ALJ_HEAT:  { pub: "Al Jazeera", title: "How the North American heatwave could impact the FIFA World Cup", url: "https://www.aljazeera.com/news/2026/7/2/how-the-north-american-heatwave-could-impact-the-fifa-world-cup" },
  S_ESPN_WATER:{ pub: "ESPN", title: "FIFA reverses World Cup water bottle ban after backlash", url: "https://www.espn.com/soccer/story/_/id/48978502/fifa-reverses-world-cup-water-bottle-ban-backlash" },
  S_GULF_AZTECA:{ pub: "Gulf News", title: "World Cup 2026 opening day: controversies, protests, ticket price outrage and fan zone chaos", url: "https://gulfnews.com/sport/football/world-cup/world-cup-2026-opening-day-controversies-protests-ticket-price-outrage-and-fan-zone-chaos-1.500571662" },
  S_ABC_AMMAN: { pub: "ABC News 4", title: "Stampede at World Cup match viewing in Jordan's Amman kills 1", url: "https://abcnews4.com/news/nation-world/stampede-at-world-cup-match-viewing-in-jordans-amman-kills-1" },
  S_GIZ_PIRACY:{ pub: "Gizmodo", title: "DOJ shuts down nearly 400 sites hosting illegal World Cup live streams", url: "https://gizmodo.com/doj-shuts-down-nearly-400-sites-hosting-illegal-world-cup-live-streams-2000778928" },
  S_YAHOO_FIX: { pub: "Yahoo Sports", title: "World Cup rocked by spot-fixing suspicions over yellow cards", url: "https://sports.yahoo.com/articles/world-cup-rocked-spot-fixing-171637792.html" },
  S_NW_TRANSIT:{ pub: "Newsweek", title: "World Cup Chaos Leaves NYC Commuters Stranded", url: "https://www.newsweek.com/world-cup-chaos-leaves-nyc-commuters-stranded-how-to-prepare-for-travel-12071026" },
  S_SANDC_DOJ: { pub: "Sports & Crime", title: "US drops FIFAgate bribery case tied to World Cup qualifiers", url: "https://www.sportsandcrime.com/p/us-drops-fifagate-bribery-case-tied" },
  S_PBS_DROP:  { pub: "PBS NewsHour", title: "U.S. prosecutors move to drop soccer TV rights corruption case", url: "https://www.pbs.org/newshour/world/u-s-prosecutors-move-to-drop-soccer-tv-rights-corruption-case" },
  S_TRAVELWK:  { pub: "Travel Weekly", title: "Potential strikes loom over 2026 World Cup as hospitality workers demand better conditions", url: "https://www.travelweekly.com/Travel-News/Hotel-News/Hospitality-workers-threaten-to-strike-during-World-Cup" },

  /* ---- added in the 7 July 2026 update ---- */
  S_ALJ_BALOGUN:{ pub: "Al Jazeera", title: "Why FIFA's Balogun red-card suspension after Trump call is so controversial", url: "https://www.aljazeera.com/sports/2026/7/6/why-fifas-balogun-red-card-suspension-after-trump-call-is-so-controversial" },
  S_ESPN_CALL: { pub: "ESPN", title: "US President Donald Trump confirms he asked FIFA to review Balogun red card", url: "https://www.espn.com/soccer/story/_/id/49286603/us-president-donald-trump-confirms-asked-fifa-review-balogun-red-card" },
  S_NPR_UEFA:  { pub: "NPR", title: "UEFA says FIFA 'crossed a red line' over Balogun ban reversal", url: "https://www.npr.org/2026/07/06/g-s1-132108/world-cup-balogun-uefa-fifa-belgum-trump" },
  S_CAAG:      { pub: "California Attorney General", title: "Attorney General Bonta seeks answers from FIFA regarding potentially misleading 2026 World Cup ticket practices", url: "https://oag.ca.gov/news/press-releases/attorney-general-bonta-seeks-answers-fifa-regarding-potentially-misleading-2026" },
  S_FOX_TROPHY:{ pub: "Fox News", title: "Trump set to deliver World Cup final trophy alongside Gianni Infantino, FIFA president says", url: "https://www.foxnews.com/sports/trump-set-deliver-world-cup-final-trophy-alongside-gianni-infantino-fifa-president-says" },
  S_GOAL_FINAL:{ pub: "Goal.com", title: "World Cup final ticket prices: how much does it cost to attend?", url: "https://www.goal.com/en/news/world-cup-final-ticket-price-how-much/blt2f02d16129a38027" },
  S_ALJ_CARBON:{ pub: "Al Jazeera (opinion)", title: "The World Cup must pay its carbon bill", url: "https://www.aljazeera.com/opinions/2026/7/6/the-world-cup-must-pay-its-carbon-bill" },
  S_ESPN_CRUSH:{ pub: "ESPN", title: "Four dead in Mexico City after World Cup win celebrations", url: "https://www.espn.com/soccer/story/_/id/49235035/mexico-world-cup-win-celebrations-deaths" },
  S_ESPN_MEXSEC:{ pub: "ESPN", title: "Mexico City doubles security for England match after fan deaths", url: "https://www.espn.com/soccer/story/_/id/49264397/mexico-city-security-crowds-england-fan-deaths" },
  S_WHYY_JULY4:{ pub: "WHYY", title: "'I'm melting': Soccer fans brave the heat at FIFA Fan Fest on July 4", url: "https://whyy.org/articles/fifa-fan-fest-heat-wave-philadelphia-lemon-hill/" },
  S_AP_HEAT:   { pub: "AP", title: "Eastern heat on July 4 threatens World Cup players and fans", url: "https://abcnews.com/Health/wireStory/eastern-heat-july-4-threatens-world-cup-players-134435025" },
  S_PHILLYVOICE:{ pub: "PhillyVoice", title: "Sheraton Downtown hotel strike ends with ratified deal during World Cup", url: "https://www.phillyvoice.com/sheraton-downtown-hotel-strike-world-cup/" },
  S_BGLOBE_BREAKS:{ pub: "The Boston Globe", title: "Is there anything World Cup fans despise more than the hydration breaks?", url: "https://www.bostonglobe.com/2026/07/06/sports/fifa-world-cup-hydration-breaks/" }
};

window.DSWC = {
  TOURNAMENT, HOST_CITIES, FAN_ORIGINS, EMISSION_METHOD, EMISSIONS_FACTS,
  COMPARE, BUDGET, INFANTINO, TEAMS,
  SCANDALS, FINANCE, SPONSORS, POLICING, DISPLACEMENT, LABOR, CITY_DOSSIERS,
  MATCHREPORT, MODULES, SKIT, CRAWL, SOURCES
};

/* Shared world-atlas geometry — fetched once, reused by every map module
   (fan heatmap, team tracker, city dossiers) instead of three separate loads. */
let _worldPromise = null;
window.DSWC_getWorld = function () {
  if (!_worldPromise) {
    _worldPromise = (window.d3 && window.topojson)
      ? d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
          .then(w => window.topojson.feature(w, w.objects.countries).features)
          .catch(() => null)
      : Promise.resolve(null);
  }
  return _worldPromise;
};
