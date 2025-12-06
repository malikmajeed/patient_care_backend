const bcrypt = require('bcrypt');


const encryptPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        throw new Error(error.message);
    }
}


const comparePassword = async (password, hash) => {
    try {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { encryptPassword, comparePassword };
