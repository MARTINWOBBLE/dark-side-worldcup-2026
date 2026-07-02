/* ============================================================================
   THE SKIT — "New Employee Orientation" motion comic.
   One illustration per scene (assets/skit/sceneN.jpg). Dialogue types out line
   by line; each scene can open its deep-dive module. Placeholder frames show
   the shot to generate until real images are dropped in.
   Typing/auto use setInterval/setTimeout (run in hidden tabs; fully testable).
   ============================================================================ */

(function () {
  const IMG_DIR = "assets/skit/";
  let typeTimer = null, autoTimer = null;

  window.DSWC_stopSkit = function () {
    clearInterval(typeTimer); clearTimeout(autoTimer); typeTimer = autoTimer = null;
  };

  window.DSWC_renderSkit = function (mount) {
    const S = window.DSWC.SKIT;
    let si = 0, li = 0, typing = false, autoOn = false;

    mount.innerHTML = `
      <div class="skit">
        <div class="skit__stage" id="skitStage" role="button" tabindex="0" aria-label="Advance skit">
          <div class="skit__frame" id="skitFrame">
            <div class="skit__ph"><div class="skit__ph-tag" id="phTag"></div><div class="skit__ph-shot" id="phShot"></div></div>
            <img class="skit__img" id="skitImg" alt="">
            <div class="skit__vignette"></div>
          </div>
          <div class="skit__sfx" id="skitSfx"></div>
          <div class="skit__sourced">Satire · every claim sourced in the files</div>
          <div class="skit__lower">
            <div class="skit__nameplate" id="skitName">BRENDA</div>
            <div class="skit__bubble">
              <p class="skit__line" id="skitLine"></p>
              <span class="skit__cont" id="skitCont">tap ▸</span>
            </div>
            <div class="skit__smallprint" id="skitSmall"></div>
            <button class="skit__dig" id="skitDig" hidden>Dig into the file <span class="arrow">→</span></button>
            <div class="skit__end" id="skitEnd" hidden><button class="skit__endbtn" id="skitEndBtn">Explore the files ↓</button></div>
          </div>
        </div>
        <div class="skit__controls">
          <button class="skit__ctl" id="skitPrev">‹ Back</button>
          <div class="skit__dots" id="skitDots"></div>
          <span class="skit__count" id="skitCount"></span>
          <button class="skit__ctl" id="skitAuto">▶ Auto-play</button>
          <button class="skit__ctl skit__skip" id="skitSkip">Skip to the files ⤓</button>
          <button class="skit__ctl skit__nextbtn" id="skitNext">Next ›</button>
        </div>
      </div>`;

    const $ = s => mount.querySelector(s);
    const stage = $("#skitStage"), img = $("#skitImg"), line = $("#skitLine"),
          cont = $("#skitCont"), sfx = $("#skitSfx"), nameEl = $("#skitName"),
          small = $("#skitSmall"), dig = $("#skitDig"), end = $("#skitEnd");

    $("#skitDots").innerHTML = S.map((_, i) => `<button class="skit__dot" data-i="${i}"></button>`).join("");

    img.onerror = () => { img.classList.remove("show"); };
    img.onload  = () => { img.classList.add("show"); };

    function renderScene() {
      window.DSWC_stopSkit();
      const sc = S[si];
      li = 0;
      // scene-change wipe
      const frame = $("#skitFrame");
      frame.classList.remove("swap"); void frame.offsetWidth; frame.classList.add("swap");
      // frame + placeholder
      $("#phTag").textContent = `IMAGE · ${sc.img}.jpg`;
      $("#phShot").textContent = sc.shot;
      img.classList.remove("show");
      img.alt = `Scene ${si + 1}: ${sc.shot}`;
      img.src = IMG_DIR + sc.img + ".jpg";
      // pre-warm the next scene's illustration for a snappy cut
      if (si + 1 < S.length) { const pre = new Image(); pre.src = IMG_DIR + S[si + 1].img + ".jpg"; }
      $("#skitCount").textContent = `${si + 1} / ${S.length}`;
      // chrome
      nameEl.textContent = sc.name;
      sfx.textContent = sc.sfx || "";
      sfx.classList.remove("pop"); void sfx.offsetWidth; if (sc.sfx) sfx.classList.add("pop");
      small.textContent = ""; small.classList.remove("show");
      dig.hidden = true; end.hidden = true;
      // scoreboard
      if (window.DSWC_setScore) window.DSWC_setScore(sc.goal, sc.min);
      // dots
      mount.querySelectorAll(".skit__dot").forEach(d => d.classList.toggle("on", +d.dataset.i === si));
      $("#skitPrev").disabled = si === 0;
      typeLine();
    }

    function typeLine() {
      const sc = S[si], raw = sc.lines[li];
      const text = typeof raw === "string" ? raw : raw.t;
      if (raw && raw.img) {          // mid-scene image swap (easter-egg beats)
        $("#phTag").textContent = `IMAGE · ${raw.img}.jpg`;
        img.classList.remove("show");
        img.src = IMG_DIR + raw.img + ".jpg";
      }
      // expose the full line to assistive tech immediately (typing is visual only)
      stage.setAttribute("aria-label", `${sc.name} says: ${text} — activate to continue`);
      typing = true; cont.classList.remove("show"); line.textContent = "";
      let k = 0;
      clearInterval(typeTimer);
      typeTimer = setInterval(() => {
        line.textContent = text.slice(0, ++k);
        if (k >= text.length) { clearInterval(typeTimer); typing = false; lineDone(); }
      }, 22);
    }

    function lineDone() {
      const sc = S[si];
      cont.classList.add("show");
      const isLast = li === sc.lines.length - 1;
      if (isLast) {
        if (sc.smallprint) { small.textContent = sc.smallprint; small.classList.add("show"); }
        if (sc.dig) { dig.hidden = false; dig.dataset.module = sc.dig; }
        if (sc.end) { end.hidden = false; cont.classList.remove("show"); }
      }
      if (autoOn && !(isLast && sc.end)) autoTimer = setTimeout(advance, isLast ? 1500 : 1100);
    }

    function advance() {
      clearTimeout(autoTimer);
      if (typing) {                       // finish the line instantly
        clearInterval(typeTimer); typing = false;
        const raw = S[si].lines[li];
        line.textContent = typeof raw === "string" ? raw : raw.t;
        lineDone(); return;
      }
      const sc = S[si];
      if (li < sc.lines.length - 1) { li++; typeLine(); }
      else if (si < S.length - 1) { si++; renderScene(); }
      // last scene, lines done: stay (end CTA is showing)
    }
    function prev() { if (si > 0) { si--; renderScene(); } }

    function toFiles() {
      window.DSWC_stopSkit();
      const f = document.querySelector("#files");
      if (f) f.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // interactions
    stage.addEventListener("click", e => { if (!e.target.closest(".skit__dig,.skit__endbtn")) advance(); });
    stage.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); advance(); } });
    $("#skitNext").addEventListener("click", advance);
    $("#skitPrev").addEventListener("click", prev);
    $("#skitSkip").addEventListener("click", toFiles);
    $("#skitEndBtn").addEventListener("click", toFiles);
    dig.addEventListener("click", e => {
      e.stopPropagation();
      // pause the show while the viewer reads the file — don't advance behind the overlay
      window.DSWC_stopSkit();
      if (autoOn) { autoOn = false; const ab = $("#skitAuto"); ab.classList.remove("on"); ab.textContent = "▶ Auto-play"; }
      if (window.DSWC_open) window.DSWC_open(dig.dataset.module);
    });
    $("#skitAuto").addEventListener("click", () => {
      autoOn = !autoOn;
      $("#skitAuto").classList.toggle("on", autoOn);
      $("#skitAuto").textContent = autoOn ? "❚❚ Auto-play" : "▶ Auto-play";
      if (autoOn && !typing) advance();
    });
    $("#skitDots").addEventListener("click", e => {
      const d = e.target.closest(".skit__dot"); if (d) { si = +d.dataset.i; renderScene(); }
    });

    // keyboard arrows (global while skit visible)
    document.addEventListener("keydown", e => {
      if (document.querySelector("#overlay").classList.contains("is-open")) return;
      if (e.key === "ArrowRight") advance();
      else if (e.key === "ArrowLeft") prev();
    });

    renderScene();
  };
})();
