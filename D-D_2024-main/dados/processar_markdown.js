const fs = require('fs');
const path = require('path');

// Salva o texto bruto do markdown para parsing
const raw = fs.readFileSync(path.join(__dirname, 'raw_itens_magicos.txt'), 'utf8');

const secoes = raw.split(/\n(?=##\s+)/);

const itens = [];

for (const sec of secoes) {
  const lines = sec.trim().split('\n');
  if (!lines[0].startsWith('##')) continue;
  
  let header = lines[0].replace(/^##\s+/, '').replace(/\*\*/g, '').trim();
  if (header.startsWith('*') && header.endsWith('*')) {
    header = header.replace(/\*/g, '').trim();
  }
  
  // Linha 1 geralmente é a tipologia/raridade (*Arma (Adaga), Raro*, etc.)
  let tipoLinha = '';
  let idxDesc = 1;
  while (idxDesc < lines.length && !lines[idxDesc].trim()) {
    idxDesc++;
  }
  
  if (idxDesc < lines.length && lines[idxDesc].trim().startsWith('*') && lines[idxDesc].trim().endsWith('*')) {
    tipoLinha = lines[idxDesc].trim().replace(/^\*|\*$/g, '').trim();
    idxDesc++;
  }
  
  const corpoLinhas = lines.slice(idxDesc);
  const descricao = corpoLinhas.join('\n').trim();
  
  // Parse tipoLinha: Ex "Arma (Adaga), Raro", "Item Maravilhoso, Comum (Requer Sintonização por um Bruxo)"
  let tipoGeral = 'Item Maravilhoso';
  let subtipo = '';
  let raridade = 'Comum';
  let sintonizacao = false;
  let detalheSintonizacao = '';

  if (tipoLinha) {
    if (tipoLinha.toLowerCase().includes('requer sintonização') || tipoLinha.toLowerCase().includes('requer sintonia')) {
      sintonizacao = true;
      const mSint = tipoLinha.match(/\((Requer Sintonização[^)]*)\)/i);
      if (mSint) {
        detalheSintonizacao = mSint[1].trim();
      } else {
        detalheSintonizacao = 'Requer Sintonização';
      }
    }

    // Remover a parte do requer sintonização para analisar tipo e raridade
    const limpo = tipoLinha.replace(/\(Requer Sintonização[^)]*\)/gi, '').trim();
    const partes = limpo.split(',').map(p => p.trim()).filter(Boolean);

    if (partes.length >= 1) {
      const p0 = partes[0];
      const mSub = p0.match(/^([^(]+)(?:\(([^)]+)\))?/);
      if (mSub) {
        tipoGeral = mSub[1].trim();
        subtipo = mSub[2] ? mSub[2].trim() : '';
      } else {
        tipoGeral = p0;
      }
    }

    if (partes.length >= 2) {
      raridade = partes.slice(1).join(', ').trim();
    }
  } else {
    // Se não tem tipoLinha explícito
    if (descricao.toLowerCase().includes('pergaminho')) {
      tipoGeral = 'Pergaminho';
      raridade = 'Comum';
    }
  }

  // Obter resumo
  let resumo = '';
  const primeiroParagrafo = descricao.split('\n\n')[0] || '';
  const semMd = primeiroParagrafo.replace(/[*_#|]/g, '').trim();
  resumo = semMd.length > 130 ? semMd.slice(0, 127) + '...' : semMd;

  itens.push({
    nome: header,
    tipo: tipoGeral,
    subtipo: subtipo,
    tipo_linha: tipoLinha,
    raridade: raridade || 'Comum',
    sintonizacao: sintonizacao,
    detalhe_sintonizacao: detalheSintonizacao,
    resumo: resumo,
    descricao: descricao
  });
}

// Ordenar alfabeticamente
itens.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

const output = {
  total: itens.length,
  itens: itens
};

fs.writeFileSync(path.join(__dirname, 'equipamento', 'itens_magicos.json'), JSON.stringify(output, null, 2), 'utf8');
console.log(`Sucesso: ${itens.length} itens mágicos gerados.`);
