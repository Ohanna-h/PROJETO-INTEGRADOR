const CursoModel = require("../model/CursoModel");
const AreaModel = require("../model/AreaModel");

// Converte a linha do banco (snake_case, em português) para o
// formato usado pelo frontend (camelCase). possibilidades_carreira
// e areas_atuacao chegam do banco como texto separado por vírgula
// — o frontend (formatarParaArray, em curso-completo.js) já sabe
// transformar isso numa lista de tags.
function paraFrontend(curso) {
  return {
    id: curso.id,
    titulo: curso.titulo,
    area: curso.area,
    nivel: curso.nivel,
    modalidade: curso.modalidade,
    cargaHoraria: curso.carga_horaria,
    turno: curso.turno,
    vagas: curso.vagas,
    descricao: curso.descricao,
    textoCompleto: curso.texto_completo,
    faixaSalarial: curso.faixa_salarial,
    areasAtuacao: curso.areas_atuacao,
    carreiras: curso.possibilidades_carreira,
    perfilProfissional: curso.perfil_profissional,
    dicaMascote: curso.dica_mascote,
    destaque: curso.destaque,
    imagemUrl: curso.imagem_url,
    disponivel: Boolean(curso.disponivel),
    atualizadoEm: curso.atualizado_em,
  };
}

// Valida e resolve os campos recebidos do formulário do painel
// administrativo antes de enviar ao model.
async function prepararDados(body) {
  const area = await AreaModel.buscarPorNome(body.area);
  if (!area) {
    throw new Error(`Área "${body.area}" não encontrada.`);
  }

  return {
    titulo: String(body.titulo || "").trim(),
    areaId: area.id,
    nivel: body.nivel,
    modalidade: body.modalidade,
    cargaHoraria: String(body.cargaHoraria || "").trim(),
    turno: String(body.turno || "").trim(),
    vagas: String(body.vagas || "").trim(),
    descricao: String(body.descricao || "").trim(),
    textoCompleto: body.textoCompleto ? String(body.textoCompleto).trim() : null,
    faixaSalarial: body.faixaSalarial ? String(body.faixaSalarial).trim() : null,
    areasAtuacao: body.areasAtuacao ? String(body.areasAtuacao).trim() : null,
    carreiras: body.carreiras ? String(body.carreiras).trim() : null,
    perfilProfissional: body.perfilProfissional ? String(body.perfilProfissional).trim() : null,
    dicaMascote: String(body.dicaMascote || "").trim(),
    destaque: body.destaque ? String(body.destaque).trim() : null,
    imagemUrl: String(body.imagemUrl || "").trim(),
    disponivel: body.disponivel === undefined ? true : Boolean(body.disponivel),
  };
}

// GET /api/cursos — catálogo público. Só cursos disponíveis.
async function listar(req, res) {
  try {
    const cursos = await CursoModel.listarDisponiveis();
    return res.json(cursos.map(paraFrontend));
  } catch (erro) {
    console.error("[cursosController.listar]", erro);
    return res.status(500).json({ erro: "Erro ao carregar o catálogo de cursos." });
  }
}

// GET /api/cursos/admin (protegida) — todos os cursos, disponíveis
// ou não, para o painel administrativo gerenciar.
async function listarParaAdmin(req, res) {
  try {
    const cursos = await CursoModel.listarTodosParaAdmin();
    return res.json(cursos.map(paraFrontend));
  } catch (erro) {
    console.error("[cursosController.listarParaAdmin]", erro);
    return res.status(500).json({ erro: "Erro ao carregar os cursos para o painel." });
  }
}

// POST /api/cursos (protegida)
async function criar(req, res) {
  try {
    const dados = await prepararDados(req.body);
    if (dados.titulo.length < 3 || dados.descricao.length < 10 || dados.dicaMascote.length < 10) {
      return res.status(400).json({ erro: "Preencha todos os campos obrigatórios corretamente." });
    }
    const curso = await CursoModel.criar(dados);
    return res.status(201).json(paraFrontend(curso));
  } catch (erro) {
    console.error("[cursosController.criar]", erro);
    return res.status(400).json({ erro: erro.message || "Erro ao criar o curso." });
  }
}

// PUT /api/cursos/:id (protegida)
async function atualizar(req, res) {
  try {
    const dados = await prepararDados(req.body);
    const curso = await CursoModel.atualizar(req.params.id, dados);
    if (!curso) {
      return res.status(404).json({ erro: "Curso não encontrado." });
    }
    return res.json(paraFrontend(curso));
  } catch (erro) {
    console.error("[cursosController.atualizar]", erro);
    return res.status(400).json({ erro: erro.message || "Erro ao atualizar o curso." });
  }
}

// PATCH /api/cursos/:id/disponibilidade (protegida)
async function alternarDisponibilidade(req, res) {
  try {
    const disponivel = Boolean(req.body.disponivel);
    const curso = await CursoModel.alternarDisponibilidade(req.params.id, disponivel);
    if (!curso) {
      return res.status(404).json({ erro: "Curso não encontrado." });
    }
    return res.json(paraFrontend(curso));
  } catch (erro) {
    console.error("[cursosController.alternarDisponibilidade]", erro);
    return res.status(500).json({ erro: "Erro ao alterar a disponibilidade do curso." });
  }
}

// DELETE /api/cursos/:id (protegida)
async function remover(req, res) {
  try {
    await CursoModel.remover(req.params.id);
    return res.json({ sucesso: true });
  } catch (erro) {
    console.error("[cursosController.remover]", erro);
    return res.status(500).json({ erro: "Erro ao remover o curso." });
  }
}

module.exports = {
  listar,
  listarParaAdmin,
  criar,
  atualizar,
  alternarDisponibilidade,
  remover,
};