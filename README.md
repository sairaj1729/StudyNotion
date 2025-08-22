StudyNotion – Ed-Tech Platform (MERN)

StudyNotion is a fully functional ed-tech platform that enables users to create, consume, and rate educational content. The platform is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and aims to provide:

🎓 A seamless and interactive learning experience for students, making education more accessible and engaging.

👨‍🏫 A platform for instructors to showcase their expertise and connect with learners across the globe.

Live Demo: https://study-notion-rosy-five.vercel.app/

📐 System Architecture

The platform follows a client-server architecture, consisting of:

Frontend (React.js + Redux + Tailwind) – Provides user interface and communicates with backend via RESTful APIs.

Backend (Node.js + Express.js) – Handles authentication, course management, media handling, and payment logic.

Database (MongoDB + Mongoose) – Stores courses, users, and platform data.

🎨 Frontend

Built using React.js, Redux, and Tailwind CSS.

Features

For Students:

Homepage, Course List, Wishlist

Cart & Checkout (Razorpay integration)

Course Content (videos, materials)

Profile & account management

For Instructors:

Dashboard & Insights

Course Management (CRUD)

Profile management

For Admin (future scope):

Platform-wide Dashboard & Insights

Instructor & Course Management

User Management

⚙️ Backend

Backend built with Node.js and Express.js, using a monolithic architecture.

Features

User authentication & authorization (JWT, OTP, bcrypt, forgot password)

Course management (create, update, delete, view)

Payments with Razorpay

Media handling with Cloudinary

Content stored in Markdown format for flexibility

Tools & Libraries

Node.js, Express.js

MongoDB + Mongoose

JWT, bcrypt

Cloudinary

Razorpay

🗄️ Database Schema

Student Schema: name, email, password, enrolled courses

Instructor Schema: name, email, password, created courses

Course Schema: title, description, instructor, content (videos, documents), ratings

🔌 API Design

REST API with JSON data exchange.

Sample Endpoints

Auth

POST /api/auth/signup → Register new user

POST /api/auth/login → Login & get JWT

POST /api/auth/verify-otp → Verify OTP

POST /api/auth/forgot-password → Reset password

Courses

GET /api/courses → Get all courses

GET /api/courses/:id → Get course by ID

POST /api/courses → Create new course

PUT /api/courses/:id → Update course

DELETE /api/courses/:id → Delete course

POST /api/courses/:id/rate → Rate a course

🚀 Deployment

Frontend → Vercel (current)

Backend → Render / Railway / Heroku

Database → MongoDB Atlas

Media → Cloudinary

Payments → Razorpay
