-- ============================================================
-- Plataforma SENAI Stênio Lopes — Dados iniciais (seed)
-- Rode depois de shema.sql estar aplicado.
-- ============================================================

-- Garante que os acentos sejam lidos corretamente na importação,
-- independentemente do charset padrão do cliente mysql/phpMyAdmin.
SET NAMES utf8mb4;

USE plataforma_senai;

-- ------------------------------------------------------------
-- Áreas de formação
-- ------------------------------------------------------------
INSERT INTO areas (nome, icone_url, ordem) VALUES
  ('Eletroeletrônica', '/imagens/icones/icone-eletro.png', 1),
  ('Metalmecânica', '/imagens/icones/icone-metal.png', 2),
  ('Tecnologia da Informação', '/imagens/icones/icone-ti.png', 3),
  ('Refrigeração', '/imagens/icones/icone-refrigeracao.png', 4),
  ('Automação', '/imagens/icones/icone-automacao.png', 5)
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

-- ------------------------------------------------------------
-- Cursos do catálogo
--
-- ATENÇÃO: carga_horaria, turno e vagas abaixo são valores de
-- exemplo (placeholder) — troque pelos números reais de cada
-- curso direto pelo painel administrativo antes de apresentar
-- o projeto. As imagens e os títulos já são os reais.
-- ------------------------------------------------------------
INSERT INTO cursos
  (titulo, area_id, nivel, modalidade, carga_horaria, turno, vagas, descricao, dica_mascote, destaque, imagem_url)
