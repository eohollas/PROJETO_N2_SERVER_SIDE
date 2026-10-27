const { ValidacaoError } = require('../errors/app-error');

const CAMPOS_EDITAVEIS = ['nome_jogador', 'habilidade_principal'];
const TAMANHO_MINIMO = 2;
const TAMANHO_MAXIMO = 50;

function validarCodigo(valor) {
  const texto = String(valor).trim();
  const numero = Number(texto);

  if (!/^\d+$/.test(texto) || !Number.isSafeInteger(numero) || numero < 1) {
    throw new ValidacaoError(['codigo_jogador deve ser um número inteiro positivo']);
  }

  return numero;
}

function validarDadosJogador(corpo, { parcial = false } = {}) {
  const dados = corpo ?? {};

  if (typeof dados !== 'object' || Array.isArray(dados)) {
    throw new ValidacaoError(['O corpo da requisição deve ser um objeto JSON']);
  }

  const erros = [];
  const jogador = {};

  for (const campo of CAMPOS_EDITAVEIS) {
    const valor = dados[campo];

    if (valor === undefined) {
      if (!parcial) erros.push(`${campo} é obrigatório`);
      continue;
    }

    if (typeof valor !== 'string') {
      erros.push(`${campo} deve ser um texto`);
      continue;
    }

    const texto = valor.trim();
    if (texto.length < TAMANHO_MINIMO || texto.length > TAMANHO_MAXIMO) {
      erros.push(`${campo} deve ter entre ${TAMANHO_MINIMO} e ${TAMANHO_MAXIMO} caracteres`);
      continue;
    }

    jogador[campo] = texto;
  }

  if (parcial && erros.length === 0 && Object.keys(jogador).length === 0) {
    erros.push(`Informe ao menos um campo para atualizar: ${CAMPOS_EDITAVEIS.join(', ')}`);
  }

  if (erros.length > 0) {
    throw new ValidacaoError(erros);
  }

  return jogador;
}

function validarTipoExclusao(valor) {
  if (valor === undefined) return 'logica'; 
  const tipo = String(valor).trim().toLowerCase();
  if (tipo === 'logica' || tipo === 'lógica') return 'logica';
  if (tipo === 'definitiva') return 'definitiva';

  throw new ValidacaoError(['tipo de exclusão inválido: use "logica" ou "definitiva"']);
}

function validarTermoBusca(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    throw new ValidacaoError(['Informe o parâmetro "nome" na busca. Exemplo: /jogadores/busca?nome=fox']);
  }

  return valor.trim();
}

function validarTermoHabilidade(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    throw new ValidacaoError(['Informe o parâmetro "habilidade" na busca. Exemplo: /jogadores/busca?habilidade=agilidade']);
  }

  return valor.trim();
}

module.exports = { validarCodigo, validarDadosJogador, validarTipoExclusao, validarTermoBusca, validarTermoHabilidade };
