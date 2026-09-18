/* ============================================================
 * Plataforma SENAI Stênio Lopes — acessibilidade.js
 * Módulo compartilhado: tema claro/escuro, modo daltônico,
 * descrição por áudio, e detecção da URL base da API.
 * Usado por todas as páginas (index, sobre, curso-detalhes,
 * curso-completo) para evitar duplicar essa lógica em cada uma.
 * ============================================================ */

const CHAVE_TEMA = "theme";
const CHAVE_DALTONICO = "colorblind-mode";

/* ---------------------- Tema claro/escuro ---------------------- */

function aplicarTema(tema) {
  document.documentElement.classList.toggle("dark", tema === "dark");
  localStorage.setItem(CHAVE_TEMA, tema);

  document.querySelectorAll("[data-alterna-tema]").forEach((botao) => {
    const span = botao.querySelector("span");
    if (span) {
      span.textContent = tema === "light" ? "Escuro" : "Claro";
    } else {
      botao.textContent = `Usar modo ${tema === "light" ? "escuro" : "claro"}`;
    }
  });
}

function iniciarTema() {
  const temaSalvo = localStorage.getItem(CHAVE_TEMA) || "light";
  aplicarTema(temaSalvo);

  document.querySelectorAll("[data-alterna-tema]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const atual = document.documentElement.classList.contains("dark") ? "dark" : "light";
      aplicarTema(atual === "light" ? "dark" : "light");
    });
  });
}

/* ---------------------- Modo daltônico ---------------------- */

function aplicarModoDaltonico(ativo) {
  document.documentElement.classList.toggle("colorblind", ativo);
  localStorage.setItem(CHAVE_DALTONICO, ativo ? "1" : "0");

  document.querySelectorAll("[data-alterna-daltonico]").forEach((botao) => {
    botao.setAttribute("aria-pressed", String(ativo));
    botao.classList.toggle("is-active", ativo);
  });

  // Indicador flutuante — confirma visualmente que o modo está
  // ativo, sem depender de nenhuma cor específica pra ser notado.
  let indicador = document.getElementById("indicador-modo-daltonico");
  if (ativo) {
    if (!indicador) {
      indicador = document.createElement("div");
      indicador.id = "indicador-modo-daltonico";
      indicador.className = "colorblind-indicator";
      indicador.innerHTML =
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg> Modo daltônico ativado';
      document.body.appendChild(indicador);
    }
  } else if (indicador) {
    indicador.remove();
  }
}

function iniciarModoDaltonico() {
  const salvo = localStorage.getItem(CHAVE_DALTONICO) === "1";
  aplicarModoDaltonico(salvo);

  document.querySelectorAll("[data-alterna-daltonico]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const ativo = document.documentElement.classList.contains("colorblind");
      aplicarModoDaltonico(!ativo);
    });
  });
}

/* ---------------------- URL base da API ---------------------- */
/* Quando o site roda localmente pelo próprio Express (backend
   servindo o frontend), a API já está no mesmo endereço, então
   caminhos relativos como fetch("/api/cursos") funcionam sozinhos.
   Quando o site roda no GitHub Pages (site estático, sem backend
   junto), precisamos apontar explicitamente para o backend
   hospedado no Render. */

const API_BASE_RENDER = "https://projeto-senai-back-end.onrender.com";

function obterBaseApi() {
  const estaNoGithubPages = window.location.hostname.includes("github.io");
  return estaNoGithubPages ? API_BASE_RENDER : "";
}

/* ---------------------- Descrição por áudio ---------------------- */
/* Usa a Web Speech API do próprio navegador (funciona offline, sem
   nenhum serviço externo). Qualquer botão com o atributo
   data-ouvir-texto="..." vira um botão de leitura em voz alta — não
   precisa registrar evento nenhum manualmente, o listener é único
   (por delegação) e funciona até em botões criados depois, como os
   cards de curso montados dinamicamente pelo script.js. */

let botaoFalandoAtual = null;

function pararFala() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  if (botaoFalandoAtual) {
    botaoFalandoAtual.classList.remove("is-falando");
    botaoFalandoAtual.setAttribute("aria-label", botaoFalandoAtual.dataset.rotuloParado || "Ouvir descrição");
  }
  botaoFalandoAtual = null;
}

function falarTexto(texto, botao) {
  if (!("speechSynthesis" in window) || !texto) return;
  window.speechSynthesis.cancel();

  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = "pt-BR";
  fala.rate = 0.98;
  fala.onend = () => {
    if (botao) {
      botao.classList.remove("is-falando");
      botao.setAttribute("aria-label", botao.dataset.rotuloParado || "Ouvir descrição");
    }
    botaoFalandoAtual = null;
  };

  window.speechSynthesis.speak(fala);
  if (botao) {
    if (!botao.dataset.rotuloParado) botao.dataset.rotuloParado = botao.getAttribute("aria-label") || "Ouvir descrição";
    botao.classList.add("is-falando");
    botao.setAttribute("aria-label", "Parar leitura");
  }
  botaoFalandoAtual = botao;
}

function iniciarBotoesDeAudio() {
  if (!("speechSynthesis" in window)) return;

  document.addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-ouvir-texto]");
    if (!botao) return;

    if (botao === botaoFalandoAtual) {
      pararFala();
      return;
    }
    falarTexto(botao.getAttribute("data-ouvir-texto"), botao);
  });
}