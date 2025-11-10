import z from "zod";
import { confirmEmailSchema, loginSchema, resendOtpSchema, signupSchema } from "./auth.validation";


export type SignDto = z.infer <typeof signupSchema>

export type confirmEmailDto = z.infer <typeof confirmEmailSchema>

export type resendOtpDto = z.infer <typeof resendOtpSchema>

export type loginDto = z.infer <typeof loginSchema>