const mariadb = require('mariadb');

const configuracao = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const NOME_BANCO = 'esports';

const SQL_CRIAR_TABELA = `
  CREATE TABLE IF NOT EXISTS jogadores (
    codigo_jogador       INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome_jogador         VARCHAR(50)  NOT NULL,
    habilidade_principal VARCHAR(50)  NOT NULL,
    ativo                TINYINT(1)   NOT NULL DEFAULT 1,
    PRIMARY KEY (codigo_jogador)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

const JOGADORES_INICIAIS = [
  ['ShadowFox', 'Mira precisa'],
  ['NovaBlitz', 'Reflexos rápidos'],
  ['IronViper', 'Liderança tática'],
];

async function inicializarBanco() {
  const conexao = await mariadb.createConnection(configuracao);
  try {
    await conexao.query(
      `CREATE DATABASE IF NOT EXISTS \`${NOME_BANCO}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } finally {
    await conexao.end();
  }

  const pool = mariadb.createPool({
    ...configuracao,
    database: NOME_BANCO,
    connectionLimit: 5,
    insertIdAsNumber: true,
    bigIntAsNumber: true,
  });

  await pool.query(SQL_CRIAR_TABELA);
  const [{ total }] = await pool.query('SELECT COUNT(*) AS total FROM jogadores');
  if (Number(total) === 0) {
    await pool.batch(
      'INSERT INTO jogadores (nome_jogador, habilidade_principal) VALUES (?, ?)',
      JOGADORES_INICIAIS
    );
  }

  return pool;
}

module.exports = { inicializarBanco };
