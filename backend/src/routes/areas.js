const express = require("express");
const router = express.Router();
const areasController = require("../controller/areasController");

router.get("/", areasController.listar);

module.exports = router;
