import { NextFunction , Response , Request} from "express";
import { ZodObject } from "zod";



const validation =(Schema: ZodObject) => {
    return async (req:Request, res:Response, next:NextFunction) =>{
        const data = {
            ...req.body,
            ...req.params,
            ...req.query
        }
        const validationRes = await Schema.safeParseAsync(data)
        if (!validationRes.success) {
            return res.status(422).json({
                validationError : JSON.parse (validationRes.error as unknown as string)
            })
        }
        next()
    }
}


export default validation