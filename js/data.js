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
  vsHistoricAverage: 2.0, src: ["S_SGR", "S_LBORO", "S_TIME", "S_EURONEWS"]
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
      note: "From 'tens of millions' to roughly $380M. Same six games. Bigger bill.", src: ["S_STATELINE"] }
  ],
  headlines: [
    { label: "U.S. federal security grants (FEMA)", value: 846, unit: "USD millions", basis: "fact",
      note: "FEMA handed out $846M — including a $625M FIFA World Cup Grant Program — to lock down 11 U.S. host cities.", src: ["S_FEMA", "S_ESPN_FUND"] },
    { label: "Canada's total taxpayer tab (PBO)", value: 1000, unit: "CAD millions", basis: "projection",
      note: "The Parliamentary Budget Officer's estimate for hosting: about $1 billion of public money.", src: ["S_CBC_PBO"] },
    { label: "Foxborough's public-safety bill", value: 7.8, unit: "USD millions", basis: "fact",
      note: "Local taxpayers flatly refused to pay; a Kraft-backed entity picked up the ~$7.8M tab.", src: ["S_STATELINE"] }
  ],
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
    advertisedLow: 60, officialFinalMax: 6730, dynamicCat1: 33000, resaleFinalAvg: 12483,
    serviceFeePct: 15, euComplaintDate: "2026-03-24", basis: "fact",
    note: "Advertised 'from $60'. Then dynamic pricing marched Final seats toward $33,000, resale averaged $12,483, and every purchase carries a 15% fee. Football Supporters Europe & Euroconsumers filed an EU complaint.",
    src: ["S_WCPASS", "S_GOAL_DYN", "S_BRIT_TIX"]
  },
  framing: {
    text: "The pitch to cities: a once-in-a-generation windfall. The delivery: security bills, infrastructure costs and a FIFA-demanded sales-tax break — while FIFA keeps the tournament revenue. Economists keep finding mega-events overpromise and underdeliver. Cities keep signing anyway.",
    src: ["S_PROPUBLICA", "S_ITEP", "S_BRIT_ECON"]
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
    { k: "Matches in 7 days", v: "10", sub: "Reportedly reached via a Qatar Airways private jet. A lecture on carbon would be awkward.", src: ["S_WIKI_GI", "S_HITC"], est: false },
    { k: "Homes maintained", v: "2", sub: "Switzerland and Florida; family reportedly relocated to Miami after Qatar 2022.", src: ["S_WIKI_GI"], est: false },
    { k: "Kids' school (billed)", v: "$5k/mo", sub: "FIFA reportedly funds his daughter's private schooling in Miami.", src: ["S_BDAY"], est: false }
  ],
  runningTallyProjection: {
    basis: "projection", perDayUSD: 82000,
    note: "Illustrative model of daily private-jet, security-detail and entourage cost across the tournament window. Not an audited figure — a back-of-envelope for scale.",
    src: ["S_WIKI_GI", "S_HITC", "S_BDAY"]
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
  { date: "Mar 2026", tag: "the fans", title: "Ticket revolt reaches Brussels",
    body: "Football Supporters Europe & Euroconsumers file an EU complaint over dynamic pricing that pushed Final seats toward $33,000.", src: ["S_GOAL_DYN"] },
  { date: "2026", tag: "the state", title: "ICE 'a key part' of security",
    body: "As the tournament kicks off, ICE says its agents will play 'a key part' in security; 120+ rights groups issue a U.S. travel advisory.", src: ["S_CONVERSATION", "S_AMNESTY"] }
];

