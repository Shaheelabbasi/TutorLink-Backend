const Apierror = require("../Utils/ApiError.js");
const {asyncHandler}=require("../Utils/asyncHandler.js");
const IsRestricted=asyncHandler(async(req,res,next)=>{

  if(req.user?.IsRestricted){
    throw new Apierror(400,"your account has been restricted")
  }
    next();
})

module.exports=IsRestricted