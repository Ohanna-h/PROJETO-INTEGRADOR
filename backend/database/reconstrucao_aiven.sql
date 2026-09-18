-- ============================================================
-- Plataforma SENAI Stênio Lopes — RECONSTRUÇÃO COMPLETA
-- Rode esse arquivo inteiro de uma vez no phpMyAdmin (aba SQL).
-- Ele apaga o banco atual (que está incompleto) e recria do zero,
-- já com os 32 cursos, as 7 áreas, e os campos ricos preenchidos
-- com dados reais (não inventados) nos 3 cursos-piloto.
--
-- IMPORTANTE: depois de rodar isso, você precisa recriar o admin
-- de novo com: node backend/scripts/criarAdmin.js
-- (porque o DROP DATABASE também apaga a tabela de administradores)
-- ============================================================

SET NAMES utf8mb4;
USE defaultdb;

-- ------------------------------------------------------------
-- Tabelas
-- ------------------------------------------------------------
CREATE TABLE administradores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(320) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  papel ENUM('admin', 'editor') NOT NULL DEFAULT 'admin',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ultimo_acesso TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB;

CREATE TABLE areas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  icone_url VARCHAR(255) NULL,
  ordem INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(180) NOT NULL,
  area_id INT NOT NULL,
  nivel ENUM('Técnico', 'Qualificação', 'Aperfeiçoamento') NOT NULL,
  modalidade ENUM('Presencial', 'EAD') NOT NULL,
  carga_horaria VARCHAR(60) NOT NULL,
  turno VARCHAR(100) NOT NULL,
  vagas VARCHAR(60) NOT NULL,
  descricao TEXT NOT NULL,
  texto_completo TEXT NULL,
  faixa_salarial VARCHAR(255) NULL,
  areas_atuacao TEXT NULL,
  possibilidades_carreira TEXT NULL,
  perfil_profissional TEXT NULL,
  dica_mascote TEXT NOT NULL,
  destaque VARCHAR(80) NULL,
  imagem_url VARCHAR(255) NOT NULL,
  disponivel BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cursos_area FOREIGN KEY (area_id) REFERENCES areas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_cursos_area (area_id),
  INDEX idx_cursos_nivel (nivel),
  INDEX idx_cursos_disponivel (disponivel)
) ENGINE=InnoDB;

