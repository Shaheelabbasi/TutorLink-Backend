const Apierror = require("../Utils/ApiError.js");
const {asyncHandler}=require("../Utils/asyncHandler.js");
const Jwt=require("jsonwebtoken");
const {User}=require("../Models/User.model.js")
const verifyJwt=asyncHandler(async(req,res,next)=>{

      const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
   if(!token)
    {
        new Apierror(401,"Unauthorized request")
    }

   const decodedToken=  Jwt.verify(token,process.env.JWT_SECRET)
  const user= await User.findById(decodedToken._id).select("-password")

  if(!user)
    {
        throw new Apierror(401,"Invalid access Token")
    }

    
    req.user=user;
    next();
})

module.exports=verifyJwt