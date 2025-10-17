import z from "zod";
import { signupSchema } from "./auth.validation";


export type SignDto = z.infer <typeof signupSchema>