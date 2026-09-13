/**
 * Script de linha de comando para criar o primeiro administrador
 * do painel. Rode com:
 *
 *   node scripts/criarAdmin.js "Seu Nome" seu.email@senai.br suaSenha123
 *
 * A senha é transformada em hash com bcrypt antes de ir para o banco —
 * nunca é guardada em texto puro.
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const bcrypt = require("bcryptjs");
const AdminModel = require("../src/model/AdminModel");

async function main() {
  const [nome, email, senha] = process.argv.slice(2);

  if (!nome || !email || !senha) {
    console.log("Uso: node scripts/criarAdmin.js \"Nome Completo\" email@senai.br senha123");
    process.exit(1);
  }

  const existente = await AdminModel.buscarPorEmail(email.trim().toLowerCase());
  if (existente) {
    console.log(`Já existe um administrador com o e-mail ${email}.`);
    process.exit(1);
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const id = await AdminModel.criar({ nome, email: email.trim().toLowerCase(), senhaHash });

  console.log(`Administrador criado com sucesso (id ${id}).`);
  process.exit(0);
}

main().catch((erro) => {
  console.error("Erro ao criar administrador:", erro);
  process.exit(1);
});
