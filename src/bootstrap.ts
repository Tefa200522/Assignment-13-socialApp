import express, {  type NextFunction, type Response, type Request} from "express";
import router from "./modules/routes";
import { IError } from "./utils/errors/types";
import { DBconnection } from "./DB/config/connectDB";
import { SendEmail } from "./utils/email/sendEmail";

const app = express()



const bootstrap = async ()=>{
    const port = process.env.PORT || 5000
    app.use(express.json())
    app.use('/api/v1',router)
    
    await DBconnection()

    app.use((err:IError, req:Request, res:Response, next:NextFunction) =>{
        res.status(err.statusCode || 500).json({
            msg:err.message,
            stack: err.stack,
            status: err.statusCode || 500
        })
    })


    app.listen(port,()=>{
        console.log(`server running on port ${port}`);
        
    })
}


export default bootstrap
