import { NextFunction , Request, response, Response } from "express";
import { confirmEmailDto, loginDto, resendOtpDto, SignDto } from "./auth.DTO";
import z, { json, readonly } from 'zod'
import { signupSchema } from "./auth.validation";
import { UserModel } from "../../DB/models/userModel";
import { HUserDocument, IUser } from "../userModule/user.types";
import { HydratedDocument, Model } from "mongoose";
import { ApplicationError, InvalidCredentialsException, InvalidOtpException, InvalidTokenException, NotFoundException, NOTValidOtpException, NotVerifiedException, OtpExpiredException } from "../../utils/errors/types";
import { DBRepo } from "../../DB/DBRepo";
import { UserRepo } from "../../DB/repos/user.repos";
import { compare, hash } from "../../utils/security/hash";
import { successHandler } from "../../utils/successHandler";
import { creatOTP } from "../../utils/email/creatOTP";
import { template } from "../../utils/email/generateHTML";
import { EMAIL_EVENTS_ENUM, emailEmitter } from "../../utils/email/email.events";
import { generateToken } from "../../utils/security/token";
import { promises } from "nodemailer/lib/xoauth2";
import { decodeToken, TokenTypesEnum } from "../../meddileware/auth.meddileware";
import { uploadFile } from "../../utils/multer/s3.servicses";





export class AuthServices {
    private userModel = new UserRepo
    
    signUp = async(req:Request, res:Response, next:NextFunction): Promise <Response> => {

        const{
            firstName,
            lastName,
            email,
            password,
            age,
            phone
        } :SignDto = req.body

        const isEmailExist = await this.userModel.findByEmail ({ email })
        if (isEmailExist) {
            throw new ApplicationError ('email already exist' , 400)
        } 
        const otp = creatOTP()
        const user = await this.userModel.create ({
            doc:{
               firstName,
                lastName,
                email,
                password : await hash(password),
                age :age as number,
                phone :phone as string,
                emailotp : {
                    otp : await hash(otp),
                    expiredAt : new Date (Date.now() + 30 * 1000)
                }
            }
        })

        const html = template({
            code: otp,
            name: `${firstName} ${lastName}`,
            subject: 'verify your email'
        })

        emailEmitter.publish(EMAIL_EVENTS_ENUM.VERIFY_EMAIL,{
            to: email,
            subject : 'verify your email',
            html
        })



        return successHandler({res , data: user})
    }

    confirmEmail = async(req:Request, res:Response, next:NextFunction): Promise <Response> => {
        const {
            email,
            otp
        }:confirmEmailDto = req.body

        const user = await this.userModel.findByEmail({email})
        if (!user) {
            throw new NotFoundException('email not found')
        }

        if (user.isVerified) {
            throw new ApplicationError('email alread verified', 400)
        }
        if (!user.emailotp.otp) {
            throw new ApplicationError('otp not found',400)
        }
        const isExpired = user.emailotp.expiredAt <= new Date(Date.now())
        if (isExpired) {
            throw new OtpExpiredException()
        }
        const isValidOtp = await compare(otp, user.emailotp.otp)
        if (!isValidOtp) {
            throw new NOTValidOtpException()
        }

        await user.updateOne({
            $unset:{
                emailotp: ""
            },
            isVerified : true
        })

        return successHandler ({res})
    }
    resendOtp = async(req:Request, res:Response, next:NextFunction):Promise <Response> =>{
        const{
            email
        }:resendOtpDto = req.body

        const user = await this.userModel.findByEmail({email})
        if (!user) {
            throw new NotFoundException('email not found')
        }

        if (user.isVerified) {
            throw new ApplicationError('email alread verified', 400)
        }

        const isExpired = user.emailotp.expiredAt <= new Date(Date.now())
        if (!isExpired) {
            throw new ApplicationError('otp not expired', 400)
        }
        const otp = creatOTP()
        const html = template({
            code: otp,
            name: `${user.firstName} ${user.lastName}`,
            subject: 'verify your email'
        })

        emailEmitter.publish(EMAIL_EVENTS_ENUM.VERIFY_EMAIL,{
            to: email,
            subject : 'verify your email',
            html
        })
        await user.updateOne({
            $set:{
                emailotp: {
                    otp : await hash (otp),
                    expiredAt : new Date(Date.now() + 30 * 1000)
                }
            }
        })

        return successHandler({res})
    }
    login = async (req: Request, res: Response , next: NextFunction):Promise <Response> =>{
        const {
            email,
            password
        }:loginDto = req.body
        const user = await this.userModel.findByEmail({email})
        if (!user) {
            throw new InvalidCredentialsException()
        }
        const invalidPassword = await compare(password , user.password)
        if (!invalidPassword) {
            throw new InvalidCredentialsException()
        }

        const accessToken = generateToken({
            payload:{
                _id:user._id
            },
            signature: process.env.ACCESS_SIGNATURE as string,
            option:{
                expiresIn : '1 H'
            }
        })

        const refreshToken = generateToken({
            payload:{
                _id:user._id
            },
            signature: process.env.REFRESH_SIGNATURE as string,
            option:{
                expiresIn : '7 D'
            }
        })


        return successHandler ({ res, data: {
            accessToken,
            refreshToken
        }})
    }

