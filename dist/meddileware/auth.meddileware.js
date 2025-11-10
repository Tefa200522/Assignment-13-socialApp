"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.decodeToken = exports.TokenTypesEnum = void 0;
const types_1 = require("../utils/errors/types");
const token_1 = require("../utils/security/token");
const user_repos_1 = require("../DB/repos/user.repos");
var TokenTypesEnum;
(function (TokenTypesEnum) {
    TokenTypesEnum["ACCESS"] = "access";
    TokenTypesEnum["REFRESH"] = "refresh";
})(TokenTypesEnum || (exports.TokenTypesEnum = TokenTypesEnum = {}));
const userModel = new user_repos_1.UserRepo();
const decodeToken = async ({ authorization = "", tokenTypes = TokenTypesEnum.ACCESS }) => {
    if (!authorization) {
        throw new types_1.InvalidTokenException();
    }
    if (!authorization.startsWith(process.env.BEARER)) {
        throw new types_1.InvalidTokenException();
    }
    console.log(authorization);
    const token = authorization.split(' ')[1];
    const payload = (0, token_1.verifyToken)({
        token,
        signature: tokenTypes == TokenTypesEnum.ACCESS ?
            process.env.ACCESS_SIGNATURE
            : process.env.REFRESH_SIGNATURE
    });
    console.log({ payload });
    const user = await userModel.findById({ id: payload._id });
    if (!user) {
        throw new types_1.InvalidTokenException();
    }
    if (!user.isVerified) {
        throw new types_1.InvalidTokenException();
    }
    return user;
};
exports.decodeToken = decodeToken;
const auth = async (req, res, next) => {
    const data = await (0, exports.decodeToken)({
        authorization: req.headers.authorization,
        tokenTypes: TokenTypesEnum.ACCESS
    });
    res.locals.user = data;
    return next();
};
exports.auth = auth;
