const db = require("../configuracao/db");

const SELECT_BASE = `
  SELECT
    c.id, c.titulo, a.nome AS area, c.nivel, c.modalidade,
    c.carga_horaria, c.turno, c.vagas, c.descricao, c.texto_completo,
    c.faixa_salarial, c.areas_atuacao, c.possibilidades_carreira, c.perfil_profissional,
    c.dica_mascote, c.destaque, c.imagem_url, c.disponivel,
    c.criado_em, c.atualizado_em
  FROM cursos c
  INNER JOIN areas a ON a.id = c.area_id
`;

// Catálogo público: só cursos marcados como disponíveis.
async function listarDisponiveis() {
  const [linhas] = await db.query(
    `${SELECT_BASE} WHERE c.disponivel = TRUE ORDER BY c.criado_em DESC`
  );
  return linhas;
}

// Painel administrativo: todos os cursos, disponíveis ou não,
// para que o admin consiga reativar um curso indisponível.
async function listarTodosParaAdmin() {
  const [linhas] = await db.query(`${SELECT_BASE} ORDER BY c.criado_em DESC`);
  return linhas;
}

async function buscarPorId(id) {
  const [linhas] = await db.query(`${SELECT_BASE} WHERE c.id = ? LIMIT 1`, [id]);
  return linhas[0] || null;
}

const CAMPOS_CURSO = [
  "titulo", "area_id", "nivel", "modalidade", "carga_horaria", "turno", "vagas",
  "descricao", "texto_completo", "faixa_salarial", "areas_atuacao",
  "possibilidades_carreira", "perfil_profissional", "dica_mascote", "destaque",
  "imagem_url", "disponivel",
];

function valoresParaSalvar(dados) {
  return [
    dados.titulo,
    dados.areaId,
    dados.nivel,
    dados.modalidade,
    dados.cargaHoraria,
    dados.turno,
    dados.vagas,
    dados.descricao,
    dados.textoCompleto || null,
    dados.faixaSalarial || null,
    dados.areasAtuacao || null,
    dados.carreiras || null,
    dados.perfilProfissional || null,
    dados.dicaMascote,
    dados.destaque || null,
    dados.imagemUrl,
    dados.disponivel === undefined ? true : dados.disponivel,
  ];
}

// Cria um novo curso. Recebe area_id já resolvido pelo controller.
async function criar(dados) {
  const [resultado] = await db.query(
    `INSERT INTO cursos (${CAMPOS_CURSO.join(", ")})
     VALUES (${CAMPOS_CURSO.map(() => "?").join(", ")})`,
    valoresParaSalvar(dados)
  );
  return buscarPorId(resultado.insertId);
}

async function atualizar(id, dados) {
  await db.query(
    `UPDATE cursos SET ${CAMPOS_CURSO.map((campo) => `${campo} = ?`).join(", ")} WHERE id = ?`,
    [...valoresParaSalvar(dados), id]
  );
  return buscarPorId(id);
}

// Alterna disponível <-> indisponível sem precisar reenviar o
// formulário inteiro — é o botão rápido do painel admin.
// atualizado_em é atualizado automaticamente pelo MySQL (ON UPDATE).
async function alternarDisponibilidade(id, disponivel) {
  await db.query("UPDATE cursos SET disponivel = ? WHERE id = ?", [disponivel, id]);
  return buscarPorId(id);
}

async function remover(id) {
  await db.query("DELETE FROM cursos WHERE id = ?", [id]);
  return { id };
}

module.exports = {
  listarDisponiveis,
  listarTodosParaAdmin,
  buscarPorId,
  criar,
  atualizar,
  alternarDisponibilidade,
  remover,
};