const { asyncHandler } = require("../Utils/asyncHandler.js")
const ApiError = require("../Utils/ApiError.js")
const ApiResponse = require("../Utils/Apiresponse.js")
const {CourseEnrollment}=require("../Models/Enrollment.model.js")
const { Course } = require("../Models/Course.model.js")
const { User } = require("../Models/User.model.js")
const { populate } = require("dotenv")

const EnrollCourse=asyncHandler(async (req,res) => {
    
  const {title,teacherid}=req.body

  //check for the username
const validInstructor=await User.findById(teacherid)

if(!validInstructor)
{
    throw new ApiError(400,"Instructor does not exist")
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
    //considering the payment status as completed for dummy enrollment
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
    select:"username"
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


const populateQuery={
    path:"CourseId",
    select:"courseTitle courselevel Instructor",
    populate:{
        path:"Instructor",
        select:"fullname"
    }
}
const enrolledCourses=await CourseEnrollment.find({
    StudentId:req.user?._id
}).populate(populateQuery)



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



//get the enrollments for a particular course
// because we need to send scheduling notifications to each enrolled student in a particular course
//we particulary need the email ids of all the students
//it is a utility function for fetching email ids it is not a genuine endpoint


const getEnrolledStudents=async(courseId)=>{

    // console.log("course id is ",courseId)/

    //const {courseId}=req.body

    if(!courseId)
    {
        throw new ApiError(400,"course id is required")
    }

    const IsValidCourse=await Course.findById(courseId)
    if(!IsValidCourse)
    {
        throw new ApiError(400,"Invalid courseId")
    }

    const EnrolledList=await CourseEnrollment.find({
       CourseId:IsValidCourse._id
    }).populate("StudentId","email fullname")

    if(EnrolledList.length ==0)
        {
            throw new ApiError(400,"no studnets enrolled for this particular course")
        }

//email ids and fullnames enrolled students
    let enrolledStudents=[]
    EnrolledList.map((enrolled)=>{
        enrolledStudents.push({email:enrolled.StudentId.email,fullname:enrolled.StudentId.fullname})
    })

    
    return enrolledStudents
}




// console.log("enolled students are ",ans)

module.exports={
    EnrollCourse,
    viewEnrolledCourses,
    getEnrolledStudents
}