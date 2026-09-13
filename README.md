# Plataforma SENAI Stênio Lopes

Refatoração da plataforma para uma stack simples: **HTML, CSS, JS puro no
frontend + Node/Express no backend + MySQL**, organizada na estrutura de
pastas que você pediu. Testado de ponta a ponta neste ambiente (banco
criado, seed importado, servidor rodando, login e CRUD do painel admin
funcionando).

## Imagens: já incluídas (quase todas)

Você mandou seu próprio banco de imagens reais depois da primeira entrega,
e ele já está todo organizado dentro de `frontend/imagens/`, otimizado
para web (comprimido de ~91MB para ~18MB). O catálogo de cursos também
foi expandido de 10 para os **18 cursos reais** que você tem imagem.

Só falta uma foto: a história do Sr. Stênio Lopes (a pessoa) para a
página Sobre — você disse que vai providenciar depois. Veja os detalhes
em `frontend/imagens/LEIA-ME.txt`.

⚠️ **Carga horária, turno e vagas dos cursos são valores de exemplo** —
preencha os números reais pelo painel admin antes de apresentar.

## Duas adições fora da sua lista original de arquivos

Pra não alterar o resultado final da plataforma (que tinha uma página
"Sobre a unidade"), adicionei:
- `frontend/sobre.html`
- `frontend/js/sobre.js`

Não estavam na árvore de pastas que você desenhou, mas sem eles a página
"Sobre" do site original teria sumido. Se preferir remover essa página,
é só apagar os dois arquivos e o link "Sobre" do menu.

## Como rodar

```bash
# 1. Banco de dados (via XAMPP/MySQL Workbench ou linha de comando)
mysql -u root -p < backend/database/shema.sql
mysql -u root -p < backend/database/seed.sql

# 2. Backend
cd backend
npm install
# o arquivo .env já vem com valores de exemplo — ajuste usuário/senha
# do seu MySQL local antes de rodar
node scripts/criarAdmin.js "Seu Nome" seu@email.com suaSenha123
npm start

# 3. Acesse
# Site:  http://localhost:3000
# Admin: http://localhost:3000/administrador/admin.html
```

## O que foi testado neste ambiente

- ✅ `shema.sql` e `seed.sql` aplicados num MySQL real, sem erros
- ✅ Acentuação (ã, ç, é...) chegando correta na API — encontrei e corrigi
  um bug real de charset na importação do seed (faltava `SET NAMES
  utf8mb4;`, sem isso os acentos ficavam corrompidos no banco)
- ✅ Login do painel (JWT + bcrypt)
- ✅ Criar, editar e remover curso via API autenticada
- ✅ Editar texto institucional via API autenticada
- ✅ Rota protegida rejeita requisição sem token (401)
- ✅ Servidor Express servindo o site, a página de detalhes e o painel
- ✅ Sintaxe de todos os arquivos `.js` validada (`node --check`)

## O que não pude testar

- O resultado visual pixel-a-pixel (não tenho um navegador gráfico neste
  ambiente) — validei a estrutura HTML e cruzei todas as classes usadas
  contra o CSS, mas vale você abrir no navegador e comparar com a prévia
  original depois de colocar as imagens.
