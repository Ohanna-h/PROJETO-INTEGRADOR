/* ============================================================
 * Plataforma SENAI Stênio Lopes — script.js
 * Lógica da página Inicial: cabeçalho, mascote Stênio, boas-vindas
 * da recepção, catálogo de cursos (filtros + busca) e acessibilidade.
 * ============================================================ */

const NIVEIS = ["Todos", "Técnico", "Qualificação", "Aperfeiçoamento"];
const AREA_TODOS = { nome: "Todos", icone_url: "imagens/icones/icone-todos.png" };

const estado = {
  cursos: [],
  areas: [AREA_TODOS],
  areaAtiva: "Todos",
  nivelAtivo: "Todos",
  busca: "",
  catalogoPronto: false,
};

/* ---------------------- Utilitários ---------------------- */

function normalizarBusca(valor) {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function filtrarCursos() {
  const busca = normalizarBusca(estado.busca);
  return estado.cursos.filter((curso) => {
    const combinaArea = estado.areaAtiva === "Todos" || curso.area === estado.areaAtiva;
    const combinaNivel = estado.nivelAtivo === "Todos" || curso.nivel === estado.nivelAtivo;
    const pesquisavel = normalizarBusca(
      [curso.titulo, curso.area, curso.nivel, curso.modalidade, curso.descricao].join(" ")
    );
    const combinaBusca = !busca || pesquisavel.includes(busca);
    return combinaArea && combinaNivel && combinaBusca;
  });
}

/* ---------------------- Carregamento de dados ---------------------- */

async function carregarDados() {
  try {
    const [respCursos, respAreas, respConfig] = await Promise.all([
      fetch("/api/cursos"),
      fetch("/api/areas"),
      fetch("/api/config"),
    ]);
    if (!respCursos.ok || !respAreas.ok) throw new Error("Falha ao consultar a API");

    estado.cursos = await respCursos.json();
    estado.areas = [AREA_TODOS, ...(await respAreas.json())];

    if (respConfig.ok) aplicarTextosInstitucionais(await respConfig.json());
  } catch (erro) {
    console.warn("API indisponível, usando catálogo local (modo offline):", erro);
    await carregarCatalogoOffline();
  }
}

// Modo offline: usa uma cópia local do catálogo (cursos.json) quando a
// API não responde — importante porque a plataforma roda num totem
// com internet instável.
async function carregarCatalogoOffline() {
  try {
    const resposta = await fetch("js/cursos.json");
    const dados = await resposta.json();
    estado.cursos = dados.cursos;
    estado.areas = [AREA_TODOS, ...dados.areas];
  } catch (erro) {
    console.error("Não foi possível carregar o catálogo offline:", erro);
    estado.cursos = [];
  }
}

function aplicarTextosInstitucionais(textos) {
  const mapa = {
    "texto-hero-eyebrow": textos.homeEyebrow,
    "texto-hero-titulo": textos.homeTitle,
    "texto-hero-descricao": textos.homeDescription,
    "texto-contato-titulo": textos.contactTitle,
    "texto-contato-descricao": textos.contactDescription,
  };
  for (const [id, valor] of Object.entries(mapa)) {
    if (!valor) continue;
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = valor;
  }
}

/* ---------------------- Renderização do catálogo ---------------------- */

function renderizarFiltroAreas() {
  const container = document.getElementById("filtro-areas");
  container.innerHTML = "";
  for (const area of estado.areas) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "area-filter-button" + (estado.areaAtiva === area.nome ? " active" : "");
    botao.setAttribute("aria-pressed", String(estado.areaAtiva === area.nome));
    botao.innerHTML = `<img src="${area.icone_url}" alt="" /><span>${area.nome}</span>`;
    botao.addEventListener("click", () => guiarPorArea(area.nome));
    container.appendChild(botao);
  }
}

function renderizarFiltroNiveis() {
  const container = document.getElementById("filtro-niveis");
  container.innerHTML = "";
  for (const nivel of NIVEIS) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "filter-chip" + (estado.nivelAtivo === nivel ? " active" : "");
    botao.setAttribute("aria-pressed", String(estado.nivelAtivo === nivel));
    botao.textContent = nivel;
    botao.addEventListener("click", () => guiarPorNivel(nivel));
    container.appendChild(botao);
  }
}

