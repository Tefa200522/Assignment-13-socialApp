"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidOtpException = exports.NotVerifiedException = exports.InvalidTokenException = exports.InvalidCredentialsException = exports.NOTValidOtpException = exports.OtpExpiredException = exports.NotFoundException = exports.ApplicationError = void 0;
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
class InvalidCredentialsException extends ApplicationError {
    constructor(msg = "invalid credentials") {
        super(msg, 400);
    }
}
exports.InvalidCredentialsException = InvalidCredentialsException;
class InvalidTokenException extends ApplicationError {
    constructor(msg = "invalid token exception") {
        super(msg, 400);
    }
}
exports.InvalidTokenException = InvalidTokenException;
class NotVerifiedException extends ApplicationError {
    constructor(msg = "verified email exception") {
        super(msg, 400);
    }
}
exports.NotVerifiedException = NotVerifiedException;
class InvalidOtpException extends ApplicationError {
    constructor(msg = "invalid otp exception") {
        super(msg, 400);
    }
}
exports.InvalidOtpException = InvalidOtpException;
