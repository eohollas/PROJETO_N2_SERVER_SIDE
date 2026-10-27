const COLUNAS_EDITAVEIS = ['nome_jogador', 'habilidade_principal'];

const mapear = (linha) => ({
  codigo_jogador: linha.codigo_jogador,
  nome_jogador: linha.nome_jogador,
  habilidade_principal: linha.habilidade_principal,
  ativo: Boolean(linha.ativo),
});

const escaparLike = (texto) => texto.replace(/[\\%_]/g, '\\$&');

class JogadorRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async listar({ incluirInativos = false } = {}) {
    const filtro = incluirInativos ? '' : 'WHERE ativo = 1';
    const linhas = await this.pool.query(
      `SELECT * FROM jogadores ${filtro} ORDER BY codigo_jogador`
    );
    return linhas.map(mapear);
  }

  async buscarPorCodigo(codigo, { incluirInativos = false } = {}) {
    const filtro = incluirInativos ? '' : 'AND ativo = 1';
    const linhas = await this.pool.query(
      `SELECT * FROM jogadores WHERE codigo_jogador = ? ${filtro}`,
      [codigo]
    );
    return linhas.length > 0 ? mapear(linhas[0]) : null;
  }

  async buscarPorNome(termo) {
    const linhas = await this.pool.query(
      'SELECT * FROM jogadores WHERE ativo = 1 AND nome_jogador LIKE ? ORDER BY codigo_jogador',
      [`%${escaparLike(termo)}%`]
    );
    return linhas.map(mapear);
  }

  async criar({ nome_jogador, habilidade_principal }) {
    const resultado = await this.pool.query(
      'INSERT INTO jogadores (nome_jogador, habilidade_principal) VALUES (?, ?)',
      [nome_jogador, habilidade_principal]
    );
    return this.buscarPorCodigo(resultado.insertId);
  }

  async atualizar(codigo, dados) {
    const campos = Object.keys(dados).filter((campo) => COLUNAS_EDITAVEIS.includes(campo));

    if (campos.length > 0) {
      const atribuicoes = campos.map((campo) => `${campo} = ?`).join(', ');
      await this.pool.query(
        `UPDATE jogadores SET ${atribuicoes} WHERE codigo_jogador = ? AND ativo = 1`,
        [...campos.map((campo) => dados[campo]), codigo]
      );
    }

    return this.buscarPorCodigo(codigo);
  }

  async inativar(codigo) {
    await this.pool.query('UPDATE jogadores SET ativo = 0 WHERE codigo_jogador = ?', [codigo]);
    return this.buscarPorCodigo(codigo, { incluirInativos: true });
  }

  async remover(codigo) {
    const jogador = await this.buscarPorCodigo(codigo, { incluirInativos: true });
    if (!jogador) return null;

    await this.pool.query('DELETE FROM jogadores WHERE codigo_jogador = ?', [codigo]);
    return jogador;
  }

  async buscarPorHabilidade(termo) {
    const linhas = await this.pool.query(
      'SELECT * FROM jogadores WHERE ativo = 1 AND habilidade_principal LIKE ? ORDER BY codigo_jogador',
      [`%${escaparLike(termo)}%`]
    );
    return linhas.map(mapear);
  }
}

module.exports = JogadorRepository;
