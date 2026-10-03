// ============================================================
// Arcane Craft - Livro de Regras Oficiais & Compêndio
// Fiel ao livro: "Arcane Crafts Compendium: The Ultimate Guide
// to Crafting, Alchemy and Enchantment" por Cássio Barros de Aguiar (2026)
// ============================================================
import { escHtml } from '../utils.js';
import {
  TABELA_VALORES_CRAFTING,
  OFICINAS_MANUFATURA,
  ESTACOES_REFINO,
  MULTIPLICADORES_QUALIDADE,
  REGRAS_CONDICOES,
  VERTENTES_ORIGEM,
  VERTENTES_APLICACAO,
  TABELA_ES_TRABALHO,
  CUSTO_SLOT_POR_TIER,
  CD_TESTE_INTENCAO,
  HIT_DICE_RESERVADO_BINDING
} from './regras-dados-oficiais.js';
import { tornarBarraDeslizavel } from './arcanecraft-ui.js';

let _subAbaRegras = 'visao_geral'; // 'visao_geral', 'condicoes', 'crafting', 'alchemy', 'enchanting', 'fichas'

export function renderRegrasCompendio(container, onAbrirWizard) {
  container.innerHTML = `
    <div class="ac-regras-container">

      <!-- SUB-ABAS DAS REGRAS COM SUPORTE A TOQUE, MOUSE DRAG, WHEEL E SETAS -->
      <div class="ac-tabs-nav-wrapper ac-banco-nav-wrapper">
        <button class="ac-nav-arrow-btn ac-nav-arrow-prev" id="ac-regras-nav-prev" type="button" aria-label="Sub-aba anterior" title="Rolar para a esquerda">
          ‹
        </button>
        <div class="ac-banco-nav-bar" id="ac-regras-sub-bar" role="tablist">
          <button class="ac-banco-nav-btn ${_subAbaRegras === 'visao_geral' ? 'ativo' : ''}" data-sub="visao_geral" type="button">
            <span class="ac-txt-desktop">📜 Prefácio & Filosofia</span>
            <span class="ac-txt-mobile">📜 Prefácio</span>
          </button>
          <button class="ac-banco-nav-btn ${_subAbaRegras === 'condicoes' ? 'ativo' : ''}" data-sub="condicoes" type="button">
            <span class="ac-txt-desktop">☣️ Condições & Mutações</span>
            <span class="ac-txt-mobile">☣️ Condições</span>
          </button>
          <button class="ac-banco-nav-btn ${_subAbaRegras === 'crafting' ? 'ativo' : ''}" data-sub="crafting" type="button">
            <span class="ac-txt-desktop">⚒️ Parte 1: Criação (Crafting)</span>
            <span class="ac-txt-mobile">⚒️ Criação</span>
          </button>
          <button class="ac-banco-nav-btn ${_subAbaRegras === 'alchemy' ? 'ativo' : ''}" data-sub="alchemy" type="button">
            <span class="ac-txt-desktop">⚗️ Parte 2: Alquimia (Alchemy)</span>
            <span class="ac-txt-mobile">⚗️ Alquimia</span>
          </button>
          <button class="ac-banco-nav-btn ${_subAbaRegras === 'enchanting' ? 'ativo' : ''}" data-sub="enchanting" type="button">
            <span class="ac-txt-desktop">✨ Parte 3: Encantamento (Enchanting)</span>
            <span class="ac-txt-mobile">✨ Encanto</span>
          </button>
          <button class="ac-banco-nav-btn ${_subAbaRegras === 'fichas' ? 'ativo' : ''}" data-sub="fichas" type="button">
            <span class="ac-txt-desktop">📋 Modelos de Ficha Oficial</span>
            <span class="ac-txt-mobile">📋 Fichas</span>
          </button>
        </div>
        <button class="ac-nav-arrow-btn ac-nav-arrow-next" id="ac-regras-nav-next" type="button" aria-label="Próxima sub-aba" title="Rolar para a direita">
          ›
        </button>
      </div>

      <!-- ÁREA DE LEITURA -->
      <div class="ac-regras-body">
        ${_renderConteudoSubRegras()}
      </div>

    </div>
  `;

  _setupEventosRegras(container, onAbrirWizard);
}

