const express = require("express")
const multer = require("multer")
const TeacherRouter = express.Router()
const { UserSignUp, UserSignIn, UserSignOut } = require("../Controllers/User_auth.controller.js")
const { fileUpload } = require('../Middlewares/upload.js')
const ApiError = require("../Utils/ApiError.js")
const { addEducationalDetails, updateEducationalDetails, GetEducationalDetails } = require('../Controllers/Teacher_Details.cont.js')
const { createCourse,addLectures,updateCourseDetails ,GetAllCourses} = require("../Controllers/Course.controller.js")
const verifyJwt = require('../Middlewares/auth.middleware.js')
const { handleMulterError } = require("../Middlewares/errorhandler.middleware.js")

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
// private routes for teacher
TeacherRouter.post("/addEducation", verifyJwt, addEducationalDetails)
TeacherRouter.patch("/updateEducationDetails", verifyJwt, updateEducationalDetails)
TeacherRouter.get("/getEducationDetails", verifyJwt, GetEducationalDetails)
TeacherRouter.post("/create-course", verifyJwt, fileUpload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: "lectures", maxCount: 5 }]), createCourse, handleMulterError)
TeacherRouter.post("/addcourse-lectures", verifyJwt, fileUpload.fields([{ name: "lectures", maxCount: 5 }]), addLectures, handleMulterError)
TeacherRouter.post("/addcourse-lectures", verifyJwt, fileUpload.fields([{ name: "lectures", maxCount: 5 }]), addLectures, handleMulterError)








module.exports = {
    TeacherRouter
}