const express = require("express");
const router = express.Router();

const workScheduleController = require("../controllers/work_schedule.controller");

router.post("/", workScheduleController.create);
router.get("/", workScheduleController.getAll);
router.get("/:id", workScheduleController.getById);
router.patch("/:id", workScheduleController.update);
router.delete("/:id", workScheduleController.remove);

module.exports = router;


