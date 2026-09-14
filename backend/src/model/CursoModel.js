const db = require("../configuracao/db");

const SELECT_BASE = `
  SELECT
    c.id, c.titulo, a.nome AS area, c.nivel, c.modalidade,
    c.carga_horaria, c.turno, c.vagas, c.descricao,
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

// Cria um novo curso. Recebe area_id já resolvido pelo controller.
async function criar(dados) {
  const [resultado] = await db.query(
    `INSERT INTO cursos
      (titulo, area_id, nivel, modalidade, carga_horaria, turno, vagas, descricao, dica_mascote, destaque, imagem_url, disponivel)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      dados.titulo,
      dados.areaId,
      dados.nivel,
      dados.modalidade,
      dados.cargaHoraria,
      dados.turno,
      dados.vagas,
      dados.descricao,
      dados.dicaMascote,
      dados.destaque || null,
      dados.imagemUrl,
      dados.disponivel === undefined ? true : dados.disponivel,
    ]
  );
  return buscarPorId(resultado.insertId);
}

async function atualizar(id, dados) {
  await db.query(
    `UPDATE cursos SET
      titulo = ?, area_id = ?, nivel = ?, modalidade = ?, carga_horaria = ?,
      turno = ?, vagas = ?, descricao = ?, dica_mascote = ?, destaque = ?, imagem_url = ?, disponivel = ?
     WHERE id = ?`,
    [
      dados.titulo,
      dados.areaId,
      dados.nivel,
      dados.modalidade,
      dados.cargaHoraria,
      dados.turno,
      dados.vagas,
      dados.descricao,
      dados.dicaMascote,
      dados.destaque || null,
      dados.imagemUrl,
      dados.disponivel === undefined ? true : dados.disponivel,
      id,
    ]
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