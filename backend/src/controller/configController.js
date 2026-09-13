const ConfigModel = require("../model/ConfigModel");

// GET /api/config — textos institucionais públicos (usados na Home).
async function listar(req, res) {
  try {
    const conteudo = await ConfigModel.listarComoObjeto();
    return res.json(conteudo);
  } catch (erro) {
    console.error("[configController.listar]", erro);
    return res.status(500).json({ erro: "Erro ao carregar os textos da plataforma." });
  }
}

// PUT /api/config (protegida) — cria/atualiza um texto institucional.
async function salvar(req, res) {
  const { chave, valor } = req.body;

  if (!chave || !valor) {
    return res.status(400).json({ erro: "Informe a chave e o valor do texto." });
  }

  try {
    const resultado = await ConfigModel.salvar(chave.trim(), valor.trim());
    return res.json(resultado);
  } catch (erro) {
    console.error("[configController.salvar]", erro);
    return res.status(500).json({ erro: "Erro ao salvar o texto institucional." });
  }
}

module.exports = { listar, salvar };