VALUES
  -- Eletroeletrônica
  ('Técnico em Eletroeletrônica',
   (SELECT id FROM areas WHERE nome = 'Eletroeletrônica'),
   'Técnico', 'Presencial', '1.200h', 'Noite', '20 vagas',
   'Formação técnica completa em sistemas eletroeletrônicos, automação e instalações elétricas.',
   'Eletroeletrônica conecta você aos principais setores da indústria.',
   'Alta demanda', '/imagens/cursos/curso-tecnico-eletroeletronica.jpg'),

  ('Eletricista Industrial',
   (SELECT id FROM areas WHERE nome = 'Eletroeletrônica'),
   'Qualificação', 'Presencial', '160h', 'Noite', '20 vagas',
   'Instalações e manutenção elétrica em ambientes industriais com segurança e precisão.',
   'A indústria busca profissionais que combinam precisão, segurança e prática.',
   'Em destaque', '/imagens/cursos/curso-eletricista-industrial.jpg'),

  ('Eletricista Predial',
   (SELECT id FROM areas WHERE nome = 'Eletroeletrônica'),
   'Qualificação', 'Presencial', '160h', 'Noite', '20 vagas',
   'Instalações elétricas residenciais e prediais com foco em normas de segurança.',
   'Eletricista predial é uma das formações mais procuradas para quem quer começar rápido.',
   NULL, '/imagens/cursos/curso-eletricista-predial.jpg'),

  ('NR 10 — Segurança em Instalações Elétricas (20h)',
   (SELECT id FROM areas WHERE nome = 'Eletroeletrônica'),
   'Aperfeiçoamento', 'Presencial', '20h', 'Flexível', '20 vagas',
   'Curso básico de segurança em instalações e serviços com eletricidade, conforme a NR 10.',
   'Segurança em primeiro lugar: a NR 10 é obrigatória para quem trabalha com eletricidade.',
   NULL, '/imagens/cursos/curso-nr10-20h.png'),

  ('NR 10 — Segurança em Instalações Elétricas (40h)',
   (SELECT id FROM areas WHERE nome = 'Eletroeletrônica'),
   'Aperfeiçoamento', 'Presencial', '40h', 'Flexível', '20 vagas',
   'Versão estendida da NR 10, com carga horária ampliada para aprofundar a segurança elétrica.',
   'Uma carga horária maior para quem quer se aprofundar ainda mais em segurança elétrica.',
   NULL, '/imagens/cursos/curso-nr10-40h.png'),

  -- Metalmecânica
  ('Soldagem Elétrica',
   (SELECT id FROM areas WHERE nome = 'Metalmecânica'),
   'Qualificação', 'Presencial', '80h', 'Noite', '20 vagas',
   'Técnicas de soldagem elétrica com eletrodo revestido para uso industrial e estrutural.',
   'A soldagem é uma habilidade essencial para a cadeia metalmecânica.',
   'Em destaque', '/imagens/cursos/curso-soldagem.jpg'),

  ('Técnico em Eletromecânica',
   (SELECT id FROM areas WHERE nome = 'Metalmecânica'),
   'Técnico', 'Presencial', '1.240h', 'Noite', '20 vagas',
   'Une eletricidade e mecânica para uma atuação completa na manutenção industrial.',
   'Eletromecânica prepara você para resolver desafios reais da indústria.',
   'Alta demanda', '/imagens/cursos/curso-tecnico-eletromecanica.jpg'),

  ('Fresador Mecânico',
   (SELECT id FROM areas WHERE nome = 'Metalmecânica'),
   'Qualificação', 'Presencial', '200h', 'Noite', '20 vagas',
   'Operação de fresadoras para usinagem de peças mecânicas com precisão dimensional.',
   'Fresador mecânico é essencial na indústria de usinagem.',
   NULL, '/imagens/cursos/curso-fresador-mecanico.jpg'),

  ('Torneiro Mecânico',
   (SELECT id FROM areas WHERE nome = 'Metalmecânica'),
   'Qualificação', 'Presencial', '200h', 'Noite', '20 vagas',
   'Operação de torno mecânico para fabricação e reparo de peças industriais.',
   'Torneiro mecânico tem alta empregabilidade em toda a cadeia industrial.',
   NULL, '/imagens/cursos/curso-torneiro-mecanico.jpg'),

  -- Automação
  ('Técnico em Automação Industrial',
   (SELECT id FROM areas WHERE nome = 'Automação'),
   'Técnico', 'Presencial', '1.240h', 'Noite', '20 vagas',
   'Formação técnica em automação, CLP, robótica e sistemas industriais inteligentes.',
   'Automação é uma das chaves para transformar dados, máquinas e processos.',
   'Alta demanda', '/imagens/cursos/curso-tecnico-automacao.jpg'),

  ('Automação Residencial',
   (SELECT id FROM areas WHERE nome = 'Automação'),
   'Qualificação', 'Presencial', '80h', 'Noite', '20 vagas',
   'Instalação de sistemas inteligentes para casas conectadas, com foco em automação residencial.',
   'A automação também transforma o dia a dia das casas — não é só indústria.',
   NULL, '/imagens/cursos/curso-automacao-residencial.jpg'),

  -- Refrigeração
  ('Técnico em Refrigeração e Climatização',
   (SELECT id FROM areas WHERE nome = 'Refrigeração'),
   'Técnico', 'Presencial', '1.200h', 'Manhã ou noite', '20 vagas',
   'Instalação, manutenção e reparo de sistemas de refrigeração e ar-condicionado.',
   'Climatização reúne técnica, conforto e uma ampla atuação profissional.',
   'Em destaque', '/imagens/cursos/curso-tecnico-refrigeracao.jpg'),

  ('Mecânico de Climatização Residencial',
   (SELECT id FROM areas WHERE nome = 'Refrigeração'),
   'Qualificação', 'Presencial', '160h', 'Noite', '20 vagas',
   'Instalação e manutenção de aparelhos de ar-condicionado residencial.',
   'Um curso mais curto e direto pra já entrar no mercado de climatização.',
   NULL, '/imagens/cursos/curso-climatizacao-residencial.jpg'),

  -- Tecnologia da Informação
  ('Programador Front-End',
   (SELECT id FROM areas WHERE nome = 'Tecnologia da Informação'),
   'Qualificação', 'Presencial', '220h', 'Noite', '20 vagas',
   'Desenvolva interfaces web modernas com HTML, CSS, JavaScript e práticas atuais.',
   'Interfaces bem projetadas aproximam tecnologia, pessoas e oportunidades.',
   'Alta demanda', '/imagens/cursos/curso-programador-front-end.jpg'),

  ('Projeto de Edificação no AutoCAD',
   (SELECT id FROM areas WHERE nome = 'Tecnologia da Informação'),
   'Qualificação', 'Presencial', '80h', 'Noite', '20 vagas',
   'Elabore projetos arquitetônicos e de edificação com ferramentas profissionais.',
   'Projetos digitais criam caminhos concretos para inovar na construção civil.',
   NULL, '/imagens/cursos/curso-autocad.jpg'),

  ('Revit',
   (SELECT id FROM areas WHERE nome = 'Tecnologia da Informação'),
   'Qualificação', 'Presencial', '80h', 'Noite', '20 vagas',
   'Modelagem de informação da construção (BIM) para projetos arquitetônicos e de engenharia.',
   'BIM é o futuro dos projetos de construção — e o Revit é referência no mercado.',
   NULL, '/imagens/cursos/curso-revit.jpg'),

  ('Excel do Básico ao Avançado',
   (SELECT id FROM areas WHERE nome = 'Tecnologia da Informação'),
   'Aperfeiçoamento', 'Presencial', '40h', 'Flexível', '20 vagas',
   'Do básico às fórmulas avançadas, tabelas dinâmicas e automação de planilhas.',
   'Excel é uma das ferramentas mais pedidas em qualquer área profissional.',
   NULL, '/imagens/cursos/curso-excel.jpg'),

  ('Técnico em Informática para Internet',
   (SELECT id FROM areas WHERE nome = 'Tecnologia da Informação'),
   'Técnico', 'Presencial', '1.200h', 'Noite', '20 vagas',
   'Formação técnica voltada a redes, desenvolvimento web e infraestrutura de internet.',
   'Uma formação completa para quem quer atuar com tecnologia e internet.',
   'Alta demanda', '/imagens/cursos/curso-tecnico-informatica-internet.jpg');

-- ------------------------------------------------------------
-- Textos institucionais editáveis (usados na página Inicial)
-- ------------------------------------------------------------
INSERT INTO conteudo_site (chave, valor) VALUES
  ('homeEyebrow', 'SENAI Stênio Lopes · Campina Grande'),
  ('homeTitle', 'Aprenda hoje. Transforme seu amanhã.'),
  ('homeDescription', 'Encontre formações que aproximam você da indústria, da tecnologia e de novas possibilidades profissionais.'),
  ('contactTitle', 'Vamos encontrar juntos um caminho para o seu futuro.'),
  ('contactDescription', 'Fale com a nossa equipe para tirar dúvidas sobre cursos, modalidades e próximos passos.')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);

-- ------------------------------------------------------------
-- Observação sobre o administrador inicial:
-- o usuário admin não é inserido aqui em texto puro porque a
-- senha precisa ser gerada com hash bcrypt. Use o script
-- backend/scripts/criarAdmin.js para criar o primeiro administrador.
-- ------------------------------------------------------------
