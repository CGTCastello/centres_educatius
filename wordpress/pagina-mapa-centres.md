# Pàgina «Mapa de centres educatius» per a cgtcastello.org

Tipus: **pàgina evergreen** (no post). Va amb un bloc **Raw HTML** de WPBakery.
Dades: Guia de Centres Docents de la Conselleria d'Educació, descarregades el 19/11/2026.

Imatge per a compartir (SEOPress › Social › Facebook/X): puja `docs/assets/miniatura.png`
(1200×630) a la biblioteca de mitjans de WordPress i tria-la allí.

---

## Valencià

```
# METADATOS SEOPRESS
# Title SEO:        Mapa de centres educatius de Castelló | CGT
# Meta description: Busca els 459 centres educatius de Castelló i mira si tenen menjador, transport, banc de llibres o jornada contínua. Amb fitxa en PDF.
# Slug:             mapa-centres-educatius
# Keyword objetivo: mapa centres educatius Castelló
# Keywords secundarias: col·legis Castelló menjador, jornada contínua Castelló, transport escolar Castelló, banc de llibres, guia de centres docents
# Idioma / Polylang: valencià (principal). Emparellar amb /es/mapa-centros-educativos/
# Social (OG/X):    títol = Title SEO · imatge = miniatura.png (1200×630)
```

H1 de la pàgina (el posa el tema Total): **Mapa de centres educatius de la província de Castelló**

### Bloc Raw HTML

```html
<div class="cgt-mapa-centres">
<style>
.cgt-mapa-centres{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:#1b1a18;line-height:1.55}
.cgt-mapa-centres h2{font-size:1.5em;margin:1.4em 0 .5em;border-top:4px solid #111;padding-top:.5em}
.cgt-mapa-centres .cgt-intro{font-size:1.08em;max-width:780px}
.cgt-mapa-centres .cgt-xifres{display:flex;flex-wrap:wrap;gap:10px;margin:1em 0 1.4em;padding:0;list-style:none}
.cgt-mapa-centres .cgt-xifres li{border:2px solid #111;padding:8px 12px;font-size:.95em}
.cgt-mapa-centres .cgt-xifres b{display:block;font-size:1.6em;line-height:1;color:#e42127}
.cgt-mapa-centres .cgt-marc{border:4px solid #111;margin:0 0 .6em}
.cgt-mapa-centres iframe{display:block;width:100%;height:85vh;min-height:680px;border:0}
.cgt-mapa-centres .cgt-font{font-size:.85em;color:#5f5e59}
.cgt-mapa-centres details{border-bottom:1px solid #e4e2dd;padding:.7em 0}
.cgt-mapa-centres summary{font-weight:700;cursor:pointer}
.cgt-mapa-centres details p{margin:.5em 0 0}
@media (max-width:760px){.cgt-mapa-centres iframe{height:100vh;height:100svh;min-height:640px}.cgt-mapa-centres .cgt-marc{border-width:2px;margin-left:-4px;margin-right:-4px}}
</style>

<p class="cgt-intro">Busca qualsevol col·legi, institut, escoleta o centre de persones adultes de la província de Castelló i consulta en un minut si té <strong>menjador</strong>, <strong>transport escolar</strong>, <strong>banc de llibres</strong> o <strong>jornada contínua</strong>, què s'hi estudia i en quines llengües. Pots filtrar per comarca, municipi i règim, buscar els centres més pròxims a tu i descarregar la fitxa de cada centre o el llistat en PDF i CSV.</p>

<ul class="cgt-xifres">
  <li><b>459</b> centres</li>
  <li><b>291</b> públics</li>
  <li><b>203</b> amb menjador escolar autoritzat</li>
  <li><b>172</b> amb transport escolar</li>
  <li><b>247</b> amb banc de llibres</li>
  <li><b>82</b> amb jornada contínua</li>
</ul>

<div class="cgt-marc">
  <iframe src="https://cgtcastello.github.io/centres_educatius/docs/"
          title="Mapa de centres educatius de la província de Castelló"
          allow="geolocation" loading="lazy"></iframe>
</div>
<p class="cgt-font">Font: Guia de Centres Docents de la Conselleria d'Educació (Generalitat Valenciana). Dades actualitzades el 19 de novembre de 2026. Si una dada no quadra, cada fitxa enllaça amb la fitxa oficial de Conselleria.</p>

<h2>Com fer-lo servir</h2>
<ul>
  <li><strong>Busca</strong> un municipi o un centre a la caixa de dalt: et suggerix resultats mentre escrius.</li>
  <li><strong>Filtra</strong> per comarca, municipi i règim (públic, concertat o privat), i per menjador, transport, banc de llibres, jornada contínua o etapa. A «Més filtres» tens la resta de serveis, el tipus de centre i les instal·lacions.</li>
  <li><strong>A prop meu</strong> ordena els centres pels més pròxims a on estàs.</li>
  <li><strong>Obri la fitxa</strong> d'un centre per a veure'n els serveis, què s'hi estudia, l'horari i les llengües d'ensenyament, i descarrega-la en PDF.</li>
  <li>A la pestanya <strong>Taula</strong> tens el llistat dels centres filtrats, que pots descarregar en CSV (Excel) o PDF.</li>
</ul>

<h2>Preguntes freqüents</h2>
<details><summary>Com puc saber si un col·legi de Castelló té menjador?</summary>
<p>Busca el centre al mapa i obri'n la fitxa: a l'apartat «Serveis» posa si té menjador escolar autoritzat per Conselleria. També pots activar el filtre «Menjador» per a veure només els centres que en tenen. A la província hi ha 203 centres amb menjador escolar autoritzat.</p></details>
<details><summary>Quins centres tenen jornada contínua a la província de Castelló?</summary>
<p>Activa el filtre «Jornada contínua» i el mapa mostrarà només els centres amb jornada lectiva de 9 a 14 h. Segons la Guia de Centres Docents, n'hi ha 82 a la província.</p></details>
<details><summary>Quins centres tenen transport escolar?</summary>
<p>Amb el filtre «Transport» veus els centres que ofereixen transport escolar. N'hi ha 172 a la província de Castelló, sobretot a pobles i zones rurals.</p></details>
<details><summary>Com trobe el centre educatiu més pròxim a casa?</summary>
<p>Prem el botó «A prop meu» i permet la ubicació al navegador: el llistat s'ordena pels centres més pròxims i mostra la distància de cadascun.</p></details>
<details><summary>Puc descarregar la informació dels centres?</summary>
<p>Sí. Cada fitxa es descarrega en PDF, i a la pestanya «Taula» pots descarregar en CSV o PDF el llistat dels centres que hages filtrat.</p></details>
<details><summary>D'on ixen les dades del mapa?</summary>
<p>De la Guia de Centres Docents de la Conselleria d'Educació de la Generalitat Valenciana, descarregades el 19 de novembre de 2026. Cada fitxa inclou l'enllaç a la fitxa oficial del centre.</p></details>

<h2>Treballes en un centre educatiu?</h2>
<p>Si treballes en algun d'aquests centres i vols conéixer els teus drets o organitzar-te amb les teues companyes i companys, parla amb CGT Ensenyament.</p>
<p><a class="vcex-button" href="[enllaç a la pàgina de contacte o afiliació]">Contacta amb CGT Ensenyament</a></p>
</div>
```

