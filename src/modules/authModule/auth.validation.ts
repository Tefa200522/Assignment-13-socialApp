import z, { email, startsWith } from 'zod';


export const signupSchema = z.object({
    email: z.email(),
    name: z.string(),
    password: z.string(),
    confirmPassword: z.string()
})
    .superRefine((args, ctx) =>{
        if (args.confirmPassword != args.password) {
            ctx.addIssue({
                code: "custom",
                path: ['password','confirmPassword'],
                message: "password must be equal to confirm password"
            })
        }
        if (!args.email.startsWith('tefa')) {
            ctx.addIssue({
                code: "custom",
                path: ['name'],
                message: "must start whit 'tefa'"
            })
        }
    })



// .refine((args) =>{
//     return args.confirmPassword == args.password
// },{
//     error: "password must be equal to confirm password",
//     path: ['password','confirmPassword']
// })