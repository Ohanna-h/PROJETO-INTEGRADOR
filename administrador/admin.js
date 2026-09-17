/* ============================================================
 * Plataforma SENAI Stênio Lopes — admin.js
 * Login do painel + CRUD de cursos + edição de textos institucionais.
 * ============================================================ */

const CHAVE_TOKEN = "senai_admin_token";
const CHAVE_ADMIN = "senai_admin_dados";

function obterToken() {
  return localStorage.getItem(CHAVE_TOKEN);
}

function salvarSessao(token, admin) {
  localStorage.setItem(CHAVE_TOKEN, token);
  localStorage.setItem(CHAVE_ADMIN, JSON.stringify(admin));
}

function limparSessao() {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_ADMIN);
}

async function requisicaoAutenticada(url, opcoes = {}) {
  const resposta = await fetch(url, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${obterToken()}`,
      ...(opcoes.headers || {}),
    },
  });
  if (resposta.status === 401) {
    limparSessao();
    mostrarTelaLogin();
    throw new Error("Sessão expirada. Faça login novamente.");
  }
  return resposta;
}

/* ---------------------- Alternância de telas ---------------------- */

function mostrarTelaLogin() {
  document.getElementById("tela-login").hidden = false;
  document.getElementById("tela-painel").hidden = true;
}

function mostrarTelaPainel(admin) {
  document.getElementById("tela-login").hidden = true;
  document.getElementById("tela-painel").hidden = false;
  document.getElementById("nome-admin-logado").textContent = admin.nome || admin.email || "admin";
  carregarCursos();
  carregarConteudo();
}

/* ---------------------- Login ---------------------- */

async function iniciarLogin() {
  document.getElementById("formulario-login").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const senha = document.getElementById("login-senha").value;
    const erroEl = document.getElementById("login-erro");
    erroEl.hidden = true;

    try {
      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.erro || "Não foi possível entrar.");

      salvarSessao(dados.token, dados.admin);
      mostrarTelaPainel(dados.admin);
    } catch (erro) {
      erroEl.textContent = erro.message;
      erroEl.hidden = false;
    }
  });

  document.getElementById("botao-sair").addEventListener("click", () => {
    limparSessao();
    mostrarTelaLogin();
  });
}

async function verificarSessaoExistente() {
  const token = obterToken();
  if (!token) return mostrarTelaLogin();

  try {
    const resposta = await requisicaoAutenticada("/api/auth/me");
    if (!resposta.ok) throw new Error("Sessão inválida");
    const dados = await resposta.json();
    mostrarTelaPainel(dados.admin);
  } catch {
    mostrarTelaLogin();
  }
}

/* ---------------------- Abas do painel ---------------------- */

function iniciarAbas() {
  document.querySelectorAll(".admin-panel-tabs [data-painel]").forEach((botao) => {
    botao.addEventListener("click", () => {
      document.querySelectorAll(".admin-panel-tabs button").forEach((b) => b.classList.remove("active"));
      botao.classList.add("active");
      document.getElementById("painel-cursos").hidden = botao.dataset.painel !== "cursos";
      document.getElementById("painel-conteudo").hidden = botao.dataset.painel !== "conteudo";
    });
  });
}

/* ---------------------- Barra de status da última atualização ---------------------- */

// Formata a data mais recente entre os cursos carregados. A coluna
// atualizado_em é mantida automaticamente pelo MySQL (ON UPDATE
// CURRENT_TIMESTAMP), então não precisamos calcular nada no backend —
// só pegar o valor mais recente entre os cursos já retornados.
function atualizarBarraStatus(cursos, dataManualDeFallback) {
  const el = document.getElementById("barra-status-cursos");
  if (!el) return;

  const datas = cursos
    .map((curso) => curso.atualizadoEm && new Date(curso.atualizadoEm))
    .filter(Boolean);
  if (dataManualDeFallback) datas.push(dataManualDeFallback);

  if (datas.length === 0) {
    el.textContent = "Nenhuma atualização registrada ainda.";
    return;
  }

  const maisRecente = new Date(Math.max(...datas.map((d) => d.getTime())));
  const formatada = maisRecente.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
  el.textContent = `Última atualização no catálogo: ${formatada}`;
}

/* ---------------------- Cursos: listar / criar / editar / remover / disponibilidade ---------------------- */

let cursoEmEdicaoId = null;
let ultimosCursosCarregados = [];

function mostrarFeedbackCurso(mensagem, tipo) {
  const el = document.getElementById("curso-feedback");
  el.textContent = mensagem;
  el.className = `admin-feedback ${tipo}`;
  el.hidden = false;
}

function preencherFormularioCurso(curso) {
  document.getElementById("curso-id").value = curso.id;
  document.getElementById("curso-form-titulo").value = curso.titulo;
  document.getElementById("curso-form-area").value = curso.area;
  document.getElementById("curso-form-nivel").value = curso.nivel;
  document.getElementById("curso-form-modalidade").value = curso.modalidade;
  document.getElementById("curso-form-carga").value = curso.cargaHoraria;
  document.getElementById("curso-form-turno").value = curso.turno;
  document.getElementById("curso-form-vagas").value = curso.vagas;
  document.getElementById("curso-form-destaque").value = curso.destaque || "";
  document.getElementById("curso-form-imagem").value = curso.imagemUrl;
  document.getElementById("curso-form-descricao").value = curso.descricao;
  document.getElementById("curso-form-dica").value = curso.dicaMascote;
  document.getElementById("curso-form-disponivel").checked = curso.disponivel !== false;
}

function limparFormularioCurso() {
  document.getElementById("formulario-curso").reset();
  document.getElementById("curso-id").value = "";
  document.getElementById("curso-form-disponivel").checked = true;
  cursoEmEdicaoId = null;
  document.getElementById("botao-cancelar-edicao").hidden = true;
  document.getElementById("botao-salvar-curso").innerHTML =
    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Adicionar curso';
}

async function alternarDisponibilidadeCurso(curso) {
  await requisicaoAutenticada(`/api/cursos/${curso.id}/disponibilidade`, {
    method: "PATCH",
    body: JSON.stringify({ disponivel: !curso.disponivel }),
  });
  carregarCursos();
}

function renderizarListaCursos(cursos) {
  document.getElementById("contador-cursos-admin").textContent =
    cursos.filter((c) => c.disponivel).length;
  document.getElementById("contador-lista-cursos").textContent = `${cursos.length} itens`;

  const lista = document.getElementById("lista-cursos");
  lista.innerHTML = "";
  for (const curso of cursos) {
    const item = document.createElement("article");
    item.className = "admin-course-row" + (curso.disponivel ? "" : " admin-course-row-indisponivel");
    item.innerHTML = `
      <img src="${curso.imagemUrl}" alt="" />
      <div>
        <strong>${curso.titulo}</strong>
        <span>${curso.area} · ${curso.nivel} · ${curso.modalidade}</span>
        <span class="admin-course-badge ${curso.disponivel ? "is-disponivel" : "is-indisponivel"}">
          ${curso.disponivel ? "Disponível" : "Indisponível"}
        </span>
      </div>
      <div class="admin-row-actions">
        <button type="button" data-acao="disponibilidade" aria-label="${curso.disponivel ? "Marcar como indisponível" : "Marcar como disponível"}">
          ${curso.disponivel
            ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
            : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>'}
        </button>
        <button type="button" data-acao="editar" aria-label="Editar ${curso.titulo}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" /></svg>
        </button>
        <button type="button" data-acao="remover" aria-label="Remover ${curso.titulo}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
        </button>
      </div>`;
    item.querySelector('[data-acao="disponibilidade"]').addEventListener("click", () => {
      alternarDisponibilidadeCurso(curso);
    });
    item.querySelector('[data-acao="editar"]').addEventListener("click", () => {
      preencherFormularioCurso(curso);
      cursoEmEdicaoId = curso.id;
      document.getElementById("botao-cancelar-edicao").hidden = false;
      document.getElementById("botao-salvar-curso").innerHTML =
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/></svg> Salvar alterações';
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    item.querySelector('[data-acao="remover"]').addEventListener("click", async () => {
      if (!window.confirm(`Remover ${curso.titulo}?`)) return;
      await requisicaoAutenticada(`/api/cursos/${curso.id}`, { method: "DELETE" });
      carregarCursos(new Date());
    });
    lista.appendChild(item);
  }
}

async function carregarCursos(dataManualDeFallback) {
  const resposta = await requisicaoAutenticada("/api/cursos/admin");
  const cursos = await resposta.json();
  ultimosCursosCarregados = cursos;
  renderizarListaCursos(cursos);
  atualizarBarraStatus(cursos, dataManualDeFallback);
}

function iniciarFormularioCurso() {
  document.getElementById("botao-cancelar-edicao").addEventListener("click", limparFormularioCurso);

  document.getElementById("formulario-curso").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const corpo = {
      titulo: document.getElementById("curso-form-titulo").value.trim(),
      area: document.getElementById("curso-form-area").value,
      nivel: document.getElementById("curso-form-nivel").value,
      modalidade: document.getElementById("curso-form-modalidade").value,
      cargaHoraria: document.getElementById("curso-form-carga").value.trim(),
      turno: document.getElementById("curso-form-turno").value.trim(),
      vagas: document.getElementById("curso-form-vagas").value.trim(),
      destaque: document.getElementById("curso-form-destaque").value.trim() || null,
      imagemUrl: document.getElementById("curso-form-imagem").value.trim(),
      descricao: document.getElementById("curso-form-descricao").value.trim(),
      dicaMascote: document.getElementById("curso-form-dica").value.trim(),
      disponivel: document.getElementById("curso-form-disponivel").checked,
    };

    try {
      const url = cursoEmEdicaoId ? `/api/cursos/${cursoEmEdicaoId}` : "/api/cursos";
      const metodo = cursoEmEdicaoId ? "PUT" : "POST";
      const resposta = await requisicaoAutenticada(url, { method: metodo, body: JSON.stringify(corpo) });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.erro || "Erro ao salvar o curso.");

      mostrarFeedbackCurso(cursoEmEdicaoId ? "Curso atualizado no catálogo." : "Curso adicionado ao catálogo.", "success");
      limparFormularioCurso();
      carregarCursos();
    } catch (erro) {
      mostrarFeedbackCurso(erro.message, "error");
    }
  });
}

/* ---------------------- Conteúdo institucional ---------------------- */

async function carregarConteudo() {
  const resposta = await fetch("/api/config");
  const conteudo = await resposta.json();
  document.getElementById("contador-textos-admin").textContent = Object.keys(conteudo).length;

  ["homeEyebrow", "homeTitle", "homeDescription"].forEach((chave) => {
    const campo = document.getElementById(`conteudo-${chave}`);
    if (campo && conteudo[chave]) campo.value = conteudo[chave];
  });
}

function mostrarFeedbackConteudo(mensagem, tipo) {
  const el = document.getElementById("conteudo-feedback");
  el.textContent = mensagem;
  el.className = `admin-feedback ${tipo}`;
  el.hidden = false;
}

function iniciarFormularioConteudo() {
  document.getElementById("formulario-conteudo").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const chaves = ["homeEyebrow", "homeTitle", "homeDescription"];
    try {
      for (const chave of chaves) {
        const valor = document.getElementById(`conteudo-${chave}`).value.trim();
        const resposta = await requisicaoAutenticada("/api/config", { method: "PUT", body: JSON.stringify({ chave, valor }) });
        if (!resposta.ok) throw new Error("Erro ao salvar o conteúdo.");
      }
      mostrarFeedbackConteudo("Conteúdo salvo com sucesso.", "success");
    } catch (erro) {
      mostrarFeedbackConteudo(erro.message, "error");
    }
  });
}

/* ---------------------- Inicialização ---------------------- */

document.addEventListener("DOMContentLoaded", () => {
  iniciarLogin();
  iniciarAbas();
  iniciarFormularioCurso();
  iniciarFormularioConteudo();
  verificarSessaoExistente();
});