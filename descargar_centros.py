#!/usr/bin/env python3
"""
Descarga todos los centros docentes de una provincia de la Comunitat Valenciana
desde la API pública de la Guía de Centros Docentes (xacen-backend.gva.es),
con la información detallada de cada centro (comedor, transporte, banco de
libros, internado, instalaciones, idiomas, jornada, niveles, programa lingüístico...).

Uso:
    python3 descargar_centros.py                 # Castellón (12)
    python3 descargar_centros.py --provincia 46  # Valencia
    python3 descargar_centros.py --provincia 3   # Alicante
    python3 descargar_centros.py --idioma val    # datos en valencià (para la web)

Genera en ./datos/:
    centros_<prov>.csv   -> una fila por centro, columnas planas (abre en Excel)
    centros_<prov>.json  -> todo el detalle en bruto
    aularios_<prov>.csv  -> aularios de los CRA
Solo usa la librería estándar de Python.
"""
import argparse
import csv
import json
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

API = "https://xacen-backend.gva.es/xacen-backend/api/v1/"
IDIOMA = "es"
WORKERS = 4      # peticiones en paralelo (no subir mucho: es un servidor público)
PAUSA = 0.1      # segundos entre peticiones de cada hilo

# Servicios que se convierten en columnas Sí/No
SERVICIOS = [
    "Comedor", "Comedor - Ver autorización", "Transporte", "Cafetería/bar",
    "Cursos de verano", "Internado mixto", "Internado de chicos",
    "Internado de chicas", "Internado especial",
    "Adscrito al programa de banco de libros", "Fondos Sociales Europeos",
    "Centro integrado en la Red de Calidad",
    "Red de Ecoescuelas Europeas (ADEAC)",
    "Aplica el Portfolio Europeo de las Lenguas",
    "Biblioteca", "Gimnasio", "Instalaciones deportivas", "Piscina", "Pelota",
    "Huerto escolar", "Laboratorio", "Aula informática", "Aula de música",
    "Aula de idiomas", "Salón actos",
]

# "Comedor - Ver autorización" es lo que usa el filtro "Comedor = Sí" de la web
# (comedor escolar con autorización de Conselleria). "Comedor" a secas es otro
# icono que aparece sobre todo en centros privados / escoletas.
ETIQUETAS = {
    "Comedor - Ver autorización": "Comedor escolar autorizado (filtro web)",
    "Comedor": "Comedor (otro)",
}


def get(endpoint, **params):
    params.setdefault("idioma", IDIOMA)
    url = API + endpoint + "?" + urllib.parse.urlencode(params)
    for intento in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "descarga-guia-centros/1.0"})
            with urllib.request.urlopen(req, timeout=30) as r:
                body = r.read().decode("utf-8")
                return json.loads(body) if body.strip() else None
        except Exception as e:  # reintenta con espera creciente
            if intento == 3:
                print(f"  ! fallo {endpoint} {params.get('codCentro', '')}: {e}")
                return None
            time.sleep(2 ** intento)


def listar(prov):
    centros, aularios, n = {}, {}, 0
    while True:
        d = get("guiadecentros/listaCentrosAularios", codProvincia=prov, numLlamada=n)
        lote = (d or {}).get("listaCentros") or []
        if not lote:
            break
        for c in lote:
            centros[c["codCentro"]] = c
        for a in d.get("listaAularios") or []:
            aularios[(a.get("codCra"), a.get("direccionAulario"))] = a
        n += 1
    return list(centros.values()), list(aularios.values())


def detalle(cod):
    time.sleep(PAUSA)
    return {
        "generales": get("centro/datosGenerales", codCentro=cod) or {},
        "servicios": [{k: v for k, v in s.items() if k != "icono"}  # quita iconos base64
                      for s in get("simbolos/servicios", codCentro=cod) or []],
        "jornadas": get("centro/jornadas", codCentro=cod) or [],
        "info_adicional": get("centro/informacionAdicional", codCentro=cod) or [],
        "niveles": get("centro/nivelesAutorizados", codCentro=cod) or [],
        "programa_linguistico": get("centro/programaLinguistico", codCentro=cod) or [],
    }


