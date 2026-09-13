const AreaModel = require("../model/AreaModel");

// GET /api/areas — lista pública das áreas de formação, usada
// para montar os botões de filtro do catálogo.
async function listar(req, res) {
  try {
    const areas = await AreaModel.listarTodas();
    return res.json(areas);
  } catch (erro) {
    console.error("[areasController.listar]", erro);
    return res.status(500).json({ erro: "Erro ao carregar as áreas de formação." });
  }
}

module.exports = { listar };
