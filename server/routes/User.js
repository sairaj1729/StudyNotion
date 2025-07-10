const express= require('express');
const router= express.Router();

const {sendOTP, signUp, login, changePassword}= require('../controllers/Auth');
const {resetPassword, resetPasswordToken}= require('../controllers/ResetPassword');
const {auth, isStudent, isAdmin, isInstructor}= require('../middlewares/auth');
const {deleteAccount } = require('../controllers/Profile');

// authentication
router.post('/login', login);
router.post('/signUp', signUp);
router.post('/sendOTP',sendOTP);
router.post('/changePassword',auth, changePassword);

// resetPassword
router.post('/reset-password-token', resetPasswordToken);
router.post('/reset-password', resetPassword);

// profile
router.delete('/deleteProfile', deleteAccount);




module.exports= router;
