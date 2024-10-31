const express=require("express")

const StudentRouter=express.Router()
const {studentSignUp,StudentSignIn}=require("../Controllers/Student_auth.controller.js")




StudentRouter.post("/signup",studentSignUp)
StudentRouter.post("/login",StudentSignIn)








module.exports={
    StudentRouter
}