/* --- 05 · FIFA FINANCE ---------------------------------------------------- */
const FINANCE = {
  revenueEventB: 8.9, cycleRevenueB: 13, budgetB: 3.76, reserves2024B: 4.76, taxExemptSince: 1994,
  stats: [
    { n: "$8.9B", l: "FIFA revenue projected from this one tournament", src: ["S_BIZMODEL"], est: false },
    { n: "$3.76B", l: "FIFA's tournament budget (cost)", src: ["S_BIZMODEL"], est: false },
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
    controversy: "Saudi state oil giant — the single largest corporate GHG emitter (≈4.8% of global emissions, 2016–22). UN experts warn FIFA risks platforming 'greenwashing'. Polls: 72% of fans want it dropped.", level: "red", src: ["S_IWF_ARAMCO", "S_FOSSILFREE", "S_CBC_ARAMCO"] },
  { name: "Qatar Airways", tier: 1, role: "Official airline",
    controversy: "State carrier of Qatar, whose 2022 World Cup build was dogged by migrant-worker deaths and abuse. Also the airline behind Infantino's private-jet hops.", level: "red", src: ["S_BHRRC", "S_HITC"] },
  { name: "Coca-Cola", tier: 1, role: "Beverage partner",
    controversy: "Named the world's #1 branded plastic polluter for six consecutive years in Break Free From Plastic's global brand audits — a fixture of every World Cup for decades.", level: "amber", src: ["S_BFFP"] },
  { name: "Anheuser-Busch InBev", tier: 2, role: "Beer partner (Budweiser)",
    controversy: "Pays a reported ~$75M per tournament for exclusive beer rights — then watched Qatar ban stadium beer two days before kickoff. Budweiser's since-deleted reply: 'Well, this is awkward.'", level: "amber", src: ["S_FORBES_BEER"] },
  { name: "Visa", tier: 1, role: "Payments partner",
    controversy: "Named alongside Coca-Cola when workers' groups asked FIFA's sponsors to lean on Qatar over labour conditions. Responded; criticised anyway for the pace.", level: "amber", src: ["S_BHRRC"] },
  { name: "Airbnb", tier: 3, role: "Regional partner",
    controversy: "Short-term-rental platform sponsoring the event as its own listings drive host-city rents and prices skyward (see Housing).", level: "amber", src: ["S_FORTUNE_AIRBNB"] },
  // The rest of the official commercial family (no specific controversy flagged here)
  { name: "Adidas", tier: 1, role: "Kit & match-ball partner", controversy: "", level: "none", src: [] },
  { name: "Hyundai · Kia", tier: 1, role: "Mobility partner", controversy: "", level: "none", src: [] },
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
  facialRec: [
    { city: "Boston", venue: "Gillette Stadium" },
    { city: "Miami", venue: "Hard Rock Stadium" },
    { city: "Atlanta", venue: "Mercedes-Benz Stadium" }
  ],
  facialRecNote: "Stadiums are rolling out AI facial recognition for entry and payments — collecting biometrics of everyone in and around them.",
  facialRecSrc: ["S_CONVERSATION", "S_GADGET"],
  ice: "In February 2026 — days after ICE agents shot and killed Nicole Good in Minneapolis — ICE said its agents would play 'a key part' in tournament security, in cities already hit hardest by aggressive immigration enforcement.",
  iceSrc: ["S_CONVERSATION", "S_ACLU"],
  advisoryGroups: 120,
  advisoryRisks: ["Invasive social-media screening", "Searches of electronic devices", "Racial profiling", "Arrest & detention", "Deportation", "Even death"],
  advisorySrc: ["S_AMNESTY", "S_ACLU"],
  quotes: [
    { q: "Security is often used as an excuse for agendas that have nothing to do with security at all.", who: "Jay Stanley, ACLU", src: ["S_CONVERSATION"] },
    { q: "Surveillance is infrastructure — it will outlast the current World Cup.", who: "Matthew Guariglia, EFF", src: ["S_CONVERSATION"] }
  ]
};

/* --- 03 · DISPLACEMENT & HOUSING ------------------------------------------ */
const DISPLACEMENT = {
  airbnbBefore: 216, airbnbAfter: 450, hotelSurgePct: 300, princetonNight: 6000,
  airbnbSrc: ["S_FORTUNE_AIRBNB"],
  beautification: "FIFA requires host cities to carry out 'beautification'. In Vancouver, a mile-long zone around BC Place swept over the Downtown Eastside — home to many people experiencing homelessness.",
  beautificationSrc: ["S_PRISM", "S_AMNESTY"],
  house: { city: "Atlanta / Dallas", text: "Atlanta raised $185M toward a $235M goal to house 3,900 people before the tournament. Some cities chose to house, not arrest.", src: ["S_JAPANTODAY"] },
  sweep: { city: "1996 precedent", text: "Hosting the '96 Olympics, Atlanta removed ~9,000 homeless people — detention, one-way bus tickets, 'Operation Olympus'. Ahead of Paris 2024, migrants were bused out until the Games ended.", src: ["S_JAPANTODAY"] },
  quote: "Sweeping the homeless people under the carpet for FIFA to make it look like a clean city — no homelessness.",
  quoteWho: "A host-city resident", quoteSrc: ["S_JAPANTODAY"]
};

