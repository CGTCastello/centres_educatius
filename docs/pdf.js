/* Exportació a PDF amb jsPDF + autoTable, amb l'estil CGT Castelló */
(() => {
  "use strict";
  const ROIG = [228, 33, 39], NEGRE = [17, 17, 17], GROC = [233, 232, 76], GRIS = [95, 94, 89], LINIA = [228, 226, 221];
  const M = 14; // marge (mm)

  let recursos = null;
  const aBase64 = async (url) => {
    const buf = await (await fetch(url)).arrayBuffer();
    let s = "";
    const b = new Uint8Array(buf);
    for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
    return btoa(s);
  };
  async function carrega() {
    if (!recursos) {
      const [anton, reg, bold, logo] = await Promise.all([
        aBase64("assets/fonts/Anton-Regular.ttf"),
        aBase64("assets/fonts/OpenSans-Regular.ttf"),
        aBase64("assets/fonts/OpenSans-Bold.ttf"),
        aBase64("assets/cgt-castello-color.png"),
      ]);
      recursos = { anton, reg, bold, logo: "data:image/png;base64," + logo };
    }
    return recursos;
  }
  async function nouDoc(orientacio) {
    if (!window.jspdf) throw new Error("jsPDF no carregat");
    const r = await carrega();
    const doc = new window.jspdf.jsPDF({ orientation: orientacio, unit: "mm", format: "a4", compress: true });
    doc.addFileToVFS("Anton.ttf", r.anton); doc.addFont("Anton.ttf", "Anton", "normal");
    doc.addFileToVFS("OpenSans.ttf", r.reg); doc.addFont("OpenSans.ttf", "OpenSans", "normal");
    doc.addFileToVFS("OpenSans-Bold.ttf", r.bold); doc.addFont("OpenSans-Bold.ttf", "OpenSans", "bold");
    doc.setFont("OpenSans", "normal");
    return doc;
  }

  // Peu: filet, cgtcastello.org + logo apaisat, font i paginació
  function peus(doc, meta) {
    const n = doc.internal.getNumberOfPages();
    const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
    const logoH = 10, logoW = logoH * (1074 / 636);
    for (let i = 1; i <= n; i++) {
      doc.setPage(i);
      const y = H - 20;
      doc.setFillColor(...NEGRE); doc.rect(M, y, W - 2 * M, 1, "F");
      doc.setFont("Anton", "normal"); doc.setFontSize(13); doc.setTextColor(...NEGRE);
      doc.text("CGTCASTELLO.ORG", M, y + 9);
      doc.addImage(recursos.logo, "PNG", W - M - logoW, y + 3, logoW, logoH, "logo-cgt", "FAST");
      doc.setFont("OpenSans", "normal"); doc.setFontSize(7); doc.setTextColor(...GRIS);
      doc.text(`Font: ${meta.font}. Dades del ${meta.dataTxt}.  ·  Pàgina ${i} de ${n}`, M, y + 14.5);
    }
  }

  function etiqueta(doc, text, x, y) {
    doc.setFont("Anton", "normal"); doc.setFontSize(12);
    const t = text.toUpperCase(), w = doc.getTextWidth(t) + 6;
    doc.setFillColor(...GROC); doc.rect(x, y, w, 7.5, "F");
    doc.setTextColor(...NEGRE); doc.text(t, x + 3, y + 5.6);
    return y + 7.5;
  }
  function kicker(doc, text, x, y) {
    doc.setFont("OpenSans", "bold"); doc.setFontSize(7.5); doc.setTextColor(...GRIS);
    doc.text(text.toUpperCase(), x, y, { charSpace: 0.45 });
  }

  const baseTaula = {
    theme: "plain",
    styles: { font: "OpenSans", fontSize: 8.5, textColor: NEGRE, cellPadding: { top: 1.5, bottom: 1.5, left: 0, right: 2 }, lineColor: LINIA, lineWidth: { bottom: 0.2 }, overflow: "linebreak" },
    headStyles: { font: "OpenSans", fontStyle: "bold", fontSize: 7, textColor: NEGRE, lineColor: NEGRE, lineWidth: { bottom: 0.5 } },
    footStyles: { font: "OpenSans", fontStyle: "bold", textColor: NEGRE, lineWidth: 0 },
  };

  async function fitxa(c, seccions, meta) {
    const doc = await nouDoc("portrait");
    const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
    const ample = W - 2 * M, limit = H - 28;
    let y = M + 2;

    y = etiqueta(doc, c.tipus, M, y) + 7;
    kicker(doc, `${c.regim} · ${c.municipi} · ${c.codi}`, M, y);
    y += 4;
    doc.setFont("Anton", "normal"); doc.setFontSize(24); doc.setTextColor(...NEGRE);
    const tit = doc.splitTextToSize(c.nom.toUpperCase(), ample);
    doc.text(tit, M, y + 8.5, { lineHeightFactor: 1.05 });
    y += 8.5 + (tit.length - 1) * 8.9 + 3;
    if (c.generica && c.generica.trim() !== c.nom) {
      doc.setFont("OpenSans", "normal"); doc.setFontSize(8.5); doc.setTextColor(...GRIS);
      const g = doc.splitTextToSize(c.generica, ample);
      doc.text(g, M, y + 2); y += g.length * 3.8 + 2;
    }

    y += 4;

    for (const s of seccions) {
      if (y > limit - 22) { doc.addPage(); y = M + 2; }
      doc.setFillColor(...NEGRE); doc.rect(M, y, ample, 1, "F");
      doc.setFont("Anton", "normal"); doc.setFontSize(12.5); doc.setTextColor(...NEGRE);
      doc.text(s.titol.toUpperCase(), M, y + 6.6);
      y += 9;

      let opts;
      if (s.tipus === "kv" && s.files.length) {
        opts = {
          body: s.files.map(([k, v]) => [k, s.sino ? (v ? "Sí" : "No") : String(v)]),
          columnStyles: { 0: { cellWidth: 58, textColor: GRIS, fontStyle: "bold", fontSize: 8 } },
          didParseCell: (d) => { if (s.sino && d.column.index === 1) { d.cell.styles.fontStyle = "bold"; d.cell.styles.textColor = d.cell.raw === "Sí" ? ROIG : GRIS; } },
        };
      } else if ((s.tipus === "llista" || s.tipus === "etiquetes") && s.items.length) {
        opts = s.tipus === "llista"
          ? { body: s.items.map((i) => ["•  " + i]) }
          : { body: [[s.items.join("  ·  ")]], styles: { lineWidth: 0 } };
      } else if (s.tipus === "taula" && s.files.length) {
        const col = {}; s.num.forEach((i) => (col[i] = { halign: "right", cellWidth: 18 }));
        opts = { head: [s.cap.map((h) => h.toUpperCase())], body: s.files.map((f) => f.map(String)),
          foot: s.peu ? [s.peu.map(String)] : undefined, columnStyles: col,
          didParseCell: (d) => { if (s.num.includes(d.column.index)) d.cell.styles.halign = "right"; } };
      } else {
        opts = { body: [["Sense dades"]], styles: { textColor: GRIS, lineWidth: 0 } };
      }
      doc.autoTable({ ...baseTaula, ...opts, styles: { ...baseTaula.styles, ...(opts.styles || {}) },
        startY: y, margin: { left: M, right: M, top: M + 2, bottom: 28 }, tableWidth: ample, rowPageBreak: "avoid" });
      y = doc.lastAutoTable.finalY + 6;
    }

    if (y > limit - 6) { doc.addPage(); y = M + 2; }
    doc.setFont("OpenSans", "normal"); doc.setFontSize(7.5); doc.setTextColor(...GRIS);
    const url = `https://xacen.gva.es/xacen-frontend/centro?codigoCentro=${c.codi}&lang=va`;
    doc.textWithLink("Fitxa oficial a Conselleria: " + url, M, y + 2, { url });

    peus(doc, meta);
    doc.save(`centre-${c.codi}-${c.nom.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.pdf`);
  }

  async function taula(cols, files, filtres, meta, nom) {
    const doc = await nouDoc("landscape");
    const W = doc.internal.pageSize.getWidth();
    const ample = W - 2 * M;
    let y = M;
    y = etiqueta(doc, "Llistat de centres", M, y) + 3;
    doc.setFont("Anton", "normal"); doc.setFontSize(22); doc.setTextColor(...NEGRE);
    const xifra = String(files.length);
    doc.setTextColor(...ROIG); doc.text(xifra, M, y + 9);
    const xw = doc.getTextWidth(xifra + " ");
    doc.setTextColor(...NEGRE); doc.text(files.length === 1 ? "CENTRE EDUCATIU" : "CENTRES EDUCATIUS", M + xw, y + 9);
    y += 13;
    doc.setFont("OpenSans", "bold"); doc.setFontSize(8); doc.setTextColor(...GRIS);
    const f = doc.splitTextToSize("Filtres: " + filtres, ample);
    doc.text(f, M, y + 1); y += f.length * 3.6 + 3;

    const mida = cols.length > 16 ? 5.6 : cols.length > 11 ? 6.4 : 7.6;
    const colStyles = {};
    cols.forEach((c, i) => {
      if (c.num) colStyles[i] = { halign: "right" };
      if (c.flag) colStyles[i] = { halign: "center", minCellWidth: 14 };
      if (c.k === "nom") colStyles[i] = { fontStyle: "bold", cellWidth: Math.min(60, ample * 0.22) };
    });
    doc.autoTable({
      ...baseTaula,
      head: [cols.map((c) => (c.curt || c.l).toUpperCase())],
      rowPageBreak: "avoid",
      body: files.map((c) => cols.map((col) => String(col.v(c) ?? ""))),
      startY: y, margin: { left: M, right: M, top: M, bottom: 26 }, tableWidth: ample,
      styles: { ...baseTaula.styles, fontSize: mida, cellPadding: { top: 1.3, bottom: 1.3, left: 1.2, right: 1.2 } },
      headStyles: { ...baseTaula.headStyles, fillColor: NEGRE, textColor: [255, 255, 255], fontSize: mida - 0.6, lineWidth: 0, cellPadding: 1.6 },
      columnStyles: colStyles,
      didParseCell: (d) => {
        const col = cols[d.column.index];
        if (d.section === "body" && col && col.flag) {
          d.cell.styles.fontStyle = "bold";
          d.cell.styles.textColor = d.cell.raw === "Sí" ? ROIG : GRIS;
        }
        if (d.section === "head" && col && (col.flag || col.num)) d.cell.styles.halign = col.flag ? "center" : "right";
      },
    });
    peus(doc, meta);
    doc.save(nom);
  }

  window.CGTPDF = { fitxa, taula };
})();
