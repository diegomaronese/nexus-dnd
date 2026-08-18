const fs = require('fs');
const path = require('path');

const lote1 = require('./equipamento/itens_lote1.js');
const lote2 = require('./equipamento/itens_lote2.js');
const lote3 = require('./equipamento/itens_lote3.js');
const lote4 = require('./equipamento/itens_lote4.js');
const lote5 = require('./equipamento/itens_lote5.js');

const todosItens = [...lote1, ...lote2, ...lote3, ...lote4, ...lote5];

// Ordenar alfabeticamente por nome
todosItens.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

console.log(`Total de itens mágicos compilados: ${todosItens.length}`);

// Salvar em dados/equipamento/itens_magicos.json
const jsonOutput1 = path.join(__dirname, 'equipamento', 'itens_magicos.json');
fs.writeFileSync(jsonOutput1, JSON.stringify(todosItens, null, 2), 'utf-8');

// Salvar também em dados/itens_magicos.json por conveniência
const jsonOutput2 = path.join(__dirname, 'itens_magicos.json');
fs.writeFileSync(jsonOutput2, JSON.stringify(todosItens, null, 2), 'utf-8');

console.log('Arquivos salvos com sucesso!');
