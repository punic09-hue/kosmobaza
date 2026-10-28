/* ===================== v6: короткие бои, задание дня, аркады между волнами, блиц, детали-разъёмы, ползунок времени, сценки, злодей с ошибками, бестиарий ===================== */
const WAVE = 5, ARC_SEC = 35, ARC_SLOW = .6; /* аркады медленнее (Михаил, 26.10) */
/* скорость английской речи: 0 очень медленно (по умолчанию), 1 медленно, 2 обычно */
const SPD = [[.5, "🐢🐢", "Очень медленно"], [.68, "🐢", "Медленно"], [.9, "🐇", "Обычно"]];
const rateOf = slow => { const r = SPD[S.spd ?? 0][0]; return slow ? Math.min(r, .6) : r; };
TT.fix = ["🗣️", "Поправь злодея"]; TT.time = ["⏳", "Ползунок времени"];
MEDALS.find(m => m[0] === "sniper")[3] = "Целая волна (5 задач) без единой подсказки.";
BOLT.push("Новость: злодеи начали болтать с ошибками. Поправляйте их, командир: от этого они слабеют.",
  "В бестиарии пополнение! Побеждай злодеев и узнавай про них правду. На английском, конечно.",
  "Между волнами теперь аркада. Я тренировался ловить слова. Поймал два. Одно было «бутерброд».");

/* ---------- звуки ---------- */
function sfx(k){ if (S.mute) return; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume();
  const P = {ok:["triangle",660,1320,.13], bad:["square",200,110,.2], clack:["square",340,80,.1], pop:["sine",480,1400,.1], tick:["sine",880,880,.06], win:["triangle",520,1560,.4], boom:["sawtooth",160,40,.3]}[k] || ["sine",440,440,.1];
  const t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain(); o.type = P[0]; o.frequency.setValueAtTime(P[1], t); o.frequency.exponentialRampToValueAtTime(P[2], t + P[3]);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.22, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + P[3] + .06); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + P[3] + .1); } catch(e) {} }
/* голос злодея: ниже и медленнее */
function sayV(text){ if (!TTS || S.mute) return; try { speechSynthesis.cancel(); sayId++; const u = new SpeechSynthesisUtterance(text); u.lang = voice ? voice.lang : "en-GB"; if (voice) u.voice = voice; u.rate = rateOf() * .95; u.pitch = .4; speechSynthesis.speak(u); } catch(e) {} }

/* ---------- лазеры (арсенал за кристаллы) ---------- */
const LASERS = [["Голубой","#39D0FF",0],["Изумрудный","#34D27B",10],["Золотой","#FFB000",20],["Плазма","#FF3BD4",30],["Алый","#FF3030",45],["Радуга","rainbow",70]];
function laserCol(){ const l = LASERS[S.laser || 0] || LASERS[0]; return l[1] === "rainbow" ? `hsl(${Math.floor(Math.random() * 360)},100%,60%)` : l[1]; }

/* ---------- детали-разъёмы: правило как форма детали ---------- */
const SHP = {sq:'<rect x="2.5" y="2.5" width="11" height="11" rx="1"/>', tri:'<path d="M2 1.5L15 8L2 14.5Z"/>', rnd:'<circle cx="8" cy="8" r="6.5"/>', nak:'<path d="M8 1L15 8L8 15L1 8Z"/>',
  ing:'<path d="M4.5 1.5h7L15 8l-3.5 6.5h-7L1 8Z"/>', pst:'<path d="M8 1L15 6.5V15H1V6.5Z"/>', to:'<path d="M1 2h14v4.5H10.3V15H5.7V6.5H1Z"/>', plus:'<path d="M5.7 1h4.6v4.7H15v4.6h-4.7V15H5.7v-4.7H1V5.7h4.7Z"/>',
  x:'<path d="M3.2 0.6L8 5.4L12.8 0.6L15.4 3.2L10.6 8L15.4 12.8L12.8 15.4L8 10.6L3.2 15.4L0.6 12.8L5.4 8L0.6 3.2Z"/>', cnt:'<circle cx="4" cy="4.5" r="3"/><circle cx="12" cy="4.5" r="3"/><circle cx="8" cy="12" r="3"/>',
  mass:'<path d="M8 1C11.5 5.5 14 8.6 14 10.8A6 6 0 0 1 2 10.8C2 8.6 4.5 5.5 8 1Z"/>', vow:'<path d="M8 .8l2.2 4.6 5 .6-3.7 3.5 1 5L8 12l-4.5 2.5 1-5L.8 6l5-.6Z"/>', con:'<path d="M10.5 1.2A7 7 0 1 0 14.8 11 5.6 5.6 0 0 1 10.5 1.2Z"/>',
  cmp:'<path d="M1 5.2h7.5V1.5L15 8l-6.5 6.5v-3.7H1Z"/>', sup:'<path d="M1 14V4l4 4 3-6.5L11 8l4-4v10Z"/>', adj:'<circle cx="8" cy="8" r="6" fill="none" stroke-width="3"/>'};
const CNN = {sq:"квадрат", tri:"треугольник", rnd:"круг", nak:"ромб (голый глагол)", ing:"соты -ing", pst:"домик прошлого", to:"буква T", plus:"плюс", x:"крестик", cnt:"точки (можно посчитать)", mass:"капля (не посчитать)", vow:"звезда (гласная)", con:"луна (согласная)", cmp:"стрелка than", sup:"корона «самый»", adj:"колечко"};
const svgS = (c, cls = "") => c ? `<svg class="shp ${cls}" viewBox="0 0 16 16" aria-hidden="true">${SHP[c]}</svg>` : "";
const LEG = {1:[["sq","I → am"],["tri","he / she / it → is"],["rnd","we / you / they → are"]], 2:[["tri","he / she / it → has got"],["rnd","I / we / you / they → have got"]],
  3:[["tri","he / she / it → глагол с -s"],["rnd","I / we / you / they → без -s"],["nak","после do / does / don't → голый глагол"]], 4:[["sq","am"],["tri","is"],["rnd","are"],["ing","после них глагол + ing"]],
  5:[["nak","после can → голый глагол"]], 6:[["tri","has to"],["rnd","have to"],["nak","после них голый глагол"]], 7:[["plus","✚ → some"],["x","✖ и ? → any"],["cnt","many"],["mass","much"],["vow","an"],["con","a"]],
  8:[["pst","прошлое: -ed или код"],["nak","после did / didn't голый глагол"]], 9:[["cmp","+er / more + than"],["sup","the +est / the most"]]};
const VS3 = new Set(VERBS.map(r => r[1])), VING = new Set(VERBS.map(r => r[2]).concat(Object.values(BADING))), VPAST = new Set(VERBS.filter(r => r[3] !== r[0]).map(r => r[3]).concat(Object.values(BADED))), VBASE = new Set(VERBS.map(r => r[0]));
const NAKH = /^(do|does|did|don't|doesn't|didn't|can|can't|have to|has to|don't have to|doesn't have to)$/i;
const hasNak = parts => parts.some(p => NAKH.test(p.t.replace(/[.?!]+$/, "")));
function formShape(w, nak, n){
  w = String(w).toLowerCase().replace(/[.?!]+$/, "").trim();
  if (/^am( not)?$/.test(w)) return "sq";
  if (/^(is|isn't|was|wasn't|has|hasn't|has got|hasn't got|has to|does|doesn't|doesn't have to)$/.test(w)) return "tri";
  if (/^(are|aren't|were|weren't|have|haven't|have got|haven't got|have to|do|don't|don't have to)$/.test(w)) return "rnd";
  if (w === "some") return "plus"; if (w === "any") return "x";
  if (w === "how many") return "cnt"; if (w === "how much") return "mass";
  if (w === "an") return "vow"; if (w === "a") return "con";
  if (n === 9) { if (/^the /.test(w) || /^most /.test(w) || /est$/.test(w)) return "sup";
    if (/^more /.test(w) || ADJ.some(r => r[1] === w) || /er$/.test(w)) return "cmp"; if (ADJ.some(r => r[0] === w)) return "adj"; return null; }
  if (/^to /.test(w)) return "to";
  if (VS3.has(w)) return "tri"; if (VING.has(w)) return "ing"; if (VPAST.has(w)) return "pst";
  if (VBASE.has(w)) return nak ? "nak" : "rnd";
  return null;
}
const AGR = ["sq","tri","rnd"], FWD = ["nak","ing","pst","to","plus","x"], BACK = ["cnt","mass","vow","con","cmp","sup"];
function jointS(n, a, b, nak){
  const sa = formShape(a.t, nak, n), sb = formShape(b.t, nak, n);
  if (a.r === "w" && b.r !== "w") return sb && (AGR.includes(sb) || ["nak","ing","pst"].includes(sb)) ? {c:sb, src:"b"} : null;
  if (b.r === "w" && AGR.includes(sa)) return {c:sa, src:"a"};
  if (FWD.includes(sb) && a.r !== "w") return {c:sb, src:"b"};
  if (BACK.includes(sa)) return {c:sa, src:"a"};
  return null;
}
function ruleBox(t){ return ""; } /* правило на экране боя убрано: Артём его не читает (2026-10-26) */
/* больше кандидатов в лишние детали: потом отбираем те, что не входят в разъём */
function decoys(n, parts, ki, extra = []){
  if (ki < 0) return []; const key = parts[ki].t.replace(/[.?!]$/, ""), punct = parts[ki].t.slice(key.length);
  const pool = [...shuf(extra.map(w => w.replace(/[.?!]$/, ""))), ...shuf(wrongs(n, key, []))].filter((w, i, A) => A.indexOf(w) === i && !parts.some(p => p.t.toLowerCase() === (w + punct).toLowerCase()));
  return pool.slice(0, 8).map(w => ({t:w + punct, r:parts[ki].r}));
}
const blkInner = p => `${p.L ? `<i class="sock">${svgS(p.L)}</i>` : ""}${esc(p.t)}${p.R ? `<i class="plug">${svgS(p.R)}</i>` : ""}`;
const blkCls = p => `blk cn r-${p.r} ${p.L ? "hasL" : ""} ${p.R ? "hasR" : ""}`;

/* ---------- задачи: сборка с разъёмами ---------- */
function taskBuild(t, P, head, nextBtn){
  const n = R.m.n, nak = hasNak(t.parts), J = [null];
  for (let i = 1; i < t.parts.length; i++) J.push(jointS(n, t.parts[i - 1], t.parts[i], nak)); J.push(null);
  const parts = t.parts.map((p, i) => ({...p, L:J[i]?.c || null, R:J[i + 1]?.c || null}));
  const ki = t.ki ?? -1, JL = ki >= 0 ? J[ki] : null, JR = ki >= 0 ? J[ki + 1] : null, need = Math.max(1, 6 - parts.length);
  let dec = (t.dec || []).map(d => { const s = formShape(d.t, nak, n), L = JL ? (JL.src === "b" ? s : JL.c) : null, Rr = JR ? (JR.src === "a" ? s : JR.c) : null;
    return {...d, L, R:Rr, fit:(!JL || L === JL.c) && (!JR || Rr === JR.c)}; });
  if (JL || JR) { const nf = dec.filter(d => !d.fit); if (nf.length) dec = nf; }
  dec = dec.slice(0, need);
  const all = parts.map((p, i) => ({...p, i})).concat(dec.map(p => ({...p, i:-1}))), order = shuf(all.map((p, i) => i)); if (order.every((v, i) => v === i) && order.length > 1) order.push(order.shift());
  P.innerHTML = `${head}<div class="ru">Собери фразу по картинке. Деталь встаёт, только если подходит разъём!</div>${pic(sentence(t.parts))}
   <div class="slots" id="slots">${parts.map(p => `<span class="slot ${R.scaffold ? "s-" + p.r : "s-plain"}">${R.scaffold ? ROLE[p.r] : ""}</span>`).join("")}</div>
   <div class="pool cnpool" id="pool">${order.map((k, j) => `<button class="${blkCls(all[k])}" data-k="${k}" data-key="${j + 1}"><kbd>${j + 1}</kbd>${blkInner(all[k])}</button>`).join("")}</div>
   <div class="row"><button class="say" id="b-listen">🔊 Послушать фразу</button></div>${ruleBox(t)}${nextBtn}`;
  let pos = 0, tries = 0;
  $("#b-listen").onclick = () => say(sentence(t.parts), true);
  P.querySelectorAll("#pool .blk").forEach(btn => btn.onclick = () => {
    const pc = all[+btn.dataset.k], want = parts[pos];
    if (pc.i >= 0 && pc.t === want.t) {
      say(pc.t); sfx("pop");
      P.querySelector(".slot").outerHTML = `<span class="${blkCls(want)} placed">${blkInner(want)}</span>`;
      btn.classList.add("used"); P.querySelectorAll(".glow").forEach(g => g.classList.remove("glow"));
      pos++; tries = 0; $("#hint").innerHTML = "";
      if (pos === parts.length) { if (!R.tasks[R.i].missed) dqEvent("build"); done(sentence(t.parts)); }
      return;
    }
    miss(sentence(t.parts), pc.t); tries++;
    let h;
    if (pc.i < 0 && !pc.fit) {
      btn.classList.remove("bounce"); void btn.offsetWidth; btn.classList.add("bounce"); sfx("clack");
      const last = P.querySelector("#slots .placed:last-of-type .plug"); if (last) { last.classList.remove("nope"); void last.offsetWidth; last.classList.add("nope"); }
      setTimeout(() => btn.classList.add("used"), 520);
      const bad = JL && pc.L !== JL.c ? "L" : "R", Jx = bad === "L" ? JL : JR, nb = bad === "L" ? parts[ki - 1] : parts[ki + 1], my = bad === "L" ? pc.L : pc.R;
      h = `<b>Не входит!</b> ${bad === "L" ? `К детали «${esc(nb.t)}» подходит только разъём` : `Чтобы войти в «${esc(nb.t)}», нужен разъём`} ${svgS(Jx.c, "sb")} <b>${CNN[Jx.c]}</b>, а у этой детали ${my ? svgS(my, "sb") + " " + CNN[my] : "разъёма нет"}.`;
    } else {
      btn.classList.remove("shake"); void btn.offsetWidth; btn.classList.add("shake");
      if (pc.i < 0) btn.classList.add("used");
      h = pc.i < 0 ? "Этот блок лишний: так по-английски не говорят." : pos === 0 && want.r === "h" ? "Это вопрос: красный ПОМОЩНИК прыгает вперёд." : `Сейчас нужен блок <b>${ROLE[want.r]}</b>.`;
      if (want.L) h += ` Ищи деталь с разъёмом ${svgS(want.L, "sb")}.`;
    }
    if (tries >= 2) { h += " Подсвечиваю нужный блок."; P.querySelectorAll("#pool .blk").forEach(b => { const q = all[+b.dataset.k]; if (!b.classList.contains("used") && q.i >= 0 && q.t === want.t) b.classList.add("glow"); }); }
    hint(h);
  });
}

/* ---------- выбор помощника: пока сектор не пройден на ★★★, показываем разъёмы ---------- */
function taskChoose(t, P, head, nextBtn){
  let J = null, nak = false; const n = R.m.n;
  if (t.parts && R.scaffold) { nak = hasNak(t.parts); const k = t.ki, jl = k > 0 ? jointS(n, t.parts[k - 1], t.parts[k], nak) : null, jr = k + 1 < t.parts.length ? jointS(n, t.parts[k], t.parts[k + 1], nak) : null;
    J = jl && jl.src === "b" ? {...jl, side:"L", nb:t.parts[k - 1].t} : jr && jr.src === "a" ? {...jr, side:"R", nb:t.parts[k + 1].t} : null; }
  if (J) { let same = 0; t.o = t.o.filter(o => o === t.a || formShape(o, nak, n) !== J.c || same++ < 1); }
  const parts = t.s.split("___");
  P.innerHTML = `${head}${pic(t.s.replace("___", t.a))}<div class="sent">${esc(parts[0])}<span class="gap" id="gap">${J ? svgS(J.c, "gapS") : "?"}</span>${esc(parts[1])}</div>
   ${J ? `<div class="cnhint">🔌 Разъём у «${esc(J.nb.replace(/[.?!]$/, ""))}»: ${svgS(J.c, "sb")} ${CNN[J.c]}. Найди слово с таким же.</div>` : ""}
   <div class="opts">${t.o.map((o, i) => `<button class="opt" data-i="${i}" data-key="${i + 1}"><kbd>${i + 1}</kbd>${J ? svgS(formShape(o, nak, n), "oS") : ""}${esc(o)}</button>`).join("")}</div>
   <div class="row"><button class="say" id="b-listen">🔊 Послушать</button></div>${ruleBox(t)}${nextBtn}`;
  let tries = 0;
  $("#b-listen").onclick = () => say(t.s, true);
  P.querySelectorAll(".opt").forEach(b => b.onclick = () => {
    const o = t.o[+b.dataset.i];
    if (o === t.a) { b.classList.add("yes"); $("#gap").textContent = o; P.querySelectorAll(".opt").forEach(x => x.disabled = true); done(t.s.replace("___", o)); }
    else { b.classList.add("no"); b.disabled = true; miss(t.s, o); tries++; hint(esc(t.h) + ".");
      if (tries >= 2) P.querySelectorAll(".opt").forEach(x => { if (t.o[+x.dataset.i] === t.a) x.classList.add("glow"); }); }
  });
}

