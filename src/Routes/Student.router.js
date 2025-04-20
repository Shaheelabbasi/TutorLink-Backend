const express=require("express")

const StudentRouter=express.Router()
const { UserSignUp,UserSignIn,UserSignOut}=require("../Controllers/User_auth.controller.js")

const {searchCourse,GetCourseLectures}=require('../Controllers/Course.controller.js')
const {fileUpload}=require("../Middlewares/upload.js")
const verifyJwt = require('../Middlewares/auth.middleware.js')
const {EnrollCourse,viewEnrolledCourses}=require("../Controllers/Enrollment.controller.js")
const {IsStudentEnrolled}=require("../Middlewares/IsEnrolled.middleware.js")
const {RequestLiveSession,ViewScheduledLiveSessions}=require("../Controllers/Livesession.controller.js")
const {IsStudent}=require("../Middlewares/IsStudent.middleware.js")

const {askQuestion,viewCommunity,viewAskedQuestions,editPostedQuestion,deletePostedQuestion}=require("../Controllers/community.controller.js")
const { handleMulterError } = require("../Middlewares/errorhandler.middleware.js")

const {ProvideFeedback}=require('../Controllers/feedback.controller.js')

StudentRouter.post("/signup",fileUpload.single("profile"),UserSignUp)
StudentRouter.post("/login",UserSignIn)
StudentRouter.post("/logout",verifyJwt,UserSignOut)

StudentRouter.get("/search-course",searchCourse)


StudentRouter.post("/enroll-course",verifyJwt,IsStudent,EnrollCourse)
StudentRouter.get("/get-course-lectures",verifyJwt,IsStudentEnrolled,GetCourseLectures)
StudentRouter.get("/view-enrolled-courses",verifyJwt,IsStudent,viewEnrolledCourses)

StudentRouter.post("/request-live-session",verifyJwt,IsStudent,IsStudentEnrolled,RequestLiveSession)
//a route to view the scheduled live sessions
StudentRouter.get("/view-scheduled-live-sessions",verifyJwt,IsStudent,IsStudentEnrolled,ViewScheduledLiveSessions)
StudentRouter.post("/ask-question",verifyJwt,IsStudent,fileUpload.fields([{name:"question_media",maxCount:3}]),IsStudentEnrolled,askQuestion,handleMulterError)
//view the community discussions 
StudentRouter.post("/view-community",verifyJwt,IsStudent,IsStudentEnrolled,viewCommunity)
//view all the asked questions with their asnwers if provided
StudentRouter.post("/view-asked-questions",verifyJwt,IsStudent,IsStudentEnrolled,viewAskedQuestions)
//route for the student to edit the posted question
StudentRouter.patch("/edit-question",verifyJwt,IsStudent,IsStudentEnrolled,editPostedQuestion)
StudentRouter.delete("/delete-question",verifyJwt,IsStudent,IsStudentEnrolled,deletePostedQuestion)

//routes for student to provide the feedback

StudentRouter.post("/provide-feedback",
    verifyJwt,IsStudent,IsStudentEnrolled,ProvideFeedback)
module.exports={
    StudentRouter
}
