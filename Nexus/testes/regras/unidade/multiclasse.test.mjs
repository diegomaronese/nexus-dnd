// ============================================================
// Testes de Regras D&D 2024 (Livro do Jogador): Multiclasse
// Validação de Pré-requisitos, Espaços de Magia, Dados de Vida,
// Proficiências e Evolução Multiclasse.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import { modulosApp } from './harness.mjs';

const { multiclasse, levelup } = await modulosApp();
const {
  MULTICLASSE_PREREQUISITOS,
  MULTICLASSE_PROFICIENCIAS,
  TABELA_ESPACOS_MULTICLASSE,
  TABELA_ESPACOS_PACTO_BRUXO,
  getClassesArray,
  hasClasse,
  getNivelClasse,
  getSubclasseClasse,
  ehMulticlasse,
  formatarClasses,
  verificarPrerequisitosMulticlasse,
  getCatalogoElegibilidadeMulticlasse,
  calcularNivelConjuradorMulticlasse,
  calcularEspacosMagiaMulticlasse,
  calcularReservaDadosVida,
  aplicarProficienciasMulticlasse
} = multiclasse;
const { subirDeNivel } = levelup;

test('Pré-requisitos de Multiclasse (Livro do Jogador p. 44)', () => {
  // Paladino: Força 13 e Carisma 13
  const paladinoApto = {
    classe: 'Paladino',
    nivel: 3,
    atributos: { forca: 14, destreza: 10, constituicao: 14, inteligencia: 10, sabedoria: 10, carisma: 14 }
  };
  // Guerreiro requer Força 13 OU Destreza 13
  const checkGuerreiro = verificarPrerequisitosMulticlasse(paladinoApto, 'Guerreiro');
  assert.equal(checkGuerreiro.elegivel, true, 'Paladino com FOR 14 e CAR 14 pode fazer multiclasse com Guerreiro');

  // Mago requer INT 13 (paladinoApto tem INT 10)
  const checkMago = verificarPrerequisitosMulticlasse(paladinoApto, 'Mago');
  assert.equal(checkMago.elegivel, false, 'Paladino com INT 10 não pode pegar Mago');

  // Paladino com FOR 12 (não atende a sua própria classe atual) tentando pegar Bardo (CAR 14)
  const paladinoInvalido = {
    classe: 'Paladino',
    nivel: 3,
    atributos: { forca: 12, destreza: 10, constituicao: 14, inteligencia: 10, sabedoria: 10, carisma: 14 }
  };
  const checkBardo = verificarPrerequisitosMulticlasse(paladinoInvalido, 'Bardo');
  assert.equal(checkBardo.elegivel, false, 'Não pode multiclasse se não atender ao requisito da classe atual');
});

test('Cálculo de Nível de Conjurador Combinado (Livro do Jogador p. 44-45)', () => {
  // Clérigo 3 (Total = 3) + Mago 2 (Total = 2) => Conjurador nível 5
  const clerigoMago = {
    classes: [
      { classe: 'Clérigo', nivel: 3 },
      { classe: 'Mago', nivel: 2 }
    ]
  };
  const res1 = calcularNivelConjuradorMulticlasse(clerigoMago);
  assert.equal(res1.nivelConjurador, 5);
  assert.equal(res1.temConjuradorNaoBruxo, true);

  const espacos1 = calcularEspacosMagiaMulticlasse(clerigoMago);
  // Nível 5: 4x 1º, 3x 2º, 2x 3º
  assert.equal(espacos1[1]?.total, 4);
  assert.equal(espacos1[2]?.total, 3);
  assert.equal(espacos1[3]?.total, 2);
  assert.equal(espacos1[4], undefined);

  // Paladino 3 (Meio-conjurador: ceil(3/2) = 2) + Guerreiro 2 (0) => Conjurador nível 2
  const paladinoGuerreiro = {
    classes: [
      { classe: 'Paladino', nivel: 3 },
      { classe: 'Guerreiro', nivel: 2 }
    ]
  };
  const res2 = calcularNivelConjuradorMulticlasse(paladinoGuerreiro);
  assert.equal(res2.nivelConjurador, 2);
  const espacos2 = calcularEspacosMagiaMulticlasse(paladinoGuerreiro);
  // Nível 2: 3x 1º
  assert.equal(espacos2[1]?.total, 3);
  assert.equal(espacos2[2], undefined);
});

