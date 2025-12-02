const express = require("express");
const router = express.Router();

const serviceCategoryController = require("../controllers/service_category.controller");

router.post("/", serviceCategoryController.create);
router.get("/", serviceCategoryController.getAll);
router.get("/:id", serviceCategoryController.getById);
router.patch("/:id", serviceCategoryController.update);
router.delete("/:id", serviceCategoryController.remove);

module.exports = router;


