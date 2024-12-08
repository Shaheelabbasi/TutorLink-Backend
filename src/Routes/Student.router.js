const express=require("express")

const StudentRouter=express.Router()
// const {studentSignUp,StudentSignIn}=require("../Controllers/Student_auth.controller.js")
const { UserSignUp,UserSignIn,UserSignOut}=require("../Controllers/User_auth.controller.js")
const {fileUpload}=require("../Middlewares/upload.js")


StudentRouter.post("/signup",fileUpload.single("profilepicture"),UserSignUp)
StudentRouter.post("/login",UserSignIn)




module.exports={
    StudentRouter
}