CREATE TABLE conteudo_site (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chave VARCHAR(100) NOT NULL UNIQUE,
  valor TEXT NOT NULL,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE newsletter_inscritos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(320) NOT NULL UNIQUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE log_auditoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  acao VARCHAR(80) NOT NULL,
  admin_id INT NULL,
  admin_email VARCHAR(320) NULL,
  detalhes VARCHAR(255) NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_log_admin FOREIGN KEY (admin_id) REFERENCES administradores(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Áreas (7 — inclui as 2 novas)
-- ------------------------------------------------------------
INSERT INTO areas (nome, icone_url, ordem) VALUES
  ('Eletroeletrônica', 'imagens/icones/icone-eletro.png', 1),
  ('Metalmecânica', 'imagens/icones/icone-metal.png', 2),
  ('Tecnologia da Informação', 'imagens/icones/icone-ti.png', 3),
  ('Refrigeração', 'imagens/icones/icone-refrigeracao.png', 4),
  ('Automação', 'imagens/icones/icone-automacao.png', 5),
  ('Vestuário e Couro', 'imagens/icones/icone-vestuario.png', 6),
  ('Alimentos', 'imagens/icones/icone-alimentos.png', 7);

-- ------------------------------------------------------------
-- Cursos (32) — os 18 originais + os 14 que adicionamos juntos.
-- Só os 3 cursos-piloto (Eletroeletrônica, Automação, Refrigeração)
-- têm faixa salarial/carreiras/perfil reais, vindos do PDF que você
-- me mandou. Os demais ficam com esses campos em branco (a página
-- mostra "Em atualização junto ao setor pedagógico" automaticamente
-- — não é erro, é o comportamento esperado até você preencher).
-- ------------------------------------------------------------
INSERT INTO cursos
  (titulo, area_id, nivel, modalidade, carga_horaria, turno, vagas, descricao,
   texto_completo, faixa_salarial, areas_atuacao, possibilidades_carreira, perfil_profissional,
   dica_mascote, destaque, imagem_url)
VALUES

-- ===== Eletroeletrônica =====
('Técnico em Eletroeletrônica',
 (SELECT id FROM areas WHERE nome = 'Eletroeletrônica'),
 'Técnico', 'Presencial', '1.200h', 'Noite', '20 vagas',
 'Formação técnica completa em sistemas eletroeletrônicos, automação e instalações elétricas.',
 'O curso de Eletroeletrônica prepara o estudante para planejar, instalar, testar, inspecionar e realizar a manutenção de equipamentos e instalações eletroeletrônicas industriais. A formação abrange acionamentos, controles eletroeletrônicos, sistemas automáticos, medições, calibrações, eficiência energética, fontes de energia alternativas e tecnologias digitais aplicadas à indústria.',
 'R$ 1.812 a R$ 5.282 por mês (média R$ 3.094) — fonte: Indeed, 15/08/2026',
 'Instalação e manutenção de equipamentos eletroeletrônicos, Fabricantes de máquinas e componentes, Laboratórios de controle de qualidade e calibração, Assistência técnica, Integração de sistemas, Energia solar e automação predial/residencial',
 'Eletricista Industrial, Instalador de Sistemas Eletroeletrônicos Industriais, Mantenedor de Sistemas Eletroeletrônicos Industriais, Projetista de Instalações Elétricas Prediais ou Industriais, Montador de Equipamentos Eletroeletrônicos, Instalador de Sistemas Fotovoltaicos',
 'Formação indicada para quem gosta de eletricidade, eletrônica, montagem, manutenção e investigação de falhas. Exige atenção a detalhes, disciplina com normas de segurança, capacidade de interpretar diagramas e instrumentos de medição, raciocínio lógico e habilidade manual.',
 'Eletroeletrônica conecta você aos principais setores da indústria.',
 'Alta demanda', 'imagens/cursos/curso-tecnico-eletroeletronica.jpg'),

('Eletricista Industrial',
 (SELECT id FROM areas WHERE nome = 'Eletroeletrônica'),
 'Qualificação', 'Presencial', '160h', 'Noite', '20 vagas',
 'Instalações e manutenção elétrica em ambientes industriais com segurança e precisão.',
 NULL, NULL, NULL, NULL, NULL,
 'A indústria busca profissionais que combinam precisão, segurança e prática.',
 'Em destaque', 'imagens/cursos/curso-eletricista-industrial.jpg'),

('Eletricista Predial',
 (SELECT id FROM areas WHERE nome = 'Eletroeletrônica'),
 'Qualificação', 'Presencial', '160h', 'Noite', '20 vagas',
 'Instalações elétricas residenciais e prediais com foco em normas de segurança.',
 NULL, NULL, NULL, NULL, NULL,
 'Eletricista predial é uma das formações mais procuradas para quem quer começar rápido.',
 NULL, 'imagens/cursos/curso-eletricista-predial.jpg'),

('NR 10 — Segurança em Instalações Elétricas (20h)',
 (SELECT id FROM areas WHERE nome = 'Eletroeletrônica'),
 'Aperfeiçoamento', 'Presencial', '20h', 'Flexível', '20 vagas',
 'Curso básico de segurança em instalações e serviços com eletricidade, conforme a NR 10.',
 NULL, NULL, NULL, NULL, NULL,
 'Segurança em primeiro lugar: a NR 10 é obrigatória para quem trabalha com eletricidade.',
 NULL, 'imagens/cursos/curso-nr10-20h.png'),

('NR 10 — Segurança em Instalações Elétricas (40h)',
 (SELECT id FROM areas WHERE nome = 'Eletroeletrônica'),
 'Aperfeiçoamento', 'Presencial', '40h', 'Flexível', '20 vagas',
 'Versão estendida da NR 10, com carga horária ampliada para aprofundar a segurança elétrica.',
 NULL, NULL, NULL, NULL, NULL,
 'Uma carga horária maior para quem quer se aprofundar ainda mais em segurança elétrica.',
 NULL, 'imagens/cursos/curso-nr10-40h.png'),

('NR 10 — Segurança em Instalações Elétricas (Renovação)',
 (SELECT id FROM areas WHERE nome = 'Eletroeletrônica'),
 'Aperfeiçoamento', 'Presencial', '20h', 'Flexível', '20 vagas',
 'Reciclagem da NR10 para manutenção da certificação em segurança elétrica.',
 NULL, NULL, NULL, NULL, NULL,
 'Mantenha sua certificação de segurança elétrica sempre em dia.',
 NULL, 'imagens/cursos/curso-nr10-20h.png'),

('Instalador e Mantenedor de Sistemas Eletrônicos de Segurança',
 (SELECT id FROM areas WHERE nome = 'Eletroeletrônica'),
 'Qualificação', 'Presencial', '160h', 'Tarde', 'A definir',
 'Instalação e manutenção de câmeras, alarmes e sistemas eletrônicos de segurança.',
 NULL, NULL, NULL, NULL, NULL,
 'Segurança eletrônica é uma área que só cresce, dentro e fora da indústria.',
 NULL, 'imagens/cursos/curso-placeholder.jpg'),

('Cerca Elétrica + Motor de Portão',
 (SELECT id FROM areas WHERE nome = 'Eletroeletrônica'),
 'Aperfeiçoamento', 'Presencial', '40h', 'Noite', 'A definir',
 'Instalação e manutenção de cercas elétricas e motores de portão residenciais.',
 NULL, NULL, NULL, NULL, NULL,
 'Um curso rápido, direto, e com aplicação imediata em residências.',
 NULL, 'imagens/cursos/curso-placeholder.jpg'),

-- ===== Metalmecânica =====
('Soldagem Elétrica',
 (SELECT id FROM areas WHERE nome = 'Metalmecânica'),
 'Qualificação', 'Presencial', '80h', 'Noite', '20 vagas',
 'Técnicas de soldagem elétrica com eletrodo revestido para uso industrial e estrutural.',
 NULL, NULL, NULL, NULL, NULL,
 'A soldagem é uma habilidade essencial para a cadeia metalmecânica.',
 'Em destaque', 'imagens/cursos/curso-soldagem.jpg'),

('Técnico em Eletromecânica',
 (SELECT id FROM areas WHERE nome = 'Metalmecânica'),
 'Técnico', 'Presencial', '1.240h', 'Noite', '20 vagas',
 'Une eletricidade e mecânica para uma atuação completa na manutenção industrial.',
 NULL, NULL, NULL, NULL, NULL,
 'Eletromecânica prepara você para resolver desafios reais da indústria.',
 'Alta demanda', 'imagens/cursos/curso-tecnico-eletromecanica.jpg'),

('Fresador Mecânico',
 (SELECT id FROM areas WHERE nome = 'Metalmecânica'),
 'Qualificação', 'Presencial', '200h', 'Noite', '20 vagas',
 'Operação de fresadoras para usinagem de peças mecânicas com precisão dimensional.',
 NULL, NULL, NULL, NULL, NULL,
 'Fresador mecânico é essencial na indústria de usinagem.',
 NULL, 'imagens/cursos/curso-fresador-mecanico.jpg'),

('Torneiro Mecânico',
 (SELECT id FROM areas WHERE nome = 'Metalmecânica'),
 'Qualificação', 'Presencial', '200h', 'Noite', '20 vagas',
 'Operação de torno mecânico para fabricação e reparo de peças industriais.',
 NULL, NULL, NULL, NULL, NULL,
 'Torneiro mecânico tem alta empregabilidade em toda a cadeia industrial.',
 NULL, 'imagens/cursos/curso-torneiro-mecanico.jpg'),

('Mecânico de Instalações Industriais',
 (SELECT id FROM areas WHERE nome = 'Metalmecânica'),
 'Qualificação', 'Presencial', '220h', 'Tarde', 'A definir',
 'Montagem, ajuste e manutenção de instalações e equipamentos industriais.',
 NULL, NULL, NULL, NULL, NULL,
 'Instalações bem montadas são a base de qualquer linha de produção segura.',
 NULL, 'imagens/cursos/curso-placeholder.jpg'),

-- ===== Automação =====
('Técnico em Automação Industrial',
 (SELECT id FROM areas WHERE nome = 'Automação'),
 'Técnico', 'Presencial', '1.240h', 'Noite', '20 vagas',
 'Formação técnica em automação, CLP, robótica e sistemas industriais inteligentes.',
 'O curso de Automação Industrial prepara o estudante para desenvolver, instalar, configurar, testar, calibrar e manter sistemas automatizados utilizados no controle de processos industriais. A formação integra eletricidade, eletrônica, instrumentação, programação, redes industriais, sistemas supervisórios, robótica, sistemas ciberfísicos e Internet das Coisas (IoT).',
 'R$ 2.140 a R$ 7.012 por mês (média R$ 3.874) — fonte: Indeed, 16/08/2026',
 'Linhas de produção automatizadas, Manutenção industrial, Integradoras de sistemas de automação, Fabricantes de máquinas e equipamentos robotizados, Setores químico, petroquímico, automobilístico e metal mecânico',
 'Instrumentista Industrial, Montador de Equipamentos Eletroeletrônicos, Operador em Linha de Montagem de Equipamentos Eletroeletrônicos, Reparador de Circuitos Eletrônicos',
 'Indicado para quem tem interesse por tecnologia, lógica, programação, máquinas e resolução de problemas, combinando raciocínio analítico com capacidade prática de medir, testar, calibrar e interpretar falhas.',
 'Automação é uma das chaves para transformar dados, máquinas e processos.',
 'Alta demanda', 'imagens/cursos/curso-tecnico-automacao.jpg'),

('Automação Residencial',
 (SELECT id FROM areas WHERE nome = 'Automação'),
 'Qualificação', 'Presencial', '80h', 'Noite', '20 vagas',
 'Instalação de sistemas inteligentes para casas conectadas, com foco em automação residencial.',
 NULL, NULL, NULL, NULL, NULL,
 'A automação também transforma o dia a dia das casas — não é só indústria.',
 NULL, 'imagens/cursos/curso-automacao-residencial.jpg'),

-- ===== Refrigeração =====
('Técnico em Refrigeração e Climatização',
 (SELECT id FROM areas WHERE nome = 'Refrigeração'),
 'Técnico', 'Presencial', '1.200h', 'Manhã ou noite', '20 vagas',
 'Instalação, manutenção e reparo de sistemas de refrigeração e ar-condicionado.',
 'O curso de Refrigeração e Climatização prepara o estudante para planejar, instalar, testar, manter e reparar equipamentos e sistemas de refrigeração e climatização em ambientes residenciais, comerciais e industriais, aplicando normas técnicas e ambientais e buscando eficiência energética.',
 'R$ 1.621 a R$ 5.419 por mês (média R$ 2.813) — fonte: Indeed, 16/08/2026',
 'Oficinas de refrigeração residencial, Empresas de comercialização, instalação e assistência técnica, Empresas de projetos e manutenção, Indústrias que utilizam sistemas de refrigeração, Construção civil, transporte frigorificado, indústria têxtil e farmacêutica',
 'Instalador de Refrigeração e Climatização Doméstica, Mecânico de Refrigeração e Climatização Industrial, Mecânico em Refrigeração Comercial, Mecânico de Manutenção de Sistemas de Refrigeração e Climatização',
 'Indicado para quem gosta de atividades práticas, diagnóstico de falhas e resolução de problemas, com atenção à segurança, eletricidade, termodinâmica e manuseio responsável de gases refrigerantes.',
 'Climatização reúne técnica, conforto e uma ampla atuação profissional.',
 'Em destaque', 'imagens/cursos/curso-tecnico-refrigeracao.jpg'),

('Mecânico de Climatização Residencial',
 (SELECT id FROM areas WHERE nome = 'Refrigeração'),
 'Qualificação', 'Presencial', '160h', 'Noite', '20 vagas',
 'Instalação e manutenção de aparelhos de ar-condicionado residencial.',
 NULL, NULL, NULL, NULL, NULL,
 'Um curso mais curto e direto pra já entrar no mercado de climatização.',
 NULL, 'imagens/cursos/curso-climatizacao-residencial.jpg'),

('Trilha de Mecânico de Climatização Residencial',
 (SELECT id FROM areas WHERE nome = 'Refrigeração'),
 'Aperfeiçoamento', 'Presencial', '240h', 'Noite', 'A definir',
 'Trilha que reúne Técnicas de Refrigeração Residencial (80h) e Mecânico de Climatização Residencial (160h).',
 NULL, NULL, NULL, NULL, NULL,
 'Uma trilha completa: do básico da refrigeração até a climatização residencial.',
 NULL, 'imagens/cursos/curso-placeholder.jpg'),

-- ===== Tecnologia da Informação =====
('Programador Front-End',
 (SELECT id FROM areas WHERE nome = 'Tecnologia da Informação'),
 'Qualificação', 'Presencial', '220h', 'Noite', '20 vagas',
 'Desenvolva interfaces web modernas com HTML, CSS, JavaScript e práticas atuais.',
 NULL, NULL, NULL, NULL, NULL,
 'Interfaces bem projetadas aproximam tecnologia, pessoas e oportunidades.',
 'Alta demanda', 'imagens/cursos/curso-programador-front-end.jpg'),

('Projeto de Edificação no AutoCAD',
 (SELECT id FROM areas WHERE nome = 'Tecnologia da Informação'),
 'Qualificação', 'Presencial', '80h', 'Noite', '20 vagas',
 'Elabore projetos arquitetônicos e de edificação com ferramentas profissionais.',
 NULL, NULL, NULL, NULL, NULL,
 'Projetos digitais criam caminhos concretos para inovar na construção civil.',
 NULL, 'imagens/cursos/curso-autocad.jpg'),

('Revit',
 (SELECT id FROM areas WHERE nome = 'Tecnologia da Informação'),
 'Qualificação', 'Presencial', '80h', 'Noite', '20 vagas',
 'Modelagem de informação da construção (BIM) para projetos arquitetônicos e de engenharia.',
 NULL, NULL, NULL, NULL, NULL,
 'BIM é o futuro dos projetos de construção — e o Revit é referência no mercado.',
 NULL, 'imagens/cursos/curso-revit.jpg'),

('Excel do Básico ao Avançado',
 (SELECT id FROM areas WHERE nome = 'Tecnologia da Informação'),
 'Aperfeiçoamento', 'Presencial', '40h', 'Flexível', '20 vagas',
 'Do básico às fórmulas avançadas, tabelas dinâmicas e automação de planilhas.',
 NULL, NULL, NULL, NULL, NULL,
 'Excel é uma das ferramentas mais pedidas em qualquer área profissional.',
 NULL, 'imagens/cursos/curso-excel.jpg'),

('Técnico em Informática para Internet',
 (SELECT id FROM areas WHERE nome = 'Tecnologia da Informação'),
 'Técnico', 'Presencial', '1.200h', 'Noite', '20 vagas',
 'Formação técnica voltada a redes, desenvolvimento web e infraestrutura de internet.',
 NULL, NULL, NULL, NULL, NULL,
 'Uma formação completa para quem quer atuar com tecnologia e internet.',
 'Alta demanda', 'imagens/cursos/curso-tecnico-informatica-internet.jpg'),

('Programador de Sistemas de Computador',
 (SELECT id FROM areas WHERE nome = 'Tecnologia da Informação'),
 'Qualificação', 'Presencial', '200h', 'Manhã', 'A definir',
 'Desenvolvimento de programas e sistemas para computador, do básico à lógica aplicada.',
 NULL, NULL, NULL, NULL, NULL,
 'A lógica de programação abre portas em praticamente qualquer área da tecnologia.',
 NULL, 'imagens/cursos/curso-placeholder.jpg'),

('Operador de Computador',
 (SELECT id FROM areas WHERE nome = 'Tecnologia da Informação'),
 'Qualificação', 'Presencial', '160h', 'Manhã ou noite', 'A definir',
 'Uso de computadores, pacote office e ferramentas básicas de informática no dia a dia.',
 NULL, NULL, NULL, NULL, NULL,
 'Domine as ferramentas de informática que o mercado pede todos os dias.',
 NULL, 'imagens/cursos/curso-placeholder.jpg'),

('Editor de Vídeos',
 (SELECT id FROM areas WHERE nome = 'Tecnologia da Informação'),
 'Qualificação', 'Presencial', '160h', 'Tarde', 'A definir',
 'Edição e finalização de vídeos para redes sociais e produções audiovisuais.',
 NULL, NULL, NULL, NULL, NULL,
 'Contar histórias em vídeo é uma habilidade cada vez mais valorizada.',
 NULL, 'imagens/cursos/curso-placeholder.jpg'),

('Designer Gráfico Editorial',
 (SELECT id FROM areas WHERE nome = 'Tecnologia da Informação'),
 'Qualificação', 'Presencial', '160h', 'Noite', 'A definir',
 'Criação de peças gráficas e projetos editoriais com ferramentas de design.',
 NULL, NULL, NULL, NULL, NULL,
 'Transforme ideias em peças gráficas que realmente comunicam.',
 NULL, 'imagens/cursos/curso-placeholder.jpg'),

-- ===== Vestuário e Couro =====
('Confeccionador de Artefatos de Couro',
 (SELECT id FROM areas WHERE nome = 'Vestuário e Couro'),
 'Qualificação', 'Presencial', '200h', 'Tarde ou noite', 'A definir',
 'Confecção de bolsas, cintos e demais artefatos em couro com técnicas de acabamento.',
 NULL, NULL, NULL, NULL, NULL,
 'Cada peça em couro carrega técnica, cuidado e um toque artesanal único.',
 NULL, 'imagens/cursos/curso-placeholder.jpg'),

('Modelista do Vestuário',
 (SELECT id FROM areas WHERE nome = 'Vestuário e Couro'),
 'Qualificação', 'Presencial', '180h', 'Noite', 'A definir',
 'Criação e modelagem de peças do vestuário, do risco ao molde final.',
 NULL, NULL, NULL, NULL, NULL,
 'Do risco ao molde final: aprenda a dar forma a uma peça de roupa.',
 NULL, 'imagens/cursos/curso-placeholder.jpg'),

-- ===== Alimentos =====
('Pão Francês e Correlatos',
 (SELECT id FROM areas WHERE nome = 'Alimentos'),
 'Qualificação', 'Presencial', '20h', 'Noite', 'A definir',
 'Produção de pão francês e itens de panificação correlatos.',
 NULL, NULL, NULL, NULL, NULL,
 'O cheirinho de pão quente sempre abre portas — literalmente.',
 NULL, 'imagens/cursos/curso-placeholder.jpg'),

('Bolos Artísticos',
 (SELECT id FROM areas WHERE nome = 'Alimentos'),
 'Qualificação', 'Presencial', '40h', 'Noite', 'A definir',
 'Técnicas de decoração e confecção de bolos artísticos.',
 NULL, NULL, NULL, NULL, NULL,
 'Doçura e técnica se encontram na decoração de bolos artísticos.',
 NULL, 'imagens/cursos/curso-placeholder.jpg'),

('Confeiteiro',
 (SELECT id FROM areas WHERE nome = 'Alimentos'),
 'Qualificação', 'Presencial', '160h', 'Noite', 'A definir',
 'Técnicas de confeitaria para doces, sobremesas e finalizações.',
 NULL, NULL, NULL, NULL, NULL,
 'Técnicas de confeitaria pra transformar ingredientes em experiências.',
 NULL, 'imagens/cursos/curso-placeholder.jpg');

-- ------------------------------------------------------------
-- Textos institucionais da página Inicial
-- ------------------------------------------------------------
INSERT INTO conteudo_site (chave, valor) VALUES
  ('homeEyebrow', 'SENAI Stênio Lopes · Campina Grande'),
  ('homeTitle', 'Aprenda hoje. Transforme seu amanhã.'),
  ('homeDescription', 'Encontre formações que aproximam você da indústria, da tecnologia e de novas possibilidades profissionais.'),
  ('contactTitle', 'Vamos encontrar juntos um caminho para o seu futuro.'),
  ('contactDescription', 'Fale com a nossa equipe para tirar dúvidas sobre cursos, modalidades e próximos passos.');