function _renderConteudoSubRegras() {
  switch (_subAbaRegras) {
    case 'visao_geral':
      return _renderVisaoGeral();
    case 'condicoes':
      return _renderCondicoes();
    case 'crafting':
      return _renderCrafting();
    case 'alchemy':
      return _renderAlchemy();
    case 'enchanting':
      return _renderEnchanting();
    case 'fichas':
      return _renderFichasModelos();
    default:
      return '';
  }
}

// ------------------------------------------------------------
// 1. PREFÁCIO & FILOSOFIA
// ------------------------------------------------------------
function _renderVisaoGeral() {
  return `
    <div class="ac-regras-card">
      <div class="ac-banner-intro">
        <div class="ac-banner-intro-title">
          <span>📜 Arcane Crafts Compendium: Guia Supremo de Criação</span>
          <span class="ac-badge-counter">Por Cássio Barros de Aguiar (2026)</span>
        </div>
        <p class="ac-banner-intro-desc">
          "A magia não está apenas no objeto final, mas no esforço acumulado para trazê-lo à realidade." — O livro transforma a criação de itens em uma verdadeira jornada épica e técnica, em vez de um teste isolado de dados.
        </p>
      </div>

      <div class="ac-regras-secao">
        <h3>🏛️ O Conceito Fundamental: Modificador de Complexidade (CM) vs CD Tradicional</h3>
        <p>
          O sistema abandona o teste binário tradicional (sucesso/falha em rolagem única) e estrutura a manufatura em torno do <strong>Modificador de Complexidade (CM - Complexity Modifier)</strong> e do <strong>Progresso Acumulado (AP - Accumulated Progress)</strong>:
        </p>
        <div class="ac-callout-gold">
          <strong>Fórmula Base de Trabalho:</strong><br>
          <code>Resultado do Teste = 1d20 + Modificador de Atributo/Perícia + Bônus da Ferramenta</code><br>
          <code>Progresso do Ciclo = Resultado do Teste - CM do Material</code><br>
          <em>Se o valor for positivo, é somado ao Progresso Acumulado até atingir o Esforço Unitário (UE) necessário!</em>
        </div>
      </div>

      <div class="ac-regras-secao">
        <h3>💎 As Três Virtudes da Matéria</h3>
        <div class="ac-grid-3">
          <div class="ac-box-highlight">
            <h4 style="color:#22c55e;">1. Virtudes Inatas (Innate Virtues)</h4>
            <p>Propriedades físicas estruturais (peso, CA, resistência a quebra, etc.). Despertam automaticamente quando o material atinge a <strong>Massa Crítica</strong> exigida.</p>
          </div>
          <div class="ac-box-highlight">
            <h4 style="color:#06b6d4;">2. Virtudes Ressonantes (Resonant Virtues)</h4>
            <p>Propriedades que surgem da vibração de cordas de mana. Despertam automaticamente no item finalizado e dependem da <strong>Disputa de Dominância</strong> entre materiais misturados.</p>
          </div>
          <div class="ac-box-highlight">
            <h4 style="color:#a855f7;">3. Virtudes Arcanas (Arcane Virtues)</h4>
            <p>Traços místicos de grande magnitude. Exigem <strong>Sincronização (Sync)</strong> por parte do usuário (pool independente de sintonização) para se manifestarem plenamente.</p>
          </div>
        </div>
      </div>

      <div class="ac-regras-secao">
        <h3>📊 Tabela Padrão dos Materiais de Criação</h3>
        <div class="ac-table-container">
          <table class="ac-table">
            <thead>
              <tr>
                <th>Tier</th>
                <th>Fator de Tier (SF)</th>
                <th>Complexidade (CM)</th>
                <th>Limiar de Perícia (Threshold)</th>
                <th>Massa Crítica</th>
                <th>Preço / 1/2 kg</th>
                <th>Esforço Unitário (UE)</th>
                <th>Dado por 1/2 kg</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(TABELA_VALORES_CRAFTING).map(([tier, v]) => `
                <tr>
                  <td><strong>${tier}</strong></td>
                  <td>${v.tierFactor}</td>
                  <td>${v.cm}</td>
                  <td>${v.skillThreshold}</td>
                  <td>${(v.criticalMass * 100).toFixed(0)}% do peso</td>
                  <td>${v.unitPriceMin} a ${v.unitPriceMax} PO</td>
                  <td>${v.unitEffortMin} a ${v.unitEffortMax}</td>
                  <td><code>${v.tierDie}</code></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// 2. CONDIÇÕES & MUTAÇÕES (Drunkenness, Corruption, Mutations)
// ------------------------------------------------------------
function _renderCondicoes() {
  const eb = REGRAS_CONDICOES.embriaguez;
  const cr = REGRAS_CONDICOES.corrupcao;
  const mu = REGRAS_CONDICOES.mutacoes;
  const cv = REGRAS_CONDICOES.variacoesCriatura;

  return `
    <div class="ac-regras-card">
      <div class="ac-banner-intro">
        <div class="ac-banner-intro-title">
          <span>☣️ Condições Incrementais, Mutações & Variações de Criaturas</span>
        </div>
        <p class="ac-banner-intro-desc">
          Regras para substâncias químicas potentes e manipulação de energias proibidas. Ao contrário das condições convencionais, os estados de Embriaguez, Corrupção e Mutação são <strong>cumulativos e progressivos</strong>.
        </p>
      </div>

      <!-- EMBRIAGUEZ -->
      <div class="ac-regras-secao">
        <h3>🍺 ${eb.nome}</h3>
        <p>${eb.desc} — Consumo padrão: dose de 150 ml com salvaguarda de CON (CD = % de Álcool / 5). Falhas adicionam níveis de embriaguez.</p>
        <div class="ac-table-container">
          <table class="ac-table">
            <thead>
              <tr>
                <th style="width: 15%;">Nível</th>
                <th style="width: 25%;">Nome</th>
                <th style="width: 60%;">Efeitos Cumulativos</th>
              </tr>
            </thead>
            <tbody>
              ${eb.niveis.map(n => `
                <tr>
                  <td><strong>Nível ${n.nivel}</strong></td>
                  <td style="color: #f59e0b;">${n.nome}</td>
                  <td>${n.efeito}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="ac-callout-gold" style="margin-top: 10px;">
          <strong>Ressaca (Hangover):</strong> ${eb.ressaca}
        </div>
      </div>

      <!-- CORRUPÇÃO -->
      <div class="ac-regras-secao">
        <h3>💀 ${cr.nome}</h3>
        <p>${cr.desc} — Reduzida via <em>Restauração Maior</em> consumindo diamante de (X * 100 PO).</p>
        <div class="ac-table-container">
          <table class="ac-table">
            <thead>
              <tr>
                <th style="width: 15%;">Nível</th>
                <th style="width: 25%;">Marco (Milestone)</th>
                <th style="width: 60%;">Efeito Físico e Espiritual</th>
              </tr>
            </thead>
            <tbody>
              ${cr.marcos.map(m => `
                <tr>
                  <td><strong>Nível ${m.nivel}</strong></td>
                  <td style="color: #a855f7;">${m.nome}</td>
                  <td>${m.efeito}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- MUTAÇÕES -->
      <div class="ac-regras-secao">
        <h3>🧬 ${mu.nome}</h3>
        <p>${mu.desc} — Cada nível concede 1 Ponto de Mutação para investir nas seguintes características:</p>
        <div class="ac-grid-3">
          ${mu.pontos.map(p => `
            <div class="ac-box-highlight">
              <strong style="color: #22c55e;">${p.nome}</strong>
              <p style="margin: 4px 0 0 0; font-size: 0.82rem;">${p.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- VARIAÇÕES DE CRIATURA -->
      <div class="ac-regras-secao">
        <h3>🐉 Variações Biológicas de Criatura (Boss & Elite Traits)</h3>
        <p>Anomalias cósmicas e evoluções brutais para criar criaturas chefes com identidades mecânicas letais:</p>
        <div class="ac-table-container">
          <table class="ac-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Variação</th>
                <th>Tipo</th>
                <th>Regras e Benefícios Mecânicos</th>
              </tr>
            </thead>
            <tbody>
              ${cv.map(v => `
                <tr>
                  <td><strong>${v.num}</strong></td>
                  <td style="color: #60a5fa;"><strong>${v.nome}</strong></td>
                  <td><span class="ac-pill-status">${v.tipo}</span></td>
                  <td>${v.desc}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// 3. PARTE 1: FORJA (Crafting)
// ------------------------------------------------------------
function _renderCrafting() {
  return `
    <div class="ac-regras-card">
      <div class="ac-banner-intro">
        <div class="ac-banner-intro-title">
          <span>⚒️ Parte 1: Forja & Manufatura (Crafting)</span>
        </div>
        <p class="ac-banner-intro-desc">
          O domínio da vontade sobre a matéria. O processo divide-se em Extração, Refino e Fabricação, culminando na Disputa de Dominância e no cálculo do Preço Final.
        </p>
      </div>

      <div class="ac-regras-secao">
        <h3>⛏️ 1. Extração de Materiais (Extraction)</h3>
        <p>
          O personagem localiza o veio natural e utiliza a ferramenta apropriada. A cada ciclo de trabalho, realiza um Teste de Extração:
        </p>
        <div class="ac-callout-gold">
          <code>Teste de Extração = 1d20 + Modificador de Perícia + Bônus da Ferramenta</code><br>
          <code>Progresso do Ciclo = Teste de Extração - CM do Material</code><br>
          <em>Ritmos de Trabalho:</em><br>
          • <strong>Frenético (Frantic):</strong> 1 teste por rodada (ação de rodada completa em combate).<br>
          • <strong>Normal:</strong> 10 testes/hora (80/dia). Usa média d20 = 10,5 (ou 14 com vantagem). Quantidade = <code>(AAP - CM) x Testes / UE</code>.<br>
          • <strong>Exaustivo:</strong> 20 testes/hora (160/dia). Exige salvaguarda de CON CD 15 por hora ou sofre exaustão.
        </div>
      </div>

      <div class="ac-regras-secao">
        <h3>🔥 2. Refino de Materiais (Refinement)</h3>
        <p>
          Materiais brutos não podem ser usados diretamente; metais devem ser fundidos em lingotes, gemas lapidadas e couros curtidos.
        </p>
        <div class="ac-callout-gold">
          <code>Teste de Refino = 1d20 + Inteligência + Proficiência + Bônus da Estação</code><br>
          <em>Cada unidade refinada equivale a uma Unidade Fundamental de 1/2 kg (ou 1 lb).</em>
        </div>
        <div class="ac-table-container" style="margin-top: 10px;">
          <table class="ac-table">
            <thead>
              <tr>
                <th>Estação de Refino</th>
                <th>Bônus</th>
                <th>Capacidade Simultânea (Kg)</th>
              </tr>
            </thead>
            <tbody>
              ${ESTACOES_REFINO.map(e => `
                <tr>
                  <td><strong>${e.nome}</strong></td>
                  <td>+${e.bonus}</td>
                  <td>${e.capacidadeKg} kg por lote</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="ac-regras-secao">
        <h3>🔨 3. Fabricação de Itens & Múltiplos Materiais (Manufacturing)</h3>
        <p>
          A quantidade de material necessária corresponde ao peso do item (em unidades de 1/2 kg).
        </p>
        <ul>
          <li><strong>Itens de Alta Qualidade (+1, +2, +3):</strong> O Esforço Unitário (UE) é multiplicado por x2 (+1), x3 (+2) ou x5 (+3).</li>
          <li><strong>Combinação de Múltiplos Materiais:</strong> Cada material adicional além do primeiro adiciona <strong>+1 no CM</strong> de todos os materiais do item!</li>
          <li><strong>Massa Crítica para Virtudes Inatas:</strong> O material deve compor a porcentagem mínima do peso total (Common 20%, Uncommon 30%, Rare 40%, Exotic 50%, Mythic 60%).</li>
        </ul>
      </div>

      <div class="ac-regras-secao">
        <h3>⚔️ 4. Disputa de Dominância (Struggle for Dominance)</h3>
        <p>
          Quando múltiplos materiais são forjados juntos, suas frequências mágicas colidem. Para cada Unidade Fundamental (1/2 kg), rola-se <strong>1d20 + Limiar de Perícia (Skill Threshold)</strong>:
        </p>
        <div class="ac-callout-gold">
          • Common: 1d20 - 0<br>
          • Uncommon: 1d20 - 4<br>
          • Rare: 1d20 - 8<br>
          • Exotic: 1d20 - 12<br>
          • Mythic: 1d20 - 16<br>
          <em>O material com a maior soma total vence e manifesta suas Virtudes Arcanas e Ressonantes!</em>
        </div>
        <p style="margin-top: 10px;">
          Para manifestar virtudes secundárias, a oficina deve possuir <strong>Capacidade de Ressonância</strong> suficiente para cobrir o Fator de Tier de cada material incorporado, e a soma dos dados do desafiante deve ser superior à metade do vencedor!
        </p>
      </div>

      <div class="ac-regras-secao">
        <h3>💰 5. Preço Final de Manufatura</h3>
        <div class="ac-callout-gold">
          <code>Preço Final de Mercado = (Custo Total dos Materiais Refinados) x 2</code>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// 4. PARTE 2: ALQUIMIA (Alchemy)
// ------------------------------------------------------------
function _renderAlchemy() {
  return `
    <div class="ac-regras-card">
      <div class="ac-banner-intro">
        <div class="ac-banner-intro-title">
          <span>⚗️ Parte 2: Alquimia & Síntese (Alchemy)</span>
        </div>
        <p class="ac-banner-intro-desc">
          A ciência das misturas, suspensões e manipulação de princípios ativos. Baseada em exatamente 150 ml de substrato, reagentes em pares de soma zero e controle estrito do Nível de Instabilidade.
        </p>
      </div>

      <div class="ac-regras-secao">
        <h3>💧 1. O Substrato (The Substrate)</h3>
        <p>
          Todo composto alqualquímico requer <strong>exatamente 150 ml de substrato</strong>. O substrato define a <em>Forma de Uso</em> (Ingestão, Inalação, Contato, Arremesso ou Injeção) e o <strong>Limite de Suspensão</strong> em gramas:
        </p>
        <div class="ac-callout-gold">
          • <strong>Excesso de Substrato:</strong> Mais de 150 ml dilui os reagentes ao ponto de colapsar o composto.<br>
          • <strong>Excesso de Reagentes (Saturação):</strong> Reagentes que ultrapassem o Limite de Suspensão permanecem inertes e são desperdiçados.
        </div>
      </div>

      <div class="ac-regras-secao">
        <h3>⚖️ 2. A Regra da Soma Zero (The Zero-Sum Rule)</h3>
        <p>
          Reagentes atuam em pares químicos. Cada reagente possui canais de reação numerados de -20 a +20. Dois reagentes reagem apenas se compartilharem um canal que <strong>somado resulte em zero</strong> (ex: +5 e -5 ativam o Canal 5).
        </p>
        <ul>
          <li><strong>Canal Zero (0):</strong> Canal auto-estabilizador; reage sozinho sem precisar de outro reagente, mas não pode ser amplificado por catalisadores avançados.</li>
        </ul>
      </div>

      <div class="ac-regras-secao">
        <h3>🧪 3. Nível de Instabilidade (IL) & Teste de Síntese</h3>
        <div class="ac-callout-gold">
          <code>IL = CM + NR + ST + OE - 10</code><br>
          • <strong>CM:</strong> Maior Complexidade presente entre os componentes (15, 20, 25, 30, 35).<br>
          • <strong>NR:</strong> Número de pares de reação independentes.<br>
          • <strong>ST (Soma dos Tiers):</strong> Metade da soma dos Fatores de Tier de todos os componentes (arredondado para baixo).<br>
          • <strong>OE:</strong> Modificadores de efeitos de reagentes voláteis.<br><br>
          <strong>Teste de Síntese:</strong> <code>1d20 + Inteligência ou Sabedoria + Proficiência + Bônus do Laboratório vs IL</code>
        </div>
        <p style="margin-top: 10px;">
          • <strong>Sucesso Superior (>= IL):</strong> Composto perfeitamente estável (0 de Instabilidade Latente).<br>
          • <strong>Sucesso Parcial (&lt; IL):</strong> O composto é criado, mas retém <strong>Instabilidade Latente = IL - Teste</strong>. Quando for utilizado, o usuário rola 1d20 (Teste de Sorte); se o resultado for menor ou igual à instabilidade, a poção falha!<br>
          • <strong>Falha Crítica (1 natural ou falha por 20+):</strong> Explosão e colapso; materiais perdidos e efeitos aplicados ao próprio alquimista.
        </p>
      </div>

      <div class="ac-regras-secao">
        <h3>⚡ 4. Aditivos Avançados: Catalisadores e Inibidores</h3>
        <p>
          Utilizam <strong>meia-dose (50% do peso)</strong> e afetam os colchetes das fórmulas dos reagentes:
        </p>
        <ul>
          <li><code>(( ))</code> <strong>Colchete Linear:</strong> Soma ou subtrai a intensidade: <code>X + I</code>.</li>
          <li><code>[[ ]]</code> <strong>Colchete Multiplicador:</strong> Multiplica a base: <code>X + (I * X)</code>.</li>
          <li><code>{{ }}</code> <strong>Colchete Exponencial:</strong> Dobra o valor sucessivamente: <code>X * 2^I</code>.</li>
        </ul>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// 5. PARTE 3: ENCANTAMENTOS (Enchanting)
// ------------------------------------------------------------
function _renderEnchanting() {
  return `
    <div class="ac-regras-card">
      <div class="ac-banner-intro">
        <div class="ac-banner-intro-title">
          <span>✨ Parte 3: Encantamento & O Codex (Enchanting)</span>
        </div>
        <p class="ac-banner-intro-desc">
          O ritual esotérico de tecer a Trama diretamente sobre a matéria (Relíquias), a alma viva (Vinculações) ou o próprio tecido do mundo (Ancoragens).
        </p>
      </div>

      <div class="ac-regras-secao">
        <h3>🏛️ 1. As 3 Vertentes de Aplicação</h3>
        <div class="ac-grid-3">
          ${VERTENTES_APLICACAO.map(a => `
            <div class="ac-box-highlight">
              <h4 style="color:#a855f7;">${a.nome}</h4>
              <p style="font-size:0.84rem;">${a.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="ac-regras-secao">
        <h3>📜 2. As 6 Vertentes de Origem (Strands of Origin)</h3>
        <div class="ac-table-container">
          <table class="ac-table">
            <thead>
              <tr>
                <th>Vertente</th>
                <th>Atributo</th>
                <th>Ferramenta Exigida</th>
                <th>Criaturas Alinhadas</th>
                <th>Essências Típicas</th>
              </tr>
            </thead>
            <tbody>
              ${VERTENTES_ORIGEM.map(v => `
                <tr>
                  <td><strong>${v.nome}</strong></td>
                  <td><span class="ac-badge-tag">${v.atributo.toUpperCase()}</span></td>
                  <td>${v.ferramenta}</td>
                  <td>${v.criaturas}</td>
                  <td>${v.essencias}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="ac-regras-secao">
        <h3>🔮 3. Desbloqueio de Slots de Encantamento (ES)</h3>
        <p>
          A cada 1 hora de ritual, o mestre realiza um <strong>Teste de Encantamento</strong>: <code>1d20 + Atributo + Bônus do Foco + Bônus do Nexus - CM do Catalisador</code>. O resultado positivo acumula Trabalho:
        </p>
        <div class="ac-table-container">
          <table class="ac-table">
            <thead>
              <tr>
                <th>Trabalho Acumulado</th>
                <th>Slots de Encantamento (ES) Desbloqueados</th>
                <th>Consumo por Propriedade</th>
              </tr>
            </thead>
            <tbody>
              ${TABELA_ES_TRABALHO.map(t => `
                <tr>
                  <td><strong>${t.pontosMin} pontos</strong></td>
                  <td><strong>${t.slots} ES</strong></td>
                  <td>
                    ${t.slots === 1 ? 'Minor (1 ES)' : ''}
                    ${t.slots === 2 ? 'Major (2 ES)' : ''}
                    ${t.slots === 3 ? 'Greater (3 ES)' : ''}
                    ${t.slots === 4 ? 'Arcane (4 ES)' : ''}
                    ${t.slots === 5 ? 'Primordial (5 ES)' : ''}
                    ${t.slots >= 6 ? 'Múltiplas propriedades combinadas' : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="ac-regras-secao">
        <h3>🎯 4. Teste de Intenção & Sintonia de Trama (Weave Tuning)</h3>
        <div class="ac-callout-gold">
          <code>Teste de Intenção = 1d20 + Atributo da Vertente + Proficiência + Bônus do Foco</code> vs CD da Propriedade (Minor 15, Major 25, Greater 35, Arcane 45, Primordial 55).
        </div>
        <p style="margin-top: 10px;">
          • <strong>Sucesso com Essência:</strong> O mestre escolhe exatamente a propriedade desejada do catálogo.<br>
          • <strong>Falha por 1-5:</strong> Rola d100 na tabela da mesma vertente; o <strong>Bônus de Sintonia de Trama</strong> do Foco (+2 a +10) pode somar ou subtrair para alcançar a propriedade desejada!<br>
          • <strong>Falha por 6-10:</strong> Rola d100 em vertente aleatória.<br>
          • <strong>Falha por 11+:</strong> O slot é perdido e bloqueado sem manifestar efeito.
        </p>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// 6. MODELOS DE FICHA OFICIAL
// ------------------------------------------------------------
function _renderFichasModelos() {
  return `
    <div class="ac-regras-card">
      <div class="ac-banner-intro">
        <div class="ac-banner-intro-title">
          <span>📋 Modelos de Fichas Oficiais do Livro de Regras</span>
        </div>
        <p class="ac-banner-intro-desc">
          Reprodução virtual exata dos 3 modelos de ficha incluídos ao final de cada parte do livro: Ficha de Criação (The Forge, pág. 29), Ficha de Alquimia (Alchemy Sheet, pág. 44) e Ficha de Encantamento (Enchanting Sheet, pág. 58).
        </p>
      </div>

      <div class="ac-grid-3">
        <div class="ac-box-highlight text-center">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🔨</div>
          <h4>Ficha de Criação (Crafting Sheet)</h4>
          <p style="font-size: 0.82rem; color: var(--text-muted);">
            Campos para Extração, Refino com estações, unidades de 1/2 kg, tabela de múltiplos materiais, massa crítica e matriz de Disputa de Dominância.
          </p>
          <button type="button" class="ac-btn-primary ac-btn-abrir-oficina" data-processo="crafting" style="display:inline-block; margin-top:8px; cursor:pointer; border:none;">Abrir Oficina de Forja</button>
        </div>

        <div class="ac-box-highlight text-center">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🧪</div>
          <h4>Ficha de Alquimia (Alchemy Sheet)</h4>
          <p style="font-size: 0.82rem; color: var(--text-muted);">
            Campos para 150 ml de substrato, limite de suspensão, canais de reação positivos e negativos, dosagem em gramas, cálculo de IL e teste de sorte.
          </p>
          <button type="button" class="ac-btn-primary ac-btn-abrir-oficina" data-processo="alchemy" style="display:inline-block; margin-top:8px; cursor:pointer; border:none;">Abrir Laboratório</button>
        </div>

        <div class="ac-box-highlight text-center">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">✨</div>
          <h4>Ficha de Encantamento (Enchantment Sheet)</h4>
          <p style="font-size: 0.82rem; color: var(--text-muted);">
            Campos para Relíquia/Vinculação/Âncoras, as 6 vertentes com bônus de foco, catalisadores duplos, slots ES desbloqueados e testes de intenção.
          </p>
          <button type="button" class="ac-btn-primary ac-btn-abrir-oficina" data-processo="enchanting" style="display:inline-block; margin-top:8px; cursor:pointer; border:none;">Abrir Círculo Arcano</button>
        </div>
      </div>
    </div>
  `;
}

function _setupEventosRegras(container, onAbrirWizard) {
  const subBar = container.querySelector('#ac-regras-sub-bar');
  const prevBtn = container.querySelector('#ac-regras-nav-prev');
  const nextBtn = container.querySelector('#ac-regras-nav-next');
  if (subBar) {
    tornarBarraDeslizavel(subBar, {
      btnEsquerda: prevBtn,
      btnDireita: nextBtn,
      passoScroll: 220,
      centralizarAtivo: true,
      seletorAtivo: '.ac-banco-nav-btn.ativo'
    });

    subBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.ac-banco-nav-btn');
      if (btn && btn.dataset.sub) {
        e.preventDefault();
        _subAbaRegras = btn.dataset.sub;
        renderRegrasCompendio(container, onAbrirWizard);
      }
    });
  }

  container.querySelectorAll('.ac-banco-nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      _subAbaRegras = btn.dataset.sub;
      renderRegrasCompendio(container, onAbrirWizard);
    });
  });

  // Botões de Ação para Abrir Processos (Oficina de Forja, Laboratório, Círculo Arcano)
  container.querySelectorAll('.ac-btn-abrir-oficina').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const processo = btn.dataset.processo || 'crafting';
      if (typeof onAbrirWizard === 'function') {
        onAbrirWizard(processo);
      } else if (typeof window._acAbrirOficina === 'function') {
        window._acAbrirOficina(processo);
      } else if (typeof window.navegar === 'function') {
        window.navegar(`arcanecraft/${processo}`);
      }
    });
  });
}
