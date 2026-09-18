/* ============================================================
 * Plataforma SENAI Stênio Lopes — curso-completo.js
 * Página expandida do curso: foto grande, texto completo,
 * faixa salarial, áreas de atuação, vídeo e mascote dinâmico.
 * ============================================================ */

function obterIdDaUrl() {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get("id");
}

async function buscarCurso(id) {
  try {
    const resposta = await fetch(`${obterBaseApi()}/api/cursos`);
    if (!resposta.ok) throw new Error("Falha ao consultar a API");
    const cursos = await resposta.json();
    return cursos.find((curso) => String(curso.id) === String(id)) || null;
  } catch (erro) {
    console.warn("API indisponível, buscando no catálogo offline:", erro);
    const resposta = await fetch("js/cursos.json");
    const dados = await resposta.json();
    return dados.cursos.find((curso) => String(curso.id) === String(id)) || null;
  }
}

function preencherListaDeTags(elementoId, itens) {
  const container = document.getElementById(elementoId);
  container.innerHTML = "";
  const lista = Array.isArray(itens) ? itens : [];
  if (lista.length === 0) {
    container.innerHTML = '<span class="tag">Em atualização</span>';
    return;
  }
  for (const item of lista) {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = item;
    container.appendChild(tag);
  }
}

function preencherVideo(videoUrl) {
  const wrap = document.getElementById("curso-completo-video-wrap");
  wrap.innerHTML = "";
  if (!videoUrl) {
    wrap.innerHTML = '<div class="curso-completo-video-vazio">Vídeo deste curso ainda não disponível.</div>';
    return;
  }
  const video = document.createElement("video");
  video.src = videoUrl;
  video.controls = true;
  video.preload = "metadata";
  wrap.appendChild(video);
}

function falarSobreOCurso(curso) {
  const texto = document.getElementById("mensagem-mascote-texto");
  const mensagem = curso.mensagemMascoteCompleta || curso.dicaMascote ||
    `Você está vendo tudo sobre ${curso.titulo}. Qualquer dúvida, é só chamar!`;
  texto.textContent = mensagem;
  document.getElementById("botao-audio-mascote").setAttribute("data-ouvir-texto", mensagem);
}

function preencherPagina(curso) {
  document.title = `${curso.titulo} | SENAI Stênio Lopes`;
  document.getElementById("curso-completo-imagem").src = curso.imagemUrl;
  document.getElementById("curso-completo-imagem").alt = curso.titulo;
  document.getElementById("curso-completo-area").textContent = `${curso.area} · ${curso.nivel}`;
  document.getElementById("curso-completo-titulo").textContent = curso.titulo;
  document.getElementById("curso-completo-texto-detalhado").textContent =
    curso.textoCompleto || curso.descricao;
  document.getElementById("curso-completo-perfil").textContent =
    curso.perfilProfissional || "Em atualização junto ao setor pedagógico.";
  document.getElementById("curso-completo-salario").textContent =
    curso.faixaSalarial || "Em atualização junto ao setor pedagógico.";
  preencherListaDeTags("curso-completo-carreiras", curso.carreiras);
  preencherListaDeTags("curso-completo-areas", curso.areasAtuacao);
  preencherVideo(curso.videoUrl);
  falarSobreOCurso(curso);
  const carreirasTexto = Array.isArray(curso.carreiras) && curso.carreiras.length
    ? `Possibilidades de carreira: ${curso.carreiras.join(", ")}.`
    : "";
  const areasTexto = Array.isArray(curso.areasAtuacao) && curso.areasAtuacao.length
    ? `Áreas de atuação: ${curso.areasAtuacao.join(", ")}.`
    : "";
  document.getElementById("botao-audio-curso-completo").setAttribute(
    "data-ouvir-texto",
    `${curso.titulo}. ${curso.textoCompleto || curso.descricao}. Faixa salarial: ${curso.faixaSalarial || "em atualização"}. ${carreirasTexto} ${areasTexto} ${curso.perfilProfissional || ""}`
  );
}

/* ---------------------- Tema claro/escuro (mesma lógica das outras páginas) ---------------------- */



/* ---------------------- Mascote: abrir/fechar mensagem ---------------------- */

function iniciarMascote() {
  document.getElementById("botao-fechar-mascote").addEventListener("click", () => {
    document.getElementById("mensagem-mascote-caixa").hidden = true;
  });
  document.getElementById("botao-mascote").addEventListener("click", () => {
    const caixa = document.getElementById("mensagem-mascote-caixa");
    caixa.hidden = !caixa.hidden;
  });
}

/* ---------------------- VLibras ---------------------- */

function iniciarVLibras() {
  const raiz = document.getElementById("vlibras-root");
  const widget = document.createElement("div");
  widget.setAttribute("vw", "");
  widget.className = "enabled";
  widget.innerHTML = `
    <div vw-access-button class="active"></div>
    <div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>`;
  raiz.appendChild(widget);

  const script = document.createElement("script");
  script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
  script.async = true;
  script.onload = () => {
    if (window.VLibras) new window.VLibras.Widget("https://vlibras.gov.br/app");
  };
  document.body.appendChild(script);
}

/* ---------------------- Inicialização ---------------------- */

document.addEventListener("DOMContentLoaded", async () => {
  iniciarTema();
  iniciarModoDaltonico();
  iniciarBotoesDeAudio();
  iniciarMascote();
  iniciarVLibras();

  const id = obterIdDaUrl();
  const curso = id ? await buscarCurso(id) : null;

  if (curso) {
    preencherPagina(curso);
  } else {
    document.querySelector(".curso-completo-hero").innerHTML =
      '<div style="padding:60px 20px;text-align:center;"><h1>Curso não encontrado</h1><p>Volte ao catálogo e escolha um curso.</p></div>';
  }
});