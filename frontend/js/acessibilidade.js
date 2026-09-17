/* ============================================================
 * Plataforma SENAI Stênio Lopes — acessibilidade.js
 * Módulo compartilhado: tema claro/escuro e modo daltônico.
 * Usado por todas as páginas (index, sobre, curso-detalhes,
 * curso-completo) para evitar duplicar essa lógica em cada uma.
 *
 * Como usar em uma página:
 *   1. Inclua este script ANTES do script próprio da página.
 *   2. No DOMContentLoaded da página, chame iniciarTema() e
 *      iniciarModoDaltonico().
 *   3. A página precisa ter, no mínimo, um botão com o atributo
 *      data-alterna-tema (para o modo escuro) e/ou
 *      data-alterna-daltonico (para o modo daltônico). Pode haver
 *      mais de um botão com o mesmo atributo (ex: versão desktop
 *      e versão mobile) — todos são sincronizados juntos.
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