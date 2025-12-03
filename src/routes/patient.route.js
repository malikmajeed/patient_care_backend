const express = require("express");
const router = express.Router();

const patientController = require("../controllers/patient.controller");

router.post("/signup", patientController.signup);
router.post("/login", patientController.login);
router.patch("/update/:id", patientController.update);
router.get("/", patientController.getAllPatients);
router.get("/:id", patientController.getPatientById);
router.delete("/:id", patientController.deletePatient);



module.exports = router;