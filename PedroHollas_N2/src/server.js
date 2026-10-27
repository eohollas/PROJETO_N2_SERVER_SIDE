const criarApp = require('./app');
const { inicializarBanco } = require('./config/database');

const PORTA = process.env.PORT || 3000;

async function iniciar() {
  try {
    const pool = await inicializarBanco();
    const app = criarApp(pool);

    app.listen(PORTA, (erro) => {
      if (erro) {
        console.error(`Não foi possível usar a porta ${PORTA}:`, erro.message);
        process.exit(1);
      }
      console.log(`API de jogadores de eSports rodando em http://localhost:${PORTA}`);
    });
  } catch (erro) {
    console.error('Não foi possível iniciar a API:', erro.message);
    console.error(
      'Verifique se o MariaDB está em execução e se o usuário e a senha em src/config/database.js estão corretos.'
    );
    process.exit(1);
  }
}

iniciar();
