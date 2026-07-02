# Build Prompt: "Dark Side of the World Cup 2026"

## What you're building

An interactive, investigative-journalism-style website called **"Dark Side of the World Cup 2026"**. It documents and visualizes the negative impacts of the 2026 FIFA World Cup (hosted across 16 cities in the United States, Mexico, and Canada, June-July 2026) — environmental, human, political, and financial.

Tone: **investigative/journalistic**. Critical and unflinching, but evidence-based. Let facts and data carry the argument — do not editorialize with sloganeering or activist calls-to-action. Write like a data-journalism outlet (ProPublica, The Intercept, FT/NYT visual investigations), not like a campaign flyer.

Visual style: **dark investigative**. Dark background (near-black/charcoal), stark accent colors reserved for alerts and data emphasis (blood red, amber, warning yellow) used sparingly and purposefully. Editorial typography (a serif or distinctive display face for headlines, clean sans for body/data). The overall feel should subvert FIFA's own bright, corporate, celebratory branding — this is the dossier FIFA doesn't want you to read.

## Non-negotiable quality bar — read this first

**Absolutely no AI slop.** This is the most important constraint. Concretely:

- **No generic stock-AI visuals.** No cheesy AI-generated hero images, no default emoji used as icons, no purple-gradient-SaaS-template aesthetic, no Lorem Ipsum or placeholder filler text anywhere in the shipped product. Build real icons/graphics (SVG, CSS, or hand-composed), not AI image-gen filler.
- **No shallow/filler copy.** Every sentence of body copy must say something specific and concrete. Ban generic lines like "the World Cup has many impacts on the world" or "there are many concerns about the environment." Every claim needs a specific fact, figure, name, date, or number attached, and a source.
- **No fake/broken interactivity.** Every interactive element specified below must actually work — respond to clicks/hovers/scroll, filter or reveal real data, animate meaningfully. Do not ship a static image pretending to be a chart, or a map that doesn't actually respond to interaction. If something can't be made real within scope, cut it rather than fake it.
- **No cookie-cutter layout.** Do not default to centered-hero + three-feature-cards + footer template. This is a dashboard/dossier — design it like one: dense, editorial, module-based, with real information architecture, not boilerplate marketing-site scaffolding.

Treat every one of the above as a hard rejection criterion: if the result looks like a generic AI-generated landing page, it has failed the brief regardless of whether the features are technically present.

## Site structure: dashboard hub

The landing page is a **control-room / dossier hub** — not a scrolling marketing page. It should feel like opening a case file. Layout:

- A stark header/masthead: site title, a one-line thesis statement, and maybe a live-feeling counter or ticker (e.g., days until kickoff, or a running tally like "estimated tons of CO2 from fan air travel").
- A grid/array of **module tiles**, one per topic below. Each tile shows: an icon or small data visualization preview, a punchy specific headline (not a generic category label), and a 1-2 sentence teaser with a real number in it.
- Clicking/tapping a tile expands or navigates into that module's full interactive view (your choice: modal, expand-in-place, or route — pick whatever fits the stack you choose, but it must feel intentional, not like a default accordion).
- Persistent way to get back to the hub from any module.
- A footer/appendix area listing sources and methodology (see Data Rules below) — this is not optional, it's part of establishing credibility for an investigative site.

## Modules (build all of these as real, functioning features)

### 1. Environmental — Flight Emissions Map
Interactive map (e.g., world map with animated arcs) showing air travel routes between the 16 host cities and qualifying nations' team/fan bases. Arcs sized and/or colored by estimated CO2 output. Clicking a route reveals a detail panel: distance, estimated number of flights, estimated tons of CO2, and a comparison to something concrete (e.g., "equivalent to X cars driven for a year"). Include a toggle or legend explaining these are modeled estimates, not measured emissions (see Data Rules).

### 2. Labor & Human Rights
Coverage of stadium/infrastructure construction conditions across host cities (renovation and new-build projects) — labor conditions, any documented wage theft, worker safety incidents, migrant labor concerns tied to construction and hospitality staffing surges. Present as profiles/cards per project or issue, not one wall of text.

### 3. Displacement & Housing
Documented and projected gentrification effects: rent spikes near venues/fan zones, unhoused populations swept or displaced from host-city downtowns during past mega-events (draw on real precedent from prior World Cups/Olympics in similar cities), eminent domain or land-use disputes tied to stadium or infrastructure projects.

### 4. Policing, Security & Surveillance
Surveillance technology deployment (facial recognition, license-plate readers, etc.), militarized security perimeters ("FIFA fan zones" and security cordons), and — specific to a US-hosted tournament — documented concerns about immigration enforcement (ICE) presence or chilling effects near venues, and civil-liberties rollbacks tied to past mega-event security operations.

### 5. FIFA Finance & Corruption
FIFA's tax-exempt/non-profit status in host countries vs. its actual revenue capture from the tournament, the historical record of FIFA bribery and bid-rigging scandals (2015 DOJ indictments, past World Cup bid controversies), and the opacity of the 2026 host-selection and commercial process.

