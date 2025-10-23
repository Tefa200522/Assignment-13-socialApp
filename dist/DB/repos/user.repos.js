"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepo = void 0;
const DBRepo_1 = require("../DBRepo");
const userModel_1 = require("../models/userModel");
class UserRepo extends DBRepo_1.DBRepo {
    model;
    constructor(model = userModel_1.UserModel) {
        super(userModel_1.UserModel);
        this.model = model;
    }
    findByEmail = async ({ email, projection = {}, options = {} }) => {
        const doc = await this.model.findOne({ email }, projection, options);
        return doc;
    };
}
exports.UserRepo = UserRepo;
