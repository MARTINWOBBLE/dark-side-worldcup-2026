/* ============================================================================
   MODULE — MAN OF THE MATCH: GIANNI INFANTINO
   A broadcast squad card. Documented "season stats" (fact) + a live, clearly
   labelled in-tournament spend bug (projection). Ticks while open.
   ============================================================================ */

(function () {
  const fmt = n => new Intl.NumberFormat("en-US").format(Math.round(n));
  let timer = null;

  function daysElapsed(startISO, nowMs) {
    return Math.max(0, (nowMs - new Date(startISO + "T00:00:00").getTime()) / 86400000);
  }

  window.DSWC_stopInfantino = function () { if (timer) { clearInterval(timer); timer = null; } };

  window.DSWC_renderInfantino = function (root) {
    const I = window.DSWC.INFANTINO, T = window.DSWC.TOURNAMENT, C = window.DSWC.COMPARE;
    const p = I.runningTallyProjection;
    const J = I.jet;
    const jetCite = J.src.map(x => `<a class="cite" data-cite="${x}"></a>`).join("");

    const statlines = I.statline.map(s => {
      const cites = s.src.map(x => `<a class="cite" data-cite="${x}"></a>`).join("");
      return `<div class="statline-row">
        <span class="statline-k">${s.k}</span>
        <span class="statline-v">${s.v}</span>
        <span class="statline-sub">${s.sub}${cites}</span></div>`;
    }).join("");

    // a darkly-funny relatable comparison for the live meter
    const rentYr = C.medianUSRentMonth * 12;
    const rentEquivPerDay = (p.perDayUSD / rentYr).toFixed(1);

    root.innerHTML = `
      <div class="mod">
        <div class="lower-third">
          <span class="fact-badge">Accountability · Man of the Match</span>
          <h3>He gave himself the armband</h3>
          <p>
            While the tournament preaches austerity to host cities, its president travels by private jet — and now it's
            tracked. BBC Verify followed a FIFA-linked <b>Gulfstream G650ER</b> through <b>27 flights</b> to
            <b>24 group-stage matches</b>: 31,144 miles, 66+ hours airborne, an estimated <b>516 tonnes of CO₂e</b> in a
            fortnight.<a class="cite" data-cite="S_BBC_JET"></a> That's on top of a <b>$6M</b> 2025 pay
            package.<a class="cite" data-cite="S_ESPN_PAY"></a>
            The meter is an <em style="color:var(--yellow)">illustrative estimate</em>, not an audited figure.
          </p>
        </div>

        <div class="mod__inner">
          <div class="squad">
            <div class="squad__card">
              <div class="squad__num">01</div>
              <div class="squad__pos">Position · President</div>
              <div class="squad__name">Gianni<br>Infantino</div>
              <div class="squad__club">FIFA · since 2016 · unopposed 2023</div>
              <div class="mom-badge">★ Man of the Match: himself</div>

              <div class="squad__meter">
                <div class="squad__meterlab">Est. in-tournament jet + security + entourage <span class="est-badge">Est</span></div>
                <div class="odometer"><span class="cur">$</span><span class="digits" id="odo">0</span></div>
                <div class="squad__rate" id="odoRate"></div>
                <p style="font-size:.8rem;color:var(--dim);margin:8px 0 0">${p.note}${p.src.map(s=>`<a class="cite" data-cite="${s}"></a>`).join("")}</p>
              </div>
            </div>

            <div class="squad__stats">
              <div class="squad__meterlab" style="margin-bottom:6px">Season stats <span class="fact-badge">Reported</span></div>
              ${statlines}
              <p style="font-size:.8rem;color:var(--faint);margin-top:16px;font-family:var(--cond);font-weight:600;text-transform:uppercase;letter-spacing:.04em">
                Reported by BBC Verify, ESPN, Wikipedia & BusinessDay. The live meter is a transparent model — days elapsed × an illustrative daily cost.
              </p>
            </div>
          </div>

          <h4 class="section-h" style="margin-top:28px">THE <span class="red">JET</span> TRACKER <span class="fact-badge">BBC Verify · plane-tracking data</span></h4>
          <p style="color:var(--dim);font-size:.95rem;margin:2px 0 0;max-width:82ch">
            FIFA wouldn't confirm the aircraft, so the BBC mapped it: every destination of the ${J.aircraft} matches a
            published photo of Infantino in the stands, same city, same date.${jetCite} The plane seats up to ${J.seats};
            FIFA won't say how many were aboard — or whether anything is offset.
          </p>
          <div class="statrow">
            ${J.bigStats.map(s => `<div class="stat"><div class="stat__num ${s.cls}">${s.n}</div><div class="stat__label">${s.l}${jetCite}</div></div>`).join("")}
          </div>

          <div class="squad__meterlab" style="margin-bottom:6px">Selected legs, group stage <span class="fact-badge">Reported</span></div>
          ${J.itinerary.map(leg => `<div class="statline-row" style="grid-template-columns:90px 1fr">
            <span class="statline-k">${leg.d}</span>
            <span class="statline-sub" style="grid-column:auto;margin:0">${leg.t}${jetCite}</span></div>`).join("")}

          <blockquote class="pullquote">“${J.hypocrisy.pledge}”<cite>— ${J.hypocrisy.pledgeWho}${jetCite}</cite></blockquote>
          <p style="color:var(--dim);font-size:.95rem;margin:14px 0 0;max-width:82ch">
            FIFA's answer, in full: “${J.hypocrisy.response}” <em>(${J.hypocrisy.responseWho}.)</em>
            ${J.hypocrisy.unanswered}${jetCite}
          </p>
          <div class="quotes-row">
            ${J.quotes.map(q => `<blockquote class="pullquote small">“${q.q}”<cite>— ${q.who}${jetCite}</cite></blockquote>`).join("")}
          </div>
          <p style="color:var(--faint);font-size:.86rem;margin:16px 0 0;max-width:82ch">${J.context}${(J.contextSrc || J.src).map(x => `<a class="cite" data-cite="${x}"></a>`).join("")}</p>

          <h4 class="section-h" style="margin-top:28px">OFF-THE-BALL <span class="red">INCIDENTS</span> <span class="fact-badge">Reported</span></h4>
          <div class="two-card" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">
            ${I.offBall.map(o => `<div class="tc tc--red"><div class="tc__tag">${o.tag}</div><div class="tc__city">${o.title}</div>
              <p>${o.body}${o.src.map(x => `<a class="cite" data-cite="${x}"></a>`).join("")}</p></div>`).join("")}
          </div>
        </div>
      </div>`;

    const odo = root.querySelector("#odo");
    const rate = root.querySelector("#odoRate");
    const perDay = p.perDayUSD, perSec = perDay / 86400;

    function tick() {
      const days = daysElapsed(T.start, Date.now());
      odo.textContent = fmt(days * perDay);
      rate.textContent = `≈ $${fmt(perDay)}/day · +$${perSec.toFixed(2)} every second you watch · ≈ ${rentEquivPerDay} years of median rent, every single day`;
    }
    tick();
    window.DSWC_stopInfantino();
    timer = setInterval(tick, 1000);
  };
})();
