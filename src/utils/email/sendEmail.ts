import nodemalier from "nodemailer";


export const SendEmail = ({to , subject, html}: {
    to : string,
    subject : string,
    html : string
}) =>{  
    const transportOptions = {
    host: process.env.HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    service : "gmail",
    auth: {
            user: process.env.USER,
            pass: process.env.PASS
        },
        tls:{
            rejectUnauthorized : false
        }
    }
    const transport = nodemalier.createTransport(transportOptions)

    const main = async ()=>{
        const info = await transport.sendMail({
            from:`Social App <${process.env.USER}>`,
            to,
            subject,
            html

        })        
    }
main().catch((err) =>{
    console.log({err});
    
}) 
}