test('Reserva de Dados de Vida Multiclasse', () => {
  // Paladino 3 (d10) / Guerreiro 2 (d10)
  const char1 = {
    classes: [
      { classe: 'Paladino', nivel: 3 },
      { classe: 'Guerreiro', nivel: 2 }
    ]
  };
  const reserva1 = calcularReservaDadosVida(char1);
  assert.equal(reserva1.length, 1);
  assert.equal(reserva1[0].tipo, 'd10');
  assert.equal(reserva1[0].total, 5);

  // Mago 3 (d6) / Clérigo 2 (d8) / Bárbaro 1 (d12)
  const char2 = {
    classes: [
      { classe: 'Mago', nivel: 3 },
      { classe: 'Clérigo', nivel: 2 },
      { classe: 'Bárbaro', nivel: 1 }
    ]
  };
  const reserva2 = calcularReservaDadosVida(char2);
  assert.equal(reserva2.length, 3);
  assert.deepEqual(reserva2.map(r => `${r.total}${r.tipo}`).sort(), ['1d12', '2d8', '3d6']);
});

test('Formatação de Subtítulo Multiclasse', () => {
  const char = {
    classe: 'Paladino',
    subclasse: 'Juramento da Devoção',
    classes: [
      { classe: 'Paladino', nivel: 3, subclasse: 'Juramento da Devoção' },
      { classe: 'Guerreiro', nivel: 2, subclasse: 'Campeão' }
    ]
  };
  const formatado = formatarClasses(char);
  assert.equal(formatado, 'Paladino 3 (Juramento da Devoção) / Guerreiro 2 (Campeão)');
});

test('Evolução de Nível com Multiclasse via subirDeNivel', async () => {
  const char = {
    nome: 'Sir Lancelot',
    classe: 'Paladino',
    nivel: 3,
    pv_max: 28,
    pv_atual: 28,
    dados_vida_total: 3,
    atributos: {
      forca: 16,
      destreza: 10,
      constituicao: 14,
      inteligencia: 10,
      sabedoria: 10,
      carisma: 14
    },
    salvaguardas_proficientes: ['Sabedoria', 'Carisma'],
    pericias_proficientes: ['Atletismo', 'Persuasão'],
    armaduras_proficientes: ['Leve', 'Média', 'Pesada', 'Escudo'],
    armas_proficientes: ['Simples', 'Marcial'],
    classes: [
      { classe: 'Paladino', nivel: 3, subclasse: 'Juramento da Devoção' }
    ],
    espacos_magia: {
      1: { total: 3, usados: 0 }
    }
  };

  // Subir para nível 4 escolhendo uma nova classe: Guerreiro (Nível 1 de Guerreiro)
  const res = await subirDeNivel(char, {
    classe_alvo: 'Guerreiro',
    hp_modo: 'fixo',
    ignorar_xp: true
  });

  assert.equal(res.sucesso, true, 'Subida de nível para multiclasse Guerreiro deve ter sucesso');
  assert.equal(char.nivel, 4, 'Nível total do personagem agora é 4');
  assert.equal(char.classes.length, 2, 'Personagem possui 2 classes');
  assert.equal(getNivelClasse(char, 'Paladino'), 3, 'Paladino continua nível 3');
  assert.equal(getNivelClasse(char, 'Guerreiro'), 1, 'Guerreiro agora é nível 1');
  assert.equal(ehMulticlasse(char), true, 'Personagem é detectado como multiclasse');
});