/* ---------- злодей говорит с ошибкой, Артём поправляет ---------- */
const VBRAG = ["Хе-хе! Мой английский идеален!", "Ну что, командир, найдёшь ошибку? Не найдёшь!", "Глюк научил меня говорить ПРАВИЛЬНО. Наверное.", "Я злодей, мне можно!", "Повторяй за мной, малыш!", "Учителя мне не нужны!"];
const VOOPS = ["Ой… You are right, commander!", "Ррр! Ты меня поправил! Мне больно!", "Не может быть… Глюк, ты меня обманул!", "Ладно-ладно, так правильнее. Но я всё равно злой!"];
function makeFix(m, used){
  const clean = w => w.replace(/[.?!]+$/, "");
  for (let tries = 0; tries < 12; tries++) {
    if (Math.random() < .35) { const e = parseErr(pick(m.err)), s = e.toks.join(" "); if (used.has(s)) continue; used.add(s);
      const p = e.fix.slice(clean(e.fix).length); if (p && !e.toks[e.bad].endsWith(p)) e.toks[e.bad] += p; const wr = shuf(wrongs(m.n, clean(e.fix), [clean(e.toks[e.bad])])).slice(0, 2).map(w => w + p);
      return {k:"fix", toks:e.toks, bad:e.bad, fix:e.fix, h:e.h, o:shuf([e.fix, ...wr])}; }
    const g = G[m.n](), s = sentence(g.parts); if (used.has(s) && tries < 11) continue; used.add(s);
    const right = g.parts[g.key].t, p = right.slice(clean(right).length), wr = g.wrong.filter(w => w !== right), bad = wr[0] + (wr[0].endsWith(p) ? "" : p);
    const others = [...wr.slice(1), ...shuf(wrongs(m.n, clean(right), [clean(bad)]))].map(w => clean(w) + p).filter((w, i, A) => A.indexOf(w) === i && w !== bad && w !== right).slice(0, 2);
    return {k:"fix", toks:g.parts.map((q, i) => i === g.key ? bad : q.t), bad:g.key, fix:right, h:g.hint, o:shuf([right, ...others])};
  }
}
function taskFix(t, P, head, nextBtn){
  const B = BOSS[R.m.n], wrongS = t.toks.join(" ");
  P.innerHTML = `${head}<div class="villain cut"><img src="${portrait(R.m.n)}" alt=""><div><div class="eyebrow">${esc(B[1])} говорит</div><div class="vq">«${esc(wrongS)}»</div><div class="joke">${esc(pick(VBRAG))}</div></div></div>
   <div class="ru" id="fx-q">Злодей ошибся! Ты учитель: нажми на неправильное слово.</div>
   <div class="toks" id="fx-t">${t.toks.map((w, i) => `<button class="tok" data-i="${i}" data-key="${i + 1}"><kbd>${i + 1}</kbd>${esc(w)}</button>`).join("")}</div>
   <div class="opts" id="fx-o" hidden></div>
   <div class="row"><button class="say" id="b-listen">🔊 Послушать злодея ещё раз</button></div>${ruleBox(t)}${nextBtn}`;
  sayV(wrongS); GFX.taunt(pick(["Хе-хе! Слушай, как я говорю!", "Я говорю идеально!", "Повторяй за мной!"]));
  let tries = 0, step = 1;
  $("#b-listen").onclick = () => sayV(wrongS);
  P.querySelectorAll("#fx-t .tok").forEach(b => b.onclick = () => {
    if (step !== 1) return; const i = +b.dataset.i;
    if (i === t.bad) { step = 2; sfx("ok"); b.classList.add("badw"); P.querySelectorAll("#fx-t .tok").forEach(x => { x.disabled = true; x.removeAttribute("data-key"); x.querySelector("kbd")?.remove(); });
      $("#fx-q").innerHTML = `Точно, «<b>${esc(t.toks[t.bad])}</b>» тут неправильно. А как надо? Выбери правильное слово.`;
      const O = $("#fx-o"); O.hidden = false; O.innerHTML = t.o.map((o, k) => `<button class="opt" data-o="${k}" data-key="${k + 1}"><kbd>${k + 1}</kbd>${esc(o)}</button>`).join("");
      O.querySelectorAll(".opt").forEach(ob => ob.onclick = () => { const o = t.o[+ob.dataset.o];
        if (o === t.fix) { ob.classList.add("yes"); O.querySelectorAll(".opt").forEach(x => x.disabled = true); b.textContent = t.fix; b.classList.remove("badw"); b.classList.add("yes");
          if (!R.tasks[R.i].missed) dqEvent("fix");
          GFX.taunt(pick(VOOPS)); done(t.toks.map((w, k) => k === t.bad ? t.fix : w).join(" "), `<span>${esc(B[1])}: «${esc(pick(VOOPS))}» <b>${esc(t.toks[t.bad])} → ${esc(t.fix)}</b>. ${esc(t.h)}.</span>`); }
        else { ob.classList.add("no"); ob.disabled = true; miss(wrongS, o); tries++; hint(`Не так. Подсказка: ${esc(t.h)}.`);
          if (tries >= 2) O.querySelectorAll(".opt").forEach(x => { if (t.o[+x.dataset.o] === t.fix) x.classList.add("glow"); }); } });
    } else { b.classList.add("fine"); b.disabled = true; miss(wrongS, t.toks[i]); tries++; hint(`Это слово правильное. Ищи дальше. ${tries >= 2 ? esc(t.h) + "." : ""}`);
      if (tries >= 2) P.querySelectorAll("#fx-t .tok")[t.bad].classList.add("glow"); }
  });
}

/* ---------- ползунок времени: вчера / сейчас / каждый день ---------- */
RV.fly[2] = "летал летала летало летали"; RV.dance[2] = "танцевал танцевала танцевало танцевали"; RV.sing[2] = "пел пела пело пели";
const TIMEV = [["play","plays","playing","played","games"],["eat","eats","eating","ate","pizza"],["watch","watches","watching","watched","cartoons"],["swim","swims","swimming","swam","in the pool"],["draw","draws","drawing","drew","dragons"],["cook","cooks","cooking","cooked","soup"],["sing","sings","singing","sang","in the shower"],["clean","cleans","cleaning","cleaned","the ship"],["dance","dances","dancing","danced","in the kitchen"],["fly","flies","flying","flew","to the Moon"]];
const TWORD = [["yesterday","last night","last Saturday"],["now"],["every day","every morning","after school"]];
const TCAT = [["⏪","вчера","Это было в прошлом: глагол с -ed или код (went, ate, swam)."],["⏱️","сейчас","Это происходит прямо сейчас: am / is / are + глагол-ing."],["🔁","каждый день","Это бывает регулярно: глагол как есть, а у he / she / it змейка -s."]];
function makeTime(m){
  const own = {8:0, 4:1, 3:2}[m.n], cat = Math.random() < .5 ? own : pick([0, 1, 2].filter(c => c !== own)), s = subj(), k = kind(s), v = pick(TIMEV), tw = pick(TWORD[cat]);
  const be = k === "1" ? "am" : k === "3" ? "is" : "are";
  const forms = [v[3], be + " " + v[2], k === "3" ? v[1] : v[0]];
  const en = p => `${s[0]} ${forms[p]} ${v[4]} ${tw}.`, ruN = [8, 4, 3][cat];
  return {k:"time", s:s[0], forms, obj:v[4], tw, cat, en, ru:ruOf(cat === 1 ? `${s[0]} ${forms[1]} ${v[4]}.` : en(cat), ruN), verb:v[0]};
}
function taskTime(t, P, head, nextBtn){
  let p = pick([0, 1, 2].filter(c => c !== t.cat)), tries = 0, sid = 0;
  P.innerHTML = `${head}<div class="ru">Двигай ползунок времени! Поставь глагол под слово-сигнал <b class="tsig">${esc(t.tw)}</b>.</div>
   <div class="tscene" id="ts"></div><div class="sent tsent" id="ts-s"></div>
   <div class="tslider"><input type="range" min="0" max="2" step="1" id="ts-r" aria-label="Время"><div class="tlabels">${TCAT.map((c, i) => `<button data-p="${i}" data-key="${i + 1}"><kbd>${i + 1}</kbd>${c[0]} ${c[1]}</button>`).join("")}</div></div>
   <div class="row"><button class="big" id="ts-ok">✓ Готово</button></div>${ruleBox(t)}${nextBtn}`;
  const draw = speak => { $("#ts-r").value = p; P.querySelectorAll(".tlabels button").forEach((b, i) => b.classList.toggle("on", i === p));
    $("#ts").className = "tscene t-" + p; $("#ts").innerHTML = actorsHTML(t.en(p), true) + `<span class="tbadge">${TCAT[p][0]} ${p === 1 ? "LIVE" : TCAT[p][1]}</span>`;
    $("#ts-s").innerHTML = `${esc(t.s)} <span class="tv">${esc(t.forms[p])}</span> ${esc(t.obj)} <b class="tsig">${esc(t.tw)}</b>.`;
    if (speak) { const id = ++sid; setTimeout(() => { if (id === sid) say(t.en(p)); }, 350); } };
  draw(false);
  $("#ts-r").oninput = e => { p = +e.target.value; draw(true); };
  P.querySelectorAll(".tlabels button").forEach(b => b.onclick = () => { if ($("#ts-ok").disabled) return; p = +b.dataset.p; sfx("tick"); draw(true); });
  $("#ts-ok").onclick = () => {
    if (p === t.cat) { $("#ts-ok").disabled = true; $("#ts-r").disabled = true; P.querySelectorAll(".tlabels button").forEach(b => { b.disabled = true; b.removeAttribute("data-key"); });
      if (!R.tasks[R.i].missed) dqEvent("time"); done(t.en(p), `<span>${TCAT[p][0]} <b>${esc(t.tw)}</b> → <b>${esc(t.forms[p])}</b></span>`); }
    else { miss(t.en(t.cat), t.forms[p]); tries++; sfx("bad"); $("#ts-s").classList.remove("shake"); void $("#ts-s").offsetWidth; $("#ts-s").classList.add("shake");
      hint(`Сигнал <b>${esc(t.tw)}</b> значит «${TCAT[t.cat][1]}». ${TCAT[t.cat][2]}${tries >= 2 ? " Подсвечиваю нужное время." : ""}`);
      if (tries >= 2) P.querySelectorAll(".tlabels button")[t.cat].classList.add("glow"); }
  };
}

/* ---------- мини-сценка перед заданием: злодей действует, фраза звучит ---------- */
const ACT = [[/\b(fly|flies|flying|flew)\b/,"a-fly"],[/\b(run|runs|running|ran)\b/,"a-run"],[/\b(swim|swims|swimming|swam)\b/,"a-swim"],[/\b(jump|jumps|jumping|jumped)\b/,"a-jump"],[/\b(dance|dances|dancing|danced)\b/,"a-dance"],
  [/\b(eat|eats|eating|ate|hungry)\b/,"a-eat"],[/\b(sleep|sleeps|sleeping|slept)\b/,"a-sleep"],[/\b(cook|cooks|cooking|cooked|make|makes|making|made|build|builds|building|built|fix|fixes|clean|cleans|wash|washes)\b/,"a-work"],
  [/\b(sing|sings|singing|sang)\b/,"a-sing"],[/\b(fight|fights|fighting|fought|attack|attacking|win|won)\b/,"a-fight"]];
function lexItems(sent){
  const low = " " + sent.toLowerCase().replace(/[.,!?]/g, " ").replace(/\s+/g, " ") + " "; let rest = low; const items = [];
  for (const [k, e, pl, tm] of LEX) { const key = " " + k + " "; let i = rest.indexOf(key);
    while (i >= 0) { items.push({i, e, pl, tm}); rest = rest.slice(0, i) + " " + "#".repeat(k.length) + " " + rest.slice(i + key.length); i = rest.indexOf(key); } }
  items.sort((a, b) => a.i - b.i); const uniq = []; items.forEach(o => { if (!uniq.some(u => u.e === o.e)) uniq.push(o); });
  return {main:uniq.filter(o => !o.tm).slice(0, 4), tms:uniq.filter(o => o.tm).slice(0, 2)};
}
function actorsHTML(sent, noTime){
  const {main, tms} = lexItems(sent), low = sent.toLowerCase(), act = (ACT.find(([re]) => re.test(low)) || [0, "a-bob"])[1];
  const neg = /n't|\bnot\b/.test(low), q = /\?\s*$/.test(sent.trim()), cmp = /\bthan\b/.test(low), sup = /\bthe \w+est\b|\bthe most\b|\bthe best\b/.test(low);
  return `<div class="actors">${main.map((o, k) => `<span class="act ${k === 0 ? (cmp || sup ? "a-grow" : act) : cmp && k === main.length - 1 ? "a-shrink" : "a-in"}" style="animation-delay:${k ? .25 * k : 0}s">${o.pl ? o.e.repeat(3) : o.e}${k === 0 && act === "a-sleep" ? '<i class="zz">💤</i>' : ""}${k === 0 && act === "a-sing" ? '<i class="zz">🎵</i>' : ""}${k === 0 && sup ? '<i class="zz">🏆</i>' : ""}</span>`).join("")}${neg ? '<span class="act a-no">🚫</span>' : ""}${q ? '<span class="act a-q">❓</span>' : ""}</div>${noTime ? "" : tms.map(o => `<span class="tm2">${o.e}</span>`).join("")}`;
}
function showScene(t, cb){
  const en = t.k === "build" ? sentence(t.parts) : t.s.replace("___", t.a), B = BOSS[R.m.n], words = en.split(" ");
  R.paused = true; hud(); let gone = false, timers = [];
  $("#play").innerHTML = `<div class="ttype k-scene">🎬 Сценка · смотри и слушай</div><div class="scn" id="scn">${actorsHTML(en)}</div>
   <div class="villain cut"><img src="${portrait(R.m.n)}" alt=""><div><div class="eyebrow">${esc(B[1])} показывает</div><div class="vq" id="scn-q">${words.map(w => `<span>${esc(w)}</span>`).join(" ")}</div></div></div>
   <div class="row"><button class="big" id="scn-go" data-key="1"><kbd>1</kbd>Понятно, к заданию →</button></div>`;
  GFX.taunt(pick(["Смотри, что творится!", "Хе-хе, слушай!", "Look! Look!", "Смотри внимательно!"]));
  const W = [...document.querySelectorAll("#scn-q span")];
  timers.push(setTimeout(() => say(en, true), 500));
  W.forEach((w, i) => timers.push(setTimeout(() => w.classList.add("on"), 600 + i * 420)));
  const go = () => { if (gone) return; gone = true; timers.forEach(clearTimeout); R.paused = false; cb(); };
  $("#scn-go").onclick = go; $("#scn").onclick = go; timers.push(setTimeout(go, 12000));
}

/* ---------- порядок заданий в коротком бою ---------- */
var patternFor = function(n){ const T = [3, 4, 8].includes(n);
  return ["choose","build","fix","listen", T ? "time" : "build", "build","choose","fix", T ? "time" : "listen","choose"]; }
function task(){ const t = R.tasks[R.i];
  if (S.cfg.scenes && !t.sceneShown && R.i % WAVE === 0 && (t.k === "build" || t.k === "choose")) { t.sceneShown = true; return showScene(t, taskInner); }
  taskInner(); }
const EXT_T = {build:taskBuild, choose:taskChoose, fix:taskFix, time:taskTime};

/* ---------- между волнами: аркада ---------- */
function pause(){
  if (R.waveWrong === 0) R.sniper = true; R.waveWrong = 0; R.paused = true;
  if (!S.cfg.arcade || ["catch","rocks","tir","feed","mole","gum"].every(k => (S.cfg.arcOff || []).includes(k))) { const b = pick(BREAKS);
    $("#play").innerHTML = `<div class="breakscr"><div class="ttype">⏸ Время на паузе</div><div class="em">${b[0]}</div><h2>Волна ${R.i / WAVE} отбита!</h2><p>${esc(b[1])}</p><button class="big" id="b-cont">Готов, в бой!</button></div>`;
    $("#b-cont").onclick = () => { R.paused = false; task(); }; return; }
  const K = ["catch","rocks","tir","feed","mole","gum"].filter(k => !(S.cfg.arcOff || []).includes(k)), last = S.arcLast; let kd = pick(K.length > 1 ? K.filter(k => k !== last) : K); S.arcLast = kd; save();
  ARC.run(R.m.n, kd, () => { R.paused = false; show("v-play"); task(); });
}

/* ---------- короткий кусок фразы с пропуском (для аркад и блица) ---------- */
function MP(n){
  let g; for (let k = 0; k < 6; k++) { g = G[n](); if (!(n === 8 && g.key === 0)) break; }
  const cl = w => w.replace(/[.?!]+$/, ""), right = cl(g.parts[g.key].t);
  const bad = [...g.wrong.map(cl), ...shuf(wrongs(n, right, g.wrong.map(cl)))].filter((w, i, A) => A.indexOf(w) === i && w.toLowerCase() !== right.toLowerCase()).slice(0, 2);
  const key = g.key; let s = Math.max(0, key - 1), e = key === 0 ? 1 : key; if (key > 0 && g.parts[0].r === "h") s = 0; if ((n === 7 || n === 9) && key + 1 < g.parts.length) e = Math.max(e, key + 1);
  if (key === 0 && g.parts[2] && !/[tn]/.test(g.parts[2].r)) e = Math.max(e, 2);
  const idx = []; for (let i = s; i <= e; i++) idx.push(i);
  if (n === 8) { const ti = g.parts.findIndex(p => p.r === "n"); if (ti > e) idx.push(ti); }
  const ch = w => idx.map(i => i === key ? w : cl(g.parts[i].t)).join(" ");
  return {gap:ch("___"), good:right, bad, goodC:ch(right), badC:ch(bad[0] || right + "s"), hint:g.hint};
}