/* --- 02 · LABOUR ---------------------------------------------------------- */
const LABOR = {
  wages: [
    { lab: "Some hospitality staff, now", v: 10, cls: "red" },
    { lab: "Miami airport/hotel demand", v: 25, cls: "amber" },
    { lab: "Stadium cooks' union win", v: 40, cls: "green" }
  ],
  wageNote: "Long-time stadium hospitality workers earn as little as $10/hr; Miami airport and hotel workers are fighting for $25, a pension and cheaper family healthcare. A union deal will lift some stadium cooks toward $40.",
  wageSrc: ["S_WHYY", "S_PBS_STADIUM"],
  heat: "Thousands of workers are expected to labour past recommended heat-exposure limits. Games in Miami, Houston, Dallas and Atlanta could top 90°F — this may be the hottest World Cup ever, and much of the workforce is temporary contract labour less likely to speak up.",
  heatSrc: ["S_BHRRC_HEAT"],
  checks: "FIFA requires workers to submit to background checks that divulge immigration status as a condition of working — a privacy and enforcement flashpoint.",
  checksSrc: ["S_UNITEHERE"],
  strikeNote: "Southern California stadium workers reached a tentative deal, averting a strike just before kickoff.",
  strikeSrc: ["S_PBS_STADIUM"]
};

