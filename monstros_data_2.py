#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from builder_monstros import make_attr

def get_demonios_e_diabos():
    L = []
    
    # Balor
    L.append({
        "nome": "Balor", "tipo_tamanho": "Corruptor Enorme (demônio), caótico e mau",
        "ca": "19 (armadura natural)", "pv": "262 (21d12 + 126)", "deslocamento": "12 m, voo 24 m",
        "atributos": make_attr(26, 15, 22, 20, 16, 22, {"For": "+14", "Con": "+12", "Sab": "+9", "Car": "+12"}),
        "testes_resistencia": "For +14, Con +12, Sab +9, Car +12",
        "resistencias": "Elétrico, frio; concussão, cortante e perfurante de ataques não-mágicos",
        "imunidades_dano": "Fogo, Veneno", "imunidades_condicao": "Envenenado",
        "sentidos": "Visão verdadeira 36 m, Percepção passiva 13", "idiomas": "Abissal, telepatia 36 m", "nd": "19 (XP 22.000)",
        "tracos": [
            {"nome": "Armas Mágicas", "descricao": "Os ataques com armas do balor são mágicos."},
            {"nome": "Aura Flamejante", "descricao": "Criaturas a até 1,5 m ou que o toquem sofrem 10 (3d6) de dano de fogo."},
            {"nome": "Espasmos de Morte", "descricao": "Ao morrer, explode causando 70 (20d6) fogo a até 9 m (CD 20 metade) e destrói suas armas."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem em salvaguardas contra magias."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza dois ataques: um com espada longa e um com chicote."},
            {"nome": "Espada Longa", "descricao": "*Corpo-a-Corpo:* +14 para atingir, alcance 3 m. *Acerto:* 21 (3d8 + 8) cortante + 13 (3d8) elétrico (crítico triplica dados de dano)."},
            {"nome": "Chicote", "descricao": "*Corpo-a-Corpo:* +14 para atingir, alcance 6 m. *Acerto:* 15 (2d6 + 8) cortante + 10 (3d6) fogo; Força CD 20 ou é puxado 4,5 m."},
            {"nome": "Teletransporte", "descricao": "Teletransporta-se magicamente até 36 metros para local visível."}
        ],
        "descricao_lore": "Generais supremos das hordas demoníacas do Abismo que empunham chicotes de fogo e lâminas elétricas."
    })

    # Barlgura
    L.append({
        "nome": "Barlgura", "tipo_tamanho": "Corruptor Grande (demônio), caótico e mau",
        "ca": "15 (armadura natural)", "pv": "68 (8d10 + 24)", "deslocamento": "12 m, escalada 12 m",
        "atributos": make_attr(18, 15, 16, 7, 14, 9, {"Des": "+5", "Con": "+6"}),
        "testes_resistencia": "Des +5, Con +6", "pericias": "Furtividade +5, Percepção +5",
        "resistencias": "Elétrico, fogo, frio", "imunidades_dano": "Veneno", "imunidades_condicao": "Envenenado",
        "sentidos": "Percepção às cegas 9 m, visão no escuro 36 m, Percepção passiva 15", "idiomas": "Abissal, telepatia 36 m", "nd": "5 (XP 1.800)",
        "tracos": [
            {"nome": "Conjuração Inata", "descricao": "Sabedoria (CD 13). 1/dia: constrição, força fantasmagórica; 2/dia: disfarçar-se, invisibilidade (pessoal)."},
            {"nome": "Descuidado", "descricao": "Pode obter vantagem nos ataques do turno, mas ataques contra ele recebem vantagem."},
            {"nome": "Salto em Corrida", "descricao": "Salto em distância de até 12 m e altura de até 6 m com corrida."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza uma mordida e dois punhos."},
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +7 para atingir, alcance 1,5 m. *Acerto:* 11 (2d6 + 4) perfurante."},
            {"nome": "Punho", "descricao": "*Corpo-a-Corpo:* +7 para atingir, alcance 1,5 m. *Acerto:* 9 (1d10 + 4) concussão."}
        ],
        "descricao_lore": "Demônio simiesco brutal de grande agilidade e força que caça em bandos nos terrenos abissais."
    })

    # Chasme
    L.append({
        "nome": "Chasme", "tipo_tamanho": "Corruptor Grande (demônio), caótico e mau",
        "ca": "15 (armadura natural)", "pv": "84 (13d10 + 13)", "deslocamento": "6 m, voo 18 m",
        "atributos": make_attr(15, 15, 12, 11, 14, 10, {"Des": "+5", "Sab": "+5"}),
        "testes_resistencia": "Des +5, Sab +5", "pericias": "Percepção +5",
        "resistencias": "Elétrico, fogo, frio", "imunidades_dano": "Veneno", "imunidades_condicao": "Envenenado",
        "sentidos": "Percepção às cegas 3 m, visão no escuro 36 m, Percepção passiva 15", "idiomas": "Abissal, telepatia 36 m", "nd": "6 (XP 2.300)",
        "tracos": [
            {"nome": "Escalada Aracnídea", "descricao": "Escala superfícies e tetos sem teste."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem contra magias."},
            {"nome": "Zumbido", "descricao": "Criaturas a até 9 m que ouçam passam em Con CD 12 ou caem inconscientes por 10 min."}
        ],
        "acoes": [
            {"nome": "Picada", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 1,5 m. *Acerto:* 16 (4d6 + 2) perfurante + 24 (7d6) necrótico; reduz o PV máximo no mesmo valor (se chegar a 0, morre)."}
        ],
        "descricao_lore": "Demônio insetóide alado assemelhado a um mosquito gigante que serve como capataz e torturador no Abismo."
    })

    # Dretch
    L.append({
        "nome": "Dretch", "tipo_tamanho": "Corruptor Pequeno (demônio), caótico e mau",
        "ca": "11 (armadura natural)", "pv": "18 (4d6 + 4)", "deslocamento": "6 m",
        "atributos": make_attr(11, 11, 12, 5, 8, 3),
        "resistencias": "Elétrico, fogo, frio", "imunidades_dano": "Veneno", "imunidades_condicao": "Envenenado",
        "sentidos": "Visão no escuro 36 m, Percepção passiva 9", "idiomas": "Abissal, telepatia 36 m", "nd": "1/4 (XP 50)",
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza uma mordida e um ataque de garras."},
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +2 para atingir, alcance 1,5 m. *Acerto:* 3 (1d6) perfurante."},
            {"nome": "Garras", "descricao": "*Corpo-a-Corpo:* +2 para atingir, alcance 1,5 m. *Acerto:* 5 (2d4) cortante."},
            {"nome": "Nuvem Fétida (1/Dia)", "descricao": "Gás em raio de 3 m; Con CD 11 ou envenenado (apenas 1 ação ou bônus, sem reações)."}
        ],
        "descricao_lore": "Os demônios menores mais fracos e desprezíveis, usados como bucha de canhão nas guerras abissais."
    })

    # Glabrezu
    L.append({
        "nome": "Glabrezu", "tipo_tamanho": "Corruptor Grande (demônio), caótico e mau",
        "ca": "17 (armadura natural)", "pv": "157 (15d10 + 75)", "deslocamento": "12 m",
        "atributos": make_attr(20, 15, 21, 19, 17, 16, {"For": "+9", "Con": "+9", "Sab": "+7", "Car": "+7"}),
        "testes_resistencia": "For +9, Con +9, Sab +7, Car +7",
        "resistencias": "Elétrico, fogo, frio; concussão, cortante e perfurante de não-mágicos",
        "imunidades_dano": "Veneno", "imunidades_condicao": "Envenenado",
        "sentidos": "Visão verdadeira 36 m, Percepção passiva 13", "idiomas": "Abissal, telepatia 36 m", "nd": "9 (XP 5.000)",
        "tracos": [
            {"nome": "Conjuração Inata", "descricao": "Inteligência (CD 16). À vontade: detectar magia, dissipar magia, escuridão; 1/dia: confusão, palavra de poder atordoar, voo."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem contra magias."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza dois ataques com pinças e dois com punhos (ou duas pinças e uma magia)."},
            {"nome": "Pinça", "descricao": "*Corpo-a-Corpo:* +9 para atingir, alcance 3 m. *Acerto:* 16 (2d10 + 5) concussão. Alvo Médio ou menor fica agarrado (CD 15)."},
            {"nome": "Punhos", "descricao": "*Corpo-a-Corpo:* +9 para atingir, alcance 1,5 m. *Acerto:* 16 (2d4 + 2) concussão."}
        ],
        "descricao_lore": "Demônio de quatro braços e pinças colossais que tenta mortais com promessas de poder para levá-los à ruína."
    })

    # Goristro
    L.append({
        "nome": "Goristro", "tipo_tamanho": "Corruptor Enorme (demônio), caótico e mau",
        "ca": "19 (armadura natural)", "pv": "310 (23d12 + 161)", "deslocamento": "12 m",
        "atributos": make_attr(25, 11, 25, 6, 13, 14, {"For": "+13", "Des": "+6", "Con": "+13", "Sab": "+7"}),
        "testes_resistencia": "For +13, Des +6, Con +13, Sab +7",
        "resistencias": "Elétrico, fogo, frio; concussão, cortante e perfurante de não-mágicos",
        "imunidades_dano": "Veneno", "imunidades_condicao": "Envenenado",
        "sentidos": "Visão no escuro 36 m, Percepção passiva 17", "idiomas": "Abissal", "nd": "17 (XP 18.000)",
        "tracos": [
            {"nome": "Lembrança Labiríntica", "descricao": "Lembra perfeitamente de qualquer caminho percorrido."},
            {"nome": "Monstro de Cerco", "descricao": "Causa o dobro de dano a estruturas e objetos."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem contra magias."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Dois punhos e um casco."},
            {"nome": "Punho", "descricao": "*Corpo-a-Corpo:* +13 para atingir, alcance 3 m. *Acerto:* 20 (3d8 + 7) concussão."},
            {"nome": "Casco", "descricao": "*Corpo-a-Corpo:* +13 para atingir, alcance 1,5 m. *Acerto:* 23 (3d10 + 7) concussão. Força CD 21 ou cai no chão."},
            {"nome": "Chifres", "descricao": "*Corpo-a-Corpo:* +13 para atingir, alcance 3 m. *Acerto:* 45 (7d10 + 7) perfurante."},
            {"nome": "Investida", "descricao": "Se mover pelo menos 4,5 m em linha reta e acertar chifrada, causa 38 (7d10) extra e Força CD 21 ou empurrado 6 m e cai."}
        ],
        "descricao_lore": "Colossal minotauro abissal de seis metros de altura usado como aríete vivo e máquina de cerco por lordes demônios."
    })

    # Hezrou
    L.append({
        "nome": "Hezrou", "tipo_tamanho": "Corruptor Grande (demônio), caótico e mau",
        "ca": "16 (armadura natural)", "pv": "136 (13d10 + 65)", "deslocamento": "9 m",
        "atributos": make_attr(19, 17, 20, 5, 12, 13, {"For": "+7", "Con": "+8", "Sab": "+4"}),
        "testes_resistencia": "For +7, Con +8, Sab +4",
        "resistencias": "Elétrico, fogo, frio; concussão, cortante e perfurante de não-mágicos",
        "imunidades_dano": "Veneno", "imunidades_condicao": "Envenenado",
        "sentidos": "Visão no escuro 36 m, Percepção passiva 11", "idiomas": "Abissal, telepatia 36 m", "nd": "8 (XP 3.900)",
        "tracos": [
            {"nome": "Fedor", "descricao": "Criaturas a até 3 m passam em Con CD 14 ou ficam envenenadas por 1 rodada."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem em testes de resistência contra magias."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Uma mordida e duas garras."},
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +7 para atingir, alcance 1,5 m. *Acerto:* 15 (2d10 + 4) perfurante."},
            {"nome": "Garras", "descricao": "*Corpo-a-Corpo:* +7 para atingir, alcance 1,5 m. *Acerto:* 11 (2d6 + 4) cortante."}
        ],
        "descricao_lore": "Soldados de choque reptilianos e grotescos do Abismo conhecidos pelo fedor nauseante que emitem."
    })

    # Marilith
    L.append({
        "nome": "Marilith", "tipo_tamanho": "Corruptor Grande (demônio), caótico e mau",
        "ca": "18 (armadura natural)", "pv": "189 (18d10 + 90)", "deslocamento": "12 m",
        "atributos": make_attr(18, 20, 20, 18, 16, 20, {"For": "+9", "Con": "+10", "Sab": "+8", "Car": "+10"}),
        "testes_resistencia": "For +9, Con +10, Sab +8, Car +10",
        "resistencias": "Elétrico, fogo, frio; concussão, cortante e perfurante de não-mágicos",
        "imunidades_dano": "Veneno", "imunidades_condicao": "Envenenado",
        "sentidos": "Visão verdadeira 36 m, Percepção passiva 13", "idiomas": "Abissal, telepatia 36 m", "nd": "16 (XP 15.000)",
        "tracos": [
            {"nome": "Armas Mágicas", "descricao": "Ataques armados são mágicos."},
            {"nome": "Reativa", "descricao": "Pode realizar uma reação em CADA turno no combate."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem contra magias."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza sete ataques: seis com espadas longas e um com sua cauda."},
            {"nome": "Espada Longa", "descricao": "*Corpo-a-Corpo:* +9 para atingir, alcance 1,5 m. *Acerto:* 13 (2d8 + 4) cortante."},
            {"nome": "Cauda", "descricao": "*Corpo-a-Corpo:* +9 para atingir, alcance 3 m. *Acerto:* 15 (2d10 + 4) concussão. Alvo Médio ou menor fica agarrado e contido (CD 19)."},
            {"nome": "Teletransporte", "descricao": "Teletransporta-se magicamente até 36 m."}
        ],
        "reacoes": [{"nome": "Aparar", "descricao": "Adiciona +5 à CA contra um ataque corpo-a-corpo."}],
        "descricao_lore": "Capitãs demoníacas serpentinas de seis braços que empunham espadas em combate devastador."
    })

    # Nalfeshnee
    L.append({
        "nome": "Nalfeshnee", "tipo_tamanho": "Corruptor Grande (demônio), caótico e mau",
        "ca": "18 (armadura natural)", "pv": "185 (16d10 + 96)", "deslocamento": "6 m, voo 9 m",
        "atributos": make_attr(21, 10, 22, 19, 12, 15, {"Con": "+11", "Int": "+9", "Sab": "+6", "Car": "+7"}),
        "testes_resistencia": "Con +11, Int +9, Sab +6, Car +7",
        "resistencias": "Elétrico, fogo, frio; concussão, cortante e perfurante de não-mágicos",
        "imunidades_dano": "Veneno", "imunidades_condicao": "Envenenado",
        "sentidos": "Visão verdadeira 36 m, Percepção passiva 11", "idiomas": "Abissal, telepatia 36 m", "nd": "13 (XP 10.000)",
        "tracos": [{"nome": "Resistência à Magia", "descricao": "Vantagem em salvaguardas contra magias."}],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Usa Nimbo de Pavor e realiza uma mordida e duas garras."},
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +10 para atingir, alcance 1,5 m. *Acerto:* 32 (5d10 + 5) perfurante."},
            {"nome": "Garra", "descricao": "*Corpo-a-Corpo:* +10 para atingir, alcance 3 m. *Acerto:* 15 (3d6 + 5) cortante."},
            {"nome": "Nimbo de Pavor (Recarrega 5–6)", "descricao": "Luz multicolorida a até 4,5 m: Sab CD 15 ou fica amedrontado por 1 min."},
            {"nome": "Teletransporte", "descricao": "Teletransporta-se magicamente até 36 m."}
        ],
        "descricao_lore": "Grotesco demônio híbrido de gorila e javali com asas plumadas e inteligência perversa."
    })

    # Diabo Barbado
    L.append({
        "nome": "Diabo Barbado", "tipo_tamanho": "Corruptor Médio (diabo), leal e mau",
        "ca": "13 (armadura natural)", "pv": "52 (8d8 + 16)", "deslocamento": "9 m",
        "atributos": make_attr(16, 15, 15, 9, 11, 11, {"For": "+5", "Con": "+4", "Sab": "+2"}),
        "testes_resistencia": "For +5, Con +4, Sab +2",
        "resistencias": "Frio; concussão, cortante e perfurante de não-mágicos sem prata",
        "imunidades_dano": "Fogo, Veneno", "imunidades_condicao": "Envenenado",
        "sentidos": "Visão no escuro 36 m, Percepção passiva 10", "idiomas": "Infernal, telepatia 36 m", "nd": "3 (XP 700)",
        "tracos": [
            {"nome": "Resistência à Magia", "descricao": "Vantagem contra magias."},
            {"nome": "Resolução", "descricao": "Não pode ser amedrontado com aliado a até 9 m."},
            {"nome": "Visão Diabólica", "descricao": "Escuridão mágica não impede sua visão no escuro."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Um ataque com sua barba e um com sua glaive."},
            {"nome": "Barba", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 1,5 m. *Acerto:* 6 (1d8 + 2) perfurante. Con CD 12 ou envenenado (sem recuperar PV)."},
            {"nome": "Glaive", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 3 m. *Acerto:* 9 (1d10 + 3) cortante. Con CD 12 ou perde 5 (1d10) PV por turno até estancado."}
        ],
        "descricao_lore": "Soldados de choque infernais disciplinados que empunham glaives denteadas nas legiões de Baator."
    })

    # Diabrete
    L.append({
        "nome": "Diabrete", "tipo_tamanho": "Corruptor Miúdo (diabo, metamorfo), leal e mau",
        "ca": "13", "pv": "10 (3d4 + 3)", "deslocamento": "6 m, voo 12 m",
        "atributos": make_attr(6, 17, 13, 11, 12, 14),
        "pericias": "Enganação +4, Furtividade +5, Intuição +3, Persuasão +4",
        "resistencias": "Frio; concussão, cortante e perfurante de não-mágicos sem prata",
        "imunidades_dano": "Fogo, Veneno",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 11", "idiomas": "Infernal, Comum", "nd": "1 (XP 200)",
        "tracos": [
            {"nome": "Metamorfo", "descricao": "Metamorfoseia-se em rato, corvo ou aranha, ou de volta à sua forma."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem contra magias."},
            {"nome": "Visão de Diabo", "descricao": "Escuridão mágica não impede sua visão."}
        ],
        "acoes": [
            {"nome": "Ferrão", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 1,5 m. *Acerto:* 5 (1d4 + 3) perfurante + Con CD 11 ou 10 (3d6) veneno (metade no sucesso)."},
            {"nome": "Invisibilidade", "descricao": "Fica invisível magicamente até atacar ou perder concentração."}
        ],
        "descricao_lore": "Pequeno corruptor alado manipulador que atua como espião infernal e familiar bajulador."
    })

    # Senhor das Profundezas (Pit Fiend)
    L.append({
        "nome": "Senhor das Profundezas", "tipo_tamanho": "Corruptor Grande (diabo), leal e mau",
        "ca": "19 (armadura natural)", "pv": "300 (24d10 + 168)", "deslocamento": "9 m, voo 18 m",
        "atributos": make_attr(26, 14, 24, 22, 18, 24, {"Des": "+8", "Con": "+13", "Sab": "+10"}),
        "testes_resistencia": "Des +8, Con +13, Sab +10",
        "resistencias": "Frio; concussão, cortante e perfurante de não-mágicos sem prata",
        "imunidades_dano": "Fogo, Veneno", "imunidades_condicao": "Envenenado",
        "sentidos": "Visão verdadeira 36 m, Percepção passiva 14", "idiomas": "Infernal, telepatia 36 m", "nd": "20 (XP 25.000)",
        "tracos": [
            {"nome": "Arma Mágica", "descricao": "Ataques armados são mágicos."},
            {"nome": "Aura de Medo", "descricao": "Criatura hostil a até 6 m passa em Sab CD 21 ou fica amedrontada por 1 rodada."},
            {"nome": "Conjuração Inata", "descricao": "Carisma (CD 21). À vontade: bola de fogo, detectar magia; 3/dia: imobilizar monstro, muralha de fogo."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem contra magias."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza quatro ataques: mordida, garra, maça e cauda."},
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +14 para atingir, alcance 1,5 m. *Acerto:* 22 (4d6 + 8) perfurante. Con CD 21 ou envenenado (sem curar e 21 [6d6] veneno por turno)."},
            {"nome": "Garra", "descricao": "*Corpo-a-Corpo:* +14 para atingir, alcance 3 m. *Acerto:* 17 (2d8 + 8) cortante."},
            {"nome": "Maça", "descricao": "*Corpo-a-Corpo:* +14 para atingir, alcance 3 m. *Acerto:* 15 (2d6 + 8) concussão + 21 (6d6) fogo."},
            {"nome": "Cauda", "descricao": "*Corpo-a-Corpo:* +14 para atingir, alcance 3 m. *Acerto:* 24 (3d10 + 8) concussão."}
        ],
        "descricao_lore": "Os generais e tiranos supremos dos Nove Infernos subordinados apenas aos Arquiduques de Baator."
    })

    return L

print("Demônios e Diabos definidos.")
