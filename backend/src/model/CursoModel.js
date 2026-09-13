const db = require("../configuracao/db");

const SELECT_BASE = `
  SELECT
    c.id, c.titulo, a.nome AS area, c.nivel, c.modalidade,
    c.carga_horaria, c.turno, c.vagas, c.descricao,
    c.dica_mascote, c.destaque, c.imagem_url,
    c.criado_em, c.atualizado_em
  FROM cursos c
  INNER JOIN areas a ON a.id = c.area_id
`;

// Lista todos os cursos do catálogo, do mais recente para o mais antigo.
async function listarTodos() {
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
      (titulo, area_id, nivel, modalidade, carga_horaria, turno, vagas, descricao, dica_mascote, destaque, imagem_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
    ]
  );
  return buscarPorId(resultado.insertId);
}

async function atualizar(id, dados) {
  await db.query(
    `UPDATE cursos SET
      titulo = ?, area_id = ?, nivel = ?, modalidade = ?, carga_horaria = ?,
      turno = ?, vagas = ?, descricao = ?, dica_mascote = ?, destaque = ?, imagem_url = ?
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
      id,
    ]
  );
  return buscarPorId(id);
}

async function remover(id) {
  await db.query("DELETE FROM cursos WHERE id = ?", [id]);
  return { id };
}

module.exports = {
  listarTodos,
  buscarPorId,
  criar,
  atualizar,
  remover,
};