/* --- 09 · HOST-CITY DOSSIERS ---------------------------------------------- */
/* Concise, real-where-documented notes. Shared pressures noted where city-   */
/* specific reporting is thin, and labelled as such.                          */
const CITY_DOSSIERS = {
  van: { bill: "Public cost up to ~$729M (CAD) — nearly triple the 2022 estimate.", flags: ["Beautification zone over the Downtown Eastside"], src: ["S_GLOBAL_VAN", "S_PRISM"] },
  tor: { bill: "Costs climbed from tens of millions to ~$380M (CAD).", flags: ["Part of Canada's ~$1B taxpayer bill (PBO)"], src: ["S_STATELINE", "S_CBC_PBO"] },
  atl: { bill: "Shares U.S. federal security grants; state/city + donors raised $185M to house people.", flags: ["Facial recognition at Mercedes-Benz Stadium", "1996 Olympics displaced ~9,000"], src: ["S_JAPANTODAY", "S_CONVERSATION"] },
  mia: { bill: "Surge pricing among the steepest; airport & hotel workers fighting for $25/hr.", flags: ["Facial recognition at Hard Rock Stadium", "Games could top 90°F", "Infantino's adopted base"], src: ["S_CONVERSATION", "S_WHYY", "S_WIKI_GI"] },
  bos: { bill: "Foxborough's ~$7.8M public-safety bill; taxpayers refused, a Kraft-backed entity paid.", flags: ["Facial recognition at Gillette Stadium"], src: ["S_STATELINE", "S_CONVERSATION"] },
  la:  { bill: "County securing hotel contracts to shelter people displaced or priced out.", flags: ["Games could top 90°F", "National Special Security Event zones"], src: ["S_STATELINE"] },
  nyc: { bill: "Hosts the Final at MetLife — where resale seats peaked above $12,000.", flags: ["Nearby Princeton Airbnb listed ~$6,000/night"], src: ["S_BRIT_TIX", "S_FORTUNE_AIRBNB"] },
  dal: { bill: "Biggest venue (AT&T Stadium); heavy federal security footprint.", flags: ["Games could top 90°F"], src: ["S_BHRRC_HEAT"] },
  hou: { bill: "Independent reporting: host cities like Houston spend big and make little.", flags: ["Games could top 90°F"], src: ["S_PROPUBLICA", "S_BHRRC_HEAT"] },
  kc:  { bill: "Shares U.S. federal security grants; officials sought more federal help.", flags: ["Surge pricing on lodging"], src: ["S_STATELINE"] },
  phi: { bill: "Shares U.S. federal security grants and surge-pricing pressure.", flags: ["Airbnb rates roughly doubled city-wide"], src: ["S_FORTUNE_AIRBNB"] },
  sf:  { bill: "Levi's Stadium (Santa Clara); shares federal security footprint.", flags: ["Airbnb rates roughly doubled"], src: ["S_FORTUNE_AIRBNB"] },
  sea: { bill: "Lumen Field; shares federal security grants and surge pricing.", flags: ["Airbnb rates roughly doubled"], src: ["S_FORTUNE_AIRBNB"] },
  gdl: { bill: "Mexican venue in a federally tax-exempt tournament environment.", flags: ["FIFA & affiliates exempt from Mexican federal taxes"], src: ["S_BIZMODEL"] },
  mex: { bill: "Estadio Azteca — first stadium to host three World Cups; tax-exempt environment.", flags: ["FIFA & affiliates exempt from Mexican federal taxes"], src: ["S_BIZMODEL", "S_HOSTS"] },
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
    stat: "$1B+", statUnit: "public tab (CAN, est.)", est: true,
    title: "Sold as a party. Billed as a mugging.",
    teaser: "Cities were promised a windfall and handed a security invoice. Vancouver's tab nearly tripled to $729M. FIFA keeps the gate money.",
    render: "budget" },
  { id: "infantino", status: "live", size: "lg", card: "red", group: "MAN OF THE MATCH",
    stat: "$6M", statUnit: "2025 pay package", est: false,
    title: "He gave himself the armband",
    teaser: "$6M in pay, a private jet for 10 games in a week, and a family relocation — from the man who tells cities to tighten their belts.",
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
    stat: "$1B+", statUnit: "funnelled to security", est: false,
    title: "The security state, invited in",
    teaser: "Facial recognition at the turnstiles, ICE 'a key part' of security, and a travel advisory from 120+ rights groups.",
    render: "policing" },
  { id: "timeline",    status: "live", size: "sm", card: "red", group: "RAP SHEET",
    stat: "40+", statUnit: "officials indicted", est: false,
    title: "A decade of FIFAgate",
    teaser: "From the 2015 dawn raids in Zurich to today, on one scrollable thread.",
    render: "timeline" },
  { id: "displacement",status: "live", size: "sm", card: "yellow", group: "HOUSING",
    stat: "$6,000", statUnit: "a night, one Airbnb", est: false,
    title: "Priced out of your own city",
    teaser: "Airbnb rates doubled across all 16 cities; hotels up ~300%. FIFA calls the clean-up 'beautification'.",
    render: "displacement" },
  { id: "labor",       status: "live", size: "sm", card: "yellow", group: "LABOUR",
    stat: "$10/hr", statUnit: "some stadium workers", est: false,
    title: "Cheap hands, 90° heat",
    teaser: "Some hospitality staff on ~$10/hr, thousands set to work past safe heat limits, background checks that demand immigration status.",
    render: "labor" },
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
  { t: "87% of the tournament's carbon is fans in transit, not stadiums", s: "S_LBORO" },
  { t: "VANCOUVER'S PUBLIC TAB nears $729M — almost triple the 2022 estimate", s: "S_GLOBAL_VAN" },
  { t: "CANADA'S BUDGET WATCHDOG pegs the hosting bill at ~$1 BILLION", s: "S_CBC_PBO" },
  { t: "FEMA hands out $846M to secure 11 U.S. host cities", s: "S_FEMA" },
  { t: "'FROM $60' TICKETS reach $33,000 for the Final under dynamic pricing", s: "S_BRIT_TIX" },
  { t: "INFANTINO banks a $6M pay package; bonus up 33%", s: "S_ESPN_PAY" },
  { t: "FIFA president reportedly took a private jet to 10 matches in 7 days", s: "S_WIKI_GI" },
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
  S_FORBES_BEER:{ pub: "Forbes", title: "Beer Banned From Qatar World Cup Stadiums After Last-Minute U-Turn", url: "https://www.forbes.com/sites/roberthart/2022/11/18/well-this-is-awkward-beer-banned-from-qatar-world-cup-stadiums-after-last-minute-u-turn/" }
};

window.DSWC = {
  TOURNAMENT, HOST_CITIES, FAN_ORIGINS, EMISSION_METHOD, EMISSIONS_FACTS,
  COMPARE, BUDGET, INFANTINO, TEAMS,
  SCANDALS, FINANCE, SPONSORS, POLICING, DISPLACEMENT, LABOR, CITY_DOSSIERS,
  MODULES, SKIT, CRAWL, SOURCES
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
