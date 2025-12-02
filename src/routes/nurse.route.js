const express = require("express");
const router = express.Router();

const nurseController = require("../controllers/nurse.controller");

router.post("/signup", nurseController.signup);
router.post("/login", nurseController.login);
router.patch("/update/:id", nurseController.update);
router.get("/:id", nurseController.getById);
router.get("/", nurseController.getAll);
router.delete("/:id", nurseController.remove);

module.exports = router;


