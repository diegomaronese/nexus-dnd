// Arcane Craft - Módulo Unificado de Visualização de Ficha Completa e Impressão Oficial
import { escHtml, toast, abrirModal, fecharModal } from '../utils.js';
import { GRAUS_MATERIAL, POSTOS_ASSOCIACAO } from './arcanecraft-dados.js';
import { getInfoExaustao } from './motor-esforco.js';

let _printOverlayAtivo = false;

/**
 * Gera o HTML oficial e completo de uma Ficha do Arcane Craft
 * Compatível tanto com o estado ao vivo dos wizards (crafting, alchemy, enchanting)
 * quanto com fichas salvas e arquivadas no Caderno do Artesão.
 */
export function gerarHtmlFichaOficial(tipoProcesso, dadosFicha, opcoes = {}) {
  const isCaderno = !!opcoes.isCaderno;
  const d = dadosFicha.dados || dadosFicha; // Se for ficha do caderno, os dados crus estão em f.dados
  const ult = dadosFicha.ultimoResultado || d.ultimoResultado || {
    total: Number(dadosFicha.totalRolado || d.totalRolado || 15),
    cdFinal: Number(dadosFicha.cdFinal || d.cdFinalCalculada || d.cdBase || 15),
    sucesso: dadosFicha.sucesso !== undefined ? dadosFicha.sucesso : true,
    obraPrima: dadosFicha.obraPrima !== undefined ? dadosFicha.obraPrima : false,
    menorGrau: dadosFicha.menorGrau || d.menorGrau || 'media',
    dadoEscolhido: 15,
    modTotal: d.bonusAtributoProficiencia || d.bonusAlquimia || d.bonusArcanismo || 4,
    logRegra: 'Processo registrado e documentado com êxito.'
  };

  const tipo = tipoProcesso || dadosFicha.tipoProcesso || 'crafting';

  if (tipo === 'crafting') {
    return _gerarHtmlFichaCrafting(d, ult, dadosFicha, isCaderno);
  } else if (tipo === 'alchemy') {
    return _gerarHtmlFichaAlchemy(d, ult, dadosFicha, isCaderno);
  } else if (tipo === 'enchanting') {
    return _gerarHtmlFichaEnchanting(d, ult, dadosFicha, isCaderno);
  }
  return '';
}

