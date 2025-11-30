const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");

router.post("/signup", adminController.signup);
router.post("/login", adminController.login);
router.patch("/update/:id", adminController.update);



module.exports = router;