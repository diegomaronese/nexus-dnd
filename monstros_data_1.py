#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script que gera a lista completa dos monstros do Manual dos Monstros.
"""

from builder_monstros import make_attr, format_md
import json, os

def get_lista_monstros():
    L = []
    
    # Aarakocra
    L.append({
        "nome": "Aarakocra", "tipo_tamanho": "Humanoide Médio (aarakocra), neutro e bom",
        "ca": "12", "pv": "13 (3d8)", "deslocamento": "6 m, voo 15 m",
        "atributos": make_attr(10, 14, 10, 11, 12, 11),
        "pericias": "Percepção +5", "sentidos": "Percepção passiva 15", "idiomas": "Aarakocra, Auran", "nd": "1/4 (XP 50)",
        "tracos": [{"nome": "Ataque de Mergulho", "descricao": "Se estiver voando e mergulhar pelo menos 9 metros em linha reta até um alvo e atingi-lo com arma corpo-a-corpo, causa 3 (1d6) de dano extra."}],
        "acoes": [
            {"nome": "Garra", "descricao": "*Ataque Corpo-a-Corpo com Arma:* +4 para atingir, alcance 1,5 m. *Acerto:* 4 (1d4 + 2) de dano cortante."},
            {"nome": "Azagaia", "descricao": "*Ataque à Distância com Arma:* +4 para atingir, alcance 1,5 m ou 9/36 m. *Acerto:* 5 (1d6 + 2) de dano perfurante."}
        ],
        "descricao_lore": "Humanoides aviários patrulheiros do Plano Elemental do Ar e defensores das fronteiras contra o Mal Elemental."
    })

    # Abocanhador Matraqueante
    L.append({
        "nome": "Abocanhador Matraqueante", "tipo_tamanho": "Aberração Média, neutro",
        "ca": "9", "pv": "67 (9d8 + 27)", "deslocamento": "3 m, natação 3 m",
        "atributos": make_attr(10, 8, 16, 3, 10, 6),
        "imunidades_condicao": "Caído", "sentidos": "Visão no escuro 18 m, Percepção passiva 10", "idiomas": "—", "nd": "2 (XP 450)",
        "tracos": [
            {"nome": "Solo Aberrante", "descricao": "Solo num raio de 3 m é terreno difícil. Criaturas que iniciem turno nele passam em Força CD 10 ou deslocamento vai a 0."},
            {"nome": "Tagarelice", "descricao": "Criaturas que comecem turno a até 6 m e possam ouvi-lo passam em Sabedoria CD 10 ou perdem reações e agem aleatoriamente (1d8)."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza um ataque de mordida e, se disponível, Cusparada Cegante."},
            {"nome": "Mordida", "descricao": "*Ataque Corpo-a-Corpo:* +2 para atingir, alcance 1,5 m. *Acerto:* 17 (5d6) perfurante. Alvo Médio ou menor passa em Força CD 10 ou cai. Se morrer, é absorvido."},
            {"nome": "Cusparada Cegante (Recarrega 5–6)", "descricao": "Cospe bolha a até 4,5 m. Criaturas a até 1,5 m passam em Destreza CD 13 ou ficam cegas até o fim do próximo turno."}
        ],
        "descricao_lore": "Criatura ameboide de olhos e bocas que balbuciam loucuras enquanto liquefazem rocha e devoram carne."
    })

    # Abolete
    L.append({
        "nome": "Abolete", "tipo_tamanho": "Aberração Grande, leal e mau",
        "ca": "17 (armadura natural)", "pv": "135 (18d10 + 36)", "deslocamento": "3 m, natação 12 m",
        "atributos": make_attr(21, 9, 15, 18, 15, 18, {"Con": "+6", "Int": "+8", "Sab": "+6"}),
        "testes_resistencia": "Con +6, Int +8, Sab +6", "pericias": "História +12, Percepção +10",
        "sentidos": "Visão no escuro 36 m, Percepção passiva 20", "idiomas": "Dialeto Subterrâneo, telepatia 36 m", "nd": "10 (XP 5.900)",
        "tracos": [
            {"nome": "Anfíbio", "descricao": "Pode respirar ar e água."},
            {"nome": "Nuvem Mucosa", "descricao": "Submerso, criaturas a 1,5 m que tocarem ou acertarem passam em Con CD 14 ou adoecem (respiram só sob a água por 1d4 h)."},
            {"nome": "Sondagem Telepática", "descricao": "Descobre os maiores desejos de qualquer criatura que se comunique telepaticamente com ele."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Três ataques de tentáculos."},
            {"nome": "Tentáculo", "descricao": "*Corpo-a-Corpo:* +9 para atingir, alcance 3 m. *Acerto:* 12 (2d6 + 5) concussão. Con CD 14 ou pele fica translúcida e sofre dano ácido fora d'água."},
            {"nome": "Cauda", "descricao": "*Corpo-a-Corpo:* +9 para atingir, alcance 3 m. *Acerto:* 15 (3d6 + 5) concussão."},
            {"nome": "Escravizar (3/Dia)", "descricao": "Alvo a até 9 m passa em Sab CD 14 ou fica magicamente enfeitiçado sob controle telepático ilimitado."}
        ],
        "acoes_lendarias": [
            {"nome": "Chicotear com a Cauda", "descricao": "Realiza um ataque de cauda."},
            {"nome": "Detectar", "descricao": "Realiza um teste de Sabedoria (Percepção)."},
            {"nome": "Dreno Psíquico (Custa 2 Ações)", "descricao": "Causa 10 (3d6) de dano psíquico a criatura enfeitiçada e recupera PV iguais ao dano."}
        ],
        "acoes_covil": [
            {"nome": "Força Fantasmagórica", "descricao": "Conjura força fantasmagórica em alvos a até 18 m."},
            {"nome": "Marés Agarradoras", "descricao": "Poças puxam criaturas a até 6 m (Força CD 14 ou puxado 6m e caído)."},
            {"nome": "Condutor de Ira", "descricao": "Água causa 7 (2d6) dano psíquico (Sab CD 14)."}
        ],
        "descricao_lore": "Senhores primordiais de vastos impérios submarinos com memórias eternas que precedem a ascensão dos deuses."
    })

    # Deva
    L.append({
        "nome": "Deva", "tipo_tamanho": "Celestial Médio, leal e bom",
        "ca": "17 (armadura natural)", "pv": "136 (16d8 + 64)", "deslocamento": "9 m, voo 27 m",
        "atributos": make_attr(18, 18, 18, 17, 20, 20, {"Sab": "+9", "Car": "+9"}),
        "testes_resistencia": "Sab +9, Car +9", "pericias": "Intuição +9, Percepção +9",
        "resistencias": "Radiante; concussão, perfurante e cortante de ataques não-mágicos",
        "imunidades_condicao": "Enfeitiçado, Exausto, Amedrontado", "sentidos": "Visão no escuro 36 m, Percepção passiva 19",
        "idiomas": "Todos, telepatia 36 m", "nd": "10 (XP 5.900)",
        "tracos": [
            {"nome": "Armas Angelicais", "descricao": "Ataques armados são mágicos e causam 18 (4d8) de dano radiante extra (incluso)."},
            {"nome": "Conjuração Inata", "descricao": "Carisma (CD 17). À vontade: detectar bem e mal; 1/dia: comunhão, reviver os mortos."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem em testes de resistência contra magias e outros efeitos mágicos."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza dois ataques corpo-a-corpo."},
            {"nome": "Maça", "descricao": "*Corpo-a-Corpo:* +8 para atingir, alcance 1,5 m. *Acerto:* 7 (1d6 + 4) concussão + 18 (4d8) radiante."},
            {"nome": "Toque Curativo (3/Dia)", "descricao": "Cura 20 (4d8 + 2) PV e cura maldições, doenças, venenos, cegueira e surdez."},
            {"nome": "Alterar Forma", "descricao": "Metamorfoseia-se em humanoide ou besta com ND igual ou inferior ao seu."}
        ],
        "descricao_lore": "Anjos mensageiros divinos de pele prateada e belas asas plumadas enviados para guiar e proteger."
    })

    # Planetário
    L.append({
        "nome": "Planetário", "tipo_tamanho": "Celestial Grande, leal e bom",
        "ca": "19 (armadura natural)", "pv": "200 (16d10 + 112)", "deslocamento": "12 m, voo 36 m",
        "atributos": make_attr(24, 20, 24, 19, 22, 25, {"Con": "+12", "Sab": "+11", "Car": "+12"}),
        "testes_resistencia": "Con +12, Sab +11, Car +12", "pericias": "Percepção +11",
        "resistencias": "Radiante; concussão, perfurante e cortante de ataques não-mágicos",
        "imunidades_condicao": "Enfeitiçado, Exausto, Amedrontado", "sentidos": "Visão verdadeira 36 m, Percepção passiva 21",
        "idiomas": "Todos, telepatia 36 m", "nd": "16 (XP 15.000)",
        "tracos": [
            {"nome": "Armas Angelicais", "descricao": "Ataques com armas causam 22 (5d8) de dano radiante extra (incluso)."},
            {"nome": "Consciência Divina", "descricao": "O planetário sabe quando ouve uma mentira."},
            {"nome": "Conjuração Inata", "descricao": "Carisma (CD 20). À vontade: detectar bem e mal, invisibilidade (pessoal); 3/dia: barreira de lâminas, coluna de chamas, dissipar o bem e mal, reviver os mortos; 1/dia: comunhão, controlar o clima, praga de insetos."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem em testes de resistência contra magias."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza dois ataques corpo-a-corpo."},
            {"nome": "Espada Grande", "descricao": "*Corpo-a-Corpo:* +12 para atingir, alcance 1,5 m. *Acerto:* 21 (4d6 + 7) cortante + 22 (5d8) radiante."},
            {"nome": "Toque Curativo (4/Dia)", "descricao": "Cura 30 (6d8 + 3) PV e liberta de maldição, doença, veneno, cegueira ou surdez."}
        ],
        "descricao_lore": "Armas vivas dos deuses celestiais, empunham colossais espadas de lâmina luminosa para expurgar o mal."
    })

    # Solar
    L.append({
        "nome": "Solar", "tipo_tamanho": "Celestial Grande, leal e bom",
        "ca": "21 (armadura natural)", "pv": "243 (18d10 + 144)", "deslocamento": "15 m, voo 45 m",
        "atributos": make_attr(26, 22, 26, 25, 25, 30, {"Int": "+14", "Sab": "+14", "Car": "+17"}),
        "testes_resistencia": "Int +14, Sab +14, Car +17", "pericias": "Percepção +14",
        "resistencias": "Radiante; concussão, perfurante e cortante de ataques não-mágicos",
        "imunidades_dano": "Necrótico, Veneno", "imunidades_condicao": "Enfeitiçado, Exausto, Amedrontado, Envenenado",
        "sentidos": "Visão verdadeira 36 m, Percepção passiva 24", "idiomas": "Todos, telepatia 36 m", "nd": "21 (XP 33.000)",
        "tracos": [
            {"nome": "Armas Angelicais", "descricao": "Ataques armados causam 27 (6d8) de dano radiante extra (incluso)."},
            {"nome": "Consciência Divina", "descricao": "Sabe quando ouve uma mentira."},
            {"nome": "Conjuração Inata", "descricao": "Carisma (CD 25). À vontade: detectar bem e mal, invisibilidade (pessoal); 3/dia: barreira de lâminas, coluna de chamas, dissipar o bem e mal, ressurreição; 1/dia: comunhão, controlar o clima."},
            {"nome": "Resistência Lendária (3/Dia)", "descricao": "Se falhar em salvaguarda, pode escolher ter sucesso."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem em testes de resistência contra magias."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza dois ataques com espada grande."},
            {"nome": "Espada Grande", "descricao": "*Corpo-a-Corpo:* +15 para atingir, alcance 1,5 m. *Acerto:* 22 (4d6 + 8) cortante + 27 (6d8) radiante."},
            {"nome": "Arco Longo Assassino", "descricao": "*Distância:* +13 para atingir, 45/180 m. *Acerto:* 15 (2d8 + 6) perfurante + 27 (6d8) radiante. Alvo com 100 PV ou menos passa em Con CD 15 ou morre."},
            {"nome": "Espada Voadora", "descricao": "Comanda a espada grande para voar até 15 m e atacar como ação bônus."},
            {"nome": "Toque Curativo (4/Dia)", "descricao": "Cura 40 (8d8 + 4) PV e purifica todas as aflições."}
        ],
        "acoes_lendarias": [
            {"nome": "Explosão Ardente (Custa 2 Ações)", "descricao": "Raio de 3 m sofre 14 (4d6) fogo + 14 (4d6) radiante (Des CD 23 metade)."},
            {"nome": "Olhar Cegante (Custa 3 Ações)", "descricao": "Alvo a até 9 m passa em Con CD 15 ou fica cego permanentemente até cura."},
            {"nome": "Teletransporte", "descricao": "Teletransporta-se até 36 metros para local visível."}
        ],
        "descricao_lore": "Os mais gloriosos e poderosos anjos dos Planos Superiores, quase deuses em glória e majestade."
    })

    # Ankheg
    L.append({
        "nome": "Ankheg", "tipo_tamanho": "Monstruosidade Grande, imparcial",
        "ca": "14 (armadura natural), 11 quando enterrado", "pv": "39 (6d10 + 6)", "deslocamento": "9 m, escavação 3 m",
        "atributos": make_attr(17, 11, 13, 1, 13, 6),
        "sentidos": "Visão no escuro 18 m, sentido sísmico, Percepção passiva 11", "idiomas": "—", "nd": "2 (XP 450)",
        "acoes": [
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 1,5 m. *Acerto:* 10 (2d6 + 3) cortante + 3 (1d6) ácido. Alvo Grande ou menor fica agarrado (CD 13)."},
            {"nome": "Rajada de Ácido (Recarrega 6)", "descricao": "Linha de 9x1,5 m causa 10 (3d6) dano de ácido (Destreza CD 13 reduz à metade)."}
        ],
        "descricao_lore": "Monstruosidade insetóide subterrânea com mandíbulas poderosas e secreção ácida digestiva."
    })

    # Anomalia da Água
    L.append({
        "nome": "Anomalia da Água", "tipo_tamanho": "Elemental Grande, neutro",
        "ca": "13", "pv": "58 (9d10 + 9)", "deslocamento": "0 m, natação 18 m",
        "atributos": make_attr(17, 16, 13, 11, 10, 10),
        "resistencias": "Fogo; concussão, perfurante e cortante de ataques não-mágicos", "imunidades_dano": "Veneno",
        "imunidades_condicao": "Agarrado, Caído, Envenenado, Exausto, Impedido, Inconsciente, Paralisado",
        "sentidos": "Percepção às cegas 9 m, Percepção passiva 10", "idiomas": "Compreende Aquan mas não fala", "nd": "3 (XP 700)",
        "tracos": [
            {"nome": "Invisível na Água", "descricao": "Invisível enquanto estiver totalmente submersa."},
            {"nome": "Vínculo com a Água", "descricao": "Morre se deixar a água a qual foi vinculada ou se esta for destruída."}
        ],
        "acoes": [
            {"nome": "Constrição", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 3 m. *Acerto:* 13 (3d6 + 3) concussão. Alvo Médio ou menor é agarrado (CD 13), puxado 1,5 m e afogado."}
        ],
        "descricao_lore": "Guardião serpentino de pura água elemental vinculado a fontes sagradas ou profanas."
    })

    # Aparição
    L.append({
        "nome": "Aparição", "tipo_tamanho": "Morto-vivo Médio, neutro e mau",
        "ca": "13", "pv": "67 (9d8 + 27)", "deslocamento": "0 m, voo 18 m (planar)",
        "atributos": make_attr(6, 16, 16, 12, 14, 15),
        "resistencias": "Ácido, elétrico, fogo, frio, trovejante; concussão, perfurante e cortante de armas não-mágicas sem prata",
        "imunidades_dano": "Necrótico, Veneno", "imunidades_condicao": "Agarrado, Caído, Enfeitiçado, Envenenado, Exausto, Impedido, Inconsciente, Paralisado, Petrificado",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 12", "idiomas": "Os idiomas que conhecia em vida", "nd": "5 (XP 1.800)",
        "tracos": [
            {"nome": "Movimento Incorpóreo", "descricao": "Move-se através de criaturas e objetos como terreno difícil. Sofre 5 (1d10) dano de energia se terminar turno dentro."},
            {"nome": "Sensibilidade à Luz Solar", "descricao": "Desvantagem em ataques e percepção sob luz solar."}
        ],
        "acoes": [
            {"nome": "Drenar Vida", "descricao": "*Corpo-a-Corpo com Magia:* +6 para atingir, alcance 1,5 m. *Acerto:* 21 (4d8 + 3) necrótico. Con CD 14 ou reduz o máximo de PV no mesmo valor."},
            {"nome": "Criar Espectro", "descricao": "Ergue o espírito de humanoide morto violentamente como espectro sob seu controle (máx 7)."}
        ],
        "descricao_lore": "Encarnação espectral da malícia pura e energia negativa condenada a aniquilar os vivos."
    })

    # Arbusto Errante
    L.append({
        "nome": "Arbusto Errante", "tipo_tamanho": "Planta Grande, imparcial",
        "ca": "15 (armadura natural)", "pv": "136 (16d10 + 48)", "deslocamento": "6 m, natação 6 m",
        "atributos": make_attr(18, 8, 16, 5, 10, 5),
        "pericias": "Furtividade +2", "resistencias": "Frio, Fogo", "imunidades_dano": "Elétrico",
        "imunidades_condicao": "Cego, Surdo, Exausto", "sentidos": "Percepção às cegas 18 m (cego além), Percepção passiva 10",
        "idiomas": "—", "nd": "5 (XP 1.800)",
        "tracos": [{"nome": "Absorção de Eletricidade", "descricao": "Dano elétrico sofrido não causa dano e cura PV em igual valor."}],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Dois ataques de pancada. Se ambos atingirem alvo Médio ou menor, usa Engolfar."},
            {"nome": "Pancada", "descricao": "*Corpo-a-Corpo:* +7 para atingir, alcance 1,5 m. *Acerto:* 13 (2d8 + 4) concussão."},
            {"nome": "Engolfar", "descricao": "Engolfa alvo agarrado: cego, contido, sem ar, sofre 13 (2d8 + 4) concussão no início de cada turno (Con CD 14)."}
        ],
        "descricao_lore": "Amontoado monstruoso de vegetação podre animado por relâmpagos ou magia feérica."
    })

    # Azer
    L.append({
        "nome": "Azer", "tipo_tamanho": "Elemental Médio, leal e neutro",
        "ca": "17 (armadura natural, escudo)", "pv": "39 (6d8 + 12)", "deslocamento": "9 m",
        "atributos": make_attr(17, 12, 15, 12, 13, 10, {"Con": "+4"}),
        "testes_resistencia": "Con +4", "imunidades_dano": "Fogo, Veneno", "imunidades_condicao": "Envenenado",
        "sentidos": "Percepção passiva 11", "idiomas": "Ígneo", "nd": "2 (XP 450)",
        "tracos": [
            {"nome": "Armas Ardentes", "descricao": "Ataques com arma metálica causam 3 (1d6) fogo extra."},
            {"nome": "Corpo Ardente", "descricao": "Criatura que tocar ou acertar golpe a 1,5 m sofre 5 (1d10) fogo."},
            {"nome": "Iluminação", "descricao": "Emite luz plena 3 m e penumbra por mais 3 m."}
        ],
        "acoes": [
            {"nome": "Martelo de Guerra", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 1,5 m. *Acerto:* 7 (1d8 + 3) concussão (8 com 2 mãos) + 3 (1d6) fogo."}
        ],
        "descricao_lore": "Artesãos elementais de bronze e fogo esculpidos, mestres lendários da forja."
    })

    # Banshee
    L.append({
        "nome": "Banshee", "tipo_tamanho": "Morto-vivo Médio, caótico e mau",
        "ca": "12", "pv": "58 (13d8)", "deslocamento": "0 m, voo 12 m (planar)",
        "atributos": make_attr(1, 14, 10, 12, 11, 17, {"Sab": "+2", "Car": "+5"}),
        "testes_resistencia": "Sab +2, Car +5",
        "resistencias": "Ácido, elétrico, fogo, frio, trovejante; concussão, perfurante e cortante de ataques não-mágicos",
        "imunidades_condicao": "Agarrado, Caído, Enfeitiçado, Envenenado, Exausto, Impedido, Inconsciente, Paralisado, Petrificado",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 10", "idiomas": "Comum, Élfico", "nd": "4 (XP 1.100)",
        "tracos": [
            {"nome": "Detectar Vida", "descricao": "Sente a presença e direção de seres vivos a até 7,5 km."},
            {"nome": "Movimento Incorpóreo", "descricao": "Move-se através de criaturas e objetos como terreno difícil."}
        ],
        "acoes": [
            {"nome": "Toque Corruptor", "descricao": "*Corpo-a-Corpo com Magia:* +4 para atingir, alcance 1,5 m. *Acerto:* 12 (3d6 + 2) necrótico."},
            {"nome": "Aspecto Horripilante", "descricao": "Criaturas a até 18 m que a virem passam em Sab CD 13 ou ficam amedrontadas por 1 min."},
            {"nome": "Grito (1/Dia)", "descricao": "Criaturas a até 9 m que puderem ouvir passam em Con CD 13 ou caem a 0 PV (sucesso: 10 necrótico)."}
        ],
        "descricao_lore": "Espírito rancoroso de uma antiga elfa que corrompeu sua beleza e foi punida na morte-vida."
    })

    # Basilisco
    L.append({
        "nome": "Basilisco", "tipo_tamanho": "Monstruosidade Média, imparcial",
        "ca": "15 (armadura natural)", "pv": "52 (8d8 + 16)", "deslocamento": "6 m",
        "atributos": make_attr(16, 8, 15, 2, 8, 7),
        "sentidos": "Visão no escuro 18 m, Percepção passiva 9", "idiomas": "—", "nd": "3 (XP 700)",
        "tracos": [
            {"nome": "Olhar Petrificante", "descricao": "Criatura a 9 m que comece turno fitando-o passa em Con CD 12 ou fica contida e se transforma em pedra."}
        ],
        "acoes": [
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 1,5 m. *Acerto:* 10 (2d6 + 3) perfurante + 7 (2d6) veneno."}
        ],
        "descricao_lore": "Réptil de oito patas que petrifica suas vítimas com o olhar para devorar a pedra resultante."
    })

    # Behir
    L.append({
        "nome": "Behir", "tipo_tamanho": "Monstruosidade Enorme, neutro e mau",
        "ca": "17 (armadura natural)", "pv": "168 (16d12 + 64)", "deslocamento": "15 m, escalada 12 m",
        "atributos": make_attr(23, 16, 18, 7, 14, 12),
        "pericias": "Furtividade +7, Percepção +6", "imunidades_dano": "Elétrico",
        "sentidos": "Visão no escuro 27 m, Percepção passiva 16", "idiomas": "Dracônico", "nd": "11 (XP 7.200)",
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza um ataque de mordida e um de constrição."},
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +10 para atingir, alcance 3 m. *Acerto:* 22 (3d10 + 6) perfurante."},
            {"nome": "Constrição", "descricao": "*Corpo-a-Corpo:* +10 para atingir, alcance 1,5 m. *Acerto:* 17 (2d10 + 6) concussão + 17 (2d10 + 6) cortante. Alvo Grande ou menor é agarrado e contido (CD 16)."},
            {"nome": "Sopro Elétrico (Recarrega 5–6)", "descricao": "Linha de 6x1,5 m causa 66 (12d10) dano elétrico (Des CD 16 metade)."},
            {"nome": "Engolir", "descricao": "Engole criatura Média ou menor agarrada: cega, contida, sofre 21 (6d6) ácido no início do turno."}
        ],
        "descricao_lore": "Predador sinuoso gigante de 12 patas criado na guerra ancestral dos gigantes contra dragões."
    })

    # Bruxas
    L.append({
        "nome": "Bruxa da Noite", "tipo_tamanho": "Corruptor Médio, neutro e mau",
        "ca": "17 (armadura natural)", "pv": "112 (15d8 + 45)", "deslocamento": "9 m",
        "atributos": make_attr(18, 15, 16, 16, 14, 16, {"For": "+7", "Con": "+6", "Int": "+5", "Car": "+6"}),
        "testes_resistencia": "For +7, Con +6, Int +5, Car +6", "pericias": "Enganação +7, Furtividade +6, Intuição +6, Percepção +6",
        "resistencias": "Fogo, frio; concussão, perfurante e cortante de não-mágicos sem prata", "imunidades_condicao": "Enfeitiçado",
        "sentidos": "Visão no escuro 36 m, Percepção passiva 16", "idiomas": "Abissal, Comum, Infernal, Primordial", "nd": "5 (XP 1.800)",
        "tracos": [
            {"nome": "Conjuração Inata", "descricao": "Carisma (CD 14, +6 ataque). À vontade: detectar magia, mísseis mágicos; 2/dia: viagem planar (pessoal), raio do enfraquecimento, sono."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem em testes de resistência contra magias."}
        ],
        "acoes": [
            {"nome": "Garras (Forma de Bruxa)", "descricao": "*Corpo-a-Corpo:* +7 para atingir, alcance 1,5 m. *Acerto:* 13 (2d8 + 4) cortante."},
            {"nome": "Mudar Forma", "descricao": "Metamorfoseia-se em humanoide fêmea Pequena ou Média."},
            {"nome": "Forma Etérea", "descricao": "Entra no Plano Etéreo com sua pedra-coração."},
            {"nome": "Pesadelo Assombrado (1/Dia)", "descricao": "Toca humanoide adormecido pelo Éter causando pesadelos e drenando 5 (1d10) do PV máximo."}
        ],
        "descricao_lore": "Traficantes de almas que invadem os sonhos dos mortais para corrompê-los e aprisionar suas almas em sacolas de almas."
    })

    L.append({
        "nome": "Bruxa do Mar", "tipo_tamanho": "Fada Média, caótico e mau",
        "ca": "14 (armadura natural)", "pv": "52 (7d8 + 21)", "deslocamento": "9 m, natação 12 m",
        "atributos": make_attr(16, 13, 16, 12, 12, 13),
        "sentidos": "Visão no escuro 18 m, Percepção passiva 11", "idiomas": "Aquan, Comum, Gigante", "nd": "2 (XP 450)",
        "tracos": [
            {"nome": "Anfíbio", "descricao": "Respira ar e água."},
            {"nome": "Aparência Horripilante", "descricao": "Humanoide a até 9 m que a vir passa em Sab CD 11 ou fica amedrontado por 1 min."}
        ],
        "acoes": [
            {"nome": "Garras", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 1,5 m. *Acerto:* 10 (2d6 + 3) cortante."},
            {"nome": "Olhar Mortal", "descricao": "Alvo amedrontado a até 9 m passa em Sab CD 11 ou cai a 0 PV."},
            {"nome": "Aparência Ilusória", "descricao": "Cobre-se com ilusão mágica parecendo humanoide feia."}
        ],
        "descricao_lore": "Bruxas aquáticas malévolas que odeiam tudo o que é belo e afogam marinheiros em covis fétidos."
    })

    L.append({
        "nome": "Bruxa Verde", "tipo_tamanho": "Fada Média, neutro e mau",
        "ca": "17 (armadura natural)", "pv": "82 (11d8 + 33)", "deslocamento": "9 m",
        "atributos": make_attr(18, 12, 16, 13, 14, 14),
        "pericias": "Arcanismo +3, Enganação +4, Furtividade +3, Percepção +4",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 14", "idiomas": "Comum, Dracônico, Silvestre", "nd": "3 (XP 700)",
        "tracos": [
            {"nome": "Anfíbio", "descricao": "Respira ar e água."},
            {"nome": "Conjuração Inata", "descricao": "Carisma (CD 12). À vontade: globos de luz, ilusão menor, zombaria viciosa."},
            {"nome": "Mimetismo", "descricao": "Imita sons de animais e vozes humanoides (Intuição CD 14 para discernir)."}
        ],
        "acoes": [
            {"nome": "Garras", "descricao": "*Corpo-a-Corpo:* +6 para atingir, alcance 1,5 m. *Acerto:* 13 (2d8 + 4) cortante."},
            {"nome": "Aparência Ilusória", "descricao": "Disfarça-se magicamente como humanoide de tamanho similar."},
            {"nome": "Passagem Invisível", "descricao": "Torna-se invisível magicamente sem deixar rastros físicos."}
        ],
        "descricao_lore": "Manipuladoras pérfidas que habitam pântanos e charcos moribundos, enganando viajantes com vozes falsas."
    })

    # Bugbears
    L.append({
        "nome": "Bugbear", "tipo_tamanho": "Humanoide Médio (goblinoide), caótico e mau",
        "ca": "16 (gibão de peles, escudo)", "pv": "27 (5d8 + 5)", "deslocamento": "9 m",
        "atributos": make_attr(15, 14, 13, 8, 11, 9),
        "pericias": "Furtividade +6, Sobrevivência +2", "sentidos": "Visão no escuro 18 m, Percepção passiva 10",
        "idiomas": "Comum, Goblin", "nd": "1 (XP 200)",
        "tracos": [
            {"nome": "Ataque Surpresa", "descricao": "Ao surpreender uma criatura na 1ª rodada, causa 7 (2d6) dano extra no ataque."},
            {"nome": "Brutamontes", "descricao": "Causa um dado extra de dano com armas corpo-a-corpo (incluso)."}
        ],
        "acoes": [
            {"nome": "Maça Estrela", "descricao": "*Corpo-a-Corpo:* +4 para atingir, alcance 1,5 m. *Acerto:* 11 (2d8 + 2) perfurante."},
            {"nome": "Azagaia", "descricao": "*Corpo-a-Corpo ou Distância:* +4 para atingir, 1,5 m ou 9/36 m. *Acerto:* 9 (2d6 + 2) corpo-a-corpo ou 5 (1d6 + 2) à distância."}
        ],
        "descricao_lore": "Goblinóides brutais e furtivos que emboscam presas e oprimem parentes menores."
    })

    L.append({
        "nome": "Bugbear Comandante", "tipo_tamanho": "Humanoide Médio (goblinoide), caótico e mau",
        "ca": "17 (camisão de malha, escudo)", "pv": "65 (10d8 + 20)", "deslocamento": "9 m",
        "atributos": make_attr(17, 14, 14, 11, 12, 11),
        "pericias": "Furtividade +6, Intimidação +2, Sobrevivência +3", "sentidos": "Visão no escuro 18 m, Percepção passiva 11",
        "idiomas": "Comum, Goblin", "nd": "3 (XP 700)",
        "tracos": [
            {"nome": "Ataque Surpresa", "descricao": "Causa 7 (2d6) dano extra em alvos surpreendidos na 1ª rodada."},
            {"nome": "Brutamontes", "descricao": "Causa um dado extra de dano corpo-a-corpo."},
            {"nome": "Coração de Hruggek", "descricao": "Vantagem contra ser amedrontado, atordoado, enfeitiçado, envenenado, paralisado ou adormecido."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza dois ataques corpo-a-corpo."},
            {"nome": "Maça Estrela", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 1,5 m. *Acerto:* 12 (2d8 + 3) perfurante."},
            {"nome": "Azagaia", "descricao": "*Corpo-a-Corpo ou Distância:* +5 para atingir. *Acerto:* 10 (2d6 + 3) ou 6 (1d6 + 3) à distância."}
        ],
        "descricao_lore": "Líderes cruéis de bandos bugbear abençoados pelo deus da batalha Hruggek."
    })

    # Bulette
    L.append({
        "nome": "Bulette", "tipo_tamanho": "Monstruosidade Grande, imparcial",
        "ca": "17 (armadura natural)", "pv": "94 (9d10 + 45)", "deslocamento": "12 m, escavação 12 m",
        "atributos": make_attr(19, 11, 21, 2, 10, 5),
        "pericias": "Percepção +6", "sentidos": "Visão no escuro 18 m, sentido sísmico 18 m, Percepção passiva 16",
        "idiomas": "—", "nd": "5 (XP 1.800)",
        "tracos": [{"nome": "Salto Parado", "descricao": "Salto em distância de até 9 m e em altura de até 4,5 m sem corrida."}],
        "acoes": [
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +7 para atingir, alcance 1,5 m. *Acerto:* 30 (4d12 + 4) perfurante."},
            {"nome": "Salto Mortal", "descricao": "Ao pular pelo menos 4,5 m, aterrissa sobre alvos: For/Des CD 16 ou sofre 14 (3d6+4) concussão + 14 (3d6+4) cortante e cai."}
        ],
        "descricao_lore": "O lendário 'tubarão terrestre', predador blindado voraz que emerge do solo para despedaçar presas."
    })

    # Bullywug
    L.append({
        "nome": "Bullywug", "tipo_tamanho": "Humanoide Médio (bullywug), neutro e mau",
        "ca": "15 (gibão de peles, escudo)", "pv": "11 (2d8 + 2)", "deslocamento": "6 m, natação 12 m",
        "atributos": make_attr(12, 12, 13, 7, 10, 7),
        "pericias": "Furtividade +3", "sentidos": "Percepção passiva 10", "idiomas": "Bullywug", "nd": "1/4 (XP 50)",
        "tracos": [
            {"nome": "Anfíbio", "descricao": "Respira ar e água."},
            {"nome": "Camuflagem Pantanosa", "descricao": "Vantagem em Furtividade para se esconder em pântano."},
            {"nome": "Falar com Sapos e Rãs", "descricao": "Comunica conceitos simples com batráquios."},
            {"nome": "Salto Parado", "descricao": "Salto em distância de até 6 m e altura de até 3 m."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza um ataque de mordida e um com sua lança."},
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +3 para atingir, alcance 1,5 m. *Acerto:* 3 (1d4 + 1) concussão."},
            {"nome": "Lança", "descricao": "*Corpo-a-Corpo ou Distância:* +3 para atingir, 1,5 m ou 6/18 m. *Acerto:* 4 (1d6 + 1) perfurante (5 com duas mãos)."}
        ],
        "descricao_lore": "Humanoides-sapo arrogantes e covardes que reinam tiranicamente em pântanos fétidos."
    })

    # Caçador Invisível
    L.append({
        "nome": "Caçador Invisível", "tipo_tamanho": "Elemental Médio, neutro",
        "ca": "14", "pv": "104 (16d8 + 32)", "deslocamento": "15 m, voo 15 m (planar)",
        "atributos": make_attr(16, 19, 14, 10, 15, 11),
        "pericias": "Furtividade +10, Percepção +8",
        "resistencias": "Concussão, perfurante e cortante de ataques não-mágicos", "imunidades_dano": "Veneno",
        "imunidades_condicao": "Agarrado, Caído, Envenenado, Exausto, Impedido, Inconsciente, Paralisado",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 18", "idiomas": "Auran, compreende Comum", "nd": "6 (XP 2.300)",
        "tracos": [
            {"nome": "Invisibilidade", "descricao": "O caçador é naturalmente invisível o tempo todo."},
            {"nome": "Rastreador Impecável", "descricao": "Sabe a direção e distância exata de sua presa no mesmo plano."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza dois ataques de pancada."},
            {"nome": "Pancada", "descricao": "*Corpo-a-Corpo:* +6 para atingir, alcance 1,5 m. *Acerto:* 10 (2d6 + 3) concussão."}
        ],
        "descricao_lore": "Elemental do ar convocado e transformado magicamente em assassino e rastreador incansável."
    })

    # Cambion
    L.append({
        "nome": "Cambion", "tipo_tamanho": "Corruptor Médio, qualquer tendência maligna",
        "ca": "19 (brunea)", "pv": "82 (11d8 + 33)", "deslocamento": "9 m, voo 18 m",
        "atributos": make_attr(18, 18, 16, 14, 12, 16, {"For": "+7", "Con": "+6", "Int": "+5", "Car": "+6"}),
        "testes_resistencia": "For +7, Con +6, Int +5, Car +6",
        "pericias": "Enganação +6, Furtividade +7, Intimidação +6, Percepção +4",
        "resistencias": "Elétrico, fogo, frio, veneno; concussão, cortante e perfurante de não-mágicos",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 14", "idiomas": "Abissal, Comum, Infernal", "nd": "5 (XP 1.800)",
        "tracos": [
            {"nome": "Bênção Infernal", "descricao": "A CA inclui o bônus de Carisma (+3)."},
            {"nome": "Conjuração Inata", "descricao": "Carisma (CD 14). 3/dia: alterar-se, comando, detectar magia; 1/dia: viagem planar (pessoal)."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Dois ataques de lança ou dois Raios de Fogo."},
            {"nome": "Lança", "descricao": "*Corpo-a-Corpo ou Distância:* +7 para atingir, 1,5 m ou 6/18 m. *Acerto:* 7 (1d6 + 4) perfurante (8 com duas mãos) + 3 (1d6) fogo."},
            {"nome": "Raio de Fogo", "descricao": "*Distância com Magia:* +7 para atingir, alcance 36 m. *Acerto:* 10 (3d6) de fogo."},
            {"nome": "Charme Demoníaco", "descricao": "Humanoide a até 9 m passa em Sab CD 14 ou fica enfeitiçado por 1 dia, obedecendo ordens."}
        ],
        "descricao_lore": "Progênie de humanoide com corruptor (súcubo/íncubo), combinando charme letal, asas e poder infernal."
    })

    # Cão Infernal
    L.append({
        "nome": "Cão Infernal", "tipo_tamanho": "Corruptor Médio, leal e mau",
        "ca": "15 (armadura natural)", "pv": "45 (7d8 + 14)", "deslocamento": "15 m",
        "atributos": make_attr(17, 12, 14, 6, 13, 6),
        "pericias": "Percepção +5", "imunidades_dano": "Fogo",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 15", "idiomas": "Compreende Infernal mas não fala", "nd": "3 (XP 700)",
        "tracos": [
            {"nome": "Audição e Faro Aguçados", "descricao": "Vantagem em Percepção para audição e olfato."},
            {"nome": "Táticas de Matilha", "descricao": "Vantagem no ataque se houver aliado a até 1,5 m do alvo."}
        ],
        "acoes": [
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 1,5 m. *Acerto:* 7 (1d8 + 3) perfurante + 7 (2d6) fogo."},
            {"nome": "Sopro de Fogo (Recarrega 5–6)", "descricao": "Cone de 4,5 m causa 21 (6d6) de dano de fogo (Destreza CD 12 metade)."}
        ],
        "descricao_lore": "Cão monstruoso dos Planos Inferiores revestido de fogo interno que queima carnes e cinzas."
    })

    # Carniçais
    L.append({
        "nome": "Carniçal", "tipo_tamanho": "Morto-vivo Médio, caótico e mau",
        "ca": "12", "pv": "22 (5d8)", "deslocamento": "9 m",
        "atributos": make_attr(13, 15, 10, 7, 10, 6),
        "imunidades_dano": "Veneno", "imunidades_condicao": "Enfeitiçado, Envenenado, Exausto",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 10", "idiomas": "Comum", "nd": "1 (XP 200)",
        "acoes": [
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +2 para atingir, alcance 1,5 m. *Acerto:* 9 (2d6 + 2) perfurante."},
            {"nome": "Garras", "descricao": "*Corpo-a-Corpo:* +4 para atingir, alcance 1,5 m. *Acerto:* 7 (2d4 + 2) cortante. Se o alvo não for elfo ou morto-vivo, Con CD 10 ou fica paralisado por 1 min."}
        ],
        "descricao_lore": "Mortos-vivos vorazes que vagam em bandos buscando devorar carne em decomposição."
    })

    L.append({
        "nome": "Lívido", "tipo_tamanho": "Morto-vivo Médio, caótico e mau",
        "ca": "13", "pv": "36 (8d8)", "deslocamento": "9 m",
        "atributos": make_attr(16, 17, 10, 11, 10, 8),
        "resistencias": "Necrótico", "imunidades_dano": "Veneno", "imunidades_condicao": "Enfeitiçado, Envenenado, Exausto",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 10", "idiomas": "Comum", "nd": "2 (XP 450)",
        "tracos": [
            {"nome": "Fedor", "descricao": "Criatura a até 1,5 m passa em Con CD 10 ou fica envenenada por 1 rodada."},
            {"nome": "Proteção contra Expulsão", "descricao": "Ele e carniçais a até 9 m têm vantagem contra expulsar mortos-vivos."}
        ],
        "acoes": [
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +3 para atingir, alcance 1,5 m. *Acerto:* 12 (2d8 + 3) perfurante."},
            {"nome": "Garras", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 1,5 m. *Acerto:* 10 (2d6 + 3) cortante. Con CD 10 ou fica paralisado por 1 min (exceto elfos/mortos-vivos)."}
        ],
        "descricao_lore": "Carniçal infundido com energia abissal por Orcus, dotado de liderança sobre hordas necrófagas."
    })

    # Cavaleiro da Morte
    L.append({
        "nome": "Cavaleiro da Morte", "tipo_tamanho": "Morto-vivo Médio, caótico e mau",
        "ca": "20 (placas, escudo)", "pv": "180 (19d8 + 95)", "deslocamento": "9 m",
        "atributos": make_attr(20, 11, 20, 12, 16, 18, {"Des": "+6", "Sab": "+9", "Car": "+10"}),
        "testes_resistencia": "Des +6, Sab +9, Car +10", "imunidades_dano": "Necrótico, Veneno",
        "imunidades_condicao": "Enfeitiçado, Envenenado, Exausto", "sentidos": "Visão no escuro 36 m, Percepção passiva 13",
        "idiomas": "Abissal, Comum", "nd": "17 (XP 18.000)",
        "tracos": [
            {"nome": "Marechal Morto-vivo", "descricao": "Ele e mortos-vivos a até 9 m têm vantagem em testes contra expulsão."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem em testes de resistência contra magias."},
            {"nome": "Conjuração", "descricao": "Conjurador 19º nível (Carisma CD 18, +10 ataque). Magias de Paladino: comando, duelo compelido, destruição lancinante, arma mágica, imobilizar pessoa, arma elemental, dissipar magia, banimento, destruição estonteante, onda destrutiva (necrótico)."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza três ataques de espada longa."},
            {"nome": "Espada Longa", "descricao": "*Corpo-a-Corpo:* +11 para atingir, alcance 1,5 m. *Acerto:* 9 (1d8 + 5) cortante (10 com 2 mãos) + 18 (4d8) necrótico."},
            {"nome": "Orbe de Fogo Infernal (1/Dia)", "descricao": "Esfera de 6 m a até 36 m causa 35 (10d6) fogo + 35 (10d6) necrótico (Destreza metade)."}
        ],
        "reacoes": [
            {"nome": "Aparar", "descricao": "Adiciona +6 à sua CA contra um ataque corpo-a-corpo."}
        ],
        "descricao_lore": "Paladino corrompido transformado pelas trevas em guerreiro esquelético imortal até encontrar redenção."
    })

    # Caveira Flamejante
    L.append({
        "nome": "Caveira Flamejante", "tipo_tamanho": "Morto-vivo Miúdo, neutro e mau",
        "ca": "13", "pv": "40 (9d4 + 18)", "deslocamento": "0 m, voo 12 m (planar)",
        "atributos": make_attr(1, 17, 14, 16, 10, 11),
        "pericias": "Arcanismo +5, Percepção +2",
        "resistencias": "Elétrico, necrótico, perfurante", "imunidades_dano": "Fogo, frio, veneno",
        "imunidades_condicao": "Amedrontado, Caído, Enfeitiçado, Envenenado, Exausto",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 12", "idiomas": "Comum", "nd": "4 (XP 1.100)",
        "tracos": [
            {"nome": "Iluminação", "descricao": "Emite luz plena 4,5 m e penumbra por mais 4,5 m (ou apenas penumbra)."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem em salvaguardas contra magias."},
            {"nome": "Rejuvenescimento", "descricao": "Se destruída, refaz-se com PV total em 1 hora, a menos que aspergida com água benta ou dissipar magia/remover maldição."},
            {"nome": "Conjuração", "descricao": "Conjurador 5º nível (Int CD 13, +5 ataque). Truques: mãos mágicas; 1º nível (3): escudo arcano, mísseis mágicos; 2º nível (2): esfera flamejante, nublar; 3º nível (1): bola de fogo."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Usa Raio de Fogo duas vezes."},
            {"nome": "Raio de Fogo", "descricao": "*Distância com Magia:* +5 para atingir, alcance 9 m. *Acerto:* 10 (3d6) de fogo."}
        ],
        "descricao_lore": "Crânio flutuante envolto em chamas verdes criado dos restos de magos para servir como sentinela mágica."
    })

    # Centauro
    L.append({
        "nome": "Centauro", "tipo_tamanho": "Monstruosidade Grande, neutro e bom",
        "ca": "12", "pv": "45 (6d10 + 12)", "deslocamento": "15 m",
        "atributos": make_attr(18, 14, 14, 9, 13, 11),
        "pericias": "Atletismo +6, Percepção +3, Sobrevivência +3", "sentidos": "Percepção passiva 13", "idiomas": "Élfico, Silvestre", "nd": "2 (XP 450)",
        "tracos": [{"nome": "Investida", "descricao": "Se mover pelo menos 9 m em linha reta e atingir com lança montada, causa 10 (3d6) perfurante extra."}],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza dois ataques: um com lança montada e um com cascos, ou dois com arco longo."},
            {"nome": "Lança Montada", "descricao": "*Corpo-a-Corpo:* +6 para atingir, alcance 3 m. *Acerto:* 9 (1d10 + 4) perfurante."},
            {"nome": "Cascos", "descricao": "*Corpo-a-Corpo:* +6 para atingir, alcance 1,5 m. *Acerto:* 11 (2d6 + 4) concussão."},
            {"nome": "Arco Longo", "descricao": "*Distância:* +4 para atingir, 45/180 m. *Acerto:* 6 (1d8 + 2) perfurante."}
        ],
        "descricao_lore": "Andarilhos nômades que mesclam tronco humano e corpo equino, profundos conhecedores da natureza e dos astros."
    })

    # Chuul
    L.append({
        "nome": "Chuul", "tipo_tamanho": "Aberração Grande, caótico e mau",
        "ca": "16 (armadura natural)", "pv": "93 (11d10 + 33)", "deslocamento": "9 m, natação 9 m",
        "atributos": make_attr(19, 10, 16, 5, 11, 5),
        "pericias": "Percepção +4", "imunidades_dano": "Veneno", "imunidades_condicao": "Envenenado",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 14", "idiomas": "Compreende Dialeto Subterrâneo", "nd": "4 (XP 1.100)",
        "tracos": [
            {"nome": "Anfíbio", "descricao": "Respira ar e água."},
            {"nome": "Sentir Magia", "descricao": "Sente magia a até 36 metros de si à vontade (como detectar magia)."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Dois ataques de pinça. Se agarrar, pode usar tentáculos uma vez."},
            {"nome": "Pinças", "descricao": "*Corpo-a-Corpo:* +6 para atingir, alcance 3 m. *Acerto:* 11 (2d6 + 4) concussão. Alvo Grande ou menor fica agarrado (CD 14)."},
            {"nome": "Tentáculos", "descricao": "Criatura agarrada passa em Con CD 13 ou fica envenenada e paralisada por 1 min."}
        ],
        "descricao_lore": "Crustáceos aberrantes gigantes criados pelos aboletes como guardiões perenes de ruínas ancestrais."
    })

    # Ciclope
    L.append({
        "nome": "Ciclope", "tipo_tamanho": "Gigante Enorme, caótico e neutro",
        "ca": "14 (armadura natural)", "pv": "138 (12d12 + 60)", "deslocamento": "9 m",
        "atributos": make_attr(22, 11, 20, 8, 6, 10),
        "sentidos": "Percepção passiva 8", "idiomas": "Gigante", "nd": "6 (XP 2.300)",
        "tracos": [{"nome": "Percepção de Profundidade Ruim", "descricao": "Desvantagem em ataques contra alvos a mais de 9 m de distância."}],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza dois ataques com clava grande."},
            {"nome": "Clava Grande", "descricao": "*Corpo-a-Corpo:* +9 para atingir, alcance 3 m. *Acerto:* 19 (3d8 + 6) concussão."},
            {"nome": "Rocha", "descricao": "*Distância:* +9 para atingir, 9/36 m. *Acerto:* 28 (4d10 + 6) concussão."}
        ],
        "descricao_lore": "Gigantes caolhos isolacionistas e brutais que vivem da pastorícia e caça selvagem."
    })

    # Cocatriz
    L.append({
        "nome": "Cocatriz", "tipo_tamanho": "Monstruosidade Pequena, imparcial",
        "ca": "11", "pv": "27 (6d6 + 6)", "deslocamento": "6 m, voo 12 m",
        "atributos": make_attr(6, 12, 12, 2, 13, 5),
        "sentidos": "Visão no escuro 18 m, Percepção passiva 11", "idiomas": "—", "nd": "1/2 (XP 100)",
        "acoes": [
            {"nome": "Bicada", "descricao": "*Corpo-a-Corpo:* +3 para atingir, alcance 1,5 m. *Acerto:* 3 (1d4 + 1) perfurante. Alvo passa em Con CD 11 ou fica contido e se petrifica por 24 horas se falhar no próximo turno."}
        ],
        "descricao_lore": "Híbrido de pássaro, lagarto e morcego cuja bicada petrifica carne viva."
    })

    # Couatl
    L.append({
        "nome": "Couatl", "tipo_tamanho": "Celestial Médio, leal e bom",
        "ca": "19 (armadura natural)", "pv": "97 (13d8 + 39)", "deslocamento": "9 m, voo 27 m",
        "atributos": make_attr(16, 20, 17, 18, 20, 18, {"Con": "+5", "Sab": "+7", "Car": "+6"}),
        "testes_resistencia": "Con +5, Sab +7, Car +6", "resistencias": "Radiante",
        "imunidades_dano": "Psíquico; concussão, cortante e perfurante de não-mágicos",
        "sentidos": "Visão verdadeira 36 m, Percepção passiva 15", "idiomas": "Todos, telepatia 36 m", "nd": "4 (XP 1.100)",
        "tracos": [
            {"nome": "Armas Mágicas", "descricao": "Ataques armados são mágicos."},
            {"nome": "Conjuração Inata", "descricao": "Carisma (CD 14). À vontade: detectar mal e bem, detectar magia, detectar pensamentos; 3/dia: bênção, criar alimentos, curar ferimentos, escudo arcano, proteção contra veneno, restauração menor, santuário; 1/dia: restauração maior, sonho, vidência."},
            {"nome": "Mente Protegida", "descricao": "Imune à vidência e a detecção de emoções, pensamentos ou localização."}
        ],
        "acoes": [
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +8 para atingir, alcance 1,5 m. *Acerto:* 8 (1d6 + 5) perfurante. Con CD 13 ou envenenado e inconsciente por 24 horas."},
            {"nome": "Constrição", "descricao": "*Corpo-a-Corpo:* +6 para atingir, alcance 3 m. *Acerto:* 10 (2d6 + 3) concussão. Alvo Médio ou menor fica agarrado e contido (CD 15)."},
            {"nome": "Mudança de Forma", "descricao": "Metamorfoseia-se magicamente em humanoide ou besta com ND igual ou inferior ao seu."}
        ],
        "descricao_lore": "Seres serpentinos emplumados celestiais e benevolentes criados por deuses antigos para cumprir profecias sagradas."
    })

    # Demilich
    L.append({
        "nome": "Demilich", "tipo_tamanho": "Morto-vivo Miúdo, neutro e mau",
        "ca": "20 (armadura natural)", "pv": "80 (20d4)", "deslocamento": "0 m, voo 9 m (planar)",
        "atributos": make_attr(1, 20, 10, 20, 17, 20, {"Con": "+6", "Int": "+11", "Sab": "+9", "Car": "+11"}),
        "testes_resistencia": "Con +6, Int +11, Sab +9, Car +11",
        "resistencias": "Concussão, cortante e perfurante de ataques mágicos",
        "imunidades_dano": "Necrótico, psíquico, veneno; concussão, cortante e perfurante de não-mágicos",
        "imunidades_condicao": "Amedrontado, atordoado, caído, enfeitiçado, envenenado, exausto, paralisado, petrificado",
        "sentidos": "Visão verdadeira 36 m, Percepção passiva 13", "idiomas": "—", "nd": "18 (XP 20.000)",
        "tracos": [
            {"nome": "Anulação", "descricao": "Em efeito com salvaguarda para meio dano, não sofre dano se passar e sofre metade se falhar."},
            {"nome": "Imunidade à Expulsão", "descricao": "Imune a efeitos de expulsar mortos-vivos."},
            {"nome": "Resistência Lendária (3/Dia)", "descricao": "Pode escolher ter sucesso se falhar em teste de resistência."}
        ],
        "acoes": [
            {"nome": "Drenar Vida", "descricao": "Até três criaturas a até 3 m: Con CD 19 ou sofrem 21 (6d6) necrótico; cura PV igual ao dano total causado."},
            {"nome": "Uivo (Recarrega 5–6)", "descricao": "Criaturas a até 9 m passam em Con CD 15 ou caem a 0 PV (sucesso: amedrontadas até fim do turno)."}
        ],
        "acoes_lendarias": [
            {"nome": "Drenar Energia (Custa 2 Ações)", "descricao": "Criaturas a até 9 m passam em Con CD 15 ou têm PV máximo reduzido em 10 (3d6)."},
            {"nome": "Maldição Vil (Custa 3 Ações)", "descricao": "Alvo a até 9 m passa em Sab CD 15 ou sofre desvantagem em ataques e salvaguardas."},
            {"nome": "Nuvem de Poeira", "descricao": "Criaturas a até 3 m passam em Con CD 15 ou ficam cegas até fim do próximo turno do demilich."},
            {"nome": "Voo", "descricao": "Voa até metade do seu deslocamento."}
        ],
        "descricao_lore": "Crânio flutuante que abriga a centelha final de um poderoso lich cuja carne e memória foram consumidas pelas eras."
    })

    return L

print("Monstros lote 1 definidos.")
