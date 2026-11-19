/* Mapa de centres educatius · CGT Castelló */
(() => {
  "use strict";

  // ---------- Definicions ----------
  const REGIMS = [
    { k: "Públic", curt: "Públic", cls: "public" },
    { k: "Privat concertat", curt: "Concertat", cls: "concertat" },
    { k: "Privat no concertat", curt: "Privat", cls: "privat" },
  ];
  const regimInfo = (r) => REGIMS.find((x) => x.k === r) || REGIMS[2];

  const FLAGS = [
    { k: "menjador_aut", l: "Menjador escolar autoritzat", curt: "Menjador autoritzat", ajuda: "El que compta el filtre «Menjador» de Conselleria" },
    { k: "menjador", l: "Menjador (qualsevol)", curt: "Menjador (qualsevol)", ajuda: "Inclou també escoletes i privats" },
    { k: "transport", l: "Transport escolar", curt: "Transport" },
    { k: "banc_llibres", l: "Banc de llibres", curt: "Banc de llibres" },
    { k: "jornada_continua", l: "Jornada contínua (9 a 14 h)", curt: "Jornada contínua" },
    { k: "aula_2anys", l: "Aula de dos anys", curt: "Aula 2 anys" },
    { k: "aula_cil", l: "Aula de comunicació i llenguatge (CIL)", curt: "Aula CIL" },
    { k: "internat", l: "Internat", curt: "Internat" },
    { k: "cafeteria", l: "Cafeteria / bar", curt: "Cafeteria" },
    { k: "cursos_estiu", l: "Cursos d'estiu", curt: "Cursos d'estiu" },
    { k: "fse", l: "Fons Socials Europeus", curt: "FSE" },
  ];
  const ETAPES = ["Infantil 0-3", "Infantil 3-6", "Primària", "ESO", "Batxillerat", "Formació professional",
    "Educació especial", "Persones adultes", "Música i dansa", "Arts i disseny", "Ensenyances esportives", "Idiomes"];

  const siNo = (b) => (b ? "Sí" : "No");
  const llista = (a) => (a || []).join(", ");
  const COLS = [
    { k: "codi", l: "Codi", v: (c) => c.codi },
    { k: "nom", l: "Centre", v: (c) => c.nom, def: true, cls: "col-nom" },
    { k: "tipus", l: "Tipus", v: (c) => c.tipus, def: true },
    { k: "regim", l: "Règim", v: (c) => c.regim, def: true },
    { k: "municipi", l: "Municipi", v: (c) => c.municipi, def: true },
    { k: "comarca", l: "Comarca", v: (c) => c.comarca },
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

  const fitxaOficial = (c) => `https://xacen.gva.es/xacen-frontend/centro?codigoCentro=${c.codi}&lang=va`;
  const norm = (s) => (s || "").toString().normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  // Model de la fitxa: el fa servir la vista web i el PDF (pdf.js)
  function seccions(c) {
    const kv = (files) => ({ tipus: "kv", files: files.filter((f) => f[1] !== null && f[1] !== undefined && f[1] !== "") });
    const s = [];
    s.push({ titol: "Dades del centre", ...kv([
      ["Codi", c.codi], ["Denominació", c.generica], ["Tipus", c.tipus], ["Règim", c.regim],
      ["Titular", c.titular], ["CIF", c.cif], ["Comarca", c.comarca],
    ]) });
    s.push({ titol: "Contacte i ubicació", ...kv([
      ["Adreça", `${c.adreca}, ${c.cp} ${c.municipi}`], ["Telèfon", c.telefon], ["Fax", c.fax],
      ["Correu", c.correu], ["Web", c.web],
    ]) });
    const altres = c.serveis.filter((x) => !["Menjador escolar autoritzat", "Menjador", "Transport", "Cafeteria/bar", "Cursos d'estiu"].includes(x) && !/^Internat/.test(x));
    s.push({ titol: "Serveis complementaris", tipus: "kv", sino: true, files: [
      ["Menjador escolar autoritzat", c.f.menjador_aut],
      ...(c.f.menjador && !c.f.menjador_aut ? [["Menjador (sense autorització de Conselleria)", true]] : []),
      ["Transport escolar", c.f.transport],
      ["Internat", c.f.internat],
      ["Cafeteria / bar", c.f.cafeteria],
      ["Cursos d'estiu", c.f.cursos_estiu],
      ...altres.map((x) => [x, true]),
    ] });
    s.push({ titol: "Jornada", tipus: "llista", items: c.jornada });
    s.push({ titol: "Programes i característiques", tipus: "llista", items: c.programes });
    s.push({ titol: "Ensenyaments autoritzats", tipus: "taula",
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
    sel: null, ordre: { k: null, dir: 1 }, llistatOrdre: "municipi",
    cols: new Set(COLS.filter((c) => c.def).map((c) => c.k)),
  };
  try {
    const desades = JSON.parse(localStorage.getItem("cgt-centres-cols") || "null");
    if (Array.isArray(desades) && desades.length) estat.cols = new Set(desades.filter((k) => COLS.some((c) => c.k === k)));
  } catch (_) { /* sense emmagatzematge */ }

  let CENTRES = [], META = {}, filtrats = [], perCodi = new Map();
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

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

  function nFiltres() {
    return (estat.q ? 1 : 0) + estat.regim.size + (estat.comarca ? 1 : 0) + (estat.municipi ? 1 : 0)
      + estat.flags.size + estat.etapes.size + estat.tipus.size + estat.inst.size;
  }

  function descripcioFiltres() {
    const p = [];
    if (estat.q) p.push(`cerca «${$("#cerca").value.trim()}»`);
    if (estat.regim.size) p.push([...estat.regim].map((r) => regimInfo(r).curt).join(" o "));
    if (estat.comarca) p.push(estat.comarca);
    if (estat.municipi) p.push(estat.municipi);
    if (estat.tipus.size) p.push([...estat.tipus].join(" o "));
    if (estat.etapes.size) p.push([...estat.etapes].join(" o "));
    for (const f of estat.flags) p.push(FLAGS.find((x) => x.k === f).l);
    for (const i of estat.inst) p.push(i);
    return p.length ? p.join(" · ") : "Tots els centres";
  }

  const opcio = (grup, valor, text, n, marcat, ajuda) => `
    <label class="opcio${n === 0 && !marcat ? " opcio--buida" : ""}">
      <input type="checkbox" data-grup="${grup}" value="${esc(valor)}"${marcat ? " checked" : ""}>
      <span>${esc(text)}${ajuda ? `<small>${esc(ajuda)}</small>` : ""}</span>
      <span class="opcio__n">${n}</span>
    </label>`;

  function pintaFiltres() {
    const compta = (grup, prova) => CENTRES.filter((c) => passa(c, grup) && prova(c)).length;
    $("#f-regim").innerHTML = REGIMS.map((r) => `
      <label class="xip"><input type="checkbox" data-grup="regim" value="${esc(r.k)}"${estat.regim.has(r.k) ? " checked" : ""}>
      <i class="m m--${r.cls}"></i>${r.curt} <span class="opcio__n">${compta("regim", (c) => c.regim === r.k)}</span></label>`).join("");
    $("#f-flags").innerHTML = FLAGS.map((f) => opcio("flags", f.k, f.l, filtrats.filter((c) => c.f[f.k]).length, estat.flags.has(f.k), f.ajuda)).join("");
    $("#f-etapes").innerHTML = ETAPES.map((e) => opcio("etapes", e, e, compta("etapes", (c) => c.etapes.includes(e)), estat.etapes.has(e))).join("");
    const tipus = [...new Set(CENTRES.map((c) => c.tipus))].sort((a, b) => (a === "Altres") - (b === "Altres") || a.localeCompare(b, "ca"));
    $("#f-tipus").innerHTML = tipus.map((t) => opcio("tipus", t, t, compta("tipus", (c) => c.tipus === t), estat.tipus.has(t))).join("");
    $("#f-inst").innerHTML = META.inst.map((i) => opcio("inst", i, i, filtrats.filter((c) => c.installacions.includes(i)).length, estat.inst.has(i))).join("");

    // Municipis segons comarca
    const munis = [...new Set(CENTRES.filter((c) => !estat.comarca || c.comarca === estat.comarca).map((c) => c.municipi))].sort((a, b) => a.localeCompare(b, "ca"));
    if (estat.municipi && !munis.includes(estat.municipi)) estat.municipi = "";
    $("#f-municipi").innerHTML = `<option value="">Tots</option>` + munis.map((m) => `<option${m === estat.municipi ? " selected" : ""}>${esc(m)}</option>`).join("");
  }

  function aplica({ ajusta = true } = {}) {
    filtrats = CENTRES.filter((c) => passa(c));
    $("#recompte").textContent = filtrats.length;
    $("#n-aplica").textContent = filtrats.length;
    const n = nFiltres();
    $("#n-filtres").textContent = n;
    $("#n-filtres").hidden = !n;
    pintaFiltres();
    pintaMapa(ajusta);
    if (!estat.sel) pintaLlistat();
    pintaTaula();
  }

  // ---------- Mapa ----------
  let mapa, capa, marcadors = new Map();
  function iniciaMapa() {
    mapa = L.map("mapa", { zoomControl: true, scrollWheelZoom: true, preferCanvas: false }).setView([40.15, -0.15], 9);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, className: "teseles",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapa);
    // Recalcula la mida quan canvia el contenidor (iframe, pestanyes, mòbil)
    new ResizeObserver(() => mapa.invalidateSize()).observe(document.getElementById("mapa"));
    capa = L.markerClusterGroup({
      showCoverageOnHover: false, maxClusterRadius: 44, disableClusteringAtZoom: 15, spiderfyOnMaxZoom: true,
      iconCreateFunction: (cl) => {
        const n = cl.getChildCount(), mida = n < 10 ? 28 : n < 50 ? 34 : 42;
        return L.divIcon({ html: `<div class="grup-mapa${n >= 50 ? " grup-mapa--g" : ""}" style="width:${mida}px;height:${mida}px">${n}</div>`, className: "marcador", iconSize: [mida, mida] });
      },
    });
    mapa.addLayer(capa);
  }
  const icona = (c, sel) => L.divIcon({
    className: "marcador",
    html: `<i class="m ${sel ? "m--sel" : "m--" + regimInfo(c.regim).cls}"></i>`,
    iconSize: sel ? [22, 22] : [14, 14],
  });
  function pintaMapa(ajusta) {
    capa.clearLayers();
    marcadors.clear();
    const ms = filtrats.filter((c) => c.lat).map((c) => {
      const m = L.marker([c.lat, c.lng], { icon: icona(c, estat.sel === c.codi), title: c.nom, zIndexOffset: estat.sel === c.codi ? 1000 : 0 });
      m.bindTooltip(`${c.nom} · ${c.municipi}`, { direction: "top", offset: [0, -8] });
      m.on("click", () => selecciona(c.codi, { centra: false }));
      marcadors.set(c.codi, m);
      return m;
    });
    capa.addLayers(ms);
    mapa.invalidateSize();
    if (ajusta && ms.length) mapa.fitBounds(L.featureGroup(ms).getBounds().pad(0.08), { maxZoom: 15 });
  }

  // ---------- Llistat ----------
  const LIMIT = 120;
  let mostrats = LIMIT;
  function ordenaLlistat(a) {
    const k = estat.llistatOrdre;
    const cmp = { municipi: (x, y) => x.municipi.localeCompare(y.municipi, "ca") || x.nom.localeCompare(y.nom, "ca"),
      nom: (x, y) => x.nom.localeCompare(y.nom, "ca"), llocs: (x, y) => y.llocs - x.llocs }[k];
    return [...a].sort(cmp);
  }
  function pintaLlistat() {
    const p = $("#panell");
    if (!filtrats.length) {
      p.innerHTML = `<div class="buit"><span class="etiqueta">Cap centre</span><p>No hi ha cap centre que complisca tots els filtres.</p><button class="boto" data-accio="neteja">Netejar filtres</button></div>`;
      return;
    }
    const llista = ordenaLlistat(filtrats).slice(0, mostrats);
    p.innerHTML = `
      <div class="llistat">
        <div class="llistat__cap"><span class="kicker">${filtrats.length} resultats</span>
          <select id="ordre-llistat" aria-label="Ordenar">
            <option value="municipi"${estat.llistatOrdre === "municipi" ? " selected" : ""}>Per municipi</option>
            <option value="nom"${estat.llistatOrdre === "nom" ? " selected" : ""}>Per nom</option>
            <option value="llocs"${estat.llistatOrdre === "llocs" ? " selected" : ""}>Per llocs</option>
          </select></div>
        <ol>${llista.map((c) => `<li><button class="item" data-codi="${c.codi}">
          <span class="item__nom"><i class="m m--${regimInfo(c.regim).cls}"></i>${esc(c.nom)}</span>
          <span class="item__meta">${esc(c.tipus)} · ${esc(c.municipi)}</span>
          <span class="item__tags">${c.f.menjador_aut ? '<span class="tag">Menjador</span>' : ""}${c.f.transport ? '<span class="tag">Transport</span>' : ""}${c.f.banc_llibres ? '<span class="tag">Banc llibres</span>' : ""}${c.f.jornada_continua ? '<span class="tag">Jornada contínua</span>' : ""}</span>
        </button></li>`).join("")}</ol>
        ${filtrats.length > mostrats ? `<button class="boto mes" data-accio="mes">Mostrar més (${filtrats.length - mostrats})</button>` : ""}
      </div>`;
  }

  // ---------- Fitxa ----------
  function htmlSeccio(s) {
    let cos;
    if (s.tipus === "kv") {
      cos = s.files.length ? `<dl class="kv">${s.files.map(([k, v]) => {
        let val;
        if (s.sino) val = `<span class="si-no si-no--${v ? "si" : "no"}">${v ? "Sí" : "No"}</span>`;
        else if (k === "Correu") val = `<a href="mailto:${esc(v)}">${esc(v)}</a>`;
        else if (k === "Web") val = `<a href="${esc(v)}" target="_blank" rel="noopener">${esc(v.replace(/^https?:\/\//, ""))}</a>`;
        else if (k === "Telèfon") val = `<a href="tel:${esc(v)}">${esc(v)}</a>`;
        else val = esc(v);
        return `<dt>${esc(k)}</dt><dd>${val}</dd>`;
      }).join("")}</dl>` : "";
    } else if (s.tipus === "llista") {
      cos = s.items.length ? `<ul class="llista">${s.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : "";
    } else if (s.tipus === "etiquetes") {
      cos = s.items.length ? `<div class="etiquetes">${s.items.map((i) => `<span>${esc(i)}</span>`).join("")}</div>` : "";
    } else {
      const td = (v, i) => `<td${s.num.includes(i) ? ' class="n"' : ""}>${esc(v)}</td>`;
      cos = s.files.length ? `<table class="mini"><thead><tr>${s.cap.map((h, i) => `<th${s.num.includes(i) ? ' class="n"' : ""}>${esc(h)}</th>`).join("")}</tr></thead>
        <tbody>${s.files.map((f) => `<tr>${f.map(td).join("")}</tr>`).join("")}</tbody>
        ${s.peu ? `<tfoot><tr>${s.peu.map(td).join("")}</tr></tfoot>` : ""}</table>` : "";
    }
    return `<section class="seccio"><h2>${esc(s.titol)}</h2>${cos || '<p class="sense">Sense dades</p>'}</section>`;
  }

  function pintaFitxa(c) {
    const r = regimInfo(c.regim);
    $("#panell").innerHTML = `
      <article class="fitxa">
        <div class="fitxa__nav">
          <button class="enllac" data-accio="torna">← Tornar al llistat</button>
          <button class="boto boto--roig" data-accio="pdf-fitxa">Descarregar PDF</button>
        </div>
        <header class="fitxa__cap">
          <span class="etiqueta">${esc(c.tipus)}</span>
          <span class="kicker">${esc(r.curt)} · ${esc(c.municipi)} · ${esc(c.codi)}</span>
          <h1>${esc(c.nom)}</h1>
          ${c.generica && c.generica.trim() !== c.nom ? `<p class="fitxa__generica">${esc(c.generica)}</p>` : ""}
        </header>
        <div class="resum">
          <div><b class="${c.f.menjador_aut ? "si" : ""}">${c.f.menjador_aut ? "Sí" : c.f.menjador ? "Altre" : "No"}</b><span>Menjador</span></div>
          <div><b class="${c.f.transport ? "si" : ""}">${siNo(c.f.transport)}</b><span>Transport</span></div>
          <div><b>${c.llocs}</b><span>Llocs actius</span></div>
        </div>
        ${seccions(c).map(htmlSeccio).join("")}
        <p class="font">Font: ${esc(META.font)}. Dades del ${esc(META.dataTxt)}. <a href="${fitxaOficial(c)}" target="_blank" rel="noopener">Fitxa oficial a Conselleria</a></p>
      </article>`;
    $("#panell").scrollTop = 0;
  }

  function selecciona(codi, { centra = true, vista } = {}) {
    const c = perCodi.get(codi);
    if (!c) return;
    const anterior = estat.sel;
    estat.sel = codi;
    if (anterior && marcadors.get(anterior)) { const pc = perCodi.get(anterior); marcadors.get(anterior).setIcon(icona(pc, false)).setZIndexOffset(0); }
    const m = marcadors.get(codi);
    if (m) {
      m.setIcon(icona(c, true)).setZIndexOffset(1000);
      if (centra) capa.zoomToShowLayer(m, () => mapa.panTo(m.getLatLng()));
    }
    pintaFitxa(c);
    try { history.replaceState(null, "", "#centre=" + codi); } catch (_) { /* iframe sandbox */ }
    if (vista) posaVista(vista);
    else if (estretor() && document.body.dataset.vista === "mapa") posaVista("llistat");
  }
  function desselecciona() {
    const anterior = estat.sel;
    estat.sel = null;
    if (anterior && marcadors.get(anterior)) marcadors.get(anterior).setIcon(icona(perCodi.get(anterior), false)).setZIndexOffset(0);
    try { history.replaceState(null, "", location.pathname + location.search); } catch (_) { /* */ }
    pintaLlistat();
  }

  // ---------- Taula ----------
  const colsVisibles = () => COLS.filter((c) => estat.cols.has(c.k));
  function filesTaula() {
    const { k, dir } = estat.ordre;
    if (!k) return filtrats;
    const col = COLS.find((c) => c.k === k);
    return [...filtrats].sort((a, b) => {
      const x = col.v(a), y = col.v(b);
      return (col.num ? (x ?? 0) - (y ?? 0) : String(x).localeCompare(String(y), "ca")) * dir;
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
      COLS.map((c) => `<label class="opcio"><input type="checkbox" data-col="${c.k}"${estat.cols.has(c.k) ? " checked" : ""}><span>${esc(c.l)}</span></label>`).join("");
  }
  function desaCols() { try { localStorage.setItem("cgt-centres-cols", JSON.stringify([...estat.cols])); } catch (_) { /* */ } }

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
    avisa(`CSV descarregat: ${filtrats.length} centres`);
  }
  async function ambBoto(boto, fn) {
    const text = boto.textContent;
    boto.disabled = true; boto.textContent = "Preparant PDF…";
    try { await fn(); } catch (e) { console.error(e); avisa("No s'ha pogut generar el PDF"); }
    boto.disabled = false; boto.textContent = text;
  }

  let temps;
  function avisa(t) {
    const a = $("#avis");
    a.textContent = t; a.hidden = false;
    clearTimeout(temps); temps = setTimeout(() => (a.hidden = true), 2600);
  }

  // ---------- Vistes ----------
  const estretor = () => window.matchMedia("(max-width: 860px)").matches;
  function posaVista(v) {
    if (v === "llistat" && !estretor()) v = "mapa";
    document.body.dataset.vista = v;
    document.querySelectorAll(".pestanyes button").forEach((b) => b.setAttribute("aria-selected", b.dataset.vista === v));
    if (v === "taula") pintaTaula();
    if (v === "mapa") setTimeout(() => mapa.invalidateSize(), 0);
  }

  // ---------- Esdeveniments ----------
  function connecta() {
    let t;
    $("#cerca").addEventListener("input", (e) => {
      clearTimeout(t);
      t = setTimeout(() => { estat.q = norm(e.target.value.trim()); mostrats = LIMIT; aplica(); }, 180);
    });
    $("#filtres").addEventListener("change", (e) => {
      const el = e.target;
      if (el.id === "f-comarca") { estat.comarca = el.value; estat.municipi = ""; }
      else if (el.id === "f-municipi") estat.municipi = el.value;
      else if (el.dataset.grup) {
        const set = estat[el.dataset.grup];
        el.checked ? set.add(el.value) : set.delete(el.value);
      } else return;
      mostrats = LIMIT;
      aplica();
    });
    $("#neteja").addEventListener("click", neteja);
    $("#obre-filtres").addEventListener("click", () => { document.body.classList.add("filtres-oberts"); $("#obre-filtres").setAttribute("aria-expanded", "true"); });
    const tanca = () => { document.body.classList.remove("filtres-oberts"); $("#obre-filtres").setAttribute("aria-expanded", "false"); };
    $("#tanca-filtres").addEventListener("click", tanca);
    $("#aplica-filtres").addEventListener("click", tanca);

    document.querySelector(".pestanyes").addEventListener("click", (e) => {
      const b = e.target.closest("button[data-vista]");
      if (b) posaVista(b.dataset.vista);
    });

    $("#panell").addEventListener("click", (e) => {
      const item = e.target.closest(".item");
      if (item) return selecciona(item.dataset.codi);
      const acc = e.target.closest("[data-accio]");
      if (!acc) return;
      const a = acc.dataset.accio;
      if (a === "torna") desselecciona();
      else if (a === "mes") { mostrats += LIMIT; pintaLlistat(); }
      else if (a === "neteja") neteja();
      else if (a === "pdf-fitxa") ambBoto(acc, () => window.CGTPDF.fitxa(perCodi.get(estat.sel), seccions(perCodi.get(estat.sel)), META));
    });
    $("#panell").addEventListener("change", (e) => {
      if (e.target.id === "ordre-llistat") { estat.llistatOrdre = e.target.value; pintaLlistat(); }
    });

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

    const menu = $("#columnes-menu"), botoCols = $("#columnes > button");
    botoCols.addEventListener("click", () => {
      const obert = menu.hidden;
      if (obert) pintaMenuColumnes();
      menu.hidden = !obert; botoCols.setAttribute("aria-expanded", obert);
    });
    document.addEventListener("click", (e) => { if (!menu.hidden && !e.target.closest("#columnes")) { menu.hidden = true; botoCols.setAttribute("aria-expanded", "false"); } });
    menu.addEventListener("change", (e) => {
      const k = e.target.dataset.col;
      if (!k) return;
      e.target.checked ? estat.cols.add(k) : estat.cols.delete(k);
      if (!estat.cols.size) estat.cols.add("nom");
      desaCols(); pintaTaula();
    });
    menu.addEventListener("click", (e) => {
      const a = e.target.closest("[data-accio]")?.dataset.accio;
      if (!a) return;
      estat.cols = new Set(a === "cols-totes" ? COLS.map((c) => c.k) : COLS.filter((c) => c.def).map((c) => c.k));
      desaCols(); pintaMenuColumnes(); pintaTaula();
    });

    $("#exporta-csv").addEventListener("click", exportaCSV);
    $("#exporta-pdf").addEventListener("click", (e) => ambBoto(e.currentTarget, () =>
      window.CGTPDF.taula(colsVisibles(), filesTaula(), descripcioFiltres(), META, nomFitxer("pdf"))));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!menu.hidden) { menu.hidden = true; return; }
        if (document.body.classList.contains("filtres-oberts")) return tanca();
        if (estat.sel) desselecciona();
      }
    });
  }

  function neteja() {
    Object.assign(estat, { q: "", comarca: "", municipi: "" });
    ["regim", "flags", "etapes", "tipus", "inst"].forEach((k) => estat[k].clear());
    $("#cerca").value = "";
    $("#f-comarca").value = "";
    mostrats = LIMIT;
    aplica();
  }

  // ---------- Inici ----------
  async function inicia() {
    const resp = await fetch("data/centres.json");
    const dades = await resp.json();
    CENTRES = dades.centres;
    CENTRES.forEach((c) => {
      c._text = norm([c.nom, c.generica, c.municipi, c.codi, c.adreca, c.cp, c.comarca, c.telefon].join(" "));
      perCodi.set(c.codi, c);
    });
    const [a, m, d] = dades.actualitzat.split("-");
    META = {
      font: dades.font, data: dades.actualitzat, dataTxt: `${d}/${m}/${a}`, total: CENTRES.length,
      inst: [...new Set(CENTRES.flatMap((c) => c.installacions))].sort((x, y) => x.localeCompare(y, "ca")),
    };
    $("#recompte-total").textContent = `de ${CENTRES.length}`;
    $("#font-dades").textContent = META.font;
    $("#data-dades").textContent = META.dataTxt;
    const comarques = [...new Set(CENTRES.map((c) => c.comarca))].sort((x, y) => x.localeCompare(y, "ca"));
    $("#f-comarca").innerHTML = `<option value="">Totes</option>` + comarques.map((c) => `<option>${esc(c)}</option>`).join("");

    iniciaMapa();
    connecta();
    aplica();
    const h = location.hash.match(/centre=(\d+)/);
    if (h && perCodi.has(h[1])) selecciona(h[1]);
  }

  window.addEventListener("DOMContentLoaded", () => inicia().catch((e) => {
    console.error(e);
    document.getElementById("panell").innerHTML = '<div class="buit"><span class="etiqueta">Error</span><p>No s\'han pogut carregar les dades.</p></div>';
  }));
})();
