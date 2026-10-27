const { AppError, NaoEncontradoError } = require('../errors/app-error');

function rotaNaoEncontrada(req, res, next) {
  next(new NaoEncontradoError(`Rota ${req.method} ${req.originalUrl} não encontrada`));
}

function tratadorDeErros(erro, req, res, next) {
  if (erro instanceof AppError) {
    const corpo = { erro: erro.message };
    if (erro.detalhes.length > 0) corpo.detalhes = erro.detalhes;
    return res.status(erro.statusCode).json(corpo);
  }

  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição' });
  }

  console.error('Erro inesperado:', erro);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}

module.exports = { rotaNaoEncontrada, tratadorDeErros };
