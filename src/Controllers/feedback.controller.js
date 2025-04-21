
const { asyncHandler } = require("../Utils/asyncHandler.js")
const ApiError = require("../Utils/ApiError.js")
const ApiResponse = require("../Utils/Apiresponse.js")
const { Feedback } = require("../Models/feedback.model.js")
const {CourseEnrollment}=require("../Models/Enrollment.model.js")
const { TeacherProfile } = require("../Models/Teacherprofile.model.js")
const { Course } = require("../Models/Course.model.js")


const ProvideFeedback=asyncHandler(async(req,res)=>{
    //we will get the userid from the req object
const{courseId,content,stars}=req.body

// we make logic that if if half duration of the course is gone
// than a user can provide feedback


if(!courseId || !content ||!stars)
{
    throw new ApiError(400,"you must provide content and stars")
}
const enrollmentDetails=await CourseEnrollment.findOne({CourseId:courseId}).populate("CourseId","durationInMonths")

if(!enrollmentDetails){
    throw new ApiError(400,"enrollment does not exist for this course")
}


console.log("the enrollment details are :",enrollmentDetails.CourseId.durationInMonths)
const enrollmentInMs=enrollmentDetails.EnrollmentDate.getTime()

// no of milliseconds in one day is 86400000
const differnceInDays=Math.floor((Date.now()-enrollmentInMs)/86400000)

const courseDuration = enrollmentDetails.CourseId?.durationInMonths;

const requiredDays= courseDuration *15

if (differnceInDays < requiredDays) throw new ApiError(`you can provide feedback after ${requiredDays} days of enrollment`)


        const existingFeedback=await Feedback.findOne({courseId:courseId,userId:req.user?._id})

        if(existingFeedback ) throw new ApiError (400,"feedback already exists")

            const createdFeedback=await Feedback.create({
              userId:req.user?._id,
              CourseId:courseId,
              content:content,
              stars:stars
            })

            if (!createdFeedback ) throw new ApiError(500,"something went wrong while creating feedback")

                //locate the teacher profile and add the feedback there
                const CourseDetails=await Course.findById(courseId)
               const TeacherId=CourseDetails.Instructor

               const TeacherProfileDetails=await TeacherProfile.findOne({user:TeacherId})
               
               if(!TeacherProfileDetails)
               {
                throw new ApiError(400,"teacher profile not found ")
               }

               TeacherProfileDetails.feedback.push(createdFeedback)

              await TeacherProfileDetails.save()

        res.json(
            new ApiResponse(
                201,
                createdFeedback,
                "feedback added successfully"
            )
        )
})


// adding a route for the home page to view feedback


const getFeedback=asyncHandler(async(req,res)=>{

    const limit=3

    const {page}=req.query
    const skip=(page-1)*limit

const publicfeedbacks=await Feedback.find({}).populate("userId","fullname Profilepicture").skip(skip).limit(3)
if(publicfeedbacks.length ==0)
{
    throw new ApiError(500,"no feedbacks to show")
}
return res.json(
    new ApiResponse(
        200,
        publicfeedbacks,
        "fetched feedbacks successfully"
    )
)
})




module.exports={

    ProvideFeedback
}