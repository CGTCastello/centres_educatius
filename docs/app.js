/* Mapa de centres educatius · CGT Castelló */
(() => {
  "use strict";

  // ---------- Icones (traç, sense farciment) ----------
  const ICONES = {
    menjador: "M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 21V3c-2.2 1.2-3.5 4-3.5 7.5V13H17",
    transport: "M5 4h14v13H5zM5 11h14M8 17v3M16 17v3M8 14h.01M16 14h.01",
    llibres: "M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z",
    rellotge: "M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 7v5l3 2",
    internat: "M3 19V7M3 15h18v4M21 15v-3a3 3 0 0 0-3-3h-7v6M6.5 10.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0",
    cafeteria: "M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2M8 3v3M12 3v3",
    estiu: "M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2",
    nadó: "M8 8a4 4 0 1 0 8 0a4 4 0 1 0-8 0M5 21a7 7 0 0 1 14 0",
    pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 7.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5z",
    ruta: "M3 11l18-8-8 18-2-8z",
    telefon: "M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a1 1 0 0 1-1 1A17 17 0 0 1 4 5a1 1 0 0 1 1-1z",
    web: "M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9M12 3c-2.5 2.5-3.5 5.5-3.5 9s1 6.5 3.5 9",
    correu: "M3 5h18v14H3zM3 6l9 7 9-7",
    descarrega: "M12 4v11M7 10l5 5 5-5M5 20h14",
    creu: "M6 6l12 12M18 6L6 18",
    enrere: "M15 6l-6 6 6 6",
    cap: "M4 4l16 16",
  };
  const ic = (n, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONES[n] || ""}"/></svg>`;

  // ---------- Text ----------
  const SIGLES = new Set(["CEIP", "IES", "CRA", "EI", "CEE", "FPA", "CIPFP", "EOI", "SES", "CPFPA", "CEIPSO", "CPEE", "CC", "CP",
    "I", "II", "III", "IV", "V", "VI", "XIII", "XXIII", "FP", "ESO", "CEED", "EASD", "EPA", "CEFIRE", "UJI", "SAFA", "CIL", "PMAR", "ADEAC", "CPM", "CEM", "CFGS", "CFGM", "ESVIM", "CENETED"]);
  const PETITES = new Set(["de", "del", "dels", "la", "les", "el", "els", "i", "y", "a", "al", "als", "en", "per", "amb", "da", "do", "los", "las", "of", "the", "and"]);
  function bonic(s) {
    if (!s) return s || "";
    return s.toLowerCase().split(/(\s+)/).map((w, i) => {
      if (/^\s+$/.test(w)) return w;
      const up = w.toUpperCase();
      if (SIGLES.has(up.replace(/[.,]/g, ""))) return up;
      if (i > 0 && PETITES.has(w)) return w;
      // apòstrofs: d'uixó -> d'Uixó, l'ereta -> l'Ereta
      const m = w.match(/^([dl]’|[dl]')(.+)$/);
      if (m) return (i === 0 ? m[1].toUpperCase() : m[1]) + (SIGLES.has(m[2].toUpperCase()) ? m[2].toUpperCase() : cap(m[2]));
      return w.split("-").map((p, j) => (j > 0 && p === "real" ? p : cap(p))).join("-");
    }).join("");
  }
  function cap(p) { return p ? p.charAt(0).toUpperCase() + p.slice(1) : p; }
  const norm = (s) => (s || "").toString().normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const km = (d) => (d < 1 ? `${Math.round(d * 1000 / 50) * 50} m` : `${d.toFixed(d < 10 ? 1 : 0).replace(".", ",")} km`);

  // ---------- Definicions ----------
  const REGIMS = [
    { k: "Públic", curt: "Públic", cls: "public" },
    { k: "Privat concertat", curt: "Concertat", cls: "concertat" },
    { k: "Privat no concertat", curt: "Privat", cls: "privat" },
  ];
  const regimInfo = (r) => REGIMS.find((x) => x.k === r) || REGIMS[2];

  const FLAGS = [
    { k: "menjador_aut", l: "Menjador escolar autoritzat", curt: "Menjador", ic: "menjador", ajuda: "El que compta el filtre «Menjador» de Conselleria" },
    { k: "menjador", l: "Menjador (qualsevol)", curt: "Menjador (qualsevol)", ic: "menjador", ajuda: "Inclou també escoletes i centres privats" },
    { k: "transport", l: "Transport escolar", curt: "Transport", ic: "transport" },
    { k: "banc_llibres", l: "Banc de llibres", curt: "Banc de llibres", ic: "llibres" },
    { k: "jornada_continua", l: "Jornada contínua (9 a 14 h)", curt: "Jornada contínua", ic: "rellotge" },
    { k: "aula_2anys", l: "Aula de dos anys", curt: "Aula 2 anys", ic: "nadó" },
    { k: "aula_cil", l: "Aula de comunicació i llenguatge (CIL)", curt: "Aula CIL" },
    { k: "internat", l: "Internat", curt: "Internat", ic: "internat" },
    { k: "cafeteria", l: "Cafeteria / bar", curt: "Cafeteria", ic: "cafeteria" },
    { k: "cursos_estiu", l: "Cursos d'estiu", curt: "Cursos d'estiu", ic: "estiu" },
    { k: "fse", l: "Fons Socials Europeus", curt: "FSE" },
  ];
  const flag = (k) => FLAGS.find((f) => f.k === k);
  const RAPIDS = [
    { grup: "flags", v: "menjador_aut", l: "Menjador", ic: "menjador" },
    { grup: "flags", v: "transport", l: "Transport", ic: "transport" },
    { grup: "flags", v: "banc_llibres", l: "Banc de llibres", ic: "llibres" },
    { grup: "flags", v: "jornada_continua", l: "Jornada contínua", ic: "rellotge" },
  ];
  const ETAPES = ["Infantil 0-3", "Infantil 3-6", "Primària", "ESO", "Batxillerat", "Formació professional",
    "Educació especial", "Persones adultes", "Música i dansa", "Arts i disseny", "Ensenyances esportives", "Idiomes"];
  const ETAPA_AJUDA = { "Infantil 0-3": "Escoleta, de 0 a 3 anys", "Infantil 3-6": "De 3 a 6 anys" };

  const siNo = (b) => (b ? "Sí" : "No");
  const llista = (a) => (a || []).join(", ");
  const COLS = [
    { k: "codi", l: "Codi", v: (c) => c.codi },
    { k: "nom", l: "Centre", v: (c) => c._nom, def: true, cls: "col-nom" },
    { k: "tipus", l: "Tipus", v: (c) => c.tipus, def: true },
    { k: "regim", l: "Règim", v: (c) => c.regim, def: true },
    { k: "municipi", l: "Municipi", v: (c) => c._muni, def: true },
    { k: "comarca", l: "Comarca", v: (c) => c._comarca },
    { k: "adreca", l: "Adreça", v: (c) => `${c.adreca} · ${c.cp}` },
    { k: "telefon", l: "Telèfon", v: (c) => c.telefon || "", def: true },
    { k: "correu", l: "Correu", v: (c) => c.correu || "" },
    { k: "web", l: "Web", v: (c) => c.web || "" },
    { k: "etapes", l: "Ensenyaments", v: (c) => llista(c.etapes), def: true },
    ...FLAGS.map((f) => ({ k: f.k, l: f.l, curt: f.curt, v: (c) => siNo(c.f[f.k]), flag: true,
      def: ["menjador_aut", "transport", "banc_llibres", "jornada_continua"].includes(f.k) })),
    { k: "unitats", l: "Unitats actives", v: (c) => c.unitats, num: true },
    { k: "llocs", l: "Llocs actius", v: (c) => c.llocs, num: true },
    { k: "jornada", l: "Jornada", v: (c) => c.jornada.join(" ") },
    { k: "programes", l: "Programes i característiques", v: (c) => llista(c.programes) },
    { k: "installacions", l: "Instal·lacions", v: (c) => llista(c.installacions) },
    { k: "idiomes", l: "Idiomes", v: (c) => llista(c.idiomes) },
    { k: "titular", l: "Titular", v: (c) => c.titular || "" },
    { k: "cif", l: "CIF", v: (c) => c.cif || "" },
    { k: "lat", l: "Latitud", v: (c) => c.lat, num: true },
    { k: "lng", l: "Longitud", v: (c) => c.lng, num: true },
  ];
  const DIST_COL = { k: "dist", l: "Distància (km)", v: (c) => (c._dist != null ? Math.round(c._dist * 10) / 10 : ""), num: true };

  const fitxaOficial = (c) => `https://xacen.gva.es/xacen-frontend/centro?codigoCentro=${c.codi}&lang=va`;

  // Model de la fitxa per al PDF (pdf.js)
  function seccions(c) {
    const kv = (files) => ({ tipus: "kv", files: files.filter((f) => f[1] !== null && f[1] !== undefined && f[1] !== "") });
    const s = [];
    s.push({ titol: "Dades del centre", ...kv([
      ["Codi", c.codi], ["Denominació", c.generica], ["Tipus", c.tipus], ["Règim", c.regim],
      ["Titular", c.titular], ["CIF", c.cif], ["Comarca", c._comarca],
    ]) });
    s.push({ titol: "Contacte i ubicació", ...kv([
      ["Adreça", `${c.adreca}, ${c.cp} ${c._muni}`], ["Telèfon", c.telefon], ["Fax", c.fax],
      ["Correu", c.correu], ["Web", c.web],
    ]) });
    const altres = c.serveis.filter((x) => !["Menjador escolar autoritzat", "Menjador", "Transport", "Cafeteria/bar", "Cursos d'estiu"].includes(x) && !/^Internat/.test(x));
    s.push({ titol: "Serveis complementaris", tipus: "kv", sino: true, files: [
      ["Menjador escolar autoritzat", c.f.menjador_aut],
      ...(c.f.menjador && !c.f.menjador_aut ? [["Menjador (sense autorització de Conselleria)", true]] : []),
      ["Transport escolar", c.f.transport],
      ["Banc de llibres", c.f.banc_llibres],
      ["Internat", c.f.internat],
      ["Cafeteria / bar", c.f.cafeteria],
      ["Cursos d'estiu", c.f.cursos_estiu],
      ...altres.map((x) => [x, true]),
    ] });
    s.push({ titol: "Horari", tipus: "llista", items: c.jornada });
    s.push({ titol: "Programes i característiques", tipus: "llista", items: c.programes });
    s.push({ titol: "Què s'hi estudia", tipus: "taula",
      cap: ["Nivell", "Unitats", "Llocs"], num: [1, 2],
      files: c.nivells, peu: c.nivells.length > 1 ? ["Total", c.unitats, c.llocs] : null });
    s.push({ titol: "Programa lingüístic", tipus: "taula",
      cap: ["Etapa", "Programa", "Val. %", "Cast. %", "Angl. %"], num: [2, 3, 4],
      files: c.linguistic.map((p) => [p[0], p[1], p[2] ?? "", p[3] ?? "", p[4] ?? ""]) });
    s.push({ titol: "Instal·lacions", tipus: "etiquetes", items: c.installacions });
    s.push({ titol: "Idiomes", tipus: "etiquetes", items: c.idiomes });
    return s;
  }

  // ---------- Estat ----------
  const estat = {
    q: "", regim: new Set(), comarca: "", municipi: "",
    flags: new Set(), etapes: new Set(), tipus: new Set(), inst: new Set(),
    sel: null, origen: null, ordre: { k: null, dir: 1 }, llistatOrdre: "municipi",
    cols: new Set(COLS.filter((c) => c.def).map((c) => c.k)),
  };
  try {
    const desades = JSON.parse(localStorage.getItem("cgt-centres-cols") || "null");
    if (Array.isArray(desades) && desades.length) estat.cols = new Set(desades.filter((k) => COLS.some((c) => c.k === k)));
  } catch (_) { /* sense emmagatzematge */ }

  let CENTRES = [], META = {}, filtrats = [], perCodi = new Map(), MUNIS = [];
  const $ = (s, el = document) => el.querySelector(s);

  // ---------- Filtres ----------
  function passa(c, ignora) {
    if (estat.q && !c._text.includes(estat.q)) return false;
    if (ignora !== "regim" && estat.regim.size && !estat.regim.has(c.regim)) return false;
    if (estat.comarca && c.comarca !== estat.comarca) return false;
    if (estat.municipi && c.municipi !== estat.municipi) return false;
    if (ignora !== "tipus" && estat.tipus.size && !estat.tipus.has(c.tipus)) return false;
    if (ignora !== "etapes" && estat.etapes.size && !c.etapes.some((e) => estat.etapes.has(e))) return false;
    for (const f of estat.flags) if (!c.f[f]) return false;
    for (const i of estat.inst) if (!c.installacions.includes(i)) return false;
    return true;
  }
  const esRapid = (grup, v) => RAPIDS.some((r) => r.grup === grup && r.v === v);
  function nCalaix() {
    // filtres que només es poden canviar des del calaix
    return [...estat.flags].filter((v) => !esRapid("flags", v)).length + estat.tipus.size + estat.inst.size;
  }
  function actius() {
    const a = [];
    if (estat.q) a.push(["q", "", `«${$("#cerca").value.trim()}»`]);
    if (estat.municipi) a.push(["municipi", "", bonic(estat.municipi)]);
    if (estat.comarca) a.push(["comarca", "", bonic(estat.comarca)]);
    for (const r of estat.regim) a.push(["regim", r, regimInfo(r).curt]);
    for (const f of estat.flags) a.push(["flags", f, flag(f).curt]);
    for (const e of estat.etapes) a.push(["etapes", e, e]);
    for (const t of estat.tipus) a.push(["tipus", t, t]);
    for (const i of estat.inst) a.push(["inst", i, i]);
    return a;
  }
  function descripcioFiltres() {
    const a = actius().map((x) => x[2]);
    return a.length ? a.join(" · ") : "Tots els centres";
  }

  function canvia(grup, valor, on) {
    if (["q", "municipi", "comarca"].includes(grup)) {
      estat[grup] = "";
      if (grup === "q") $("#cerca").value = "";
    } else {
      const set = estat[grup];
      const posa = on === undefined ? !set.has(valor) : on;
      posa ? set.add(valor) : set.delete(valor);
    }
    mostrats = LIMIT;
    aplica();
  }

  const opcio = (grup, valor, text, n, marcat, ajuda) => `
    <label class="opcio${n === 0 && !marcat ? " opcio--buida" : ""}">
      <input type="checkbox" data-grup="${grup}" value="${esc(valor)}"${marcat ? " checked" : ""}>
      <span>${esc(text)}${ajuda ? `<small>${esc(ajuda)}</small>` : ""}</span>
      <span class="opcio__n">${n}</span>
    </label>`;
  const compta = (grup, prova) => CENTRES.filter((c) => passa(c, grup) && prova(c)).length;

  function pintaOn() {
    const comarques = [...new Set(CENTRES.map((c) => c.comarca))].sort((x, y) => x.localeCompare(y, "ca"));
    const munis = MUNIS.filter((m) => !estat.comarca || m.comarca === estat.comarca);
    $("#f-comarca").innerHTML = `<option value="">Totes les comarques</option>${comarques.map((c) => `<option value="${esc(c)}"${c === estat.comarca ? " selected" : ""}>${esc(bonic(c))}</option>`).join("")}`;
    $("#f-municipi").innerHTML = `<option value="">Tots els municipis</option>${munis.map((m) => `<option value="${esc(m.k)}"${m.k === estat.municipi ? " selected" : ""}>${esc(m.nom)}</option>`).join("")}`;
    $("#f-comarca").closest(".selector").classList.toggle("actiu", !!estat.comarca);
    $("#f-municipi").closest(".selector").classList.toggle("actiu", !!estat.municipi);
    $("#f-regim").innerHTML = REGIMS.map((r) => {
      const on = estat.regim.has(r.k);
      return `<button class="xip" type="button" data-commuta="regim" data-valor="${esc(r.k)}" aria-pressed="${on}"><i class="m m--${r.cls}"></i>${r.curt} <span class="opcio__n">${compta("regim", (c) => c.regim === r.k)}</span></button>`;
    }).join("");
  }
  function pintaRapids() {
    pintaOn();
    $("#rapids").innerHTML = RAPIDS.map((r) => {
      const on = estat[r.grup].has(r.v);
      return `<button class="xip" type="button" data-commuta="${r.grup}" data-valor="${esc(r.v)}" aria-pressed="${on}">${r.ic ? ic(r.ic, "ic--s") : ""}${esc(r.l)}</button>`;
    }).join("");
    const n = estat.etapes.size;
    $("#pop-etapa-txt").textContent = n === 1 ? [...estat.etapes][0] : n > 1 ? `Etapa (${n})` : "Etapa";
    $("#pop-etapa > button").classList.toggle("actiu", n > 0);
    if (!$("#pop-etapa-menu").hidden) pintaEtapes();
    const nc = nCalaix();
    $("#n-mes").textContent = nc; $("#n-mes").hidden = !nc;
    $("#obre-calaix").classList.toggle("actiu", nc > 0);
  }
  function pintaEtapes() {
    $("#pop-etapa-menu").innerHTML = `<div class="opcions">${ETAPES.map((e) => opcio("etapes", e, e, compta("etapes", (c) => c.etapes.includes(e)), estat.etapes.has(e), ETAPA_AJUDA[e])).join("")}</div>`;
  }
  function pintaActius() {
    const a = actius();
    $("#actius").innerHTML = a.map(([g, v, t]) => `<button class="actiu-xip" type="button" data-treu="${g}" data-valor="${esc(v)}" aria-label="Treure el filtre ${esc(t)}">${esc(t)}${ic("creu")}</button>`).join("");
    $("#neteja").hidden = a.length < 2;
    $("#n-filtres-mobil").textContent = a.length; $("#n-filtres-mobil").hidden = !a.length;
  }
  function pintaCalaix() {
    if ($("#calaix").hidden) return;
    const tipus = [...new Set(CENTRES.map((c) => c.tipus))].sort((a, b) => (a === "Altres") - (b === "Altres") || a.localeCompare(b, "ca"));
    $("#calaix-cos").innerHTML = `
      <section class="bloc"><h3>Serveis i programes</h3>
        <p class="ajuda">Es mostren només els centres que tenen <strong>tot</strong> el que marques.</p>
        <div class="opcions">${FLAGS.map((f) => opcio("flags", f.k, f.l, filtrats.filter((c) => c.f[f.k]).length, estat.flags.has(f.k), f.ajuda)).join("")}</div>
      </section>
      <section class="bloc"><h3>Etapa</h3>
        <div class="opcions">${ETAPES.map((e) => opcio("etapes", e, e, compta("etapes", (c) => c.etapes.includes(e)), estat.etapes.has(e), ETAPA_AJUDA[e])).join("")}</div>
      </section>
      <section class="bloc"><h3>Tipus de centre</h3>
        <div class="opcions">${tipus.map((t) => opcio("tipus", t, t, compta("tipus", (c) => c.tipus === t), estat.tipus.has(t))).join("")}</div>
      </section>
      <section class="bloc"><h3>Instal·lacions</h3>
        <div class="opcions">${META.inst.map((i) => opcio("inst", i, i, filtrats.filter((c) => c.installacions.includes(i)).length, estat.inst.has(i))).join("")}</div>
      </section>
      <p class="font" style="margin-top:20px">Font: ${esc(META.font)}. Dades del ${esc(META.dataTxt)}.</p>`;
  }

  function aplica({ ajusta = true } = {}) {
    filtrats = CENTRES.filter((c) => passa(c));
    $("#recompte").textContent = filtrats.length;
    $("#recompte-txt").textContent = filtrats.length === 1 ? "centre" : "centres";
    $("#n-calaix").textContent = filtrats.length;
    $("#n-taula").textContent = filtrats.length;
    pintaRapids();
    pintaActius();
    const scroll = $("#calaix-cos").scrollTop;
    pintaCalaix();
    $("#calaix-cos").scrollTop = scroll;
    pintaMapa(ajusta);
    if (estat.sel && !filtrats.some((c) => c.codi === estat.sel)) desselecciona(false);
    if (!estat.sel) pintaLlistat();
    pintaTaula();
    pintaXifres();
  }

  // ---------- Cerca amb suggeriments ----------
  let sugg = [], suggIdx = -1;
  function marca(text, q) {
    const n = norm(text), i = n.indexOf(q);
    if (!q || i < 0) return esc(text);
    return esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + q.length)) + "</mark>" + esc(text.slice(i + q.length));
  }
  function pintaSugg(qraw) {
    const q = norm(qraw.trim());
    const ul = $("#suggeriments");
    if (q.length < 2) { ul.hidden = true; $("#cerca").setAttribute("aria-expanded", "false"); sugg = []; return; }
    const munis = MUNIS.filter((m) => m._n.split(/[\s'-]+/).some((w) => w.startsWith(q)) || m._n.startsWith(q)).slice(0, 5);
    const centres = CENTRES.filter((c) => norm(c._nom).includes(q) || c.codi.startsWith(q)).slice(0, 6);
    sugg = [...munis.map((m) => ({ t: "m", m })), ...centres.map((c) => ({ t: "c", c }))];
    suggIdx = -1;
    if (!sugg.length) {
      ul.innerHTML = `<li class="suggeriments__grup">Cap coincidència</li>`;
    } else {
      let i = 0;
      ul.innerHTML =
        (munis.length ? `<li class="suggeriments__grup" role="presentation">Municipis</li>` + munis.map((m) => `<li class="suggeriment" role="option" id="sg-${i}" data-i="${i++}" aria-selected="false">${ic("pin", "ic--s")}<b>${marca(m.nom, q)}</b><span>${m.n} ${m.n === 1 ? "centre" : "centres"}</span></li>`).join("") : "") +
        (centres.length ? `<li class="suggeriments__grup" role="presentation">Centres</li>` + centres.map((c) => `<li class="suggeriment" role="option" id="sg-${i}" data-i="${i++}" aria-selected="false"><i class="m m--${regimInfo(c.regim).cls}" style="width:10px;height:10px;outline:0;border-width:${c.regim === "Privat no concertat" ? 2 : 0}px"></i><b>${marca(c._nom, q)}</b><span>${esc(c._muni)}</span></li>`).join("") : "");
    }
    ul.hidden = false;
    $("#cerca").setAttribute("aria-expanded", "true");
  }
  function triaSugg(i) {
    const s = sugg[i];
    if (!s) return;
    tancaSugg();
    $("#cerca").value = "";
    estat.q = "";
    if (s.t === "m") {
      estat.municipi = s.m.k;
      estat.comarca = "";
      mostrats = LIMIT;
      aplica();
    } else {
      if (!passa(s.c)) { neteja(false); }
      else aplica({ ajusta: false });
      selecciona(s.c.codi);
    }
  }
  function tancaSugg() { $("#suggeriments").hidden = true; $("#cerca").setAttribute("aria-expanded", "false"); suggIdx = -1; }
  function mouSugg(d) {
    if (!sugg.length) return;
    suggIdx = (suggIdx + d + sugg.length) % sugg.length;
    document.querySelectorAll(".suggeriment").forEach((li) => li.setAttribute("aria-selected", li.dataset.i == suggIdx));
    const el = $(`#sg-${suggIdx}`);
    if (el) { el.scrollIntoView({ block: "nearest" }); $("#cerca").setAttribute("aria-activedescendant", el.id); }
  }

  // ---------- A prop meu ----------
  function distancia(a, b) {
    const R = 6371, r = Math.PI / 180;
    const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  let marcaOrigen = null;
  function aprop() {
    const boto = $("#aprop");
    if (estat.origen) { // desactiva
      estat.origen = null;
      CENTRES.forEach((c) => (c._dist = null));
      if (marcaOrigen) { mapa.removeLayer(marcaOrigen); marcaOrigen = null; }
      boto.classList.remove("actiu");
      if (estat.llistatOrdre === "distancia") estat.llistatOrdre = "municipi";
      aplica();
      return;
    }
    if (!navigator.geolocation) return avisa("El teu navegador no permet saber on estàs.");
    boto.disabled = true;
    navigator.geolocation.getCurrentPosition((p) => {
      boto.disabled = false;
      estat.origen = { lat: p.coords.latitude, lng: p.coords.longitude };
      CENTRES.forEach((c) => (c._dist = c.lat ? distancia(estat.origen, c) : null));
      estat.llistatOrdre = "distancia";
      boto.classList.add("actiu");
      if (marcaOrigen) mapa.removeLayer(marcaOrigen);
      marcaOrigen = L.marker([estat.origen.lat, estat.origen.lng], {
        icon: L.divIcon({ className: "marcador", html: '<i class="origen"></i>', iconSize: [18, 18] }), zIndexOffset: 2000, keyboard: false,
      }).bindTooltip("Ets ací", { direction: "top", offset: [0, -10] }).addTo(mapa);
      aplica({ ajusta: false });
      const prop = [...filtrats].sort((a, b) => a._dist - b._dist).slice(0, 8);
      const punts = [[estat.origen.lat, estat.origen.lng], ...prop.map((c) => [c.lat, c.lng])];
      mapa.fitBounds(L.latLngBounds(punts).pad(0.15), { maxZoom: 15 });
      if (estretor()) posaVista("llistat");
      avisa("Centres ordenats pels més pròxims a tu");
    }, () => {
      boto.disabled = false;
      avisa("No s'ha pogut saber on estàs. Revisa el permís d'ubicació del navegador.");
    }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 600000 });
  }

  // ---------- Mapa ----------
  let mapa, capa, marcadors = new Map();
  function iniciaMapa() {
    mapa = L.map("mapa", { zoomControl: true, scrollWheelZoom: true }).setView([40.15, -0.15], 9);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, className: "teseles",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapa);
    new ResizeObserver(() => mapa.invalidateSize()).observe(document.getElementById("mapa"));
    capa = L.featureGroup().addTo(mapa);
  }
  // Punts (sense agrupar): roig públic, negre concertat, blanc amb vora negra privat
  const COLOR = { public: "#e42127", concertat: "#111111", privat: "#ffffff" };
  function estil(c, mode) {
    const cls = regimInfo(c.regim).cls;
    if (mode === "sel") return { radius: 10, fillColor: "#e9e84c", color: "#111111", weight: 3, fillOpacity: 1, opacity: 1 };
    const priv = cls === "privat";
    return {
      radius: mode === "hover" ? 9 : 6,
      fillColor: COLOR[cls], fillOpacity: 1, opacity: 1,
      color: mode === "hover" ? "#e9e84c" : priv ? "#111111" : "#ffffff",
      weight: mode === "hover" ? 3 : priv ? 2 : 1.5,
    };
  }
  function posaMode(codi, mode) {
    const m = marcadors.get(codi);
    if (!m) return null;
    m.setStyle(estil(perCodi.get(codi), mode));
    if (mode) m.bringToFront();
    return m;
  }
  function pintaMapa(ajusta) {
    capa.clearLayers();
    marcadors.clear();
    const ms = filtrats.filter((c) => c.lat).map((c) => {
      const m = L.circleMarker([c.lat, c.lng], { ...estil(c, estat.sel === c.codi ? "sel" : ""), bubblingMouseEvents: false });
      m.bindTooltip(`${esc(c._nom)}<small>${esc(c.tipus)} · ${esc(c._muni)}</small>`, { direction: "top", offset: [0, -8] });
      m.on("click", () => selecciona(c.codi, { centra: false }));
      marcadors.set(c.codi, m);
      capa.addLayer(m);
      return m;
    });
    if (estat.sel) posaMode(estat.sel, "sel");
    mapa.invalidateSize();
    if (ajusta && ms.length) mapa.fitBounds(capa.getBounds().pad(0.08), { maxZoom: 15 });
  }
  function ressalta(codi, on) {
    const m = marcadors.get(codi);
    if (!m || codi === estat.sel) return;
    posaMode(codi, on ? "hover" : "");
    if (on) m.openTooltip(); else m.closeTooltip();
  }

  // ---------- Llistat ----------
  const LIMIT = 100;
  let mostrats = LIMIT;
  function ordenaLlistat(a) {
    const k = estat.llistatOrdre;
    const cmp = {
      municipi: (x, y) => x._muni.localeCompare(y._muni, "ca") || x._nom.localeCompare(y._nom, "ca"),
      nom: (x, y) => x._nom.localeCompare(y._nom, "ca"),
      llocs: (x, y) => y.llocs - x.llocs,
      distancia: (x, y) => (x._dist ?? 1e9) - (y._dist ?? 1e9),
    }[k];
    return [...a].sort(cmp);
  }
  function serveisCurts(c) {
    const s = [];
    if (c.f.menjador_aut) s.push(["menjador", "Menjador"]);
    if (c.f.transport) s.push(["transport", "Transport"]);
    if (c.f.banc_llibres) s.push(["llibres", "Banc de llibres"]);
    if (c.f.jornada_continua) s.push(["rellotge", "Jornada contínua"]);
    return s.map(([i, t]) => `<span class="servei">${ic(i)}${t}</span>`).join("");
  }
  function pintaLlistat() {
    const p = $("#panell");
    if (!filtrats.length) {
      p.innerHTML = `<div class="buit"><span class="etiqueta">Cap centre</span><h3>No hi ha resultats</h3><p>Cap centre compleix tots els filtres alhora. Prova a llevar-ne algun.</p><button class="boto" data-accio="neteja">Netejar els filtres</button></div>`;
      return;
    }
    const llistaC = ordenaLlistat(filtrats).slice(0, mostrats);
    const opcions = [["municipi", "Municipi"], ["nom", "Nom"], ["llocs", "Més grans"], ...(estat.origen ? [["distancia", "Més a prop"]] : [])];
    p.innerHTML = `
      <div class="llistat">
        <div class="llistat__cap">
          <label>Ordena per
            <select id="ordre-llistat">${opcions.map(([k, t]) => `<option value="${k}"${estat.llistatOrdre === k ? " selected" : ""}>${t}</option>`).join("")}</select>
          </label>
        </div>
        <ol>${llistaC.map((c) => `<li><button class="item" data-codi="${c.codi}">
          <i class="m m--${regimInfo(c.regim).cls}" title="${esc(c.regim)}"></i>
          <span class="item__nom">${esc(c._nom)}</span>
          <span class="item__dist">${c._dist != null ? km(c._dist) : ""}</span>
          <span class="item__meta">${esc(c.tipus)} · ${esc(c._muni)} · ${esc(regimInfo(c.regim).curt)}</span>
          <span class="item__serveis">${serveisCurts(c)}</span>
        </button></li>`).join("")}</ol>
        ${filtrats.length > mostrats ? `<button class="boto mes" data-accio="mes">Mostrar ${Math.min(LIMIT, filtrats.length - mostrats)} més</button>` : ""}
        <div class="peu-panell"><p class="font">Font: ${esc(META.font)}. Dades del ${esc(META.dataTxt)}.</p></div>
      </div>`;
  }

  // ---------- Fitxa ----------
  function rajola(icona, titol, si, sub) {
    return `<div class="rajola${si ? "" : " rajola--no"}">${ic(icona || "cap", "ic--l")}<div><b>${esc(titol)}</b><small>${esc(sub || (si ? "Sí" : "No"))}</small></div></div>`;
  }
  function htmlFitxa(c) {
    const r = regimInfo(c.regim);
    const accions = [
      c.lat ? `<a class="accio accio--roig" href="https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}" target="_blank" rel="noopener">${ic("ruta")}Com arribar</a>` : "",
      c.telefon ? `<a class="accio" href="tel:${esc(c.telefon)}">${ic("telefon")}Trucar</a>` : "",
      c.web ? `<a class="accio" href="${esc(c.web)}" target="_blank" rel="noopener">${ic("web")}Web</a>` : "",
      c.correu ? `<a class="accio" href="mailto:${esc(c.correu)}">${ic("correu")}Correu</a>` : "",
    ].join("");

    const menjSub = c.f.menjador_aut ? "Sí, autoritzat" : c.f.menjador ? "Sí, sense autorització" : "No";
    const internat = c.serveis.find((s) => /^Internat/.test(s));
    const rajoles = [
      rajola("menjador", "Menjador", c.f.menjador, menjSub),
      rajola("transport", "Transport escolar", c.f.transport),
      rajola("llibres", "Banc de llibres", c.f.banc_llibres),
      rajola("rellotge", "Jornada contínua", c.f.jornada_continua, c.f.jornada_continua ? "Sí, de 9 a 14 h" : "No"),
      rajola("nadó", "Aula de dos anys", c.f.aula_2anys),
      rajola("internat", "Internat", c.f.internat, internat ? internat.replace("Internat ", "Sí, ") : "No"),
      rajola("cafeteria", "Cafeteria", c.f.cafeteria),
      rajola("estiu", "Cursos d'estiu", c.f.cursos_estiu),
    ].join("");

    const programes = c.programes.filter((p) => !/banc de llibres|Té aula de dos anys/.test(p));
    const ling = c.linguistic.length ? c.linguistic.map(([etapa, prog, v, ca, a]) => {
      const t = (v || 0) + (ca || 0) + (a || 0) || 1;
      const seg = (cls, n, l) => (n ? `<i class="${cls}" style="width:${(n / t) * 100}%" title="${l} ${n}%">${n >= 12 ? n + "%" : ""}</i>` : "");
      return `<div class="ling"><div class="ling__cap">${esc(etapa)}<span>${esc(prog)}</span></div>
        ${t > 1 ? `<div class="barra">${seg("v", v, "Valencià")}${seg("c", ca, "Castellà")}${seg("a", a, "Anglés")}</div>` : `<p class="sense">Sense percentatges</p>`}</div>`;
    }).join("") + `<div class="ling-llegenda"><span><i style="background:var(--roig)"></i>Valencià</span><span><i style="background:var(--negre)"></i>Castellà</span><span><i></i>Anglés</span></div>` : "";

    const nivells = c.nivells.length ? `
      <details class="detall"><summary>Veure unitats i llocs per nivell</summary>
        <table class="mini"><thead><tr><th>Nivell</th><th class="n">Unitats</th><th class="n">Llocs</th></tr></thead>
        <tbody>${c.nivells.map((n) => `<tr><td>${esc(n[0])}</td><td class="n">${n[1]}</td><td class="n">${n[2]}</td></tr>`).join("")}</tbody>
        ${c.nivells.length > 1 ? `<tfoot><tr><td>Total</td><td class="n">${c.unitats}</td><td class="n">${c.llocs}</td></tr></tfoot>` : ""}</table>
      </details>` : "";

    const dades = [["Codi", c.codi], ["Denominació", c.generica], ["Tipus", c.tipus], ["Règim", c.regim], ["Titular", c.titular], ["CIF", c.cif], ["Comarca", c._comarca], ["Fax", c.fax]]
      .filter((f) => f[1]).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("");

    return `
      <article class="fitxa">
        <div class="fitxa__nav">
          <button class="enllac" data-accio="torna">${ic("enrere", "ic--s")}Tots els centres</button>
          <button class="boto" data-accio="pdf-fitxa">${ic("descarrega", "ic--s")}PDF</button>
        </div>
        <header class="fitxa__cap">
          <span class="etiqueta">${esc(c.tipus)}</span>
          <span class="kicker">${esc(r.curt)} · ${esc(c._muni)}</span>
          <h1>${esc(c._nom)}</h1>
          <p class="fitxa__adreca">${ic("pin", "ic--s")}<span>${esc(c.adreca)}, ${esc(c.cp)} ${esc(c._muni)}${c._dist != null ? ` · <b>a ${km(c._dist)}</b>` : ""}</span></p>
          ${c.telefon ? `<p class="fitxa__adreca">${ic("telefon", "ic--s")}<span>${esc(c.telefon)}</span></p>` : ""}
          ${c.correu ? `<p class="fitxa__adreca">${ic("correu", "ic--s")}<span>${esc(c.correu)}</span></p>` : ""}
          ${c.web ? `<p class="fitxa__adreca">${ic("web", "ic--s")}<span>${esc(c.web.replace(/^https?:\/\//, "").replace(/\/$/, ""))}</span></p>` : ""}
        </header>
        ${accions ? `<div class="accions">${accions}</div>` : ""}

        <section class="seccio"><h2>Serveis</h2><div class="rajoles">${rajoles}</div>
          ${c.f.menjador && !c.f.menjador_aut ? `<p class="nota">Té menjador però no consta com a menjador escolar autoritzat per Conselleria.</p>` : ""}
        </section>

        <section class="seccio"><h2>Què s'hi estudia</h2>
          ${c.etapes.length ? `<div class="etiquetes">${c.etapes.map((e) => `<span>${esc(e)}</span>`).join("")}</div>` : `<p class="sense">Sense dades</p>`}
          ${c.llocs ? `<p class="nota">${c.unitats} unitats i ${c.llocs} llocs escolars actius.</p>` : ""}
          ${nivells}
        </section>

        <section class="seccio"><h2>Horari</h2>
          ${c.jornada.length ? `<ul class="llista">${c.jornada.map((j) => `<li>${esc(j)}</li>`).join("")}</ul>` : `<p class="sense">Sense dades</p>`}
        </section>

        ${ling ? `<section class="seccio"><h2>Llengües d'ensenyament</h2>${ling}</section>` : ""}

        ${programes.length ? `<section class="seccio"><h2>Programes i característiques</h2><ul class="llista">${programes.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></section>` : ""}

        ${c.installacions.length ? `<section class="seccio"><h2>Instal·lacions</h2><div class="etiquetes etiquetes--suau">${c.installacions.map((i) => `<span>${esc(i)}</span>`).join("")}</div></section>` : ""}

        ${c.idiomes.length ? `<section class="seccio"><h2>Idiomes</h2><div class="etiquetes etiquetes--suau">${c.idiomes.map((i) => `<span>${esc(i)}</span>`).join("")}</div></section>` : ""}

        <section class="seccio"><h2>Dades administratives</h2><dl class="kv">${dades}</dl></section>

        <p class="font" style="margin-top:18px">Font: ${esc(META.font)}. Dades del ${esc(META.dataTxt)}. <a href="${fitxaOficial(c)}" target="_blank" rel="noopener">Fitxa oficial a Conselleria</a></p>
      </article>`;
  }

  function selecciona(codi, { centra = true, vista } = {}) {
    const c = perCodi.get(codi);
    if (!c) return;
    const anterior = estat.sel;
    estat.sel = codi;
    if (anterior) posaMode(anterior, "");
    const m = posaMode(codi, "sel");
    if (m && centra) mapa.setView(m.getLatLng(), Math.max(mapa.getZoom(), 14));
    $("#panell").innerHTML = htmlFitxa(c);
    $("#panell").scrollTop = 0;
    try { history.replaceState(null, "", "#centre=" + codi); } catch (_) { /* iframe sandbox */ }
    if (vista) posaVista(vista);
    else if (estretor() && document.body.dataset.vista === "mapa") posaVista("llistat");
  }
  function desselecciona(pinta = true) {
    const anterior = estat.sel;
    estat.sel = null;
    if (anterior) posaMode(anterior, "");
    try { history.replaceState(null, "", location.pathname + location.search); } catch (_) { /* */ }
    if (pinta) pintaLlistat();
  }

  // ---------- Taula ----------
  const colsVisibles = () => [...COLS.filter((c) => estat.cols.has(c.k)), ...(estat.origen ? [DIST_COL] : [])];
  function filesTaula() {
    const { k, dir } = estat.ordre;
    if (!k) return estat.origen ? ordenaLlistat(filtrats) : filtrats;
    const col = colsVisibles().find((c) => c.k === k) || COLS[1];
    return [...filtrats].sort((a, b) => {
      const x = col.v(a), y = col.v(b);
      return (col.num ? (x === "" ? 1e9 : x) - (y === "" ? 1e9 : y) : String(x).localeCompare(String(y), "ca")) * dir;
    });
  }
  function pintaTaula() {
    if (document.body.dataset.vista !== "taula") return;
    const cols = colsVisibles();
    $("#taula thead").innerHTML = `<tr>${cols.map((c) => `<th data-col="${c.k}"${estat.ordre.k === c.k ? ` aria-sort="${estat.ordre.dir > 0 ? "ascending" : "descending"}"` : ""}${c.curt ? ` title="${esc(c.l)}"` : ""}>${esc(c.curt || c.l)}</th>`).join("")}</tr>`;
    $("#taula tbody").innerHTML = filesTaula().map((c) => `<tr data-codi="${c.codi}">${cols.map((col) => {
      const v = col.v(c);
      if (col.flag) return `<td><span class="si-no si-no--${v === "Sí" ? "si" : "no"}">${v}</span></td>`;
      return `<td class="${col.cls || ""}${col.num ? " n" : ""}">${esc(v)}</td>`;
    }).join("")}</tr>`).join("");
  }
  function pintaMenuColumnes() {
    $("#columnes-menu").innerHTML = `<div class="desplegable__accions"><button class="enllac" data-accio="cols-totes">Totes</button><button class="enllac" data-accio="cols-defecte">Per defecte</button></div>` +
      `<div class="opcions">${COLS.map((c) => `<label class="opcio" style="grid-template-columns:20px 1fr"><input type="checkbox" data-col="${c.k}"${estat.cols.has(c.k) ? " checked" : ""}><span>${esc(c.l)}</span></label>`).join("")}</div>`;
  }
  function desaCols() { try { localStorage.setItem("cgt-centres-cols", JSON.stringify([...estat.cols])); } catch (_) { /* */ } }


  // ---------- Xifres ----------
  const ETAPA_NIVELL = [
    ["Infantil 0-3", /INFANTIL PRIMER CICLE|ESCOLES LLAR/], ["Infantil 3-6", /INFANTIL SEGON CICLE/],
    ["Primària", /PRIM[ÀA]RIA/], ["ESO", /SECUND[ÀA]RIA OBLIGAT/], ["Batxillerat", /BATXILLERAT/],
    ["Formació professional", /CICLES FORMATIUS(?! D'ARTS)|M[ÒO]DULS|FORMACI[ÓO] PROFESSIONAL/],
    ["Educació especial", /EDUCACI[ÓO] ESPECIAL/], ["Persones adultes", /ADULTS/],
    ["Música i dansa", /M[ÚU]SICA|DANSA/], ["Arts i disseny", /ARTS|DISSENY|ART[ÍI]STIQUES/],
    ["Ensenyances esportives", /ESPORTIVES/], ["Idiomes", /^IDIOMES/],
  ];
  const XIF_SERVEIS = ["menjador_aut", "transport", "banc_llibres", "jornada_continua", "aula_2anys", "cafeteria", "cursos_estiu", "internat"];
  const fmt = (n) => Number(n).toLocaleString("ca-ES");
  const pct = (n, t) => (t ? Math.round((n / t) * 100) : 0);
  const compte = (arr, clau) => { const m = new Map(); arr.forEach((c) => { const k = clau(c); m.set(k, (m.get(k) || 0) + 1); }); return m; };

  // Barres d'una sola sèrie (un color: roig)
  function barres(files, { filtra, max, sufix = "", ample = 170 } = {}) {
    const top = max ?? Math.max(1, ...files.map((f) => f.n));
    return `<div class="barres" style="--lbl:${ample}px">${files.map((f) => `
      <button class="barra" type="button"${filtra ? ` data-filtra="${filtra}" data-valor="${esc(f.k)}"` : ""} data-tip="${esc(`${f.l}: ${f.tip || fmt(f.n) + sufix}`)}"${f.actiu ? ' aria-pressed="true"' : ""}>
        <span class="barra__lbl">${esc(f.l)}</span>
        <span class="barra__pista">${f.pista ? '<i class="barra__fons"></i>' : ""}<i class="barra__val" style="width:${(f.n / top) * 100}%"></i></span>
        <span class="barra__num">${esc(f.txt || fmt(f.n))}</span>
      </button>`).join("")}</div>`;
  }
  // Barres apilades per règim
  function barresRegim(files, { filtra, ample = 170 } = {}) {
    const top = Math.max(1, ...files.map((f) => f.total));
    return `<div class="barres" style="--lbl:${ample}px">${files.map((f) => `
      <button class="barra" type="button" data-filtra="${filtra}" data-valor="${esc(f.k)}" data-tip="${esc(`${f.l}: ${f.total} centres · ${REGIMS.map((r) => `${r.curt} ${f.per[r.k] || 0}`).join(" · ")}`)}"${f.actiu ? ' aria-pressed="true"' : ""}>
        <span class="barra__lbl">${esc(f.l)}</span>
        <span class="barra__pista barra__pista--apilada" style="width:${(f.total / top) * 100}%">${REGIMS.map((r) => (f.per[r.k] ? `<i class="seg seg--${r.cls}" style="flex:${f.per[r.k]}"></i>` : "")).join("")}</span>
        <span class="barra__num">${fmt(f.total)}</span>
      </button>`).join("")}</div>`;
  }
  const llegendaRegim = () => `<div class="xllegenda">${REGIMS.map((r) => `<span><i class="seg seg--${r.cls}"></i>${r.curt}</span>`).join("")}</div>`;
  const targeta = (titol, sub, cos, ampla) => `<section class="targeta${ampla ? " targeta--ampla" : ""}"><h3>${esc(titol)}</h3>${sub ? `<p class="targeta__sub">${sub}</p>` : ""}${cos}</section>`;

  function pintaXifres() {
    if (document.body.dataset.vista !== "xifres") return;
    const el = $("#xifres");
    const F = filtrats, N = F.length;
    if (!N) {
      el.innerHTML = `<div class="buit"><span class="etiqueta">Cap centre</span><h3>No hi ha xifres</h3><p>Cap centre compleix tots els filtres alhora. Prova a llevar-ne algun.</p><button class="boto" data-accio="neteja">Netejar els filtres</button></div>`;
      return;
    }
    const llocs = F.reduce((a, c) => a + (c.llocs || 0), 0);
    const unitats = F.reduce((a, c) => a + (c.unitats || 0), 0);
    const perRegim = compte(F, (c) => c.regim);
    const publics = perRegim.get("Públic") || 0;

    // Segmentada per règim
    const seg = `<div class="segmentada" role="img" aria-label="${esc(REGIMS.map((r) => `${r.curt}: ${perRegim.get(r.k) || 0}`).join(", "))}">${REGIMS.map((r) => {
      const n = perRegim.get(r.k) || 0, p = pct(n, N);
      return n ? `<button type="button" class="segmentada__part seg--${r.cls}" style="flex:${n}" data-filtra="regim" data-valor="${esc(r.k)}" data-tip="${esc(`${r.curt}: ${n} centres (${p}%)`)}">${p >= 9 ? `<b>${p}%</b>` : ""}</button>` : "";
    }).join("")}</div>
    <div class="xllegenda">${REGIMS.map((r) => `<span><i class="seg seg--${r.cls}"></i>${r.curt} <b>${fmt(perRegim.get(r.k) || 0)}</b></span>`).join("")}</div>`;

    // Serveis (% dels centres filtrats)
    const serveis = barres(XIF_SERVEIS.map((k) => {
      const n = F.filter((c) => c.f[k]).length;
      return { k, l: flag(k).curt === "Menjador" ? "Menjador autoritzat" : flag(k).curt, n: pct(n, N), txt: `${pct(n, N)}%`, tip: `${fmt(n)} de ${fmt(N)} centres (${pct(n, N)}%)`, pista: true, actiu: estat.flags.has(k) };
    }), { filtra: "flags", max: 100 });

    // Comarques apilades
    const perCom = new Map();
    F.forEach((c) => { const o = perCom.get(c.comarca) || { k: c.comarca, l: c._comarca, total: 0, per: {} }; o.total++; o.per[c.regim] = (o.per[c.regim] || 0) + 1; perCom.set(c.comarca, o); });
    const comarques = [...perCom.values()].sort((a, b) => b.total - a.total).map((o) => ({ ...o, actiu: estat.comarca === o.k }));

    // Etapes
    const etapes = ETAPES.map((e) => ({ k: e, l: e, n: F.filter((c) => c.etapes.includes(e)).length, actiu: estat.etapes.has(e) })).filter((f) => f.n);

    // Llocs per etapa
    const llocsEtapa = new Map();
    F.forEach((c) => c.nivells.forEach(([nom, , ll]) => {
      const e = ETAPA_NIVELL.find(([, rx]) => rx.test(nom.toUpperCase()));
      if (e && ll) llocsEtapa.set(e[0], (llocsEtapa.get(e[0]) || 0) + ll);
    }));
    const llocsFiles = ETAPES.filter((e) => llocsEtapa.get(e)).map((e) => ({ k: e, l: e, n: llocsEtapa.get(e), tip: `${fmt(llocsEtapa.get(e))} llocs actius` }));

    // Tipus i municipis
    const tipus = [...compte(F, (c) => c.tipus)].sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ k, l: k, n, actiu: estat.tipus.has(k) }));
    const munis = [...compte(F, (c) => c.municipi)].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ca")).slice(0, 10).map(([k, n]) => ({ k, l: bonic(k), n, actiu: estat.municipi === k }));

    el.innerHTML = `
      <div class="xifres">
        <p class="xifres__intro">Xifres dels <b>${fmt(N)}</b> centres que compleixen els filtres. Fes clic en una barra per a filtrar.</p>
        <div class="kpis">
          <div class="kpi"><b>${fmt(N)}</b><span>centres</span></div>
          <div class="kpi"><b>${fmt(llocs)}</b><span>llocs escolars actius</span></div>
          <div class="kpi"><b>${fmt(unitats)}</b><span>unitats actives</span></div>
          <div class="kpi"><b>${pct(publics, N)}%</b><span>són públics</span></div>
        </div>
        <div class="targetes">
          ${targeta("Per règim", "Centres públics, concertats i privats", seg, true)}
          ${targeta("Serveis", "Percentatge de centres que en tenen", serveis)}
          ${targeta("Per comarca", "Centres per comarca i règim", llegendaRegim() + barresRegim(comarques, { filtra: "comarca", ample: 130 }))}
          ${targeta("Per etapa", "Centres que imparteixen cada etapa", barres(etapes, { filtra: "etapes" }))}
          ${targeta("Llocs escolars per etapa", "Llocs actius autoritzats", barres(llocsFiles))}
          ${targeta("Tipus de centre", "", barres(tipus, { filtra: "tipus", ample: 190 }))}
          ${targeta("Municipis amb més centres", N > 10 ? "Els 10 primers" : "", barres(munis, { filtra: "municipi", ample: 150 }))}
        </div>
        <p class="font">Font: ${esc(META.font)}. Dades del ${esc(META.dataTxt)}. Els llocs i les unitats són els actius autoritzats per Conselleria.</p>
      </div>`;
  }
  function filtraDesDeXifres(grup, v) {
    if (grup === "comarca") { estat.comarca = estat.comarca === v ? "" : v; estat.municipi = ""; mostrats = LIMIT; return aplica(); }
    if (grup === "municipi") { estat.municipi = estat.municipi === v ? "" : v; mostrats = LIMIT; return aplica(); }
    canvia(grup, v);
  }

  // ---------- Exportació ----------
  function nomFitxer(ext) {
    const base = estat.municipi || estat.comarca || "castello";
    return `centres-${norm(base).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${META.data}.${ext}`;
  }
  function descarrega(blob, nom) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nom;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  function exportaCSV() {
    const cols = colsVisibles();
    const cel = (v) => { const s = String(v ?? ""); return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const linies = [cols.map((c) => cel(c.l)).join(";"), ...filesTaula().map((c) => cols.map((col) => cel(col.v(c))).join(";"))];
    descarrega(new Blob(["﻿" + linies.join("\r\n")], { type: "text/csv;charset=utf-8" }), nomFitxer("csv"));
    avisa(`CSV descarregat amb ${filtrats.length} centres`);
  }
  async function ambBoto(boto, fn) {
    const html = boto.innerHTML;
    boto.disabled = true; boto.textContent = "Preparant…";
    try { await fn(); avisa("PDF descarregat"); } catch (e) { console.error(e); avisa("No s'ha pogut generar el PDF"); }
    boto.disabled = false; boto.innerHTML = html;
  }

  let temps;
  function avisa(t) {
    const a = $("#avis");
    a.textContent = t; a.hidden = false;
    clearTimeout(temps); temps = setTimeout(() => (a.hidden = true), 2800);
  }

  // ---------- Vistes i calaix ----------
  const estretor = () => window.matchMedia("(max-width: 760px)").matches;
  function posaVista(v) {
    if (v === "llistat" && !estretor()) v = "mapa";
    document.body.dataset.vista = v;
    document.querySelectorAll(".pestanyes button").forEach((b) => b.setAttribute("aria-selected", b.dataset.vista === v));
    if (v === "taula") pintaTaula();
    if (v === "xifres") pintaXifres();
    if (v === "mapa") setTimeout(() => mapa.invalidateSize(), 0);
  }
  function obreCalaix() {
    $("#calaix").hidden = false; $("#vel").hidden = false;
    $("#obre-calaix").setAttribute("aria-expanded", "true");
    pintaCalaix();
    $("#tanca-calaix").focus();
  }
  function tancaCalaix() {
    $("#calaix").hidden = true; $("#vel").hidden = true;
    $("#obre-calaix").setAttribute("aria-expanded", "false");
    $("#obre-calaix").focus();
  }
  function tancaMenus(excepte) {
    for (const id of ["pop-etapa", "columnes"]) {
      if (id === excepte) continue;
      const menu = $(`#${id} .desplegable__menu`), b = $(`#${id} > button`);
      if (!menu.hidden) { menu.hidden = true; b.setAttribute("aria-expanded", "false"); }
    }
  }
  function commutaMenu(id, pinta) {
    const menu = $(`#${id} .desplegable__menu`), b = $(`#${id} > button`);
    const obre = menu.hidden;
    tancaMenus(id);
    if (obre) pinta();
    menu.hidden = !obre; b.setAttribute("aria-expanded", obre);
  }

  // ---------- Esdeveniments ----------
  function connecta() {
    let t;
    const cerca = $("#cerca");
    cerca.addEventListener("input", (e) => {
      pintaSugg(e.target.value);
      clearTimeout(t);
      t = setTimeout(() => { estat.q = norm(e.target.value.trim()); mostrats = LIMIT; aplica(); }, 250);
    });
    cerca.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); mouSugg(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); mouSugg(-1); }
      else if (e.key === "Enter") { if (suggIdx >= 0) { e.preventDefault(); triaSugg(suggIdx); } else tancaSugg(); }
      else if (e.key === "Escape") tancaSugg();
    });
    cerca.addEventListener("focus", () => { if (cerca.value.trim().length >= 2) pintaSugg(cerca.value); });
    $("#suggeriments").addEventListener("mousedown", (e) => {
      const li = e.target.closest(".suggeriment");
      if (li) { e.preventDefault(); triaSugg(+li.dataset.i); }
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".cerca")) tancaSugg();
      if (!e.target.closest(".desplegable")) tancaMenus();
    });

    $("#aprop").addEventListener("click", aprop);
    $("#mostra-filtres").addEventListener("click", (e) => {
      const obert = document.body.classList.toggle("filtres-mobil-oberts");
      e.currentTarget.setAttribute("aria-expanded", obert);
    });

    // Xips ràpids, filtres actius i opcions
    document.addEventListener("click", (e) => {
      const xc = e.target.closest("[data-commuta]");
      if (xc) return canvia(xc.dataset.commuta, xc.dataset.valor);
      const tr = e.target.closest("[data-treu]");
      if (tr) return canvia(tr.dataset.treu, tr.dataset.valor, false);
    });
    document.addEventListener("change", (e) => {
      const el = e.target;
      if (el.id === "f-comarca") { estat.comarca = el.value; estat.municipi = ""; mostrats = LIMIT; return aplica(); }
      if (el.id === "f-municipi") { estat.municipi = el.value; mostrats = LIMIT; return aplica(); }
      if (el.dataset.grup) return canvia(el.dataset.grup, el.value, el.checked);
    });
    $("#pop-etapa > button").addEventListener("click", () => commutaMenu("pop-etapa", pintaEtapes));
    $("#neteja").addEventListener("click", () => neteja());
    $("#obre-calaix").addEventListener("click", obreCalaix);
    $("#tanca-calaix").addEventListener("click", tancaCalaix);
    $("#aplica-calaix").addEventListener("click", () => { tancaCalaix(); if (estretor()) posaVista("llistat"); });
    $("#vel").addEventListener("click", tancaCalaix);
    $("#neteja-calaix").addEventListener("click", () => neteja());

    document.querySelector(".pestanyes").addEventListener("click", (e) => {
      const b = e.target.closest("button[data-vista]");
      if (b) posaVista(b.dataset.vista);
    });

    const panell = $("#panell");
    panell.addEventListener("click", (e) => {
      const item = e.target.closest(".item");
      if (item) return selecciona(item.dataset.codi);
      const acc = e.target.closest("[data-accio]");
      if (!acc) return;
      const a = acc.dataset.accio;
      if (a === "torna") desselecciona();
      else if (a === "mes") { mostrats += LIMIT; pintaLlistat(); }
      else if (a === "neteja") neteja();
      else if (a === "pdf-fitxa") { const c = perCodi.get(estat.sel); ambBoto(acc, () => window.CGTPDF.fitxa(c, seccions(c), META)); }
    });
    panell.addEventListener("change", (e) => {
      if (e.target.id === "ordre-llistat") { estat.llistatOrdre = e.target.value; pintaLlistat(); }
    });
    panell.addEventListener("mouseover", (e) => { const it = e.target.closest(".item"); if (it && !it.contains(e.relatedTarget)) ressalta(it.dataset.codi, true); });
    panell.addEventListener("mouseout", (e) => { const it = e.target.closest(".item"); if (it && !it.contains(e.relatedTarget)) ressalta(it.dataset.codi, false); });

    $("#taula thead").addEventListener("click", (e) => {
      const th = e.target.closest("th");
      if (!th) return;
      const k = th.dataset.col;
      estat.ordre = estat.ordre.k === k ? { k, dir: -estat.ordre.dir } : { k, dir: 1 };
      pintaTaula();
    });
    $("#taula tbody").addEventListener("click", (e) => {
      const tr = e.target.closest("tr[data-codi]");
      if (tr) selecciona(tr.dataset.codi, { vista: estretor() ? "llistat" : "mapa" });
    });

    const menuCols = $("#columnes-menu");
    $("#columnes > button").addEventListener("click", () => commutaMenu("columnes", pintaMenuColumnes));
    menuCols.addEventListener("change", (e) => {
      const k = e.target.dataset.col;
      if (!k) return;
      e.stopPropagation();
      e.target.checked ? estat.cols.add(k) : estat.cols.delete(k);
      if (!estat.cols.size) estat.cols.add("nom");
      desaCols(); pintaTaula();
    });
    menuCols.addEventListener("click", (e) => {
      const a = e.target.closest("[data-accio]")?.dataset.accio;
      if (!a) return;
      estat.cols = new Set(a === "cols-totes" ? COLS.map((c) => c.k) : COLS.filter((c) => c.def).map((c) => c.k));
      desaCols(); pintaMenuColumnes(); pintaTaula();
    });

    const xif = $("#xifres");
    xif.addEventListener("click", (e) => {
      const b = e.target.closest("[data-filtra]");
      if (b) return filtraDesDeXifres(b.dataset.filtra, b.dataset.valor);
      if (e.target.closest('[data-accio="neteja"]')) neteja();
    });
    const tip = $("#tip");
    const mostraTip = (el, x, y) => {
      tip.textContent = el.dataset.tip; tip.hidden = false;
      const w = tip.offsetWidth, h = tip.offsetHeight;
      tip.style.left = Math.min(window.innerWidth - w - 8, Math.max(8, x - w / 2)) + "px";
      tip.style.top = Math.max(8, y - h - 12) + "px";
    };
    xif.addEventListener("pointermove", (e) => { const el = e.target.closest("[data-tip]"); if (el) mostraTip(el, e.clientX, e.clientY); else tip.hidden = true; });
    xif.addEventListener("pointerleave", () => (tip.hidden = true));
    xif.addEventListener("focusin", (e) => { const el = e.target.closest("[data-tip]"); if (el) { const r = el.getBoundingClientRect(); mostraTip(el, r.left + r.width / 2, r.top); } });
    xif.addEventListener("focusout", () => (tip.hidden = true));
    xif.addEventListener("scroll", () => (tip.hidden = true));

    $("#exporta-csv").addEventListener("click", exportaCSV);
    $("#exporta-pdf").addEventListener("click", (e) => ambBoto(e.currentTarget, () =>
      window.CGTPDF.taula(colsVisibles(), filesTaula(), descripcioFiltres(), META, nomFitxer("pdf"))));

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!$("#calaix").hidden) return tancaCalaix();
      tancaMenus();
      if (estat.sel && document.activeElement !== cerca) desselecciona();
    });
  }

  function neteja(pinta = true) {
    Object.assign(estat, { q: "", comarca: "", municipi: "" });
    ["regim", "flags", "etapes", "tipus", "inst"].forEach((k) => estat[k].clear());
    $("#cerca").value = "";
    mostrats = LIMIT;
    if (pinta) aplica(); else aplica({ ajusta: false });
  }

  // ---------- Inici ----------
  async function inicia() {
    const dades = await (await fetch("data/centres.json")).json();
    CENTRES = dades.centres;
    const perMuni = new Map();
    CENTRES.forEach((c) => {
      c._nom = bonic(c.nom);
      c._muni = bonic(c.municipi);
      c._comarca = bonic(c.comarca);
      c._dist = null;
      c._text = norm([c.nom, c.generica, c.municipi, c.codi, c.adreca, c.cp, c.comarca, c.telefon].join(" "));
      perCodi.set(c.codi, c);
      const m = perMuni.get(c.municipi) || { k: c.municipi, nom: c._muni, comarca: c.comarca, n: 0, _n: norm(c.municipi) };
      m.n++; perMuni.set(c.municipi, m);
    });
    MUNIS = [...perMuni.values()].sort((a, b) => a.nom.localeCompare(b.nom, "ca"));
    const [a, m, d] = dades.actualitzat.split("-");
    META = {
      font: dades.font, data: dades.actualitzat, dataTxt: `${d}/${m}/${a}`, total: CENTRES.length,
      inst: [...new Set(CENTRES.flatMap((c) => c.installacions))].sort((x, y) => x.localeCompare(y, "ca")),
    };

    iniciaMapa();
    connecta();
    aplica();
    const h = location.hash.match(/centre=(\d+)/);
    if (h && perCodi.has(h[1])) selecciona(h[1]);
  }

  window.addEventListener("DOMContentLoaded", () => inicia().catch((e) => {
    console.error(e);
    document.getElementById("panell").innerHTML = '<div class="buit"><span class="etiqueta">Error</span><h3>No s\'han pogut carregar les dades</h3><p>Torna-ho a provar d\'ací a una estona.</p></div>';
  }));
})();
