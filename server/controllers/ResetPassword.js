const { generate } = require("otp-generator");
const User = require("../models/User");
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');


// resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try {
        // get email from req body
        const email = req.body.email;

        // check user exists,email validation
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User with this email is not registered"
            })
        }

        // generate token
        const token = crypto.randomUUID();

        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            },
            { new: true });

        // create url
        const url = `http://localhost:3000/update-password/${token}`;

        // send email containing the url
        await mailSender(email,
            "Password Reset Link",
            `Your password reset link: ${url}`
        )
        // return response
        return res.status(200).json({
            success: true,
            message: "password reset email send successfully,please check email"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while reseting password, please try again later"
        })
    }

}

// resetPassword

exports.resetPassword = async (req, res) => {
    try {
        // fetch data
        const { password, confirmPassword, token } = req.body;
        
        // validation
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "password and confirm password should be same"
            })

        }
        // get userDetails from db using token
        const userDetails = await User.findOne({ token });
    

        // if no entry - invalid token
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Invalid Token"
            })
        }
        // token expiry check
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Token is expired, please regenerate reset-token"
            })
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // update password
        await User.findOneAndUpdate({token:token},
            {password:hashedPassword},
            {new:true},
        );
        // return response
        return res.status(200).json({
            success:true,
            message:"Password reset successful"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error while reseting password"
        })
    }
}