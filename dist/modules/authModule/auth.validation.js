"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupSchema = zod_1.default.object({
    email: zod_1.default.email(),
    name: zod_1.default.string(),
    password: zod_1.default.string(),
    confirmPassword: zod_1.default.string()
})
    .superRefine((args, ctx) => {
    if (args.confirmPassword != args.password) {
        ctx.addIssue({
            code: "custom",
            path: ['password', 'confirmPassword'],
            message: "password must be equal to confirm password"
        });
    }
    if (!args.email.startsWith('tefa')) {
        ctx.addIssue({
            code: "custom",
            path: ['name'],
            message: "must start whit 'tefa'"
        });
    }
});
// .refine((args) =>{
//     return args.confirmPassword == args.password
// },{
//     error: "password must be equal to confirm password",
//     path: ['password','confirmPassword']
// })
