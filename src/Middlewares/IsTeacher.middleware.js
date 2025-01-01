const Apierror = require("../Utils/ApiError.js");
const {asyncHandler}=require("../Utils/asyncHandler.js");
const IsTeacher=asyncHandler(async(req,res,next)=>{

    if (req.user.role =="teacher")
    {
     return next();
    }
    throw new Apierror(400,'only teachers can access this route')
})

module.exports={IsTeacher}