/* ---------- аркады ---------- */
const ARC = (() => {
  const A = {raf:0, c:null, x:null, d:1};
  const KINDS = {catch:["🧲 Ловец слов","Лови падающее слово, которое подходит к фразе. Нажимай на дорожку (или стрелки ← →), чтобы двигать героя."],
    rocks:["☄️ Метеоритный дождь","На астероидах фразы. Сбивай только те, где есть ОШИБКА! Правильные фразы не трогай."],
    tir:["🎯 Тир на скорость","Стреляй в слово, которое подходит к фразе. Быстрее 2 секунд: двойные очки!"],
    feed:["🍕 Покорми монстра","Монстр голодный! Кидай ему в пасть еду с ПРАВИЛЬНЫМ словом. Неправильную он выплюнет. Чем больше съест, тем толще станет!"],
    mole:["🔨 Бонк пришельцев","Из норок вылезают пришельцы с табличками. Бонкни того, у кого правильное слово!"],
    gum:["🫧 Жвачка","Всплывают пузыри с фразами. Лопай только ПРАВИЛЬНЫЕ. Неправильный пузырь лопнет жвачкой прямо на экран!"]};
  let st = null;
  const FONT = s => `700 ${Math.round(s)}px Andika, "Exo 2", sans-serif`;
  function resize(){ const r = A.c.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1); A.d = d; A.c.width = Math.max(1, Math.round(r.width * d)); A.c.height = Math.max(1, Math.round(r.height * d)); }
  function ov(html){ const o = $("#arc-ov"); o.innerHTML = html; o.hidden = !html; }
  function run(n, kind, done){
    const K = KINDS[kind]; $("#arc-t").textContent = K[0]; $("#arc-best").textContent = (S.arcBest || {})[kind] || 0; $("#arc-sc").textContent = "0"; $("#arc-bar").style.width = "100%";
    show("v-arc"); A.c = $("#acv"); A.x = A.c.getContext("2d"); resize();
    st = {n, kind, done, score:0, t:0, left:ARC_SEC + 5 * gearLv("boots"), phase:"intro", items:[], fx:[], flash:0, red:0, lane:1, hx:-1, q:null, spawn:0, nextR:0, cd:3, laser:null};
    ov(`<div class="arc-card"><div class="eyebrow">Перезарядка между волнами · время боя на паузе</div><h2>${K[0]}</h2><p>${K[1]}</p><button class="big" id="arc-go">Поехали!</button></div>`);
    $("#arc-go").onclick = () => { ov(""); st.phase = "count"; sfx("tick"); };
    A.c.onpointerdown = e => { if (!st || st.phase !== "play") return; e.preventDefault(); const r = A.c.getBoundingClientRect(); G2[st.kind].tap((e.clientX - r.left) * A.d, (e.clientY - r.top) * A.d); };
    if (!A.raf) { A.last = 0; A.raf = requestAnimationFrame(loop); }
  }
  function key(e){ if (!st) return false;
    if (st.phase === "play") { if (st.kind === "catch" && (e.key === "ArrowLeft" || e.key === "ArrowRight")) { st.lane = Math.max(0, Math.min(2, st.lane + (e.key === "ArrowLeft" ? -1 : 1))); return true; }
      if (st.kind === "tir" && /^[1-3]$/.test(e.key)) { const T = st.items.filter(o => o.alive).sort((a, b) => a.x - b.x)[+e.key - 1]; if (T) G2.tir.tap(T.x, T.y); return true; }
      if (["feed", "mole"].includes(st.kind) && /^[1-3]$/.test(e.key)) { G2[st.kind].pick(+e.key - 1); return true; }
      if (st.kind === "rocks" && e.key === " ") { const T = st.items.filter(o => o.alive && !o.safe).sort((a, b) => a.x - b.x)[0]; if (T) G2.rocks.tap(T.x, T.y); return true; } }
    if (e.key === "Enter") { const b = $("#arc-go") || $("#arc-end"); if (b) { b.click(); return true; } }
    return false; }
  function stop(){ if (A.raf) cancelAnimationFrame(A.raf); A.raf = 0; }
  function loop(ts){ A.raf = requestAnimationFrame(loop); if (!st || document.hidden || $("#v-arc").hidden) return;
    if (A.c.width !== Math.round(A.c.getBoundingClientRect().width * A.d)) resize();
    const dt = Math.min(.05, A.last ? (ts - A.last) / 1000 : .016); A.last = ts; st.t += dt;
    if (st.phase === "count") { st.cd -= dt; if (Math.ceil(st.cd) !== Math.ceil(st.cd + dt) && st.cd > 0) sfx("tick"); if (st.cd <= 0) { st.phase = "play"; G2[st.kind].init(); sfx("pop"); } }
    else if (st.phase === "play") { st.left -= dt; $("#arc-bar").style.width = Math.max(0, 100 * st.left / (ARC_SEC + 5 * gearLv("boots"))) + "%"; G2[st.kind].update(dt * ARC_SLOW); if (st.left <= 0) end(); }
    draw(dt); }
  function end(){ st.phase = "end"; sfx("win"); const sc = st.score, k = st.kind; S.arcBest = S.arcBest || {}; const rec = sc > (S.arcBest[k] || 0); if (rec) S.arcBest[k] = sc;
    const gm = Math.floor(sc / 5); S.gems = (S.gems || 0) + gm; save(); dqEvent("arcade", {score:sc});
    ov(`<div class="arc-card"><div class="eyebrow">Время вышло</div><h2>${sc} ${sc % 10 === 1 && sc % 100 !== 11 ? "очко" : sc % 10 >= 2 && sc % 10 <= 4 && (sc % 100 < 10 || sc % 100 >= 20) ? "очка" : "очков"}${rec && sc ? " · 🏆 рекорд!" : ""}</h2>
      <p>${gm ? `+${gm} 💎 кристаллов в арсенал. ` : "Кристалл даётся за каждые 5 очков. "}Рекорд: ${S.arcBest[k] || 0}.</p><p class="joke">${esc(pick(BREAKS)[1])}</p>
      <button class="big" id="arc-end">В бой! Волна ${Math.floor(R.i / WAVE) + 1} →</button></div>`);
    $("#arc-end").onclick = () => { ov(""); stop(); const cb = st.done; st = null; cb(); }; }
  const addScore = (v, X, Y, col) => { st.score = Math.max(0, st.score + v); $("#arc-sc").textContent = st.score; st.fx.push({txt:(v > 0 ? "+" : "") + v, x:X, y:Y, life:1, col}); };
  function burst(X, Y, col, k = 26){ const d = A.d; for (let i = 0; i < k; i++) { const a = Math.random() * Math.PI * 2, s = (60 + Math.random() * 260) * d; st.fx.push({p:1, x:X, y:Y, vx:Math.cos(a) * s, vy:Math.sin(a) * s, life:.5 + Math.random() * .5, col:Math.random() < .5 ? col : "#fff", r:(1.5 + Math.random() * 2.5) * d}); } }
  function pillW(x, txt, size){ x.font = FONT(size); return x.measureText(txt).width + size * 1.2; }
  function pill(x, txt, cx, cy, size, fill, stroke){ const w = pillW(x, txt, size), h = size * 1.75; GFX.rc(x, cx - w / 2, cy - h / 2, w, h, h / 2, fill, stroke, 2 * A.d);
    x.fillStyle = "#fff"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(txt, cx, cy + size * .05); return w; }
  function hero(x, X, Y, h, t){ const s = h / GFX.SP.hero.h; x.save(); x.translate(X, Y); x.scale(s, s); x.lineJoin = "round"; x.lineCap = "round"; GFX.SP.hero.draw(x, t); x.restore();
    GFX.glowAt(x, X + 62 * s, Y + 32 * s, 16 * s, "#39D0FF", .5); return [X + GFX.SP.hero.muzzle[0] * s, Y + GFX.SP.hero.muzzle[1] * s]; }
  function prompt(x, txt, W, size, ok){ const w = Math.min(W * .94, pillW(x, txt, size * 1.15) + size * 2), h = size * 2.6, X = (W - w) / 2, Y = size * .7;
    GFX.rc(x, X, Y, w, h, 14 * A.d, ok ? "rgba(20,90,50,.92)" : "rgba(8,14,30,.88)", ok ? "#34D27B" : "#39D0FF", 2 * A.d); x.font = FONT(size * 1.15); x.fillStyle = ok ? "#CFFFE0" : "#fff"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(txt, W / 2, Y + h / 2); return Y + h; }
  function laser(x, from, to, a){ x.save(); x.globalCompositeOperation = "lighter"; x.lineCap = "round"; const col = st.laserCol || "#39D0FF";
    [[18, .15], [8, .45], [3, 1]].forEach(([w, al], i) => { x.strokeStyle = i === 2 ? "#fff" : col; x.globalAlpha = al * a; x.lineWidth = w * A.d; x.beginPath(); x.moveTo(from[0], from[1]); x.lineTo(to[0], to[1]); x.stroke(); }); x.restore(); }
  function draw(dt){ const x = A.x, W = A.c.width, H = A.c.height, d = A.d, t = st ? st.t : 0; if (!st) return;
    x.save(); x.clearRect(0, 0, W, H); x.drawImage(GFX.bg(st.n, W, H), 0, 0); x.fillStyle = "rgba(4,8,20,.45)"; x.fillRect(0, 0, W, H);
    if (st.phase === "count") { x.font = `${Math.round(H * .3)}px "Russo One", sans-serif`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = "#FFD84D"; x.globalAlpha = st.cd % 1; x.fillText(Math.max(1, Math.ceil(st.cd)), W / 2, H / 2); x.globalAlpha = 1; }
    if (st.phase === "play" || st.phase === "end") G2[st.kind].draw(x, W, H, d, t, dt);
    st.fx = st.fx.filter(o => (o.life -= dt) > 0);
    for (const o of st.fx) { if (o.p) { o.vy += 300 * d * dt; o.x += o.vx * dt; o.y += o.vy * dt; x.globalAlpha = Math.min(1, o.life * 2); x.fillStyle = o.col; x.beginPath(); x.arc(o.x, o.y, o.r, 0, 7); x.fill(); }
      else { o.y -= 50 * d * dt; x.globalAlpha = Math.min(1, o.life * 2); x.font = `${Math.round(30 * d)}px "Russo One", sans-serif`; x.textAlign = "center"; x.lineWidth = 5 * d; x.strokeStyle = "#000"; x.strokeText(o.txt, o.x, o.y); x.fillStyle = o.col; x.fillText(o.txt, o.x, o.y); } }
    x.globalAlpha = 1;
    if (st.red > 0) { st.red -= dt * 2; x.fillStyle = `rgba(220,0,30,${Math.max(0, st.red) * .35})`; x.fillRect(0, 0, W, H); }
    if (st.flash > 0) { st.flash -= dt * 2.5; x.fillStyle = `rgba(80,255,160,${Math.max(0, st.flash) * .22})`; x.fillRect(0, 0, W, H); }
    x.restore(); }
  const fs = () => Math.max(17 * A.d, Math.min(30 * A.d, A.c.width / 34));
  const G2 = {
    catch:{
      init(){ st.lane = 1; st.hx = -1; this.round(); },
      round(){ st.q = MP(st.n); st.okShow = 0; const ws = shuf([{w:st.q.good, ok:1}, ...st.q.bad.map(w => ({w, ok:0}))]).slice(0, 3); st.items = ws.map((o, i) => ({...o, lane:i, y:-30 * A.d, alive:1})); },
      update(dt){ const H = A.c.height, d = A.d, v = H * (.2 + .012 * Math.min(25, st.score)), hy = H * .78;
        if (st.okShow > 0) { st.okShow -= dt; if (st.okShow <= 0) this.round(); return; }
        let all = true;
        for (const o of st.items) { o.y += v * dt; if (o.y < H + 40 * d) all = false;
          if (o.alive && o.y > hy - 10 * d && o.y < hy + 50 * d && o.lane === st.lane) { o.alive = 0; const X = this.lx(o.lane);
            if (o.ok) { addScore(1, X, hy - 30 * d, "#34D27B"); burst(X, o.y, "#34D27B"); sfx("ok"); st.flash = 1; st.okShow = .55; st.okTxt = st.q.goodC; }
            else { addScore(-1, X, hy - 30 * d, "#FF6B6B"); burst(X, o.y, "#FF4040", 14); sfx("bad"); st.red = 1; } } }
        if (all && st.okShow <= 0) this.round(); },
      lx(l){ return A.c.width * (l + .5) / 3; },
      tap(X){ st.lane = Math.max(0, Math.min(2, Math.floor(X / (A.c.width / 3)))); },
      draw(x, W, H, d, t, dt){ const size = fs(), top = prompt(x, st.okShow > 0 ? st.okTxt : st.q ? st.q.gap : "", W, size, st.okShow > 0);
        x.strokeStyle = "rgba(57,208,255,.18)"; x.lineWidth = 2 * d; x.setLineDash([10 * d, 12 * d]); [1, 2].forEach(i => { x.beginPath(); x.moveTo(W * i / 3, top + 10 * d); x.lineTo(W * i / 3, H); x.stroke(); }); x.setLineDash([]);
        const tx = this.lx(st.lane); st.hx = st.hx < 0 ? tx : st.hx + (tx - st.hx) * Math.min(1, dt * 14);
        x.fillStyle = "rgba(57,208,255,.08)"; x.fillRect(tx - W / 6, top + 10 * d, W / 3, H);
        for (const o of st.items) if (o.alive) { const X = this.lx(o.lane); GFX.glowAt(x, X, o.y, 40 * d, "#39D0FF", .5); pill(x, o.w, X, o.y, size, "rgba(18,32,64,.95)", "#7FD8FF"); }
        const hh = H * .2; hero(x, st.hx - hh * .42, H * .78, hh, t); }
    },
    rocks:{
      init(){ st.items = []; st.spawn = .2; st.laser = null; },
      update(dt){ const W = A.c.width, H = A.c.height, d = A.d; st.spawn -= dt;
        if (st.spawn <= 0 && st.items.filter(o => o.alive).length < 4) { st.spawn = Math.max(.85, 1.7 - st.score * .04); const q = MP(st.n), bad = Math.random() < .55, txt = bad ? q.badC : q.goodC, size = fs() * .82;
          A.x.font = FONT(size); const r = Math.max(46 * d, A.x.measureText(txt).width / 2 + 16 * d), top = H * .12 + r;
          st.items.push({txt, bad, r, size, x:W + r, y:top + Math.random() * Math.max(1, H * .92 - r - top), vx:-(W / 8.5 + st.score * 4 * d) * (.8 + Math.random() * .4), rot:Math.random() * 6, vr:(Math.random() - .5) * .6, alive:1, seed:Math.random() * 1000}); }
        for (const o of st.items) { o.x += o.vx * dt; o.rot += o.vr * dt; if (o.x < -o.r) o.alive = 0; }
        st.items = st.items.filter(o => o.alive || o.dead > 0); st.items.forEach(o => { if (o.dead > 0) o.dead -= dt; }); },
      tap(X, Y){ const o = st.items.filter(o => o.alive && !o.safe).find(o => Math.hypot(o.x - X, o.y - Y) < o.r * 1.15); if (!o) return;
        st.laserCol = laserCol(); st.laser = {to:[o.x, o.y], life:.25};
        if (o.bad) { o.alive = 0; addScore(1, o.x, o.y, "#34D27B"); burst(o.x, o.y, "#FFB04A", 34); sfx("boom"); st.flash = .6; }
        else { o.safe = 1; addScore(-1, o.x, o.y, "#FF6B6B"); sfx("bad"); st.red = 1; } },
      draw(x, W, H, d, t, dt){ const hh = H * .22, mz = hero(x, W * .015, H * .5 - hh * .55, hh, t);
        for (const o of st.items) { if (!o.alive) continue; x.save(); x.translate(o.x, o.y);
          x.save(); x.rotate(o.rot); x.beginPath(); for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2, rr = o.r * (.88 + .12 * Math.sin(o.seed + k * 2.3)); x.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } x.closePath();
          x.fillStyle = GFX.rg(x, -o.r * .3, -o.r * .3, o.r * 1.3, o.safe ? ["#5FBF8A", "#1F5A3A"] : ["#9C8C7C", "#5A4A3E", "#2A221C"]); x.fill(); x.strokeStyle = "#0B0612"; x.lineWidth = 2.5 * d; x.stroke();
          [[.35, -.25, .2], [-.4, .3, .16], [.1, .45, .12]].forEach(([cx, cy, cr]) => GFX.el(x, cx * o.r, cy * o.r, cr * o.r, cr * o.r * .8, "rgba(0,0,0,.28)", null)); x.restore();
          pill(x, o.txt, 0, 0, o.size, o.safe ? "rgba(20,90,50,.95)" : "rgba(10,14,28,.88)", o.safe ? "#34D27B" : "#FFB04A");
          if (o.safe) { x.font = FONT(o.size * .8); x.fillStyle = "#CFFFE0"; x.textAlign = "center"; x.fillText("✓ правильная!", 0, -o.r - 6 * d); }
          x.restore(); }
        if (st.laser) { st.laser.life -= dt; laser(x, mz, st.laser.to, Math.max(0, st.laser.life * 4)); if (st.laser.life <= 0) st.laser = null; } }
    },
    tir:{
      init(){ this.round(); },
      round(){ const W = A.c.width, H = A.c.height, d = A.d; st.q = MP(st.n); st.t0 = st.t; st.lim = Math.max(3.2, 6 - st.score * .06); st.okShow = 0;
        const ws = shuf([{w:st.q.good, ok:1}, ...st.q.bad.map(w => ({w, ok:0}))]).slice(0, 3), r = Math.min(W, H) * .1, pts = [];
        for (const o of ws) { let p, k = 0; do { p = {x:r * 1.3 + Math.random() * (W - r * 2.6), y:H * .3 + r + Math.random() * (H * .66 - r * 2.2)}; k++; } while (k < 80 && pts.some(q => Math.abs(q.x - p.x) < r * 3.4 && Math.abs(q.y - p.y) < r * 3)); pts.push(p); Object.assign(o, p, {r, alive:1, born:st.t}); }
        st.items = ws; },
      update(dt){ if (st.okShow > 0) { st.okShow -= dt; if (st.okShow <= 0) this.round(); return; } if (st.t - st.t0 > st.lim) { sfx("tick"); this.round(); } },
      tap(X, Y){ if (st.okShow > 0) return; const o = st.items.find(o => o.alive && Math.hypot(o.x - X, o.y - Y) < o.r * 1.25); if (!o) return;
        st.laserCol = laserCol(); st.laser = {to:[o.x, o.y], life:.22};
        if (o.ok) { const fast = st.t - st.t0 < 2.2, v = fast ? 2 : 1; addScore(v, o.x, o.y - o.r, fast ? "#FFD84D" : "#34D27B"); if (fast) st.fx.push({txt:"БЫСТРО!", x:o.x, y:o.y - o.r * 1.8, life:.9, col:"#FFD84D"});
          burst(o.x, o.y, "#FFD84D", 30); sfx("ok"); st.flash = .8; o.alive = 0; st.okShow = .5; st.okTxt = st.q.goodC; }
        else { o.alive = 0; addScore(-1, o.x, o.y - o.r, "#FF6B6B"); burst(o.x, o.y, "#FF4040", 14); sfx("bad"); st.red = 1; } },
      draw(x, W, H, d, t, dt){ const size = fs(), top = prompt(x, st.okShow > 0 ? st.okTxt : st.q ? st.q.gap : "", W, size, st.okShow > 0);
        if (st.okShow <= 0) { const p = Math.max(0, 1 - (st.t - st.t0) / st.lim); x.fillStyle = p < .3 ? "#FF6B6B" : "#39D0FF"; x.fillRect(W / 2 - W * .3 * p, top + 6 * d, W * .6 * p, 5 * d); }
        for (const o of st.items) { if (!o.alive) continue; const k = Math.min(1, (st.t - o.born) * 6), r = o.r * k;
          ["#F2F2F2", "#D62828", "#F2F2F2", "#D62828"].forEach((c, i) => GFX.el(x, o.x, o.y, r * (1 - i * .24), r * (1 - i * .24), c, i ? null : "#0B0612", 2.5 * d));
          pill(x, o.w, o.x, o.y + r + size * .9, size, "rgba(10,14,28,.92)", "#FFD84D"); }
        const mz = [W / 2, H + 10 * d];
        if (st.laser) { st.laser.life -= dt; laser(x, mz, st.laser.to, Math.max(0, st.laser.life * 4)); if (st.laser.life <= 0) st.laser = null; } }
    }
    ,
    /* покорми монстра: кидай в пасть еду с правильным словом; монстр толстеет */
    feed:{
      FOOD:["🍕","🍔","🌭","🍩","🍗","🥨","🧁","🌮"],
      init(){ st.fat = 0; st.fly = null; this.round(); },
      round(){ st.q = MP(st.n); st.okShow = 0; const fd = shuf(this.FOOD); st.items = shuf([{w:st.q.good, ok:1}, ...st.q.bad.map(w => ({w, ok:0}))]).slice(0, 3).map((o, i) => ({...o, i, e:fd[i], alive:1})); },
      geo(W, H){ const sp = GFX.SP[GFX.VS[st.n]], h = H * (.36 + Math.min(.16, st.fat * .012)), s = h / sp.h, w = sp.w * s, X = W * .5 - w / 2, Y = H * .2;
        const m = sp.mouth || [sp.w * .2, sp.h * .4]; return {sp, s, w, h, X, Y, mx:X + m[0] * s, my:Y + m[1] * s}; },
      slot(i, W, H){ return [W * (.2 + i * .3), H * .84]; },
      update(dt){ if (st.fly) { st.fly.t += dt * 1.6; if (st.fly.t >= 1) { const o = st.fly.o; st.fly = null; const g = this.geo(A.c.width, A.c.height);
          if (o.ok) { st.fat++; addScore(1, g.mx, g.my - 30 * A.d, "#34D27B"); st.fx.push({txt:pick(["НЯМ!","ЧАВК!","ВКУСНО!","ЕЩЁ!"]), x:g.mx, y:g.my - 60 * A.d, life:1, col:"#FFD84D"}); burst(g.mx, g.my, "#FFD84D", 20); sfx("ok"); st.flash = .6; st.okShow = .7; st.okTxt = st.q.goodC; }
          else { addScore(-1, g.mx, g.my - 30 * A.d, "#FF6B6B"); st.fx.push({txt:pick(["ФУ!","ТЬФУ!","БЕЕЕ!","НЕВКУСНО!"]), x:g.mx, y:g.my - 60 * A.d, life:1, col:"#9CFF6A"}); burst(g.mx, g.my, "#7CDB5A", 22); sfx("bad"); st.red = .6; st.spit = {x:g.mx, y:g.my, t:0, e:o.e}; } } }
        if (st.spit) { st.spit.t += dt * 1.5; if (st.spit.t > 1) st.spit = null; }
        if (st.okShow > 0) { st.okShow -= dt; if (st.okShow <= 0) this.round(); } },
      tap(X, Y){ if (st.fly || st.okShow > 0) return; const W = A.c.width, H = A.c.height; const o = st.items.find(o => o.alive && Math.hypot(this.slot(o.i, W, H)[0] - X, this.slot(o.i, W, H)[1] - Y) < W * .14); if (!o) return; this.throw(o); },
      pick(k){ const o = st.items.filter(o => o.alive)[k]; if (o && !st.fly && st.okShow <= 0) this.throw(o); },
      throw(o){ o.alive = 0; st.fly = {o, t:0, from:this.slot(o.i, A.c.width, A.c.height)}; sfx("pop"); },
      draw(x, W, H, d, t){ const size = fs(); prompt(x, st.okShow > 0 ? st.okTxt : st.q ? st.q.gap : "", W, size, st.okShow > 0);
        const g = this.geo(W, H), wob = 1 + Math.sin(t * 3) * .02 + (st.fat ? Math.sin(t * 9) * .006 * st.fat : 0); x.save(); x.translate(g.X + g.w / 2, g.Y + g.h); x.scale(wob + st.fat * .015, wob); x.translate(-g.w / 2, -g.h); x.scale(g.s, g.s); x.lineJoin = "round"; g.sp.draw(x, t * 2, {}); x.restore();
        GFX.glowAt(x, g.mx, g.my, 30 * d, "#FF3B3B", .4 + .3 * Math.sin(t * 6));
        if (st.fat) { x.font = FONT(size * .8); x.fillStyle = "#FFD84D"; x.textAlign = "center"; x.fillText(`Съедено: ${st.fat} ${st.fat >= 8 ? "· он скоро лопнет!" : ""}`, W / 2, g.Y + g.h + size * .4); }
        const emo = (e, X, Y, s) => { x.font = `${Math.round(s)}px 'Segoe UI Emoji','Noto Color Emoji',sans-serif`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(e, X, Y); };
        for (const o of st.items) { if (!o.alive) continue; const [X, Y] = this.slot(o.i, W, H); emo(o.e, X, Y - size * 1.2, size * 2.4); pill(x, o.w, X, Y + size * .9, size, "rgba(10,14,28,.92)", "#FFD84D"); }
        if (st.fly) { const p = st.fly.t, [x0, y0] = st.fly.from, X = x0 + (g.mx - x0) * p, Y = y0 + (g.my - y0) * p - Math.sin(p * Math.PI) * H * .25; emo(st.fly.o.e, X, Y, size * (2.4 - p)); }
        if (st.spit) { const p = st.spit.t; emo(st.spit.e, st.spit.x - p * W * .35, st.spit.y + p * H * .4, size * 2); } }
    },
    /* бей пришельцев: из норок вылезают пришельцы с табличками, бонкни того, у кого правильное слово */
    mole:{
      init(){ st.holes = [0, 1, 2, 3, 4, 5].map(i => ({i, up:0, o:null})); this.round(); },
      round(){ st.q = MP(st.n); st.okShow = 0; st.holes.forEach(h => { h.o = null; h.up = 0; h.hit = 0; });
        const ws = shuf([{w:st.q.good, ok:1}, ...st.q.bad.map(w => ({w, ok:0}))]).slice(0, 3), hs = shuf(st.holes).slice(0, 3);
        ws.forEach((o, k) => { hs[k].o = {...o, e:pick(["👽","👾","🤖","🐙","👻"]), delay:k * .5}; }); st.rt = 0; },
      hp(i, W, H){ return [W * (.2 + (i % 3) * .3), H * (i < 3 ? .5 : .9)]; },
      update(dt){ st.rt += dt; for (const h of st.holes) if (h.o) { const want = st.rt > h.o.delay && !h.hit ? 1 : 0; h.up += (want - h.up) * Math.min(1, dt * 7); }
        if (st.okShow > 0) { st.okShow -= dt; if (st.okShow <= 0) this.round(); } else if (st.rt > 7) { sfx("tick"); this.round(); } },
      tap(X, Y){ if (st.okShow > 0) return; const W = A.c.width, H = A.c.height; const h = st.holes.find(h => h.o && !h.hit && h.up > .5 && Math.abs(this.hp(h.i, W, H)[0] - X) < W * .13 && Y < this.hp(h.i, W, H)[1] + H * .05 && Y > this.hp(h.i, W, H)[1] - H * .3); if (h) this.bonk(h); },
      pick(k){ const L = st.holes.filter(h => h.o && !h.hit && h.up > .5).sort((a, b) => a.i - b.i); if (L[k] && st.okShow <= 0) this.bonk(L[k]); },
      bonk(h){ const W = A.c.width, H = A.c.height, [X, Y] = this.hp(h.i, W, H); h.hit = 1;
        if (h.o.ok) { addScore(1, X, Y - H * .25, "#34D27B"); st.fx.push({txt:"БОНК!", x:X, y:Y - H * .3, life:.9, col:"#FFD84D"}); burst(X, Y - H * .12, "#FFD84D", 24); sfx("clack"); st.flash = .6; st.okShow = .7; st.okTxt = st.q.goodC; }
        else { addScore(-1, X, Y - H * .25, "#FF6B6B"); st.fx.push({txt:pick(["ХИ-ХИ!","МИМО!","НЕ Я!"]), x:X, y:Y - H * .3, life:.9, col:"#9CFF6A"}); sfx("bad"); st.red = .5; } },
      draw(x, W, H, d, t){ const size = fs(); prompt(x, st.okShow > 0 ? st.okTxt : st.q ? st.q.gap : "", W, size, st.okShow > 0);
        for (const h of st.holes) { const [X, Y] = this.hp(h.i, W, H), rw = W * .12;
          if (h.o && h.up > .02) { const up = h.up, hy = Y - up * H * .2; x.save(); x.beginPath(); x.rect(X - rw * 1.5, Y - H * .4, rw * 3, H * .4); x.clip();
            x.font = `${Math.round(size * 2.6)}px 'Segoe UI Emoji','Noto Color Emoji',sans-serif`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(h.hit && !h.o.ok ? "😜" : h.hit ? "😵" : h.o.e, X, hy);
            x.restore(); if (!h.hit || !h.o.ok) pill(x, h.o.w, X, hy - size * 2.2, size * .9, "rgba(10,14,28,.95)", "#7FD8FF"); }
          GFX.el(x, X, Y, rw, rw * .28, "#05070E", "#3A4A6A", 3 * d); } }
    },
    /* жвачка: пузыри с фразами всплывают; лопай только правильные, неправильный лопнет жвачкой на экран */
    gum:{
      init(){ st.items = []; st.spawn = .3; st.splats = []; },
      update(dt){ const W = A.c.width, H = A.c.height, d = A.d; st.spawn -= dt;
        if (st.spawn <= 0 && st.items.filter(o => o.alive).length < 4) { st.spawn = 1.4; const q = MP(st.n), ok = Math.random() < .5, txt = ok ? q.goodC : q.badC, size = fs() * .78;
          A.x.font = FONT(size); const r = Math.max(50 * d, A.x.measureText(txt).width / 2 + 18 * d); st.items.push({txt, ok, r, size, x:r + Math.random() * (W - 2 * r), y:H + r, vy:-(H / 9) * (.8 + Math.random() * .4), ph:Math.random() * 6, alive:1}); }
        for (const o of st.items) { o.y += o.vy * dt; o.ph += dt; if (o.y < -o.r) o.alive = 0; }
        st.items = st.items.filter(o => o.alive); st.splats = st.splats.filter(s => (s.life -= dt * .5) > 0); },
      tap(X, Y){ const o = st.items.find(o => o.alive && Math.hypot(o.x - X, o.y - Y) < o.r); if (!o) return; o.alive = 0;
        if (o.ok) { addScore(1, o.x, o.y, "#34D27B"); burst(o.x, o.y, "#FF9AD5", 26); sfx("pop"); st.flash = .5; }
        else { addScore(-1, o.x, o.y, "#FF6B6B"); sfx("bad"); st.splats.push({x:o.x, y:o.y, r:o.r * 1.6, life:1}); st.fx.push({txt:"ФУ, ЖВАЧКА!", x:o.x, y:o.y - o.r, life:1, col:"#FF9AD5"}); } },
      pick(){},
      draw(x, W, H, d, t){ const size = fs(); prompt(x, "Лопай пузыри, где фраза ПРАВИЛЬНАЯ", W, size * .85, false);
        for (const o of st.items) { const wb = Math.sin(o.ph * 3) * .04; x.save(); x.translate(o.x + Math.sin(o.ph) * 10 * d, o.y); x.scale(1 + wb, 1 - wb);
          GFX.el(x, 0, 0, o.r, o.r * .82, GFX.rg(x, -o.r * .3, -o.r * .3, o.r * 1.2, ["#FFD6EE", "#FF8AC8", "#D04A98"]), "#8A1A5A", 2.5 * d); GFX.el(x, -o.r * .4, -o.r * .35, o.r * .18, o.r * .1, "#FFFFFFAA", null);
          x.font = FONT(o.size); x.fillStyle = "#3A0A26"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(o.txt, 0, 0); x.restore(); }
        for (const s of st.splats) { x.save(); x.globalAlpha = Math.min(1, s.life * 1.5) * .85; for (let k = 0; k < 7; k++) { const a = k / 7 * 6.28; GFX.el(x, s.x + Math.cos(a) * s.r * .55, s.y + Math.sin(a) * s.r * .55, s.r * .35, s.r * .3, "#FF8AC8", null); } GFX.el(x, s.x, s.y, s.r * .7, s.r * .6, "#FF8AC8", null); x.restore(); } }
    }

  };
  return {run, key};
})();

