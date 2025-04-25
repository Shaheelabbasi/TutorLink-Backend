const {asyncHandler}=require("../Utils/asyncHandler.js")

const {TeacherProfile}=require("../Models/Teacherprofile.model.js")
const ApiError=require("../Utils/ApiError.js")
const ApiResponse=require("../Utils/Apiresponse.js")

//end point when the teacher views profile from the dashboard
// as well as when someone clicks on view profile from the 
// course card
// for students
const ViewTeacherProfile=asyncHandler(async(req,res)=>{

    const Profile=await TeacherProfile.findOne({
        user: req.query?.id
    }).populate({
        path:"user",
        select:"username fullname Profilepicture email"
    }).populate({
          path:"education",
        select:"degreeLevel Institute startYear endYear fieldOfStudy"
    }).populate({
         path:"courses",
        select:"courseTitle description Thumbnail price courselevel durationInMonths"
    }).populate({
        path:"feedback",
        select:"content stars",
        populate:{
         path:"userId",
         select:"username fullname "
        }
   
        
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