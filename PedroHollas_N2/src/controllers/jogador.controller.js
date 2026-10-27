class JogadorController {
  constructor(jogadorService) {
    this.service = jogadorService;
  }

  listar = async (req, res, next) => {
    try {
      const incluirInativos = req.query.incluir_inativos === 'true';
      const jogadores = await this.service.listar({ incluirInativos });
      res.status(200).json({ total: jogadores.length, jogadores });
    } catch (erro) {
      next(erro);
    }
  };

  buscarPorNome = async (req, res, next) => {
    try {
      const jogadores = await this.service.buscarPorNome(req.query.nome);
      res.status(200).json({ total: jogadores.length, jogadores });
    } catch (erro) {
      next(erro);
    }
  };

  buscarPorCodigo = async (req, res, next) => {
    try {
      const jogador = await this.service.buscarPorCodigo(req.params.codigo);
      res.status(200).json(jogador);
    } catch (erro) {
      next(erro);
    }
  };

  criar = async (req, res, next) => {
    try {
      const jogador = await this.service.criar(req.body);
      res.status(201).json(jogador);
    } catch (erro) {
      next(erro);
    }
  };

  atualizar = async (req, res, next) => {
    try {
      const jogador = await this.service.atualizar(req.params.codigo, req.body);
      res.status(200).json(jogador);
    } catch (erro) {
      next(erro);
    }
  };

  atualizarParcialmente = async (req, res, next) => {
    try {
      const jogador = await this.service.atualizar(req.params.codigo, req.body, { parcial: true });
      res.status(200).json(jogador);
    } catch (erro) {
      next(erro);
    }
  };

  excluir = async (req, res, next) => {
    try {
      const resultado = await this.service.excluir(req.params.codigo, req.query.tipo);
      res.status(200).json(resultado);
    } catch (erro) {
      next(erro);
    }
  };

  buscarPorHabilidade = async (req, res, next) => {
    try {
      const jogadores = await this.service.buscarPorHabilidade(req.query.habilidade);
      res.status(200).json({ total: jogadores.length, jogadores });
    } catch (erro) {
      next(erro);
    }
  };
}

module.exports = JogadorController;
