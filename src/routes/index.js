const express = require("express");
const router = express.Router();

// importing all routes
const patientRoute = require("./patient.route");
const adminRoute = require("./admin.route");
const nurseRoute = require("./nurse.route");
const bookingRoute = require("./booking.route");
const paymentRoute = require("./payment.route");
const reviewRoute = require("./review.route");
const serviceCategoryRoute = require("./service_category.route");
const careRequirementRoute = require("./care_requirement.route");
const documentRoute = require("./document.route");
const workScheduleRoute = require("./work_schedule.route");
const nurseSkillRoute = require("./nurse_skill.route");
const requiredServiceRoute = require("./required_service.route");



// using all routes
router.use("/patient", patientRoute);
router.use("/admin", adminRoute);
router.use("/nurse", nurseRoute);
router.use("/booking", bookingRoute);
router.use("/payment", paymentRoute);
router.use("/review", reviewRoute);
router.use("/service-category", serviceCategoryRoute);
router.use("/care-requirement", careRequirementRoute);
router.use("/document", documentRoute);
router.use("/work-schedule", workScheduleRoute);
router.use("/nurse-skill", nurseSkillRoute);
router.use("/required-service", requiredServiceRoute);





module.exports = router;





