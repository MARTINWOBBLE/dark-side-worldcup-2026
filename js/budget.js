/* ============================================================================
   MODULE — MATCH STATS: FIFA vs YOUR CITY
   Promised-vs-now bars, a "substitution board" of what the money could buy,
   and the ticket-price ladder.
   ============================================================================ */

(function () {
  const fmt = n => new Intl.NumberFormat("en-US").format(Math.round(n));
  const moneyM = (n) => n >= 1000 ? "$" + (n/1000).toFixed(n % 1000 === 0 ? 0 : 1) + "B"
                       : Number.isInteger(n) ? "$" + fmt(n) + "M" : "$" + n.toFixed(1) + "M";

  window.DSWC_renderBudget = function (root) {
    const B = window.DSWC.BUDGET;
    const scaleMax = Math.max(...B.cityCosts.map(c => c.projected)) * 1.05;

    const vsBars = B.cityCosts.map(c => {
      const mult = (c.projected / c.promised).toFixed(1);
      const pw = (c.promised / scaleMax) * 100, jw = (c.projected / scaleMax) * 100;
      const cites = c.src.map(s => `<a class="cite" data-cite="${s}"></a>`).join("");
      return `
        <div class="vs-bar">
          <div class="vs-bar__head">
            <span class="vs-bar__city">${c.city} <span class="est-badge">Proj</span></span>
            <span class="vs-bar__mult">▲ ${mult}× the opening estimate</span>
          </div>
          <div class="barline"><span class="barline__lab">Promised</span>
            <span class="barline__rail"><span class="barline__fill promised" style="width:${pw}%"></span></span>
            <span class="barline__val">${moneyM(c.promised)}<span class="cur"> ${c.currency}</span></span></div>
          <div class="barline"><span class="barline__lab">Now</span>
            <span class="barline__rail"><span class="barline__fill now" style="width:${jw}%"></span></span>
            <span class="barline__val">${moneyM(c.projected)}<span class="cur"> ${c.currency}</span></span></div>
          <p style="color:var(--dim);font-size:.86rem;margin:8px 0 0">${c.note}${cites}</p>
        </div>`;
    }).join("");

    const headlineStats = B.headlines.map(h => {
      const badge = h.basis === "projection" ? '<span class="est-badge">Est</span>' : '';
      const cites = h.src.map(s => `<a class="cite" data-cite="${s}"></a>`).join("");
      return `<div class="stat" style="--accent:var(--${h.basis === 'projection' ? 'yellow':'red'})">
        <div class="stat__num ${h.basis === 'projection' ? 'amber':'red'}">${moneyM(h.value)}</div>
        <div class="stat__label">${h.label} ${badge}${cites}</div></div>`;
    }).join("");

    // substitution board — what the security grant could otherwise buy
    const A = B.alternatives;
    const subRows = A.items.map(it => `
      <div class="sub-row">
        <div class="sub-off"><span class="sub-label">${it.off}</span><span class="sub-arrow off">▼ OFF</span></div>
        <span class="sub-vs">or</span>
        <div class="sub-on"><span class="sub-arrow on">ON ▲</span><span><span class="sub-big">${fmt(it.math(A.pot))}</span> <span class="sub-label">${it.on}</span></span></div>
      </div>`).join("");
    const aCites = A.src.map(s => `<a class="cite" data-cite="${s}"></a>`).join("");

    // ticket ladder
    const t = B.tickets;
    const rungs = [
      { v: t.advertisedLow,    lab: "Advertised<br>'from'",      max: false },
      { v: t.officialFinalMax, lab: "Official<br>Final ceiling", max: false },
      { v: t.resaleFinalAvg,   lab: "Peak resale<br>avg (Final)",max: false },
      { v: t.dynamicCat1,      lab: "Dynamic<br>Cat-1 Final",    max: true  }
    ];
    const lo = Math.log10(t.advertisedLow), hi = Math.log10(t.dynamicCat1);
    const hOf = v => 22 + ((Math.log10(v) - lo) / (hi - lo)) * 138;
    const ticketRungs = rungs.map(n => `
      <div class="rung ${n.max ? "max" : ""}"><div class="rung__col">
        <span class="rung__val">$${fmt(n.v)}</span><div class="rung__bar" style="height:${hOf(n.v)}px"></div>
      </div><span class="rung__lab">${n.lab}</span></div>`).join("");
    const tCites = t.src.map(s => `<a class="cite" data-cite="${s}"></a>`).join("");

    root.innerHTML = `
      <div class="mod">
        <div class="lower-third">
          <span class="fact-badge">Public Money · Match Stats</span>
          <h3>Sold as a party. Billed as a mugging.</h3>
          <p>${B.framing.text}${B.framing.src.map(s=>`<a class="cite" data-cite="${s}"></a>`).join("")}</p>
        </div>

        <div class="mod__inner">
          <div class="statrow">${headlineStats}</div>

          <h4 class="section-h">HALF-TIME <span class="red">STATS</span>: PROMISED vs. NOW</h4>
          ${vsBars}

          <div class="subboard">
            <div class="subboard__title">The substitution board <span class="est-badge">Est</span></div>
            <p class="subboard__sub">One number, two ways to spend it. ${moneyM(A.pot)} — ${A.potLabel} — subbed off. What comes on instead:</p>
            ${subRows}
            <p style="color:var(--faint);font-size:.8rem;margin:12px 0 0">${A.note}${aCites}</p>
          </div>

          <div class="ticket-strip">
            <div class="vs-bar__head">
              <span class="vs-bar__city">The ticket ladder</span>
              <span class="cond" style="font-weight:600;font-size:.74rem;color:var(--faint);text-transform:uppercase;letter-spacing:.06em">+${t.serviceFeePct}% fee on every purchase</span>
            </div>
            <p style="color:var(--dim);font-size:.86rem;margin:6px 0 14px">${t.note}${tCites}</p>
            <div class="ticket-ladder">${ticketRungs}</div>
            <p class="cond" style="font-weight:600;font-size:.72rem;color:var(--faint);margin-top:16px;text-transform:uppercase;letter-spacing:.05em">
              EU complaint filed ${new Date(t.euComplaintDate).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})} · Football Supporters Europe & Euroconsumers.
            </p>
          </div>
        </div>
      </div>`;
  };
})();
