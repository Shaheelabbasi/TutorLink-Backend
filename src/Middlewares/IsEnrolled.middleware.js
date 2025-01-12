const { asyncHandler } = require("../Utils/asyncHandler.js")
const ApiError = require("../Utils/ApiError.js")
const ApiResponse = require("../Utils/Apiresponse.js")
const {CourseEnrollment}=require("../Models/Enrollment.model.js")
const { Course } = require("../Models/Course.model.js")
const { User } = require("../Models/User.model.js")



const IsStudentEnrolled=asyncHandler(async(req,res,next)=>{

    
    const {courseId}=req.body;
console.log("cousre id is ",courseId)
    const enrollmentStatus=await CourseEnrollment.findOne({
        StudentId:req.user?._id,
        CourseId:courseId,
        status:"active"
    })

    if(!enrollmentStatus)
    {
        throw new ApiError(400,"only enrolled students can access this route")
    }
    next();
})

module.exports={
    IsStudentEnrolled
}