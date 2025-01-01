const {LiveSessionRequest}=require("../Models/Livesessionrequest.model")
const { asyncHandler } = require("../Utils/asyncHandler.js")
const ApiError = require("../Utils/ApiError.js")
const ApiResponse = require("../Utils/Apiresponse.js")
const { Course } = require("../Models/Course.model.js")

const {SendNotificationEmail}=require("../Utils/NotifyEmail.js")
const { GenerateLiveSessionRequestEmailText } = require("../Utils/NotifyEmaildata.js")


const RequestLiveSession=asyncHandler(async(req,res,next)=>{
//enrolled course id would be stored on frontend and included in each request
const { courseId, requestedDate, requestedTime, topic } = req.body;

if (!courseId || !requestedDate || !requestedTime || !topic) {
    throw new ApiError(400,"All fields are required")
}


const ExistingRequest=await LiveSessionRequest.findOne({
      studentId:req.user._id
})

if(ExistingRequest?.status =="Pending")
{
    throw new ApiError(400,"An existing request is pending")
}


const sessionRequest = await LiveSessionRequest.create({
    studentId: req.user._id,
    courseId,
    requestedDate,
    requestedTime,
    topic,
});

if(!sessionRequest)
{
    throw new ApiError(500,"something went wrong while submitting the request")
}

// findig the details for the course

const courseDetails=await Course.findById(courseId).populate("Instructor","username email")
//notify the instructor that a live session request has received

const {courseTitle}=courseDetails
//Instructor username and email
const {username:Instructorname,email:Instructoremail}=courseDetails.Instructor
//student details since this route can only be accessed by students so we use req.user
const {username:studentName}=req.user
const emailtext=GenerateLiveSessionRequestEmailText(Instructorname,studentName,courseTitle,topic,requestedDate,requestedTime)

const IsNotified= SendNotificationEmail('yomoma4149@gholar.com',"Live Session Request",emailtext)

if(!IsNotified)
{
    throw new ApiError(500,"something went wrong while sending email")
}
res.json(
    new ApiResponse(
        200,
        sessionRequest,
        "request sent successfully"
    )
)

})


const ViewLiveSessionRequests=asyncHandler(async(req,res)=>{


})

module.exports={
    RequestLiveSession,
    ViewLiveSessionRequests

}
