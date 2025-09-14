import { createTransport} from "nodemailer";


const  sendMail =async(email,subject,text)=>{
    const transport=createTransport({
        host:"smtp.gmail.com",
        service: "gmail", // network,dns,firewall issue 
        port:465,
        secure:true,
        auth:{
            user:process.env.GMAIL,
            pass:process.env.GPASS,
        },
    })
//send mail
await transport.sendMail({
    from:process.env.GMAIL,
    to:email,
    subject,
    text,
})
};
export default sendMail;