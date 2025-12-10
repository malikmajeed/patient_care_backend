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
router.use("/patients", patientRoute);
router.use("/admins", adminRoute);
router.use("/nurses", nurseRoute);
router.use("/bookings", bookingRoute);
router.use("/payments", paymentRoute);
router.use("/reviews", reviewRoute);
router.use("/service-categories", serviceCategoryRoute);
router.use("/care-requirements", careRequirementRoute);
router.use("/documents", documentRoute);
router.use("/work-schedules", workScheduleRoute);
router.use("/nurse-skills", nurseSkillRoute);
router.use("/required-services", requiredServiceRoute);





module.exports = router;





