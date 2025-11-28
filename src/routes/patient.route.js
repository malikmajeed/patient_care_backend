const express = require("express");
const router = express.Router();

const PatientController = require("../controllers/patient.controller");

router.post("/signup", PatientController.signup);

module.exports = router;