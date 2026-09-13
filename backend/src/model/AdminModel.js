const db = require("../configuracao/db");

// Busca um administrador pelo e-mail (usado no login).
async function buscarPorEmail(email) {
  const [linhas] = await db.query(
    "SELECT id, nome, email, senha_hash, papel FROM administradores WHERE email = ? LIMIT 1",
    [email]
  );
  return linhas[0] || null;
}

// Busca um administrador pelo id (usado pelo middleware de auth).
async function buscarPorId(id) {
  const [linhas] = await db.query(
    "SELECT id, nome, email, papel FROM administradores WHERE id = ? LIMIT 1",
    [id]
  );
  return linhas[0] || null;
}

// Cria um novo administrador (usado pelo script criarAdmin.js).
async function criar({ nome, email, senhaHash, papel = "admin" }) {
  const [resultado] = await db.query(
    "INSERT INTO administradores (nome, email, senha_hash, papel) VALUES (?, ?, ?, ?)",
    [nome, email, senhaHash, papel]
  );
  return resultado.insertId;
}

// Atualiza a data/hora do último acesso após um login bem-sucedido.
async function registrarAcesso(id) {
  await db.query(
    "UPDATE administradores SET ultimo_acesso = CURRENT_TIMESTAMP WHERE id = ?",
    [id]
  );
}

module.exports = {
  buscarPorEmail,
  buscarPorId,
  criar,
  registrarAcesso,
};
