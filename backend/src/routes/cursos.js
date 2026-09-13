const express = require("express");
const router = express.Router();
const cursosController = require("../controller/cursosController");
const { autenticar } = require("../middleware/auth");

router.get("/", cursosController.listar);
router.post("/", autenticar, cursosController.criar);
router.put("/:id", autenticar, cursosController.atualizar);
router.delete("/:id", autenticar, cursosController.remover);

module.exports = router;
