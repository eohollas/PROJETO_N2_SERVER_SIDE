const { Router } = require('express');

function criarRotasJogador(controller) {
  const router = Router();

  router.get('/busca', controller.buscarPorNome);

  router.get('/', controller.listar);
  router.post('/', controller.criar);
  router.get('/:codigo', controller.buscarPorCodigo);
  router.put('/:codigo', controller.atualizar);
  router.patch('/:codigo', controller.atualizarParcialmente);
  router.delete('/:codigo', controller.excluir);

  return router;
}

module.exports = criarRotasJogador;