function _gerarHtmlFichaCrafting(d, ult, root, isCaderno) {
  const menorGrau = ult.menorGrau || d.menorGrau || 'media';
  const grauInfo = GRAUS_MATERIAL[menorGrau] || { nome: 'Média', cor: '#c8a051' };
  const postoNome = POSTOS_ASSOCIACAO.find(p => p.id === d.posto)?.nome || 'Oficial';
  const ciclos = root.ciclosHistorico || d.ultimoResultado?.ciclosHistorico || d.sessaoEsforco?.ciclosExecutados || [];
  const esforcoAlvo = root.esforcoAlvo || ult.esforcoAlvo || d.sessaoEsforco?.esforcoAlvo || 20;
  const esforcoAtingido = root.esforcoAtingido || ult.progressoAtual !== undefined ? (root.esforcoAtingido ?? ult.progressoAtual) : (d.sessaoEsforco?.progressoAtual || ult.total || 20);
  const ciclosCount = root.ciclosCount || ult.ciclosCount || d.sessaoEsforco?.ciclosExecutados?.filter(c => c.tipo !== 'descanso').length || 1;
  const exaustao = root.nivelExaustao ?? ult.nivelExaustaoFinal ?? d.sessaoEsforco?.nivelExaustao ?? 0;
  const exaustaoInfo = getInfoExaustao(exaustao);
  const horas = d.tempoHorasEfetivo || d.tempoHoras || 8;
  const dias = d.diasTrabalho || Math.ceil(horas / (d.horasPorDia || 8));
  const custo = d.custoFinalPo || d.custoEstimadoPo || 50;

  return `
    <div class="ac-official-sheet-card ac-official-sheet-modal" id="ac-crafting-sheet-print">
      <!-- CABEÇALHO DA FICHA DO LIVRO -->
      <div class="ac-of-sheet-header">
        <div class="ac-of-sheet-seal">⚒️</div>
        <div class="ac-of-sheet-titles">
          <span class="ac-of-sheet-book-tag">ARCANE CRAFT COMPENDIUM • PARTE 1</span>
          <h2 class="ac-of-sheet-main-title">FICHA DE PROCESSO DE CRIAÇÃO (CRAFTING SHEET)</h2>
          <span class="ac-of-sheet-sub">Registro de Ateliê, Oficina e Forja de Itens • ${isCaderno ? `Arquivado em ${new Date(root.data || Date.now()).toLocaleString()}` : 'Processo Concluído'}</span>
        </div>
        <div class="ac-of-sheet-stamp ${ult.sucesso ? 'stamp-success' : 'stamp-fail'}">
          ${ult.obraPrima ? 'OBRA-PRIMA' : ult.sucesso ? 'CONCLUÍDO' : 'FALHA DE OFÍCIO'}
        </div>
      </div>

      <!-- SEÇÃO 1: DADOS DO ARTESÃO & ASSOCIAÇÃO -->
      <div class="ac-of-sheet-grid-2">
        <div class="ac-of-field">
          <label>NOME DO ARTESÃO / CRIADOR</label>
          <div class="value">${escHtml(d.nomeArtesao || root.artesao || 'Artesão')}</div>
        </div>
        <div class="ac-of-field">
          <label>ASSOCIAÇÃO / GUILDA & POSTO</label>
          <div class="value">${escHtml(postoNome)} (${escHtml(d.especializacao || 'Forja Geral')})</div>
        </div>
        <div class="ac-of-field">
          <label>FERRAMENTAS PROFICIENTES</label>
          <div class="value">${escHtml(d.ferramenta || 'Ferramentas de Ferreiro')} (Bônus: +${d.bonusAtributoProficiencia || 0})</div>
        </div>
        <div class="ac-of-field">
          <label>INSTALAÇÕES & OFICINA</label>
          <div class="value">${d.tipoInstalacao === 'mestre' ? 'Oficina Mestre de Guilda' : d.tipoInstalacao === 'improvisada' ? 'Instalação Improvisada' : 'Oficina Padrão Completa'}</div>
        </div>
      </div>

      <!-- SEÇÃO 2: DADOS DO ITEM & PROJETO -->
      <div class="ac-of-sheet-section-title">ESPECIFICAÇÕES DO ITEM PROJETADO</div>
      <div class="ac-of-sheet-grid-3">
        <div class="ac-of-field">
          <label>NOME DO ITEM</label>
          <div class="value font-bold gold">${escHtml(d.nomeItem || root.titulo || 'Item Forjado')}</div>
        </div>
        <div class="ac-of-field">
          <label>CATEGORIA</label>
          <div class="value">${escHtml(d.categoriaItem || 'Equipamento Geral')}</div>
        </div>
        <div class="ac-of-field">
          <label>PESO / CARGA</label>
          <div class="value">${d.pesoItem || 1.5} kg</div>
        </div>
      </div>

      <div class="ac-of-field" style="margin-top:8px;">
        <label>PROPRIEDADES MECÂNICAS & EFEITOS</label>
        <div class="value">${escHtml(d.propriedadesItem || 'Item padrão bem balanceado')} ${d.materialEspecial && d.materialEspecial !== 'nenhum' ? `• Material Nobre: ${d.materialEspecial.toUpperCase()}` : ''}</div>
      </div>

      <!-- SEÇÃO 3: TABELA DE MATERIAIS & GRAUS -->
      <div class="ac-of-sheet-section-title">MATERIAIS, QUANTIDADES & GRAUS DE QUALIDADE</div>
      <div class="ac-of-table-container">
        <table class="ac-of-table">
          <thead>
            <tr>
              <th>PAPEL</th>
              <th>MATERIAL</th>
              <th>QUANTIDADE</th>
              <th>GRAU DO MATERIAL</th>
              <th>MOD. CD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Base Estrutural</strong></td>
              <td>${escHtml(d.materialPrimario || 'Ferro Forjado')}</td>
              <td>${escHtml(d.qtdPrimaria || '1 lingote')}</td>
              <td><span class="ac-grau-pill" style="color:${GRAUS_MATERIAL[d.grauPrimario]?.cor || '#c8a051'}">${GRAUS_MATERIAL[d.grauPrimario]?.nome || 'Média'}</span></td>
              <td>${(GRAUS_MATERIAL[d.grauPrimario]?.modificadorCd ?? 0) > 0 ? `+${GRAUS_MATERIAL[d.grauPrimario]?.modificadorCd}` : (GRAUS_MATERIAL[d.grauPrimario]?.modificadorCd ?? 0)}</td>
            </tr>
            <tr>
              <td><strong>Fixação / Reforço</strong></td>
              <td>${escHtml(d.materialSecundario || 'Couro Curtido')}</td>
              <td>${escHtml(d.qtdSecundaria || '1 tira')}</td>
              <td><span class="ac-grau-pill" style="color:${GRAUS_MATERIAL[d.grauSecundario]?.cor || '#c8a051'}">${GRAUS_MATERIAL[d.grauSecundario]?.nome || 'Média'}</span></td>
              <td>${(GRAUS_MATERIAL[d.grauSecundario]?.modificadorCd ?? 0) > 0 ? `+${GRAUS_MATERIAL[d.grauSecundario]?.modificadorCd}` : (GRAUS_MATERIAL[d.grauSecundario]?.modificadorCd ?? 0)}</td>
            </tr>
            ${d.materialEspecial && d.materialEspecial !== 'nenhum' ? `
              <tr class="row-special">
                <td><strong>Elemento Nobre</strong></td>
                <td>${escHtml(d.materialEspecial.toUpperCase())}</td>
                <td>1 cota</td>
                <td><span class="ac-grau-pill" style="color:#a855f7;">Suprema / Especial</span></td>
                <td>+1 ou +2</td>
              </tr>
            ` : ''}
          </tbody>
        </table>
      </div>

      <!-- SEÇÃO 4: DIFICULDADE, TEMPO E RESOLUÇÃO -->
      <div class="ac-of-sheet-section-title">RESOLUÇÃO DE FORJA • ESFORÇO ACUMULADO & CICLOS (D&D 5.5e)</div>
      <div class="ac-of-sheet-grid-4">
        <div class="ac-of-field">
          <label>DIFICULDADE DO PROCESSO</label>
          <div class="value font-bold gold">CD ${ult.cdFinal || root.cdFinal || 15}</div>
        </div>
        <div class="ac-of-field">
          <label>ESFORÇO ACUMULADO (UE)</label>
          <div class="value font-bold gold">${esforcoAtingido} / ${esforcoAlvo} UE</div>
        </div>
        <div class="ac-of-field">
          <label>CICLOS DE TRABALHO</label>
          <div class="value font-bold">${ciclosCount} ciclos executados</div>
        </div>
        <div class="ac-of-field">
          <label>EXAUSTÃO DO ARTESÃO</label>
          <div class="value font-bold" style="color: ${exaustaoInfo.cor};">
            Nível ${exaustao} (${exaustaoInfo.rotulo})
          </div>
        </div>
      </div>

      <div class="ac-of-sheet-grid-3" style="margin-top:8px;">
        <div class="ac-of-field">
          <label>TEMPO DE TRABALHO DEDICADO</label>
          <div class="value">${horas} horas (${dias} dias)</div>
        </div>
        <div class="ac-of-field">
          <label>CUSTO TOTAL DE MATERIAIS</label>
          <div class="value">${custo} po</div>
        </div>
        <div class="ac-of-field">
          <label>QUALIDADE FINAL DO ITEM</label>
          <div class="value font-bold" style="color:${grauInfo.cor}">${grauInfo.nome}</div>
        </div>
      </div>

      <div class="ac-of-field" style="margin-top:8px;">
        <label>PARECER TÉCNICO & REGISTRO DE REGRAS</label>
        <div class="value">${ult.logRegra || 'Processo registrado com êxito conforme as diretrizes do livro.'}</div>
      </div>

      <!-- SEÇÃO 5: HISTÓRICO DE CICLOS & ESFORÇO ACUMULADO -->
      ${ciclos.length > 0 ? `
        <div class="ac-of-sheet-section-title">HISTÓRICO DE CICLOS DE TRABALHO & ESFORÇO ACUMULADO (D&D 5.5e)</div>
        <div class="ac-of-table-container">
          <table class="ac-of-table">
            <thead>
              <tr>
                <th>CICLO</th>
                <th>DADO D20</th>
                <th>BÔNUS</th>
                <th>PEN. EXAUSTÃO</th>
                <th>TOTAL VS CD</th>
                <th>PROGRESSO</th>
                <th>ACUMULADO</th>
                <th>EXAUSTÃO</th>
                <th>PARECER DO TURNO</th>
              </tr>
            </thead>
            <tbody>
              ${ciclos.map(c => `
                <tr class="${c.obraPrima ? 'row-nat20' : c.falhaCritica ? 'row-nat1' : c.tipo === 'descanso' ? 'row-descanso' : c.sucesso ? 'row-sucesso' : 'row-falha'}">
                  <td><strong>${c.tipo === 'descanso' ? '🛌 Repouso' : `#${c.numCiclo}`}</strong></td>
                  <td>${c.tipo === 'descanso' ? '-' : c.dadoEscolhido}</td>
                  <td>${c.tipo === 'descanso' ? '-' : (c.bonusBase >= 0 ? `+${c.bonusBase}` : c.bonusBase)}</td>
                  <td>${c.penalidadeExaustao > 0 ? `<span style="color:#ef4444; font-weight:700;">-${c.penalidadeExaustao}</span>` : '0'}</td>
                  <td>${c.tipo === 'descanso' ? '-' : `<strong>${c.total}</strong> vs ${c.cdCiclo}`}</td>
                  <td><strong class="gold">+${c.progressoCiclo} UE</strong></td>
                  <td>${c.progressoAcumulado} / ${c.esforcoAlvo}</td>
                  <td><span class="ac-exaustao-pill exaust-${c.nivelExaustao}">Nv ${c.nivelExaustao}</span></td>
                  <td class="ac-table-relato-td">${escHtml(c.eventoDesc)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      <!-- RODAPÉ DA FICHA -->
      <div class="ac-of-sheet-footer">
        <span>Assinatura do Artífice: <em>${escHtml(d.nomeArtesao || root.artesao || 'Artesão')}</em></span>
        <span>Selo da Guilda: <strong>Arquivado no Arcane Craft</strong></span>
        <span>Data: ${new Date(root.data || Date.now()).toLocaleDateString()}</span>
      </div>
    </div>
  `;
}

function _gerarHtmlFichaAlchemy(d, ult, root, isCaderno) {
  const menorGrau = ult.menorGrau || d.menorGrau || 'media';
  const grauInfo = GRAUS_MATERIAL[menorGrau] || { nome: 'Média', cor: '#34d399' };
  const ciclos = root.ciclosHistorico || d.ultimoResultado?.ciclosHistorico || d.sessaoEsforco?.ciclosExecutados || [];
  const esforcoAlvo = root.esforcoAlvo || ult.esforcoAlvo || d.sessaoEsforco?.esforcoAlvo || 20;
  const esforcoAtingido = root.esforcoAtingido || ult.progressoAtual !== undefined ? (root.esforcoAtingido ?? ult.progressoAtual) : (d.sessaoEsforco?.progressoAtual || ult.total || 20);
  const ciclosCount = root.ciclosCount || ult.ciclosCount || d.sessaoEsforco?.ciclosExecutados?.filter(c => c.tipo !== 'descanso').length || 1;
  const exaustao = root.nivelExaustao ?? ult.nivelExaustaoFinal ?? d.sessaoEsforco?.nivelExaustao ?? 0;
  const exaustaoInfo = getInfoExaustao(exaustao);
  const tempoTotal = d.tempoTotal || (Number(d.tempoHoras || 4) + Number(d.tempoDecantacaoHoras || 0));
  const custo = d.custoFinalPo || d.custoEstimadoPo || 25;

  return `
    <div class="ac-official-sheet-card ac-official-sheet-modal" id="ac-alchemy-sheet-print" style="border-color: rgba(46, 124, 109, 0.45);">
      <div class="ac-of-sheet-header" style="border-bottom-color: rgba(46, 124, 109, 0.3);">
        <div class="ac-of-sheet-seal">⚗️</div>
        <div class="ac-of-sheet-titles">
          <span class="ac-of-sheet-book-tag">ARCANE CRAFT COMPENDIUM • PARTE 2</span>
          <h2 class="ac-of-sheet-main-title">FICHA DE PREPARADO ALQUÍMICO (ALCHEMY SHEET)</h2>
          <span class="ac-of-sheet-sub">Caderno de Destilação, Soluções & Elixires • ${isCaderno ? `Arquivado em ${new Date(root.data || Date.now()).toLocaleString()}` : 'Síntese Concluída'}</span>
        </div>
        <div class="ac-of-sheet-stamp ${ult.sucesso ? 'stamp-success' : 'stamp-fail'}">
          ${ult.obraPrima ? 'TRANSCENDENTAL' : ult.sucesso ? 'ESTABILIZADA' : 'FALHA DE SÍNTESE'}
        </div>
      </div>

      <div class="ac-of-sheet-grid-2">
        <div class="ac-of-field">
          <label>NOME DO ALQUIMISTA / PRATICANTE</label>
          <div class="value">${escHtml(d.nomeAlquimista || root.artesao || 'Alquimista')}</div>
        </div>
        <div class="ac-of-field">
          <label>RAMO CIENTÍFICO & FERRAMENTAS</label>
          <div class="value">${escHtml(d.ramo || 'Farmacopeia')} • ${escHtml(d.ferramenta || 'Suprimentos de Alquimista')}</div>
        </div>
        <div class="ac-of-field">
          <label>MÉTODO DE EXTRAÇÃO & LABORATÓRIO</label>
          <div class="value">${(d.metodoExtracao || 'destilacao').toUpperCase()} • ${d.instalacaoLab === 'mestre' ? 'Laboratório de Mestre' : 'Laboratório Padrão'}</div>
        </div>
        <div class="ac-of-field">
          <label>FORMA DE APLICAÇÃO</label>
          <div class="value">${escHtml(d.formaAplicacao || 'Ingestão (Poção / Bebida)')}</div>
        </div>
      </div>

      <div class="ac-of-sheet-section-title">ESPECIFICAÇÕES DA SOLUÇÃO / POÇÃO</div>
      <div class="ac-of-sheet-grid-3">
        <div class="ac-of-field">
          <label>NOME DA FÓRMULA</label>
          <div class="value font-bold" style="color: #34d399;">${escHtml(d.nomeFormula || root.titulo || 'Solução Alquímica')} ${ult.obraPrima ? '(Dose Dupla)' : ''}</div>
        </div>
        <div class="ac-of-field">
          <label>CATEGORIA</label>
          <div class="value">${escHtml(d.categoria || 'Poção Restaurativa')}</div>
        </div>
        <div class="ac-of-field">
          <label>TEMPO DE PREPARO / REPOUSO</label>
          <div class="value">${tempoTotal} horas</div>
        </div>
      </div>

      <div class="ac-of-field" style="margin-top:8px;">
        <label>EFEITOS & PROPRIEDADES DA SUBSTÂNCIA</label>
        <div class="value">${escHtml(d.efeitoFormula || 'Restaura vigor e purifica o organismo')}</div>
      </div>

      <div class="ac-of-sheet-section-title">COMPOSIÇÃO DE SOLVENTE & REAGENTES</div>
      <div class="ac-of-table-container">
        <table class="ac-of-table">
          <thead>
            <tr>
              <th>FUNÇÃO</th>
              <th>SUBSTÂNCIA</th>
              <th>QUANTIDADE</th>
              <th>GRAU DE PUREZA</th>
              <th>MOD. CD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Solvente Base</strong></td>
              <td>${escHtml(d.solventeBase || 'Água Destilada')}</td>
              <td>1 frasco de base líquida</td>
              <td><span class="ac-grau-pill" style="color:${GRAUS_MATERIAL[d.grauSolvente]?.cor || '#34d399'}">${GRAUS_MATERIAL[d.grauSolvente]?.nome || 'Média'}</span></td>
              <td>${(GRAUS_MATERIAL[d.grauSolvente]?.modificadorCd ?? 0) > 0 ? `+${GRAUS_MATERIAL[d.grauSolvente]?.modificadorCd}` : (GRAUS_MATERIAL[d.grauSolvente]?.modificadorCd ?? 0)}</td>
            </tr>
            <tr>
              <td><strong>Reagente Ativo</strong></td>
              <td>${escHtml(d.reagenteAtivo || 'Raiz Sangue')}</td>
              <td>${escHtml(d.qtdAtivo || '2 porções')}</td>
              <td><span class="ac-grau-pill" style="color:${GRAUS_MATERIAL[d.grauAtivo]?.cor || '#34d399'}">${GRAUS_MATERIAL[d.grauAtivo]?.nome || 'Média'}</span></td>
              <td>${(GRAUS_MATERIAL[d.grauAtivo]?.modificadorCd ?? 0) > 0 ? `+${GRAUS_MATERIAL[d.grauAtivo]?.modificadorCd}` : (GRAUS_MATERIAL[d.grauAtivo]?.modificadorCd ?? 0)}</td>
            </tr>
            <tr>
              <td><strong>Catalisador</strong></td>
              <td>${escHtml(d.catalisador || 'Mel Silvestre')}</td>
              <td>${escHtml(d.qtdCatalisador || '1 dose')}</td>
              <td><span class="ac-grau-pill" style="color:${GRAUS_MATERIAL[d.grauCatalisador]?.cor || '#34d399'}">${GRAUS_MATERIAL[d.grauCatalisador]?.nome || 'Baixa'}</span></td>
              <td>${(GRAUS_MATERIAL[d.grauCatalisador]?.modificadorCd ?? 0) > 0 ? `+${GRAUS_MATERIAL[d.grauCatalisador]?.modificadorCd}` : (GRAUS_MATERIAL[d.grauCatalisador]?.modificadorCd ?? 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ac-of-sheet-section-title">RESOLUÇÃO DE ALQUIMIA • ESFORÇO ACUMULADO & CICLOS (D&D 5.5e)</div>
      <div class="ac-of-sheet-grid-4">
        <div class="ac-of-field">
          <label>NÍVEL DE INSTABILIDADE (IL)</label>
          <div class="value font-bold" style="color: #34d399;">CD ${ult.cdFinal || root.cdFinal || 14}</div>
        </div>
        <div class="ac-of-field">
          <label>ESTABILIDADE ACUMULADA (UE)</label>
          <div class="value font-bold gold">${esforcoAtingido} / ${esforcoAlvo} UE</div>
        </div>
        <div class="ac-of-field">
          <label>CICLOS DE DESTILAÇÃO</label>
          <div class="value font-bold">${ciclosCount} ciclos executados</div>
        </div>
        <div class="ac-of-field">
          <label>EXAUSTÃO DO ALQUIMISTA</label>
          <div class="value font-bold" style="color: ${exaustaoInfo.cor};">
            Nível ${exaustao} (${exaustaoInfo.rotulo})
          </div>
        </div>
      </div>

      <div class="ac-of-grid-2-custom" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px;">
        <div class="ac-of-field">
          <label>TEMPO & CUSTO TOTAL</label>
          <div class="value">${tempoTotal} horas • ${custo} PO</div>
        </div>
        <div class="ac-of-field">
          <label>PUREZA FINAL DO PREPARADO</label>
          <div class="value font-bold" style="color:${grauInfo.cor}">${grauInfo.nome}</div>
        </div>
      </div>

      <div class="ac-of-field" style="margin-top:8px;">
        <label>PARECER TÉCNICO & REGISTRO DE REGRAS</label>
        <div class="value">${ult.logRegra || 'Fórmula purificada e estabilizada com excelência laboratorial.'}</div>
      </div>

      ${ciclos.length > 0 ? `
        <div class="ac-of-sheet-section-title">HISTÓRICO DE DESTILAÇÕES & ESFORÇO ACUMULADO (D&D 5.5e)</div>
        <div class="ac-of-table-container">
          <table class="ac-of-table">
            <thead>
              <tr>
                <th>CICLO</th>
                <th>DADO D20</th>
                <th>BÔNUS</th>
                <th>PEN. EXAUSTÃO</th>
                <th>TOTAL VS CD</th>
                <th>ESTABILIDADE</th>
                <th>ACUMULADO</th>
                <th>EXAUSTÃO</th>
                <th>PARECER DA BANCADA</th>
              </tr>
            </thead>
            <tbody>
              ${ciclos.map(c => `
                <tr class="${c.obraPrima ? 'row-nat20' : c.falhaCritica ? 'row-nat1' : c.tipo === 'descanso' ? 'row-descanso' : c.sucesso ? 'row-sucesso' : 'row-falha'}">
                  <td><strong>${c.tipo === 'descanso' ? '🛌 Repouso' : `#${c.numCiclo}`}</strong></td>
                  <td>${c.tipo === 'descanso' ? '-' : c.dadoEscolhido}</td>
                  <td>${c.tipo === 'descanso' ? '-' : (c.bonusBase >= 0 ? `+${c.bonusBase}` : c.bonusBase)}</td>
                  <td>${c.penalidadeExaustao > 0 ? `<span style="color:#ef4444; font-weight:700;">-${c.penalidadeExaustao}</span>` : '0'}</td>
                  <td>${c.tipo === 'descanso' ? '-' : `<strong>${c.total}</strong> vs ${c.cdCiclo}`}</td>
                  <td><strong class="gold">+${c.progressoCiclo} UE</strong></td>
                  <td>${c.progressoAcumulado} / ${c.esforcoAlvo}</td>
                  <td><span class="ac-exaustao-pill exaust-${c.nivelExaustao}">Nv ${c.nivelExaustao}</span></td>
                  <td class="ac-table-relato-td">${escHtml(c.eventoDesc)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      <div class="ac-of-sheet-footer">
        <span>Assinatura do Alquimista: <em>${escHtml(d.nomeAlquimista || root.artesao || 'Alquimista')}</em></span>
        <span>Selo de Farmacopeia: <strong>Aprovado Arcane Craft</strong></span>
        <span>Data: ${new Date(root.data || Date.now()).toLocaleDateString()}</span>
      </div>
    </div>
  `;
}

function _gerarHtmlFichaEnchanting(d, ult, root, isCaderno) {
  const menorGrau = ult.menorGrau || d.menorGrau || 'media';
  const grauInfo = GRAUS_MATERIAL[menorGrau] || { nome: 'Média', cor: '#c084fc' };
  const ciclos = root.ciclosHistorico || d.ultimoResultado?.ciclosHistorico || d.sessaoEsforco?.ciclosExecutados || [];
  const esforcoAlvo = root.esforcoAlvo || ult.esforcoAlvo || d.sessaoEsforco?.esforcoAlvo || 48;
  const esforcoAtingido = root.esforcoAtingido || ult.progressoAtual !== undefined ? (root.esforcoAtingido ?? ult.progressoAtual) : (d.sessaoEsforco?.progressoAtual || ult.total || 48);
  const ciclosCount = root.ciclosCount || ult.ciclosCount || d.sessaoEsforco?.ciclosExecutados?.filter(c => c.tipo !== 'descanso').length || 1;
  const exaustao = root.nivelExaustao ?? ult.nivelExaustaoFinal ?? d.sessaoEsforco?.nivelExaustao ?? 0;
  const exaustaoInfo = getInfoExaustao(exaustao);
  const dias = d.tempoDiasRitual || 5;
  const custo = d.custoFinalPo || d.custoComponentesPo || 250;

  return `
    <div class="ac-official-sheet-card ac-official-sheet-modal" id="ac-enchanting-sheet-print" style="border-color: rgba(168, 85, 247, 0.45);">
      <div class="ac-of-sheet-header" style="border-bottom-color: rgba(168, 85, 247, 0.3);">
        <div class="ac-of-sheet-seal">✨</div>
        <div class="ac-of-sheet-titles">
          <span class="ac-of-sheet-book-tag">ARCANE CRAFT COMPENDIUM • PARTE 3</span>
          <h2 class="ac-of-sheet-main-title">FICHA DE PROCESSO DE ENCANTAMENTO (ENCHANTING SHEET)</h2>
          <span class="ac-of-sheet-sub">Registro de Rituais, Imbuição & Forja Mágica • ${isCaderno ? `Arquivado em ${new Date(root.data || Date.now()).toLocaleString()}` : 'Rito Concluído'}</span>
        </div>
        <div class="ac-of-sheet-stamp ${ult.sucesso ? 'stamp-success' : 'stamp-fail'}">
          ${ult.obraPrima ? 'RESSONÂNCIA' : ult.sucesso ? 'IMBUÍDO' : 'DISSIPADO'}
        </div>
      </div>

      <div class="ac-of-sheet-grid-2">
        <div class="ac-of-field">
          <label>NOME DO ENCANTADOR / CONJURADOR</label>
          <div class="value">${escHtml(d.nomeEncantador || root.artesao || 'Encantador')}</div>
        </div>
        <div class="ac-of-field">
          <label>ESPECIALIZAÇÃO & ARCANISMO</label>
          <div class="value">${escHtml(d.especializacao || 'Criação de Armas Mágicas')} • Bônus Arcanismo: +${d.bonusArcanismo || 0}</div>
        </div>
        <div class="ac-of-field">
          <label>CÍRCULO MÁGICO & INSTALAÇÕES</label>
          <div class="value">${d.tipoCirculo === 'platina' ? 'Círculo de Platina & Diamante' : 'Círculo de Prata Consagrada'}</div>
        </div>
        <div class="ac-of-field">
          <label>SINTONIZAÇÃO</label>
          <div class="value">${d.requerSintonizacao ? 'Requer Sintonização' : 'Livre de Sintonização'}</div>
        </div>
      </div>

      <div class="ac-of-sheet-section-title">ESPECIFICAÇÕES DO ITEM MÁGICO CONCEBIDO</div>
      <div class="ac-of-sheet-grid-3">
        <div class="ac-of-field">
          <label>NOME DO ITEM</label>
          <div class="value font-bold" style="color: #c084fc;">${escHtml(d.nomeItemMagico || root.titulo || 'Item Arcano')}</div>
        </div>
        <div class="ac-of-field">
          <label>RARIDADE</label>
          <div class="value font-bold" style="color: #f59e0b;">${d.raridade || 'Incomum'}</div>
        </div>
        <div class="ac-of-field">
          <label>DURAÇÃO DO RITUAL</label>
          <div class="value">${dias} dias contínuos</div>
        </div>
      </div>

      <div class="ac-of-field" style="margin-top:8px;">
        <label>PROPRIEDADES MÁGICAS & CANAIS DE PODER</label>
        <div class="value">${escHtml(d.propriedadesMagicas || 'Imbuído com energias elementais')} ${ult.obraPrima ? ' • [Propriedade Menor: Reluz com pulsação arcana pura]' : ''}</div>
      </div>

      <div class="ac-of-sheet-section-title">COMPONENTES, ESSÊNCIAS & RITUAL</div>
      <div class="ac-of-table-container">
        <table class="ac-of-table">
          <thead>
            <tr>
              <th>ELEMENTO</th>
              <th>ESPECIFICAÇÃO</th>
              <th>ORIGEM</th>
              <th>GRAU / PUREZA</th>
              <th>MOD. CD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Objeto Base</strong></td>
              <td>${escHtml(d.objetoBaseFisico || 'Espada Longa de Aço')}</td>
              <td>Forja Nobre / Artesanato</td>
              <td><span class="ac-grau-pill" style="color:${GRAUS_MATERIAL[d.grauObjetoBase]?.cor || '#c084fc'}">${GRAUS_MATERIAL[d.grauObjetoBase]?.nome || 'Média'}</span></td>
              <td>-</td>
            </tr>
            <tr>
              <td><strong>Essência Primária</strong></td>
              <td>Essência ${d.tipoEssencia || 'Ígnea'}</td>
              <td>${escHtml(d.origemEssencia || 'Coração de Salamandra')}</td>
              <td><span class="ac-grau-pill" style="color:${GRAUS_MATERIAL[d.grauEssencia]?.cor || '#c084fc'}">${GRAUS_MATERIAL[d.grauEssencia]?.nome || 'Média'}</span></td>
              <td>${(GRAUS_MATERIAL[d.grauEssencia]?.modificadorCd ?? 0) > 0 ? `+${GRAUS_MATERIAL[d.grauEssencia]?.modificadorCd}` : (GRAUS_MATERIAL[d.grauEssencia]?.modificadorCd ?? 0)}</td>
            </tr>
            <tr>
              <td><strong>Catalisador / Magia</strong></td>
              <td>${escHtml(d.catalisadorRitual || 'Pó de Rubi')} • ${escHtml(d.magiaVinculada || 'Lâmina Flamejante')}</td>
              <td>Oficina Arcana</td>
              <td><span class="ac-grau-pill" style="color:${GRAUS_MATERIAL[d.grauCatalisador]?.cor || '#c084fc'}">${GRAUS_MATERIAL[d.grauCatalisador]?.nome || 'Baixa'}</span></td>
              <td>${(GRAUS_MATERIAL[d.grauCatalisador]?.modificadorCd ?? 0) > 0 ? `+${GRAUS_MATERIAL[d.grauCatalisador]?.modificadorCd}` : (GRAUS_MATERIAL[d.grauCatalisador]?.modificadorCd ?? 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ac-of-sheet-section-title">RESOLUÇÃO DO RITO • ESFORÇO DA TRAMA & CICLOS (D&D 5.5e)</div>
      <div class="ac-of-sheet-grid-4">
        <div class="ac-of-field">
          <label>CD FINAL DO RITO</label>
          <div class="value font-bold" style="color: #c084fc;">CD ${ult.cdFinal || root.cdFinal || 16}</div>
        </div>
        <div class="ac-of-field">
          <label>ESFORÇO ACUMULADO (UE)</label>
          <div class="value font-bold gold">${esforcoAtingido} / ${esforcoAlvo} UE</div>
        </div>
        <div class="ac-of-field">
          <label>CICLOS DE RITUAL</label>
          <div class="value font-bold">${ciclosCount} ritos executados</div>
        </div>
        <div class="ac-of-field">
          <label>FADIGA / EXAUSTÃO MÍSTICA</label>
          <div class="value font-bold" style="color: ${exaustaoInfo.cor};">
            Nível ${exaustao} (${exaustaoInfo.rotulo})
          </div>
        </div>
      </div>

      <div class="ac-of-grid-2-custom" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px;">
        <div class="ac-of-field">
          <label>DURAÇÃO & CUSTO</label>
          <div class="value">${dias} dias de canalização • ${custo} PO</div>
        </div>
        <div class="ac-of-field">
          <label>QUALIDADE DA TRAMA</label>
          <div class="value font-bold" style="color:${grauInfo.cor}">${grauInfo.nome}</div>
        </div>
      </div>

      <div class="ac-of-field" style="margin-top:8px;">
        <label>PARECER TÉCNICO & REGISTRO DE REGRAS</label>
        <div class="value">${ult.logRegra || 'Item místico sintonizado e imbuído com perfeição.'}</div>
      </div>

      ${ciclos.length > 0 ? `
        <div class="ac-of-sheet-section-title">HISTÓRICO DE RITUAIS & ESFORÇO DA TRAMA (D&D 5.5e)</div>
        <div class="ac-of-table-container">
          <table class="ac-of-table">
            <thead>
              <tr>
                <th>RITO</th>
                <th>DADO D20</th>
                <th>BÔNUS</th>
                <th>PEN. EXAUSTÃO</th>
                <th>TOTAL VS CD</th>
                <th>HARMONIA</th>
                <th>ACUMULADO</th>
                <th>EXAUSTÃO</th>
                <th>RELATO DO CÍRCULO</th>
              </tr>
            </thead>
            <tbody>
              ${ciclos.map(c => `
                <tr class="${c.obraPrima ? 'row-nat20' : c.falhaCritica ? 'row-nat1' : c.tipo === 'descanso' ? 'row-descanso' : c.sucesso ? 'row-sucesso' : 'row-falha'}">
                  <td><strong>${c.tipo === 'descanso' ? '🛌 Meditação' : `#${c.numCiclo}`}</strong></td>
                  <td>${c.tipo === 'descanso' ? '-' : c.dadoEscolhido}</td>
                  <td>${c.tipo === 'descanso' ? '-' : (c.bonusBase >= 0 ? `+${c.bonusBase}` : c.bonusBase)}</td>
                  <td>${c.penalidadeExaustao > 0 ? `<span style="color:#ef4444; font-weight:700;">-${c.penalidadeExaustao}</span>` : '0'}</td>
                  <td>${c.tipo === 'descanso' ? '-' : `<strong>${c.total}</strong> vs ${c.cdCiclo}`}</td>
                  <td><strong class="gold">+${c.progressoCiclo} UE</strong></td>
                  <td>${c.progressoAcumulado} / ${c.esforcoAlvo}</td>
                  <td><span class="ac-exaustao-pill exaust-${c.nivelExaustao}">Nv ${c.nivelExaustao}</span></td>
                  <td class="ac-table-relato-td">${escHtml(c.eventoDesc)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}

      <div class="ac-of-sheet-footer">
        <span>Assinatura do Mestre de Encantamento: <em>${escHtml(d.nomeEncantador || root.artesao || 'Encantador')}</em></span>
        <span>Selo da Cidadela Arcana: <strong>Vínculo Permanente de Trama</strong></span>
        <span>Data: ${new Date(root.data || Date.now()).toLocaleDateString()}</span>
      </div>
    </div>
  `;
}

/**
 * Abre o Modal com a Ficha Oficial Completa
 */
export function abrirModalFichaOficial(tipoProcesso, dadosFicha, opcoes = {}) {
  const htmlFicha = gerarHtmlFichaOficial(tipoProcesso, dadosFicha, opcoes);
  const titulo = dadosFicha.titulo || dadosFicha.dados?.nomeItem || dadosFicha.dados?.nomeFormula || dadosFicha.dados?.nomeItemMagico || 'Ficha de Processo';

  const modalHtml = `
    <div class="ac-modal-ficha-wrap">
      ${htmlFicha}
    </div>
  `;

  const acoesHtml = `
    <button class="btn btn-outline" id="ac-modal-btn-imprimir">
      🖨️ Imprimir / Salvar PDF
    </button>
    <button class="btn btn-primary" id="ac-modal-btn-fechar">
      Fechar Visualização
    </button>
  `;

  // Chama o utilitário abrirModal com o container e ações devidas
  abrirModal(`📜 Ficha Oficial: ${titulo}`, modalHtml, acoesHtml);

  // Vincular eventos dos botões de ação do modal
  setTimeout(() => {
    const btnImprimir = document.getElementById('ac-modal-btn-imprimir');
    if (btnImprimir) {
      btnImprimir.addEventListener('click', () => {
        imprimirFichaOficial(tipoProcesso, dadosFicha, opcoes);
      });
    }
    const btnFechar = document.getElementById('ac-modal-btn-fechar');
    if (btnFechar) {
      btnFechar.addEventListener('click', fecharModal);
    }
  }, 50);
}

/**
 * Dispara a impressão limpa e oficial da Ficha de Processo do Arcane Craft,
 * montando o overlay de impressão oficial (#print-overlay) para compatibilidade total
 * com @media print (A4, cores exatas, remoção de menus/overlays).
 */
export function imprimirFichaOficial(tipoProcesso, dadosFicha, opcoes = {}) {
  if (_printOverlayAtivo) {
    const velho = document.getElementById('print-overlay');
    if (velho) velho.remove();
    _printOverlayAtivo = false;
  }

  try {
    toast('Preparando impressão da Ficha Oficial...', 'info');
    const htmlFicha = gerarHtmlFichaOficial(tipoProcesso, dadosFicha, opcoes);

    const overlay = document.createElement('div');
    overlay.id = 'print-overlay';
    overlay.className = 'ac-print-overlay-mode';
    overlay.innerHTML = `
      <div class="print-page ac-print-page">
        ${htmlFicha}
      </div>
    `;

    document.body.appendChild(overlay);
    _printOverlayAtivo = true;

    const limparOverlay = () => {
      const el = document.getElementById('print-overlay');
      if (el) el.remove();
      _printOverlayAtivo = false;
      window.removeEventListener('afterprint', limparOverlay);
    };

    window.addEventListener('afterprint', limparOverlay);

    // Dispara a impressão
    window.print();

    // Fallback de segurança para navegadores que não disparam afterprint
    setTimeout(() => {
      if (_printOverlayAtivo) limparOverlay();
    }, 5000);
  } catch (err) {
    console.error('Erro ao imprimir ficha do Arcane Craft:', err);
    toast('Erro ao processar impressão da ficha', 'danger');
    const el = document.getElementById('print-overlay');
    if (el) el.remove();
    _printOverlayAtivo = false;
  }
}
