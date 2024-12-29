const {asyncHandler}=require("../Utils/asyncHandler.js")

const {TeacherProfile}=require("../Models/Teacherprofile.model.js")
const ApiError=require("../Utils/ApiError.js")
const ApiResponse=require("../Utils/Apiresponse.js")

const ViewTeacherProfile=asyncHandler(async(req,res)=>{

    const Profile=await TeacherProfile.findOne({
        user:req.user._id
    }).populate({
        path:"user",
        select:"username Profilepicture"
    }).populate({
          path:"education",
        select:"degreeLevel Institute startYear endYear"
    }).populate({
         path:"courses",
        select:"courseTitle description price courselevel durationInMonths"
    })
    
    if(!Profile)
    {
      throw new ApiError(400,"teacher profile not found")
    }


    res.json(new ApiResponse(
        200,
        Profile,
        "fetched teacher profile successfully"
    ))
})


module.exports={
    ViewTeacherProfile
}