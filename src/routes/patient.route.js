const express = require("express");
const router = express.Router();

const patientController = require("../controllers/patient.controller");

router.post("/signup", patientController.signup);
router.post("/login", patientController.login);
router.patch("/update/:id", patientController.update);



module.exports = router;