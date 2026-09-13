-- ============================================================
-- Plataforma SENAI Stênio Lopes — Schema do banco de dados
-- Banco: MySQL 8+
-- ============================================================

-- Garante que os acentos sejam lidos corretamente na importação,
-- independentemente do charset padrão do cliente mysql/phpMyAdmin.
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS plataforma_senai
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE plataforma_senai;

-- ------------------------------------------------------------
-- Tabela: administradores
-- Usuários com acesso ao painel administrativo (/administrador).
-- Login simples com e-mail + senha (hash bcrypt) + JWT.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS administradores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(320) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  papel ENUM('admin', 'editor') NOT NULL DEFAULT 'admin',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ultimo_acesso TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabela: areas
-- Áreas de formação (Eletroeletrônica, Metalmecânica, etc.).
-- Guardar em tabela própria (em vez de string solta em "cursos")
-- é o que deixa a plataforma flexível a novas áreas no futuro.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS areas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  icone_url VARCHAR(255) NULL,
  ordem INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabela: cursos
-- Catálogo de cursos exibido na página inicial.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(180) NOT NULL,
  area_id INT NOT NULL,
  nivel ENUM('Técnico', 'Qualificação', 'Aperfeiçoamento') NOT NULL,
  modalidade ENUM('Presencial', 'EAD') NOT NULL,
  carga_horaria VARCHAR(60) NOT NULL,
  turno VARCHAR(100) NOT NULL,
  vagas VARCHAR(60) NOT NULL,
  descricao TEXT NOT NULL,
  dica_mascote TEXT NOT NULL,
  destaque VARCHAR(80) NULL,
  imagem_url VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cursos_area FOREIGN KEY (area_id) REFERENCES areas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_cursos_area (area_id),
  INDEX idx_cursos_nivel (nivel)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabela: conteudo_site
-- Textos institucionais editáveis pelo painel admin
-- (título do hero, descrição, textos de contato...) sem precisar
-- mexer em código.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conteudo_site (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chave VARCHAR(100) NOT NULL UNIQUE,
  valor TEXT NOT NULL,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabela: newsletter_inscritos
-- E-mails cadastrados para receber novidades da unidade.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS newsletter_inscritos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(320) NOT NULL UNIQUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabela: log_auditoria
-- Registro simples de ações administrativas sensíveis.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS log_auditoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  acao VARCHAR(80) NOT NULL,
  admin_id INT NULL,
  admin_email VARCHAR(320) NULL,
  detalhes VARCHAR(255) NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_log_admin FOREIGN KEY (admin_id) REFERENCES administradores(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;
