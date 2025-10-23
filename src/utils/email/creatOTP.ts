import { customAlphabet } from "nanoid";



export const creatOTP = () =>{
    const otp = customAlphabet ('0123456789')(6)
    return otp
}