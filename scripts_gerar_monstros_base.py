#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera o dataset completo de monstros extraídos do Manual dos Monstros.
"""

import json
import os

def calc_mod(val):
    v = int(val)
    m = (v - 10) // 2
    return f"+{m}" if m >= 0 else str(m)

def make_attr(for_v, des_v, con_v, int_v, sab_v, car_v, saves=None):
    if saves is None:
        saves = {}
    return {
        "For": {"valor": str(for_v), "modificador": calc_mod(for_v), "salvaguarda": saves.get("For", calc_mod(for_v))},
        "Des": {"valor": str(des_v), "modificador": calc_mod(des_v), "salvaguarda": saves.get("Des", calc_mod(des_v))},
        "Con": {"valor": str(con_v), "modificador": calc_mod(con_v), "salvaguarda": saves.get("Con", calc_mod(con_v))},
        "Int": {"valor": str(int_v), "modificador": calc_mod(int_v), "salvaguarda": saves.get("Int", calc_mod(int_v))},
        "Sab": {"valor": str(sab_v), "modificador": calc_mod(sab_v), "salvaguarda": saves.get("Sab", calc_mod(sab_v))},
        "Car": {"valor": str(car_v), "modificador": calc_mod(car_v), "salvaguarda": saves.get("Car", calc_mod(car_v))},
    }

def format_monster_md(m):
    md = f"## {m['nome']}\n\n"
    md += f"*{m['tipo_tamanho']}*\n\n"
    md += f"**CA** {m['ca']}\n\n"
    md += f"**PV** {m['pv']}\n\n"
    md += f"**Deslocamento** {m['deslocamento']}\n\n"
    
    attrs = m['atributos']
    md += "|         |    | **Mod** | **SG** |         |    | **Mod** | **SG** |         |    | **Mod** | **SG** |\n"
    md += "|---------|----|---------|--------|---------|----|---------|--------|---------|----|---------|--------|\n"
    md += f"| **For** | {attrs['For']['valor']} | {attrs['For']['modificador']}      | {attrs['For']['salvaguarda']}     | **Des** | {attrs['Des']['valor']} | {attrs['Des']['modificador']}      | {attrs['Des']['salvaguarda']}     | **Con** | {attrs['Con']['valor']} | {attrs['Con']['modificador']}      | {attrs['Con']['salvaguarda']}     |\n"
    md += f"| **Int** | {attrs['Int']['valor']} | {attrs['Int']['modificador']}      | {attrs['Int']['salvaguarda']}     | **Sab** | {attrs['Sab']['valor']} | {attrs['Sab']['modificador']}      | {attrs['Sab']['salvaguarda']}     | **Car** | {attrs['Car']['valor']} | {attrs['Car']['modificador']}      | {attrs['Car']['salvaguarda']}     |\n\n"

    if m.get('testes_resistencia'):
        md += f"**Testes de Resistência** {m['testes_resistencia']}\n\n"
    if m.get('pericias'):
        md += f"**Perícias** {m['pericias']}\n\n"
    if m.get('vulnerabilidades'):
        md += f"**Vulnerabilidades a Dano** {m['vulnerabilidades']}\n\n"
    if m.get('resistencias'):
        md += f"**Resistências a Dano** {m['resistencias']}\n\n"
    if m.get('imunidades_dano'):
        md += f"**Imunidades a Dano** {m['imunidades_dano']}\n\n"
    if m.get('imunidades_condicao'):
        md += f"**Imunidades a Condição** {m['imunidades_condicao']}\n\n"
    if m.get('sentidos'):
        md += f"**Sentidos** {m['sentidos']}\n\n"
    if m.get('idiomas'):
        md += f"**Idiomas** {m['idiomas']}\n\n"
    if m.get('nd'):
        md += f"**ND** {m['nd']}\n\n"

    if m.get('tracos'):
        md += "### Traços\n\n"
        for t in m['tracos']:
            md += f"**{t['nome']}.** {t['descricao']}\n\n"

    if m.get('acoes'):
        md += "### Ações\n\n"
        for a in m['acoes']:
            md += f"**{a['nome']}.** {a['descricao']}\n\n"

    if m.get('reacoes'):
        md += "### Reações\n\n"
        for r in m['reacoes']:
            md += f"**{r['nome']}.** {r['descricao']}\n\n"

    if m.get('acoes_lendarias'):
        md += "### Ações Lendárias\n\n"
        if m.get('acoes_lendarias_desc'):
            md += f"{m['acoes_lendarias_desc']}\n\n"
        for al in m['acoes_lendarias']:
            md += f"**{al['nome']}.** {al['descricao']}\n\n"

    if m.get('acoes_covil'):
        md += "### Ações de Covil\n\n"
        if m.get('acoes_covil_desc'):
            md += f"{m['acoes_covil_desc']}\n\n"
        for ac in m['acoes_covil']:
            md += f"**{ac['nome']}.** {ac['descricao']}\n\n"

    if m.get('efeitos_regionais'):
        md += "### Efeitos Regionais\n\n"
        if m.get('efeitos_regionais_desc'):
            md += f"{m['efeitos_regionais_desc']}\n\n"
        for er in m['efeitos_regionais']:
            md += f"**{er['nome']}.** {er['descricao']}\n\n"

    if m.get('descricao_lore'):
        md += f"### Descrição e Lore\n\n{m['descricao_lore']}\n"

    return md.strip()

print("Gerador carregado com sucesso.")
