const { asyncHandler } = require("../Utils/asyncHandler.js")
const ApiError = require("../Utils/ApiError.js")
const ApiResponse = require("../Utils/Apiresponse.js")
const {CourseEnrollment}=require("../Models/Enrollment.model.js")
const { Course } = require("../Models/Course.model.js")
const { User } = require("../Models/User.model.js")

const EnrollCourse=asyncHandler(async (req,res) => {
    
  const {title,teachername}=req.body

  //check for the username
const validInstructor=await User.findOne({
    username:teachername
})

if(!validInstructor)
{
    throw new ApiError("Instructor does not exist")

}

  //check that the selected title against the selected instructor

  const IsCourseValid=await Course.findOne({
    Instructor:validInstructor._id,
    courseTitle:title
  })

  if(!IsCourseValid)
  {
    throw new ApiError(400,"Selected Course does not exist")
  }

const existingEnrollment=await CourseEnrollment.findOne({
     StudentId:req.user._id,
     CourseId:IsCourseValid._id
})

if(existingEnrollment)
{
    throw new ApiError(400,"You are already enrolled in this course ")
}
if(IsCourseValid.enrollmentEnd < Date.now())
{
    throw new ApiError(400,"Enrollment date is over now ")
}

const newEnrollment=await CourseEnrollment.create({
    StudentId:req.user?._id,
    CourseId:IsCourseValid._id,
    PaymentStatus:"completed"
})

if(!newEnrollment)
{
    throw new ApiError(400,"something went wrong while enrolling cousrse")
}


// we are returning the courseid here we will have to store
//it somewhere in the forntend and include it in the request to access course resourcesss
//like requesting a live session acessing lectures posting questions and viewing answers
const populatedEnrollment=await CourseEnrollment.findById(newEnrollment._id).populate({
    path:"StudentId",
    select:"username role"
})




res.json(
    new ApiResponse(
        201,
        populatedEnrollment,
        `successfullt enrolled in ${title} Course`
    )
)

})


const viewEnrolledCourses=asyncHandler(async(req,res)=>{
// for the students to view the courses that they have enrolled

const enrolledCourses=await CourseEnrollment.find({
    StudentId:req.user?._id
}).populate("CourseId")



if(!enrolledCourses)
{
    throw new ApiError(400,"no enrolled courses to show")
}
res.json(
    new ApiResponse(
        200,
        enrolledCourses,
        "successfully fetched enrolled courses"
    )
)

})



module.exports={
    EnrollCourse,
    viewEnrolledCourses
}