#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os

# Carregamento de dados completos dos monstros do Manual dos Monstros
from scripts_gerar_monstros_base import make_attr, format_monster_md

def get_all_monsters():
    # Lista detalhada de todos os monstros do livro
    monsters = [
        # Anjos
        {
            "nome": "Deva",
            "tipo_tamanho": "Celestial Médio, leal e bom",
            "ca": "17 (armadura natural)",
            "pv": "136 (16d8 + 64)",
            "deslocamento": "9 m, voo 27 m",
            "atributos": make_attr(18, 18, 18, 17, 20, 20, {"Sab": "+9", "Car": "+9"}),
            "testes_resistencia": "Sab +9, Car +9",
            "pericias": "Intuição +9, Percepção +9",
            "resistencias": "Radiante; concussão, perfurante e cortante de ataques não-mágicos",
            "imunidades_condicao": "Enfeitiçado, Exausto, Amedrontado",
            "sentidos": "Visão no escuro 36 m, Percepção passiva 19",
            "idiomas": "Todos, telepatia 36 m",
            "nd": "10 (XP 5.900)",
            "tracos": [
                {"nome": "Armas Angelicais", "descricao": "Ataques armados são mágicos e causam 4d8 de dano radiante extra (incluso)."},
                {"nome": "Conjuração Inata", "descricao": "Carisma (CD 17). À vontade: detectar bem e mal; 1/dia cada: comunhão, reviver os mortos."},
                {"nome": "Resistência à Magia", "descricao": "Vantagem em testes de resistência contra magias e outros efeitos mágicos."}
            ],
            "acoes": [
                {"nome": "Ataques Múltiplos", "descricao": "O deva realiza dois ataques corpo-a-corpo."},
                {"nome": "Maça", "descricao": "*Ataque Corpo-a-Corpo com Arma:* +8 para atingir, alcance 1,5 m. *Acerto:* 7 (1d6 + 4) concussão + 18 (4d8) radiante."},
                {"nome": "Toque Curativo (3/Dia)", "descricao": "Toca criatura que recupera 20 (4d8 + 2) PV e cura maldição, doença, veneno, cegueira ou surdez."},
                {"nome": "Alterar Forma", "descricao": "Metamorfoseia-se em humanoide ou besta com ND igual ou inferior ao seu."}
            ],
            "descricao_lore": "Anjos mensageiros divinos no Plano Material, Umbra e Faéria capazes de assumir formas mortais."
        },
        {
            "nome": "Planetário",
            "tipo_tamanho": "Celestial Grande, leal e bom",
            "ca": "19 (armadura natural)",
            "pv": "200 (16d10 + 112)",
            "deslocamento": "12 m, voo 36 m",
            "atributos": make_attr(24, 20, 24, 19, 22, 25, {"Con": "+12", "Sab": "+11", "Car": "+12"}),
            "testes_resistencia": "Con +12, Sab +11, Car +12",
            "pericias": "Percepção +11",
            "resistencias": "Radiante; concussão, perfurante e cortante de ataques não-mágicos",
            "imunidades_condicao": "Enfeitiçado, Exausto, Amedrontado",
            "sentidos": "Visão verdadeira 36 m, Percepção passiva 21",
            "idiomas": "Todos, telepatia 36 m",
            "nd": "16 (XP 15.000)",
            "tracos": [
                {"nome": "Armas Angelicais", "descricao": "Ataques armados causam 5d8 de dano radiante extra (incluso)."},
                {"nome": "Consciência Divina", "descricao": "O planetário sabe quando ouve uma mentira."},
                {"nome": "Conjuração Inata", "descricao": "Carisma (CD 20). À vontade: detectar bem e mal, invisibilidade (pessoal); 3/dia: barreira de lâminas, coluna de chamas, dissipar o bem e mal, reviver os mortos; 1/dia: comunhão, controlar o clima, praga de insetos."},
                {"nome": "Resistência à Magia", "descricao": "Vantagem em testes de resistência contra magias e efeitos mágicos."}
            ],
            "acoes": [
                {"nome": "Ataques Múltiplos", "descricao": "Dois ataques corpo-a-corpo."},
                {"nome": "Espada Grande", "descricao": "*Ataque Corpo-a-Corpo:* +12 para atingir, alcance 1,5 m. *Acerto:* 21 (4d6 + 7) cortante + 22 (5d8) radiante."},
                {"nome": "Toque Curativo (4/Dia)", "descricao": "Recupera 30 (6d8 + 3) PV e liberta de maldição, doença, veneno, cegueira ou surdez."}
            ],
            "descricao_lore": "Armas vivas dos deuses, com asas brancas e espadas colossais."
        },
        {
            "nome": "Solar",
            "tipo_tamanho": "Celestial Grande, leal e bom",
            "ca": "21 (armadura natural)",
            "pv": "243 (18d10 + 144)",
            "deslocamento": "15 m, voo 45 m",
            "atributos": make_attr(26, 22, 26, 25, 25, 30, {"Int": "+14", "Sab": "+14", "Car": "+17"}),
            "testes_resistencia": "Int +14, Sab +14, Car +17",
            "pericias": "Percepção +14",
            "resistencias": "Radiante; concussão, perfurante e cortante de ataques não-mágicos",
            "imunidades_dano": "Necrótico, Veneno",
            "imunidades_condicao": "Enfeitiçado, Exausto, Amedrontado, Envenenado",
            "sentidos": "Visão verdadeira 36 m, Percepção passiva 24",
            "idiomas": "Todos, telepatia 36 m",
            "nd": "21 (XP 33.000)",
            "tracos": [
                {"nome": "Armas Angelicais", "descricao": "Ataques armados causam 6d8 de dano radiante extra (incluso)."},
                {"nome": "Consciência Divina", "descricao": "Sabe quando ouve uma mentira."},
                {"nome": "Conjuração Inata", "descricao": "Carisma (CD 25). À vontade: detectar bem e mal, invisibilidade (pessoal); 3/dia: barreira de lâminas, coluna de chamas, dissipar o bem e mal, ressurreição; 1/dia: comunhão, controlar o clima."},
                {"nome": "Resistência à Magia", "descricao": "Vantagem em testes de resistência contra magias e outros efeitos mágicos."}
            ],
            "acoes": [
                {"nome": "Ataques Múltiplos", "descricao": "Realiza dois ataques com espada grande."},
                {"nome": "Espada Grande", "descricao": "*Corpo-a-Corpo:* +15 para atingir, alcance 1,5 m. *Acerto:* 22 (4d6 + 8) cortante + 27 (6d8) radiante."},
                {"nome": "Arco Longo Assassino", "descricao": "*Distância:* +13 para atingir, 45/180 m. *Acerto:* 15 (2d8 + 6) perfurante + 27 (6d8) radiante. Alvo com 100 PV ou menos deve passar em Con CD 15 ou morre."},
                {"nome": "Espada Voadora", "descricao": "Comanda mentalmente sua espada grande para voar até 15 m e atacar como ação bônus."},
                {"nome": "Toque Curativo (4/Dia)", "descricao": "Recupera 40 (8d8 + 4) PV e remove maldição, doença, veneno, cegueira ou surdez."}
            ],
            "acoes_lendarias": [
                {"nome": "Explosão Ardente (2 Ações)", "descricao": "Raio 3 m sofre 14 (4d6) fogo + 14 (4d6) radiante (Des CD 23 metade)."},
                {"nome": "Olhar Cegante (3 Ações)", "descricao": "Criatura a até 9 m passa em Con CD 15 ou fica cega até restauração menor."},
                {"nome": "Teletransporte", "descricao": "Teletransporta-se magicamente até 36 m."}
            ],
            "descricao_lore": "Os seres celestiais mais poderosos do multiverso; existem apenas vinte e quatro solares."
        },
        # Ankheg
        {
            "nome": "Ankheg",
            "tipo_tamanho": "Monstruosidade Grande, imparcial",
            "ca": "14 (armadura natural), 11 quando enterrado",
            "pv": "39 (6d10 + 6)",
            "deslocamento": "9 m, escavação 3 m",
            "atributos": make_attr(17, 11, 13, 1, 13, 6),
            "sentidos": "Visão no escuro 18 m, sentido sísmico, Percepção passiva 11",
            "idiomas": "—",
            "nd": "2 (XP 450)",
            "acoes": [
                {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 1,5 m. *Acerto:* 10 (2d6 + 3) cortante + 3 (1d6) ácido. Alvo Grande ou menor fica agarrado (CD 13)."},
                {"nome": "Rajada de Ácido (Recarrega 6)", "descricao": "Linha de 9x1,5 m causa 10 (3d6) de dano de ácido (Des CD 13 metade)."}
            ],
            "descricao_lore": "Insetoide predador subterrâneo de garras afiadas que espreita sob o solo de campos e pastagens."
        },
        # Anomalia da Água
        {
            "nome": "Anomalia da Água",
            "tipo_tamanho": "Elemental Grande, neutro",
            "ca": "13",
            "pv": "58 (9d10 + 9)",
            "deslocamento": "0 m, natação 18 m",
            "atributos": make_attr(17, 16, 13, 11, 10, 10),
            "resistencias": "Fogo; concussão, perfurante e cortante de ataques não-mágicos",
            "imunidades_dano": "Veneno",
            "imunidades_condicao": "Agarrado, Caído, Envenenado, Exausto, Impedido, Inconsciente, Paralisado",
            "sentidos": "Percepção às cegas 9 m, Percepção passiva 10",
            "idiomas": "Compreende Aquan mas não fala",
            "nd": "3 (XP 700)",
            "tracos": [
                {"nome": "Invisível na Água", "descricao": "Invisível enquanto totalmente imersa em água."},
                {"nome": "Vínculo com a Água", "descricao": "Morre se abandonar a água à qual foi vinculada ou se a água for destruída."}
            ],
            "acoes": [
                {"nome": "Constrição", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 3 m. *Acerto:* 13 (3d6 + 3) concussão. Alvo Médio ou menor é agarrado (CD 13) e puxado 1,5 m, ficando impedido e afogando-se."}
            ],
            "descricao_lore": "Guardião serpentino elemental vinculado a fontes ou piscinas d'água sagradas ou profanas."
        },
        # Aparição
        {
            "nome": "Aparição",
            "tipo_tamanho": "Morto-vivo Médio, neutro e mau",
            "ca": "13",
            "pv": "67 (9d8 + 27)",
            "deslocamento": "0 m, voo 18 m (planar)",
            "atributos": make_attr(6, 16, 16, 12, 14, 15),
            "resistencias": "Ácido, elétrico, fogo, frio, trovejante; concussão, perfurante e cortante de ataques não-mágicos que não sejam de prata",
            "imunidades_dano": "Necrótico, Veneno",
            "imunidades_condicao": "Agarrado, Caído, Enfeitiçado, Envenenado, Exausto, Impedido, Inconsciente, Paralisado, Petrificado",
            "sentidos": "Visão no escuro 18 m, Percepção passiva 12",
            "idiomas": "Os idiomas que conhecia em vida",
            "nd": "5 (XP 1.800)",
            "tracos": [
                {"nome": "Movimento Incorpóreo", "descricao": "Move-se através de criaturas e objetos como terreno difícil. Sofre 5 (1d10) dano de energia se terminar turno em objeto."},
                {"nome": "Sensibilidade à Luz Solar", "descricao": "Desvantagem em ataques e percepção sob luz solar."}
            ],
            "acoes": [
                {"nome": "Drenar Vida", "descricao": "*Corpo-a-Corpo com Magia:* +6 para atingir, alcance 1,5 m. *Acerto:* 21 (4d8 + 3) necrótico. Con CD 14 ou o máximo de PV é reduzido no mesmo valor."},
                {"nome": "Criar Espectro", "descricao": "Ergue o espírito de humanoide morto recentemente como espectro sob seu controle (máximo 7)."}
            ],
            "descricao_lore": "Espírito incorpóreo malevolente impregnado de pura energia negativa que aniquila toda a vida."
        },
        # Arbusto Errante
        {
            "nome": "Arbusto Errante",
            "tipo_tamanho": "Planta Grande, imparcial",
            "ca": "15 (armadura natural)",
            "pv": "136 (16d10 + 48)",
            "deslocamento": "6 m, natação 6 m",
            "atributos": make_attr(18, 8, 16, 5, 10, 5),
            "pericias": "Furtividade +2",
            "resistencias": "Frio, Fogo",
            "imunidades_dano": "Elétrico",
            "imunidades_condicao": "Cego, Surdo, Exausto",
            "sentidos": "Percepção às cegas 18 m (cego além desse raio), Percepção passiva 10",
            "idiomas": "—",
            "nd": "5 (XP 1.800)",
            "tracos": [
                {"nome": "Absorção de Eletricidade", "descricao": "Cura PV iguais a qualquer dano elétrico sofrido."}
            ],
            "acoes": [
                {"nome": "Ataques Múltiplos", "descricao": "Realiza dois ataques de pancada. Se ambos atingirem alvo Médio ou menor, usa Engolfar."},
                {"nome": "Pancada", "descricao": "*Corpo-a-Corpo:* +7 para atingir, alcance 1,5 m. *Acerto:* 13 (2d8 + 4) concussão."},
                {"nome": "Engolfar", "descricao": "Engolfa criatura agarrada: cega, contida, sem ar, Con CD 14 no turno ou 13 (2d8 + 4) concussão."}
            ],
            "descricao_lore": "Amontoado podre e voraz de vegetação animada por relâmpagos ou magia feérica."
        },
        # Azer
        {
            "nome": "Azer",
            "tipo_tamanho": "Elemental Médio, leal e neutro",
            "ca": "17 (armadura natural, escudo)",
            "pv": "39 (6d8 + 12)",
            "deslocamento": "9 m",
            "atributos": make_attr(17, 12, 15, 12, 13, 10, {"Con": "+4"}),
            "testes_resistencia": "Con +4",
            "imunidades_dano": "Fogo, Veneno",
            "imunidades_condicao": "Envenenado",
            "sentidos": "Percepção passiva 11",
            "idiomas": "Ígneo",
            "nd": "2 (XP 450)",
            "tracos": [
                {"nome": "Armas Ardentes", "descricao": "Ataques com arma metálica causam 3 (1d6) de dano de fogo extra."},
                {"nome": "Corpo Ardente", "descricao": "Criatura que tocar ou atingir corpo-a-corpo a até 1,5 m sofre 5 (1d10) dano de fogo."},
                {"nome": "Iluminação", "descricao": "Emite luz plena a 3 m e penumbra por mais 3 m."}
            ],
            "acoes": [
                {"nome": "Martelo de Guerra", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 1,5 m. *Acerto:* 7 (1d8 + 3) concussão (ou 8 em duas mãos) + 3 (1d6) fogo."}
            ],
            "descricao_lore": "Mestres da forja de bronze e fogo esculpidos, nativos do Plano Elemental do Fogo."
        },
        # Banshee
        {
            "nome": "Banshee",
            "tipo_tamanho": "Morto-vivo Médio, caótico e mau",
            "ca": "12",
            "pv": "58 (13d8)",
            "deslocamento": "0 m, voo 12 m (planar)",
            "atributos": make_attr(1, 14, 10, 12, 11, 17, {"Sab": "+2", "Car": "+5"}),
            "testes_resistencia": "Sab +2, Car +5",
            "resistencias": "Ácido, elétrico, fogo, frio, trovejante; concussão, perfurante e cortante de ataques não-mágicos",
            "imunidades_condicao": "Agarrado, Caído, Enfeitiçado, Envenenado, Exausto, Impedido, Inconsciente, Paralisado, Petrificado",
            "sentidos": "Visão no escuro 18 m, Percepção passiva 10",
            "idiomas": "Comum, Élfico",
            "nd": "4 (XP 1.100)",
            "tracos": [
                {"nome": "Detectar Vida", "descricao": "Sente magicamente criaturas vivas a até 7,5 km."},
                {"nome": "Movimento Incorpóreo", "descricao": "Move-se através de criaturas e objetos como terreno difícil."}
            ],
            "acoes": [
                {"nome": "Toque Corruptor", "descricao": "*Corpo-a-Corpo com Magia:* +4 para atingir, alcance 1,5 m. *Acerto:* 12 (3d6 + 2) necrótico."},
                {"nome": "Aspecto Horripilante", "descricao": "Alvos a até 18 m passam em Sab CD 13 ou ficam amedrontados por 1 minuto."},
                {"nome": "Grito (1/Dia)", "descricao": "Fora da luz solar, criaturas a até 9 m passam em Con CD 13 ou caem a 0 PV (sucesso: 10 de dano necrótico)."}
            ],
            "descricao_lore": "Espírito lamentável de uma elfa bela que corrompeu seu dom e foi amaldiçoada na morte-vida."
        },
        # Basilisco
        {
            "nome": "Basilisco",
            "tipo_tamanho": "Monstruosidade Média, imparcial",
            "ca": "15 (armadura natural)",
            "pv": "52 (8d8 + 16)",
            "deslocamento": "6 m",
            "atributos": make_attr(16, 8, 15, 2, 8, 7),
            "sentidos": "Visão no escuro 18 m, Percepção passiva 9",
            "idiomas": "—",
            "nd": "3 (XP 700)",
            "tracos": [
                {"nome": "Olhar Petrificante", "descricao": "Criaturas que comecem o turno a até 9 m e o fitarem passam em Con CD 12 ou começam a virar pedra e ficam impedidas, falha seguinte petrifica."}
            ],
            "acoes": [
                {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 1,5 m. *Acerto:* 10 (2d6 + 3) perfurante + 7 (2d6) veneno."}
            ],
            "descricao_lore": "Predador de oito patas cujo olhar petrifica vítimas para consumi-las em rocha porosa."
        },
        # Behir
        {
            "nome": "Behir",
            "tipo_tamanho": "Monstruosidade Enorme, neutro e mau",
            "ca": "17 (armadura natural)",
            "pv": "168 (16d12 + 64)",
            "deslocamento": "15 m, escalada 12 m",
            "atributos": make_attr(23, 16, 18, 7, 14, 12),
            "pericias": "Furtividade +7, Percepção +6",
            "imunidades_dano": "Elétrico",
            "sentidos": "Visão no escuro 27 m, Percepção passiva 16",
            "idiomas": "Dracônico",
            "nd": "11 (XP 7.200)",
            "acoes": [
                {"nome": "Ataques Múltiplos", "descricao": "Realiza um ataque de mordida e um de constrição."},
                {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +10 para atingir, alcance 3 m. *Acerto:* 22 (3d10 + 6) perfurante."},
                {"nome": "Constrição", "descricao": "*Corpo-a-Corpo:* +10 para atingir, alcance 1,5 m. *Acerto:* 17 (2d10 + 6) concussão + 17 (2d10 + 6) cortante. Alvo Grande ou menor fica agarrado (CD 16) e impedido."},
                {"nome": "Sopro Elétrico (Recarrega 5–6)", "descricao": "Linha de 6x1,5 m causa 66 (12d10) dano elétrico (Des CD 16 metade)."},
                {"nome": "Engolir", "descricao": "Engole alvo Médio ou menor agarrado: cego, contido, sofre 21 (6d6) ácido no turno."}
            ],
            "descricao_lore": "Réptil centopeico gigante de doze patas criado por gigantes da tempestade na guerra contra dragões."
        }
    ]
    return monsters

print("Dataset base configurado.")
