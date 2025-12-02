const express = require("express");
const router = express.Router();

const nurseSkillController = require("../controllers/nurse_skill.controller");

router.post("/", nurseSkillController.create);
router.get("/", nurseSkillController.getAll);
router.get("/:nurseId/:categoryId", nurseSkillController.getById);
router.patch("/:nurseId/:categoryId", nurseSkillController.update);
router.delete("/:nurseId/:categoryId", nurseSkillController.remove);

module.exports = router;


