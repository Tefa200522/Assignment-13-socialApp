"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const SendEmail = ({ to, subject, html }) => {
    const transportOptions = {
        host: process.env.HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: true,
        service: "gmail",
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    };
    const transport = nodemailer_1.default.createTransport(transportOptions);
    const main = async () => {
        const info = await transport.sendMail({
            from: `Social App <${process.env.USER}>`,
            to,
            subject,
            html
        });
    };
    main().catch((err) => {
        console.log({ err });
    });
};
exports.SendEmail = SendEmail;
