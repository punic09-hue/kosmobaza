"""v6 «Сделать игру интереснее»: короткие бои, задание дня, аркады, блиц, разъёмы, ползунок времени, сценки, злодей с ошибками, бестиарий.
Запуск: python3 patch6.py <grammar_game_final_v5.html> <ext6.js> <ext6.css> <выход.html>"""
import sys
src, extjs, extcss, out = sys.argv[1:5]
s = open(src, encoding="utf-8").read()
def R(a, b):
    global s
    assert s.count(a) == 1, "MISSING/DUP: " + a[:90]
    s = s.replace(a, b)

# --- CSS и разметка
R("@media (prefers-reduced-motion:reduce)", open(extcss, encoding="utf-8").read() + "\n@media (prefers-reduced-motion:reduce)")
R('<div class="wallet" id="wallet"></div>', '<div class="wallet" id="wallet"></div>\n    <div class="hq" id="hq"></div>')
R("Каждая миссия: 3 волны, около 15 минут.", "Каждая миссия: 10 заданий в 2 волны, между ними аркада, около 5 минут.")
R('''<div id="toast" role="status"></div>''', '''<div id="toast" role="status"></div>''')
R('''  <section class="view" id="v-parent" hidden>''', '''  <section class="view" id="v-arc" hidden>
    <div class="arc-top"><div class="ttype" id="arc-t"></div><div class="arc-hud"><span>Очки <b id="arc-sc">0</b></span><span>Рекорд <b id="arc-best">0</b></span></div></div>
    <div class="arcbar"><i id="arc-bar"></i></div>
    <div class="arcstage cut"><canvas id="acv"></canvas><div class="arc-ov" id="arc-ov" hidden></div></div>
    <div class="arc-help">Аркада идёт 35 секунд. Время боя на паузе, звёзды за бой не меняются.</div>
  </section>

  <section class="view" id="v-best" hidden>
    <div class="bar"><button class="back cut" data-home>← База</button></div>
    <div id="best"></div>
  </section>

  <section class="view" id="v-parent" hidden>''')

# --- графика: цвет лазера из арсенала и реплики злодея
R('F.laser = {t0: F.t, col: crit ? "#FFD84D" : "#39D0FF", crit};', 'F.laser = {t0: F.t, col: crit ? "#FFD84D" : laserCol(), crit};')
R("    busy() { return !!F.eat; },", "    busy() { return !!F.eat; },\n    taunt(txt) { if (F.c && !F.dead) say(txt); },")

# --- настройки: короткие бои по умолчанию, миграция старых сохранений
R("cfg:{rate5:50, rate34:10, cap:3, tasks:30, minutes:15, pin:\"2580\"}", "cfg:{rate5:50, rate34:10, cap:3, tasks:10, minutes:5, pin:\"2580\", chest:0, scenes:true, arcade:true, v6:1}")
R("S.cfg = Object.assign(DEF().cfg, r.cfg);", "S.cfg = Object.assign(DEF().cfg, r.cfg); if (!r.cfg || !r.cfg.v6) { S.cfg.tasks = 10; S.cfg.minutes = 5; S.cfg.v6 = 1; }")
R("const paidToday = () => S.pay.ledger.filter(l => l.day === today()).length;", "const paidToday = () => S.pay.ledger.filter(l => l.day === today() && l.m).length;")

# --- главный экран
R('''  show("v-home");\n}''', '''  hqRender();\n  show("v-home");\n}''')

# --- брифинг
R('<div><b>3 волны</b>между волнами перезарядка, время на паузе</div>', '<div><b>${Math.ceil(N / WAVE)} волны</b>${S.cfg.arcade ? `между ними аркада на ${ARC_SEC} секунд` : "между ними перезарядка"}. Сценки и аркада не тратят время боя</div>')

# --- задания
R("function makeTask(m, k, used){\n", "function makeTask(m, k, used){\n  if (k === \"fix\") return makeFix(m, used);\n  if (k === \"time\") return makeTime(m);\n")
R("return {k, parts:b.parts, ru:b.ru, dec:decoys(m.n, b.parts, ki)}; }", "return {k, parts:b.parts, ru:b.ru, ki, dec:decoys(m.n, b.parts, ki)}; }")
R("if (k === \"build\") return {k, parts:g.parts, dec:decoys(m.n, g.parts, g.key, wrong)};", "if (k === \"build\") return {k, parts:g.parts, ki:g.key, dec:decoys(m.n, g.parts, g.key, wrong)};")
R("if (k === \"choose\") return {k, s:g.parts.map((p, i) => i === g.key ? \"___\" : p.t).join(\" \"), o:opts6(right, [right, ...wrong], m.n), a:right, h:g.hint};",
  "if (k === \"choose\") return {k, s:g.parts.map((p, i) => i === g.key ? \"___\" : p.t).join(\" \"), o:opts6(right, [right, ...wrong], m.n), a:right, h:g.hint, parts:g.parts, ki:g.key};")
