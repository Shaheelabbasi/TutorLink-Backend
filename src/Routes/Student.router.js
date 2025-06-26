const express=require("express")

const StudentRouter=express.Router()
const { UserSignUp,UserSignIn,UserSignOut,fetchUserDetails,UpdateUserDetails,CheckEmail,ResetPassword}=require("../Controllers/User_auth.controller.js")

const {searchCourse,GetCourseLectures}=require('../Controllers/Course.controller.js')
const {fileUpload}=require("../Middlewares/upload.js")
const verifyJwt = require('../Middlewares/auth.middleware.js')
const {EnrollCourse,viewEnrolledCourses}=require("../Controllers/Enrollment.controller.js")
const {IsStudentEnrolled}=require("../Middlewares/IsEnrolled.middleware.js")
const {RequestLiveSession,ViewScheduledLiveSessions,ViewSentRequests,}=require("../Controllers/Livesession.controller.js")
const {IsStudent}=require("../Middlewares/IsStudent.middleware.js")

const {askQuestion,viewCommunity,viewAskedQuestions,editPostedQuestion,deletePostedQuestion}=require("../Controllers/community.controller.js")
const { handleMulterError } = require("../Middlewares/errorhandler.middleware.js")

const {ProvideFeedback}=require('../Controllers/feedback.controller.js')
const { ViewTeacherProfile } = require("../Controllers/Profile.controller.js")
const {reportProblemForStudent}=require("../Controllers/problem.controller.js")
const IsRestricted = require("../Middlewares/IsRestricted.middleware.js")
StudentRouter.post("/signup",fileUpload.single("profile"),UserSignUp)
StudentRouter.post("/login",IsRestricted,UserSignIn)
StudentRouter.put("/update-user",fileUpload.single("profile"),verifyJwt,IsStudent,IsStudentEnrolled,UpdateUserDetails)
StudentRouter.post("/logout",verifyJwt,UserSignOut)
StudentRouter.post("/check-email",CheckEmail)
StudentRouter.post("/reset-password",ResetPassword)
StudentRouter.get("/search-course",searchCourse)
StudentRouter.post("/enroll-course",verifyJwt,IsStudent,EnrollCourse)
StudentRouter.get("/get-course-lectures",verifyJwt,IsStudentEnrolled,GetCourseLectures)
StudentRouter.get("/view-enrolled-courses",verifyJwt,IsStudent,viewEnrolledCourses)
StudentRouter.post("/request-live-session",verifyJwt,IsStudent,IsStudentEnrolled,RequestLiveSession)
//a route to view the scheduled live sessions
StudentRouter.get("/view-scheduled-live-sessions",verifyJwt,IsStudent,IsStudentEnrolled,ViewScheduledLiveSessions)
//route for the students to view the requests they sent
StudentRouter.get("/view-sentRequests",verifyJwt,IsStudent,IsStudentEnrolled,ViewSentRequests)
StudentRouter.post("/ask-question",verifyJwt,IsStudent,fileUpload.fields([{name:"question_media",maxCount:3}]),IsStudentEnrolled,askQuestion,handleMulterError)
//view the community discussions 
StudentRouter.get("/view-community",verifyJwt,IsStudent,IsStudentEnrolled,viewCommunity)
//view all the asked questions with their asnwers if provided
StudentRouter.post("/view-asked-questions",verifyJwt,IsStudent,IsStudentEnrolled,viewAskedQuestions)
//route for the student to edit the posted question
StudentRouter.patch("/edit-question",verifyJwt,IsStudent,IsStudentEnrolled,editPostedQuestion)
StudentRouter.delete("/delete-question",verifyJwt,IsStudent,IsStudentEnrolled,deletePostedQuestion)


//routes for student to provide the feedback

StudentRouter.post("/provide-feedback",
    verifyJwt,IsStudent,IsStudentEnrolled,ProvideFeedback)


    //route to view teacher profile
    StudentRouter.get("/view-profile", ViewTeacherProfile)

    //route to fetch user details for the profile page in dashboard

    StudentRouter.get("/fetch-userdetails",verifyJwt,IsStudentEnrolled,fetchUserDetails)

    StudentRouter.post("/report-problem",verifyJwt,reportProblemForStudent)
module.exports={
    StudentRouter
}
