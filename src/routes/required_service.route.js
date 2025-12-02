const express = require("express");
const router = express.Router();

const requiredServiceController = require("../controllers/required_service.controller");

router.post("/", requiredServiceController.create);
router.get("/", requiredServiceController.getAll);
router.get("/:reqId/:categoryId", requiredServiceController.getById);
router.patch("/:reqId/:categoryId", requiredServiceController.update);
router.delete("/:reqId/:categoryId", requiredServiceController.remove);

module.exports = router;