def fila(c, det):
    g = det["generales"]
    nombres = {s.get("denominacion") for s in det["servicios"]}
    idiomas = sorted(s["denominacion"] for s in det["servicios"] if s.get("codCategoria") == "IDIOMA")
    row = {
        "codigo": c["codCentro"],
        "denominacion": g.get("denomCentro") or c.get("denomCentro"),
        "denominacion_generica": g.get("denomGenerica"),
        "regimen": g.get("regimen") or c.get("regimen"),
        "titular": g.get("titular"),
        "cif": g.get("cif"),
        "direccion": g.get("direccion") or c.get("direccion"),
        "cp": g.get("cp") or c.get("cp"),
        "localidad": g.get("localidad") or c.get("localidad"),
        "comarca": g.get("denomComarca"),
        "telefono": g.get("telefono") or c.get("telefono"),
        "fax": g.get("fax") if g.get("fax") not in (None, "0") else "",
        "email": g.get("email"),
        "web": g.get("web"),
        "latitud": g.get("latitud"),
        "longitud": g.get("longitud"),
    }
    for s in SERVICIOS:
        row[ETIQUETAS.get(s, s)] = "Sí" if s in nombres else "No"
    row["Comedor (cualquiera)"] = "Sí" if {"Comedor", "Comedor - Ver autorización"} & nombres else "No"
    row["idiomas"] = "; ".join(idiomas)
    row["jornada"] = "; ".join(det["jornadas"])
    row["info_adicional"] = "; ".join(i.get("informacion", "") for i in det["info_adicional"])
    row["niveles"] = "; ".join(
        f"{n['denomNivel']} ({n.get('unidadesActivas', 0)} ud, {n.get('puestosActivos', 0)} puestos)"
        for n in det["niveles"])
    row["unidades_activas_total"] = sum(n.get("unidadesActivas") or 0 for n in det["niveles"])
    row["puestos_activos_total"] = sum(n.get("puestosActivos") or 0 for n in det["niveles"])
    row["programa_linguistico"] = "; ".join(
        f"{p['nivel']}: {p['programa']} (VAL {p.get('porcVal')}% / CAS {p.get('porcCas')}% / ING {p.get('porcIng')}%)"
        for p in det["programa_linguistico"])
    row["ficha"] = f"https://xacen.gva.es/xacen-frontend/centro?codigoCentro={c['codCentro']}"
    return row


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provincia", default="12", help="3 Alicante, 12 Castellón, 46 Valencia")
    ap.add_argument("--limite", type=int, default=0, help="solo los N primeros (para pruebas)")
    ap.add_argument("--idioma", default="es", choices=["es", "val"],
                    help="es: castellano (CSV + JSON); val: valencià (solo JSON, lo usa la web)")
    args = ap.parse_args()
    global IDIOMA
    IDIOMA = args.idioma

    out = Path(__file__).parent / "datos"
    out.mkdir(exist_ok=True)

    print(f"Listando centros de la provincia {args.provincia}...")
    centros, aularios = listar(args.provincia)
    if args.limite:
        centros = centros[:args.limite]
    print(f"  {len(centros)} centros, {len(aularios)} aularios. Descargando detalle...")

    with ThreadPoolExecutor(WORKERS) as ex:
        detalles = []
        for i, d in enumerate(ex.map(detalle, [c["codCentro"] for c in centros]), 1):
            detalles.append(d)
            if i % 50 == 0 or i == len(centros):
                print(f"  {i}/{len(centros)}")

    filas = [fila(c, d) for c, d in zip(centros, detalles)]
    filas.sort(key=lambda r: (r["localidad"] or "", r["denominacion"] or ""))

    p = args.provincia if IDIOMA == "es" else f"{args.provincia}_val"
    if IDIOMA != "es":
        with open(out / f"centros_{p}.json", "w", encoding="utf-8") as f:
            json.dump([{"lista": c, **d} for c, d in zip(centros, detalles)], f, ensure_ascii=False, indent=1)
        print(f"Hecho: {out}/centros_{p}.json ({len(centros)} centros)")
        return
    with open(out / f"centros_{p}.csv", "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=list(filas[0].keys()), delimiter=";")
        w.writeheader()
        w.writerows(filas)
    with open(out / f"centros_{p}.json", "w", encoding="utf-8") as f:
        json.dump([{"lista": c, **d} for c, d in zip(centros, detalles)], f, ensure_ascii=False, indent=1)
    if aularios:
        with open(out / f"aularios_{p}.csv", "w", newline="", encoding="utf-8-sig") as f:
            w = csv.DictWriter(f, fieldnames=list(aularios[0].keys()), delimiter=";")
            w.writeheader()
            w.writerows(aularios)
    print(f"Hecho: {out}/centros_{p}.csv ({len(filas)} centros)")


if __name__ == "__main__":
    main()
