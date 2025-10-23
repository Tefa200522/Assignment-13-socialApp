import { NextFunction , Request, Response } from "express";
import { confirmEmailDto, SignDto } from "./auth.DTO";
import z, { json, readonly } from 'zod'
import { signupSchema } from "./auth.validation";
import { UserModel } from "../../DB/models/userModel";
import { IUser } from "../userModule/user.types";
import { Model } from "mongoose";
import { ApplicationError, NotFoundException, NOTValidOtpException, OtpExpiredException } from "../../utils/errors/types";
import { DBRepo } from "../../DB/DBRepo";
import { UserRepo } from "../../DB/repos/user.repos";
import { hash } from "../../utils/security/hash";
import { successHandler } from "../../utils/successHandler";
import { creatOTP } from "../../utils/email/creatOTP";
import { template } from "../../utils/email/generateHTML";
import { EMAIL_EVENTS_ENUM, emailEmitter } from "../../utils/email/email.events";
import { compare } from "bcrypt";





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
}