/* ---------- задание дня, серия, сундук, кристаллы ---------- */
const DQ = [
 {id:"clean", t:"Победи любого злодея без единой подсказки", goal:1, on:e => e.type === "run" && e.wrong === 0},
 {id:"two", t:"Проведи 2 боя за день", goal:2, on:e => e.type === "run"},
 {id:"star4", t:"Получи в бою ★★★★ или ★★★★★", goal:1, on:e => e.type === "run" && e.stars >= 4},
 {id:"combo", t:"Сделай в бою комбо ×7", goal:1, on:e => e.type === "run" && e.maxCombo >= 7},
 {id:"fix", t:"Поправь злодея 3 раза без ошибок", goal:3, on:e => e.type === "fix"},
 {id:"build", t:"Собери 4 фразы из деталей без единого отскока", goal:4, on:e => e.type === "build"},
 {id:"arc", t:"Набери 10 очков в аркаде между волнами", goal:1, on:e => e.type === "arcade" && e.score >= 10},
 {id:"time", t:"Поставь ползунок времени верно 3 раза", goal:3, on:e => e.type === "time", need:() => [3, 4, 8].some(n => sectorState(n) !== "lock")}
];
const yday = () => { const t = new Date(); t.setDate(t.getDate() - 1); return dkey(t); };
const dayWord = n => n % 10 === 1 && n % 100 !== 11 ? "день" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "дня" : "дней";
function dqToday(){ const d = today(); if (!S.dq || S.dq.day !== d) { const pool = DQ.filter(q => !q.need || q.need()); let h = 7; for (const c of d) h = (h * 31 + c.charCodeAt(0)) >>> 0; S.dq = {day:d, id:pool[h % pool.length].id, prog:0, done:false}; save(); } return S.dq; }
function dqEvent(type, e = {}){ const q = dqToday(), D = DQ.find(x => x.id === q.id); if (!D || q.done) return; if (D.on({type, ...e})) { q.prog++; if (q.prog >= D.goal) dqComplete(); save(); } }
function streakNow(){ const s = S.streak; return s.last === today() || s.last === yday() ? s.n : 0; }
function dqComplete(){ const q = S.dq, s = S.streak; q.done = true;
  s.n = s.last === yday() ? s.n + 1 : s.last === today() ? s.n : 1; s.last = today(); s.best = Math.max(s.best || 0, s.n);
  const g = 3 + Math.min(s.n, 7); S.gems = (S.gems || 0) + g; let extra = "";
  if (s.n >= 3 && !S.cards.bolt) { S.cards.bolt = Date.now(); extra += " 📖 Секретная карточка: Сержант Болт!"; }
  if (s.n % 7 === 0) { S.chest = (S.chest || 0) + 1; extra += " 🎁 Сундук седьмого дня ждёт на базе!"; }
  save(); sfx("win"); toast(`✅ <b>Задание дня выполнено!</b> +${g} 💎 · серия ${s.n} ${dayWord(s.n)}.${extra}`); }
