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
const token_1 = require("../../utils/security/token");
const auth_meddileware_1 = require("../../meddileware/auth.meddileware");
const s3_servicses_1 = require("../../utils/multer/s3.servicses");
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
        const isValidOtp = await (0, hash_1.compare)(otp, user.emailotp.otp);
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
    resendOtp = async (req, res, next) => {
        const { email } = req.body;
        const user = await this.userModel.findByEmail({ email });
        if (!user) {
            throw new types_1.NotFoundException('email not found');
        }
        if (user.isVerified) {
            throw new types_1.ApplicationError('email alread verified', 400);
        }
        const isExpired = user.emailotp.expiredAt <= new Date(Date.now());
        if (!isExpired) {
            throw new types_1.ApplicationError('otp not expired', 400);
        }
        const otp = (0, creatOTP_1.creatOTP)();
        const html = (0, generateHTML_1.template)({
            code: otp,
            name: `${user.firstName} ${user.lastName}`,
            subject: 'verify your email'
        });
        email_events_1.emailEmitter.publish(email_events_1.EMAIL_EVENTS_ENUM.VERIFY_EMAIL, {
            to: email,
            subject: 'verify your email',
            html
        });
        await user.updateOne({
            $set: {
                emailotp: {
                    otp: await (0, hash_1.hash)(otp),
                    expiredAt: new Date(Date.now() + 30 * 1000)
                }
            }
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    login = async (req, res, next) => {
        const { email, password } = req.body;
        const user = await this.userModel.findByEmail({ email });
        if (!user) {
            throw new types_1.InvalidCredentialsException();
        }
        const invalidPassword = await (0, hash_1.compare)(password, user.password);
        if (!invalidPassword) {
            throw new types_1.InvalidCredentialsException();
        }
        const accessToken = (0, token_1.generateToken)({
            payload: {
                _id: user._id
            },
            signature: process.env.ACCESS_SIGNATURE,
            option: {
                expiresIn: '1 H'
            }
        });
        const refreshToken = (0, token_1.generateToken)({
            payload: {
                _id: user._id
            },
            signature: process.env.REFRESH_SIGNATURE,
            option: {
                expiresIn: '7 D'
            }
        });
        return (0, successHandler_1.successHandler)({ res, data: {
                accessToken,
                refreshToken
            } });
    };
    refreshToken = async (req, res, next) => {
        const { authorization } = req.headers;
        const user = await (0, auth_meddileware_1.decodeToken)({ authorization: authorization, tokenTypes: auth_meddileware_1.TokenTypesEnum.REFRESH });
        const accessToken = (0, token_1.generateToken)({
            payload: {
                _id: user._id
            },
            signature: process.env.ACCESS_SIGNATURE,
            option: {
                expiresIn: '1 H'
            }
        });
        return (0, successHandler_1.successHandler)({ res, data: {
                accessToken
            } });
    };
    me = async (req, res) => {
        const user = res.locals.user;
        user.firstName = user.firstName;
        await user.save();
        return (0, successHandler_1.successHandler)({ res, data: user });
    };
    forgetPassword = async (req, res) => {
        const { email } = req.body;
        const user = await this.userModel.findByEmail({ email });
        if (!user) {
            throw new types_1.NotFoundException("not found email");
        }
        if (!user.isVerified) {
            throw new types_1.NotVerifiedException();
        }
        const otp = (0, creatOTP_1.creatOTP)();
        const subject = "Forget Password";
        const html = (0, generateHTML_1.template)({
            code: otp,
            name: `${user.firstName} ${user.lastName}`,
            subject
        });
        email_events_1.emailEmitter.publish(email_events_1.EMAIL_EVENTS_ENUM.RESET_PASSWORD, {
            to: email,
            subject,
            html
        });
        await user.updateOne({
            passwordotp: {
                otp: await (0, hash_1.hash)(otp),
                expiredAt: new Date(Date.now() + 300 * 1000)
            }
        });
        return (0, successHandler_1.successHandler)({ res, message: "check your email" });
    };
    resetForgettenPassword = async (req, res) => {
        const { email, otp, password } = req.body;
        const user = await this.userModel.findByEmail({ email });
        if (!user) {
            throw new types_1.NotFoundException('email not found');
        }
        if (!user.isVerified) {
            throw new types_1.NotVerifiedException();
        }
        const isExpired = user.passwordotp.expiredAt < new Date(Date.now());
        if (isExpired) {
            throw new types_1.OtpExpiredException();
        }
        const isValidOtp = await (0, hash_1.compare)(otp, user.passwordotp.otp);
        if (!isValidOtp) {
            throw new types_1.InvalidOtpException();
        }
        const hashPassword = await (0, hash_1.hash)(password);
        await user.updateOne({
            password: hashPassword,
            $unset: {
                passwordotp: "1"
            }
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    profileImage = async (req, res) => {
        const file = req.file;
        const user = res.locals.user;
        const path = await (0, s3_servicses_1.uploadFile)({
            file,
            path: `${user._id}/profileImage`
        });
        user.profileImage = path;
        await user.save();
        return (0, successHandler_1.successHandler)({ res });
    };
}
exports.AuthServices = AuthServices;
