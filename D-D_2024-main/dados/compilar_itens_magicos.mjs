import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function carregarLote(caminho) {
  const conteudo = fs.readFileSync(caminho, 'utf-8');
  // Substituir 'module.exports =' por retorno JSON válido
  const jsonStr = conteudo.replace(/^module\.exports\s*=\s*/, '').replace(/;\s*$/, '');
  return JSON.parse(jsonStr);
}

const lote1 = carregarLote(path.join(__dirname, 'equipamento', 'itens_lote1.js'));
const lote2 = carregarLote(path.join(__dirname, 'equipamento', 'itens_lote2.js'));
const lote3 = carregarLote(path.join(__dirname, 'equipamento', 'itens_lote3.js'));
const lote4 = carregarLote(path.join(__dirname, 'equipamento', 'itens_lote4.js'));
const lote5 = carregarLote(path.join(__dirname, 'equipamento', 'itens_lote5.js'));

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

// Salvar também como modulo ES para importação direta se necessário
const jsOutput1 = path.join(__dirname, 'equipamento', 'itens_magicos.js');
fs.writeFileSync(jsOutput1, `export default ${JSON.stringify(todosItens, null, 2)};\n`, 'utf-8');

console.log('Arquivos salvos com sucesso!');