function criarCardCurso(curso) {
  const artigo = document.createElement("article");
  artigo.className = "course-card";
  artigo.innerHTML = `
    <button class="course-card-open" type="button" aria-label="Ver detalhes do curso ${curso.titulo}">
      <div class="course-media">
        <img src="${curso.imagemUrl}" alt="" loading="lazy" />
        <span class="course-area-label">${curso.area}</span>
        ${curso.destaque ? `<span class="course-highlight">${curso.destaque}</span>` : ""}
      </div>
      <div class="course-body">
        <div class="course-metadata"><span>${curso.nivel}</span><span>${curso.modalidade}</span></div>
        <h3>${curso.titulo}</h3>
        <p>${curso.descricao}</p>
        <div class="course-stats">
          <span>${iconeRelogio()} ${curso.cargaHoraria}</span>
          <span>${iconePessoas()} ${curso.vagas}</span>
        </div>
      </div>
      <div class="course-footer">
        <span>Ver detalhes</span>
        ${iconeSeta()}
      </div>
    </button>`;
  artigo.querySelector(".course-card-open").addEventListener("click", () => {
  window.location.href = `curso-detalhes.html?id=${curso.id}`;
  });
  return artigo;
}

function renderizarCursos() {
  const grade = document.getElementById("grade-cursos");
  const vazio = document.getElementById("catalogo-vazio");
  const contador = document.getElementById("contador-cursos");
  grade.innerHTML = "";

  if (!estado.catalogoPronto) {
    contador.textContent = "Preparando catálogo";
    for (let i = 0; i < 6; i++) {
      const esqueleto = document.createElement("div");
      esqueleto.className = "course-skeleton";
      esqueleto.innerHTML = "<div></div><span></span><span></span><span></span>";
      grade.appendChild(esqueleto);
    }
    vazio.hidden = true;
    return;
  }

  const visiveis = filtrarCursos();
  contador.textContent = `${visiveis.length} ${visiveis.length === 1 ? "curso encontrado" : "cursos encontrados"}`;

  if (visiveis.length === 0) {
    vazio.hidden = false;
    return;
  }
  vazio.hidden = true;
  for (const curso of visiveis) grade.appendChild(criarCardCurso(curso));
}

/* ---------------------- Ícones inline (sem dependências externas) ---------------------- */

function iconeRelogio() {
  return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
}
function iconePessoas() {
  return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
}
function iconeSeta() {
  return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
}

/* ---------------------- Mascote Stênio ---------------------- */

const POSES_MASCOTE = {
  welcome: "imagens/mascote/stenio-joinha.png",
  pointing: "imagens/mascote/stenio-mostrando.png",
  thinking: "imagens/mascote/stenio-pensando-normal.png",
  thinkingHappy: "imagens/mascote/stenio-pensando-feliz.png",
  neutral: "imagens/mascote/stenio-normal.png",
};

function falarComoMascote(mensagem, humor = "welcome") {
  const caixa = document.getElementById("mensagem-mascote-caixa");
  const texto = document.getElementById("mensagem-mascote-texto");
  const imagem = document.getElementById("imagem-mascote");
  const guia = document.getElementById("guia-mascote");

  texto.textContent = mensagem;
  imagem.src = POSES_MASCOTE[humor] || POSES_MASCOTE.welcome;
  guia.className = `mascot-guide mascot-mood-${humor}`;
  caixa.hidden = false;
}

function iniciarMascote() {
  document.getElementById("botao-fechar-mascote").addEventListener("click", () => {
    document.getElementById("mensagem-mascote-caixa").hidden = true;
  });
  document.getElementById("botao-mascote").addEventListener("click", () => {
    const caixa = document.getElementById("mensagem-mascote-caixa");
    caixa.hidden = !caixa.hidden;
  });
}

/* ---------------------- Ações guiadas pelo mascote ---------------------- */

