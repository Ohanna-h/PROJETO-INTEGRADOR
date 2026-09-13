/* ============================================================
 * Plataforma SENAI Stênio Lopes — service_woker.js
 * Cache básico para permitir uso em conexões instáveis (totem
 * de recepção). Guarda o "casco" do site; os dados de cursos
 * têm seu próprio fallback local em js/cursos.json.
 * ============================================================ */

const CACHE_NOME = "plataforma-senai-v1";
const ARQUIVOS_ESSENCIAIS = [
  "/",
  "/index.html",
  "/sobre.html",
  "/curso-detalhes.html",
  "/css/estilo.css",
  "/js/script.js",
  "/js/curso-detalhes.js",
  "/js/sobre.js",
  "/js/cursos.json",
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NOME).then((cache) => cache.addAll(ARQUIVOS_ESSENCIAIS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(chaves.filter((chave) => chave !== CACHE_NOME).map((chave) => caches.delete(chave)))
    )
  );
  self.clients.claim();
});

// Estratégia: tenta a rede primeiro (para pegar dados atualizados da
// API); se falhar (sem internet), cai para o cache.
self.addEventListener("fetch", (evento) => {
  if (evento.request.method !== "GET") return;

  evento.respondWith(
    fetch(evento.request)
      .then((resposta) => {
        const copia = resposta.clone();
        caches.open(CACHE_NOME).then((cache) => cache.put(evento.request, copia));
        return resposta;
      })
      .catch(() => caches.match(evento.request))
  );
});
