const express = require("express");
const router = express.Router();

//importing all routes
const patientRoute = require("./patient.route");
const adminRoute = require("./admin.route");



//using all routes
router.use("/patient", patientRoute);
router.use("/admin", adminRoute);





module.exports = router;





