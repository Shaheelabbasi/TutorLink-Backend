const Apierror = require("../Utils/ApiError.js");
const {asyncHandler}=require("../Utils/asyncHandler.js");
const Jwt=require("jsonwebtoken")
const {Teacher}=require("../Models/Teacher.model.js")
const verifyTeacherJwt=asyncHandler(async(req,res,next)=>{

      const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
   if(!token)
    {
        new Apierror(401,"Unauthorized request")
    }
   const decodedToken= Jwt.verify(token,process.env.JWT_SECRET)
   const user= await Teacher.findById(decodedToken._id).select("-password")
  if(!user)
    {
        throw new Apierror(401,"Invalid access Token")
    }

         
    req.Teacher=user;
    next();
})

module.exports=verifyTeacherJwt