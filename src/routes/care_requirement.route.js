const express = require("express");
const router = express.Router();

const careRequirementController = require("../controllers/care_requirement.controller");

router.post("/", careRequirementController.create);
router.get("/", careRequirementController.getAll);
router.get("/:id", careRequirementController.getById);
router.patch("/:id", careRequirementController.update);
router.delete("/:id", careRequirementController.remove);

module.exports = router;


