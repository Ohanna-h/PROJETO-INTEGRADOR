-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 18/09/2026 às 04:45
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `plataforma_senai`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `administradores`
--

CREATE TABLE `administradores` (
  `id` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `email` varchar(320) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `papel` enum('admin','editor') NOT NULL DEFAULT 'admin',
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ultimo_acesso` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `administradores`
--

INSERT INTO `administradores` (`id`, `nome`, `email`, `senha_hash`, `papel`, `criado_em`, `atualizado_em`, `ultimo_acesso`) VALUES
(1, 'Hellen Ohanna', 'hellen.o.nascimento@aluno.senai.br', '$2a$10$99wLCUw/ScUyaPID0x5frenMdbmVu138xIRcs5aP4FKtFz5VIMsS6', 'admin', '2026-09-18 02:41:03', '2026-09-18 02:42:48', '2026-09-18 02:42:48');

-- --------------------------------------------------------

--
-- Estrutura para tabela `areas`
--

CREATE TABLE `areas` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `icone_url` varchar(255) DEFAULT NULL,
  `ordem` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `areas`
--

INSERT INTO `areas` (`id`, `nome`, `icone_url`, `ordem`) VALUES
(1, 'Eletroeletrônica', 'imagens/icones/icone-eletro.png', 1),
(2, 'Metalmecânica', 'imagens/icones/icone-metal.png', 2),
(3, 'Tecnologia da Informação', 'imagens/icones/icone-ti.png', 3),
(4, 'Refrigeração', 'imagens/icones/icone-refrigeracao.png', 4),
(5, 'Automação', 'imagens/icones/icone-automacao.png', 5),
(6, 'Vestuário e Couro', 'imagens/icones/icone-vestuario.png', 6),
(7, 'Alimentos', 'imagens/icones/icone-alimentos.png', 7);

-- --------------------------------------------------------

--
-- Estrutura para tabela `conteudo_site`
--

CREATE TABLE `conteudo_site` (
  `id` int(11) NOT NULL,
  `chave` varchar(100) NOT NULL,
  `valor` text NOT NULL,
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `conteudo_site`
--

INSERT INTO `conteudo_site` (`id`, `chave`, `valor`, `atualizado_em`) VALUES
(1, 'homeEyebrow', 'SENAI Stênio Lopes · Campina Grande', '2026-09-18 02:39:15'),
(2, 'homeTitle', 'Aprenda hoje. Transforme seu amanhã.', '2026-09-18 02:39:15'),
(3, 'homeDescription', 'Encontre formações que aproximam você da indústria, da tecnologia e de novas possibilidades profissionais.', '2026-09-18 02:39:15'),
(4, 'contactTitle', 'Vamos encontrar juntos um caminho para o seu futuro.', '2026-09-18 02:39:15'),
(5, 'contactDescription', 'Fale com a nossa equipe para tirar dúvidas sobre cursos, modalidades e próximos passos.', '2026-09-18 02:39:15');

-- --------------------------------------------------------

--
-- Estrutura para tabela `cursos`
--

CREATE TABLE `cursos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(180) NOT NULL,
  `area_id` int(11) NOT NULL,
  `nivel` enum('Técnico','Qualificação','Aperfeiçoamento') NOT NULL,
  `modalidade` enum('Presencial','EAD') NOT NULL,
  `carga_horaria` varchar(60) NOT NULL,
  `turno` varchar(100) NOT NULL,
  `vagas` varchar(60) NOT NULL,
  `descricao` text NOT NULL,
  `texto_completo` text DEFAULT NULL,
  `faixa_salarial` varchar(255) DEFAULT NULL,
  `areas_atuacao` text DEFAULT NULL,
  `possibilidades_carreira` text DEFAULT NULL,
  `perfil_profissional` text DEFAULT NULL,
  `dica_mascote` text NOT NULL,
  `destaque` varchar(80) DEFAULT NULL,
  `imagem_url` varchar(255) NOT NULL,
  `disponivel` tinyint(1) NOT NULL DEFAULT 1,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `cursos`
--

INSERT INTO `cursos` (`id`, `titulo`, `area_id`, `nivel`, `modalidade`, `carga_horaria`, `turno`, `vagas`, `descricao`, `texto_completo`, `faixa_salarial`, `areas_atuacao`, `possibilidades_carreira`, `perfil_profissional`, `dica_mascote`, `destaque`, `imagem_url`, `disponivel`, `criado_em`, `atualizado_em`) VALUES
(1, 'Técnico em Eletroeletrônica', 1, 'Técnico', 'Presencial', '1.200h', 'Noite', '20 vagas', 'Formação técnica completa em sistemas eletroeletrônicos, automação e instalações elétricas.', 'O curso de Eletroeletrônica prepara o estudante para planejar, instalar, testar, inspecionar e realizar a manutenção de equipamentos e instalações eletroeletrônicas industriais. A formação abrange acionamentos, controles eletroeletrônicos, sistemas automáticos, medições, calibrações, eficiência energética, fontes de energia alternativas e tecnologias digitais aplicadas à indústria.', 'R$ 1.812 a R$ 5.282 por mês (média R$ 3.094) — fonte: Indeed, 15/08/2026', 'Instalação e manutenção de equipamentos eletroeletrônicos, Fabricantes de máquinas e componentes, Laboratórios de controle de qualidade e calibração, Assistência técnica, Integração de sistemas, Energia solar e automação predial/residencial', 'Eletricista Industrial, Instalador de Sistemas Eletroeletrônicos Industriais, Mantenedor de Sistemas Eletroeletrônicos Industriais, Projetista de Instalações Elétricas Prediais ou Industriais, Montador de Equipamentos Eletroeletrônicos, Instalador de Sistemas Fotovoltaicos', 'Formação indicada para quem gosta de eletricidade, eletrônica, montagem, manutenção e investigação de falhas. Exige atenção a detalhes, disciplina com normas de segurança, capacidade de interpretar diagramas e instrumentos de medição, raciocínio lógico e habilidade manual.', 'Eletroeletrônica conecta você aos principais setores da indústria.', 'Alta demanda', 'imagens/cursos/curso-tecnico-eletroeletronica.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(2, 'Eletricista Industrial', 1, 'Qualificação', 'Presencial', '160h', 'Noite', '20 vagas', 'Instalações e manutenção elétrica em ambientes industriais com segurança e precisão.', NULL, NULL, NULL, NULL, NULL, 'A indústria busca profissionais que combinam precisão, segurança e prática.', 'Em destaque', 'imagens/cursos/curso-eletricista-industrial.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(3, 'Eletricista Predial', 1, 'Qualificação', 'Presencial', '160h', 'Noite', '20 vagas', 'Instalações elétricas residenciais e prediais com foco em normas de segurança.', NULL, NULL, NULL, NULL, NULL, 'Eletricista predial é uma das formações mais procuradas para quem quer começar rápido.', NULL, 'imagens/cursos/curso-eletricista-predial.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(4, 'NR 10 — Segurança em Instalações Elétricas (20h)', 1, 'Aperfeiçoamento', 'Presencial', '20h', 'Flexível', '20 vagas', 'Curso básico de segurança em instalações e serviços com eletricidade, conforme a NR 10.', NULL, NULL, NULL, NULL, NULL, 'Segurança em primeiro lugar: a NR 10 é obrigatória para quem trabalha com eletricidade.', NULL, 'imagens/cursos/curso-nr10-20h.png', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(5, 'NR 10 — Segurança em Instalações Elétricas (40h)', 1, 'Aperfeiçoamento', 'Presencial', '40h', 'Flexível', '20 vagas', 'Versão estendida da NR 10, com carga horária ampliada para aprofundar a segurança elétrica.', NULL, NULL, NULL, NULL, NULL, 'Uma carga horária maior para quem quer se aprofundar ainda mais em segurança elétrica.', NULL, 'imagens/cursos/curso-nr10-40h.png', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(6, 'NR 10 — Segurança em Instalações Elétricas (Renovação)', 1, 'Aperfeiçoamento', 'Presencial', '20h', 'Flexível', '20 vagas', 'Reciclagem da NR10 para manutenção da certificação em segurança elétrica.', NULL, NULL, NULL, NULL, NULL, 'Mantenha sua certificação de segurança elétrica sempre em dia.', NULL, 'imagens/cursos/curso-nr10-20h.png', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(7, 'Instalador e Mantenedor de Sistemas Eletrônicos de Segurança', 1, 'Qualificação', 'Presencial', '160h', 'Tarde', 'A definir', 'Instalação e manutenção de câmeras, alarmes e sistemas eletrônicos de segurança.', NULL, NULL, NULL, NULL, NULL, 'Segurança eletrônica é uma área que só cresce, dentro e fora da indústria.', NULL, 'imagens/cursos/curso-placeholder.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(8, 'Cerca Elétrica + Motor de Portão', 1, 'Aperfeiçoamento', 'Presencial', '40h', 'Noite', 'A definir', 'Instalação e manutenção de cercas elétricas e motores de portão residenciais.', NULL, NULL, NULL, NULL, NULL, 'Um curso rápido, direto, e com aplicação imediata em residências.', NULL, 'imagens/cursos/curso-placeholder.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(9, 'Soldagem Elétrica', 2, 'Qualificação', 'Presencial', '80h', 'Noite', '20 vagas', 'Técnicas de soldagem elétrica com eletrodo revestido para uso industrial e estrutural.', NULL, NULL, NULL, NULL, NULL, 'A soldagem é uma habilidade essencial para a cadeia metalmecânica.', 'Em destaque', 'imagens/cursos/curso-soldagem.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(10, 'Técnico em Eletromecânica', 2, 'Técnico', 'Presencial', '1.240h', 'Noite', '20 vagas', 'Une eletricidade e mecânica para uma atuação completa na manutenção industrial.', NULL, NULL, NULL, NULL, NULL, 'Eletromecânica prepara você para resolver desafios reais da indústria.', 'Alta demanda', 'imagens/cursos/curso-tecnico-eletromecanica.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(11, 'Fresador Mecânico', 2, 'Qualificação', 'Presencial', '200h', 'Noite', '20 vagas', 'Operação de fresadoras para usinagem de peças mecânicas com precisão dimensional.', NULL, NULL, NULL, NULL, NULL, 'Fresador mecânico é essencial na indústria de usinagem.', NULL, 'imagens/cursos/curso-fresador-mecanico.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(12, 'Torneiro Mecânico', 2, 'Qualificação', 'Presencial', '200h', 'Noite', '20 vagas', 'Operação de torno mecânico para fabricação e reparo de peças industriais.', NULL, NULL, NULL, NULL, NULL, 'Torneiro mecânico tem alta empregabilidade em toda a cadeia industrial.', NULL, 'imagens/cursos/curso-torneiro-mecanico.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(13, 'Mecânico de Instalações Industriais', 2, 'Qualificação', 'Presencial', '220h', 'Tarde', 'A definir', 'Montagem, ajuste e manutenção de instalações e equipamentos industriais.', NULL, NULL, NULL, NULL, NULL, 'Instalações bem montadas são a base de qualquer linha de produção segura.', NULL, 'imagens/cursos/curso-placeholder.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(14, 'Técnico em Automação Industrial', 5, 'Técnico', 'Presencial', '1.240h', 'Noite', '20 vagas', 'Formação técnica em automação, CLP, robótica e sistemas industriais inteligentes.', 'O curso de Automação Industrial prepara o estudante para desenvolver, instalar, configurar, testar, calibrar e manter sistemas automatizados utilizados no controle de processos industriais. A formação integra eletricidade, eletrônica, instrumentação, programação, redes industriais, sistemas supervisórios, robótica, sistemas ciberfísicos e Internet das Coisas (IoT).', 'R$ 2.140 a R$ 7.012 por mês (média R$ 3.874) — fonte: Indeed, 16/08/2026', 'Linhas de produção automatizadas, Manutenção industrial, Integradoras de sistemas de automação, Fabricantes de máquinas e equipamentos robotizados, Setores químico, petroquímico, automobilístico e metal mecânico', 'Instrumentista Industrial, Montador de Equipamentos Eletroeletrônicos, Operador em Linha de Montagem de Equipamentos Eletroeletrônicos, Reparador de Circuitos Eletrônicos', 'Indicado para quem tem interesse por tecnologia, lógica, programação, máquinas e resolução de problemas, combinando raciocínio analítico com capacidade prática de medir, testar, calibrar e interpretar falhas.', 'Automação é uma das chaves para transformar dados, máquinas e processos.', 'Alta demanda', 'imagens/cursos/curso-tecnico-automacao.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(15, 'Automação Residencial', 5, 'Qualificação', 'Presencial', '80h', 'Noite', '20 vagas', 'Instalação de sistemas inteligentes para casas conectadas, com foco em automação residencial.', NULL, NULL, NULL, NULL, NULL, 'A automação também transforma o dia a dia das casas — não é só indústria.', NULL, 'imagens/cursos/curso-automacao-residencial.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(16, 'Técnico em Refrigeração e Climatização', 4, 'Técnico', 'Presencial', '1.200h', 'Manhã ou noite', '20 vagas', 'Instalação, manutenção e reparo de sistemas de refrigeração e ar-condicionado.', 'O curso de Refrigeração e Climatização prepara o estudante para planejar, instalar, testar, manter e reparar equipamentos e sistemas de refrigeração e climatização em ambientes residenciais, comerciais e industriais, aplicando normas técnicas e ambientais e buscando eficiência energética.', 'R$ 1.621 a R$ 5.419 por mês (média R$ 2.813) — fonte: Indeed, 16/08/2026', 'Oficinas de refrigeração residencial, Empresas de comercialização, instalação e assistência técnica, Empresas de projetos e manutenção, Indústrias que utilizam sistemas de refrigeração, Construção civil, transporte frigorificado, indústria têxtil e farmacêutica', 'Instalador de Refrigeração e Climatização Doméstica, Mecânico de Refrigeração e Climatização Industrial, Mecânico em Refrigeração Comercial, Mecânico de Manutenção de Sistemas de Refrigeração e Climatização', 'Indicado para quem gosta de atividades práticas, diagnóstico de falhas e resolução de problemas, com atenção à segurança, eletricidade, termodinâmica e manuseio responsável de gases refrigerantes.', 'Climatização reúne técnica, conforto e uma ampla atuação profissional.', 'Em destaque', 'imagens/cursos/curso-tecnico-refrigeracao.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(17, 'Mecânico de Climatização Residencial', 4, 'Qualificação', 'Presencial', '160h', 'Noite', '20 vagas', 'Instalação e manutenção de aparelhos de ar-condicionado residencial.', NULL, NULL, NULL, NULL, NULL, 'Um curso mais curto e direto pra já entrar no mercado de climatização.', NULL, 'imagens/cursos/curso-climatizacao-residencial.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(18, 'Trilha de Mecânico de Climatização Residencial', 4, 'Aperfeiçoamento', 'Presencial', '240h', 'Noite', 'A definir', 'Trilha que reúne Técnicas de Refrigeração Residencial (80h) e Mecânico de Climatização Residencial (160h).', NULL, NULL, NULL, NULL, NULL, 'Uma trilha completa: do básico da refrigeração até a climatização residencial.', NULL, 'imagens/cursos/curso-placeholder.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(19, 'Programador Front-End', 3, 'Qualificação', 'Presencial', '220h', 'Noite', '20 vagas', 'Desenvolva interfaces web modernas com HTML, CSS, JavaScript e práticas atuais.', NULL, NULL, NULL, NULL, NULL, 'Interfaces bem projetadas aproximam tecnologia, pessoas e oportunidades.', 'Alta demanda', 'imagens/cursos/curso-programador-front-end.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(20, 'Projeto de Edificação no AutoCAD', 3, 'Qualificação', 'Presencial', '80h', 'Noite', '20 vagas', 'Elabore projetos arquitetônicos e de edificação com ferramentas profissionais.', NULL, NULL, NULL, NULL, NULL, 'Projetos digitais criam caminhos concretos para inovar na construção civil.', NULL, 'imagens/cursos/curso-autocad.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(21, 'Revit', 3, 'Qualificação', 'Presencial', '80h', 'Noite', '20 vagas', 'Modelagem de informação da construção (BIM) para projetos arquitetônicos e de engenharia.', NULL, NULL, NULL, NULL, NULL, 'BIM é o futuro dos projetos de construção — e o Revit é referência no mercado.', NULL, 'imagens/cursos/curso-revit.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(22, 'Excel do Básico ao Avançado', 3, 'Aperfeiçoamento', 'Presencial', '40h', 'Flexível', '20 vagas', 'Do básico às fórmulas avançadas, tabelas dinâmicas e automação de planilhas.', NULL, NULL, NULL, NULL, NULL, 'Excel é uma das ferramentas mais pedidas em qualquer área profissional.', NULL, 'imagens/cursos/curso-excel.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(23, 'Técnico em Informática para Internet', 3, 'Técnico', 'Presencial', '1.200h', 'Noite', '20 vagas', 'Formação técnica voltada a redes, desenvolvimento web e infraestrutura de internet.', NULL, NULL, NULL, NULL, NULL, 'Uma formação completa para quem quer atuar com tecnologia e internet.', 'Alta demanda', 'imagens/cursos/curso-tecnico-informatica-internet.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(24, 'Programador de Sistemas de Computador', 3, 'Qualificação', 'Presencial', '200h', 'Manhã', 'A definir', 'Desenvolvimento de programas e sistemas para computador, do básico à lógica aplicada.', NULL, NULL, NULL, NULL, NULL, 'A lógica de programação abre portas em praticamente qualquer área da tecnologia.', NULL, 'imagens/cursos/curso-placeholder.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(25, 'Operador de Computador', 3, 'Qualificação', 'Presencial', '160h', 'Manhã ou noite', 'A definir', 'Uso de computadores, pacote office e ferramentas básicas de informática no dia a dia.', NULL, NULL, NULL, NULL, NULL, 'Domine as ferramentas de informática que o mercado pede todos os dias.', NULL, 'imagens/cursos/curso-placeholder.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(26, 'Editor de Vídeos', 3, 'Qualificação', 'Presencial', '160h', 'Tarde', 'A definir', 'Edição e finalização de vídeos para redes sociais e produções audiovisuais.', NULL, NULL, NULL, NULL, NULL, 'Contar histórias em vídeo é uma habilidade cada vez mais valorizada.', NULL, 'imagens/cursos/curso-placeholder.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(27, 'Designer Gráfico Editorial', 3, 'Qualificação', 'Presencial', '160h', 'Noite', 'A definir', 'Criação de peças gráficas e projetos editoriais com ferramentas de design.', NULL, NULL, NULL, NULL, NULL, 'Transforme ideias em peças gráficas que realmente comunicam.', NULL, 'imagens/cursos/curso-placeholder.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(28, 'Confeccionador de Artefatos de Couro', 6, 'Qualificação', 'Presencial', '200h', 'Tarde ou noite', 'A definir', 'Confecção de bolsas, cintos e demais artefatos em couro com técnicas de acabamento.', NULL, NULL, NULL, NULL, NULL, 'Cada peça em couro carrega técnica, cuidado e um toque artesanal único.', NULL, 'imagens/cursos/curso-placeholder.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(29, 'Modelista do Vestuário', 6, 'Qualificação', 'Presencial', '180h', 'Noite', 'A definir', 'Criação e modelagem de peças do vestuário, do risco ao molde final.', NULL, NULL, NULL, NULL, NULL, 'Do risco ao molde final: aprenda a dar forma a uma peça de roupa.', NULL, 'imagens/cursos/curso-placeholder.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(30, 'Pão Francês e Correlatos', 7, 'Qualificação', 'Presencial', '20h', 'Noite', 'A definir', 'Produção de pão francês e itens de panificação correlatos.', NULL, NULL, NULL, NULL, NULL, 'O cheirinho de pão quente sempre abre portas — literalmente.', NULL, 'imagens/cursos/curso-placeholder.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(31, 'Bolos Artísticos', 7, 'Qualificação', 'Presencial', '40h', 'Noite', 'A definir', 'Técnicas de decoração e confecção de bolos artísticos.', NULL, NULL, NULL, NULL, NULL, 'Doçura e técnica se encontram na decoração de bolos artísticos.', NULL, 'imagens/cursos/curso-placeholder.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15'),
(32, 'Confeiteiro', 7, 'Qualificação', 'Presencial', '160h', 'Noite', 'A definir', 'Técnicas de confeitaria para doces, sobremesas e finalizações.', NULL, NULL, NULL, NULL, NULL, 'Técnicas de confeitaria pra transformar ingredientes em experiências.', NULL, 'imagens/cursos/curso-placeholder.jpg', 1, '2026-09-18 02:39:15', '2026-09-18 02:39:15');

-- --------------------------------------------------------

--
-- Estrutura para tabela `log_auditoria`
--

CREATE TABLE `log_auditoria` (
  `id` int(11) NOT NULL,
  `acao` varchar(80) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `admin_email` varchar(320) DEFAULT NULL,
  `detalhes` varchar(255) DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `newsletter_inscritos`
--

CREATE TABLE `newsletter_inscritos` (
  `id` int(11) NOT NULL,
  `email` varchar(320) NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `administradores`
--
ALTER TABLE `administradores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices de tabela `conteudo_site`
--
ALTER TABLE `conteudo_site`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `chave` (`chave`);

--
-- Índices de tabela `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_cursos_area` (`area_id`),
  ADD KEY `idx_cursos_nivel` (`nivel`),
  ADD KEY `idx_cursos_disponivel` (`disponivel`);

--
-- Índices de tabela `log_auditoria`
--
ALTER TABLE `log_auditoria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_log_admin` (`admin_id`);

--
-- Índices de tabela `newsletter_inscritos`
--
ALTER TABLE `newsletter_inscritos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `administradores`
--
ALTER TABLE `administradores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `areas`
--
ALTER TABLE `areas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `conteudo_site`
--
ALTER TABLE `conteudo_site`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de tabela `log_auditoria`
--
ALTER TABLE `log_auditoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `newsletter_inscritos`
--
ALTER TABLE `newsletter_inscritos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `cursos`
--
ALTER TABLE `cursos`
  ADD CONSTRAINT `fk_cursos_area` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `log_auditoria`
--
ALTER TABLE `log_auditoria`
  ADD CONSTRAINT `fk_log_admin` FOREIGN KEY (`admin_id`) REFERENCES `administradores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
