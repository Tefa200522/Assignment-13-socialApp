import { model, models, Schema } from "mongoose";
import { IUser } from "../../modules/userModule/user.types";



const userSchema = new Schema <IUser>({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required : true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    phone: {
        type : String,
        required : true
    },
    age:{
        type : Number,
        required : true
    },
    covarImage: [String],
    profileImage :String,
    folderId : String,
    isVerified:{
        type: Boolean,
        default: false
    },
     chengedCradentialAt : Date,
      emailotp:{
        otp: String,
        expiredAt : Date
    },

}, {
    timestamps: true
})





export const UserModel = models.user || model <IUser> ('users', userSchema) 