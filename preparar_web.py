#!/usr/bin/env python3
"""
Convierte datos/centros_<prov>_val.json (descargado con
`python3 descargar_centros.py --idioma val`) en docs/data/centres.json,
el archivo compacto que usa la web del mapa.

    python3 preparar_web.py            # Castellón (12)
"""
import argparse
import json
import re
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).parent

# Tipo de centro a partir de la denominación genérica (orden importa)
TIPUS = [
    ("CRA", r"RURAL AGRUPA"),
    ("Educació especial", r"EDUCACI[ÓO]N? ESPECIAL"),
    ("Persones adultes", r"ADULT|PERSONES|PERSONAS"),
    ("Formació professional", r"FORMACI[ÓO]N? PROFESSIONAL|FORMACI[ÓO]N PROFESIONAL|INTEGRAT P[ÚU]BLIC"),
    ("Música, dansa i arts", r"CONSERVATORI|M[ÚU]SICA|DANSA|DANZA|ART[ÍI]STI|ARTS|DISSENY|CER[ÀA]MICA"),
    ("Ensenyances esportives", r"ESPORTI|DEPORTIV"),
    ("Escola oficial d'idiomes", r"IDIOMES|IDIOMAS"),
    ("Col·legi privat o concertat", r"^(CENTRE PRIVAT|CENTRO PRIVADO|CENTRE DOCENT PRIVAT).*(PRIM[ÀA]RIA|SECUND[ÀA]RIA|ESTRANGER)"),
    ("Institut (IES/SES)", r"^(INSTITUT|SECCI[ÓO]N?|INSTITUTO)"),
    ("Escola infantil", r"^(ESCOLA|ESCUELA) INFANTIL|INFANTIL DE PRIMER|^CENTRE PRIVAT D'EDUCACI[ÓO] INFANTIL( DE|$| [A-Z])|^CENTRO PRIVADO DE EDUCACI[ÓO]N INFANTIL( DE|$| [A-Z])"),
    ("CEIP", r"^(COL·LEGI|COLEGIO) D?E? ?(D')?EDUCACI[ÓO]N? INFANTIL"),
    ("Col·legi privat o concertat", r"PRIVAT|PRIVADO"),
]

# Agrupación de los niveles autorizados para el filtro "Ensenyament"
ETAPES = [
    ("Infantil 0-3", r"INFANTIL PRIMER CICLE|ESCOLES LLAR"),
    ("Infantil 3-6", r"INFANTIL SEGON CICLE"),
    ("Primària", r"PRIM[ÀA]RIA"),
    ("ESO", r"SECUND[ÀA]RIA OBLIGAT"),
    ("Batxillerat", r"BATXILLERAT"),
    ("Formació professional", r"CICLES FORMATIUS(?! D'ARTS)|M[ÒO]DULS|FORMACI[ÓO] PROFESSIONAL"),
    ("Educació especial", r"EDUCACI[ÓO] ESPECIAL"),
    ("Persones adultes", r"ADULTS"),
    ("Música i dansa", r"M[ÚU]SICA|DANSA"),
    ("Arts i disseny", r"ARTS|DISSENY|ART[ÍI]STIQUES"),
    ("Ensenyances esportives", r"ESPORTIVES"),
    ("Idiomes", r"^IDIOMES"),
]

INTERNAT = {"Internat mixt", "Internat de nois", "Internat de noies", "Internat especial"}
OCULTS = {"Inform.administrativa", "Pla situació", "Correu electrònic", "Pàgina Internet",
          "Plans arquitectura", "Prog.europeus"}


def classifica(text, regles, multi=False):
    text = (text or "").upper()
    trobats = [nom for nom, rx in regles if re.search(rx, text)]
    if multi:
        return trobats
    return trobats[0] if trobats else "Altres"


def neteja(v):
    v = (v or "").strip() if isinstance(v, str) else v
    return v if v not in ("", "0", None) else None


