import z from "zod";
import { confirmEmailSchema, signupSchema } from "./auth.validation";


export type SignDto = z.infer <typeof signupSchema>

export type confirmEmailDto = z.infer <typeof confirmEmailSchema>