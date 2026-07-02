/* ============================================================================
   REMAINING MODULES — finance, sportswash, policing, timeline,
   displacement, labour, host-city dossiers. Broadcast-styled, sourced.
   ============================================================================ */

(function () {
  const fmt = n => new Intl.NumberFormat("en-US").format(Math.round(n));
  const cites = arr => (arr || []).map(s => `<a class="cite" data-cite="${s}"></a>`).join("");
  const moneyM = n => n >= 1000 ? "$" + (n/1000).toFixed(n % 1000 === 0 ? 0 : 1) + "B" : "$" + fmt(n) + "M";

  // Bars get their final width inline at render (reliable regardless of tab
  // visibility; a CSS transition would freeze at 0 in a hidden/background tab).

  const lowerThird = (badge, h3, p) => `
    <div class="lower-third"><span class="fact-badge">${badge}</span>
      <h3>${h3}</h3><p>${p}</p></div>`;

  /* ------------------------------------------------------ 08 · TIMELINE --- */
  window.DSWC_renderTimeline = function (root) {
    const S = window.DSWC.SCANDALS;
    const items = S.map((e, i) => `
      <li class="tl-item" data-i="${i}">
        <button class="tl-dot" aria-expanded="false"></button>
        <div class="tl-body">
          <div class="tl-when">${e.date} <span class="tl-tag">${e.tag}</span></div>
          <div class="tl-title">${e.title}</div>
          <p class="tl-text">${e.body}${cites(e.src)}</p>
        </div>
      </li>`).join("");
    root.innerHTML = `<div class="mod">
      ${lowerThird("Rap Sheet · Timeline", "A decade of FIFAgate, on one thread",
        "The dawn raids were supposed to be a reckoning. A decade later the same institution runs the biggest tournament in history. Tap any moment to open the file.")}
      <div class="mod__inner"><ol class="tl">${items}</ol></div></div>`;
    root.querySelector(".tl").addEventListener("click", e => {
      const item = e.target.closest(".tl-item"); if (!item) return;
      const open = item.classList.toggle("open");
      item.querySelector(".tl-dot").setAttribute("aria-expanded", open);
    });
    // open the marquee event by default
    const first = root.querySelector('.tl-item[data-i="1"]'); if (first) first.classList.add("open");
  };

  /* ------------------------------------------------------- 05 · FINANCE --- */
  window.DSWC_renderFinance = function (root) {
    const F = window.DSWC.FINANCE;
    const statRow = F.stats.map(s => `<div class="stat" style="--accent:var(--red)">
      <div class="stat__num red">${s.n}</div><div class="stat__label">${s.l}${cites(s.src)}</div></div>`).join("");
    const max = F.vs.revenue * 1.05;
    const bar = (lab, v, cls) => `<div class="barline"><span class="barline__lab">${lab}</span>
      <span class="barline__rail"><span class="barline__fill ${cls}" style="width:${(v/max*100)}%"></span></span>
      <span class="barline__val">${moneyM(v)}</span></div>`;
    const tax = F.taxItems.map(t => `<div class="statline-row">
      <span class="statline-k">${t.k}</span><span class="statline-v" style="color:var(--red)">${t.v}</span>
      <span class="statline-sub">${t.sub}${cites(t.src)}</span></div>`).join("");
    root.innerHTML = `<div class="mod">
      ${lowerThird("The Money · Follow It", "A non-profit that clears $8.9 billion",
        "FIFA is legally a Swiss non-profit, tax-exempt in the U.S. since 1994. It also expects to book about <b>$8.9B</b> from this single tournament. The costs, meanwhile, land on the public.")}
      <div class="mod__inner">
        <div class="statrow">${statRow}</div>
        <h4 class="section-h">REVENUE <span class="green">vs.</span> THE PUBLIC BILL</h4>
        <p style="color:var(--dim);font-size:.9rem;margin:2px 0 12px;max-width:78ch">${F.vs.note}${cites(F.vs.src)}</p>
        <div class="bars">
          ${bar("FIFA revenue", F.vs.revenue, "now")}
          ${bar("US security", F.vs.publicUS, "promised")}
          ${bar("Canada bill", F.vs.publicCanada, "promised")}
        </div>
        <h4 class="section-h">THE <span class="red">TAX</span> POSITION</h4>
        <div class="subboard">${tax}</div>
        <blockquote class="pullquote">“${F.quote}”${cites(F.quoteSrc)}</blockquote>
      </div></div>`;
  };

  /* --------------------------------------------------- 07 · SPORTSWASH ---- */
  // Broadcast-style lettermark monogram (crafted chip, not an emoji logo)
  const monogram = name => {
    const words = name.split(/[\s·-]+/).filter(w => /^[A-Za-z]/.test(w));
    return (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
  };

  window.DSWC_renderSportswash = function (root) {
    const SP = window.DSWC.SPONSORS;
    const chips = SP.map((s, i) => `<button class="spon ${s.level}" data-i="${i}">
      <span class="spon__mark">${monogram(s.name)}</span><span class="spon__name">${s.name}</span>
      <span class="spon__tier">Tier ${s.tier}</span></button>`).join("");
    root.innerHTML = `<div class="mod">
      ${lowerThird("Sponsors · Follow the Logos", "Brought to you by the world's biggest polluter",
        "FIFA calls 2026 a climate-conscious tournament. Its energy partner is Saudi Aramco — the single largest corporate greenhouse-gas emitter on Earth. Tap a sponsor to read the fine print.")}
      <div class="mod__inner">
        <div class="spon-grid">${chips}</div>
        <div class="spon-detail" id="sponDetail"></div>
      </div></div>`;
    const detail = root.querySelector("#sponDetail");
    function show(i) {
      const s = SP[i];
      root.querySelectorAll(".spon").forEach(c => c.classList.toggle("sel", +c.dataset.i === i));
      detail.innerHTML = s.controversy
        ? `<div class="spon-detail__head"><span class="spon__mark big">${monogram(s.name)}</span>
             <div><div class="spon-detail__name">${s.name}</div><div class="spon-detail__role">${s.role}</div></div>
             <span class="card-badge ${s.level === 'red' ? 'red' : 'yellow'}">${s.level === 'red' ? 'Red' : 'Yellow'} card</span></div>
           <p class="spon-detail__text">${s.controversy}${cites(s.src)}</p>`
        : `<div class="spon-detail__head"><span class="spon__mark big">${monogram(s.name)}</span>
             <div><div class="spon-detail__name">${s.name}</div><div class="spon-detail__role">${s.role}</div></div></div>
           <p class="spon-detail__text" style="color:var(--faint)">Commercial partner — no specific controversy flagged here. Its money still helps set the stage.</p>`;
    }
    root.querySelector(".spon-grid").addEventListener("click", e => {
      const chip = e.target.closest(".spon"); if (chip) show(+chip.dataset.i);
    });
    show(0);
  };

  /* ----------------------------------------------------- 04 · POLICING ---- */
  window.DSWC_renderPolicing = function (root) {
    const P = window.DSWC.POLICING;
    const fr = P.facialRec.map(f => `<div class="fr-item"><span class="fr-city">${f.city}</span><span class="fr-venue">${f.venue}</span></div>`).join("");
    const risks = P.advisoryRisks.map(r => `<span class="risk-chip">${r}</span>`).join("");
    const quotes = P.quotes.map(q => `<blockquote class="pullquote small">“${q.q}”<cite>— ${q.who}${cites(q.src)}</cite></blockquote>`).join("");
    root.innerHTML = `<div class="mod">
      ${lowerThird("Surveillance · Know Your Risks", "The security state, invited in",
        "Over <b>$1B</b> of public money is buying cameras, cordons and biometric turnstiles — plus a promise from ICE to play 'a key part'. Rights groups say the safest advice is a travel advisory.")}
      <div class="mod__inner">
        <div class="statrow">
          <div class="stat" style="--accent:var(--red)"><div class="stat__num red">$1B+</div><div class="stat__label">Public money into security${cites(P.securitySrc)}</div></div>
          <div class="stat" style="--accent:var(--yellow)"><div class="stat__num amber">${P.advisoryGroups}+</div><div class="stat__label">Rights groups issued a travel advisory${cites(P.advisorySrc)}</div></div>
          <div class="stat" style="--accent:var(--red)"><div class="stat__num red">3</div><div class="stat__label">Host stadiums rolling out facial recognition${cites(P.facialRecSrc)}</div></div>
        </div>
        <h4 class="section-h">BIOMETRICS <span class="red">AT THE TURNSTILE</span></h4>
        <p style="color:var(--dim);font-size:.9rem;margin:2px 0 10px;max-width:80ch">${P.facialRecNote}${cites(P.facialRecSrc)}</p>
        <div class="fr-grid">${fr}</div>
        <h4 class="section-h">ICE, <span class="red">'A KEY PART'</span></h4>
        <p style="color:var(--dim);font-size:.95rem;margin:2px 0 14px;max-width:80ch">${P.ice}${cites(P.iceSrc)}</p>
        <h4 class="section-h">THE <span class="yellow" style="color:var(--yellow)">TRAVEL ADVISORY</span> LISTS</h4>
        <div class="risk-row">${risks}</div>
        <div class="quotes-row">${quotes}</div>
      </div></div>`;
  };

  /* ------------------------------------------------- 03 · DISPLACEMENT ---- */
  window.DSWC_renderDisplacement = function (root) {
    const Dp = window.DSWC.DISPLACEMENT;
    const max = Dp.airbnbAfter * 1.1;
    root.innerHTML = `<div class="mod">
      ${lowerThird("Housing · Priced Out", "Priced out of your own city",
        "The World Cup arrives and the rent follows. Airbnb rates doubled across all 16 host cities; hotels are up around <b>300%</b>. FIFA calls the street clean-up 'beautification'.")}
      <div class="mod__inner">
        <h4 class="section-h">AIRBNB, <span class="red">DOUBLED</span> (all 16 cities)</h4>
        <div class="bars">
          <div class="barline"><span class="barline__lab">A year ago</span>
            <span class="barline__rail"><span class="barline__fill promised" style="width:${Dp.airbnbBefore/max*100}%"></span></span>
            <span class="barline__val">$${Dp.airbnbBefore}/night</span></div>
          <div class="barline"><span class="barline__lab">Now</span>
            <span class="barline__rail"><span class="barline__fill now" style="width:${Dp.airbnbAfter/max*100}%"></span></span>
            <span class="barline__val">$${Dp.airbnbAfter}/night</span></div>
        </div>
        <div class="statrow">
          <div class="stat" style="--accent:var(--red)"><div class="stat__num red">~300%</div><div class="stat__label">Hotel-rate surge around opening matches${cites(Dp.airbnbSrc)}</div></div>
          <div class="stat" style="--accent:var(--yellow)"><div class="stat__num amber">$6,000</div><div class="stat__label">One Princeton, NJ Airbnb, per night${cites(Dp.airbnbSrc)}</div></div>
        </div>
        <h4 class="section-h">HOUSE <span class="green">or</span> <span class="red">SWEEP</span></h4>
        <div class="two-card">
          <div class="tc tc--green"><div class="tc__tag">House</div><div class="tc__city">${Dp.house.city}</div><p>${Dp.house.text}${cites(Dp.house.src)}</p></div>
          <div class="tc tc--red"><div class="tc__tag">Sweep</div><div class="tc__city">${Dp.sweep.city}</div><p>${Dp.sweep.text}${cites(Dp.sweep.src)}</p></div>
        </div>
        <p style="color:var(--dim);font-size:.95rem;margin:16px 0 0;max-width:82ch">${Dp.beautification}${cites(Dp.beautificationSrc)}</p>
        <blockquote class="pullquote">“${Dp.quote}”<cite>— ${Dp.quoteWho}${cites(Dp.quoteSrc)}</cite></blockquote>
      </div></div>`;
  };

  /* ---------------------------------------------------------- 02 · LABOR -- */
  window.DSWC_renderLabor = function (root) {
    const L = window.DSWC.LABOR;
    const max = Math.max(...L.wages.map(w => w.v)) * 1.15;
    const bars = L.wages.map(w => `<div class="barline"><span class="barline__lab">${w.lab}</span>
      <span class="barline__rail"><span class="barline__fill" style="width:${w.v/max*100}%;background:linear-gradient(90deg,var(--${w.cls}-d,#333),var(--${w.cls}))"></span></span>
      <span class="barline__val">$${w.v}/hr</span></div>`).join("");
    root.innerHTML = `<div class="mod">
      ${lowerThird("Labour · The Shift", "Cheap hands, 90-degree heat",
        "The show needs tens of thousands of workers. Some earn as little as <b>$10/hr</b>, many will work past safe heat limits, and FIFA's accreditation makes them hand over their immigration status to clock in.")}
      <div class="mod__inner">
        <h4 class="section-h">THE <span class="green">WAGE</span> TABLE</h4>
        <p style="color:var(--dim);font-size:.9rem;margin:2px 0 10px;max-width:80ch">${L.wageNote}${cites(L.wageSrc)}</p>
        <div class="bars">${bars}</div>
        <div class="two-card">
          <div class="tc tc--red"><div class="tc__tag">Heat</div><div class="tc__city">90°F+ on the clock</div><p>${L.heat}${cites(L.heatSrc)}</p></div>
          <div class="tc tc--yellow"><div class="tc__tag">Papers</div><div class="tc__city">Status to clock in</div><p>${L.checks}${cites(L.checksSrc)}</p></div>
        </div>
        <p style="color:var(--dim);font-size:.95rem;margin:16px 0 0;max-width:82ch">${L.strikeNote}${cites(L.strikeSrc)}</p>
      </div></div>`;
  };

  /* ------------------------------------------------------- 09 · CITIES ---- */
  const CITY_COLOR = { USA: "#17e37a", CAN: "#21c9ff", MEX: "#ffd23f" };

  window.DSWC_renderCities = function (root) {
    const D = window.DSWC, CD = D.CITY_DOSSIERS;
    const cities = D.HOST_CITIES.filter(c => CD[c.id]);
    const chips = cities.map(c => `<button class="citychip" data-id="${c.id}">
      <span class="citychip__flag" style="color:${CITY_COLOR[c.country]}">${c.country}</span>${c.city}</button>`).join("");

    root.innerHTML = `<div class="mod">
      ${lowerThird("The League · 16 Case Files", "16 cities, 16 bills",
        "Every host city sells the same dream and signs the same fine print. Tap a dot — or a name — for its own tab, sweeps and surveillance.")}
      <div class="mod__inner">
        <div class="city-map-wrap">
          <div class="city-stage" id="cityStage">
            <div class="map-legend">
              <div class="row"><span class="sw" style="background:${CITY_COLOR.USA}"></span> USA · 11</div>
              <div class="row"><span class="sw" style="background:${CITY_COLOR.CAN}"></span> Canada · 2</div>
              <div class="row"><span class="sw" style="background:${CITY_COLOR.MEX}"></span> Mexico · 3</div>
            </div>
          </div>
          <div class="city-dossier" id="cityDossier"></div>
        </div>
        <div class="city-grid">${chips}</div>
      </div></div>`;

    const dossier = root.querySelector("#cityDossier");
    let dots = null;

    function show(id) {
      const c = D.HOST_CITIES.find(x => x.id === id), d = CD[id];
      root.querySelectorAll(".citychip").forEach(ch => ch.classList.toggle("sel", ch.dataset.id === id));
      if (dots) dots.attr("r", x => x.id === id ? 8 : 5).attr("stroke-width", x => x.id === id ? 2.5 : 1);
      dossier.innerHTML = `
        <div class="city-dossier__head"><span class="city-dossier__pin" style="background:${CITY_COLOR[c.country]}"></span>
          <div><div class="city-dossier__name">${c.city}</div>
          <div class="city-dossier__venue">${c.venue} · ${c.country}</div></div></div>
        <div class="city-dossier__bill">${d.bill}${cites(d.src)}</div>
        <ul class="city-flags">${d.flags.map(f => `<li>⚑ ${f}</li>`).join("")}</ul>`;
    }
    root.querySelector(".city-grid").addEventListener("click", e => {
      const chip = e.target.closest(".citychip"); if (chip) show(chip.dataset.id);
    });

    // D3 map of North America with clickable host-city dots
    const stage = root.querySelector("#cityStage");
    const rect = stage.getBoundingClientRect();
    const W = Math.max(rect.width, 320), H = Math.max(rect.height, 400);
    const svg = d3.select(stage).append("svg").attr("viewBox", `0 0 ${W} ${H}`).style("position", "absolute").style("inset", "0");
    const projection = d3.geoNaturalEarth1();
    const path = d3.geoPath(projection);
    projection.fitExtent([[20, 20], [W - 20, H - 20]], { type: "MultiPoint", coordinates: cities.map(c => [c.lng, c.lat]) });
    const gWorld = svg.append("g"), gDots = svg.append("g");
    const project = c => projection([c.lng, c.lat]);

    function drawDots() {
      dots = gDots.selectAll("circle").data(cities).join("circle")
        .attr("cx", c => project(c)[0]).attr("cy", c => project(c)[1])
        .attr("r", 5).attr("fill", c => CITY_COLOR[c.country]).attr("stroke", "#06090b").attr("stroke-width", 1)
        .style("cursor", "pointer")
        .on("click", (e, c) => show(c.id));
      dots.append("title").text(c => `${c.city} — ${c.venue}`);
      gDots.selectAll("text").data(cities).join("text")
        .attr("x", c => project(c)[0]).attr("y", c => project(c)[1] - 9)
        .attr("class", "city-maplabel").attr("text-anchor", "middle").text(c => c.city);
      show(cities[0].id);
    }
    window.DSWC_getWorld().then(land => {
      if (land) gWorld.selectAll("path").data(land).join("path").attr("class", "map-country").attr("d", path);
      drawDots();
    });
  };
})();
