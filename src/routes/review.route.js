const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/review.controller");

router.post("/", reviewController.create);
router.get("/", reviewController.getAll);
router.get("/:id", reviewController.getById);
router.patch("/:id", reviewController.update);
router.delete("/:id", reviewController.remove);

module.exports = router;


