const { LiveSessionRequest } = require("../Models/Livesessionrequest.model")
const { asyncHandler } = require("../Utils/asyncHandler.js")
const ApiError = require("../Utils/ApiError.js")
const ApiResponse = require("../Utils/Apiresponse.js")
const { Course } = require("../Models/Course.model.js")

const { SendNotificationEmail } = require("../Utils/NotifyEmail.js")
const { GenerateLiveSessionRequestEmailText, GenerateLiveSessionRequestStatusEmail, GenerateTeacherSessionNotificationEmail, GenerateStudentNotificationEmail } = require("../Utils/NotifyEmaildata.js")
const { ScheduleMeeting } = require("../Utils/zoom.js")
const { LiveSession } = require("../Models/Livesession.model.js")
const { getEnrolledStudents } = require("../Controllers/Enrollment.controller.js")

//for student to request a live session
const RequestLiveSession = asyncHandler(async (req, res, next) => {
    //enrolled course id would be stored on frontend and included in each request
    const { courseId, requestedDate, requestedTime, topic } = req.body;

    console.log("req.body here is ",req.body)
    if (!courseId || !requestedDate || !requestedTime || !topic) {
        throw new ApiError(400, "All fields are required")
    }


    const ExistingRequest = await LiveSessionRequest.findOne({
        studentId: req.user._id
    })

    if (ExistingRequest?.status == "Pending") {
        throw new ApiError(400, "An existing request is pending")
    }


    const sessionRequest = await LiveSessionRequest.create({
        studentId: req.user._id,
        courseId,
        requestedDate,
        requestedTime,
        topic,
    });

    if (!sessionRequest) {
        throw new ApiError(500, "something went wrong while submitting the request")
    }

    // findig the details for the course

    const courseDetails = await Course.findById(courseId).populate("Instructor", "username email")
    //notify the instructor that a live session request has received

    const { courseTitle } = courseDetails
    //Instructor username and email
    const { username: Instructorname, email: Instructoremail } = courseDetails.Instructor
    //student details since this route can only be accessed by students so we use req.user
    const { username: studentName } = req.user
    const emailtext = GenerateLiveSessionRequestEmailText(Instructorname, studentName, courseTitle, topic, requestedDate, requestedTime)

    const IsNotified = SendNotificationEmail(Instructoremail, "Live Session Request", emailtext)

    if (!IsNotified) {
        throw new ApiError(500, "something went wrong while sending email")
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
const ViewLiveSessionRequests = asyncHandler(async (req, res) => {
    //do it by coursetitle
    const { courseId } = req.query


    const livesessionrequests = await LiveSessionRequest.find({
        courseId: courseId
    }).populate("studentId", "username email")
        .populate("courseId", "courseTitle")


    if (!livesessionrequests) {
        throw new ApiError(400, "no requests for this course")
    }

    res.json(
        new ApiResponse(
            200,
            livesessionrequests,
            "fetched livesession requests successfully"
        )
    )

})

const UpdateRequestStatus = asyncHandler(async (req, res) => {


    const { requestId, status } = req.body
  
    console.log("status recievd here is ",status)


    if (!status || !requestId) {
        throw new ApiError(400, "status and requestId are required")
    }
    const deepPopulateQuery = {
        path: "courseId",
        populate: {
            path: "Instructor",
            select: "fullname email"
        },
        select: "courseTitle"
    }

    const ValidRequest = await LiveSessionRequest.findById(requestId).populate("studentId", "fullname email").populate(deepPopulateQuery)

    // console.log("The valid request is ",ValidRequest)
    //here we need to get the list of all the students enrolled for a particular course
    //we will have to notify every student even if a single request is accepted
    const { email: studentemail, fullname: studentname } = ValidRequest.studentId

    //get the cousre details

    const { courseTitle } = ValidRequest.courseId
    const { email: Instructoremail, fullname: Instructorname } = ValidRequest.courseId.Instructor
    const { requestedDate: scheduledDate, requestedTime: scheduledTime, topic } = ValidRequest

    console.log("requested time here is ",scheduledTime)
    if (status.toLowerCase() == "approved") {

        ValidRequest.status = "Approved"
        await ValidRequest.save({ new: true })

        const MeetingResponse = await ScheduleMeeting(topic, scheduledTime, scheduledDate)
        const { join_url, start_url, password } = MeetingResponse
        //now create a live session on this meeting link 
        const createdliveSession = await LiveSession.create({
            courseId: ValidRequest.courseId._id,
            topic: topic,
            scheduledDate,
            scheduledTime,
            join_url,
            start_url
        })

        if (!createdliveSession) {
            throw new ApiError(500, "something went wrong while scheduling the live session")
        }
        //binding the request with the live session
        ValidRequest.liveSession=createdliveSession._id
        await ValidRequest.save({new :true})
        const enrolledStudents = await getEnrolledStudents(ValidRequest.courseId)
        //send scheduling notifications to all the students
        enrolledStudents.map((enrolled) => {
    
            const emailtext = GenerateLiveSessionRequestStatusEmail(status,enrolled.fullname, courseTitle, topic, scheduledDate, scheduledTime, join_url)
            const Isnotified = SendNotificationEmail(enrolled.email, "live Session Request Update", emailtext)
            if (!Isnotified) {
                throw new ApiError(500, "something went wrong while sending email notifications")
            }
        })
        //now notify the teacher as well
        const emailtext = GenerateTeacherSessionNotificationEmail(Instructorname, courseTitle, topic, scheduledDate, scheduledTime, start_url)
    
        const IsTeacherNotified = SendNotificationEmail(Instructoremail, "Scheduled Live Session ", emailtext)
        if (!IsTeacherNotified) {
            throw new ApiError(500, "something went wrong while sending email notifications")
        }
      return res.json(
        new ApiResponse(201,
            createdliveSession,
            "live session created successfully"
        )
      )
    }
    if (status.toLowerCase() == "rejected") {
        //handle the request rejecetion scenario
        ValidRequest.status = "Rejected"
        await ValidRequest.save({ new: true })
        const rejectionemailtext = GenerateLiveSessionRequestStatusEmail(status, studentname, courseTitle)
        //in case of rejection we only notify the student who sent the request 
        const Isnotified = SendNotificationEmail(studentemail, "Live Session Request Update", rejectionemailtext)

        if (!Isnotified) {
            throw new ApiError(500, "something went wrong while sending email notification")
        }
        res.json(
            new ApiResponse(
                200,
                ValidRequest,
                "updated request status successfully",
    
            )
        )
    
    }

})


const ViewScheduledLiveSessions = asyncHandler(async (req, res) => {

    const  courseId  = req.query.courseId
    const scheduledSessions = await LiveSession.find({
        courseId: courseId
    })

    if (scheduledSessions.length==0) {
        throw new ApiError(400, "No live sessions scheduled")
    }


    res.json(
        new ApiResponse(
            200,
            scheduledSessions,
            "successfully fetched live sessions"
        )
    )
})



const scheduleLiveSession = asyncHandler(async (req, res) => {

    console.log("i ahve been called")
    console.log(" body heer is ",req.body)
    const {
        courseId,
        topic,
        scheduledDate,
        scheduledTime
    } = req.body
    if (!courseId || !topic || !scheduledDate || !scheduledTime) {
        throw new ApiError(400, "Topic date and time are required")
    }
    // check for the course validity

    const IsCourseValid = await Course.findById(courseId).populate("Instructor", "fullname email")

    const { email: Instructoremail, fullname: Instructorname } = IsCourseValid.Instructor
    // check for existing live session
    const existingSession = await LiveSession.findOne({
        courseId,
        scheduledDate,
        scheduledTime
    })

    if (existingSession) {
        throw new ApiError(400, "Live session already scheduled on this time")
    }


    //call the zoom api
    const MeetingResponse = await ScheduleMeeting(topic, scheduledTime, scheduledDate)
    const { join_url, start_url } = MeetingResponse

    const scheduledSession = await LiveSession.create({
        courseId: courseId,
        topic,
        scheduledDate,
        scheduledTime,
        join_url,
        start_url

    })
    if (!scheduledSession) {
        throw new ApiError(500, "something wentt wrong while scheduling the session")
    }

    //notify the teacher as well as the student
    const enrolledStudents = await getEnrolledStudents(courseId)
    //send scheduling notifications to all the students
    enrolledStudents.map((enrolled) => {

        const emailtext = GenerateStudentNotificationEmail(enrolled.fullname, IsCourseValid.courseTitle, topic, scheduledDate, scheduledTime, join_url)

        const Isnotified = SendNotificationEmail(enrolled.email, "Scheduled Live Session ", emailtext)
        if (!Isnotified) {
            throw new ApiError(500, "something went wrong while sending email notifications")
        }
    })
    //now notify the teacher as well
    const emailtext = GenerateTeacherSessionNotificationEmail(Instructorname, IsCourseValid.courseTitle, topic, scheduledDate, scheduledTime, start_url)

    const IsTeacherNotified = SendNotificationEmail(Instructoremail, "Scheduled Live Session ", emailtext)
    if (!IsTeacherNotified) {
        throw new ApiError(500, "something went wrong while sending email notifications")
    }


    res.json(
        new ApiResponse(
            201,
            scheduledSession,
            "scheduled session successfully"
        ))
})

// for the students to view the live session request they sent


const ViewSentRequests=asyncHandler(async(req,res)=>{

    const {studentid}=req.query

    const requestdetails=await LiveSessionRequest.find({
         studentId:studentid
    }).populate("liveSession","join_url")

    if(requestdetails.length==0)
    {
        throw new ApiError(404,"no session requests yet")
    }

    return res.json(
        new ApiResponse(
            200,
            requestdetails,
            "fetched requests successfully"
        )
    )
})

module.exports = {
    RequestLiveSession,
    ViewLiveSessionRequests,
    UpdateRequestStatus,
    ViewScheduledLiveSessions,
    scheduleLiveSession,
    ViewSentRequests
}