function guiarPorArea(area) {
  estado.areaAtiva = area;
  renderizarFiltroAreas();
  renderizarCursos();

  const mensagens = {
    Todos: { texto: "Aqui estão todas as formações. Toque em uma área para começar sua exploração.", humor: "welcome" },
    "Eletroeletrônica": { texto: "Eletroeletrônica conecta você aos sistemas que movem a indústria. Veja as opções desta área.", humor: "pointing" },
    "Metalmecânica": { texto: "Metalmecânica é prática, precisão e produção. Explore os cursos disponíveis.", humor: "neutral" },
    "Tecnologia da Informação": { texto: "Tecnologia da Informação transforma ideias em soluções digitais. Vamos descobrir um caminho.", humor: "thinkingHappy" },
    "Refrigeração": { texto: "Refrigeração e climatização têm aplicação direta no mercado. Confira as turmas.", humor: "pointing" },
    "Automação": { texto: "Automação é uma ponte para a indústria 4.0. Esta pode ser uma excelente escolha.", humor: "thinkingHappy" },
  };
  const escolhida = mensagens[area] || mensagens.Todos;
  falarComoMascote(escolhida.texto, escolhida.humor);
}

function guiarPorNivel(nivel) {
  estado.nivelAtivo = nivel;
  renderizarFiltroNiveis();
  renderizarCursos();
  const mensagem = nivel === "Todos"
    ? "Mostro novamente todas as modalidades para você comparar com calma."
    : `Filtrei as formações de ${nivel.toLocaleLowerCase("pt-BR")}. Agora escolha um curso para ver os detalhes.`;
  falarComoMascote(mensagem, "thinking");
}

/* ---------------------- Busca ---------------------- */

function iniciarBusca() {
  const campo = document.getElementById("campo-busca");
  const botaoLimpar = document.getElementById("botao-limpar-busca");

  campo.addEventListener("focus", () => {
    falarComoMascote("Digite uma área, modalidade ou nome de curso. Eu procuro junto com você.", "thinking");
  });
  campo.addEventListener("input", (evento) => {
    estado.busca = evento.target.value;
    botaoLimpar.hidden = !estado.busca;
    renderizarCursos();
  });
  botaoLimpar.addEventListener("click", () => {
    campo.value = "";
    estado.busca = "";
    botaoLimpar.hidden = true;
    renderizarCursos();
  });

  document.getElementById("botao-limpar-filtros").addEventListener("click", () => {
    estado.areaAtiva = "Todos";
    estado.nivelAtivo = "Todos";
    estado.busca = "";
    campo.value = "";
    botaoLimpar.hidden = true;
    renderizarFiltroAreas();
    renderizarFiltroNiveis();
    renderizarCursos();
    falarComoMascote("Pronto, recomeçamos juntos. Escolha uma área ou faça uma nova busca.", "welcome");
  });
}

/* ---------------------- Boas-vindas da recepção ---------------------- */

const TEXTOS_ESCOLHA = {
  cursos: { titulo: "Vamos encontrar sua formação.", texto: "Eu vou abrir o catálogo para você explorar as áreas e os cursos disponíveis.", acao: "Explorar cursos" },
  sobre: { titulo: "Conheça nossa unidade.", texto: "Vou mostrar um pouco da estrutura, da missão e dos espaços do SENAI Stênio Lopes.", acao: "Conhecer a unidade" },
  ajuda: { titulo: "Pode contar comigo.", texto: "Toque em uma área de interesse, use a busca ou abra um curso para ver seus detalhes. Eu acompanho você nessa escolha.", acao: "Começar com o Stênio" },
};

