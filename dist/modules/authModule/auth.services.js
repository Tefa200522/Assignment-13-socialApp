"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const userModel_1 = require("../../DB/models/userModel");
const types_1 = require("../../utils/errors/types");
class AuthServices {
    userModel = userModel_1.UserModel;
    signUp = async (req, res, next) => {
        const { name, email, password } = req.body;
        const isEmailExist = await this.userModel.findOne({ email });
        if (isEmailExist) {
            throw new types_1.ApplicationError('email already exist', 400);
        }
        const user = await this.userModel.create({
            name,
            email,
            password
        });
        return res.json({
            user
        });
    };
}
exports.AuthServices = AuthServices;
