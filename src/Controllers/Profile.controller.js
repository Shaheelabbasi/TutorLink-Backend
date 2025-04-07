const {asyncHandler}=require("../Utils/asyncHandler.js")

const {TeacherProfile}=require("../Models/Teacherprofile.model.js")
const ApiError=require("../Utils/ApiError.js")
const ApiResponse=require("../Utils/Apiresponse.js")

//end point when the teacher views profile from the dashboard
// as well as when someone clicks on view profile from the 
// course card
const ViewTeacherProfile=asyncHandler(async(req,res)=>{

    const Profile=await TeacherProfile.findOne({
        user:req.user?._id || req.query?.InstructorId
    }).populate({
        path:"user",
        select:"username Profilepicture"
    }).populate({
          path:"education",
        select:"degreeLevel Institute startYear endYear"
    }).populate({
         path:"courses",
        select:"courseTitle description Thumbnail price courselevel durationInMonths"
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