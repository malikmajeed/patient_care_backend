const express = require("express");
const router = express.Router();

//importing all routes
const patientRoute = require("./patient.route");



//using all routes
router.use("/patient", patientRoute);

module.exports = router;





