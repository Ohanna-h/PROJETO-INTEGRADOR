const express = require("express");
const router = express.Router();
const configController = require("../controller/configController");
const { autenticar } = require("../middleware/auth");

router.get("/", configController.listar);
router.put("/", autenticar, configController.salvar);

module.exports = router;