R('pattern = ["choose","build","listen","err","choose","build","choose","err","build","listen"], used = new Set();', "pattern = patternFor(m.n), used = new Set();")
R("tasks.push(makeTask(m, pattern[i % 10], used));", "tasks.push(makeTask(m, pattern[i % pattern.length], used));")
R("function task(){\n  hud();", "function taskInner(){\n  hud();")
R("wave = Math.floor(R.i / 10) + 1, waves = Math.ceil(R.N / 10);", "wave = Math.floor(R.i / WAVE) + 1, waves = Math.ceil(R.N / WAVE);")
R("  if (t.k === \"build\") {\n    const all", "  if (EXT_T[t.k]) EXT_T[t.k](t, P, head, nextBtn);\n  else if (t.k === \"build\") {\n    const all")
R("    if (R.i % 10 === 0) return pause();", "    if (R.i % WAVE === 0) return pause();")
R("function finish(){\n  stopClock(); GFX.unmount(); if (R.N % 10 === 0 && R.waveWrong === 0) R.sniper = true;", "function finishOld(){\n  stopClock(); GFX.unmount(); if (R.N % WAVE === 0 && R.waveWrong === 0) R.sniper = true;")

# --- штаб
R('<td>${l.m}. ${esc(M.find(m => m.n === l.m).title)}</td>', '<td>${l.m ? l.m + ". " + esc(M.find(m => m.n === l.m).title) : "🎁 Сундук серии"}</td>')
R('const kinds = {build:"сборка фразы", choose:"выбор помощника", err:"поиск ошибки", listen:"на слух"};', 'const kinds = {build:"сборка фразы", choose:"выбор помощника", err:"поиск ошибки", listen:"на слух", fix:"поправить злодея", time:"ползунок времени"};')
R('<label for="i-tasks">Задач в миссии (кратно 10)</label><input id="i-tasks" type="number" min="10" max="60" step="10" value="${S.cfg.tasks}">',
  '<label for="i-tasks">Задач в миссии (кратно 5)</label><input id="i-tasks" type="number" min="5" max="30" step="5" value="${S.cfg.tasks}">')
R('''<label for="i-pin">Код входа в Штаб (4 цифры)</label><input id="i-pin" type="text" inputmode="numeric" maxlength="4" value="${esc(S.cfg.pin)}">''',
  '''<label for="i-pin">Код входа в Штаб (4 цифры)</label><input id="i-pin" type="text" inputmode="numeric" maxlength="4" value="${esc(S.cfg.pin)}">
    <label for="i-chest">Бонус в сундуке 7-го дня, ₽ (0 = без денег)</label><input id="i-chest" type="number" min="0" max="1000" value="${S.cfg.chest || 0}">
    <label for="i-scn">Сценки перед заданиями</label><input id="i-scn" type="checkbox" ${S.cfg.scenes ? "checked" : ""}>
    <label for="i-arc">Аркада между волнами</label><input id="i-arc" type="checkbox" ${S.cfg.arcade ? "checked" : ""}>''')
R('S.cfg.tasks = Math.round(n("#i-tasks", 10, 60, 30) / 10) * 10;', 'S.cfg.tasks = Math.max(5, Math.round(n("#i-tasks", 5, 30, 10) / 5) * 5); S.cfg.chest = n("#i-chest", 0, 1000, 0); S.cfg.scenes = $("#i-scn").checked; S.cfg.arcade = $("#i-arc").checked;')
R("Время между волнами (перезарядка) не считается.</p>", '''Аркада между волнами и сценки перед заданиями время не тратят.</p>
   <h3>Задание дня и серия</h3>
   <p>Сегодня: ${esc(DQ.find(x => x.id === dqToday().id).t)} — ${dqToday().done ? "выполнено" : `${dqToday().prog} из ${DQ.find(x => x.id === dqToday().id).goal}`}. Серия: ${streakNow()} (лучшая ${S.streak.best || 0}). Кристаллов: ${S.gems || 0}. Карточек бестиария: ${cardsOwned()} из ${CARDS.length}.</p>
   <p>Сундук 7-го дня даёт 15 кристаллов, секретную карточку и бонус из настройки выше (если он больше 0, сумма попадёт на счёт как от Командования).</p>''')
