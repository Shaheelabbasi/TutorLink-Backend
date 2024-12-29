const express=require("express")

const StudentRouter=express.Router()
const { UserSignUp,UserSignIn,UserSignOut}=require("../Controllers/User_auth.controller.js")

const {searchCourse}=require('../Controllers/Course.controller.js')
const {fileUpload}=require("../Middlewares/upload.js")


StudentRouter.post("/signup",fileUpload.single("profilepicture"),UserSignUp)
StudentRouter.post("/login",UserSignIn)
StudentRouter.get("/search-course",searchCourse)



module.exports={
    StudentRouter
}
