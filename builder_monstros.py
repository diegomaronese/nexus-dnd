#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json, os

def make_attr(for_v, des_v, con_v, int_v, sab_v, car_v, saves=None):
    if saves is None: saves = {}
    def mod(v):
        m = (v - 10) // 2
        return f"+{m}" if m >= 0 else str(m)
    return {
        "For": {"valor": str(for_v), "modificador": mod(for_v), "salvaguarda": saves.get("For", mod(for_v))},
        "Des": {"valor": str(des_v), "modificador": mod(des_v), "salvaguarda": saves.get("Des", mod(des_v))},
        "Con": {"valor": str(con_v), "modificador": mod(con_v), "salvaguarda": saves.get("Con", mod(con_v))},
        "Int": {"valor": str(int_v), "modificador": mod(int_v), "salvaguarda": saves.get("Int", mod(int_v))},
        "Sab": {"valor": str(sab_v), "modificador": mod(sab_v), "salvaguarda": saves.get("Sab", mod(sab_v))},
        "Car": {"valor": str(car_v), "modificador": mod(car_v), "salvaguarda": saves.get("Car", mod(car_v))},
    }

def format_md(m):
    md = f"## {m['nome']}\n\n*{m['tipo_tamanho']}*\n\n**CA** {m['ca']}\n\n**PV** {m['pv']}\n\n**Deslocamento** {m['deslocamento']}\n\n"
    a = m['atributos']
    md += "|         |    | **Mod** | **SG** |         |    | **Mod** | **SG** |         |    | **Mod** | **SG** |\n|---------|----|---------|--------|---------|----|---------|--------|---------|----|---------|--------|\n"
    md += f"| **For** | {a['For']['valor']} | {a['For']['modificador']} | {a['For']['salvaguarda']} | **Des** | {a['Des']['valor']} | {a['Des']['modificador']} | {a['Des']['salvaguarda']} | **Con** | {a['Con']['valor']} | {a['Con']['modificador']} | {a['Con']['salvaguarda']} |\n"
    md += f"| **Int** | {a['Int']['valor']} | {a['Int']['modificador']} | {a['Int']['salvaguarda']} | **Sab** | {a['Sab']['valor']} | {a['Sab']['modificador']} | {a['Sab']['salvaguarda']} | **Car** | {a['Car']['valor']} | {a['Car']['modificador']} | {a['Car']['salvaguarda']} |\n\n"
    if m.get('testes_resistencia'): md += f"**Testes de Resistência** {m['testes_resistencia']}\n\n"
    if m.get('pericias'): md += f"**Perícias** {m['pericias']}\n\n"
    if m.get('vulnerabilidades'): md += f"**Vulnerabilidades** {m['vulnerabilidades']}\n\n"
    if m.get('resistencias'): md += f"**Resistências** {m['resistencias']}\n\n"
    if m.get('imunidades_dano'): md += f"**Imunidades a Dano** {m['imunidades_dano']}\n\n"
    if m.get('imunidades_condicao'): md += f"**Imunidades a Condição** {m['imunidades_condicao']}\n\n"
    if m.get('sentidos'): md += f"**Sentidos** {m['sentidos']}\n\n"
    if m.get('idiomas'): md += f"**Idiomas** {m['idiomas']}\n\n"
    if m.get('nd'): md += f"**ND** {m['nd']}\n\n"
    if m.get('tracos'):
        md += "### Traços\n\n" + "\n\n".join(f"**{t['nome']}.** {t['descricao']}" for t in m['tracos']) + "\n\n"
    if m.get('acoes'):
        md += "### Ações\n\n" + "\n\n".join(f"**{a['nome']}.** {a['descricao']}" for a in m['acoes']) + "\n\n"
    if m.get('reacoes'):
        md += "### Reações\n\n" + "\n\n".join(f"**{r['nome']}.** {r['descricao']}" for r in m['reacoes']) + "\n\n"
    if m.get('acoes_lendarias'):
        md += "### Ações Lendárias\n\n" + "\n\n".join(f"**{al['nome']}.** {al['descricao']}" for al in m['acoes_lendarias']) + "\n\n"
    if m.get('acoes_covil'):
        md += "### Ações de Covil\n\n" + "\n\n".join(f"**{ac['nome']}.** {ac['descricao']}" for ac in m['acoes_covil']) + "\n\n"
    if m.get('efeitos_regionais'):
        md += "### Efeitos Regionais\n\n" + "\n\n".join(f"**{er['nome']}.** {er['descricao']}" for er in m['efeitos_regionais']) + "\n\n"
    if m.get('descricao_lore'):
        md += f"### Descrição e Lore\n\n{m['descricao_lore']}\n"
    return md.strip()

print("Helper ok.")
