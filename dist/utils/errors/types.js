"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTValidOtpException = exports.OtpExpiredException = exports.NotFoundException = exports.ApplicationError = void 0;
class ApplicationError extends Error {
    statusCode;
    constructor(msg, statusCode, options = {}) {
        super(msg, options);
        this.statusCode = statusCode;
    }
}
exports.ApplicationError = ApplicationError;
class NotFoundException extends ApplicationError {
    constructor(msg = "not found") {
        super(msg, 404);
    }
}
exports.NotFoundException = NotFoundException;
class OtpExpiredException extends ApplicationError {
    constructor(msg = "otp Expired") {
        super(msg, 404);
    }
}
exports.OtpExpiredException = OtpExpiredException;
class NOTValidOtpException extends ApplicationError {
    constructor(msg = "not valid otp") {
        super(msg, 404);
    }
}
exports.NOTValidOtpException = NOTValidOtpException;
