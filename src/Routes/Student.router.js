const express=require("express")

const StudentRouter=express.Router()
const { UserSignUp,UserSignIn,UserSignOut}=require("../Controllers/User_auth.controller.js")

const {searchCourse,GetCourseLectures}=require('../Controllers/Course.controller.js')
const {fileUpload}=require("../Middlewares/upload.js")
const verifyJwt = require('../Middlewares/auth.middleware.js')
const {EnrollCourse,viewEnrolledCourses}=require("../Controllers/Enrollment.controller.js")
const {IsStudentEnrolled}=require("../Middlewares/IsEnrolled.middleware.js")
const {RequestLiveSession}=require("../Controllers/Livesession.controller.js")
const {IsStudent}=require("../Middlewares/IsStudent.middleware.js")
StudentRouter.post("/signup",fileUpload.single("profilepicture"),UserSignUp)
StudentRouter.post("/login",UserSignIn)
StudentRouter.post("/logout",verifyJwt,UserSignOut)

StudentRouter.get("/search-course",searchCourse)


StudentRouter.post("/enroll-course",verifyJwt,IsStudent,EnrollCourse)
StudentRouter.get("/get-course-lectures",verifyJwt,IsStudentEnrolled,GetCourseLectures)
StudentRouter.get("/view-enrolled-courses",verifyJwt,IsStudent,viewEnrolledCourses)

StudentRouter.post("/request-live-session",verifyJwt,IsStudent,IsStudentEnrolled,RequestLiveSession)



module.exports={
    StudentRouter
}
