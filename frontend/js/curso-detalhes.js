/* ============================================================
 * Plataforma SENAI Stênio Lopes — curso-detalhes.js
 * Busca o curso pelo id na URL (?id=) e preenche a página.
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

function preencherPagina(curso) {
  document.title = `${curso.titulo} | SENAI Stênio Lopes`;
  document.getElementById("curso-imagem").src = curso.imagemUrl;
  document.getElementById("curso-nivel").textContent = curso.nivel;
  document.getElementById("curso-modalidade").textContent = curso.modalidade;
  document.getElementById("curso-titulo").textContent = curso.titulo;
  document.getElementById("curso-descricao").textContent = curso.descricao;
  document.getElementById("curso-carga-horaria").textContent = curso.cargaHoraria;
  document.getElementById("curso-turno").textContent = curso.turno;
  document.getElementById("curso-vagas").textContent = curso.vagas;
  document.getElementById("curso-dica-mascote").textContent = curso.dicaMascote;
  document.getElementById("curso-link-completo").href = `curso-completo.html?id=${curso.id}`;
  document.getElementById("curso-conteudo").hidden = false;
  document.getElementById("botao-audio-curso").setAttribute(
    "data-ouvir-texto",
    `${curso.titulo}. Curso de nível ${curso.nivel}, modalidade ${curso.modalidade}, carga horária de ${curso.cargaHoraria}, no turno ${curso.turno}, com ${curso.vagas}. ${curso.descricao}. Dica do Stênio: ${curso.dicaMascote}`
  );
}

document.addEventListener("DOMContentLoaded", async () => {
  iniciarTema();
  iniciarModoDaltonico();
  iniciarBotoesDeAudio();
  const id = obterIdDaUrl();
  const curso = id ? await buscarCurso(id) : null;

  if (curso) {
    preencherPagina(curso);
  } else {
    document.getElementById("curso-nao-encontrado").hidden = false;
  }
});
