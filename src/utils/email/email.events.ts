import {EventEmitter} from "events";
import { SendEmail } from "./sendEmail";

export enum EMAIL_EVENTS_ENUM{
    VERIFY_EMAIL = 'VERIFY_EMAIL',
    RESET_EMAIL = 'RESET_EMAIL'
}

export class EmailEevents {
    constructor(private readonly emitter: EventEmitter ){}
    subscribe = (event : EMAIL_EVENTS_ENUM , callback : (payload :any) => void) =>{
        this.emitter.on(event,callback)
    }

    publish = (event : EMAIL_EVENTS_ENUM , payload:any) =>{
        this.emitter.emit(event , payload)
    }
}

const emitter = new EventEmitter()
export const emailEmitter = new EmailEevents(emitter)

emailEmitter.subscribe(EMAIL_EVENTS_ENUM.VERIFY_EMAIL,({to,subject,html}:{to:string,subject:string,html:string}) => {
    SendEmail({to,subject,html})
})