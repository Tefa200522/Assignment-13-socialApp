
export interface IError extends Error {
    statusCode: number
}



export class ApplicationError extends Error {
    constructor(msg : string ,public statusCode : number , options: ErrorOptions = {}){
        super(msg , options)
    }
}


export class NotFoundException extends ApplicationError{
    constructor(msg:string ="not found"){
        super(msg , 404)
    }
}


export class OtpExpiredException extends ApplicationError{
    constructor(msg:string ="otp Expired"){
        super(msg , 404)
    }
}


export class NOTValidOtpException extends ApplicationError{
    constructor(msg:string ="not valid otp"){
        super(msg , 404)
    }
}

export class InvalidCredentialsException extends ApplicationError{
    constructor(msg:string = "invalid credentials"){
        super(msg , 400)
    }
}


export class InvalidTokenException extends ApplicationError{
    constructor(msg:string = "invalid token exception"){
        super(msg , 400)
    }
}


export class NotVerifiedException extends ApplicationError{
    constructor(msg:string = "verified email exception"){
        super(msg , 400)
    }
}

export class InvalidOtpException extends ApplicationError{
    constructor(msg:string = "invalid otp exception"){
        super(msg , 400)
    }
}