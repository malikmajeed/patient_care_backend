const express = require("express");
const router = express.Router();

const documentController = require("../controllers/document.controller");

router.post("/", documentController.create);
router.get("/", documentController.getAll);
router.get("/:id", documentController.getById);
router.patch("/:id", documentController.update);
router.delete("/:id", documentController.remove);

module.exports = router;


