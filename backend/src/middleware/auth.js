const jwt = require("jsonwebtoken");
const AdminModel = require("../model/AdminModel");

// Protege rotas administrativas: exige um token JWT válido no
// cabeçalho Authorization (formato "Bearer <token>").
async function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization || "";
  const [tipo, token] = cabecalho.split(" ");

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({ erro: "Token de acesso não informado." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await AdminModel.buscarPorId(payload.id);

    if (!admin) {
      return res.status(401).json({ erro: "Sessão inválida. Faça login novamente." });
    }

    req.admin = admin;
    next();
  } catch (erro) {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}

module.exports = { autenticar };
