#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from builder_monstros import make_attr

def get_resto_monstros():
    L = []

    # Dinossauros
    L.append({
        "nome": "Tiranossauro", "tipo_tamanho": "Besta Enorme, imparcial",
        "ca": "13 (armadura natural)", "pv": "136 (13d12 + 52)", "deslocamento": "15 m",
        "atributos": make_attr(25, 10, 19, 2, 12, 9),
        "pericias": "Percepção +4", "sentidos": "Percepção passiva 14", "idiomas": "—", "nd": "8 (XP 3.900)",
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza uma mordida e um ataque de cauda em alvos diferentes."},
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +10 para atingir, alcance 3 m. *Acerto:* 33 (4d12 + 7) perfurante. Alvo Médio ou menor fica agarrado e impedido (CD 17)."},
            {"nome": "Cauda", "descricao": "*Corpo-a-Corpo:* +10 para atingir, alcance 3 m. *Acerto:* 20 (3d8 + 7) concussão."}
        ],
        "descricao_lore": "O ápice dos predadores terrestres pré-históricos de mandíbulas devastadoras."
    })

    L.append({
        "nome": "Tricerátops", "tipo_tamanho": "Besta Enorme, imparcial",
        "ca": "13 (armadura natural)", "pv": "95 (10d12 + 30)", "deslocamento": "15 m",
        "atributos": make_attr(22, 9, 17, 2, 11, 5),
        "sentidos": "Percepção passiva 10", "idiomas": "—", "nd": "5 (XP 1.800)",
        "tracos": [{"nome": "Atropelar em Investida", "descricao": "Se mover 6 m em linha reta e acertar chifrada, Força CD 13 ou o alvo cai no chão e permite ataque bônus de pisotear."}],
        "acoes": [
            {"nome": "Chifres", "descricao": "*Corpo-a-Corpo:* +9 para atingir, alcance 1,5 m. *Acerto:* 24 (4d8 + 6) perfurante."},
            {"nome": "Pisotear", "descricao": "*Corpo-a-Corpo:* +9 para atingir, alcance 1,5 m em alvo caído. *Acerto:* 22 (3d10 + 6) concussão."}
        ],
        "descricao_lore": "Dinossauro herbívoro fortemente blindado de três chifres formidáveis."
    })

    # Dríade
    L.append({
        "nome": "Dríade", "tipo_tamanho": "Fada Média, neutro",
        "ca": "11 (16 com pele de árvore)", "pv": "22 (5d8)", "deslocamento": "9 m",
        "atributos": make_attr(10, 12, 11, 14, 15, 18),
        "pericias": "Furtividade +5, Percepção +4", "sentidos": "Visão no escuro 18 m, Percepção passiva 14", "idiomas": "Élfico, Silvestre", "nd": "1 (XP 200)",
        "tracos": [
            {"nome": "Caminhar em Árvores", "descricao": "Gasta 3 m de deslocamento para entrar numa árvore viva e sair de outra a até 18 m."},
            {"nome": "Conjuração Inata", "descricao": "Carisma (CD 14). À vontade: druidismo; 3/dia: bom fruto, constrição; 1/dia: bordão místico, passos sem pegadas, pele de árvore."},
            {"nome": "Falar com Bestas e Plantas", "descricao": "Comunica-se com animais e plantas naturalmente."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem em salvaguardas contra magia."}
        ],
        "acoes": [
            {"nome": "Clava", "descricao": "*Corpo-a-Corpo:* +2 para atingir (+6 com bordão místico). *Acerto:* 2 (1d4) concussão ou 8 (1d8 + 4) com bordão místico."},
            {"nome": "Encanto Feérico", "descricao": "Alvo humanoide ou besta a até 9 m passa em Sab CD 14 ou fica magicamente enfeitiçado por 24h considerando a dríade amiga confiável."}
        ],
        "descricao_lore": "Espíritos feéricos guardiões ligados à alma e seiva de carvalhos e árvores sagradas."
    })

    # Drider
    L.append({
        "nome": "Drider", "tipo_tamanho": "Monstruosidade Grande, caótico e mau",
        "ca": "19 (armadura natural)", "pv": "123 (13d10 + 52)", "deslocamento": "9 m, escalada 9 m",
        "atributos": make_attr(16, 16, 18, 13, 14, 12),
        "pericias": "Furtividade +9, Percepção +5", "sentidos": "Visão no escuro 36 m, Percepção passiva 15",
        "idiomas": "Élfico, Subcomum", "nd": "6 (XP 2.300)",
        "tracos": [
            {"nome": "Ancestralidade Feérica", "descricao": "Vantagem contra encantamento e imune a sono mágico."},
            {"nome": "Andar em Teias", "descricao": "Ignora restrições de movimento de teias."},
            {"nome": "Escalada Aracnídea", "descricao": "Escala tetos e paredes com facilidade."},
            {"nome": "Sensibilidade à Luz Solar", "descricao": "Desvantagem em ataques e percepção sob sol."},
            {"nome": "Conjuração Inata", "descricao": "Sabedoria (CD 13). À vontade: globos de luz; 3/dia: escuridão, fogo das fadas."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza três ataques de espada longa ou arco longo, podendo trocar um por mordida."},
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +6 para atingir, alcance 1,5 m. *Acerto:* 5 (1d4 + 3) perfurante + 9 (2d8) veneno."},
            {"nome": "Espada Longa", "descricao": "*Corpo-a-Corpo:* +6 para atingir. *Acerto:* 7 (1d8 + 3) cortante (8 com 2 mãos)."},
            {"nome": "Arco Longo", "descricao": "*Distância:* +6 para atingir, 45/180 m. *Acerto:* 7 (1d8 + 3) perfurante + 4 (1d8) veneno."}
        ],
        "descricao_lore": "Drow nobres transformados pela Rainha Aranha Lolth em aberrações centaurescas com corpo aracnídeo."
    })

    # Duergar
    L.append({
        "nome": "Duergar", "tipo_tamanho": "Humanoide Médio (anão), leal e mau",
        "ca": "16 (brunea, escudo)", "pv": "26 (4d8 + 8)", "deslocamento": "7,5 m",
        "atributos": make_attr(14, 11, 14, 11, 10, 9),
        "resistencias": "Veneno", "sentidos": "Visão no escuro 36 m, Percepção passiva 10",
        "idiomas": "Anão, Subcomum", "nd": "1 (XP 200)",
        "tracos": [
            {"nome": "Resistência Duergar", "descricao": "Vantagem contra venenos, magias, ilusões, paralisia e encantamento."},
            {"nome": "Sensibilidade à Luz Solar", "descricao": "Desvantagem em ataques sob sol."}
        ],
        "acoes": [
            {"nome": "Aumentar (Recarrega Curto/Longo)", "descricao": "Por 1 min cresce para Grande, dobra dados de dano corpo-a-corpo e ganha vantagem em Força."},
            {"nome": "Picareta de Guerra", "descricao": "*Corpo-a-Corpo:* +4 para atingir. *Acerto:* 6 (1d8 + 2) perfurante (ou 11 [2d8 + 2] aumentado)."},
            {"nome": "Azagaia", "descricao": "*Distância:* +4 para atingir. *Acerto:* 5 (1d6 + 2) (ou 9 [2d6 + 2] aumentado)."},
            {"nome": "Invisibilidade (Recarrega Curto/Longo)", "descricao": "Fica invisível magicamente por até 1 hora."}
        ],
        "descricao_lore": "Anões cinzentos das profundezas do Subterrâneo, tirânicos escravistas de mente impenetrável."
    })

    # Duplo (Doppelganger)
    L.append({
        "nome": "Duplo", "tipo_tamanho": "Monstruosidade Média (metamorfo), neutro",
        "ca": "14", "pv": "52 (8d8 + 16)", "deslocamento": "9 m",
        "atributos": make_attr(11, 18, 14, 11, 12, 14),
        "pericias": "Enganação +6, Intuição +4", "imunidades_condicao": "Enfeitiçado",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 11", "idiomas": "Comum", "nd": "3 (XP 700)",
        "tracos": [
            {"nome": "Metamorfo", "descricao": "Metamorfoseia-se em qualquer humanoide Pequeno ou Médio visto."},
            {"nome": "Emboscador", "descricao": "Vantagem em ataques contra alvos surpreendidos."},
            {"nome": "Ataque Surpresa", "descricao": "Causa 10 (3d6) de dano extra em alvo surpreendido na 1ª rodada."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza dois ataques de pancada."},
            {"nome": "Pancada", "descricao": "*Corpo-a-Corpo:* +6 para atingir, alcance 1,5 m. *Acerto:* 7 (1d6 + 4) concussão."},
            {"nome": "Ler Pensamentos", "descricao": "Lê pensamentos superficiais de criatura a até 18 m, ganhando vantagem em perícias sociais."}
        ],
        "descricao_lore": "Metamorfos ardilosos que roubam identidades e memórias superficiais de suas vítimas."
    })

    # Elementais dos 4 Elementos
    L.append({
        "nome": "Elemental do Fogo", "tipo_tamanho": "Elemental Grande, neutro",
        "ca": "13", "pv": "102 (12d10 + 36)", "deslocamento": "15 m",
        "atributos": make_attr(10, 17, 16, 6, 10, 7),
        "resistencias": "Concussão, cortante e perfurante de ataques não-mágicos", "imunidades_dano": "Fogo, Veneno",
        "imunidades_condicao": "Agarrado, Caído, Envenenado, Exausto, Impedido, Inconsciente, Paralisado, Petrificado",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 10", "idiomas": "Ignan", "nd": "5 (XP 1.800)",
        "tracos": [
            {"nome": "Forma de Fogo", "descricao": "Passa por aberturas de 2,5 cm. Criatura que tocar sofre 5 (1d10) fogo e se incendeia."},
            {"nome": "Iluminação", "descricao": "Emite luz plena 9 m e penumbra por mais 9 m."},
            {"nome": "Susceptibilidade à Água", "descricao": "Sofre 1 ponto de dano de frio por cada 1,5 m na água ou 4L jogados."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza dois ataques de toque."},
            {"nome": "Toque", "descricao": "*Corpo-a-Corpo:* +6 para atingir, alcance 1,5 m. *Acerto:* 10 (2d6 + 3) fogo e incendeia o alvo."}
        ],
        "descricao_lore": "Espírito vivo do fogo elemental ardente que consome tudo em cinzas."
    })

    L.append({
        "nome": "Elemental da Água", "tipo_tamanho": "Elemental Grande, neutro",
        "ca": "14", "pv": "114 (12d10 + 48)", "deslocamento": "9 m, natação 27 m",
        "atributos": make_attr(18, 14, 18, 5, 10, 8),
        "resistencias": "Ácido; concussão, cortante e perfurante de não-mágicos", "imunidades_dano": "Veneno",
        "imunidades_condicao": "Agarrado, Caído, Envenenado, Exausto, Impedido, Inconsciente, Paralisado, Petrificado",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 10", "idiomas": "Aquan", "nd": "5 (XP 1.800)",
        "tracos": [
            {"nome": "Forma de Água", "descricao": "Pode entrar e parar no espaço de criatura hostil e passar por frestas de 2,5 cm."},
            {"nome": "Congelar", "descricao": "Ao sofrer dano de frio, deslocamento é reduzido em 6 m."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza dois ataques de pancada."},
            {"nome": "Pancada", "descricao": "*Corpo-a-Corpo:* +7 para atingir, alcance 1,5 m. *Acerto:* 13 (2d8 + 4) concussão."},
            {"nome": "Engolfar (Recarrega 4–6)", "descricao": "Força CD 15 ou sofre 13 (2d8 + 4) concussão, agarrado e afogado dentro do elemental."}
        ],
        "descricao_lore": "Onda viva de água primordial que afoga e esmaga oponentes em turbilhões."
    })

    L.append({
        "nome": "Elemental da Terra", "tipo_tamanho": "Elemental Grande, neutro",
        "ca": "17 (armadura natural)", "pv": "126 (12d10 + 60)", "deslocamento": "9 m, escavação 9 m",
        "atributos": make_attr(20, 8, 20, 5, 10, 5),
        "vulnerabilidades": "Trovejante", "resistencias": "Concussão, cortante e perfurante de não-mágicos",
        "imunidades_dano": "Veneno", "imunidades_condicao": "Agarrado, Caído, Envenenado, Exausto, Impedido, Inconsciente, Paralisado, Petrificado",
        "sentidos": "Visão no escuro 18 m, sentido sísmico 18 m, Percepção passiva 10", "idiomas": "Terran", "nd": "5 (XP 1.800)",
        "tracos": [
            {"nome": "Deslizar na Terra", "descricao": "Escava rocha e terra sem perturbar a matéria."},
            {"nome": "Monstro de Cerco", "descricao": "Causa dobro de dano a estruturas."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Dois ataques de pancada."},
            {"nome": "Pancada", "descricao": "*Corpo-a-Corpo:* +8 para atingir, alcance 3 m. *Acerto:* 14 (2d8 + 5) concussão."}
        ],
        "descricao_lore": "Massa titânica de rocha e minerais vivos que desliza pela terra como líquido."
    })

    L.append({
        "nome": "Elemental do Ar", "tipo_tamanho": "Elemental Grande, neutro",
        "ca": "15", "pv": "90 (12d10 + 24)", "deslocamento": "0 m, voo 27 m (planar)",
        "atributos": make_attr(14, 20, 14, 6, 10, 6),
        "resistencias": "Elétrico, trovejante; concussão, cortante e perfurante de não-mágicos", "imunidades_dano": "Veneno",
        "imunidades_condicao": "Agarrado, Caído, Envenenado, Exausto, Impedido, Inconsciente, Paralisado, Petrificado",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 10", "idiomas": "Auran", "nd": "5 (XP 1.800)",
        "tracos": [{"nome": "Forma de Ar", "descricao": "Passa por aberturas de até 2,5 cm sem se espremer."}],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza dois ataques de pancada."},
            {"nome": "Pancada", "descricao": "*Corpo-a-Corpo:* +8 para atingir, alcance 1,5 m. *Acerto:* 14 (2d8 + 5) concussão."},
            {"nome": "Vendaval (Recarrega 4–6)", "descricao": "Criaturas no espaço passam em Força CD 13 ou sofrem 15 (3d8 + 2) e são arremessadas 6 m caindo no chão."}
        ],
        "descricao_lore": "Turbilhão aéreo senciente capaz de transformar-se em ciclone devastador."
    })

    # Fantasma
    L.append({
        "nome": "Fantasma", "tipo_tamanho": "Morto-vivo Médio, qualquer tendência",
        "ca": "11", "pv": "45 (10d8)", "deslocamento": "0 m, voo 12 m (planar)",
        "atributos": make_attr(7, 13, 10, 10, 12, 17),
        "resistencias": "Ácido, elétrico, fogo, trovejante; concussão, perfurante e cortante de armas não-mágicas",
        "imunidades_dano": "Frio, necrótico, veneno", "imunidades_condicao": "Agarrado, caído, enfeitiçado, envenenado, exausto, impedido, inconsciente, paralisado, petrificado",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 11", "idiomas": "Idiomas de quando era vivo", "nd": "4 (XP 1.100)",
        "tracos": [
            {"nome": "Movimento Incorpóreo", "descricao": "Atravessa objetos e criaturas como terreno difícil."},
            {"nome": "Visão Etérea", "descricao": "Vê até 18 m no Plano Etéreo a partir do Material e vice-versa."}
        ],
        "acoes": [
            {"nome": "Toque Degradante", "descricao": "*Corpo-a-Corpo com Magia:* +5 para atingir. *Acerto:* 17 (4d6 + 3) necrótico."},
            {"nome": "Forma Etérea", "descricao": "Transita entre Plano Material e Fronteira Etérea."},
            {"nome": "Aspecto Horripilante", "descricao": "Sab CD 13 ou amedrontado 1 min (se falhar por 5+, envelhece 1d4x10 anos)."},
            {"nome": "Possessão (Recarrega 6)", "descricao": "Humanoide a até 1,5 m: Carisma CD 13 ou o fantasma assume o controle total do seu corpo."}
        ],
        "descricao_lore": "Alma de criatura falecida presa ao mundo por negócios inacabados, vingança ou dor."
    })

    # Galeb Duhr
    L.append({
        "nome": "Galeb Duhr", "tipo_tamanho": "Elemental Médio, neutro",
        "ca": "16 (armadura natural)", "pv": "85 (9d8 + 45)", "deslocamento": "4,5 m (9 m rolando, 18 m ladeira abaixo)",
        "atributos": make_attr(20, 14, 20, 11, 12, 11),
        "resistencias": "Concussão, perfurante e cortante de não-mágicos", "imunidades_dano": "Veneno",
        "imunidades_condicao": "Envenenado, exausto, paralisado, petrificado",
        "sentidos": "Visão no escuro 18 m, sentido sísmico 18 m, Percepção passiva 11", "idiomas": "Terran", "nd": "6 (XP 2.300)",
        "tracos": [
            {"nome": "Aparência Falsa", "descricao": "Imóvel, é indistinguível de um pedregulho comum."},
            {"nome": "Investida Rolante", "descricao": "Ao rolar 6 m e acertar pancada, causa 7 (2d6) extra e Força CD 16 ou cai."}
        ],
        "acoes": [
            {"nome": "Pancada", "descricao": "*Corpo-a-Corpo:* +8 para atingir, alcance 1,5 m. *Acerto:* 12 (2d6 + 5) concussão."},
            {"nome": "Animar Pedregulhos (1/Dia)", "descricao": "Anima até dois pedregulhos próximos que lutam sob seu comando."}
        ],
        "descricao_lore": "Pedregulho vivo de pedra elemental com membros atarracados e memória ancestral das rochas."
    })

    # Gárgula
    L.append({
        "nome": "Gárgula", "tipo_tamanho": "Elemental Médio, caótico e mau",
        "ca": "15 (armadura natural)", "pv": "52 (7d8 + 21)", "deslocamento": "9 m, voo 18 m",
        "atributos": make_attr(15, 11, 16, 6, 11, 7),
        "resistencias": "Concussão, perfurante e cortante de armas sem adamante", "imunidades_dano": "Veneno",
        "imunidades_condicao": "Envenenado, exausto, petrificado", "sentidos": "Visão no escuro 18 m, Percepção passiva 10",
        "idiomas": "Terran", "nd": "2 (XP 450)",
        "tracos": [{"nome": "Aparência Falsa", "descricao": "Imóvel, é indistinguível de uma estátua esculpida."}],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Uma mordida e uma garra."},
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +4 para atingir. *Acerto:* 5 (1d6 + 2) perfurante."},
            {"nome": "Garras", "descricao": "*Corpo-a-Corpo:* +4 para atingir. *Acerto:* 5 (1d6 + 2) cortante."}
        ],
        "descricao_lore": "Monstros alados de pedra esculpida do mal elemental que vigiam telhados e ruínas."
    })

    # Golem de Ferro
    L.append({
        "nome": "Golem de Ferro", "tipo_tamanho": "Constructo Grande, imparcial",
        "ca": "20 (armadura natural)", "pv": "210 (20d10 + 100)", "deslocamento": "9 m",
        "atributos": make_attr(24, 9, 20, 3, 11, 1),
        "imunidades_dano": "Fogo, psíquico, veneno; concussão, cortante e perfurante de não-mágicos sem adamante",
        "imunidades_condicao": "Amedrontado, enfeitiçado, envenenado, exausto, paralisado, petrificado",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 10", "idiomas": "Compreende ordens do criador", "nd": "16 (XP 15.000)",
        "tracos": [
            {"nome": "Absorção de Fogo", "descricao": "Cura PV iguais a dano de fogo recebido."},
            {"nome": "Arma Mágica", "descricao": "Ataques armados são mágicos."},
            {"nome": "Forma Imutável", "descricao": "Imune a alterações de forma."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem contra magias."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza dois ataques corpo-a-corpo."},
            {"nome": "Pancada", "descricao": "*Corpo-a-Corpo:* +13 para atingir. *Acerto:* 20 (3d8 + 7) concussão."},
            {"nome": "Espada", "descricao": "*Corpo-a-Corpo:* +13 para atingir, alcance 3 m. *Acerto:* 23 (3d10 + 7) cortante."},
            {"nome": "Sopro Venenoso (Recarrega 6)", "descricao": "Cone de 4,5 m causa 45 (10d8) dano de veneno (Con CD 19 metade)."}
        ],
        "descricao_lore": "O mais indestrutível e poderoso dos golens, forjado em metal pesado e imbuído com espírito da terra."
    })

    # Gorgon
    L.append({
        "nome": "Gorgon", "tipo_tamanho": "Monstruosidade Grande, imparcial",
        "ca": "19 (armadura natural)", "pv": "114 (12d10 + 48)", "deslocamento": "12 m",
        "atributos": make_attr(20, 11, 18, 2, 12, 7),
        "pericias": "Percepção +4", "imunidades_condicao": "Petrificado",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 14", "idiomas": "—", "nd": "5 (XP 1.800)",
        "tracos": [{"nome": "Investida Atropeladora", "descricao": "Ao se mover 6 m e atingir com chifre, Força CD 16 ou o alvo cai e permite ataque bônus de cascos."}],
        "acoes": [
            {"nome": "Chifre", "descricao": "*Corpo-a-Corpo:* +8 para atingir, alcance 1,5 m. *Acerto:* 18 (2d12 + 5) perfurante."},
            {"nome": "Cascos", "descricao": "*Corpo-a-Corpo:* +8 para atingir. *Acerto:* 16 (2d10 + 5) concussão."},
            {"nome": "Sopro Petrificante (Recarrega 5–6)", "descricao": "Cone de 3 m de gás: Con CD 13 ou contido e petrifica na rodada seguinte."}
        ],
        "descricao_lore": "Touro metálico blindado de placas de ferro cujas narinas expelem gás que transforma carne em pedra."
    })

    # Grell
    L.append({
        "nome": "Grell", "tipo_tamanho": "Aberração Média, neutro e mau",
        "ca": "12", "pv": "55 (10d8 + 10)", "deslocamento": "3 m, voo 9 m (planar)",
        "atributos": make_attr(15, 14, 13, 12, 11, 9),
        "pericias": "Furtividade +6, Percepção +4", "imunidades_dano": "Elétrico", "imunidades_condicao": "Caído, Cego",
        "sentidos": "Percepção às cegas 18 m (cego além), Percepção passiva 14", "idiomas": "Grell", "nd": "3 (XP 700)",
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza um ataque de tentáculos e um de bico."},
            {"nome": "Tentáculos", "descricao": "*Corpo-a-Corpo:* +4 para atingir, alcance 3 m. *Acerto:* 7 (1d10 + 2) perfurante + Con CD 11 ou envenenado e paralisado por 1 min. Alvo Médio ou menor fica agarrado e impedido (CD 15)."},
            {"nome": "Bico", "descricao": "*Corpo-a-Corpo:* +4 para atingir. *Acerto:* 7 (2d4 + 2) perfurante."}
        ],
        "descricao_lore": "Cérebro flutuante com bico afiado e dez tentáculos com farpas venenosas paralisantes."
    })

    # Harpia
    L.append({
        "nome": "Harpia", "tipo_tamanho": "Monstruosidade Média, caótico e mau",
        "ca": "11", "pv": "38 (7d8 + 7)", "deslocamento": "6 m, voo 12 m",
        "atributos": make_attr(12, 13, 12, 7, 10, 13),
        "sentidos": "Percepção passiva 10", "idiomas": "Comum", "nd": "1 (XP 200)",
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Um ataque de garras e um com sua clava."},
            {"nome": "Garras", "descricao": "*Corpo-a-Corpo:* +3 para atingir. *Acerto:* 6 (2d4 + 1) cortante."},
            {"nome": "Clava", "descricao": "*Corpo-a-Corpo:* +3 para atingir. *Acerto:* 3 (1d4 + 1) concussão."},
            {"nome": "Canção Sedutora", "descricao": "Criaturas a até 90 m que ouçam passam em Sab CD 11 ou ficam encantadas e caminham em sua direção."}
        ],
        "descricao_lore": "Criaturas aladas sádicas com torso de mulher e corpo de abutre que atraem vítimas com cantos hipnóticos."
    })

    # Hidra
    L.append({
        "nome": "Hidra", "tipo_tamanho": "Monstruosidade Enorme, imparcial",
        "ca": "15 (armadura natural)", "pv": "172 (15d12 + 75)", "deslocamento": "9 m, natação 9 m",
        "atributos": make_attr(20, 12, 20, 2, 10, 7),
        "pericias": "Percepção +6", "sentidos": "Visão no escuro 18 m, Percepção passiva 16", "idiomas": "—", "nd": "8 (XP 3.900)",
        "tracos": [
            {"nome": "Cabeças Reativas", "descricao": "Ganha uma reação extra para ataques de oportunidade para cada cabeça acima de uma."},
            {"nome": "Múltiplas Cabeças", "descricao": "Tem 5 cabeças e regenera 2 cabeças para cada decepada no turno (a menos que sofra fogo). Cura 10 PV por cabeça regenerada."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Realiza tantos ataques de mordida quantas cabeças possuir."},
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +8 para atingir, alcance 3 m. *Acerto:* 10 (1d10 + 5) perfurante."}
        ],
        "descricao_lore": "Horror serpentino de múltiplos pescoços que brotam novas cabeças quando decepadas."
    })

    # Kraken
    L.append({
        "nome": "Kraken", "tipo_tamanho": "Monstruosidade Imensa (titã), caótico e mau",
        "ca": "18 (armadura natural)", "pv": "472 (27d20 + 189)", "deslocamento": "6 m, natação 18 m",
        "atributos": make_attr(30, 11, 25, 22, 18, 20, {"For": "+17", "Des": "+7", "Con": "+14", "Int": "+13", "Sab": "+11"}),
        "testes_resistencia": "For +17, Des +7, Con +14, Int +13, Sab +11",
        "imunidades_dano": "Elétrico; concussão, cortante e perfurante de não-mágicos",
        "imunidades_condicao": "Amedrontado, Paralisado",
        "sentidos": "Visão verdadeira 36 m, Percepção passiva 14", "idiomas": "Abissal, Celestial, Infernal, Primordial, telepatia 36 m", "nd": "23 (XP 50.000)",
        "tracos": [
            {"nome": "Anfíbio", "descricao": "Respira ar e água."},
            {"nome": "Monstro de Cerco", "descricao": "Dobra o dano contra estruturas."},
            {"nome": "Movimentação Livre", "descricao": "Ignora terreno difícil e efeitos mágicos restritivos."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Três ataques de tentáculo (cada um pode ser trocado por Arremessar)."},
            {"nome": "Tentáculo", "descricao": "*Corpo-a-Corpo:* +17 para atingir, alcance 6 m. *Acerto:* 20 (3d6 + 10) concussão e agarrado (CD 18)."},
            {"nome": "Mordida", "descricao": "*Corpo-a-Corpo:* +17 para atingir. *Acerto:* 23 (3d8 + 10) perfurante e engole criatura Grande ou menor agarrada (sofre 42 [12d6] ácido/turno)."},
            {"nome": "Tempestade Elétrica", "descricao": "Dispara 3 raios a até 36 m causando 22 (4d10) elétrico (Des CD 22 metade)."}
        ],
        "acoes_lendarias": [
            {"nome": "Ataque de Tentáculo ou Arremessar", "descricao": "Usa um tentáculo ou Arremessar."},
            {"nome": "Tempestade Elétrica (Custa 2 Ações)", "descricao": "Usa Tempestade Elétrica."},
            {"nome": "Nuvem de Tinta (Custa 3 Ações)", "descricao": "Nuvem tóxica de raio 18 m: Con CD 22 ou 16 (3d10) veneno."}
        ],
        "descricao_lore": "Leviatã lendário dos oceanos profundos com força para quebrar galeões e remodelar o clima marítimo."
    })

    # Medusa
    L.append({
        "nome": "Medusa", "tipo_tamanho": "Monstruosidade Média, leal e mau",
        "ca": "15 (armadura natural)", "pv": "127 (17d8 + 51)", "deslocamento": "9 m",
        "atributos": make_attr(10, 15, 16, 12, 13, 15),
        "pericias": "Enganação +5, Furtividade +5, Intuição +4, Percepção +4",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 14", "idiomas": "Comum", "nd": "6 (XP 2.300)",
        "tracos": [{"nome": "Olhar Petrificante", "descricao": "Criatura que inicie turno a até 9 m passa em Con CD 14 ou fica impedida e se petrifica (se falhar por 5+, vira pedra na hora)."}],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Três ataques corpo-a-corpo (um cabelo de serpente e duas espadas curtas) ou dois com arco longo."},
            {"nome": "Cabelo de Serpente", "descricao": "*Corpo-a-Corpo:* +5 para atingir. *Acerto:* 4 (1d4 + 2) perfurante + 14 (4d6) veneno."},
            {"nome": "Espada Curta", "descricao": "*Corpo-a-Corpo:* +5 para atingir. *Acerto:* 5 (1d6 + 2) perfurante."},
            {"nome": "Arco Longo", "descricao": "*Distância:* +5 para atingir, 45/180 m. *Acerto:* 6 (1d8 + 2) perfurante + 7 (2d6) veneno."}
        ],
        "descricao_lore": "Criaturas amaldiçoadas pela vaidade extrema cujos cabelos de serpentes e olhar transformam admiradores em pedra."
    })

    # Minotauro
    L.append({
        "nome": "Minotauro", "tipo_tamanho": "Monstruosidade Grande, caótico e mau",
        "ca": "14 (armadura natural)", "pv": "76 (9d10 + 27)", "deslocamento": "12 m",
        "atributos": make_attr(18, 11, 16, 6, 16, 9),
        "pericias": "Percepção +7", "sentidos": "Visão no escuro 18 m, Percepção passiva 17", "idiomas": "Abissal", "nd": "3 (XP 700)",
        "tracos": [
            {"nome": "Descuidado", "descricao": "Vantagem em ataques do turno concedendo vantagem aos inimigos."},
            {"nome": "Investida", "descricao": "Ao mover 3 m e acertar chifrada, causa 9 (2d8) extra e Força CD 14 ou empurrado 3 m e cai."},
            {"nome": "Lembrança Labiríntica", "descricao": "Lembra com perfeição de qualquer caminho percorrido."}
        ],
        "acoes": [
            {"nome": "Machado Grande", "descricao": "*Corpo-a-Corpo:* +6 para atingir, alcance 1,5 m. *Acerto:* 17 (2d12 + 4) cortante."},
            {"nome": "Chifrada", "descricao": "*Corpo-a-Corpo:* +6 para atingir, alcance 1,5 m. *Acerto:* 13 (2d8 + 4) perfurante."}
        ],
        "descricao_lore": "Guerreiros taurinos carnívoros dos labirintos subterrâneos criados pelos cultos a Bafomé."
    })

    # Múmia e Senhor das Múmias
    L.append({
        "nome": "Múmia", "tipo_tamanho": "Morto-vivo Médio, leal e mau",
        "ca": "11 (armadura natural)", "pv": "58 (9d8 + 18)", "deslocamento": "6 m",
        "atributos": make_attr(16, 8, 15, 6, 10, 12, {"Sab": "+2"}),
        "testes_resistencia": "Sab +2", "vulnerabilidades": "Fogo",
        "resistencias": "Concussão, cortante e perfurante de não-mágicos", "imunidades_dano": "Necrótico, Veneno",
        "imunidades_condicao": "Amedrontado, enfeitiçado, envenenado, exausto, paralisado",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 10", "idiomas": "Idiomas de quando era viva", "nd": "3 (XP 700)",
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Usa Olhar Desesperador e realiza um ataque de punho pútrido."},
            {"nome": "Punho Pútrido", "descricao": "*Corpo-a-Corpo:* +5 para atingir, alcance 1,5 m. *Acerto:* 10 (2d6 + 3) concussão + 10 (3d6) necrótico. Con CD 12 ou amaldiçoado com Podridão da Múmia (não recupera PV e perde 10 [3d6] PV máximo/24h)."},
            {"nome": "Olhar Desesperador", "descricao": "Alvo a até 18 m passa em Sab CD 11 ou fica amedrontado até fim do turno da múmia (se falhar por 5+, paralisado)."}
        ],
        "descricao_lore": "Cadáveres embalsamados guardiões de tumbas inscritos com maldições necromânticas profanas."
    })

    L.append({
        "nome": "Senhor das Múmias", "tipo_tamanho": "Morto-vivo Médio, leal e mau",
        "ca": "17 (armadura natural)", "pv": "97 (13d8 + 39)", "deslocamento": "6 m",
        "atributos": make_attr(18, 10, 17, 11, 18, 16, {"Con": "+8", "Int": "+5", "Sab": "+9", "Car": "+8"}),
        "testes_resistencia": "Con +8, Int +5, Sab +9, Car +8",
        "pericias": "História +5, Religião +5", "vulnerabilidades": "Fogo",
        "resistencias": "Concussão, cortante e perfurante de não-mágicos", "imunidades_dano": "Necrótico, Veneno",
        "imunidades_condicao": "Amedrontado, enfeitiçado, envenenado, exausto, paralisado",
        "sentidos": "Visão no escuro 18 m, Percepção passiva 14", "idiomas": "Idiomas de quando era vivo", "nd": "15 (XP 13.000)",
        "tracos": [
            {"nome": "Rejuvenescimento", "descricao": "Se destruído, reforma-se com PV total em 24 horas caso seu coração no vaso canópico esteja intacto."},
            {"nome": "Resistência à Magia", "descricao": "Vantagem contra magias."},
            {"nome": "Conjuração", "descricao": "Conjurador 10º nível (Sab CD 17, +9 ataque). Magias de Clérigo: chama sagrada, comando, escudo da fé, arma espiritual, imobilizar pessoa, animar mortos, dissipar magia, guardião da fé, praga, ferimento pleno."}
        ],
        "acoes": [
            {"nome": "Ataques Múltiplos", "descricao": "Usa Olhar Desesperador e realiza um punho pútrido."},
            {"nome": "Punho Pútrido", "descricao": "*Corpo-a-Corpo:* +9 para atingir. *Acerto:* 14 (3d6 + 4) concussão + 21 (6d6) necrótico; Con CD 16 ou Podridão da Múmia."},
            {"nome": "Olhar Desesperador", "descricao": "Alvo a até 18 m passa em Sab CD 16 ou fica amedrontado e paralisado se falhar por 5+."}
        ],
        "acoes_lendarias": [
            {"nome": "Ataque", "descricao": "Realiza ataque de punho ou Olhar Desesperador."},
            {"nome": "Poeira Cegante", "descricao": "Criaturas a até 1,5 m passam em Con CD 16 ou ficam cegas."},
            {"nome": "Palavra Blasfema (Custa 2 Ações)", "descricao": "Criaturas não mortas-vivas a até 3 m passam em Con CD 16 ou ficam atordoadas."},
            {"nome": "Canalizar Energia Negativa (Custa 2 Ações)", "descricao": "Criaturas a até 18 m não podem recuperar PV até o próximo turno do senhor das múmias."},
            {"nome": "Vendaval de Areia (Custa 2 Ações)", "descricao": "Move-se até 18 m imune a danos e condições."}
        ],
        "descricao_lore": "Antigos imperadores e sumo sacerdotes mortos-vivos cujo coração guardado em vaso canópico garante sua imortalidade."
    })

    return L

print("Lote 4 definido.")
