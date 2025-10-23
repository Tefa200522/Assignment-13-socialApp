"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.hash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hash = async (planText) => bcrypt_1.default.hash(planText, 10);
exports.hash = hash;
const compare = async (planText, hash) => bcrypt_1.default.compare(planText, hash);
exports.compare = compare;
