"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_services_1 = require("./auth.services");
const meddileware_validation_1 = __importDefault(require("../../meddileware/meddileware.validation"));
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
const authServices = new auth_services_1.AuthServices();
router.post('/signup', (0, meddileware_validation_1.default)(auth_validation_1.signupSchema), authServices.signUp);
router.patch('/confirmEmail', (0, meddileware_validation_1.default)(auth_validation_1.confirmEmailSchema), authServices.confirmEmail);
exports.default = router;
