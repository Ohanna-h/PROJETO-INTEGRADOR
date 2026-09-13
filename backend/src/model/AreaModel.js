const db = require("../configuracao/db");

// Lista todas as áreas de formação (ex.: Eletroeletrônica, Automação...),
// na ordem definida pela coluna "ordem".
async function listarTodas() {
  const [linhas] = await db.query(
    "SELECT id, nome, icone_url, ordem FROM areas ORDER BY ordem ASC"
  );
  return linhas;
}

async function buscarPorNome(nome) {
  const [linhas] = await db.query(
    "SELECT id, nome, icone_url FROM areas WHERE nome = ? LIMIT 1",
    [nome]
  );
  return linhas[0] || null;
}

module.exports = {
  listarTodas,
  buscarPorNome,
};
