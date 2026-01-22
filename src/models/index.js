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
const User = require('./user.model');
const PatientAddress = require('./patient_address.model');
const Notification = require('./notification.model');

// Associations
User.hasOne(Admin, { foreignKey: 'user_ID' });
Admin.belongsTo(User, { foreignKey: 'user_ID' });

User.hasOne(Patient, { foreignKey: 'user_ID' });
Patient.belongsTo(User, { foreignKey: 'user_ID' });

User.hasOne(Nurse, { foreignKey: 'user_ID' });
Nurse.belongsTo(User, { foreignKey: 'user_ID' });

// Patient associations
Patient.hasMany(Booking, { foreignKey: 'patient_ID' });
Booking.belongsTo(Patient, { foreignKey: 'patient_ID' });

Patient.hasMany(PatientAddress, { foreignKey: 'patient_ID' });
PatientAddress.belongsTo(Patient, { foreignKey: 'patient_ID' });

// Nurse associations
Nurse.hasMany(NurseSkill, { foreignKey: 'nurse_ID' });
NurseSkill.belongsTo(Nurse, { foreignKey: 'nurse_ID' });

Nurse.hasMany(WorkSchedule, { foreignKey: 'nurse_ID' });
WorkSchedule.belongsTo(Nurse, { foreignKey: 'nurse_ID' });

Nurse.hasMany(Booking, { foreignKey: 'nurse_ID' });
Booking.belongsTo(Nurse, { foreignKey: 'nurse_ID' });

Booking.hasMany(Payment, { foreignKey: 'booking_ID' });
Payment.belongsTo(Booking, { foreignKey: 'booking_ID' });

Nurse.hasMany(Review, { foreignKey: 'nurse_ID' });
Review.belongsTo(Nurse, { foreignKey: 'nurse_ID' });

// ServiceCategory associations
ServiceCategory.hasMany(NurseSkill, { foreignKey: 'category_ID' });
NurseSkill.belongsTo(ServiceCategory, { foreignKey: 'category_ID' });


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
    Session,
    User,
    PatientAddress,
    Notification
};
