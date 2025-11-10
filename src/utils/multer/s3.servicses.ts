import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3"
import { StoreInEnum } from "./multer"
import { createReadStream } from "fs";
import path from "path";
import { s3 } from "./s3.config";



export const uploadFile = async ({
    storeIn = StoreInEnum.memory,
    Bucket = process.env.BUCKET_NAME,
    ACL = 'private',
    path = "general",
    file 
}:{
    storeIn? : StoreInEnum,
    Bucket?: string,
    ACL?: ObjectCannedACL,
    path?:string,
    file: Express.Multer.File
}) =>{


    const command = new PutObjectCommand ({
        Bucket ,
        ACL,
        Key :`${process.env.APPLICATION_NAME}/${path}/${file.originalname}`,
        Body:
            storeIn == StoreInEnum.memory ? file.buffer : createReadStream(file.path), 
        ContentType : file.mimetype
    })


    await s3().send(command)
    return command.input.Key
}