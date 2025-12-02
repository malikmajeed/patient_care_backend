const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking.controller");

router.post("/", bookingController.create);
router.get("/", bookingController.getAll);
router.get("/:id", bookingController.getById);
router.patch("/:id", bookingController.update);
router.delete("/:id", bookingController.remove);

module.exports = router;


