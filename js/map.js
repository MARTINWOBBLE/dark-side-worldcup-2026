/* ============================================================================
   MODULE — FAN-TRAVEL HEATMAP  (D3 + topojson)
   Broadcast "heat map" of fan air travel. Arc CO2 derived from a stated method.
   A rotating STAT ATTACK panel recontextualises each route into real-world terms.
   ============================================================================ */

(function () {
  const SEATS_PER_PLANE = 300;   // ~wide-body economy load, for the flight-count estimate
  let attackTimer = null;

  function haversineKm(a, b) {
    const R = 6371, toRad = d => d * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
    const s = Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLng/2)**2;
    return 2 * R * Math.asin(Math.sqrt(s));
  }

  function buildRoutes() {
    const { HOST_CITIES, FAN_ORIGINS, EMISSION_METHOD } = window.DSWC;
    const hostById = Object.fromEntries(HOST_CITIES.map(h => [h.id, h]));
    return FAN_ORIGINS.map(o => {
      const dest = hostById[o.hub];
      const distKm = haversineKm(o, dest);
      const roundTripKm = distKm * 2;
      const perFanTons = roundTripKm * EMISSION_METHOD.kgCO2ePerPassengerKm / 1000;
      const routeTons = perFanTons * o.fans;
      const fleetKm = roundTripKm * o.fans;               // total km flown by the fanbase
      return { o, dest, distKm, roundTripKm, perFanTons, routeTons, fleetKm };
    }).sort((a, b) => b.routeTons - a.routeTons);
  }

  const fmt = n => new Intl.NumberFormat("en-US").format(Math.round(n));

  // real-world recontextualisations for the STAT ATTACK ticker
  function comparisonsFor(r) {
    const C = window.DSWC.COMPARE;
    const cars   = r.routeTons / C.carTonsYear;
    const people = r.routeTons / C.personTonsYear;
    const moon   = r.fleetKm / (C.moonKm * 2);            // round trips to the Moon
    const earth  = r.fleetKm / C.earthCircKm;
    const trees  = r.routeTons * C.treesPerTonYear;
    return [
      `≈ <b>${fmt(cars)}</b> cars' worth of annual emissions — from one nation's fans, one round trip.`,
      `Stack the whole fanbase's flights end to end and you've lapped the planet <b>${fmt(earth)}</b> times.`,
      `That's <b>${fmt(moon)}</b> return trips to the Moon in frequent-flyer miles.`,
      `Same as the entire annual carbon footprint of <b>${fmt(people)}</b> human beings.`,
      `You'd need roughly <b>${fmt(trees)}</b> mature trees working for a year to mop it up.`
    ];
  }

  function runAttack(root, comps) {
    const el = root.querySelector("#attackTxt");
    if (!el) return;
    let i = 0;
    el.innerHTML = comps[0];
    clearInterval(attackTimer);
    attackTimer = setInterval(() => {
      i = (i + 1) % comps.length;
      el.style.opacity = 0;
      setTimeout(() => { el.innerHTML = comps[i]; el.style.opacity = 1; }, 180);
    }, 3600);
  }

  window.DSWC_stopMap = function () { clearInterval(attackTimer); attackTimer = null; };

  window.DSWC_renderMap = function (root) {
    const D = window.DSWC;
    const routes = buildRoutes();
    const maxTons = d3.max(routes, r => r.routeTons);
    const widthScale = d3.scaleSqrt().domain([0, maxTons]).range([0.8, 6]);
    const colorScale = d3.scaleLinear().domain([0, maxTons]).range(["#17e37a", "#ff2f45"]);

    root.innerHTML = `
      <div class="mod">
        <div class="lower-third">
          <span class="fact-badge">Climate · Heat Map</span>
          <h3>The most polluting World Cup ever is a traffic jam in the sky</h3>
          <p>
            Spread 104 matches across a continent and the fans have to fly — a lot. Independent researchers project up to
            <b style="color:var(--red)">9.02 million tonnes of CO₂e</b>, roughly double the modern average, with
            <b>87%</b> of it coming from spectators in transit.<a class="cite" data-cite="S_SGR"></a><a class="cite" data-cite="S_LBORO"></a>
            Below: the sky traffic, modelled for representative travelling fanbases. Tap a lane.
          </p>
        </div>

        <div class="mod__inner">
          <div class="statrow">
            <div class="stat" style="--accent:var(--red)"><div class="stat__num red">9.02M</div><div class="stat__label">Tonnes CO₂e — most ever <span class="est-badge">Est</span></div></div>
            <div class="stat" style="--accent:var(--yellow)"><div class="stat__num amber">87%</div><div class="stat__label">From spectators in transit</div></div>
            <div class="stat" style="--accent:var(--green)"><div class="stat__num green">~2×</div><div class="stat__label">The 2010–2022 average</div></div>
            <div class="stat" style="--accent:var(--red)"><div class="stat__num red">74%</div><div class="stat__label">Travel carbon from int'l fans (35% of seats)</div></div>
          </div>

          <div class="map-mod">
            <div class="map-stage" id="mapStage">
              <div class="map-badge est-badge">Modelled</div>
              <div class="map-legend">
                <div class="row"><span class="sw" style="background:var(--red)"></span> Host city (16)</div>
                <div class="row"><span class="sw" style="background:var(--green)"></span> Fan origin</div>
                <div class="row"><span class="sw" style="background:linear-gradient(90deg,#17e37a,#ff2f45)"></span> Lane = route CO₂e</div>
              </div>
            </div>
            <aside class="map-side">
              <h4>Route inspector</h4>
              <p class="map-side__hint" id="mapHint">Tap or hover any lane to break a fanbase's round-trip carbon down.</p>
              <div class="route-detail" id="routeDetail">
                <div class="route-detail__route" id="rdRoute"></div>
                <div class="route-detail__sub" id="rdSub"></div>
                <div class="route-metric"><div class="route-metric__num" id="rdTons"></div><div class="route-metric__label">Tonnes CO₂e · round trip · whole fanbase</div></div>
                <div class="route-metric"><div class="route-metric__num" id="rdFlights" style="color:var(--green)"></div><div class="route-metric__label">Full planes, each way (≈${SEATS_PER_PLANE} seats)</div></div>
                <div class="route-metric"><div class="route-metric__num" id="rdPer" style="color:var(--yellow)"></div><div class="route-metric__label">Tonnes CO₂e · per fan · round trip</div></div>
                <div class="stat-attack">
                  <div class="stat-attack__tag">◤ Stat attack</div>
                  <p class="stat-attack__txt" id="attackTxt" style="transition:opacity .18s"></p>
                </div>
              </div>
              <details class="method"><summary>How this is calculated</summary><p>${D.EMISSION_METHOD.note}</p></details>
            </aside>
          </div>

          <p style="color:var(--dim);font-size:.86rem;margin-top:12px;max-width:80ch">
            <b style="color:var(--yellow)">A floor, not a ceiling:</b> each lane counts just <em>one</em> international round trip per fanbase.
            In reality fans chase their team from host city to host city — like the squads themselves — so the true footprint is higher.
          </p>
          <p style="color:var(--faint);font-size:.8rem;margin-top:8px;font-family:var(--cond);font-weight:600;text-transform:uppercase;letter-spacing:.04em">
            Sources: SGR<a class="cite" data-cite="S_SGR"></a>, Loughborough<a class="cite" data-cite="S_LBORO"></a>, TIME<a class="cite" data-cite="S_TIME"></a>, Euronews<a class="cite" data-cite="S_EURONEWS"></a>. Fan-travel lanes are modelled, not measured.
          </p>

          <div id="teamTracker" style="margin-top:34px"></div>
        </div>
      </div>`;

    const stage = root.querySelector("#mapStage");
    const rect = stage.getBoundingClientRect();
    const W = Math.max(rect.width, 320), H = Math.max(rect.height, 470);

    const svg = d3.select(stage).append("svg").attr("viewBox", `0 0 ${W} ${H}`);
    const projection = d3.geoNaturalEarth1();
    const path = d3.geoPath(projection);
    const gWorld = svg.append("g"), gArcs = svg.append("g"), gPts = svg.append("g");
    const project = pt => projection([pt.lng, pt.lat]);
    function greatCircle(a, b) {
      const interp = d3.geoInterpolate([a.lng, a.lat], [b.lng, b.lat]);
      const n = 64, coords = [];
      for (let i = 0; i <= n; i++) coords.push(interp(i / n));
      return { type: "LineString", coordinates: coords };
    }

    function draw(land) {
      projection.fitExtent([[8, 8], [W - 8, H - 8]], land ? { type: "FeatureCollection", features: land } : { type: "Sphere" });
      if (land) gWorld.selectAll("path").data(land).join("path").attr("class", "map-country").attr("d", path);
      else gWorld.append("path").attr("class", "map-country").attr("d", path({ type: "Sphere" }));

      const arcs = gArcs.selectAll("path").data(routes).join("path")
        .attr("class", "map-arc")
        .attr("d", r => path(greatCircle(r.o, r.dest)))
        .attr("stroke", r => colorScale(r.routeTons))
        .attr("stroke-width", r => widthScale(r.routeTons))
        .attr("opacity", 0.72)
        .on("mouseenter", (e, r) => { arcs.classed("dim", d => d !== r); showDetail(r); })
        .on("mouseleave", () => arcs.classed("dim", false))
        .on("click", (e, r) => { arcs.classed("dim", d => d !== r); showDetail(r); });

      arcs.each(function () {
        const len = this.getTotalLength();
        d3.select(this).attr("stroke-dasharray", `${len} ${len}`).attr("stroke-dashoffset", len)
          .transition().duration(1400).delay((d, i) => i * 85).ease(d3.easeCubicOut)
          .attr("stroke-dashoffset", 0);
      });

      gPts.selectAll("circle.h").data(D.HOST_CITIES).join("circle")
        .attr("class", "map-host h").attr("cx", d => project(d)[0]).attr("cy", d => project(d)[1])
        .attr("r", d => d.id === "nyc" ? 4.5 : 3)
        .append("title").text(d => `${d.city} — ${d.venue}`);
      gPts.selectAll("circle.o").data(D.FAN_ORIGINS).join("circle")
        .attr("class", "map-origin o").attr("cx", d => project(d)[0]).attr("cy", d => project(d)[1])
        .attr("r", 2.6).append("title").text(d => `${d.nation} — ${d.city}`);
    }

    function showDetail(r) {
      root.querySelector("#mapHint").style.display = "none";
      root.querySelector("#routeDetail").classList.add("show");
      root.querySelector("#rdRoute").textContent = `${r.o.nation} → ${r.dest.city}`;
      root.querySelector("#rdSub").textContent = `${fmt(r.distKm)} km each way · ~${fmt(r.o.fans)} travelling fans`;
      root.querySelector("#rdTons").textContent = fmt(r.routeTons);
      root.querySelector("#rdFlights").textContent = "≈ " + fmt(Math.ceil(r.o.fans / SEATS_PER_PLANE));
      root.querySelector("#rdPer").textContent = r.perFanTons.toFixed(2);
      runAttack(root, comparisonsFor(r));
    }

    window.DSWC_getWorld().then(land => draw(land));

    // open on the worst offender so the panel is never empty
    setTimeout(() => { const worst = routes[0]; if (worst) showDetail(worst); }, 300);

    // mount the Team Tracker beneath the heatmap
    const tt = root.querySelector("#teamTracker");
    if (tt && window.DSWC_renderTeamTracker) window.DSWC_renderTeamTracker(tt);
  };
})();
