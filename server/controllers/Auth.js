const User = require('../models/User');
const OTP = require('../models/OTP');
const Profile=require('../models/Profile')
const otpGenerator = require('otp-generator')
const mailSender= require('../utils/mailSender')
const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken');
const { response } = require('express');
require('dotenv').config();   

const { passwordUpdated } = require("../mail/templates/passwordUpdate");



// sendOTP
exports.sendOTP = async (req, res) => {
    try {
        // fetch email from request body
        const { email } = req.body;

        // check if user already exists
        const checkUserPresent = await User.findOne({ email });

        // if user already exists then return a response
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered"
            });
        }

        // generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP generated: ", otp);

        // check unique otp or not
        let result = await OTP.findOne({ otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp });
        }

        // store otp in OTP db
        const otpPayload = { email, otp };

        const otpBody = await OTP.create(otpPayload);
        console.log('otpBody: ', otpBody);

        // return successful response
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// signUp

exports.signUp = async (req, res) => {
    try {
        // Fetch data from request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;

        // Data validation
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Match passwords
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password must match",
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already registered. Please log in.",
            });
        }

        // Find the most recent OTP for the user
        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
        if (!recentOtp) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        }

        
        // // Validate the OTP
        // const isOtpValid = await bcrypt.compare(otp, recentOtp.otp);
        // if (!isOtpValid) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Invalid OTP",
        //     });
        // }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create profile
        const profileDetails = await Profile.create({});

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        // Return response
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        console.error("Error during sign-up:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during sign-up. Please try again later.",
        });
    }
};


// login
exports.login = async (req, res) => {
    try {
        // get dat afrom req body
        const {email, password} = req.body;

        // validation of data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }
        // check user exists or not 
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not registered, please signup first",
            })
        }
        // generate jwt, after matching password
        if(await bcrypt.compare(password, user.password)){
            // create jwt
            // create payload
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token= jwt.sign(payload , process.env.JWT_SECRET, {
                expiresIn:"24h"
            });

            user.token= token;
            user.password=undefined;

            // create cookie and send response
            const options={
                expires: new Date(Date.now() +3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in Successfully",
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",
            })
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"login failure, please try again later",
        })
    }
}


//changePassword
exports.changePassword=async(req,res)=>{
 
 
  
    try {
           
          const userDetails = await User.findById(req.user.id);
      //get data from req body
       //get oldPassword,newPassword,confirmNewPassword
          const { oldPassword, newPassword, confirmNewPassword } = req.body;
  
      //Validation
          const isPasswordMatch = await bcrypt.compare(
              oldPassword,
              userDetails.password
          );
          if (!isPasswordMatch) {
          
              return res
                  .status(401)
                  .json({ success: false, message: "The password is incorrect" });
          }
  
  
          if (newPassword !== confirmNewPassword) {
          
              return res.status(400).json({
                  success: false,
                  message: "The password and confirm password does not match",
              });
          }
  
      //Hashing and updating    
          const encryptedPassword = await bcrypt.hash(newPassword, 10);
          const updatedUserDetails = await User.findByIdAndUpdate(
              req.user.id,
              { password: encryptedPassword },
              { new: true }
          );
  
      
      //Send mail
          try {
              const emailResponse = await mailSender(
                  updatedUserDetails.email,
                  passwordUpdated(
                      updatedUserDetails.email,
                      `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                  )
              );
              console.log("Email sent successfully:", emailResponse.response);
          } catch (error) {
              
              console.error("Error occurred while sending email:", error);
              return res.status(500).json({
                  success: false,
                  message: "Error occurred while sending email",
                  error: error.message,
              });
          }
  
          
          return res
              .status(200)
              .json({ success: true, message: "Password updated successfully" });
      } catch (error) {
          
          console.error("Error occurred while updating password:", error);
          return res.status(500).json({
              success: false,
              message: "Error occurred while updating password",
              error: error.message,
          });
      }
  
   
  }
  