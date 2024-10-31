const Apierror = require("../Utils/ApiError.js");
const asyncHandler=require("../Utils/asyncHandler.js");
const Jwt=require("jsonwebtoken");
const Student=require("../Models/Student.model.js")
const verifyStudentJwt=asyncHandler(async(req,res,next)=>{

      const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
   if(!token)
    {
        new Apierror(401,"Unauthorized request")
    }

   const decodedToken= Jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

  const user= await Student.findById(decodedToken._id).select("-password")

  if(!user)
    {
        throw new Apierror(401,"Invalid access Token")
    }

         
    req.student=user;
    next();
})

module.exports=verifyStudentJwt