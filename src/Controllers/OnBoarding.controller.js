const { TeacherProfile } = require("../Models/Teacherprofile.model");
const Apierror = require("../Utils/ApiError");
const ApiResponse = require("../Utils/Apiresponse");
const { asyncHandler } = require("../Utils/asyncHandler");



const getTeacherOnboardingStatus = asyncHandler(async (req, res) => {
    const profile = await TeacherProfile.findOne({ user: req.user._id })
      .populate("education")
      .populate("courses");
  
    if (!profile) {
     throw new Apierror(404,"profile not found")
    }
  
    const hasEducation = profile.education.length >= 1;
    const hasCourse = profile.courses.length >= 1;
  
    return res.json(new ApiResponse(200,{hasCourse,hasEducation},"fetched onboarding status successfully"));
  });
  
  module.exports={
    getTeacherOnboardingStatus
  }