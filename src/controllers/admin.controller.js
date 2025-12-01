const adminService = require("../services/admin.service");


const signup = async (req, res) => {
    try {
        const admin = await adminService.create(req.body);
        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


const login = async (req, res) => {

    try {
        const admin = await adminService.login(req.body);


        res.status(200).json({
            success: true,
            message: "Admin logged in successfully",
            admin
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


const update = async (req, res) => {
    try {
        const admin = await adminService.update(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}



const adminController = {
    signup,
    login,
    update
};

module.exports = adminController;
