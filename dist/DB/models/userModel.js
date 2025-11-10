"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    covarImage: [String],
    profileImage: String,
    folderId: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    chengedCradentialAt: Date,
    emailotp: {
        otp: String,
        expiredAt: Date
    },
    passwordotp: {
        otp: String,
        expiredAt: Date
    },
}, {
    timestamps: true
});
exports.UserModel = mongoose_1.models.user || (0, mongoose_1.model)('users', userSchema);
