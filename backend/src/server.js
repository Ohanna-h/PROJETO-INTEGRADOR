const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const rotasAuth = require("./routes/auth");
const rotasAreas = require("./routes/areas");
const rotasConfig = require("./routes/config");
const rotasCursos = require("./routes/cursos");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ---------- API ----------
app.use("/api/auth", rotasAuth);
app.use("/api/areas", rotasAreas);
app.use("/api/config", rotasConfig);
app.use("/api/cursos", rotasCursos);

// ---------- Arquivos estáticos ----------
// Site público (index.html, sobre, css, js, imagens...)
app.use(express.static(path.join(__dirname, "..", "..", "frontend")));
// Painel administrativo, isolado em /administrador
app.use("/administrador", express.static(path.join(__dirname, "..", "..", "administrador")));

// Qualquer rota de página desconhecida cai no index (site é uma SPA leve
// com poucas páginas, mas isso evita 404 em rotas como /sobre acessadas direto).
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "..", "..", "frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Plataforma SENAI rodando em http://localhost:${PORT}`);
});
