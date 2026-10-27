class AppError extends Error {
  constructor(mensagem, statusCode, detalhes = []) {
    super(mensagem);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.detalhes = detalhes;
  }
}

class ValidacaoError extends AppError {
  constructor(detalhes = []) {
    super('Dados inválidos', 400, detalhes);
  }
}

class NaoEncontradoError extends AppError {
  constructor(mensagem = 'Recurso não encontrado') {
    super(mensagem, 404);
  }
}

class ConflitoError extends AppError {
  constructor(mensagem = 'Conflito com o estado atual do recurso') {
    super(mensagem, 409);
  }
}

module.exports = { AppError, ValidacaoError, NaoEncontradoError, ConflitoError };