    refreshToken = async (req: Request ,res: Response , next: NextFunction):Promise <Response> =>{
        const {
            authorization
            } = req.headers
            
        const user = await decodeToken ({authorization:authorization as string , tokenTypes: TokenTypesEnum.REFRESH}) 
        const accessToken = generateToken({
            payload :{
                _id : user._id
            },
            signature: process.env.ACCESS_SIGNATURE as string,
            option:{
                expiresIn : '1 H'
            }
        })   



        


        return successHandler ({res , data:{
            accessToken
        }})
    }

    me = async (req: Request, res: Response) =>{
        const user: HUserDocument= res.locals.user
        user.firstName = user.firstName 
        
        await user.save()
       return successHandler({res, data:user})
    }

    forgetPassword = async (req: Request, res: Response) =>{
        const {email} = req.body
        const user = await this.userModel.findByEmail({email})

        if (!user) {
            throw new NotFoundException("not found email")
        }
        if (!user.isVerified) {
            throw new NotVerifiedException()
        }
        const otp = creatOTP()
        const subject = "Forget Password"
        const html = template({
            code: otp,
            name : `${user.firstName} ${user.lastName}`,
            subject
        })
        emailEmitter.publish(EMAIL_EVENTS_ENUM.RESET_PASSWORD,{
            to : email,
            subject,
            html
        })

        await user.updateOne({
            passwordotp:{
                otp : await hash (otp),
                expiredAt : new Date(Date.now() + 300* 1000)
            }
        })
        return successHandler ({res, message: "check your email"})
    }

    resetForgettenPassword = async (req: Request, res: Response) =>{
        const {
            email,
            otp,
            password
        } = req.body
        const user = await this.userModel.findByEmail({email})

        if (!user) {
            throw new NotFoundException('email not found')
        }

        if (!user.isVerified) {
            throw new NotVerifiedException()
        }

        const isExpired = user.passwordotp.expiredAt < new Date(Date.now())

        if (isExpired) {
            throw new OtpExpiredException()
        }

        const isValidOtp = await compare(otp, user.passwordotp.otp)

        if (!isValidOtp) {
            throw new InvalidOtpException()
        }

        const hashPassword = await hash(password)
        await user.updateOne({
            password : hashPassword,
            $unset:{
                passwordotp : "1"
            }
        })


        return successHandler ({res})
    }


    profileImage = async (req: Request,res:Response) =>{
        const file = req.file as Express.Multer.File
        const user = res.locals.user as HUserDocument
        const path = await uploadFile({
            file,
            path : `${user._id}/profileImage`
        })
        user.profileImage = path as string 
        await user.save()
        return successHandler ({ res })
    }


}