function openChest(){ if (!S.chest) return; S.chest--; const gm = 15; S.gems = (S.gems || 0) + gm; const got = [`+${gm} 💎`];
  if (!S.cards.glitch) { S.cards.glitch = Date.now(); got.push("📖 секретная карточка «Глюк»"); }
  if (S.cfg.chest > 0) { const d = today(); S.pay.earned += S.cfg.chest; S.pay.ledger.push({ts:Date.now(), day:d, m:0, stars:0, amt:S.cfg.chest, time:0, wrong:0}); got.push(`🪙 +${rub(S.cfg.chest)} от Командования`); }
  save(); sfx("win"); toast(`🎁 <b>Сундук открыт!</b> ${got.join(" · ")}`); home(); }
function hqRender(){
  const q = dqToday(), D = DQ.find(x => x.id === q.id), sn = streakNow(), cards = cardsOwned();
  const k7 = sn ? (sn - 1) % 7 + 1 : 0, cells = [1, 2, 3, 4, 5, 6, 7].map(i => { const on = i <= k7; return `<span class="dc ${on ? "on" : ""}">${i === 7 ? "🎁" : on ? "🔥" : i}</span>`; }).join("");
  $("#hq").innerHTML = `<div class="dq cut ${q.done ? "dn" : ""}"><div class="dq-h"><span class="eyebrow">🗓 Задание дня</span><span class="streak" title="Дней подряд">🔥 ${sn} ${dayWord(sn)}</span></div>
     <div class="dq-t">${q.done ? "✅ " : ""}${esc(D.t)}</div>
     <div class="dq-bar"><i style="width:${Math.min(100, 100 * q.prog / D.goal)}%"></i><span>${Math.min(q.prog, D.goal)} / ${D.goal}</span></div>
     <div class="dq-track">${cells}</div>
     <div class="dq-r">${q.done ? "Сегодня выполнено! Завтра новое задание, не прерывай серию." : `Награда: +${3 + Math.min(sn + 1, 7)} 💎 и день серии. 3 дня подряд: секретная карточка, 7 дней: сундук.`}</div>
     ${S.chest ? '<button class="big chestb" id="b-chest">🎁 Открыть сундук!</button>' : ""}</div>
   <div class="hq-btns">
     <button class="hqb cut" id="b-best"><span class="ic">📖</span><b>Бестиарий</b><small>карточек ${cards} из ${CARDS.length}</small></button>
     <button class="hqb cut" id="b-ars"><span class="ic">💎</span><b>${S.gems || 0} кристаллов</b><small>Арсенал: цвет лазера</small></button>
   </div>`;
  $("#b-best").onclick = () => bestiary(); $("#b-ars").onclick = () => bestiary("ars");
  if ($("#b-chest")) $("#b-chest").onclick = openChest;
}
function dqLine(){ const q = dqToday(), D = DQ.find(x => x.id === q.id); return `<div class="box newm">🗓 Задание дня: ${q.done ? "<b>выполнено ✅</b>" : `${esc(D.t)} · ${Math.min(q.prog, D.goal)} / ${D.goal}`}</div>`; }

