const express= require('express');
const app= express();

const userRouts= require('./routes/User');
const courseRouts= require('./routes/Course');
const profileRouts= require('./routes/Profile');
const PaymentRouts= require('./routes/Payments');
const ContactRouts= require('./routes/Contact')

const database= require('./config/database');
const cookieParser = require('cookie-parser'); 
const cors= require('cors');

const {cloudinaryConnect} = require('./config/cloudinary');
const fileUpload= require('express-fileupload');

const dotenv= require('dotenv');
dotenv.config();

const PORT= process.env.PORT || 4000;

// database
database.connect();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:3000", "https://study-notion-rosy-five.vercel.app"],
        credentials:true,
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir: "/tmp"
    })
)

// cloudinary connect
cloudinaryConnect();

// mount route
app.use("/api/v1/auth", userRouts);
app.use("/api/v1/profile", profileRouts);
app.use("/api/v1/course", courseRouts);
app.use("/api/v1/payment", PaymentRouts);
app.use("/api/v1/reach", ContactRouts)

// default route
app.get('/', (req,res)=>{
    return res.json({
        success:true,
        message: "Your server is up and running.."
    })
})


app.listen(PORT, ()=>{
    console.log(`App is running at ${PORT}`);
})


