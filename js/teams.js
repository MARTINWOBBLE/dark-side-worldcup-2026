/* ============================================================================
   TEAM TRACKER — follow one squad's continental zig-zag.
   Animated charter-jet "takeoffs" leg by leg, with live distance + CO2 tally.
   Routing is illustrative (labelled); leg distances are real geography.
   ============================================================================ */

(function () {
  const fmt = n => new Intl.NumberFormat("en-US").format(Math.round(n));

  function haversineKm(a, b) {
    const R = 6371, toRad = d => d * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
    const s = Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLng/2)**2;
    return 2 * R * Math.asin(Math.sqrt(s));
  }

  let timer = null;
  // Time-based ticker (setInterval, not rAF) so it also runs in hidden/background tabs.
  window.DSWC_stopTeams = function () { if (timer) clearInterval(timer); timer = null; };

  // Realistic base-camp model: teams set up a base and commute out-and-back to
  // each group match, then follow the bracket through the knockouts. This adds
  // the return legs a naive venue-to-venue path ignores.
  function buildLegs(team, hostById) {
    const base = hostById[team.route[0].c];
    const isGroup = m => /group/i.test(m);
    const legs = [];
    for (const r of team.route) {                 // group stage: base ⇄ away venue
      if (!isGroup(r.m)) continue;
      const v = hostById[r.c];
      if (v.id === base.id) continue;             // home-base match — no flight
      legs.push({ a: base, b: v, km: haversineKm(base, v), label: r.m, kind: "out" });
      legs.push({ a: v, b: base, km: haversineKm(v, base), label: "Back to base camp", kind: "back" });
    }
    let prev = base;                              // knockouts: chase the bracket
    for (const r of team.route) {
      if (isGroup(r.m)) continue;
      const v = hostById[r.c];
      legs.push({ a: prev, b: v, km: haversineKm(prev, v), label: r.m, kind: "ko" });
      prev = v;
    }
    return { base, legs };
  }
  function routeKm(team, hostById) {
    return buildLegs(team, hostById).legs.reduce((s, l) => s + l.km, 0);
  }

  // Illustrative itinerary generator for teams without a hand-authored route.
  const REGIONS = [
    ["sea", "van", "sf", "la"],                 // West
    ["dal", "hou", "kc", "gdl", "mty", "mex"],  // Central
    ["nyc", "phi", "bos", "tor", "mia", "atl"]  // East
  ];
  const ALLC = ["nyc", "atl", "mia", "dal", "hou", "la", "sf", "sea", "kc", "phi", "bos", "tor", "van", "gdl", "mex", "mty"];
  const KO = ["Round of 32", "Round of 16", "Quarter-final", "Semi-final", "FINAL"];
  function genRoute(i) {
    const R = REGIONS[i % 3], a = i % R.length;
    const group = [R[a], R[(a + 1) % R.length], R[(a + 2) % R.length]];
    const route = group.map((c, k) => ({ c, m: `Group · MD${k + 1}` }));
    const ko = i % 4;                            // 0–3 knockout legs (most teams go out early)
    let prev = group[2];
    for (let k = 0; k < ko; k++) {
      let idx = (i * 3 + k * 5 + 7) % ALLC.length;
      let c = ALLC[idx]; if (c === prev) c = ALLC[(idx + 1) % ALLC.length];
      route.push({ c, m: KO[k] }); prev = c;
    }
    return route;
  }
  const genColor = i => `hsl(${(i * 47) % 360}, 72%, 62%)`;

  window.DSWC_renderTeamTracker = function (mount) {
    const D = window.DSWC;
    const hostById = Object.fromEntries(D.HOST_CITIES.map(h => [h.id, h]));
    const charterKgPerKm = D.EMISSION_METHOD.charterKgPerKm;
    // resolve every team to a concrete route + colour (generate where missing)
    const teams = D.TEAMS.map((t, i) => ({ ...t, route: t.route || genRoute(i), color: t.color || genColor(i) }));
    // aggregate across all 48 squads — the framing that always lands
    const allKm = teams.reduce((s, t) => s + routeKm(t, hostById), 0);
    const allLaps = (allKm / 40075).toFixed(1);
    const CONF_ORDER = ["CONMEBOL", "UEFA", "CAF", "AFC", "CONCACAF", "OFC"];

    mount.innerHTML = `
      <h4 class="section-h">TEAM <span class="green">TRACKER</span>: FOLLOW THE ZIG-ZAG <span class="est-badge">Illustrative routing</span></h4>
      <p style="color:var(--dim);font-size:.95rem;margin:4px 0 14px;max-width:80ch">
        Pick a squad and hit <b style="color:var(--green)">TAKE OFF</b>. Teams don't move venue to venue — they fly out from a
        <b style="color:var(--green)">base camp</b> to each group game and back, then chase the bracket. Every return leg counts.
        Distances are real geography; routing is illustrative.
      </p>
      <div class="tt__teams" id="ttTeams"></div>

      <div class="tt">
        <div class="tt__stage" id="ttStage">
          <div class="tt__hud">
            <div class="tt__hudcell"><div class="tt__hudn" id="hudKm">0</div><div class="tt__hudl">km flown</div></div>
            <div class="tt__hudcell"><div class="tt__hudn red" id="hudCo2">0</div><div class="tt__hudl">tonnes CO₂e <span style="color:var(--yellow)">est</span></div></div>
            <div class="tt__hudcell"><div class="tt__hudn" id="hudLeg">0/0</div><div class="tt__hudl">flights taken</div></div>
          </div>
          <div class="tt__takeoff" id="ttTakeoff"></div>
          <button class="tt__play" id="ttPlay">▶ Take off</button>
        </div>
        <aside class="tt__side">
          <div class="tt__teamname" id="ttName">—</div>
          <div class="tt__compare" id="ttCompare"></div>
          <ol class="tt__legs" id="ttLegs"></ol>
        </aside>
      </div>`;

    // team selector chips — grouped by confederation, scrollable (all 48)
    const byConf = {};
    teams.forEach(t => { (byConf[t.conf] = byConf[t.conf] || []).push(t); });
    mount.querySelector("#ttTeams").innerHTML = CONF_ORDER.filter(c => byConf[c]).map(conf => `
      <div class="tt__confgroup">
        <div class="tt__confhead">${conf} <span>· ${byConf[conf].length}</span></div>
        <div class="tt__confchips">${byConf[conf].map(t =>
          `<button class="tt__chip" data-team="${t.id}" style="--tc:${t.color}"><span class="tt__flag">${t.flag}</span> ${t.name}</button>`).join("")}</div>
      </div>`).join("");

    const stage = mount.querySelector("#ttStage");
    const rect = stage.getBoundingClientRect();
    const W = Math.max(rect.width, 320), H = Math.max(rect.height, 420);
    const svg = d3.select(stage).append("svg").attr("viewBox", `0 0 ${W} ${H}`).style("position", "absolute").style("inset", "0");
    const projection = d3.geoNaturalEarth1();
    const path = d3.geoPath(projection);
    // frame on the host-city cluster (North America)
    projection.fitExtent([[24, 24], [W - 24, H - 24]],
      { type: "MultiPoint", coordinates: D.HOST_CITIES.map(h => [h.lng, h.lat]) });

    const gWorld = svg.append("g"), gRoute = svg.append("g"), gDots = svg.append("g"), gPlane = svg.append("g");
    const project = pt => projection([pt.lng, pt.lat]);

    function drawWorld(land) {
      if (land) gWorld.selectAll("path").data(land).join("path").attr("class", "map-country").attr("d", path);
    }
    window.DSWC_getWorld().then(drawWorld);

    // plane glyph (points +x, rotated to heading)
    const plane = gPlane.append("path")
      .attr("d", "M13,0 L-9,-7 L-3,0 L-9,7 Z")
      .attr("fill", "#fff").attr("stroke", "#04120a").attr("stroke-width", .8)
      .style("opacity", 0);

    let current = null;

    function selectTeam(team) {
      window.DSWC_stopTeams();
      current = team;
      mount.querySelectorAll(".tt__chip").forEach(c => c.classList.toggle("active", c.dataset.team === team.id));
      mount.querySelector("#ttName").innerHTML = `<span class="tt__flag">${team.flag}</span> ${team.name} <span class="tt__matches">· ${team.route.length} matches</span>`;

      // realistic base-camp legs (group commutes + knockout bracket)
      const { base, legs } = buildLegs(team, hostById);
      const totalKm = legs.reduce((s, l) => s + l.km, 0);
      const totalTons = totalKm * charterKgPerKm / 1000;

      // reset HUD
      mount.querySelector("#hudKm").textContent = "0";
      mount.querySelector("#hudCo2").textContent = "0";
      mount.querySelector("#hudLeg").textContent = `0/${legs.length}`;
      mount.querySelector("#ttTakeoff").classList.remove("show");
      mount.querySelector("#ttCompare").innerHTML =
        `Base camp: <b style="color:var(--green)">${base.city}</b>. Full run: <b>${legs.length}</b> flights, <b>${fmt(totalKm)} km</b>, <b>${fmt(totalTons)}</b> t CO₂e. Stack all <b>${teams.length}</b> squads: <b>${fmt(allKm)} km</b> ≈ <b>${allLaps}×</b> around the Earth — before one fan boards a plane. <span class="tt__note">Hit take off ▶</span>`;

      // flights list (every hop, including the returns to base)
      mount.querySelector("#ttLegs").innerHTML = legs.map((l, i) => `
        <li class="tt__leg" data-i="${i}">
          <span class="tt__legnum ${l.kind}">${l.kind === "back" ? "↩" : "✈"}</span>
          <span class="tt__legcity">${l.a.city} → ${l.b.city}<span class="tt__legmatch">${l.label}</span></span>
          <span class="tt__legkm">${fmt(l.km)} km</span></li>`).join("");

      // draw route paths + city dots (base marked distinctly)
      gRoute.selectAll("*").remove();
      gDots.selectAll("*").remove();

      const legPaths = legs.map(l => {
        const gc = greatCircle(l.a, l.b);
        gRoute.append("path").attr("d", path(gc)).attr("fill", "none")
          .attr("stroke", "rgba(255,255,255,.14)").attr("stroke-width", 1.2).attr("stroke-dasharray", "3 4");
        const done = gRoute.append("path").attr("d", path(gc)).attr("fill", "none")
          .attr("stroke", team.color).attr("stroke-width", 2.4).attr("class", "tt__done");
        const len = done.node().getTotalLength();
        done.attr("stroke-dasharray", `${len} ${len}`).attr("stroke-dashoffset", len);
        return { done, node: done.node(), len };
      });

      const cityMap = { [base.id]: base };
      legs.forEach(l => { cityMap[l.a.id] = l.a; cityMap[l.b.id] = l.b; });
      const cities = Object.values(cityMap);
      gDots.selectAll("circle").data(cities).join("circle")
        .attr("cx", d => project(d)[0]).attr("cy", d => project(d)[1])
        .attr("r", d => d.id === base.id ? 7 : 4)
        .attr("fill", d => d.id === base.id ? "#fff" : "#06090b")
        .attr("stroke", team.color).attr("stroke-width", d => d.id === base.id ? 3 : 2)
        .style("cursor", "default")
        .append("title").text(d => d.id === base.id ? `${d.city} — BASE CAMP` : `${d.city} — ${d.venue}`);
      gDots.selectAll("text").data(cities.filter(d => d.id === base.id)).join("text")
        .attr("x", d => project(d)[0]).attr("y", d => project(d)[1] - 11)
        .attr("class", "tt__baselabel").attr("text-anchor", "middle").text("BASE");

      // park plane at base
      const p0 = project(base);
      plane.attr("transform", `translate(${p0[0]},${p0[1]})`).style("opacity", 1);

      const playBtn = mount.querySelector("#ttPlay");
      playBtn.textContent = "▶ Take off";
      playBtn.disabled = false;
      playBtn.onclick = () => runFlight(team, legs, legPaths, playBtn);
    }

    function greatCircle(a, b) {
      const interp = d3.geoInterpolate([a.lng, a.lat], [b.lng, b.lat]);
      const n = 48, coords = [];
      for (let i = 0; i <= n; i++) coords.push(interp(i / n));
      return { type: "LineString", coordinates: coords };
    }

    function runFlight(team, legs, legPaths, playBtn) {
      window.DSWC_stopTeams();
      playBtn.disabled = true; playBtn.textContent = "✈ In the air…";
      const hudKm = mount.querySelector("#hudKm"), hudCo2 = mount.querySelector("#hudCo2"),
            hudLeg = mount.querySelector("#hudLeg"), takeoff = mount.querySelector("#ttTakeoff");
      let legIndex = 0, kmBase = 0, phase = "fly", legStart = performance.now(), pauseUntil = 0;

      function startLeg(i) {
        const leg = legs[i];
        takeoff.textContent = `${leg.kind === "back" ? "↩ RETURN" : "✈ TAKEOFF"} · ${leg.a.city} → ${leg.b.city}`;
        takeoff.classList.add("show");
        mount.querySelector(`.tt__leg[data-i="${i}"]`)?.classList.add("active");
        legStart = performance.now();
      }
      function finish() {
        window.DSWC_stopTeams();
        plane.transition().duration(400).style("opacity", 0.3);
        playBtn.disabled = false; playBtn.textContent = "↻ Replay";
        takeoff.classList.remove("show");
        const totalKm = legs.reduce((s, l) => s + l.km, 0);
        const totalTons = totalKm * charterKgPerKm / 1000;
        mount.querySelector("#ttCompare").innerHTML =
          `Touchdown. ${team.name} alone: <b>${fmt(totalKm)} km</b>, <b>${fmt(totalTons)}</b> t CO₂e — for one squad's matches. All ${teams.length} squads rack up <b>${fmt(allKm)} km</b>, ≈ <b>${allLaps}×</b> around the planet. <span class="tt__note">And that's before a single fan boards a plane.</span>`;
      }

      startLeg(0);
      timer = setInterval(() => {
        const now = performance.now();
        if (phase === "pause") {
          if (now >= pauseUntil) {
            if (legIndex >= legs.length) { finish(); return; }
            startLeg(legIndex); phase = "fly";
          }
          return;
        }
        const leg = legs[legIndex], lp = legPaths[legIndex];
        const dur = Math.max(1100, Math.min(3200, leg.km * 0.55));
        const t = Math.min(1, (now - legStart) / dur);
        const ease = t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;   // easeInOutQuad
        const len = lp.len;
        const pt = lp.node.getPointAtLength(ease * len);
        const pt2 = lp.node.getPointAtLength(Math.min(len, ease * len + 1));
        const ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
        const lift = Math.sin(ease * Math.PI) * 0.4 + 1;
        plane.attr("transform", `translate(${pt.x},${pt.y}) rotate(${ang}) scale(${lift})`).style("opacity", 1);
        lp.done.attr("stroke-dashoffset", len * (1 - ease));

        const kmNow = kmBase + ease * leg.km;
        hudKm.textContent = fmt(kmNow);
        hudCo2.textContent = fmt(kmNow * charterKgPerKm / 1000);

        if (t >= 1) {
          kmBase += leg.km;
          hudLeg.textContent = `${legIndex + 1}/${legs.length}`;
          mount.querySelector(`.tt__leg[data-i="${legIndex}"]`)?.classList.add("done");
          mount.querySelector(`.tt__leg[data-i="${legIndex}"]`)?.classList.remove("active");
          legIndex++;
          takeoff.classList.remove("show");
          phase = "pause"; pauseUntil = now + 420;
        }
      }, 33);
    }

    // chip clicks
    mount.querySelector("#ttTeams").addEventListener("click", e => {
      const chip = e.target.closest(".tt__chip");
      if (!chip) return;
      const team = teams.find(t => t.id === chip.dataset.team);
      if (team) selectTeam(team);
    });

    selectTeam(teams[0]);
  };
})();
