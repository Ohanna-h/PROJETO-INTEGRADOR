const express = require("express");
const router = express.Router();
const cursosController = require("../controller/cursosController");
const { autenticar } = require("../middleware/auth");

// Pública — só cursos disponíveis, pra vitrine do totem.
router.get("/", cursosController.listar);

// Protegida — todos os cursos (disponíveis ou não), pro painel admin.
router.get("/admin", autenticar, cursosController.listarParaAdmin);

router.post("/", autenticar, cursosController.criar);
router.put("/:id", autenticar, cursosController.atualizar);
router.patch("/:id/disponibilidade", autenticar, cursosController.alternarDisponibilidade);
router.delete("/:id", autenticar, cursosController.remover);

module.exports = router;