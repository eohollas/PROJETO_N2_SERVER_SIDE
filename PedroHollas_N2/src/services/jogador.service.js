const { NaoEncontradoError, ConflitoError } = require('../errors/app-error');
const {
  validarCodigo,
  validarDadosJogador,
  validarTipoExclusao,
  validarTermoBusca,
} = require('../validators/jogador.validator');

class JogadorService {
  constructor(jogadorRepository) {
    this.repository = jogadorRepository;
  }

  async listar({ incluirInativos = false } = {}) {
    return this.repository.listar({ incluirInativos });
  }

  async buscarPorCodigo(codigo) {
    const id = validarCodigo(codigo);
    return this._obterAtivoOuFalhar(id);
  }

  async buscarPorNome(termo) {
    const nome = validarTermoBusca(termo);
    return this.repository.buscarPorNome(nome);
  }

  async criar(dados) {
    const jogador = validarDadosJogador(dados);
    return this.repository.criar(jogador);
  }

  async atualizar(codigo, dados, { parcial = false } = {}) {
    const id = validarCodigo(codigo);
    const novosDados = validarDadosJogador(dados, { parcial });

    await this._obterAtivoOuFalhar(id);
    return this.repository.atualizar(id, novosDados);
  }

  async excluir(codigo, tipoInformado) {
    const id = validarCodigo(codigo);
    const tipo = validarTipoExclusao(tipoInformado);

    const jogador = await this.repository.buscarPorCodigo(id, { incluirInativos: true });
    if (!jogador) {
      throw new NaoEncontradoError(`Jogador com código ${id} não encontrado`);
    }

    if (tipo === 'logica') {
      if (!jogador.ativo) {
        throw new ConflitoError(
          `Jogador ${id} já foi excluído logicamente. Use tipo=definitiva para removê-lo de vez`
        );
      }

      const inativado = await this.repository.inativar(id);
      return { tipo, mensagem: `Jogador ${id} excluído logicamente`, jogador: inativado };
    }

    const removido = await this.repository.remover(id);
    return { tipo, mensagem: `Jogador ${id} excluído definitivamente`, jogador: removido };
  }

  async _obterAtivoOuFalhar(id) {
    const jogador = await this.repository.buscarPorCodigo(id);
    if (!jogador) {
      throw new NaoEncontradoError(`Jogador com código ${id} não encontrado`);
    }
    return jogador;
  }
}

module.exports = JogadorService;
