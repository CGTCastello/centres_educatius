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

### Comedor

- **Comedor escolar autorizado (filtro web)**: coincide con el filtro "Comedor = Sí" de la web.
- **Comedor (otro)**: icono genérico de comedor, sobre todo en centros privados y escoletas.
- **Comedor (cualquiera)**: cualquiera de los dos.
