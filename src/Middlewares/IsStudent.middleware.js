const Apierror = require("../Utils/ApiError.js");
const asyncHandler=require("../Utils/asyncHandler.js");
const {User}=require("../Models/User.model.js")
const IsStudent=asyncHandler(async(req,res,next)=>{

    if (!req.user.role =="student")
    {
      throw new Apierror(400,"Only students can access this route")
    }

    next();
})

module.exports=IsStudent