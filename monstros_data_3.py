#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from builder_monstros import make_attr

def get_dragoes_e_outros():
    L = []
    
    # Dragão Vermelho Adulto
    L.append({
        "nome": "Dragão Vermelho Adulto", "tipo_tamanho": "Dragão Enorme, caótico e mau",
        "ca": "19 (armadura natural)", "pv": "256 (19d12 + 133)", "deslocamento": "12 m, escalada 12 m, voo 24 m",
        "atributos": make_attr(27, 10, 25, 16, 13, 21, {"Des": "+6", "Con": "+13", "Sab": "+7", "Car": "+11"}),
        "testes_resistencia": "Des +6, Con +13, Sab +7, Car +11",
        "pericias": "Furtividade +6, Percepção +13", "imunidades_dano": "Fogo",
        "sentidos": "Percepção às cegas 18 m, visão no escuro 36 m, Percepção passiva 23", "idiomas": "Comum, Dracônico", "nd": "17 (XP 18.000)",
        "tracos": [{"nome": "Resistência Lendária (3/Dia)", "descricao": "Se falhar em salvaguarda, pode escolher obter sucesso."}],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Usa Presença Aterradora e realiza três ataques: uma mordida e duas garras."},
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +14 para atingir, alcance 3 m. *Acerto:* 19 (2d10 + 8) perfurante + 10 (3d6) fogo."},
            {"nome": "Garra", "descricao": "*Corpo-a-Corpo:* +14 para atingir, alcance 1,5 m. *Acerto:* 15 (2d6 + 8) cortante."},
            {"nome": "Cauda", "descricao": "*Corpo-a-Corpo:* +11 para atingir, alcance 4,5 m. *Acerto:* 17 (2d8 + 8) concussão."},
            {"nome": "Presença Aterradora", "descricao": "Alvos a até 36 m passam em Sab CD 19 ou ficam amedrontados por 1 min."},
            {"nome": "Sopro Flamejante (Recarrega 5–6)", "descricao": "Cone de 18 m causa 63 (18d6) de dano de fogo (Destreza CD 21 reduz à metade)."}
        ],
        "acoes_lendarias": [
            {"nome": "Detectar", "descricao": "Realiza teste de Sabedoria (Percepção)."},
            {"nome": "Ataque com Cauda", "descricao": "Realiza um ataque de cauda."},
            {"nome": "Ataque com Asas (Custa 2 Ações)", "descricao": "Raio de 3 m passa em Des CD 22 ou sofre 15 (2d6 + 8) concussão e cai."}
        ],
        "descricao_lore": "Os mais avarentos e orgulhosos de todos os dragões verdadeiros, tiranos soberanos das montanhas."
    })

    # Dragão de Ouro Adulto
    L.append({
        "nome": "Dragão de Ouro Adulto", "tipo_tamanho": "Dragão Enorme, leal e bom",
        "ca": "19 (armadura natural)", "pv": "256 (19d12 + 133)", "deslocamento": "12 m, natação 12 m, voo 24 m",
        "atributos": make_attr(27, 14, 25, 16, 15, 24, {"Des": "+8", "Con": "+13", "Sab": "+8", "Car": "+13"}),
        "testes_resistencia": "Des +8, Con +13, Sab +8, Car +13",
        "pericias": "Furtividade +8, Intuição +8, Percepção +14, Persuasão +13", "imunidades_dano": "Fogo",
        "sentidos": "Percepção às cegas 18 m, visão no escuro 36 m, Percepção passiva 24", "idiomas": "Comum, Dracônico", "nd": "17 (XP 18.000)",
        "tracos": [
            {"nome": "Anfíbio", "descricao": "Respira ar e água."},
            {"nome": "Resistência Lendária (3/Dia)", "descricao": "Se falhar em salvaguarda, pode escolher obter sucesso."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Usa Presença Aterradora e realiza uma mordida e duas garras."},
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +14 para atingir, alcance 3 m. *Acerto:* 19 (2d10 + 8) perfurante."},
            {"nome": "Garra", "descricao": "*Corpo-a-Corpo:* +14 para atingir, alcance 1,5 m. *Acerto:* 15 (2d6 + 8) cortante."},
            {"nome": "Cauda", "descricao": "*Corpo-a-Corpo:* +14 para atingir, alcance 4,5 m. *Acerto:* 17 (2d8 + 8) concussão."},
            {"nome": "Sopro Flamejante (Recarrega 5–6)", "descricao": "Cone de 18 m causa 66 (12d10) fogo (Destreza CD 21 metade)."},
            {"nome": "Sopro Enfraquecedor", "descricao": "Cone de 18 m: Força CD 21 ou desvantagem em ataques e testes de Força por 1 min."},
            {"nome": "Mudar Forma", "descricao": "Metamorfoseia-se em humanoide ou besta mantendo estatísticas chave."}
        ],
        "acoes_lendarias": [
            {"nome": "Detectar", "descricao": "Realiza teste de Sabedoria (Percepção)."},
            {"nome": "Ataque com Cauda", "descricao": "Realiza ataque de cauda."},
            {"nome": "Ataque com Asas (Custa 2 Ações)", "descricao": "Raio de 3 m sofre 15 (2d6 + 8) concussão (Des CD 22)."}
        ],
        "descricao_lore": "Os mais majestosos e sábios dragões metálicos, paladinos implacáveis dedicados a combater o mal."
    })

    # Observador (Beholder)
    L.append({
        "nome": "Observador", "tipo_tamanho": "Aberração Grande, leal e mau",
        "ca": "18 (armadura natural)", "pv": "180 (19d10 + 76)", "deslocamento": "0 m, voo 6 m (planar)",
        "atributos": make_attr(10, 14, 18, 17, 15, 17, {"Int": "+8", "Sab": "+7", "Car": "+8"}),
        "testes_resistencia": "Int +8, Sab +7, Car +8", "pericias": "Percepção +12",
        "imunidades_condicao": "Caído", "sentidos": "Visão no escuro 36 m, Percepção passiva 22",
        "idiomas": "Dialeto Subterrâneo, Subcomum", "nd": "13 (XP 10.000)",
        "tracos": [{"nome": "Cone Antimagia", "descricao": "Olho central projeta cone de 45 m de antimagia (suprime magias e raios oculares)."}],
        "acoes": [
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 1,5 m. *Acerto:* 14 (4d6) perfurante."},
            {"nome": "Raios Oculares", "descricao": "Dispara 3 raios mágicos aleatórios (Enfeitiçador, Paralisante, Apavorante, Letárgico, Enervante, Telecinético, Adormecente, Petrificante, Desintegrador ou Mortal). CD 16."}
        ],
        "acoes_lendarias": [{"nome": "Raio Ocular", "descricao": "Usa um raio ocular aleatório."}],
        "descricao_lore": "Esferas tirânicas de olhos múltiplos, xenófobas e paranoicas que esculpem seus covis verticais com raios desintegradores."
    })

    # Lich
    L.append({
        "nome": "Lich", "tipo_tamanho": "Morto-vivo Médio, qualquer tendência maligna",
        "ca": "17 (armadura natural)", "pv": "135 (18d8 + 54)", "deslocamento": "9 m",
        "atributos": make_attr(11, 16, 16, 20, 14, 16, {"Con": "+10", "Int": "+12", "Sab": "+9"}),
        "testes_resistencia": "Con +10, Int +12, Sab +9",
        "pericias": "Arcanismo +18, História +12, Intuição +9, Percepção +9",
        "resistencias": "Frio, elétrico, necrótico", "imunidades_dano": "Veneno; concussão, cortante e perfurante de não-mágicos",
        "imunidades_condicao": "Amedrontado, enfeitiçado, envenenado, exausto, paralisado",
        "sentidos": "Visão verdadeira 36 m, Percepção passiva 19", "idiomas": "Comum e mais 5 idiomas", "nd": "21 (XP 33.000)",
        "tracos": [
            {"nome": "Conjuração", "descricao": "Conjurador 18º nível (Inteligência CD 20, +12 ataque). Magias: raio de gelo, escudo arcano, mísseis mágicos, reflexos, animar mortos, bola de fogo, contramágica, dissipar magia, porta dimensional, névoa mortal, desintegrar, globo de invulnerabilidade, dedo da morte, palavra de poder matar."},
            {"nome": "Rejuvenescimento", "descricao": "Se destruído, reforma um novo corpo em 1d10 dias a 1,5 m de sua filactéria."},
            {"nome": "Resistência Lendária (3/Dia)", "descricao": "Pode escolher ter sucesso em salvaguarda."}
        ],
        "acoes": [
            {"nome": "Toque Paralisante", "descricao": "*Corpo-a-Corpo com Magia:* +12 para atingir. *Acerto:* 10 (3d6) frio + Con CD 18 ou paralisado por 1 min."}
        ],
        "acoes_lendarias": [
            {"nome": "Truque", "descricao": "Conjura um truque."},
            {"nome": "Toque Paralisante (2 Ações)", "descricao": "Usa Toque Paralisante."},
            {"nome": "Olhar Aterrorizante (2 Ações)", "descricao": "Alvo a até 3 m passa em Sab CD 18 ou fica amedrontado por 1 min."},
            {"nome": "Romper Vida (3 Ações)", "descricao": "Criaturas a até 6 m passam em Con CD 18 ou sofrem 21 (6d6) necrótico."}
        ],
        "descricao_lore": "Magos supremos que sacrificaram a própria mortalidade e aprisionaram suas almas em filactérias para alcançar a imortalidade."
    })

    # Mímico
    L.append({
        "nome": "Mímico", "tipo_tamanho": "Monstruosidade Média (metamorfo), neutro",
        "ca": "12 (armadura natural)", "pv": "58 (9d8 + 18)", "deslocamento": "4,5 m",
        "atributos": make_attr(17, 12, 15, 5, 13, 8),
        "pericias": "Furtividade +5", "imunidades_dano": "Ácido", "imunidades_condicao": "Caído",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 11", "idiomas": "—", "nd": "2 (XP 450)",
        "tracos": [
            {"nome": "Adesivo", "descricao": "Adere a qualquer criatura ou objeto que toque. Criatura Enorme ou menor fica agarrada (CD 13, desvantagem para escapar)."},
            {"nome": "Aparência Falsa", "descricao": "Imóvel, indistinguível de um objeto comum como baú ou porta."},
            {"nome": "Metamorfo", "descricao": "Metamorfoseia-se em um objeto ou em sua forma amorfa."}
        ],
        "acoes": [
            {"nome": "Pseudópode", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 1,5 m. *Acerto:* 7 (1d8 + 3) concussão + adere ao alvo."},
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 1,5 m. *Acerto:* 7 (1d8 + 3) perfurante + 4 (1d8) ácido."}
        ],
        "descricao_lore": "Predadores metamorfos vorazes que se disfarçam de baús, portas e tesouros para atrair aventureiros incautos."
    })

    # Tarrasque
    L.append({
        "nome": "Tarrasque", "tipo_tamanho": "Monstruosidade Imensa (titã), imparcial",
        "ca": "25 (armadura natural)", "pv": "676 (33d20 + 330)", "deslocamento": "12 m",
        "atributos": make_attr(30, 11, 30, 3, 11, 11, {"Int": "+5", "Sab": "+9", "Car": "+9"}),
        "testes_resistencia": "Int +5, Sab +9, Car +9",
        "imunidades_dano": "Fogo, veneno; concussão, cortante e perfurante de ataques não-mágicos",
        "imunidades_condicao": "Amedrontado, enfeitiçado, envenenado, paralisado",
        "sentidos": "Percepção às cegas 36 m, Percepção passiva 10", "idiomas": "—", "nd": "30 (XP 155.000)",
        "tracos": [
            {"nome": "Carapaça Reflexiva", "descricao": "Em mísseis mágicos ou magias de linha/ataque à distância, 1-5 imune; em 6 reflete de volta no conjurador."},
            {"nome": "Monstro de Cerco", "descricao": "Causa o dobro de dano a estruturas."},
            {"nome": "Resistência Lendária (3/Dia)", "descricao": "Pode escolher obter sucesso em teste de resistência."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem em salvaguardas contra magias."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Usa Presença Aterradora e realiza cinco ataques: uma mordida, duas garras, um chifre e uma cauda."},
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +19 para atingir, alcance 3 m. *Acerto:* 36 (4d12 + 10) perfurante. Alvo fica agarrado (CD 20)."},
            {"nome": "Garras", "descricao": "*Corpo-a-Corpo:* +19 para atingir, alcance 4,5 m. *Acerto:* 28 (4d8 + 10) cortante."},
            {"nome": "Chifres", "descricao": "*Corpo-a-Corpo:* +19 para atingir, alcance 3 m. *Acerto:* 32 (4d10 + 10) perfurante."},
            {"nome": "Cauda", "descricao": "*Corpo-a-Corpo:* +19 para atingir, alcance 6 m. *Acerto:* 24 (4d6 + 10) concussão. Força CD 20 ou cai no chão."},
            {"nome": "Engolir", "descricao": "Engole criatura Grande ou menor agarrada: cega, impedida, sofre 56 (16d6) ácido por turno."}
        ],
        "acoes_lendarias": [
            {"nome": "Ataque", "descricao": "Realiza um ataque de garra ou cauda."},
            {"nome": "Movimento", "descricao": "Move-se até metade do seu deslocamento."},
            {"nome": "Mastigar (Custa 2 Ações)", "descricao": "Realiza uma mordida ou usa Engolir."}
        ],
        "descricao_lore": "O titã apocalíptico e o predador mais colossal e destruidor do Plano Material."
    })

    # Troll
    L.append({
        "nome": "Troll", "tipo_tamanho": "Gigante Grande, caótico e mau",
        "ca": "15 (armadura natural)", "pv": "84 (8d10 + 40)", "deslocamento": "9 m",
        "atributos": make_attr(18, 13, 20, 7, 9, 7),
        "pericias": "Percepção +2", "sentidos": "Visão no escuro 18 m, Percepção passiva 12", "idiomas": "Gigante", "nd": "5 (XP 1.800)",
        "tracos": [
            {"nome": "Faro Aguçado", "descricao": "Vantagem em testes de Percepção baseados em olfato."},
            {"nome": "Regeneração", "descricao": "Recupera 10 PV no início de seu turno. Se sofrer ácido ou fogo, não regenera no turno seguinte. Morre apenas com 0 PV sem regenerar."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza três ataques: uma mordida e duas garras."},
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +7 para atingir, alcance 1,5 m. *Acerto:* 7 (1d6 + 4) perfurante."},
            {"nome": "Garra", "descricao": "*Corpo-a-Corpo:* +7 para atingir, alcance 1,5 m. *Acerto:* 11 (2d6 + 4) cortante."}
        ],
        "descricao_lore": "Gigantes grotescos e carnívoros cuja carne regenera ferimentos rapidamente exceto contra fogo e ácido."
    })

    # Unicórnio
    L.append({
        "nome": "Unicórnio", "tipo_tamanho": "Celestial Grande, leal e bom",
        "ca": "12", "pv": "67 (9d10 + 18)", "deslocamento": "15 m",
        "atributos": make_attr(18, 14, 15, 11, 17, 16),
        "imunidades_dano": "Veneno", "imunidades_condicao": "Enfeitiçado, Envenenado, Paralisado",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 13", "idiomas": "Celestial, Élfico, Silvestre, telepatia 18 m", "nd": "5 (XP 1.800)",
        "tracos": [
            {"nome": "Armas Mágicas", "descricao": "Ataques com armas são mágicos."},
            {"nome": "Conjuração Inata", "descricao": "Carisma (CD 14). À vontade: detectar bem e mal, druidismo, passos sem pegadas; 1/dia: acalmar emoções, constrição, dissipar o bem e mal."},
            {"nome": "Investida", "descricao": "Se mover 6 m em linha reta e atingir com chifre, causa 9 (2d8) extra e Força CD 15 ou cai no chão."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem contra magias."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Um ataque de cascos e um de chifre."},
            {"nome": "Cascos", "descricao": "*Corpo-a-Corpo:* +7 para atingir, alcance 1,5 m. *Acerto:* 11 (2d6 + 4) concussão."},
            {"nome": "Chifre", "descricao": "*Corpo-a-Corpo:* +7 para atingir, alcance 1,5 m. *Acerto:* 8 (1d8 + 4) perfurante."},
            {"nome": "Toque Curativo (3/Dia)", "descricao": "Cura 11 (2d8 + 2) PV e cura doenças e venenos."},
            {"nome": "Teletransporte", "descricao": "Teletransporta-se com até 3 aliados até 1,5 km."}
        ],
        "acoes_lendarias": [
            {"nome": "Cascos", "descricao": "Realiza um ataque de cascos."},
            {"nome": "Escudo Cintilante (2 Ações)", "descricao": "Concede +2 de CA a si ou aliado a até 18 m."},
            {"nome": "Curar-se (3 Ações)", "descricao": "Recupera magicamente 11 (2d8 + 2) PV."}
        ],
        "descricao_lore": "Guardiões sagrados das florestas encantadas e servidores divinos da luz e pureza."
    })

    # Urso-Coruja
    L.append({
        "nome": "Urso-Coruja", "tipo_tamanho": "Monstruosidade Grande, imparcial",
        "ca": "13 (armadura natural)", "pv": "59 (7d10 + 21)", "deslocamento": "12 m",
        "atributos": make_attr(20, 12, 17, 3, 12, 7),
        "pericias": "Percepção +3", "sentidos": "Visão no escuro 18 m, Percepção passiva 13", "idiomas": "—", "nd": "3 (XP 700)",
        "tracos": [{"nome": "Visão e Faro Aguçados", "descricao": "Vantagem em testes de Percepção relacionados à visão e olfato."}],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza uma bicada e um ataque de garras."},
            {"nome": "Bicada", "descricao": "*Corpo-a-Corpo:* +7 para atingir, alcance 1,5 m. *Acerto:* 10 (1d10 + 5) perfurante."},
            {"nome": "Garras", "descricao": "*Corpo-a-Corpo:* +7 para atingir, alcance 1,5 m. *Acerto:* 14 (2d8 + 5) cortante."}
        ],
        "descricao_lore": "Predador feroz e territorialista que combina a fúria corporal de um urso com a cabeça e bico de uma coruja gigante."
    })

    # Vampiro
    L.append({
        "nome": "Vampiro", "tipo_tamanho": "Morto-vivo Médio (metamorfo), leal e mau",
        "ca": "16 (armadura natural)", "pv": "144 (17d8 + 68)", "deslocamento": "9 m",
        "atributos": make_attr(18, 18, 18, 17, 15, 18, {"Des": "+9", "Sab": "+7", "Car": "+9"}),
        "testes_resistencia": "Des +9, Sab +7, Car +9", "pericias": "Furtividade +9, Percepção +7",
        "resistencias": "Necrótico; concussão, cortante e perfurante de ataques não-mágicos",
        "sentidos": "Visão no escuro 36 m, Percepção passiva 17", "idiomas": "Os idiomas que conhecia em vida", "nd": "13 (XP 10.000)",
        "tracos": [
            {"nome": "Regeneração", "descricao": "Recupera 20 PV no início do turno (exceto sob luz solar ou água corrente)."},
            {"nome": "Metamorfo", "descricao": "Pode se transformar em morcego Miúdo, névoa Média ou voltar à forma normal."},
            {"nome": "Neblina de Escapada", "descricao": "Ao cair a 0 PV fora do caixão, vira névoa e deve alcançar seu local de descanso em até 2 horas para se recompor."},
            {"nome": "Fraquezas Vampíricas", "descricao": "Estaca no coração paralisa; água corrente causa 20 dano de ácido; luz solar causa 20 radiante e desvantagem; não entra em residência sem convite."},
            {"nome": "Resistência Lendária (3/Dia)", "descricao": "Pode escolher ter sucesso em salvaguarda."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Dois ataques, apenas um podendo ser mordida."},
            {"nome": "Golpe Desarmado", "descricao": "*Corpo-a-Corpo:* +9 para atingir, alcance 1,5 m. *Acerto:* 8 (1d8 + 4) concussão ou agarra (CD 18)."},
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +9 para atingir. *Acerto:* 7 (1d6 + 4) perfurante + 10 (3d6) necrótico; reduz PV máximo e cura o vampiro no mesmo valor."},
            {"nome": "Enfeitiçar", "descricao": "Humanoide a até 9 m passa em Sab CD 17 ou fica enfeitiçado por 24h."},
            {"nome": "Filhos da Noite (1/Dia)", "descricao": "Convoca 2d4 enxames de morcegos/ratos ou 3d6 lobos ao ar livre."}
        ],
        "acoes_lendarias": [
            {"nome": "Movimento", "descricao": "Move-se até seu deslocamento sem provocar ataques de oportunidade."},
            {"nome": "Golpe Desarmado", "descricao": "Realiza um golpe desarmado."},
            {"nome": "Mordida (Custa 2 Ações)", "descricao": "Realiza uma mordida."}
        ],
        "descricao_lore": "Monarcas da noite e predadores imortais que drenam o sangue dos vivos e descansam em caixões profanos."
    })

    return L

print("Lote 3 gerado.")