### FAQ per al mòdul de SEOPress

1. **Com puc saber si un col·legi de Castelló té menjador?** — Busca el centre al mapa i obri'n la fitxa: a l'apartat «Serveis» posa si té menjador escolar autoritzat per Conselleria. També pots activar el filtre «Menjador» per a veure només els centres que en tenen. A la província hi ha 203 centres amb menjador escolar autoritzat.
2. **Quins centres tenen jornada contínua a la província de Castelló?** — Activa el filtre «Jornada contínua» i el mapa mostrarà només els centres amb jornada lectiva de 9 a 14 h. Segons la Guia de Centres Docents, n'hi ha 82 a la província.
3. **Quins centres tenen transport escolar?** — Amb el filtre «Transport» veus els centres que ofereixen transport escolar. N'hi ha 172 a la província de Castelló, sobretot a pobles i zones rurals.
4. **Com trobe el centre educatiu més pròxim a casa?** — Prem el botó «A prop meu» i permet la ubicació al navegador: el llistat s'ordena pels centres més pròxims i mostra la distància de cadascun.
5. **Puc descarregar la informació dels centres?** — Sí. Cada fitxa es descarrega en PDF, i a la pestanya «Taula» pots descarregar en CSV o PDF el llistat dels centres que hages filtrat.
6. **D'on ixen les dades del mapa?** — De la Guia de Centres Docents de la Conselleria d'Educació de la Generalitat Valenciana, descarregades el 19 de novembre de 2026. Cada fitxa inclou l'enllaç a la fitxa oficial del centre.

