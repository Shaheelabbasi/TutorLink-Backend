const { User } = require("../Models/User.model.js");
const Apierror = require("../Utils/ApiError.js");
const {asyncHandler}=require("../Utils/asyncHandler.js");

const IsRestricted=asyncHandler(async(req,res,next)=>{

  const { email, password ,role} = req.body;

  const existingUser = await User.findOne({
    email,
    role
  });

  if(!existingUser.IsRestricted) {
    next()
}
else{
    throw new Apierror(400,"canot login your account has been restricted")
}

})

module.exports=IsRestricted