const nodemailer= require('nodemailer');
require('dotenv').config();

const mailSender = async (email , title, body)=>{
    try {
        let tranporter= nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })

        let info= await tranporter.sendMail({
            from: 'StudyNotion || by Sairaj',
            to: `${email}`,
            subject: `${title}`,
            html : `${body}`,
        
        })

        console.log(info);
        return info;
    } catch (error) {
        console.log(error.message)
    }
}

module.exports=mailSender;