/* ---------- бестиарий ---------- */
const CARDS = [
 {n:1, f:[["It is small and fast.","Он маленький и быстрый."],["Zerglings are always hungry.","Зерглинги всегда голодные."],["Its claws are very sharp.","Его когти очень острые."],["They are never alone. They are a swarm!","Они никогда не бывают одни. Они рой!"],["Two zerglings are born from one egg.","Из одного яйца рождаются два зерглинга."],["One zergling is weak, but a swarm is very strong!","Один зерглинг слабый, но рой очень сильный!"]]},
 {n:2, f:[["It has got a long tail.","У него длинный хвост."],["It hasn't got legs.","У него нет ног."],["It has got a hood like a cobra.","У него капюшон, как у кобры."],["It has got big sharp blades.","У него большие острые лезвия."],["Hydralisks have got spines. They shoot them!","У гидралисков есть шипы. Они ими стреляют!"],["Has it got wings? No, it hasn't.","Есть ли у него крылья? Нет."]]},
 {n:3, f:[["He guards a big gate.","Он охраняет большие ворота."],["He swings a burning censer.","Он размахивает горящим кадилом."],["He judges every traveller.","Он судит каждого путника."],["He doesn't sleep at night.","Он не спит ночью."],["Fire comes out of his censer.","Из его кадила вырывается огонь."],["Does he like visitors? No, he doesn't!","Любит ли он гостей? Нет!"]]},
 {n:4, f:[["It is very tall and black.","Он очень высокий и чёрный."],["Look! It is carrying a block.","Смотри! Он несёт блок."],["It is teleporting right now!","Он прямо сейчас телепортируется!"],["Endermen hate water.","Эндермены ненавидят воду."],["Don't look! It is looking at you!","Не смотри! Он смотрит на тебя!"],["It has got purple eyes.","У него фиолетовые глаза."]]},
 {n:5, f:[["She can control the Swarm.","Она может управлять Роем."],["She can fight very well.","Она умеет отлично сражаться."],["She can move things with her mind.","Она может двигать предметы силой мысли."],["She can talk to all the Zerg.","Она может говорить со всеми зергами."],["Long ago she was a human.","Давным-давно она была человеком."],["Can she lose? Yes, she can!","Может ли она проиграть? Да!"]]},
 {n:6, f:[["Zombies have to hide from the sun.","Зомби должны прятаться от солнца."],["It doesn't have to sleep.","Ему не нужно спать."],["In the sun, it burns!","На солнце он горит!"],["Zombies have to stay in the dark.","Зомби должны оставаться в темноте."],["It can break wooden doors.","Он может ломать деревянные двери."],["You have to run! Or fight!","Тебе придётся бежать! Или сражаться!"]]},
 {n:7, f:[["She fights with a long needle.","Она сражается длинной иглой."],["She is very fast.","Она очень быстрая."],["There aren't any slow moves in her fight.","В её бою нет медленных движений."],["There is some magic in her needle.","В её игле есть немного магии."],["How many jumps? Too many to count!","Сколько прыжков? Не сосчитать!"],["Is there any way to beat her? Yes: be faster!","Есть ли способ её победить? Да: будь быстрее!"]]},
 {n:8, f:[["It has got three heads.","У него три головы."],["It shoots black skulls.","Он стреляет чёрными черепами."],["A player built it from soul sand and skulls.","Игрок построил его из песка душ и черепов."],["It broke many blocks yesterday.","Вчера он сломал много блоков."],["It dropped a Nether Star.","Он уронил звезду Незера."],["Did it fly? Yes, it did!","Он летал? Да!"]]},
 {n:9, f:[["It is bigger than a house.","Он больше дома."],["It lives in the End.","Он живёт в Крае."],["It is the biggest mob in the End.","Это самый большой моб в Крае."],["It is faster than a horse.","Он быстрее лошади."],["End crystals heal it.","Кристаллы Края его лечат."],["It is the most famous boss in Minecraft!","Это самый знаменитый босс Minecraft!"]]},
 {id:"bolt", emo:"🤖", name:"Сержант Болт", game:"Космобаза «Альфа»", how:"3 дня подряд выполняй задание дня", f:[["Bolt is a robot.","Болт — робот."],["He likes jokes.","Он любит шутки."],["He can't swim.","Он не умеет плавать."],["He is the best adjutant on the base!","Он лучший адъютант на базе!"]]},
 {id:"glitch", emo:"👾", name:"Глюк", game:"вирус галактики Лингва", how:"открой сундук седьмого дня", f:[["Glitch is a virus.","Глюк — это вирус."],["It hasn't got a body.","У него нет тела."],["It breaks English every day.","Он ломает английский каждый день."],["It is afraid of good grammar!","Он боится хорошей грамматики!"]]}
];
const LVN = ["", "бронза", "серебро", "золото"], LVE = ["", "🥉", "🥈", "🥇"];
const cardLv = n => { const b = S.m[n]?.best || 0; return b >= 5 ? 3 : b >= 3 ? 2 : b >= 1 ? 1 : 0; };
const cardsOwned = () => CARDS.filter(c => c.n ? cardLv(c.n) : S.cards[c.id]).length;
const BPORT = {}; const bigPortrait = n => BPORT[n] || (BPORT[n] = GFX.portrait(n, 240));
function bestiary(focus){
  const own = cardsOwned(), cur = S.laser || 0, owned = S.owned || [0];
  $("#best").innerHTML = `<div class="panel cut ars" id="ars"><h2>💎 Арсенал</h2><p class="joke">Кристаллы дают за задание дня и аркады. Сейчас у тебя: <b class="gold">${S.gems || 0} 💎</b></p>
     <div class="lasers">${LASERS.map(([nm, col, price], i) => { const has = owned.includes(i); return `<button class="lz cut ${i === cur ? "on" : ""} ${!has && (S.gems || 0) < price ? "poor" : ""}" data-l="${i}"><span class="sw" style="background:${col === "rainbow" ? "linear-gradient(90deg,#f33,#fd3,#3f6,#3cf,#a3f)" : col};box-shadow:0 0 14px ${col === "rainbow" ? "#fff" : col}"></span><b>${nm}</b><small>${i === cur ? "выбран" : has ? "выбрать" : price + " 💎"}</small></button>`; }).join("")}</div><p class="joke" id="lz-msg"></p></div>
   <div class="sec-h">📖 Бестиарий · карточек ${own} из ${CARDS.length}</div>
   <p class="joke">Победи злодея: откроется карточка 🥉. На ★★★ она станет 🥈, на ★★★★★ 🥇, и с каждым уровнем откроются новые факты. Нажми на факт, чтобы послушать.</p>
   <div class="cards">${CARDS.map(c => { const lv = c.n ? cardLv(c.n) : S.cards[c.id] ? 3 : 0, B = c.n ? BOSS[c.n] : null, nm = c.n ? B[1] : c.name, gm = c.n ? B[5] : c.game, nf = c.n ? lv * 2 : lv ? c.f.length : 0;
     const img = c.n ? `<img src="${bigPortrait(c.n)}" alt="">` : `<span class="emo">${c.emo}</span>`;
     return `<div class="card cut ${lv ? "lv" + lv : "locked"}" id="card-${c.n || c.id}"><div class="ph">${img}${lv ? `<span class="lvb">${LVE[lv]}</span>` : '<span class="q">?</span>'}</div>
       <div class="cb"><div class="eyebrow">${c.n ? "Сектор " + c.n + " · " : ""}${esc(gm)}</div><h3>${lv ? esc(nm) : "???"}</h3>
       ${lv ? `<ul class="facts">${c.f.map((f, i) => i < nf ? `<li><button class="fact" data-en="${esc(f[0])}">🔊 <span class="en">${esc(f[0])}</span><span class="ruf">${esc(f[1])}</span></button></li>` : `<li class="lockf">🔒 ${c.n ? `откроется на ${i < 4 ? "★★★" : "★★★★★"}` : ""}</li>`).join("")}</ul>`
          : `<p class="joke">${c.n ? `🔒 Победи ${esc(nm)} в секторе ${c.n}.` : `🔒 Секретная карточка: ${esc(c.how)}.`}</p>`}</div></div>`; }).join("")}</div>`;
  $("#best").querySelectorAll(".fact").forEach(b => b.onclick = () => { say(b.dataset.en, true); b.classList.add("open"); });
  $("#best").querySelectorAll(".lz").forEach(b => b.onclick = () => { const i = +b.dataset.l, price = LASERS[i][2]; S.owned = S.owned || [0];
    if (!S.owned.includes(i)) { if ((S.gems || 0) < price) { $("#lz-msg").textContent = `Не хватает ${price - (S.gems || 0)} 💎. Выполняй задание дня и играй в аркады!`; sfx("bad"); return; } S.gems -= price; S.owned.push(i); sfx("win"); }
    else sfx("pop"); S.laser = i; save(); bestiary("ars"); $("#lz-msg").textContent = `Лазер «${LASERS[i][0]}» заряжен. Он будет в бою и в аркадах.`; });
  show("v-best");
  if (focus) { const el = document.getElementById(focus === "ars" ? "ars" : "card-" + focus); if (el) setTimeout(() => el.scrollIntoView({block:"center", behavior:"smooth"}), 60); }
}

/* ---------- обёртки: финал боя ---------- */
function finish(){ const n = R.m.n, stars = starsNow(), lv0 = cardLv(n); finishOld();
  dqEvent("run", {stars, wrong:R.wrong, maxCombo:R.maxCombo});
  const lv1 = cardLv(n), add = [];
  if (lv1 > lv0) add.push(`<div class="box newm gold">📖 Бестиарий: ${lv0 ? "карточка улучшена" : "новая карточка"} «<b>${esc(BOSS[n][1])}</b>» ${LVE[lv1]} ${LVN[lv1]}. Открылись новые факты на английском! <button class="say" id="b-card">Посмотреть</button></div>`);
  add.push(dqLine());
  const rows = document.querySelectorAll("#result .row"); rows[rows.length - 1].insertAdjacentHTML("beforebegin", add.join(""));
  if ($("#b-card")) $("#b-card").onclick = () => bestiary(n);
}

document.addEventListener("keydown", e => {
  if (/INPUT|TEXTAREA/.test(e.target.tagName)) return;
  const vis = id => !$(id).hidden, onBtn = document.activeElement && document.activeElement.tagName === "BUTTON";
  if (vis("#v-arc")) { if (ARC.key(e)) e.preventDefault(); return; }
  if (vis("#v-play") && e.key === "Enter" && !onBtn) { const n = $("#next"); if ((!n || n.hidden) && $("#ts-ok") && !$("#ts-ok").disabled) { $("#ts-ok").click(); e.preventDefault(); } else if (!n && $("#scn-go")) { $("#scn-go").click(); e.preventDefault(); } }
});


/* ---------- v8: порядок боссов StarCraft → Minecraft → Silksong ---------- */
/* сектор (тема грамматики) → «родной» номер босса: от него берутся фон, частицы и реплики */
const BGMAP = {1:1, 2:2, 3:5, 4:4, 5:6, 6:8, 7:9, 8:3, 9:7};
Object.assign(GFX.VS, {1:"zergling", 2:"hydra", 3:"queen", 4:"enderman", 5:"zombie", 6:"wither", 7:"dragon", 8:"judge", 9:"lace"});
{ const old = {...MCOL}; for (const n in BGMAP) MCOL[n] = old[BGMAP[n]];
  const NEW = {}; for (const n in BGMAP) NEW[BGMAP[n]] = +n; CARDS.forEach(c => { if (c.n) c.n = NEW[c.n]; }); CARDS.sort((a, b) => (a.n || 99) - (b.n || 99)); }
Object.assign(BOSS, {
 3:["","Королева Клинков","Королева Клинков засела в улье и командует роем. Её приказы звучат с ошибками: «He doesn't fights!», «She play every day!». Змейка -s у неё ползает куда попало. Наведи порядок!","Королева отступила! Рой остался без приказов. She doesn't fight now: она прячется.","","StarCraft"],
 5:["","Зомби","Зомби вылез из шахты и бродит по базе: «Ничего не надо-о-о». Минералы не собраны, дракон не мыт. Объясни ему have to!","Зомби разбужен и даже моет дракона: he has to wash the dragon. Дракон против.","","Minecraft"],
 6:["","Иссушитель","Трёхголовый Иссушитель высасывает силу из героев и шипит: «He can to fly», «It cans swim». Докажи, что знаешь can лучше всех трёх голов!","Иссушитель рассыпался! Герои снова can fly, can swim и can win.","","Minecraft"],
 7:["","Дракон Края","Дракон Края прилетел на кухню базы и сожрал половину продуктов. Теперь он путает some и any, much и many: «How much eggs?». Спаси кухню!","Дракон улетел обратно в Край! There is some pizza for everyone again.","","Minecraft"],
 8:["","Последний Судья","Последний Судья с огненным кадилом судит прошлое. Бортовой журнал под его надзором пишет «Yesterday I go to the Moon». Верни журналу -ed и неправильные глаголы!","Кадило погасло! Журнал снова помнит вчерашний день: yesterday we won.","","Silksong"],
 9:["","Лейс","Финал! В фехтовальщицу Лейс вселился сам Глюк. Она хвастается, что она «more fast» и «the most strong». Покажи, кто тут the strongest!","ЛЕЙС ПОВЕРЖЕНА, ГЛЮК УНИЧТОЖЕН! Галактика Лингва свободна. Commander, you are the best!","","Silksong"]});

/* ---------- v8: дуэль с активным боссом (прототип на секторе 1) ---------- */
const DUEL_SEC = 12, DUEL_CRIT = 5, SUPER_AT = 5;
TT.duel = ["⚔️", "Дуэль: отбей атаку!"];
const DUEL_N = [1];
const DATK = ["Получай, командир!", "Атака словами!", "Держи ошибку!", "Скрии-и! Ловиии!", "Вот тебе грамматика!"];
const DHIT = ["Отбито! Контрудар!", "Щит выдержал!", "Точно в цель!"];
let DT = null;
function duelStop(){ if (DT) { cancelAnimationFrame(DT.raf); DT = null; } }
function taskDuel(t, P, head, nextBtn){
  duelStop(); const B = BOSS[R.m.n], wrongS = t.toks.join(" "), fixS = t.toks.map((w, k) => k === t.bad ? t.fix : w).join(" ");
  R.charge = R.charge || 0;
  P.innerHTML = `${head}<div class="villain cut duel-atk"><img src="${portrait(R.m.n)}" alt=""><div><div class="eyebrow">⚔️ ${esc(B[1])} атакует!</div>
     <div class="vq">${t.toks.map((w, i) => i === t.bad ? `<span class="dbad">${esc(w)}</span>` : esc(w)).join(" ")}</div></div></div>
   <div class="dtimer"><i id="d-bar"></i><span id="d-tx"></span></div>
   <div class="ru">Отбей атаку: замени красное слово на правильное!</div>
   <div class="opts" id="d-o">${t.o.map((o, k) => `<button class="opt" data-o="${k}" data-key="${k + 1}"><kbd>${k + 1}</kbd>${esc(o)}</button>`).join("")}</div>
   <div class="dsuper"><span>Супероружие</span><div class="dch">${[0, 1, 2, 3, 4].map(i => `<i class="${i < R.charge ? "on" : ""}"></i>`).join("")}</div></div>
   <div class="row"><button class="say" id="b-listen">🔊 Послушать атаку</button></div>${nextBtn}`;
  sayV(wrongS); GFX.taunt(pick(DATK)); sfx("boom");
  let tries = 0, over = false, t0 = performance.now(), last = t0, left = DUEL_SEC;
  $("#b-listen").onclick = () => sayV(wrongS);
  const glow = () => P.querySelectorAll("#d-o .opt").forEach(x => { if (t.o[+x.dataset.o] === t.fix) x.classList.add("glow"); });
  const lose = why => { R.charge = 0; tries++; if (tries >= 2) glow(); hint(why); };
  const tick = now => { if (!DT || over) return; if (!document.hidden && !R.paused) left -= (now - last) / 1000; last = now;
    const b = $("#d-bar"); if (!b) return duelStop(); b.style.width = Math.max(0, 100 * left / DUEL_SEC) + "%"; b.classList.toggle("hot", left < 4); $("#d-tx").textContent = Math.max(0, Math.ceil(left)) + " с";
    if (left <= 0) { over = true; duelStop(); $("#d-tx").textContent = "удар!"; miss(wrongS, "(время)"); sfx("bad");
      lose(`Не успел, атака попала в щит! Теперь без таймера: выбери правильное слово. Подсказка: ${esc(t.h)}.`); return; }
    DT.raf = requestAnimationFrame(tick); };
  DT = {raf: requestAnimationFrame(tick)};
  P.querySelectorAll("#d-o .opt").forEach(ob => ob.onclick = () => { const o = t.o[+ob.dataset.o];
    if (o === t.fix) { const fast = !over && (DUEL_SEC - left) <= DUEL_CRIT; over = true; duelStop(); ob.classList.add("yes"); P.querySelectorAll("#d-o .opt").forEach(x => x.disabled = true);
      const first = !R.tasks[R.i].missed; if (first) R.charge = Math.min(SUPER_AT, R.charge + 1);
      P.querySelector(".dbad").textContent = t.fix; P.querySelector(".dbad").className = "dgood"; dqEvent("fix");
      GFX.taunt(pick(VOOPS)); done(fixS, `<span>${fast ? "⚡ Быстрый контрудар! " : pick(DHIT) + " "}<b>${esc(t.toks[t.bad])} → ${esc(t.fix)}</b></span>`);
      P.querySelectorAll(".dch i").forEach((x, i) => x.classList.toggle("on", i < R.charge));
      if (R.charge >= SUPER_AT && R.N - R.i - 1 > 1) { $("#next").insertAdjacentHTML("beforebegin", `<button class="big superb" id="b-super">☄️ Супероружие: −3 жизни!</button>`); $("#b-super").onclick = superFire; } }
    else { ob.classList.add("no"); ob.disabled = true; miss(wrongS, o); sfx("bad"); lose(`Не то слово! ${tries >= 1 ? esc(t.h) + "." : "Атака задела щит."}`); }
  });
}
function superFire(){ const b = $("#b-super"); if (!b) return; b.remove(); R.charge = 0; const k = Math.min(2, R.N - R.i - 2); R.i += k;
  const left = R.N - R.i - 1; $("#hpbar").style.width = (100 * left / R.N) + "%"; $("#hptx").textContent = `${left} / ${R.N}`;
  [0, 450].forEach(d => setTimeout(() => GFX.hit(true), d)); sfx("boom"); toast(`☄️ <b>Супероружие!</b> Босс потерял ещё ${k} ${k === 1 ? "жизнь" : "жизни"}.`); hud();
  document.querySelectorAll(".dch i").forEach(x => x.classList.remove("on")); }
EXT_T.duel = taskDuel;
/* ---------- v9: связный диалог-дуэль (образец: сектор 1, Зерглинг) ----------
   b = босс говорит с ошибкой (Артём поправляет = парирует), h = герой отвечает/спрашивает собранной фразой (= атака).
   Для b: s — фраза, *слово>верно* — ошибка. Для h: q — что спросил босс (контекст), p — блоки «слово:роль / …», ru — что сказать. */
const TALK = {1:[
 {w:"b", s:"Скрии! Hello, human! I *is>am* Zergling, and I am very hungry!", ru:"Привет, человек! Я Зерглинг, и я очень голодный!", act:"Зерглинг выскакивает из-за угла и щёлкает зубами"},
 {w:"h", q:"Who are you? Are you a pizza?", p:"No, / I:w / am not:d / a pizza!:t", ru:"Нет, я не пицца!", act:"Герой поднимает бластер"},
 {w:"b", s:"Not a pizza?! Then who *is>are* you?", ru:"Не пицца?! Тогда кто ты?", act:"Зерглинг обнюхивает героя"},
 {w:"h", q:"Ответь, кто ты", p:"I:w / am:d / the commander.:t", ru:"Я командир.", act:"Выстрел!"},
 {w:"b", s:"Commander? Ha! You *is>are* very small!", ru:"Командир? Ха! Ты очень маленький!", act:"Зерглинг смеётся и прыгает"},
 {w:"h", q:"Спроси его, сколько ему лет", p:"How old:h / are:d / you?:w", ru:"Сколько тебе лет?", act:"Герой целится"},
 {w:"b", s:"I *are>am* two days old! Zerglings grow very fast!", ru:"Мне два дня! Зерглинги растут очень быстро!", act:"Зерглинг гордо раздувается"},
 {w:"h", q:"Спроси, где его мама", p:"Where:h / is:d / your mom?:w", ru:"Где твоя мама?", act:"Выстрел в панцирь!"},
 {w:"b", s:"My mom *are>is* the Queen! She *are>is* very angry!", ru:"Моя мама — Королева! Она очень злая!", act:"Вдали рычит Королева Клинков"},
 {w:"h", q:"Отправь его домой", p:"You:w / are:d / a good boy.:t / Go home!", ru:"Ты хороший мальчик. Иди домой!", act:"Последний выстрел!"}
]};
TT.talk = ["💬", "Дуэль-разговор"];
function talkTask(m, used){ const L = TALK[m.n]; used.ti = (used.ti ?? -1) + 1; return {k:"talk", ...L[used.ti % L.length]}; }
const talkParts = s => { const toks = []; let bad = -1, fix = ""; s.split(" ").forEach(w => { const mm = w.match(/^\*(.+?)>(.+?)\*(.*)$/); if (mm) { bad = toks.length; fix = mm[2] + mm[3]; toks.push(mm[1] + mm[3]); } else toks.push(w); }); return {toks, bad, fix}; };
function chatHTML(){ return (R.chat || []).slice(-4).map(c => `<div class="cbub ${c.w}">${c.w === "b" ? `<img src="${portrait(R.m.n)}" alt="">` : '<span class="hav">🧑‍🚀</span>'}<div><div class="cw">${c.w === "b" ? esc(BOSS[R.m.n][1]) : "Командир"}</div>${c.html}</div></div>`).join(""); }
function taskTalk(t, P, head, nextBtn){
  duelStop(); R.chat = R.chat || []; R.charge = R.charge || 0; gearOverlay();
  const super_ = `<div class="dsuper"><span>Супероружие</span><div class="dch">${[...Array(superAt()).keys()].map(i => `<i class="${i < R.charge ? "on" : ""}"></i>`).join("")}</div></div>`;
  const win = (en, extra) => { const first = !R.tasks[R.i].missed; if (first) R.charge = Math.min(superAt(), R.charge + 1);
    done(en, extra); P.querySelectorAll(".dch i").forEach((x, i) => x.classList.toggle("on", i < R.charge));
    if (R.charge >= superAt() && R.N - R.i - 1 > 1) { $("#next").insertAdjacentHTML("beforebegin", `<button class="big superb" id="b-super">☄️ Супероружие!</button>`); $("#b-super").onclick = superTalk; } };
  if (t.w === "b") {
    const {toks, bad, fix} = talkParts(t.s), wrongS = toks.join(" "), fixS = toks.map((w, k) => k === bad ? fix : w).join(" ");
    const clean = w => w.replace(/[.?!,]+$/, ""), pun = fix.slice(clean(fix).length);
    const o = shuf([fix, ...shuf(wrongs(R.m.n, clean(fix), [clean(toks[bad])])).slice(0, 2).map(w => w + pun)]);
    P.innerHTML = `${head}<div class="chat">${chatHTML()}<div class="cbub b now"><img src="${portrait(R.m.n)}" alt=""><div><div class="cw">⚔️ ${esc(BOSS[R.m.n][1])} атакует · <i>${esc(t.act)}</i></div><span class="vq">${toks.map((w, i) => i === bad ? `<span class="dbad">${esc(w)}</span>` : esc(w)).join(" ")}</span></div></div></div>
     <div class="dtimer"><i id="d-bar"></i><span id="d-tx"></span></div>
     <div class="ru">Парируй! Замени красное слово, и злодей сам скажет правильно.</div>
     <div class="opts" id="d-o">${o.map((x, k) => `<button class="opt" data-o="${k}" data-key="${k + 1}"><kbd>${k + 1}</kbd>${esc(x)}</button>`).join("")}</div>
     ${super_}<div class="row"><button class="say" id="b-listen">🔊 Ещё раз</button></div>${nextBtn}`;
    R.pmul = 1; const pw = POWER_AT.includes(R.i) ? bossPower(P) : null;
    if (!pw || !pw.quiet) { sayV(wrongS); GFX.taunt(wrongS.length > 46 ? wrongS.slice(0, 44) + "…" : wrongS); } else setTimeout(() => sayV(wrongS), 400); sfx("boom");
    let tries = 0, over = false, last = performance.now(), left = duelSec() - (pw && pw.cut || 0);
    $("#b-listen").onclick = () => sayV(wrongS);
    const lose = why => { R.charge = 0; tries++; if (tries >= glowN()) P.querySelectorAll("#d-o .opt").forEach(x => { if (o[+x.dataset.o] === fix) x.classList.add("glow"); }); hint(why); };
    const tick = now => { if (!DT || over) return; if (!document.hidden && !R.paused) left -= (now - last) / 1000 * (R.pmul || 1); last = now; const b = $("#d-bar"); if (!b) return duelStop();
      b.style.width = Math.max(0, 100 * left / duelSec()) + "%"; b.classList.toggle("hot", left < 4); $("#d-tx").textContent = Math.max(0, Math.ceil(left)) + " с";
      if (left <= 0) { over = true; duelStop(); $("#d-tx").textContent = "укус!"; miss(wrongS, "(время)"); sfx("bad"); lose("Не успел, атака попала в щит! Выбери правильное слово."); return; }
      DT.raf = requestAnimationFrame(tick); };
    DT = {raf: requestAnimationFrame(tick)};
    P.querySelectorAll("#d-o .opt").forEach(ob => ob.onclick = () => { const x = o[+ob.dataset.o];
      if (x === fix) { const fast = !over && duelSec() - left <= DUEL_CRIT; over = true; duelStop(); ob.classList.add("yes"); P.querySelectorAll("#d-o .opt").forEach(y => y.disabled = true);
        R.chat.push({w:"b", html:esc(fixS)}); const q = P.querySelector(".dbad"); q.textContent = fix; q.className = "dgood"; GFX.taunt(pick(VOOPS));
        R.tasks[R.i].ru = t.ru; win(fixS, `<span>${fast ? "⚡ Быстрое парирование! " : "Отбито! "}<b>${esc(clean(toks[bad]))} → ${esc(clean(fix))}</b></span>`); }
      else { ob.classList.add("no"); ob.disabled = true; miss(wrongS, x); sfx("bad"); lose("Не то слово! Посмотри, КТО говорит: I → am, he / she / it → is, you / we / they → are."); } });
    return;
  }
  // герой: собрать фразу-ответ или вопрос = атака
  const parts = t.p.split(" / ").map(x => { const k = x[0] === "*"; if (k) x = x.slice(1); const i = x.lastIndexOf(":"); return Object.assign(i > 0 && /^[a-z]$/.test(x.slice(i + 1)) ? {t:x.slice(0, i), r:x.slice(i + 1)} : {t:x, r:"n"}, {key:k}); });
  const en = parts.map(p => p.t).join(" "), ki0 = parts.findIndex(p => p.key), ki = ki0 >= 0 ? ki0 : parts.findIndex(p => ["am","is","are","am not","isn't","aren't"].includes(p.t.toLowerCase()));
  const kc = ki >= 0 ? parts[ki].t.replace(/[.?!,]+$/, "") : "", kp = ki >= 0 ? parts[ki].t.slice(kc.length) : "", cap0 = /^[A-Z]/.test(kc);
  const dec = ki >= 0 ? shuf(wrongs(R.m.n, kc.toLowerCase(), [])).filter(w => w.toLowerCase() !== kc.toLowerCase()).slice(0, 2).map(w => ({t:(cap0 ? cap(w) : w) + kp, r:parts[ki].r, dec:1})) : [];
  const all = shuf([...parts.map((p, i) => ({...p, i})), ...dec.map(p => ({...p, i:-1}))]);
  const ask = /^[А-ЯЁ]/.test(t.q);
  P.innerHTML = `${head}<div class="chat">${chatHTML()}${ask ? "" : `<div class="cbub b now"><img src="${portrait(R.m.n)}" alt=""><div><div class="cw">${esc(BOSS[R.m.n][1])} спрашивает</div><span class="vq">${esc(t.q)}</span></div></div>`}</div>
   <div class="ru">${ask ? `🎯 ${esc(t.q)}. ${/^Спроси/.test(t.q) ? "Твоя атака — вопрос!" : "Твой ответ — выстрел!"}` : "🎯 Ответь злодею — твой ответ это выстрел!"} <span class="joke">По-русски: «${esc(t.ru)}»</span></div>
   <div class="cbub h now"><span class="hav">🧑‍🚀</span><div><div class="cw">Командир</div><div class="slots tslots" id="slots">${parts.map(() => '<span class="slot s-plain"></span>').join("")}</div></div></div>
   <div class="pool" id="pool">${all.map((p, j) => `<button class="blk r-${p.r === "n" ? "t" : p.r}" data-i="${p.i}" data-t="${esc(p.t)}" data-key="${j + 1}"><kbd>${j + 1}</kbd>${esc(p.t)}</button>`).join("")}</div>
   ${super_}<div class="row"><button class="say" id="b-listen">🔊 Подсказка ушами</button></div>${nextBtn}`;
  if (!ask) { sayV(t.q); GFX.taunt(t.q); }
  $("#b-listen").onclick = () => say(en, true);
  let pos = 0, tries = 0;
  P.querySelectorAll("#pool .blk").forEach(btn => btn.onclick = () => { const want = parts[pos];
    if (btn.dataset.t === want.t) { sfx("clack"); P.querySelector("#slots .slot").outerHTML = `<span class="blk r-${want.r === "n" ? "t" : want.r}">${esc(want.t)}</span>`; btn.classList.add("used"); btn.disabled = true; P.querySelectorAll(".glow").forEach(g => g.classList.remove("glow")); pos++; tries = 0; $("#hint").innerHTML = "";
      if (pos === parts.length) { R.chat.push({w:"h", html:esc(en)}); if (!ask) R.chat.splice(R.chat.length - 1, 0, {w:"b", html:esc(t.q)}); R.tasks[R.i].ru = t.ru; GFX.taunt(pick(["Ай! Больно!", "Скрии! Ты попал!", "Ой-ой-ой!"])); win(en, `<span>💥 Твоя фраза попала в цель!</span>`); } }
    else { btn.classList.remove("shake"); void btn.offsetWidth; btn.classList.add("shake"); sfx("bad"); miss(en, btn.dataset.t); tries++; R.charge = 0;
      if (+btn.dataset.i < 0) { btn.classList.add("used"); btn.disabled = true; }
      if (tries >= glowN()) P.querySelectorAll("#pool .blk").forEach(b => { if (!b.disabled && b.dataset.t === want.t) b.classList.add("glow"); });
      hint(tries >= glowN() ? "Подсвечиваю нужный блок." : "Не тот блок. Нажми «Подсказка ушами» и послушай фразу."); } });
}
/* в разговоре супероружие не пропускает реплики: мощный залп, +5 💎 и злодей в шоке */
function superTalk(){ const b = $("#b-super"); if (!b) return; b.remove(); R.charge = 0; S.gems = (S.gems || 0) + 5; save();
  [0, 300, 600].forEach(d => setTimeout(() => GFX.hit(true), d)); sfx("boom"); GFX.taunt(pick(["АААА! Что это было?!", "Скрии-и-и! Мама!", "Ой-ой! Я так больше не играю!"]));
  toast("☄️ <b>Супероружие!</b> Тройной залп, злодей в шоке. +5 💎"); document.querySelectorAll(".dch i").forEach(x => x.classList.remove("on")); }

/* ---------- v11: суперспособности боссов (срабатывают на 5-й и 9-й реплике) ---------- */
const POWER_AT = [4, 8];
const POWERS = {
 1:["🐜","Рой!","Кнопки дрожат и прыгают. Целься точнее!", P => P.querySelector("#d-o").classList.add("pw-jit")],
 2:["🧪","Кислотный плевок!","Фразу залило кислотой. Сотри кляксы пальцем!", P => { const v = P.querySelector(".cbub.now .vq"); v.style.position = "relative"; for (let k = 0; k < 3; k++) { const a = document.createElement("i"); a.className = "acid"; a.style.left = (8 + k * 30 + Math.random() * 10) + "%"; a.style.top = (Math.random() * 30 - 10) + "%"; a.onclick = () => { a.remove(); sfx("pop"); }; v.appendChild(a); } }],
 3:["🌀","Пси-удар!","Королева затуманила тебе глаза. Подожди, туман рассеется.", P => P.querySelector("#d-o").classList.add("pw-blur")],
 4:["🟣","Телепорт!","Эндермен телепортирует ответы с места на место!", P => { const O = P.querySelector("#d-o"), iv = setInterval(() => { if (!O.isConnected || O.querySelector(".yes")) return clearInterval(iv); O.appendChild(O.firstElementChild); sfx("tick"); }, 2200); }],
 5:["🌑","Тьма шахты!","Зомби выключил свет. Глаза скоро привыкнут.", P => P.classList.add("pw-dark")],
 6:["💀","Иссушение!","Иссушитель высасывает время: таймер бежит в два раза быстрее!", P => { R.pmul = 2; }],
 7:["🔥","Огненное дыхание!","Дракон подпалил таймер: у тебя на 4 секунды меньше!", P => { P.querySelector("#d-o").classList.add("pw-fire"); return {cut:4}; }],
 8:["🔕","Тишина в зале!","Судья спрятал текст. Слушай ушами!", P => { P.querySelector(".cbub.now .vq").classList.add("pw-hide"); GFX.taunt("Тишина в зале!"); return {quiet:1}; }],
 9:["🪡","Вихрь игл!","Лейс закрутила ответы иглой!", P => P.querySelector("#d-o").classList.add("pw-spin")]};
function bossPower(P){ const p = POWERS[R.m.n]; if (!p) return null;
  P.querySelector(".chat").insertAdjacentHTML("afterend", `<div class="pwban">${p[0]} <b>Суперспособность босса: ${p[1]}</b> ${p[2]}</div>`); sfx("boom"); GFX.taunt(p[1]);
  return p[3](P) || {}; }
EXT_T.talk = taskTalk;

{ const pf = patternFor; patternFor = n => TALK[n] ? Array(10).fill("talk") : DUEL_N.includes(n) ? Array(10).fill("duel") : pf(n); }
$("#b-quit").addEventListener("click", duelStop);


/* ---------- v10: разговоры-дуэли для всех боссов (в h: «*» перед блоком = ключевой, к нему лишние блоки) ---------- */
Object.assign(TALK, {
 2:[
 {w:"b", s:"Sssss! I *has>have* got acid in my mouth!", ru:"Сссс! У меня во рту кислота!", act:"Гидралиск шипит и капает кислотой"},
 {w:"h", q:"Have you got a shield, human?", p:"Yes, / I:w / *have:d / got / a shield.:t", ru:"Да, у меня есть щит.", act:"Герой поднимает щит"},
 {w:"b", s:"My sister *have>has* got ten tails! Ten!", ru:"У моей сестры десять хвостов! Десять!", act:"Гидралиск хвастается"},
 {w:"h", q:"Спроси, есть ли у него друзья", p:"*Have:h / you:w / got:d / any friends?:t", ru:"У тебя есть друзья?", act:"Выстрел!"},
 {w:"b", s:"Zerglings *has>have* got no time for me. Sssad...", ru:"У зерглингов нет на меня времени. Грусссно...", act:"Гидралиск грустит"},
 {w:"h", q:"Спроси, есть ли у него зубная щётка: из пасти пахнет кислотой", p:"*Have:h / you:w / got:d / a toothbrush?:t", ru:"У тебя есть зубная щётка?", act:"Герой зажимает нос"},
 {w:"b", s:"A toothbrush? My mouth *have>has* got only acid!", ru:"Зубная щётка? У меня во рту только кислота!", act:"Кислота прожигает пол"},
 {w:"h", q:"Скажи: у меня есть для тебя подарок", p:"I:w / *have:d / got / a present / for you.:t", ru:"У меня есть для тебя подарок.", act:"Выстрел подарком!"},
 {w:"b", s:"A present? Wow! *Has>Have* you got a toothbrush for me?", ru:"Подарок? Ух ты! У тебя есть зубная щётка для меня?", act:"Гидралиск радостно виляет хвостом"},
 {w:"h", q:"Ответь: да! Иди чисти зубы!", p:"Yes, / I:w / *have:d / got / one! / Go and brush your teeth!", ru:"Да, есть! Иди почисти зубы!", act:"Финальный выстрел!"}],
 3:[
 {w:"b", s:"So you hurt my baby! I *rules>rule* the Swarm every day!", ru:"Так это ты обидел моего малыша! Я правлю Роем каждый день!", act:"Королева Клинков расправляет крылья"},
 {w:"h", q:"Спроси, что она делает каждый день", p:"What:h / *do:h / you:w / do:d / every day?:n", ru:"Что ты делаешь каждый день?", act:"Герой целится"},
 {w:"b", s:"I *eats>eat* space bugs for breakfast!", ru:"Я ем космических жуков на завтрак!", act:"Королева облизывается"},
 {w:"h", q:"Спроси, ходит ли она в школу", p:"*Do:h / you:w / go:d / to school?:t", ru:"Ты ходишь в школу?", act:"Выстрел!"},
 {w:"b", s:"No! My son *go>goes* to Zerg school.", ru:"Нет! Мой сын ходит в школу зергов.", act:"Где-то пищит Зерглинг"},
 {w:"h", q:"Скажи: мой брат тоже ходит в школу", p:"My brother:w / *goes:d / to school / too.:t", ru:"Мой брат тоже ходит в школу.", act:"Герой улыбается"},
 {w:"b", s:"Does he *likes>like* homework?", ru:"Он любит домашку?", act:"Королева щурится"},
 {w:"h", q:"Ответь: нет, он не любит домашку", p:"No, / he:w / *doesn't:h / like:d / homework.:t", ru:"Нет, он не любит домашку.", act:"Выстрел!"},
 {w:"b", s:"Ha! My son *don't>doesn't* like homework. He eats it!", ru:"Ха! Мой сын не любит домашку. Он её ест!", act:"Королева хохочет"},
 {w:"h", q:"Скажи: твоему сыну нужен хороший учитель!", p:"Your son:w / *needs:d / a good teacher!:t", ru:"Твоему сыну нужен хороший учитель!", act:"Финальный выстрел!"}],
 4:[
 {w:"b", s:"Vrrrp! I am *take>taking* your blocks right now!", ru:"Вррп! Я прямо сейчас забираю твои блоки!", act:"Эндермен телепортируется с блоком"},
 {w:"h", q:"Спроси, что он делает", p:"What:h / *are:h / you:w / doing?:d", ru:"Что ты делаешь?", act:"Герой целится"},
 {w:"b", s:"I *is>am* building a house. Look!", ru:"Я строю дом. Смотри!", act:"Эндермен ставит блоки"},
 {w:"h", q:"Скажи: ты строишь его из моей базы!", p:"You:w / *are:h / building:d / it / from my base!:t", ru:"Ты строишь его из моей базы!", act:"Выстрел!"},
 {w:"b", s:"Shhh! You *is>are* looking at my eyes!", ru:"Тсс! Ты смотришь мне в глаза!", act:"Глаза Эндермена вспыхивают"},
 {w:"h", q:"Ответь: нет, я смотрю на твои ноги", p:"No, / I:w / *am:h / looking:d / at your feet.:t", ru:"Нет, я смотрю на твои ноги.", act:"Герой смотрит вниз"},
 {w:"b", s:"Oh no! It *are>is* raining! I hate water!", ru:"О нет! Идёт дождь! Я ненавижу воду!", act:"Начинается дождь"},
 {w:"h", q:"Спроси, почему он плачет", p:"Why:h / *are:h / you:w / crying?:d", ru:"Почему ты плачешь?", act:"Выстрел!"},
 {w:"b", s:"I am not crying! The rain *are>is* falling on my face!", ru:"Я не плачу! Это дождь падает мне на лицо!", act:"Эндермен дрожит"},
 {w:"h", q:"Скажи: у меня в руках зонтик. Отдай блоки!", p:"I:w / *am:h / holding:d / an umbrella.:t / Give me my blocks!", ru:"Я держу зонтик. Отдай мои блоки!", act:"Финальный выстрел!"}],
 5:[
 {w:"b", s:"Uuugh... I *cans>can* eat brains...", ru:"Ыыы... Я умею есть мозги...", act:"Зомби медленно тянет руки"},
 {w:"h", q:"Спроси, умеет ли он бегать", p:"*Can:h / you:w / run?:d", ru:"Ты умеешь бегать?", act:"Герой отходит на шаг"},
 {w:"b", s:"No... I can't *runs>run*. I can only walk... slowly...", ru:"Нет... Я не умею бегать. Только ходить... медленно...", act:"Зомби делает шаг. Один."},
 {w:"h", q:"Скажи: а я умею бегать очень быстро!", p:"I:w / *can:h / run:d / very fast!:t", ru:"А я умею бегать очень быстро!", act:"Выстрел!"},
 {w:"b", s:"Can you *swims>swim*?", ru:"А плавать умеешь?", act:"Зомби смотрит на лужу"},
 {w:"h", q:"Ответь: да, умею. А ты?", p:"Yes, / I:w / *can:h / swim.:d / Can you?", ru:"Да, я умею плавать. А ты?", act:"Герой показывает, как плавать"},
 {w:"b", s:"Zombies can't swim... We *cans>can* only sink. Blub-blub.", ru:"Зомби не умеют плавать... Мы умеем только тонуть. Буль-буль.", act:"Зомби булькает"},
 {w:"h", q:"Спроси, умеет ли он танцевать", p:"*Can:h / you:w / dance?:d", ru:"Ты умеешь танцевать?", act:"Выстрел!"},
 {w:"b", s:"Yes! I can *dancing>dance*! Look at my moves!", ru:"Да! Я умею танцевать! Смотри, как я двигаюсь!", act:"Зомби танцует. Ужасно."},
 {w:"h", q:"Скажи: ты не умеешь танцевать. Иди спать!", p:"You:w / *can't:h / dance.:d / Go to bed!", ru:"Ты не умеешь танцевать. Иди спать!", act:"Финальный выстрел!"}],
 6:[
 {w:"b", s:"Hssss! Three heads, one body. I *has>have* to feed three mouths!", ru:"Хххх! Три головы, одно тело. Мне приходится кормить три рта!", act:"Иссушитель щёлкает тремя челюстями"},
 {w:"h", q:"Спроси, должен ли он умывать три лица", p:"*Do:h / you:w / have to / wash:d / three faces?:t", ru:"Тебе приходится умывать три лица?", act:"Герой целится"},
 {w:"b", s:"Yes! My left head *have>has* to wash first!", ru:"Да! Моя левая голова должна умываться первой!", act:"Левая голова гордо кивает"},
 {w:"h", q:"Скажи: а я должен делать уроки каждый день", p:"I:w / *have to:h / do:d / homework / every day.:n", ru:"А я должен делать уроки каждый день.", act:"Выстрел!"},
 {w:"b", s:"Homework? My middle head *have>has* to do it too!", ru:"Уроки? Моя средняя голова тоже должна их делать!", act:"Средняя голова вздыхает"},
 {w:"h", q:"Спроси, должна ли правая голова тоже", p:"*Does:h / your right head:w / have to / do:d / it?:t", ru:"А правая голова тоже должна?", act:"Герой показывает на правую голову"},
 {w:"b", s:"No! My right head *don't>doesn't* have to do anything. It is the boss!", ru:"Нет! Правой голове ничего не надо делать. Она главная!", act:"Правая голова ухмыляется"},
 {w:"h", q:"Скажи: тогда правая голова должна убирать базу!", p:"Then / your right head:w / *has to:h / clean:d / the base!:t", ru:"Тогда правая голова должна убирать базу!", act:"Выстрел!"},
 {w:"b", s:"Noooo! My heads *doesn't>don't* like cleaning!", ru:"Неееет! Мои головы не любят уборку!", act:"Все три головы ноют"},
 {w:"h", q:"Скажи: нам всем приходится убираться. Бери швабру!", p:"We all:w / *have to:h / clean.:d / Take the mop!", ru:"Нам всем приходится убираться. Бери швабру!", act:"Финальный выстрел шваброй!"}],
 7:[
 {w:"b", s:"RRRAAR! I ate all your food! There isn't *some>any* pizza now!", ru:"Рррааар! Я съел всю вашу еду! Пиццы больше нет!", act:"Дракон Края рыгает огнём"},
 {w:"h", q:"Спроси, есть ли ещё яйца", p:"Are there:d / *any:h / eggs?:t", ru:"Яйца ещё есть?", act:"Герой заглядывает в холодильник"},
 {w:"b", s:"Yes, there are *any>some* eggs. Three!", ru:"Да, немного яиц есть. Три!", act:"Дракон считает на когтях"},
 {w:"h", q:"Спроси, сколько осталось молока", p:"*How much:h / milk:t / is there?:d", ru:"Сколько там молока?", act:"Выстрел!"},
 {w:"b", s:"Not *many>much* milk. I drank it. Burp!", ru:"Молока немного. Я его выпил. Ик!", act:"Дракон громко икает"},
 {w:"h", q:"Скажи: нам нужно немного муки и яблоко", p:"We need:d / *some:h / flour / and an apple.:t", ru:"Нам нужно немного муки и яблоко.", act:"Герой берёт миску"},
 {w:"b", s:"How *much>many* apples? I like apples!", ru:"Сколько яблок? Я люблю яблоки!", act:"У дракона текут слюнки"},
 {w:"h", q:"Ответь: я хочу одно яблоко. Не трогай!", p:"I want:d / *an:h / apple.:t / Don't touch it!", ru:"Я хочу одно яблоко. Не трогай!", act:"Выстрел!"},
 {w:"b", s:"Too late! There aren't *some>any* apples now. Ha-ha!", ru:"Поздно! Яблок больше нет. Ха-ха!", act:"Дракон жуёт яблоко"},
 {w:"h", q:"Спроси, есть ли сыр, и предложи сделать пиццу", p:"Is there:d / *any:h / cheese? / Let's make a pizza!", ru:"Сыр есть? Давай сделаем пиццу!", act:"Финальный выстрел! Дракон надевает фартук"}],
 8:[
 {w:"b", s:"Order! Order! Where *are>were* you yesterday?!", ru:"К порядку! Где ты был вчера?!", act:"Последний Судья стучит кадилом"},
 {w:"h", q:"Ответь: я был дома", p:"I:w / *was:d / at home.:n", ru:"Я был дома.", act:"Герой поднимает руку"},
 {w:"b", s:"Lies! You *go>went* to the pool!", ru:"Враньё! Ты ходил в бассейн!", act:"Судья тычет пальцем"},
 {w:"h", q:"Ответь: да, я плавал в бассейне", p:"Yes, / I:w / *swam:d / in the pool.:n", ru:"Да, я плавал в бассейне.", act:"Выстрел!"},
 {w:"b", s:"And then you *eat>ate* five ice creams!", ru:"А потом ты съел пять мороженых!", act:"Судья листает протокол"},
 {w:"h", q:"Ответь: нет, я не ел мороженое!", p:"No, / I:w / *didn't:h / eat:d / ice cream!:t", ru:"Нет, я не ел мороженое!", act:"Герой возмущён"},
 {w:"b", s:"Then who *eated>ate* my ice cream?!", ru:"Тогда кто съел моё мороженое?!", act:"Судья плачет над пустым стаканчиком"},
 {w:"h", q:"Спроси, видел ли он вчера зерглинга", p:"*Did:h / you:w / see:d / a zergling / yesterday?:n", ru:"Ты видел вчера зерглинга?", act:"Выстрел!"},
 {w:"b", s:"Yes, I *see>saw* him. He had ice cream on his face!", ru:"Да, я его видел. У него было мороженое на морде!", act:"Судья задумался"},
 {w:"h", q:"Скажи: мороженое съел зерглинг! Дело закрыто!", p:"The zergling:w / *ate:d / it! / Case closed!", ru:"Его съел зерглинг! Дело закрыто!", act:"Финальный выстрел! Бах молотком!"}],
 9:[
 {w:"b", s:"En garde! I am *fastest>faster* than you!", ru:"К бою! Я быстрее тебя!", act:"Лейс делает выпад иглой"},
 {w:"h", q:"Спроси, кто самый сильный в галактике", p:"Who:h / is:d / *the strongest:h / in the galaxy?:n", ru:"Кто самый сильный в галактике?", act:"Герой целится"},
 {w:"b", s:"Me! My needle is *gooder>better* than your laser!", ru:"Я! Моя игла лучше твоего лазера!", act:"Лейс крутит иглу"},
 {w:"h", q:"Скажи: мой лазер длиннее твоей иглы", p:"My laser:w / is:d / *longer:h / than your needle.:t", ru:"Мой лазер длиннее твоей иглы.", act:"Выстрел!"},
 {w:"b", s:"But my hat is *prettyer>prettier* than yours!", ru:"Зато моя шляпа красивее твоей!", act:"Лейс поправляет шляпу"},
 {w:"h", q:"Спроси, что для неё самое ужасное", p:"What:h / is:d / *the worst:h / thing / for you?:t", ru:"Что для тебя самое ужасное?", act:"Герой хитро щурится"},
 {w:"b", s:"The *baddest>worst* thing is good grammar! It hurts the Plague!", ru:"Самое ужасное — хорошая грамматика! Она ранит Чуму!", act:"Из Лейс вылетают зелёные искры Чумы"},
 {w:"h", q:"Скажи: тогда я самый лучший учитель!", p:"Then / I:w / am:d / *the best:h / teacher!:t", ru:"Тогда я самый лучший учитель!", act:"Выстрел!"},
 {w:"b", s:"Noooo! Your English is *strong>stronger* than the Plague!", ru:"Неееет! Твой английский сильнее Чумы!", act:"Чума трещит и рассыпается"},
 {w:"h", q:"Скажи финальное: Чума, ты самая слабая. Улетай!", p:"Plague, / you:w / are:d / *the weakest!:h / Go away!", ru:"Чума, ты самая слабая. Улетай!", act:"Финальный выстрел!"}]
});
Object.assign(BOSS, {
 5:["","Зомби","Зомби вылез из шахты и стонет: «I can to eat brains! He cans run!» Ничего у него не получается. Объясни ему can!","Зомби понял: he can walk, but he can't run. И медленно ушёл обратно в шахту.","","Minecraft"],
 6:["","Иссушитель","Трёхголовый Иссушитель ленится всеми тремя головами: «I has to nothing! He have to sleep!» Объясни ему have to!","Иссушитель рассыпался! Теперь he has to clean the base. Всеми тремя головами.","","Minecraft"]});

/* ---------- v10: лут и прокачка героя ---------- */
const GEAR = [
 {id:"gun", e:"🔫", n:"Бластер", lv:["Супероружие заряжается за 4 ответа","Супероружие за 3 ответа","Супероружие за 3 ответа и бьёт золотым лучом"]},
 {id:"armor", e:"🛡", n:"Броня", lv:["+2 секунды на парирование","+4 секунды","+6 секунд"]},
 {id:"drone", e:"🛸", n:"Дрон-помощник", lv:["Подсвечивает ответ уже после первой ошибки","…и приносит +2 🔩 за каждый бой","…и летает рядом с героем в бою"]},
 {id:"boots", e:"👢", n:"Реактивные ботинки", lv:["Аркада +5 секунд","Аркада +10 секунд","Аркада +15 секунд"]}];
const GCOST = [5, 10, 20];
const TROPHY = {1:["🦷","Молочный зуб Зерглинга","Выпал сам. Зерглинг не плакал. Почти."],2:["🧪","Флакон кислоты Гидралиска","Не пить! Не нюхать! Не мыть им посуду!"],3:["👑","Корона Королевы Клинков","Немного пожёвана. Угадай кем."],4:["🟩","Похищенный блок травы","Эндермен вернул. Говорит, «одолжил»."],5:["🧦","Левый носок Зомби","Правый он съел. Запах — оружие массового поражения."],6:["💀","Запасная голова Иссушителя","На всякий случай. Иногда подмигивает."],7:["🍳","Фартук Дракона Края","После пиццы дракон передумал злиться."],8:["🔨","Молоток Последнего Судьи","Дело о мороженом закрыто навсегда."],9:["🪡","Игла Лейс","Отличная игла, чтобы зашить носок Зомби."]};
const HS = () => (S.hero = S.hero || {xp:0, parts:0, gear:{}, tro:{}, lv:1});
const gearLv = id => (HS().gear[id] || 0);
const heroLv = () => Math.floor(Math.sqrt(HS().xp / 8)) + 1;
const xpFor = l => 8 * (l - 1) * (l - 1);
const duelSec = () => DUEL_SEC + 2 * gearLv("armor");
const superAt = () => Math.max(3, SUPER_AT - gearLv("gun"));
const glowN = () => gearLv("drone") >= 1 ? 1 : 2;
function lootAfter(stars){ const h = HS(), n = R.m.n, out = [];
  const xp = Math.max(1, R.N - R.wrong) + stars * 2, l0 = heroLv(); h.xp += xp;
  const parts = 2 + stars + (gearLv("drone") >= 2 ? 2 : 0) + (Math.random() < .3 ? 3 : 0); h.parts += parts;
  out.push(`🔩 Добыча: <b>+${parts} деталей</b> · ⭐ опыт +${xp}`);
  if (!h.tro[n]) { h.tro[n] = Date.now(); const T = TROPHY[n]; out.push(`${T[0]} Трофей: <b>${esc(T[1])}</b>. ${esc(T[2])}`); }
  const l1 = heroLv(); if (l1 > l0) out.push(`🎖 <b>Новый уровень героя: ${l1}!</b>`);
  const can = GEAR.filter(g => gearLv(g.id) < 3 && h.parts >= GCOST[gearLv(g.id)]); if (can.length) out.push(`🛠 Хватает деталей на улучшение: ${can.map(g => g.e + " " + g.n).join(", ")}`);
  save(); return out; }
function hangar(){
  const h = HS(), l = heroLv(), nx = xpFor(l + 1), pv = xpFor(l);
  $("#best").innerHTML = `<div class="panel cut hang"><h2>🧑‍🚀 Ангар героя</h2>
    <div class="hlv"><span class="hl">Ур. ${l}</span><div class="dq-bar"><i style="width:${Math.min(100, 100 * (h.xp - pv) / (nx - pv))}%"></i><span>опыт ${h.xp - pv} / ${nx - pv}</span></div><span class="hp2">🔩 ${h.parts} деталей</span></div>
    <p class="joke">Детали падают с боссов. За них улучшай снаряжение: каждое улучшение помогает в бою.</p>
    <div class="gear">${GEAR.map(g => { const v = gearLv(g.id), c = GCOST[v]; return `<div class="gi cut"><div class="ge">${g.e}</div><div><b>${g.n}</b> <span class="gl">${"★".repeat(v)}${"☆".repeat(3 - v)}</span>
      <div class="gd">${v ? esc(g.lv[v - 1]) : "Не улучшен"}</div>${v < 3 ? `<div class="gn">Дальше: ${esc(g.lv[v])}</div><button class="say gb" data-g="${g.id}" ${h.parts < c ? "disabled" : ""}>Улучшить за ${c} 🔩</button>` : '<div class="gn">Максимум!</div>'}</div></div>`; }).join("")}</div>
    <div class="sec-h">🏆 Трофеи боссов · ${Object.keys(h.tro).length} из 9</div>
    <div class="tros">${M.map(m => { const T = TROPHY[m.n], has = h.tro[m.n]; return `<div class="tro cut ${has ? "" : "off"}"><span>${has ? T[0] : "❔"}</span><b>${has ? esc(T[1]) : "Победи: " + esc(BOSS[m.n][1])}</b>${has ? `<small>${esc(T[2])}</small>` : ""}</div>`; }).join("")}</div></div>`;
  $("#best").querySelectorAll(".gb").forEach(b => b.onclick = () => { const id = b.dataset.g, v = gearLv(id), c = GCOST[v]; if (h.parts < c || v >= 3) return;
    h.parts -= c; h.gear[id] = v + 1; save(); sfx("win"); toast(`🛠 <b>${GEAR.find(g => g.id === id).n}</b> улучшен до ★${v + 1}!`); hangar(); });
  show("v-best"); }
{ const hq0 = hqRender; hqRender = function(){ hq0(); const h = HS();
  $("#b-best").insertAdjacentHTML("beforebegin", `<button class="hqb cut" id="b-hang"><span class="ic">🧑‍🚀</span><b>Ангар · ур. ${heroLv()}</b><small>🔩 ${h.parts} деталей · снаряжение и трофеи</small></button>`);
  $("#b-hang").onclick = hangar; }; }
{ const f0 = finish; finish = function(){ const st = starsNow(); f0(); const L = lootAfter(st), rows = document.querySelectorAll("#result .row");
  rows[rows.length - 1].insertAdjacentHTML("beforebegin", `<div class="box newm loot">${L.join("<br>")} <button class="say" id="b-hang2">Открыть ангар</button></div>`); $("#b-hang2").onclick = hangar; }; }
/* снаряжение видно в бою: значки и дрон над картинкой боя */
function gearOverlay(){ const st = document.querySelector("#v-play .stage"); if (!st) return; let o = st.querySelector(".gearov"); if (!o) { o = document.createElement("div"); o.className = "gearov"; st.appendChild(o); }
  o.innerHTML = `<span class="glv">Ур. ${heroLv()}</span>${GEAR.filter(g => gearLv(g.id)).map(g => `<span>${g.e}${gearLv(g.id)}</span>`).join("")}${gearLv("drone") >= 1 ? '<i class="drone">🛸</i>' : ""}`; }

/* ---------- состояние v6 ---------- */
S.gems = S.gems || 0; S.cards = S.cards || {}; S.streak = S.streak || {n:0, last:null, best:0}; S.owned = S.owned || [0]; S.arcBest = S.arcBest || {};
if (S.spd == null || !S.v7) { S.spd = 0; S.v7 = 1; } if (S.dq && S.dq.id === "blitz") S.dq = null;
function spdBtn(){ const b = $("#b-spd"); if (b) { b.textContent = SPD[S.spd][1]; b.title = "Скорость речи: " + SPD[S.spd][2]; } }
$("#b-spd").onclick = () => { S.spd = (S.spd + 1) % 3; save(); spdBtn(); toast(`🔊 Скорость речи: <b>${SPD[S.spd][2]}</b>`); say("I am a commander."); };
spdBtn();
{ const h = HS(); M.forEach(m => { if ((S.m[m.n]?.best || 0) >= 1 && !h.tro[m.n]) h.tro[m.n] = Date.now(); }); }
save();
home();

/* ---------- v12: облачное сохранение по коду (GitHub) + мини-игры в Штабе ---------- */
const CLOUD = (() => {
  const API = "https://api.github.com/repos/punic09-hue/kosmobaza/contents/saves/", TK = "kosmo-gh-token";
  const tok = () => { try { return localStorage.getItem(TK) || ""; } catch(e) { return ""; } };
  const b64 = s => btoa(unescape(encodeURIComponent(s)));
  const get = (code, auth) => fetch(API + code + ".json?t=" + Date.now(), {cache:"no-store", headers:Object.assign({Accept:"application/vnd.github+json"}, auth && tok() ? {Authorization:"Bearer " + tok()} : {})});
  let timer = null, st = "";
  async function newCode(){ for (let k = 0; k < 8; k++) { const c = String(1000 + Math.floor(Math.random() * 9000)); const r = await get(c, true); if (r.status === 404) return c; } throw new Error("нет свободного кода"); }
  async function push(){
    if (!tok()) { st = "нет ключа GitHub на этом устройстве"; return false; }
    try {
      if (!S.cloud) { S.cloud = await newCode(); localStorage.setItem(KEY, JSON.stringify(S)); }
      const r = await get(S.cloud, true), sha = r.ok ? (await r.json()).sha : undefined;
      const body = {message:"save " + S.cloud, content:b64(JSON.stringify(Object.assign({}, S, {savedAt:Date.now()}))), sha};
      const p = await fetch(API + S.cloud + ".json", {method:"PUT", headers:{Authorization:"Bearer " + tok(), Accept:"application/vnd.github+json"}, body:JSON.stringify(body)});
      st = p.ok ? "сохранено в облако " + new Date().toLocaleTimeString("ru-RU", {hour:"2-digit", minute:"2-digit"}) : "ошибка облака " + p.status; return p.ok;
    } catch(err) { st = "нет связи с облаком"; return false; }
  }
  function soon(){ if (!tok()) return; clearTimeout(timer); timer = setTimeout(push, 4000); }
  async function load(code){
    const r = await fetch(API + code + ".json?t=" + Date.now(), {cache:"no-store", headers:{Accept:"application/vnd.github.raw+json"}});
    if (r.status === 404) throw new Error("Сохранения с кодом " + code + " нет");
    if (!r.ok) throw new Error("Облако не отвечает (" + r.status + ")");
    const d = await r.json(); if (!d || !d.m) throw new Error("Файл сохранения повреждён");
    try { localStorage.setItem(KEY + "-backup-" + Date.now(), JSON.stringify(S)); } catch(e) {}
    d.cloud = code; delete d.savedAt; localStorage.setItem(KEY, JSON.stringify(d)); location.reload();
  }
  return {push, soon, load, tok, TK, status:() => st};
})();
{ const _save = save; save = function(){ _save(); CLOUD.soon(); }; }
function cloudDlg(){
  let o = $("#cloud-dlg"); if (!o) { o = document.createElement("div"); o.id = "cloud-dlg"; document.body.appendChild(o); }
  o.innerHTML = `<div class="cloud-card cut"><h2>☁ Загрузить прогресс</h2><p>Введи 4-значный код сохранения. Он есть в Штабе на том устройстве, где ты играл.</p>
   <input id="cl-code" type="text" inputmode="numeric" maxlength="4" placeholder="0000"><p class="joke" id="cl-msg">${S.cloud ? "Код этого устройства: " + S.cloud : ""}</p>
   <div class="row"><button class="big" id="cl-go">Загрузить</button><button class="say" id="cl-x">Отмена</button></div></div>`;
  o.hidden = false; $("#cl-x").onclick = () => o.hidden = true;
  $("#cl-go").onclick = async () => { const c = $("#cl-code").value.trim(); if (!/^\d{4}$/.test(c)) { $("#cl-msg").textContent = "Нужно 4 цифры."; return; }
    if (!$("#cl-go").dataset.ok) { $("#cl-go").dataset.ok = 1; $("#cl-go").textContent = "Точно? Текущий прогресс здесь заменится"; return; }
    $("#cl-msg").textContent = "Загружаю…"; try { await CLOUD.load(c); } catch(err) { $("#cl-msg").textContent = err.message; } };
}
{ const p = $("#b-parent"); if (p) { const b = document.createElement("button"); b.className = "link"; b.id = "b-cloud"; b.textContent = "☁ Загрузить прогресс по коду"; b.onclick = cloudDlg; p.before(b); } }
{ const _parent = parent; parent = function(){ _parent.apply(this, arguments);
  const AK = ["catch","rocks","tir","feed","mole","gum"], off = S.cfg.arcOff || [];
  const box = document.createElement("div"); box.innerHTML = `
   <h3>Мини-игры</h3>
   <p>Галочка: игра выпадает между волнами. Кнопка «Играть» запускает её сразу, для проверки (звёзды и деньги не начисляются).</p>
   <div class="arcl">${AK.map(k => `<div class="arci"><label><input type="checkbox" data-arc="${k}" ${off.includes(k) ? "" : "checked"}> ${esc(ARC_NAMES[k])}</label><button class="say" data-play="${k}">▶ Играть</button></div>`).join("")}</div>
   <h3>Облачное сохранение</h3>
   <p>Код сохранения этого устройства: <b class="cl-code">${S.cloud || "ещё не создан"}</b>. На другом устройстве нажмите внизу главного экрана «☁ Загрузить прогресс по коду» и введите его. Файл хранится в открытом репозитории GitHub kosmobaza.</p>
   <div class="cfg"><label for="i-gh">Ключ GitHub (нужен, чтобы это устройство сохраняло в облако)</label><input id="i-gh" type="password" placeholder="github_pat_…" value="${CLOUD.tok() ? "••••••••" : ""}"></div>
   <div class="row"><button class="say" id="b-gh">Сохранить ключ и выгрузить сейчас</button><span class="joke" id="gh-msg">${esc(CLOUD.status())}</span></div>`;
  const P = $("#parent"), anchor = P.querySelector("#b-reset")?.closest(".row"); anchor ? anchor.before(box) : P.appendChild(box);
  box.querySelectorAll("[data-arc]").forEach(c => c.onchange = () => { const k = c.dataset.arc; S.cfg.arcOff = (S.cfg.arcOff || []).filter(x => x !== k); if (!c.checked) S.cfg.arcOff.push(k); save(); });
  box.querySelectorAll("[data-play]").forEach(b => b.onclick = () => { const g = S.gems, d = JSON.stringify(S.dq || null); ARC.run(1 + Math.floor(Math.random() * 9), b.dataset.play, () => { S.gems = g; if (d !== "null") S.dq = JSON.parse(d); save(); parent(); }); });
  $("#b-gh").onclick = async () => { const v = $("#i-gh").value.trim(); if (v && !v.startsWith("•")) localStorage.setItem(CLOUD.TK, v); $("#gh-msg").textContent = "Выгружаю…"; const ok = await CLOUD.push(); $("#gh-msg").textContent = CLOUD.status(); if (ok) box.querySelector(".cl-code").textContent = S.cloud; };
}; }
const ARC_NAMES = {catch:"🧲 Ловец слов", rocks:"☄️ Метеоритный дождь", tir:"🎯 Тир на скорость", feed:"🍕 Покорми монстра", mole:"🔨 Бонк пришельцев", gum:"🫧 Жвачка"};