R("S.m = {}; S.log = []; S.medals = {}; S.days = []; save(); parent();", "S.m = {}; S.log = []; S.medals = {}; S.days = []; S.cards = {}; S.streak = {n:0, last:null, best:0}; S.dq = null; save(); parent();")

# --- скорость речи (v7): три ступени, по умолчанию «очень медленно»
R("u.rate = (slow || S.slow) ? 0.68 : 0.9;", "u.rate = rateOf(slow);")
R('<button class="sound cut" id="b-sound" aria-label="Звук"></button>', '<button class="sound cut" id="b-sound" aria-label="Звук"></button><button class="sound cut" id="b-spd" aria-label="Скорость речи"></button>')
R('<label class="say"><input type="checkbox" id="c-slow" ${S.slow ? "checked" : ""}> Медленная озвучка</label>', '<label class="say">Скорость речи <select id="c-slow">${SPD.map((x, i) => `<option value="${i}" ${S.spd === i ? "selected" : ""}>${x[2]}</option>`).join("")}</select></label>')
R('$("#c-slow").onchange = e => { S.slow = e.target.checked; save(); say("This is how I sound now."); };', '$("#c-slow").onchange = e => { S.spd = +e.target.value; save(); spdBtn(); say("This is how I sound now."); };')

# --- v8: порядок боссов StarCraft → Minecraft → Silksong (BGMAP: сектор → «родной» номер босса/фона)
R("    switch (n) {", "    switch (BGMAP[n] || n) {")
R("const [ac, adir] = AMB[F.n];", "const [ac, adir] = AMB[BGMAP[F.n] || F.n];")
R("pick(TAUNTS[F.n])", "pick(TAUNTS[BGMAP[F.n] || F.n])")
R('sub:"Королевство жуков-рыцарей"', 'sub:"Улей Королевы Клинков"')
R('{n:3, emo:"🪲"', '{n:3, emo:"👑"')
R('["bug","🪲","Друг жуков","Сектор 3 на ★★★★★."]', '["bug","🪲","Друг жуков","Сектор 8 на ★★★★★."]')
R("if (stars === 5 && m.n === 3) award(\"bug\", got);", "if (stars === 5 && m.n === 8) award(\"bug\", got);")
# --- v8: дуэль (прототип, сектор 1)
R('  if (k === "fix") return makeFix(m, used);', '  if (k === "fix") return makeFix(m, used);\n  if (k === "duel") return {...makeFix(m, used), k:"duel"};\n  if (k === "talk") return talkTask(m, used);')

# --- второй скрипт с новыми механиками; home() теперь вызывается из него
R("\nhome();\n</script>", "\n</script>\n<script>\n" + open(extjs, encoding="utf-8").read() + "\n</script>")
# --- v10: вирус Глюк → Чума (женский род), Glitch → Plague
for a, b in [("вирус Глюк. Он вселился", "вирус Чума. Она вселилась"), ("Глюк повержен", "Чума повержена"), ("ГЛЮК УНИЧТОЖЕН", "ЧУМА УНИЧТОЖЕНА"),
             ("вселился сам Глюк", "вселилась сама Чума"), ("Глюк прислал письмо", "Чума прислала письмо"), ("Глюк держит секторов", "Чума держит секторов"),
             ("Глюк сюда не вернётся", "Чума сюда не вернётся"), ("Глюк пишет завещание", "Чума пишет завещание"), ("Глюк сломал один блок", "Чума сломала один блок"),
             ("Глюк научил меня", "Чума научила меня"), ("Глюк, ты меня обманул", "Чума, ты меня обманула"), ("Глюк сильнее тебя", "Чума сильнее тебя"),
             ("Не кормить Глюка", "Не кормить Чуму"), ("ГЛЮК: захвачено", "ЧУМА: захвачено"), ("«Глюк»", "«Чума»"), ("«ГЛЮК»", "«ЧУМА»"),
             ("Глюк — это вирус", "Чума — это вирус"), ("name:\"Глюк\"", "name:\"Чума\""), ("У него нет тела", "У неё нет тела"),
             ("Glitch is a virus", "Plague is a virus"), ('["Glitch",3,"a bug"]', '["Plague",3,"a bug"]'), ('"glitch":"Глюк|m"', '"plague":"Чума|f"')]:
    assert a in s, "RENAME: " + a; s = s.replace(a, b)
for a, b in [("Глюка", "Чумы"), ("Глюком", "Чумой"), ("Глюк", "Чума")]: s = s.replace(a, b)
assert "Глюк" not in s and "ГЛЮК" not in s

open(out, "w", encoding="utf-8").write(s)
print(len(s))
