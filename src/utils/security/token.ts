import jwt, { JwtPayload } from 'jsonwebtoken'

export const generateToken = ({
    payload = {},
    signature ,
    option = {}
}:{
    payload : any,
    signature : string,
    option? : jwt.SignOptions
}) => {
    return jwt.sign(payload,signature,option)
}

export const verifyToken =({
    token,
    signature
}:{
    token : string,
    signature :string
}) : JwtPayload =>{
    const payload = jwt.verify(token , signature) as JwtPayload
    return payload
}