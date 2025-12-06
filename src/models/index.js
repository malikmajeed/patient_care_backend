// Import all models to ensure they are registered with Sequelize
const Admin = require('./admin.model');
const Patient = require('./patient.model');
const Nurse = require('./nurse.model');
const ServiceCategory = require('./service_category.model');
const CareRequirement = require('./care_requirement.model');
const Booking = require('./booking.model');
const Payment = require('./payment.model');
const Review = require('./review.model');
const NurseSkill = require('./nurse_skill.model');
const RequiredService = require('./required_service.model');
const Document = require('./document.model');
const WorkSchedule = require('./work_schedule.model');
const Session = require('./session.model');

module.exports = {
    Admin,
    Patient,
    Nurse,
    ServiceCategory,
    CareRequirement,
    Booking,
    Payment,
    Review,
    NurseSkill,
    RequiredService,
    Document,
    WorkSchedule,
    Session
};