---

## Castellano

```
# METADATOS SEOPRESS
# Title SEO:        Mapa de centros educativos de Castellón | CGT
# Meta description: Busca los 459 centros educativos de Castellón y mira si tienen comedor, transporte, banco de libros o jornada continua. Con ficha en PDF.
# Slug:             mapa-centros-educativos   (queda en /es/mapa-centros-educativos/)
# Keyword objetivo: mapa centros educativos Castellón
# Keywords secundarias: colegios Castellón comedor, jornada continua Castellón, transporte escolar Castellón, banco de libros, guía de centros docentes
# Idioma / Polylang: castellano. Emparejar con /mapa-centres-educatius/ (valencià)
# Social (OG/X):    título = Title SEO · imagen = miniatura.png (1200×630)
```

H1 de la página: **Mapa de centros educativos de la provincia de Castellón**

Nota: el mapa (dentro del iframe) está en valencià; el texto de alrededor va en castellano.

### Bloque Raw HTML

```html
<div class="cgt-mapa-centres">
<style>
.cgt-mapa-centres{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:#1b1a18;line-height:1.55}
.cgt-mapa-centres h2{font-size:1.5em;margin:1.4em 0 .5em;border-top:4px solid #111;padding-top:.5em}
.cgt-mapa-centres .cgt-intro{font-size:1.08em;max-width:780px}
.cgt-mapa-centres .cgt-xifres{display:flex;flex-wrap:wrap;gap:10px;margin:1em 0 1.4em;padding:0;list-style:none}
.cgt-mapa-centres .cgt-xifres li{border:2px solid #111;padding:8px 12px;font-size:.95em}
.cgt-mapa-centres .cgt-xifres b{display:block;font-size:1.6em;line-height:1;color:#e42127}
.cgt-mapa-centres .cgt-marc{border:4px solid #111;margin:0 0 .6em}
.cgt-mapa-centres iframe{display:block;width:100%;height:85vh;min-height:680px;border:0}
.cgt-mapa-centres .cgt-font{font-size:.85em;color:#5f5e59}
.cgt-mapa-centres details{border-bottom:1px solid #e4e2dd;padding:.7em 0}
.cgt-mapa-centres summary{font-weight:700;cursor:pointer}
.cgt-mapa-centres details p{margin:.5em 0 0}
@media (max-width:760px){.cgt-mapa-centres iframe{height:100vh;height:100svh;min-height:640px}.cgt-mapa-centres .cgt-marc{border-width:2px;margin-left:-4px;margin-right:-4px}}
</style>

<p class="cgt-intro">Busca cualquier colegio, instituto, escuela infantil o centro de personas adultas de la provincia de Castellón y consulta en un minuto si tiene <strong>comedor</strong>, <strong>transporte escolar</strong>, <strong>banco de libros</strong> o <strong>jornada continua</strong>, qué se estudia y en qué lenguas. Puedes filtrar por comarca, municipio y régimen, buscar los centros más cercanos a ti y descargar la ficha de cada centro o el listado en PDF y CSV.</p>

<ul class="cgt-xifres">
  <li><b>459</b> centros</li>
  <li><b>291</b> públicos</li>
  <li><b>203</b> con comedor escolar autorizado</li>
  <li><b>172</b> con transporte escolar</li>
  <li><b>247</b> con banco de libros</li>
  <li><b>82</b> con jornada continua</li>
</ul>

<div class="cgt-marc">
  <iframe src="https://cgtcastello.github.io/centres_educatius/docs/"
          title="Mapa de centros educativos de la provincia de Castellón"
          allow="geolocation" loading="lazy"></iframe>
</div>
<p class="cgt-font">Fuente: Guía de Centros Docentes de la Conselleria de Educación (Generalitat Valenciana). Datos actualizados el 19 de noviembre de 2026. Si algún dato no cuadra, cada ficha enlaza con la ficha oficial de Conselleria.</p>

<h2>Cómo usarlo</h2>
<ul>
  <li><strong>Busca</strong> un municipio o un centro en la caja de arriba: te sugiere resultados mientras escribes.</li>
  <li><strong>Filtra</strong> por comarca, municipio y régimen (público, concertado o privado), y por comedor, transporte, banco de libros, jornada continua o etapa. En «Més filtres» tienes el resto de servicios, el tipo de centro y las instalaciones.</li>
  <li><strong>A prop meu</strong> («cerca de mí») ordena los centros por los más cercanos a donde estás.</li>
  <li><strong>Abre la ficha</strong> de un centro para ver sus servicios, qué se estudia, el horario y las lenguas de enseñanza, y descárgala en PDF.</li>
  <li>En la pestaña <strong>Taula</strong> tienes el listado de los centros filtrados, que puedes descargar en CSV (Excel) o PDF.</li>
</ul>

<h2>Preguntas frecuentes</h2>
<details><summary>¿Cómo puedo saber si un colegio de Castellón tiene comedor?</summary>
<p>Busca el centro en el mapa y abre su ficha: en el apartado «Serveis» indica si tiene comedor escolar autorizado por Conselleria. También puedes activar el filtro «Menjador» para ver solo los centros que lo tienen. En la provincia hay 203 centros con comedor escolar autorizado.</p></details>
<details><summary>¿Qué centros tienen jornada continua en la provincia de Castellón?</summary>
<p>Activa el filtro «Jornada contínua» y el mapa mostrará solo los centros con jornada lectiva de 9 a 14 h. Según la Guía de Centros Docentes, hay 82 en la provincia.</p></details>
<details><summary>¿Qué centros tienen transporte escolar?</summary>
<p>Con el filtro «Transport» ves los centros que ofrecen transporte escolar. Hay 172 en la provincia de Castellón, sobre todo en pueblos y zonas rurales.</p></details>
<details><summary>¿Cómo encuentro el centro educativo más cercano a casa?</summary>
<p>Pulsa el botón «A prop meu» y permite la ubicación en el navegador: el listado se ordena por los centros más cercanos y muestra la distancia de cada uno.</p></details>
<details><summary>¿Puedo descargar la información de los centros?</summary>
<p>Sí. Cada ficha se descarga en PDF, y en la pestaña «Taula» puedes descargar en CSV o PDF el listado de los centros que hayas filtrado.</p></details>
<details><summary>¿De dónde salen los datos del mapa?</summary>
<p>De la Guía de Centros Docentes de la Conselleria de Educación de la Generalitat Valenciana, descargados el 19 de noviembre de 2026. Cada ficha incluye el enlace a la ficha oficial del centro.</p></details>

<h2>¿Trabajas en un centro educativo?</h2>
<p>Si trabajas en alguno de estos centros y quieres conocer tus derechos u organizarte con tus compañeras y compañeros, habla con CGT Enseñanza.</p>
<p><a class="vcex-button" href="[enlace a la página de contacto o afiliación]">Contacta con CGT Enseñanza</a></p>
</div>
```

