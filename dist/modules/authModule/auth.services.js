"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const types_1 = require("../../utils/errors/types");
const user_repos_1 = require("../../DB/repos/user.repos");
const hash_1 = require("../../utils/security/hash");
const successHandler_1 = require("../../utils/successHandler");
const creatOTP_1 = require("../../utils/email/creatOTP");
const generateHTML_1 = require("../../utils/email/generateHTML");
const email_events_1 = require("../../utils/email/email.events");
const bcrypt_1 = require("bcrypt");
class AuthServices {
    userModel = new user_repos_1.UserRepo;
    signUp = async (req, res, next) => {
        const { firstName, lastName, email, password, age, phone } = req.body;
        const isEmailExist = await this.userModel.findByEmail({ email });
        if (isEmailExist) {
            throw new types_1.ApplicationError('email already exist', 400);
        }
        const otp = (0, creatOTP_1.creatOTP)();
        const user = await this.userModel.create({
            doc: {
                firstName,
                lastName,
                email,
                password: await (0, hash_1.hash)(password),
                age: age,
                phone: phone,
                emailotp: {
                    otp: await (0, hash_1.hash)(otp),
                    expiredAt: new Date(Date.now() + 30 * 1000)
                }
            }
        });
        const html = (0, generateHTML_1.template)({
            code: otp,
            name: `${firstName} ${lastName}`,
            subject: 'verify your email'
        });
        email_events_1.emailEmitter.publish(email_events_1.EMAIL_EVENTS_ENUM.VERIFY_EMAIL, {
            to: email,
            subject: 'verify your email',
            html
        });
        return (0, successHandler_1.successHandler)({ res, data: user });
    };
    confirmEmail = async (req, res, next) => {
        const { email, otp } = req.body;
        const user = await this.userModel.findByEmail({ email });
        if (!user) {
            throw new types_1.NotFoundException('email not found');
        }
        if (user.isVerified) {
            throw new types_1.ApplicationError('email alread verified', 400);
        }
        if (!user.emailotp.otp) {
            throw new types_1.ApplicationError('otp not found', 400);
        }
        const isExpired = user.emailotp.expiredAt <= new Date(Date.now());
        if (isExpired) {
            throw new types_1.OtpExpiredException();
        }
        const isValidOtp = await (0, bcrypt_1.compare)(otp, user.emailotp.otp);
        if (!isValidOtp) {
            throw new types_1.NOTValidOtpException();
        }
        await user.updateOne({
            $unset: {
                emailotp: ""
            },
            isVerified: true
        });
        return (0, successHandler_1.successHandler)({ res });
    };
}
exports.AuthServices = AuthServices;
