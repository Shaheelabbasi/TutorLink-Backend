const express=require("express")

const TeacherRouter=express.Router()
const {TeacherSignUp,TeacherSignIn}=require("../Controllers/Teacher_auth.controller.js")
const {fileUpload}=require('../Middlewares/upload.js')
const ApiError=require("../Utils/ApiError.js")


// in case of error in fileupload Signup is skipped and automatically 
// last error handler is called 
TeacherRouter.post("/signup",fileUpload.single("profile"),TeacherSignUp,(error,req,res)=>{

    console.log("the error is ",error)
   if (error)
   {
    res.json({
        success:false,
        message:error.message
    })
   }
})
TeacherRouter.post("/login",TeacherSignIn)








module.exports={
    TeacherRouter
}