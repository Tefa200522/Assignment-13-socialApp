


export interface IUser {
    firstName: string
    lastName: string
    email: string
    password: string
    age: number
    phone : string
    covarImage: string[] 
    profileImage : string
    folderId : string
    isVerified : boolean
    chengedCradentialAt : Date
    emailotp:{
        otp: string
        expiredAt : Date
    }
}