// ============================================================
// Carregador de dados JSON (acessa ../dados/)
// Cache em memória para evitar re-fetch
// ============================================================

// Caminho base para os arquivos de dados.
// No deploy (GitHub Pages), o workflow substitui '../dados' por './dados' via sed.
const BASE_PATH = '../dados';
const cache = {};

// Classes que possuem lista de magias no D&D 5.5e
const CLASSES_COM_LISTA_MAGIAS = new Set([
  'artifice',
  'bardo',
  'bruxo',
  'clerigo',
  'druida',
  'feiticeiro',
  'guardiao',
  'mago',
  'paladino'
]);

/** Busca um JSON com cache em memória */
async function fetchJSON(caminho) {
  if (cache[caminho]) return cache[caminho];
  try {
    const resp = await fetch(`${BASE_PATH}/${caminho}`, { cache: 'no-store' });
    if (!resp.ok) return null;
    const contentType = resp.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      return null;
    }
    const text = await resp.text();
    if (!text || text.trim().startsWith('<')) {
      return null;
    }
    const dados = JSON.parse(text);
    cache[caminho] = dados;
    return dados;
  } catch (err) {
    return null;
  }
}

// --- Classes ---

/** Carrega dados de uma classe específica */
export async function getClasse(nome) {
  if (!nome) return null;
  const nomeArq = nome.toLowerCase()
    .replace(/á/g, 'a').replace(/ã/g, 'a').replace(/é/g, 'e')
    .replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u');
  const dados = await fetchJSON(`classes/${nomeArq}.json`);
  if (!dados) return null;

  return dados;
}

/** Carrega lista de magias de uma classe conjuradora */
export async function getMagiasClasse(nomeClasse) {
  if (!nomeClasse) return null;
  const nomeArq = nomeClasse.toLowerCase()
    .replace(/á/g, 'a').replace(/ã/g, 'a').replace(/é/g, 'e')
    .replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u');
  if (!CLASSES_COM_LISTA_MAGIAS.has(nomeArq)) {
    return null;
  }
  return fetchJSON(`classes/magias_${nomeArq}.json`);
}

// --- Origens ---

/** Carrega todos os antecedentes */
export async function getAntecedentes() {
  return fetchJSON('origens/antecedentes.json');
}

/** Carrega todas as espécies */
export async function getEspecies() {
  return fetchJSON('origens/especies.json');
}

// --- Talentos ---

/** Carrega todos os talentos */
export async function getTalentos() {
  const dados = await fetchJSON('talentos/talentos.json');
  if (dados && !dados.talentos && Array.isArray(dados.todos)) {
    dados.talentos = dados.todos;
  }
  return dados;
}

// --- Equipamento ---

/** Carrega armas */
export async function getArmas() {
  return fetchJSON('equipamento/armas.json');
}

/** Carrega armaduras */
export async function getArmaduras() {
  return fetchJSON('equipamento/armaduras.json');
}

/** Carrega equipamento de aventura */
export async function getEquipamentoAventura() {
  return fetchJSON('equipamento/equipamento_aventura.json');
}

/** Carrega ferramentas */
export async function getFerramentas() {
  return fetchJSON('equipamento/ferramentas.json');
}

/** Carrega montarias e veículos */
export async function getMontariasVeiculos() {
  return fetchJSON('equipamento/montarias_veiculos.json');
}

/** Carrega serviços */
export async function getServicos() {
  return fetchJSON('equipamento/servicos.json');
}

/** Carrega itens mágicos */
export async function getItensMagicos() {
  return fetchJSON('equipamento/itens_magicos.json');
}

// --- Magias ---

/** Carrega índice de todas as magias (resumido) */
export async function getIndiceMagias() {
  return fetchJSON('magias/_indice.json');
}

/** Carrega magias de um círculo específico (com descrição completa) */
export async function getMagiasPorCirculo(circulo) {
  const nome = circulo === 0 ? 'truques' : `circulo_${circulo}`;
  return fetchJSON(`magias/${nome}.json`);
}

/** Carrega magias de uma classe (lista resumida: nome, circulo, escola) */
export async function getMagiasPorClasseLista(nomeClasse) {
  const nomeArq = nomeClasse.toLowerCase()
    .replace(/á/g, 'a').replace(/ã/g, 'a').replace(/é/g, 'e')
    .replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u');
  return fetchJSON(`magias/por_classe/${nomeArq}.json`);
}

/** Busca uma magia específica pelo nome (carrega o círculo inteiro) */
export async function getMagia(nome, circulo) {
  const dados = await getMagiasPorCirculo(circulo);
  if (!dados) return null;
  return dados.magias.find(m => m.nome === nome) || null;
}

/** Busca magias por nome (busca no índice, retorna matches) */
export async function buscarMagias(termo) {
  const indice = await getIndiceMagias();
  if (!indice) return [];
  const termoNorm = termo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return indice.magias.filter(m => {
    const nomeNorm = m.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return nomeNorm.includes(termoNorm);
  });
}

// --- Apêndices e Capítulos ---

/** Carrega regras do Capítulo 1 */
export async function getCapitulo1Regras() {
  return fetchJSON('capitulo1_regras.json');
}

/** Carrega regras de criação do Capítulo 2 */
export async function getCapitulo2Criacao() {
  return fetchJSON('capitulo2_criacao.json');
}

/** Carrega criaturas */
export async function getCriaturas() {
  return fetchJSON('apendices/criaturas.json');
}

/** Carrega glossário */
export async function getGlossario() {
  return fetchJSON('apendices/glossario.json');
}

/** Carrega multiverso */
export async function getMultiverso() {
  return fetchJSON('apendices/multiverso.json');
}

// --- Pré-carregamento ---

/** Pré-carrega dados essenciais para criação de personagem */
export async function precarregarDadosCriacao() {
  await Promise.all([
    getAntecedentes(),
    getEspecies(),
    getTalentos(),
    getArmas(),
    getArmaduras(),
    getIndiceMagias()
  ]);
}
