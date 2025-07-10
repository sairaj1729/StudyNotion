const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailVerificationTemplate = require('../mail/templates/emailVerificationTemplate')

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,  
        required:true,
    },
    otp: {
        type: String,
        required:true,
    },
    createdAt: {
        type: Date,
        default:()=> Date.now(),
        expires: 5*60,
    },
});

// function to send mail

async function sendVerificationEmail(email, otp) {
    try {
        const mailResponce= await mailSender(email, "Verification email From studynotion" , emailVerificationTemplate(otp));
        console.log("Email send successfully: ", mailResponce);
    } catch (error) {
        console.log("Error occured while sending otp mail: ",error);
        throw error; 
    }   
}

OTPSchema.pre("save" , async function(next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", OTPSchema);