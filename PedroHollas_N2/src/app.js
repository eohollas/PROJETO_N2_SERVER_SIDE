const express = require('express');

const JogadorRepository = require('./repositories/jogador.repository');
const JogadorService = require('./services/jogador.service');
const JogadorController = require('./controllers/jogador.controller');
const criarRotasJogador = require('./routes/jogador.routes');
const { rotaNaoEncontrada, tratadorDeErros } = require('./middlewares/tratador-de-erros');

function criarApp(pool) {
  const repository = new JogadorRepository(pool);
  const service = new JogadorService(repository);
  const controller = new JogadorController(service);

  const app = express();
  app.set('json spaces', 2); 
  app.use(express.json());

  app.use('/jogadores', criarRotasJogador(controller));

  app.use(rotaNaoEncontrada);
  app.use(tratadorDeErros);

  return app;
}

module.exports = criarApp;