function iniciarBoasVindas() {
  const overlay = document.getElementById("boas-vindas-recepcao");
  const painelOpcoes = document.getElementById("boas-vindas-opcoes");
  const painelResposta = document.getElementById("boas-vindas-resposta");
  let escolhaAtual = null;

  function fechar() {
    overlay.style.display = "none";
  }

  function mostrarEscolha(escolha) {
    escolhaAtual = escolha;
    const dados = TEXTOS_ESCOLHA[escolha];
    document.getElementById("resposta-titulo").textContent = dados.titulo;
    document.getElementById("resposta-texto").textContent = dados.texto;
    document.getElementById("resposta-acao-texto").textContent = dados.acao;
    painelOpcoes.hidden = true;
    painelResposta.hidden = false;

    const imagem = document.getElementById("imagem-boas-vindas");
    const visual = document.getElementById("visual-boas-vindas");
    const pose = escolha === "ajuda" ? "thinking" : "pointing";
    imagem.src = escolha === "ajuda" ? POSES_MASCOTE.thinkingHappy : POSES_MASCOTE.pointing;
    visual.className = `welcome-visual welcome-pose-${pose}`;
  }

  document.querySelectorAll("#boas-vindas-opcoes [data-escolha]").forEach((botao) => {
    botao.addEventListener("click", () => mostrarEscolha(botao.dataset.escolha));
  });

  document.getElementById("botao-escolher-outra").addEventListener("click", () => {
    painelOpcoes.hidden = false;
    painelResposta.hidden = true;
  });

  document.getElementById("botao-continuar-resposta").addEventListener("click", () => {
    fechar();
    if (escolhaAtual === "sobre") {
      window.location.href = "sobre.html";
      return;
    }
    if (escolhaAtual === "cursos") {
      falarComoMascote("Ótima escolha. Toque em uma área ou em um curso para conhecer as formações disponíveis.", "pointing");
      setTimeout(() => document.getElementById("cursos")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } else {
      falarComoMascote("Comece pelos botões de área no catálogo. Depois, abra um curso para ver seus horários, vagas e detalhes.", "thinkingHappy");
    }
  });

  document.getElementById("botao-fechar-boas-vindas").addEventListener("click", fechar);
  document.getElementById("botao-pular-boas-vindas").addEventListener("click", fechar);
}

/* ---------------------- Cabeçalho: menu mobile e tema ---------------------- */

function iniciarCabecalho() {
  const botaoMenu = document.getElementById("botao-menu-mobile");
  const navMobile = document.getElementById("mobile-navigation");
  botaoMenu.addEventListener("click", () => {
    const aberto = navMobile.classList.toggle("is-open");
    botaoMenu.setAttribute("aria-expanded", String(aberto));
  });

  function aplicarTema(tema) {
    document.documentElement.classList.toggle("dark", tema === "dark");
    localStorage.setItem("theme", tema);
    const rotulo = tema === "light" ? "Escuro" : "Claro";
    document.querySelectorAll("#botao-tema span, #botao-tema-mobile").forEach((el) => {
      if (el.tagName === "BUTTON") el.textContent = `Usar modo ${tema === "light" ? "escuro" : "claro"}`;
      else el.textContent = rotulo;
    });
  }

  const temaSalvo = localStorage.getItem("theme") || "light";
  aplicarTema(temaSalvo);

  function alternarTema() {
    const atual = document.documentElement.classList.contains("dark") ? "dark" : "light";
    aplicarTema(atual === "light" ? "dark" : "light");
  }

  document.getElementById("botao-tema").addEventListener("click", alternarTema);
  document.getElementById("botao-tema-mobile").addEventListener("click", alternarTema);
}

/* ---------------------- Voltar ao topo ---------------------- */

function iniciarBotaoTopo() {
  const botao = document.getElementById("botao-topo");
  window.addEventListener("scroll", () => {
    botao.classList.toggle("is-visible", window.scrollY > 420);
  }, { passive: true });
  botao.addEventListener("click", () => {
    const semAnimacao = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: semAnimacao ? "instant" : "smooth" });
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
  document.title = "Inicial | SENAI Stênio Lopes";
  iniciarCabecalho();
  iniciarMascote();
  iniciarBoasVindas();
  iniciarBusca();
  iniciarBotaoTopo();
  iniciarVLibras();

  await carregarDados();
  renderizarFiltroAreas();
  renderizarFiltroNiveis();
  document.getElementById("numero-cursos-destaque").textContent = estado.cursos.length;

  // pequeno atraso para reproduzir a transição de carregamento do catálogo
  setTimeout(() => {
    estado.catalogoPronto = true;
    renderizarCursos();
  }, 550);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service_woker.js").catch((erro) => console.warn("Service worker não registrado:", erro));
  }
});
