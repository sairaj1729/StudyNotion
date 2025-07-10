const RatingAndReview = require('../models/RatingAndReview')
const User = require('../models/User')
const Course = require('../models/Course');
const mongoose = require('mongoose');


// createRating handler 

exports.createRating = async (req, res) => {
    try {
        // get userId
        const userId = req.user.id;
        // get data
        const { rating, review, courseId } = req.body;

        console.log(userId, rating, review, courseId);
        // check if user is enrolled or not
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $in: [userId] }
          });
        const course= await Course.findById(courseId);
        console.log("course: ,",course)
        console.log("course datails : ",courseDetails)
        // validation
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: "Student is not enrolled in Course"
            })
        }
        // check if user already reviewed the course 
        const alreadyReviewed = await RatingAndReview.findOne(
            {
                user: userId,
                course: courseId
            },
        )
        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: "Course is already reviewed by user"
            })
        }
        // create rating/review
        const ratingAndReview = await RatingAndReview.create({
            rating, review,
            course: courseId,
            user: userId,
        })
        // update course with this rating/review
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            { _id: courseId },
            {
                $push: {
                    ratingAndReviews: ratingAndReview._id,
                }
            },
            { new: true }
        )
        console.log(updatedCourseDetails);
        // retrurn response
        return res.status(200).json({
            success: true,
            message: "Reviewed successfully",
            ratingAndReview
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}



// getAverageRatings
exports.getAverageRating = async (req, res) => {
    try {
        // get course id
        const courseId = req.body.courseId;

        // calculate average rating

        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId)
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" }
                }
            }
        ])

        // return rating
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }
        // if no reviews exists
        return res.status(200).json({
            success: true,
            message: "Average ratings is 0, no ratings given till now",
            averageRating: 0,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// getAllratings handler

exports.getAllRating = async (req, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
            .populate({
                path: "user",
                select: "firstName lastName email image"
            })
            .populate({
                path: "course",
                select: "courseName"
            })
            .exec();
        // return response
        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}