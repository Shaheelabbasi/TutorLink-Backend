const express = require("express")
const multer = require("multer")
const TeacherRouter = express.Router()
const { UserSignUp, UserSignIn, UserSignOut } = require("../Controllers/User_auth.controller.js")
const { fileUpload } = require('../Middlewares/upload.js')
const { addEducationalDetails, updateEducationalDetails, GetEducationalDetails } = require('../Controllers/Teacher_Details.cont.js')
const { createCourse,addLectures,updateCourseDetails ,GetAllCourses,ViewCourseEnrollments} = require("../Controllers/Course.controller.js")
const verifyJwt = require('../Middlewares/auth.middleware.js')
const { handleMulterError } = require("../Middlewares/errorhandler.middleware.js")
const {ViewTeacherProfile}=require("../Controllers/Profile.controller.js")
const {IsTeacher}=require("../Middlewares/IsTeacher.middleware.js")
const {ViewLiveSessionRequests,UpdateRequestStatus,ViewScheduledLiveSessions,scheduleLiveSession}=require("../Controllers/Livesession.controller.js")
const {postAnswer}=require("../Controllers/community.controller.js")
// in case of error in fileupload Signup is skipped and automatically 
// last error handler is called 
TeacherRouter.post("/signup", fileUpload.single("profilepicture"), UserSignUp, (error, req, res) => {

    console.log("the error is ", error)
    if (error) {
        res.json({
            success: false,
            message: error.message
        })}
})
TeacherRouter.post("/login", UserSignIn)
TeacherRouter.post("/logout", UserSignOut)
// private routes for teacher
TeacherRouter.post("/addEducation", verifyJwt, addEducationalDetails)
TeacherRouter.patch("/updateEducationDetails", verifyJwt, updateEducationalDetails)
TeacherRouter.get("/getEducationDetails", verifyJwt, GetEducationalDetails)
TeacherRouter.post("/create-course", verifyJwt, fileUpload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: "lectures", maxCount: 5 }]), createCourse, handleMulterError)
TeacherRouter.post("/addcourse-lectures", verifyJwt, fileUpload.fields([{ name: "lectures", maxCount: 5 }]), addLectures, handleMulterError)
TeacherRouter.get("/view-profile",verifyJwt, ViewTeacherProfile)
TeacherRouter.get("/view-course-enrollments",verifyJwt,IsTeacher, ViewCourseEnrollments)
//later secure it by adding jwt
TeacherRouter.get("/get-all-courses",verifyJwt,IsTeacher,GetAllCourses)
TeacherRouter.get("/view-livesession-requests",verifyJwt,IsTeacher,ViewLiveSessionRequests)
TeacherRouter.post("/update-request-status",verifyJwt,IsTeacher,UpdateRequestStatus)
TeacherRouter.post("/view-scheduled-sessions",verifyJwt,IsTeacher,ViewScheduledLiveSessions)
TeacherRouter.post("/schedule-live-session",verifyJwt,IsTeacher,scheduleLiveSession)
TeacherRouter.post("/post-answer",verifyJwt,IsTeacher,fileUpload.fields([{name:"answer_media",maxCount:3}]),postAnswer,handleMulterError)








module.exports = {
    TeacherRouter
}