# parte 1 dos dados dos monstros
MONSTROS_1 = [
  {
    "nome": "Aarakocra",
    "tipo_tamanho": "Humanoide Médio (aarakocra), neutro e bom",
    "ca": "12",
    "pv": "13 (3d8)",
    "deslocamento": "6 m, voo 15 m",
    "atributos": {"For":{"valor":"10","modificador":"+0","salvaguarda":"+0"},"Des":{"valor":"14","modificador":"+2","salvaguarda":"+2"},"Con":{"valor":"10","modificador":"+0","salvaguarda":"+0"},"Int":{"valor":"11","modificador":"+0","salvaguarda":"+0"},"Sab":{"valor":"12","modificador":"+1","salvaguarda":"+1"},"Car":{"valor":"11","modificador":"+0","salvaguarda":"+0"}},
    "pericias": "Percepção +5",
    "sentidos": "Percepção passiva 15",
    "idiomas": "Aarakocra, Auran",
    "nd": "1/4 (XP 50)",
    "tracos": [
      {"nome": "Ataque de Mergulho", "descricao": "Se o aarakocra estiver voando e mergulhar, pelo menos 9 metros, em linha reta em direção de um alvo e então atingi-lo com um ataque corpo-a-corpo armado, o ataque causa 3 (1d6) de dano extra ao alvo."}
    ],
    "acoes": [
      {"nome": "Garra", "descricao": "*Ataque Corpo-a-Corpo com Arma:* +4 para atingir, alcance 1,5 m, um alvo. *Acerto:* 4 (1d4 + 2) de dano cortante."},
      {"nome": "Azagaia", "descricao": "*Ataque à Distância com Arma:* +4 para atingir, alcance 1,5 m ou 9/36 m, um alvo. *Acerto:* 5 (1d6 + 2) de dano perfurante."}
    ],
    "descricao_lore": "Aarakocras patrulham as fronteiras ventosas de seu lar contra invasores do Plano Elemental da Terra. A serviço dos Duques do Vento de Aaqa, buscam os fragmentos do Bastão das Sete Partes."
  },
  {
    "nome": "Abocanhador Matraqueante",
    "tipo_tamanho": "Aberração Média, neutro",
    "ca": "9",
    "pv": "67 (9d8 + 27)",
    "deslocamento": "3 m, natação 3 m",
    "atributos": {"For":{"valor":"10","modificador":"+0","salvaguarda":"+0"},"Des":{"valor":"8","modificador":"-1","salvaguarda":"-1"},"Con":{"valor":"16","modificador":"+3","salvaguarda":"+3"},"Int":{"valor":"3","modificador":"-4","salvaguarda":"-4"},"Sab":{"valor":"10","modificador":"+0","salvaguarda":"+0"},"Car":{"valor":"6","modificador":"-2","salvaguarda":"-2"}},
    "imunidades_condicao": "Caído",
    "sentidos": "Visão no escuro 18 m, Percepção passiva 10",
    "idiomas": "—",
    "nd": "2 (XP 450)",
    "tracos": [
      {"nome": "Solo Aberrante", "descricao": "O solo num raio de 3 metros do abocanhador é terreno difícil. Criaturas que iniciem o turno na área devem passar em salvaguarda de Força CD 10 ou seu deslocamento é reduzido a 0 até o início do próximo turno."},
      {"nome": "Tagarelice", "descricao": "Cada criatura que começar seu turno a até 6 metros e puder ouvi-lo deve passar em salvaguarda de Sabedoria CD 10 ou fica incapaz de realizar reações e rola 1d8 para seu comportamento."}
    ],
    "acoes": [
      {"nome": "Ataques Múltiplos", "descricao": "Realiza um ataque de mordida e, se disponível, usa Cusparada Cegante."},
      {"nome": "Mordida", "descricao": "*Ataque Corpo-a-Corpo:* +2 para atingir, alcance 1,5 m. *Acerto:* 17 (5d6) perfurante. Alvo Médio ou menor deve passar em Força CD 10 ou cai no chão. Se morto, é absorvido."},
      {"nome": "Cusparada Cegante (Recarrega 5–6)", "descricao": "Cospe bolha num ponto a até 4,5 m que explode. Criaturas a até 1,5 m passam em Destreza CD 13 ou ficam cegas até o fim do próximo turno do abocanhador."}
    ],
    "descricao_lore": "Amálgama amorfo de olhos, bocas e matéria liquefeita de vítimas anteriores, murmurando em cacofonia enlouquecedora."
  },
  {
    "nome": "Abolete",
    "tipo_tamanho": "Aberração Grande, leal e mau",
    "ca": "17 (armadura natural)",
    "pv": "135 (18d10 + 36)",
    "deslocamento": "3 m, natação 12 m",
    "atributos": {"For":{"valor":"21","modificador":"+5","salvaguarda":"+5"},"Des":{"valor":"9","modificador":"-1","salvaguarda":"-1"},"Con":{"valor":"15","modificador":"+2","salvaguarda":"+6"},"Int":{"valor":"18","modificador":"+4","salvaguarda":"+8"},"Sab":{"valor":"15","modificador":"+2","salvaguarda":"+6"},"Car":{"valor":"18","modificador":"+4","salvaguarda":"+4"}},
    "testes_resistencia": "Con +6, Int +8, Sab +6",
    "pericias": "História +12, Percepção +10",
    "sentidos": "Visão no escuro 36 m, Percepção passiva 20",
    "idiomas": "Dialeto Subterrâneo, telepatia 36 m",
    "nd": "10 (XP 5.900)",
    "tracos": [
      {"nome": "Anfíbio", "descricao": "Pode respirar ar e água."},
      {"nome": "Nuvem Mucosa", "descricao": "Submerso, criaturas a até 1,5 m que tocarem ou acertarem ataque devem passar em Con CD 14 ou adoecem por 1d4 horas (respirando apenas sob a água)."},
      {"nome": "Sondagem Telepática", "descricao": "Descobre os maiores desejos de qualquer criatura que se comunique telepaticamente com ele."}
    ],
    "acoes": [
      {"nome": "Ataques Múltiplos", "descricao": "Realiza três ataques de tentáculos."},
      {"nome": "Tentáculo", "descricao": "*Ataque Corpo-a-Corpo:* +9 para atingir, alcance 3 m. *Acerto:* 12 (2d6 + 5) concussão. Con CD 14 ou adoece (pele translúcida e dano fora d'água)."},
      {"nome": "Cauda", "descricao": "*Ataque Corpo-a-Corpo:* +9 para atingir, alcance 3 m. *Acerto:* 15 (3d6 + 5) concussão."},
      {"nome": "Escravizar (3/Dia)", "descricao": "Alvo a até 9 m passa em Sabedoria CD 14 ou fica magicamente enfeitiçado sob controle total do abolete."}
    ],
    "acoes_lendarias": [
      {"nome": "Chicotear com a Cauda", "descricao": "Realiza um ataque de cauda."},
      {"nome": "Detectar", "descricao": "Realiza um teste de Sabedoria (Percepção)."},
      {"nome": "Dreno Psíquico (Custa 2 Ações)", "descricao": "Causa 10 (3d6) dano psíquico a criatura enfeitiçada e recupera PV iguais ao dano."}
    ],
    "acoes_covil": [
      {"nome": "Força Fantasmagórica", "descricao": "Conjura força fantasmagórica em alvos a até 18 m."},
      {"nome": "Marés Agarradoras", "descricao": "Poças puxam criaturas a até 6 m (Força CD 14 ou puxado 6m e caído)."},
      {"nome": "Condutor de Ira", "descricao": "Água causa 7 (2d6) de dano psíquico (Sabedoria CD 14)."}
    ],
    "descricao_lore": "Criaturas primordiais anteriores aos deuses com memórias eternas que nunca esquecem sua derrota e escravidão ancestral."
  }
]
