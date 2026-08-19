#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from builder_monstros import format_md
import json, os
from monstros_data_1 import get_lista_monstros
from monstros_data_2 import get_demonios_e_diabos
from monstros_data_3 import get_dragoes_e_outros
from monstros_data_4 import get_resto_monstros

all_monsters = []
all_monsters.extend(get_lista_monstros())
all_monsters.extend(get_demonios_e_diabos())
all_monsters.extend(get_dragoes_e_outros())
all_monsters.extend(get_resto_monstros())

# Ordenar por nome
all_monsters.sort(key=lambda x: x["nome"])

# Adicionar markdown gerado para cada um
for m in all_monsters:
    m["markdown"] = format_md(m)

# Salvar em ambos os locais
targets = [
    "/Nexus/dados/apendices/monstros.json",
    "/dados/apendices/monstros.json",
    "/D-D_2024-main/dados/apendices/monstros.json"
]

for t in targets:
    try:
        os.makedirs(os.path.dirname(t), exist_ok=True)
        with open(t, "w", encoding="utf-8") as f:
            json.dump(all_monsters, f, ensure_ascii=False, indent=2)
        print(f"Salvo {len(all_monsters)} monstros em {t}")
    except Exception as e:
        print(f"Aviso ao salvar {t}: {e}")

print("Dataset gerado com sucesso!")
