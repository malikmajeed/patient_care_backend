const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment.controller");

router.post("/", paymentController.create);
router.get("/", paymentController.getAll);
router.get("/:id", paymentController.getById);
router.patch("/:id", paymentController.update);
router.delete("/:id", paymentController.remove);

module.exports = router;


