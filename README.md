# Centres educatius

Descarga de todos los centros docentes de una provincia de la Comunitat Valenciana
desde la API pública de la [Guía de Centros Docentes](https://ceice.gva.es/es/web/centros-docentes/guia-de-centros-docentes)
(`xacen-backend.gva.es`), con la ficha completa de cada centro: comedor, transporte,
banco de libros, internado, instalaciones, idiomas, jornada, niveles y programa lingüístico.

## Uso

```bash
python3 descargar_centros.py                 # Castellón (12)
python3 descargar_centros.py --provincia 46  # Valencia
python3 descargar_centros.py --provincia 3   # Alicante
```

Solo necesita Python 3 (librería estándar). Tarda unos 2 minutos por provincia.

## Datos (`datos/`)

- `centros_<prov>.csv`: una fila por centro, separado por `;`, abre en Excel.
- `centros_<prov>.json`: todo el detalle en bruto.
- `aularios_<prov>.csv`: aularios de los CRA.
- `centros_<prov>_val.json`: el detalle en valencià (lo usa la web).

### Comedor

- **Comedor escolar autorizado (filtro web)**: coincide con el filtro "Comedor = Sí" de la web.
- **Comedor (otro)**: icono genérico de comedor, sobre todo en centros privados y escoletas.
- **Comedor (cualquiera)**: cualquiera de los dos.

## Web del mapa (`docs/`)

Página en valencià con el estilo de CGT Castelló, pensada para ir dentro de un
`iframe` en cgtcastello.org (sin cabecera propia):

- **Buscador** con sugerencias de municipios y centros, y botón **«A prop meu»**
  para ordenar por distancia.
- **Filtros rápidos** (menjador, transport, banc de llibres, jornada contínua,
  només públics, etapa) y panel **«Més filtres»** (comarca, municipi, règim,
  todos los servicios, tipus de centre, instal·lacions). Los filtros activos se
  ven como etiquetas que se pueden quitar.
- **Mapa** con los centros (rojo público, negro concertado, blanco privado) y
  **fitxa** de cada centro: cómo llegar, llamar, web, servicios, qué se estudia,
  horario, lenguas de enseñanza, etc. Descargable en **PDF**.
- **Taula** con los centros filtrados, columnas a elegir, exportable a **CSV** y **PDF**.
- Enlace directo a un centro: `…/#centre=12000091`.

### Actualizar los datos

```bash
python3 descargar_centros.py --idioma val
python3 preparar_web.py
```

### Probar en local

```bash
python3 -m http.server 8791 --directory docs
```

### Publicar e integrar

GitHub Pages publica la rama `main` desde la raíz, así que la web queda en
`https://cgtcastello.github.io/centres_educatius/docs/`. Para integrarla en WordPress:

```html
<iframe src="https://cgtcastello.github.io/centres_educatius/docs/"
        title="Mapa de centres educatius de Castelló"
        allow="geolocation"
        style="width:100%;height:85vh;min-height:640px;border:0" loading="lazy"></iframe>
```

`allow="geolocation"` hace falta para que funcione el botón «A prop meu» dentro del iframe.

Tipografías Anton y Open Sans (licencia OFL) incluidas en `docs/assets/fonts/` para los PDF.
Mapa base © OpenStreetMap.
