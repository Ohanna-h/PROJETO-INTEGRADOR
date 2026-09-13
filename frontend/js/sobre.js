/* ============================================================
 * Plataforma SENAI Stênio Lopes — sobre.js
 * Carrossel simples com as fotos da unidade.
 * ============================================================ */

const SLIDES_CAMPUS = [
  { imagem: "imagens/campus/campus-fachada.jpg", legenda: "Fachada — SENAI Stênio Lopes" },
  { imagem: "imagens/campus/campus-recepcao.jpg", legenda: "Recepção — SENAI Stênio Lopes" },
  { imagem: "imagens/campus/campus-lazer.jpg", legenda: "Área de convivência — SENAI Stênio Lopes" },
  { imagem: "imagens/campus/campus-cantina.jpg", legenda: "Cantina — SENAI Stênio Lopes" },
  { imagem: "imagens/campus/campus-vista-geral.jpg", legenda: "Vista do campus — SENAI Stênio Lopes" },
  { imagem: "imagens/campus/campus-rosielio-fachada.jpg", legenda: "Fachada — SENAI Rosiélio Porto" },
  { imagem: "imagens/campus/campus-rosielio-instalacoes.jpg", legenda: "Instalações — SENAI Rosiélio Porto" },
];

let slideAtivo = 0;

function dois(numero) {
  return String(numero).padStart(2, "0");
}

function renderizarCampus() {
  const slide = SLIDES_CAMPUS[slideAtivo];
  document.getElementById("imagem-campus-atual").src = slide.imagem;
  document.getElementById("imagem-campus-atual").alt = slide.legenda;
  document.getElementById("legenda-campus-atual").textContent = slide.legenda;
  document.getElementById("contador-campus").textContent = `${dois(slideAtivo + 1)} / ${dois(SLIDES_CAMPUS.length)}`;

  const container = document.getElementById("seletores-campus");
  container.innerHTML = "";
  SLIDES_CAMPUS.forEach((item, indice) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "slide-selector" + (indice === slideAtivo ? " active" : "");
    botao.setAttribute("aria-pressed", String(indice === slideAtivo));
    botao.innerHTML = `<span>${dois(indice + 1)}</span>${item.legenda.replace(/ — SENAI.*/, "")}`;
    botao.addEventListener("click", () => { slideAtivo = indice; renderizarCampus(); });
    container.appendChild(botao);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("botao-campus-anterior").addEventListener("click", () => {
    slideAtivo = (slideAtivo - 1 + SLIDES_CAMPUS.length) % SLIDES_CAMPUS.length;
    renderizarCampus();
  });
  document.getElementById("botao-campus-proximo").addEventListener("click", () => {
    slideAtivo = (slideAtivo + 1) % SLIDES_CAMPUS.length;
    renderizarCampus();
  });
  renderizarCampus();
});
