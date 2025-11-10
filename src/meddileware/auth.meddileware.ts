import { JwtPayload } from "jsonwebtoken"
import { InvalidTokenException } from "../utils/errors/types"
import { verifyToken } from "../utils/security/token"
import { UserRepo } from "../DB/repos/user.repos"
import { NextFunction,Response,Request } from "express"

export enum TokenTypesEnum {
    ACCESS = 'access',
    REFRESH = 'refresh'
}



const userModel = new UserRepo()
export const decodeToken = async ({
    authorization = "",
    tokenTypes = TokenTypesEnum.ACCESS 
}:{
    authorization? : string,
    tokenTypes? : TokenTypesEnum
})=>{
    if ( !authorization) {
        throw new InvalidTokenException()
    }
    if (!authorization.startsWith(process.env.BEARER as string)) {
        throw new InvalidTokenException()
    }
    console.log(authorization );
    
    const token : string = authorization.split(' ')[1] as string
    const payload : JwtPayload = verifyToken ({
        token,
        signature: tokenTypes == TokenTypesEnum.ACCESS?
        process.env.ACCESS_SIGNATURE as string
        : process.env.REFRESH_SIGNATURE as string
    })
    console.log({payload});
    const user = await userModel.findById({id: payload._id})
    if (!user) {
        throw new InvalidTokenException()
    }
    if (!user.isVerified) {
        throw new InvalidTokenException()
    }
    return user        
}


export const auth = async(req: Request, res: Response , next: NextFunction)=>{
    const data = await decodeToken({
        authorization : req.headers.authorization as string,
        tokenTypes : TokenTypesEnum.ACCESS
    })
    res.locals.user = data
    return next()
}