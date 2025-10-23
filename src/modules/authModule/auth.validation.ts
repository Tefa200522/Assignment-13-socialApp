import z, { email, startsWith } from 'zod';


export const signupSchema = z.object({
    firstName: z. string(),
    lastName: z. string(),
    email: z. string(),
    password: z. string(),
    age: z.number().optional(),
    phone : z. string().optional(),
    confirmPassword: z.string()
}).superRefine((args, ctx) =>{
        if (args.confirmPassword != args.password) {
            ctx.addIssue({
                code: "custom",
                path: ['password','confirmPassword'],
                message: "password must be equal to confirm password"
            })
        }
    })




export const confirmEmailSchema = z.object({
    email :z.email(),
    otp : z.string().length(6)

})
