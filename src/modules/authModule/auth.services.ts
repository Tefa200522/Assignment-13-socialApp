import { NextFunction , Request, Response } from "express";
import { SignDto } from "./auth.DTO";
import z, { json, readonly } from 'zod'
import { signupSchema } from "./auth.validation";
import { UserModel } from "../../DB/models/userModel";
import { IUser } from "../userModule/user.types";
import { Model } from "mongoose";
import { ApplicationError } from "../../utils/errors/types";






export class AuthServices {
    private readonly userModel: Model <IUser> = UserModel
    
    signUp = async(req:Request, res:Response, next:NextFunction): Promise <Response> => {
        const{
            name,
            email,
            password
        } :SignDto = req.body

        const isEmailExist = await this.userModel.findOne ({ email })
        if (isEmailExist) {
            throw new ApplicationError ('email already exist' , 400)
        } 
        const user = await this.userModel.create({
            name,
            email,
            password
        })

        return res.json({
         user
        })
    }
}