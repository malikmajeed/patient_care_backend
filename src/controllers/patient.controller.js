const { patientSchema } = require("../schema/patient.schema");
const { bycrypt } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Patient } = require("../models/patient.model");



