const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminModel = require("../model/AdminModel");

// POST /api/auth/login
async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Informe e-mail e senha." });
  }

  try {
    const admin = await AdminModel.buscarPorEmail(email.trim().toLowerCase());
    if (!admin) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos." });
    }

    const senhaValida = await bcrypt.compare(senha, admin.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos." });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, papel: admin.papel },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    await AdminModel.registrarAcesso(admin.id);

    return res.json({
      token,
      admin: { id: admin.id, nome: admin.nome, email: admin.email, papel: admin.papel },
    });
  } catch (erro) {
    console.error("[authController.login]", erro);
    return res.status(500).json({ erro: "Erro ao processar o login." });
  }
}

// GET /api/auth/me — retorna os dados do admin autenticado.
// Usado pelo painel para confirmar a sessão ao carregar a página.
async function me(req, res) {
  return res.json({ admin: req.admin });
}

module.exports = { login, me };