### 6. Public Cost & Economic Harm — Budget Tracker
An interactive chart/table comparing **promised vs. actual public spending** per stadium/host city where data exists (renovation costs, security costs, infrastructure costs), plus coverage of independent economic research that has historically found mega-events overpromise and underdeliver local economic benefit. Include ticket/hospitality price data illustrating price gouging where documented.

### 7. Sportswashing & Host-Country Politics
A "sponsor explorer": interactive breakdown of major FIFA/tournament sponsors and commercial partners, each with the specific controversy or criticism tied to it (human rights record, environmental record, political ties, etc.). Structure it so a user can click through sponsors like an investigative dossier, not a logo wall.

### 8. Corruption/Scandal Timeline
A scrollable or navigable interactive timeline covering major FIFA scandals and controversial decisions relevant to the 2026 tournament and its lead-up (bid process, key indictments, leadership controversies). Real dates, real events, real citations.

### 9. Host-City Dossier Map
A clickable map of all 16 host cities (list them explicitly: e.g. Atlanta, Boston, Dallas, Houston, Kansas City, Los Angeles, Miami, New York/New Jersey, Philadelphia, San Francisco Bay Area, Seattle, Toronto, Vancouver, Guadalajara, Mexico City, Monterrey — verify the current official list). Clicking a city opens a dossier card with that city's specific cost overruns, displacement concerns, and policing/security plans, pulling from the relevant modules above rather than duplicating content.

### 10. The Infantino Tracker
A dedicated, pointed module tallying FIFA president Gianni Infantino's personal costs and perks associated with the tournament — private jet travel, security detail size, luxury accommodations, entourage costs — styled as a running "meter" or ticker (e.g., an odometer-style counter or bar that fills as estimated costs accrue through the tournament window). This is intentionally the most pointed/personal module on the site — make it feel like a targeted piece of accountability journalism, backed by whatever real reporting exists on his travel/spending habits, clearly separating documented past behavior from in-tournament projections.

## Data & sourcing rules (apply to every module)

- **Confirmed facts** (things that have already happened: past FIFA scandals, signed/actual stadium construction budgets, past-Cup/Olympics displacement precedent, existing sponsor deals and their known controversies) must be **real, specific, and cited** — include a visible source citation or link for each factual claim, and a methodology/sources section in the footer.
- **Future/in-tournament projections** (fan travel emissions, in-Cup Infantino spending, final attendance-driven displacement) must be clearly and visibly labeled as **estimates/projections**, using a consistent visual marker (e.g., a badge, italics, or footnote convention) — never presented as settled fact.
- Where you do not have a verified real figure, do not invent a fake-precise number. Either use a clearly-labeled illustrative range/methodology-based estimate, or state that data is unavailable/pending.
- Do not fabricate quotes, named individuals' statements, or specific incident details that aren't grounded in real reporting.

## Non-goals

- No user accounts, comments, or backend/CMS — this is a content + data-viz site.
- No calls-to-action, donation asks, or petition widgets — stay in investigative-reporting mode, not activist-campaign mode.
- No monetization, ads, or FIFA-affiliate content.

## Tech stack

Open — choose whatever stack best delivers the interactivity and quality bar above (e.g., a static HTML/CSS/JS build with a mapping library and a charting library is a reasonable default choice, but you are not constrained to it). Prioritize actually-functional interactivity and design quality over stack sophistication.

---

## Revision addendum — July 2026 (as built)

The sections above are the original brief. Through iteration with the owner, two directions superseded parts of it (the quality bar, module specs, data rules, and non-goals **all still apply unchanged**):

1. **Art direction — "weaponized broadcast," not dossier.** Football's own on-air graphics turned against it: a sticky scorebug (FIFA vs. THE REST OF US) whose score ticks up as the visitor progresses, a red BREAKING news crawl of sourced one-liners, angular stat-bug tiles with yellow/red-card severity badges, Anton/Barlow Condensed broadcast typography. Voice is **dark-funny & merciless** — the facts do the stabbing, the wit twists it.

2. **Entry — a satirical motion-comic skit, not a dashboard.** The landing experience is "New Employee Orientation": a 12-scene click-through comedy hosted by BRENDA (VP of Vibes & Onboarding) who cheerfully explains each harm as a company perk. One owner-supplied illustration per scene (`assets/skit/scene0–11.jpg`; labelled placeholders describe each shot until then — see `assets/skit/README.md`). Typed dialogue, comic SFX lettering, per-scene "Dig into the file →" buttons that open the corresponding deep-dive module, and a scoreboard that ends FIFA 10 – 0. The ten interactive modules survive intact as **THE FILES** below the skit; sources & methodology close the page.

Implementation notes that matter for future work: everything is static HTML/CSS/JS with D3 via CDN; all animation is driven by `setInterval` + inline sizes (never rAF or CSS-transition-from-zero) because background tabs freeze the latter; the world atlas is fetched once via a shared `DSWC_getWorld()` cache; the emissions/charter models are labelled estimates with the method stated in the footer.
