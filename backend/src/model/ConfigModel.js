const db = require("../configuracao/db");

// Retorna todos os textos institucionais como um objeto simples:
// { homeTitle: "...", homeDescription: "...", ... }
async function listarComoObjeto() {
  const [linhas] = await db.query("SELECT chave, valor FROM conteudo_site");
  const conteudo = {};
  for (const linha of linhas) {
    conteudo[linha.chave] = linha.valor;
  }
  return conteudo;
}

// Cria ou atualiza um texto institucional (usado pelo painel admin).
async function salvar(chave, valor) {
  await db.query(
    `INSERT INTO conteudo_site (chave, valor) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE valor = VALUES(valor)`,
    [chave, valor]
  );
  return { chave, valor };
}

module.exports = {
  listarComoObjeto,
  salvar,
};
