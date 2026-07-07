/* ============================================================================
   APP CONTROLLER — broadcast hub, crawl, scorebug, overlay routing, citations
   ============================================================================ */

(function () {
  const D = window.DSWC;
  const $ = (s, r = document) => r.querySelector(s);
  const nf = new Intl.NumberFormat("en-US");

  const ACCENT = { red: "var(--red)", yellow: "var(--yellow)", green: "var(--green)" };

  /* -------------------------------------------------------- tournament ---- */
  function progress() {
    const start = new Date(D.TOURNAMENT.start + "T00:00:00").getTime();
    const end   = new Date(D.TOURNAMENT.end   + "T23:59:59").getTime();
    const now   = Date.now();
    const frac  = Math.min(1, Math.max(0, (now - start) / (end - start)));
    const totalDays = Math.round((end - start) / 86400000);
    const dayNo = Math.min(totalDays, Math.max(1, Math.ceil((now - start) / 86400000)));
    return { frac, dayNo, totalDays, before: now < start, after: now > end };
  }
  const T = progress();

  /* ---------------------------------------------------------- scorebug ---- */
  // FIFA's tally climbs as the reader scrolls through the story.
  function setScore(goals, min) {
    $("#scoreLine").innerHTML = `<span class="sb-fifa">${goals}</span> – <span class="sb-us">0</span>`;
    if (min) $("#matchClock").textContent = min === "FT" ? "FULL TIME" : min;
  }
  function buildScorebug() {
    setScore(0, "KICK-OFF");
    const mastDay = $("#mastDay");
    if (mastDay) mastDay.textContent = T.before ? `${T.totalDays} days to kick-off`
      : T.after ? "full time" : `live · day ${T.dayNo} of ${T.totalDays}`;
  }

  /* ------------------------------------------------------------- crawl ---- */
  function buildCrawl() {
    const items = D.CRAWL.map(c => `<span class="crawl__item">${c.t}</span>`).join("");
    $("#crawlTrack").innerHTML = items + items; // duplicate for seamless -50% loop
  }

  /* --------------------------------------------------------- the files ---- */
  // After the skit hands off, a lean launcher grid to reach every deep-dive.
  function buildFiles() {
    $("#hubCount").textContent = `${D.MODULES.length} files · every claim sourced`;
    $("#grid").innerHTML = D.MODULES.map(m => `
        <button class="bug size-sm" data-card="${m.card}" data-status="live" data-module="${m.id}">
          <div class="bug__top">
            <span class="bug__group">${m.group}</span>
            <span class="card-badge ${m.card}">${m.card} card</span>
          </div>
          <div class="bug__stat"><span class="bug__statn">${m.stat}</span>
            <span class="bug__statu">${m.statUnit} ${m.est ? '<span class="est">est</span>' : ''}</span></div>
          <h3 class="bug__title">${m.title}</h3>
          <p class="bug__teaser">${m.teaser}</p>
          <span class="bug__cta">Open the file <span class="arrow">→</span></span>
        </button>`).join("");
    $("#grid").addEventListener("click", e => {
      const bug = e.target.closest(".bug");
      if (bug) openModule(bug.dataset.module);
    });
  }

  /* ----------------------------------------------------------- overlay ---- */
  const overlay = $("#overlay");
  let lastFocus = null;

  function openModule(id) {
    const idx = D.MODULES.findIndex(x => x.id === id);
    const m = D.MODULES[idx];
    if (!m) return;
    lastFocus = document.activeElement;

    $("#ovBar").style.setProperty("--accent", ACCENT[m.card] || ACCENT.green);
    $("#ovFile").textContent = "MD " + String(idx + 1).padStart(2, "0");
    $("#ovKicker").textContent = m.group;

    const body = $("#ovBody");
    body.innerHTML = ""; body.scrollTop = 0;

    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const R = {
      map: window.DSWC_renderMap, budget: window.DSWC_renderBudget, infantino: window.DSWC_renderInfantino,
      timeline: window.DSWC_renderTimeline, finance: window.DSWC_renderFinance, sportswash: window.DSWC_renderSportswash,
      policing: window.DSWC_renderPolicing, displacement: window.DSWC_renderDisplacement,
      labor: window.DSWC_renderLabor, cities: window.DSWC_renderCities, matchreport: window.DSWC_renderMatchreport
    };
    if (R[m.render]) R[m.render](body);

    wireCites(body);
    $("#ovClose").focus();
    location.hash = id;
  }

  function closeModule() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (window.DSWC_stopInfantino) window.DSWC_stopInfantino();
    if (window.DSWC_stopMap) window.DSWC_stopMap();
    if (window.DSWC_stopTeams) window.DSWC_stopTeams();
    hideCite();
    if (location.hash) history.replaceState(null, "", location.pathname);
    if (lastFocus) lastFocus.focus();
  }

  $("#ovClose").addEventListener("click", closeModule);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeModule(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && overlay.classList.contains("is-open")) closeModule(); });

  /* --------------------------------------------------------- citations ---- */
  const pop = $("#citepop");
  const SRC_INDEX = Object.fromEntries(Object.keys(D.SOURCES).map((id, i) => [id, i + 1]));
  function wireCites(scope) {
    scope.querySelectorAll(".cite").forEach(c => {
      const n = SRC_INDEX[c.dataset.cite];
      if (n) c.textContent = n;
      c.setAttribute("role", "button");
      c.setAttribute("aria-label", "source " + (n || ""));
      c.addEventListener("mouseenter", showCite);
      c.addEventListener("mouseleave", hideCite);
      c.addEventListener("click", e => {
        e.preventDefault();
        const s = D.SOURCES[c.dataset.cite];
        if (s) window.open(s.url, "_blank", "noopener");
      });
    });
  }
  function showCite(e) {
    const s = D.SOURCES[e.target.dataset.cite];
    if (!s) return;
    pop.innerHTML = `<div class="pub">${s.pub}</div><div class="ttl">${s.title}</div><a>${s.url}</a>`;
    pop.style.display = "block";
    const r = e.target.getBoundingClientRect();
    pop.style.left = Math.min(r.left, window.innerWidth - 320) + "px";
    pop.style.top = (r.bottom + 8) + "px";
  }
  function hideCite() { pop.style.display = "none"; }

  /* --------------------------------------------------------- full time ---- */
  function buildTale() {
    const el = $("#taleTape"); if (!el) return;
    const tape = [
      { n: "9.02M", l: "tonnes CO₂e", cls: "red" },
      { n: "$1.07B", l: "public tab (CAN, confirmed)", cls: "amber" },
      { n: "$32,970", l: "top Final ticket", cls: "red" },
      { n: "$8.9B", l: "FIFA revenue", cls: "amber" },
      { n: "$0", l: "owed in federal tax", cls: "green" }
    ];
    el.innerHTML = tape.map(t =>
      `<div class="tale__cell"><div class="tale__n ${t.cls}">${t.n}</div><div class="tale__l">${t.l}</div></div>`
    ).join("");
  }

  /* --------------------------------------------------------- press kit ---- */
  // One-click sourced quotes. Not our numbers — the record's.
  const PRESS = [
    { stat: "9.02M t", claim: "The 2026 World Cup is projected to emit up to 9.02 million tonnes of CO₂e — the most polluting World Cup on record, roughly double the 2010–2022 average", s: "S_SGR" },
    { stat: "87%", claim: "87% of the tournament's projected emissions come from spectators travelling, not from stadiums", s: "S_LBORO" },
    { stat: "$729M", claim: "Vancouver's public bill for hosting climbed from a 2022 estimate of about $260M to as much as $729M CAD — nearly triple", s: "S_GLOBAL_VAN" },
    { stat: "$82M", claim: "Canada's Parliamentary Budget Officer confirmed a public cost of $1,066M CAD — $82 million for each of Canada's 13 games", s: "S_PBO" },
    { stat: "$846M", claim: "FEMA awarded $846 million in federal security grants to lock down the 11 U.S. host cities", s: "S_FEMA" },
    { stat: "$60 → $33k", claim: "Tickets advertised 'from $60' reached $32,970 for Front-Category Final seats under FIFA's dynamic pricing — and FIFA takes a 30% commission on resales", s: "S_LSE_TIX" },
    { stat: "90 of 104", claim: "New York and New Jersey subpoenaed FIFA after it raised prices on more than 90 of 104 matches, averaging 34% increases, and downgraded seats fans had already bought", s: "S_NYAG" },
    { stat: "$8.9B · $0", claim: "FIFA projects roughly $8.9 billion in revenue from this tournament, and has held U.S. tax-exempt status since 1994", s: "S_BIZMODEL" },
    { stat: "27 flights", claim: "BBC Verify tracked a FIFA-linked private jet through 27 flights to Infantino's 24 group-stage matches — 31,144 miles and an estimated 516 tonnes of CO₂e in a fortnight", s: "S_BBC_JET" },
    { stat: "+3%", claim: "Toronto's $380M World Cup delivered a 3% rise in bar and restaurant spending in its first two weeks, while hotel occupancy fell from 88% to 72%", s: "S_CP24_TOR" },
    { stat: "2×", claim: "Airbnb's average nightly rate doubled year-over-year across all 16 host cities, from about $216 to $450", s: "S_AIRROI" },
    { stat: "120+", claim: "More than 120 civil-society groups issued a travel advisory for the United States ahead of the World Cup", s: "S_AMNESTY" }
  ];

  async function copyQuote(text, btn, card) {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; }
    catch (e) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(ta); ta.select();
        ok = document.execCommand("copy"); ta.remove();
      } catch (e2) { /* leave ok=false */ }
    }
    if (!ok && card) {
      // last resort: select the claim so Ctrl+C still gets it
      const range = document.createRange();
      range.selectNodeContents(card.querySelector(".pcard__claim"));
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
    }
    btn.textContent = ok ? "Copied ✓" : "Selected — hit Ctrl+C";
    btn.classList.toggle("ok", ok);
    setTimeout(() => { btn.textContent = "Copy with source"; btn.classList.remove("ok"); }, 1800);
  }

  function buildPress() {
    const grid = $("#pressGrid");
    if (!grid) return;
    grid.innerHTML = PRESS.map((p, i) => {
      const src = D.SOURCES[p.s];
      return `<div class="pcard">
        <div class="pcard__stat">${p.stat}</div>
        <p class="pcard__claim">${p.claim}.</p>
        <div class="pcard__foot">
          <span class="pcard__src">${src.pub}</span>
          <button class="pcard__copy" data-i="${i}">Copy with source</button>
        </div>
      </div>`;
    }).join("");
    grid.addEventListener("click", e => {
      const btn = e.target.closest(".pcard__copy");
      if (!btn) return;
      const p = PRESS[+btn.dataset.i], src = D.SOURCES[p.s];
      copyQuote(`${p.claim}. (Source: ${src.pub} — ${src.url})`, btn, btn.closest(".pcard"));
    });
  }

  /* ----------------------------------------------------------- sources ---- */
  function buildSources() {
    $("#methodText").textContent = D.EMISSION_METHOD.note;
    const ids = Object.keys(D.SOURCES);
    $("#sourceList").innerHTML = ids.map((id, i) => {
      const s = D.SOURCES[id];
      return `<div class="source"><span class="source__id">${String(i + 1).padStart(2, "0")}</span>
        <div><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a><div class="pub">${s.pub}</div></div></div>`;
    }).join("");
  }

  /* ------------------------------------------------------------- API ------ */
  // Exposed so the skit engine can drive the scoreboard and open deep-dives.
  window.DSWC_setScore = setScore;
  window.DSWC_open = openModule;

  /* -------------------------------------------------------------- boot ---- */
  buildScorebug();
  buildCrawl();
  buildFiles();
  buildTale();
  buildPress();
  buildSources();
  if (window.DSWC_renderSkit) window.DSWC_renderSkit($("#skit"));

  if (location.hash) {
    const id = location.hash.slice(1);
    if (D.MODULES.some(m => m.id === id && m.status === "live")) setTimeout(() => openModule(id), 120);
  }
})();
