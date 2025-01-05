const {LiveSessionRequest}=require("../Models/Livesessionrequest.model")
const { asyncHandler } = require("../Utils/asyncHandler.js")
const ApiError = require("../Utils/ApiError.js")
const ApiResponse = require("../Utils/Apiresponse.js")
const { Course } = require("../Models/Course.model.js")

const {SendNotificationEmail}=require("../Utils/NotifyEmail.js")
const { GenerateLiveSessionRequestEmailText,GenerateLiveSessionRequestStatusEmail,GenerateTeacherSessionNotificationEmail } = require("../Utils/NotifyEmaildata.js")
const {ScheduleMeeting}=require("../Utils/zoom.js")
const { LiveSession } = require("../Models/Livesession.model.js")

//for student to request a live session
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

const IsNotified= SendNotificationEmail(Instructoremail,"Live Session Request",emailtext)

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

//for teacher to view the livesession requests for all courses
const ViewLiveSessionRequests=asyncHandler(async(req,res)=>{
    //do it by coursetitle
const{courseId}=req.query


const livesessionrequests=await LiveSessionRequest.find({
   courseId:courseId
}).populate("studentId","username email")
.populate("courseId","courseTitle")


if(!livesessionrequests)
{
    throw new ApiError(400,"no requests for this course")
}

res.json(
    new ApiResponse(
        200,
        livesessionrequests,
        "fetched livesession requests successfully"
    )
)

})

const UpdateRequestStatus=asyncHandler(async(req,res)=>{


    const{requestId,status}=req.body


    if(!status || !requestId)
    {
  throw new ApiError(400,"status and requestId are required")
    }
    const deepPopulateQuery={
         path:"courseId",
        populate:{
            path:"Instructor",
            select:"username email"
        },
        select:"courseTitle"
    }

    const ValidRequest=await LiveSessionRequest.findById(requestId).populate("studentId","username email").populate(deepPopulateQuery)

   // console.log("The valid request is ",ValidRequest)
const {email:studentemail,username:studentname}=ValidRequest.studentId

//get the cousre details

const {courseTitle}=ValidRequest.courseId
const{email:Instructoremail,username:Instructorname}=ValidRequest.courseId.Instructor
const {requestedDate:scheduledDate,requestedTime:scheduledTime,topic}=ValidRequest

    if(status.toLowerCase() == "approved")
    {

        ValidRequest.status="Approved"
        await ValidRequest.save({new:true})
       
      const MeetingResponse=await ScheduleMeeting(topic,scheduledTime,scheduledDate)
      const{join_url,start_url,password}=MeetingResponse
     //now create a live session on this meeting link 
    const createdliveSession=await LiveSession.create({
        courseId:ValidRequest._id,
        topic:topic,
        scheduledDate,
        scheduledTime,
        join_url,
        start_url
    })

    if(!createdliveSession)
    {
        throw new ApiError(500,"something went wrong while scheduling the live session")
    }
  
        // now sending the email notification for the student
        const emailTextForStudent=GenerateLiveSessionRequestStatusEmail(status,studentname,courseTitle,topic,scheduledDate,scheduledTime,join_url)
        const emailTextForTeacher=GenerateTeacherSessionNotificationEmail(Instructorname,scheduledDate,scheduledTime,start_url)
        const IsStudentnotified=SendNotificationEmail('yomoma4149@gholar.com',"Live Session Request Update",emailTextForStudent)  //for studnet
        const IsTeacherNotified=SendNotificationEmail('shaheelabbasi456@gmail.com',"Scheduled Live Session",emailTextForTeacher) // for teacher
        // know schedule the liveseesion and genearte a meeting link for that time 
        if(!IsStudentnotified || !IsTeacherNotified)
        {
            throw new ApiError(500,"something went wrong while sending email notifications")
        }


    }
    if(status.toLowerCase() == "rejected")
        {
         //handle the request rejecetion scenario
            ValidRequest.status="Rejected"
            await ValidRequest.save({new:true})
           const rejectionemailtext=GenerateLiveSessionRequestStatusEmail(status,studentname,courseTitle)
           const Isnotified=SendNotificationEmail(studentemail,"Live Session Request Update",rejectionemailtext)
        
        if(!Isnotified)
        {
            throw new ApiError(500,"something went wrong while sending email notification")
        }
         
           
        }

    res.json(
        new ApiResponse(
            200,
            ValidRequest,
            "updated request status successfully",

        )
    )


})


module.exports={
    RequestLiveSession,
    ViewLiveSessionRequests,
    UpdateRequestStatus

}
