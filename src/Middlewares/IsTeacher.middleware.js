const Apierror = require("../Utils/ApiError.js");
const {asyncHandler}=require("../Utils/asyncHandler.js");
const IsTeacher=asyncHandler(async(req,res,next)=>{

  console.log("the role in middleware is ",req.user.role)
    if (req.user.role =="teacher")
    {
     return next();
    }
    throw new Apierror(400,'only teachers can access this route')
})

module.exports={IsTeacher}


