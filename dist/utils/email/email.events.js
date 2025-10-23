"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEmitter = exports.EmailEevents = exports.EMAIL_EVENTS_ENUM = void 0;
const events_1 = require("events");
const sendEmail_1 = require("./sendEmail");
var EMAIL_EVENTS_ENUM;
(function (EMAIL_EVENTS_ENUM) {
    EMAIL_EVENTS_ENUM["VERIFY_EMAIL"] = "VERIFY_EMAIL";
    EMAIL_EVENTS_ENUM["RESET_EMAIL"] = "RESET_EMAIL";
})(EMAIL_EVENTS_ENUM || (exports.EMAIL_EVENTS_ENUM = EMAIL_EVENTS_ENUM = {}));
class EmailEevents {
    emitter;
    constructor(emitter) {
        this.emitter = emitter;
    }
    subscribe = (event, callback) => {
        this.emitter.on(event, callback);
    };
    publish = (event, payload) => {
        this.emitter.emit(event, payload);
    };
}
exports.EmailEevents = EmailEevents;
const emitter = new events_1.EventEmitter();
exports.emailEmitter = new EmailEevents(emitter);
exports.emailEmitter.subscribe(EMAIL_EVENTS_ENUM.VERIFY_EMAIL, ({ to, subject, html }) => {
    (0, sendEmail_1.SendEmail)({ to, subject, html });
});