### FAQ para el módulo de SEOPress

1. **¿Cómo puedo saber si un colegio de Castellón tiene comedor?** — Busca el centro en el mapa y abre su ficha: en el apartado «Serveis» indica si tiene comedor escolar autorizado por Conselleria. También puedes activar el filtro «Menjador» para ver solo los centros que lo tienen. En la provincia hay 203 centros con comedor escolar autorizado.
2. **¿Qué centros tienen jornada continua en la provincia de Castellón?** — Activa el filtro «Jornada contínua» y el mapa mostrará solo los centros con jornada lectiva de 9 a 14 h. Según la Guía de Centros Docentes, hay 82 en la provincia.
3. **¿Qué centros tienen transporte escolar?** — Con el filtro «Transport» ves los centros que ofrecen transporte escolar. Hay 172 en la provincia de Castellón, sobre todo en pueblos y zonas rurales.
4. **¿Cómo encuentro el centro educativo más cercano a casa?** — Pulsa el botón «A prop meu» y permite la ubicación en el navegador: el listado se ordena por los centros más cercanos y muestra la distancia de cada uno.
5. **¿Puedo descargar la información de los centros?** — Sí. Cada ficha se descarga en PDF, y en la pestaña «Taula» puedes descargar en CSV o PDF el listado de los centros que hayas filtrado.
6. **¿De dónde salen los datos del mapa?** — De la Guía de Centros Docentes de la Conselleria de Educación de la Generalitat Valenciana, descargados el 19 de noviembre de 2026. Cada ficha incluye el enlace a la ficha oficial del centro.

---

## Per tancar

- Enllaços interns: posar un enllaç a aquesta pàgina des de la pàgina d'Ensenyament i des de la portada si toca; i omplir el `[enllaç a contacte/afiliació]` del botó.
- Marcar la pàgina com a **cornerstone** a SEOPress si serà la pàgina mare d'Ensenyament.
- Afegir-la al mapa de continguts (slug, keyword, estat).