def centre(raw):
    g, ll = raw["generales"], raw["lista"]
    serv = [s for s in raw["servicios"] if s.get("denominacion") not in OCULTS]
    noms = {s["denominacion"] for s in serv}
    per_cat = lambda cat: sorted({s["denominacion"] for s in serv if s.get("codCategoria") == cat})

    serveis = per_cat("SERV_COMPLEM")
    serveis = ["Menjador escolar autoritzat" if s == "Menjador - Veure autorització" else s for s in serveis]
    programes = sorted(set(per_cat("OTRA_INFO")) | {i["informacion"] for i in raw["info_adicional"] if i.get("informacion")})

    nivells = [[n["denomNivel"].capitalize(), n.get("unidadesActivas") or 0, n.get("puestosActivos") or 0]
               for n in raw["niveles"]]
    etapes = sorted({e for n in raw["niveles"] for e in classifica(n["denomNivel"], ETAPES, multi=True)},
                    key=[e for e, _ in ETAPES].index)

    flags = {
        "menjador_aut": "Menjador - Veure autorització" in noms,
        "menjador": bool({"Menjador", "Menjador - Veure autorització"} & noms),
        "transport": "Transport" in noms,
        "banc_llibres": any("banc de llibres" in p for p in programes),
        "internat": bool(INTERNAT & noms),
        "cafeteria": "Cafeteria/bar" in noms,
        "cursos_estiu": "Cursos d'estiu" in noms,
        "aula_2anys": "Té aula de dos anys" in programes,
        "jornada_continua": any("9 a 14" in j for j in raw["jornadas"]),
        "aula_cil": any("(CIL)" in p for p in programes),
        "fse": "Fons Socials Europeus" in programes,
    }

    lat, lng = neteja(g.get("latitud")), neteja(g.get("longitud"))
    return {
        "codi": ll["codCentro"],
        "nom": g.get("denomCentro") or ll.get("denomCentro"),
        "generica": g.get("denomGenerica"),
        "regim": g.get("regimen") or ll.get("regimen"),
        "tipus": classifica(g.get("denomGenerica"), TIPUS),
        "titular": neteja(g.get("titular")),
        "cif": neteja(g.get("cif")),
        "adreca": (g.get("direccion") or ll.get("direccion") or "").strip(" ,"),
        "cp": g.get("cp") or ll.get("cp"),
        "municipi": g.get("localidad") or ll.get("localidad"),
        "comarca": g.get("denomComarca"),
        "telefon": neteja(g.get("telefono")),
        "fax": neteja(g.get("fax")),
        "correu": neteja(g.get("email")),
        "web": neteja(g.get("web")),
        "lat": float(lat) if lat else None,
        "lng": float(lng) if lng else None,
        "serveis": serveis,
        "programes": programes,
        "installacions": per_cat("INSTALACION"),
        "idiomes": per_cat("IDIOMA"),
        "jornada": raw["jornadas"],
        "nivells": nivells,
        "etapes": etapes,
        "unitats": sum(n[1] for n in nivells),
        "llocs": sum(n[2] for n in nivells),
        "linguistic": [[p["nivel"], p["programa"], p.get("porcVal"), p.get("porcCas"), p.get("porcIng")]
                       for p in raw["programa_linguistico"]],
        "f": flags,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provincia", default="12")
    args = ap.parse_args()
    raw = json.loads((RAIZ / "datos" / f"centros_{args.provincia}_val.json").read_text(encoding="utf-8"))
    centres = sorted((centre(r) for r in raw), key=lambda c: (c["municipi"] or "", c["nom"] or ""))
    out = RAIZ / "docs" / "data"
    out.mkdir(parents=True, exist_ok=True)
    data = {"actualitzat": date.today().isoformat(), "font": "Guia de Centres Docents · Conselleria d'Educació (GVA)",
            "centres": centres}
    (out / "centres.json").write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    from collections import Counter
    print(len(centres), "centres ->", out / "centres.json")
    print(Counter(c["tipus"] for c in centres).most_common())
    print(Counter(e for c in centres for e in c["etapes"]).most_common())
    print("sense coordenades:", sum(1 for c in centres if c["lat"] is None))


if __name__ == "__main__":
    main()
