-- ============================================================
-- Migração: disponibilidade do curso
-- Permite marcar um curso como "disponível" ou "indisponível"
-- sem precisar deletá-lo do banco. Cursos indisponíveis somem
-- do catálogo público, mas continuam no sistema para reativação
-- futura (ex: curso que sai de oferta e volta depois).
-- ============================================================

USE plataforma_senai;

ALTER TABLE cursos
  ADD COLUMN disponivel BOOLEAN NOT NULL DEFAULT TRUE AFTER imagem_url;

-- Índice ajuda a consulta pública (que sempre filtra por disponível = true)
CREATE INDEX idx_cursos_disponivel ON cursos (disponivel);