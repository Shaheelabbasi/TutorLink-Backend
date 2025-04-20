
const { asyncHandler } = require("../Utils/asyncHandler.js")
const ApiError = require("../Utils/ApiError.js")
const ApiResponse = require("../Utils/Apiresponse.js")
const {uploadOnCloudnary}=require('../Utils/cloudinary.js')
const { Course } = require("../Models/Course.model.js")
const {TeacherProfile}=require("../Models/Teacherprofile.model.js")
const {CourseEnrollment}=require("../Models/Enrollment.model.js")
const createCourse=asyncHandler(async(req,res)=>{

//    const courseLimit=2

    if(!req.files['lectures'])
    {
        throw new ApiError(400,"You must add the lecture files")
        
    }
  
    if(!req.files['thumbnail'])
        {
            throw new ApiError(400,"You must add the course thumbnail")
        }


    const {
        courseTitle,
        description,
        price,
        courselevel,
        enrollmentStart,
        enrollmentEnd,
        durationInMonths
    }=req.body
    

    if(!courseTitle || !description  || !price || !durationInMonths || !enrollmentStart || !enrollmentEnd){
        throw new ApiError(400,"All fields are required")
    }

    const ExistingCourse=await Course.findOne({
        Instructor:req.user?._id,
        courseTitle
    })
    if(ExistingCourse)
    {
        throw new ApiError(400,`course with title "${courseTitle}" already exists`)
    }

//     const courseCount=await Course.countDocuments({Instructor:req.user?._id})
//  if(courseCount >=courseLimit)
//  {
//     throw new ApiError(400,"You can add only up to two courses")
//  }
const ThumbnailFilepath=req.files['thumbnail'][0].path
let Thumbnailfile=null
  if (ThumbnailFilepath)
{
Thumbnailfile=await uploadOnCloudnary(ThumbnailFilepath)
}

// now upload lectures on cloudinary
const lectureUrls=[]
for (let i=0;i<req.files['lectures'].length;i++)
{
 const response=await uploadOnCloudnary(req.files['lectures'][i].path)
 lectureUrls.push(response.url)
}

const createdCourse=await Course.create({
        Instructor:req.user?._id,
        courseTitle,
        description,
        Thumbnail:Thumbnailfile?.url,
        price,
        lectures:lectureUrls.map((url)=>({content:url})),
        durationInMonths,
        courselevel,
        enrollmentStart,
        enrollmentEnd,
})

if (!createdCourse)
{
    throw new ApiError(500,"something went wrong while creating the course")
}


if(req.user.role.toLowerCase() =="teacher")
    {
        // finding the specifc teacher profile
        const teacherProfile = await TeacherProfile.findOne({
            user: req.user._id,
        });

        if (!teacherProfile) {
            throw new ApiError(404, "Teacher profile not found");
        }

        teacherProfile.courses.push(createdCourse._id);
        await teacherProfile.save();
    }

return res.json(
    new ApiResponse(
        201,
        createdCourse,
        "course created successfully"
    )
)

})

const addLectures=asyncHandler(async(req,res)=>{
    if(!req.files['lectures'])
        {
            throw new ApiError(400,"You must add the lecture files")
        }
    const {
        courseTitle
    }=req.body

    if(!courseTitle)
    {
      throw new ApiError(400,"all fields are required")
    }

const  ExistingCourse=await Course.findOne({
    Instructor:req.user?._id,
    courseTitle
})
if(!ExistingCourse)
{
    throw new ApiError(400,' course not found')
}
const lectureUrls=[]
for (let i=0;i<req.files['lectures'].length;i++)
{
 const response=await uploadOnCloudnary(req.files['lectures'][i].path)
 lectureUrls.push(response.url)
}

lectureUrls.map(url => ExistingCourse.lectures.push({ content: url }));
await ExistingCourse.save()

return res.json(
    new ApiResponse(
        201,
        ExistingCourse,
        "lectures added successfully"
    )
)
})


const updateCourseDetails=asyncHandler(async(req,res)=>{
    const {
        courseTitle,
        description,
        price,
        courselevel,
        enrollmentStart,
        enrollmentEnd,
        durationInMonths
    }=req.body

    const fieldsTobeUpdated={};

    if(courseTitle)fieldsTobeUpdated.courseTitle=courseTitle
    if(description)fieldsTobeUpdated.description=description
    if(price)fieldsTobeUpdated.price=price
    if(courselevel)fieldsTobeUpdated.courselevel=courselevel
    if(enrollmentStart)fieldsTobeUpdated.enrollmentStart=enrollmentStart
    if(enrollmentEnd)fieldsTobeUpdated.enrollmentEnd=enrollmentEnd
    if(durationInMonths)fieldsTobeUpdated.durationInMonths=durationInMonths

    const updatedCourse=await Course.findOneAndUpdate({
        Instructor:req.user?._id,
    },
    {$set:fieldsTobeUpdated},
    {
     new:true
    }
)

if(!updatedCourse)
{
    throw new ApiError(500,"Error updating course content")
}
return res.json(
    new ApiResponse(
        200,
        updatedCourse,
        "successfully updated course details"
    )
)
})


const GetAllCourses=asyncHandler(async(req,res)=>{


    const allCourses=await Course.find({
        Instructor:req.user?._id
    }).select("courseTitle")

    if(!allCourses)
    {
        throw new ApiError(400,"No courses found")
    }
    res.json(
        new ApiResponse(
            200,
            allCourses,
            "sucessfully fetched all courses"
        )
    )
})


const searchCourse=asyncHandler(async(req,res)=>{
    const{
        title,
        level,
        duration
    }=req.query;

    if(!title || !level)
        {
            throw new ApiError("Search criteria is required")
        } 
const searchquery={};
if(title)
{
    // both ways are same 
    searchquery.courseTitle={$regex:new RegExp(title,'i')}

   // searchquery.courseTitle={$regex:title,$options:"i"}
}
if(level)
{
    searchquery.courselevel={$regex:new RegExp(level,'i')}
}
if(duration)
{
    searchquery.durationInMonths={$regex:new RegExp(duration,'i')}
}

// excluded lectures before enrollment
// lectures will be made available after enrollment
    const searchResult=await Course.find(searchquery,"-lectures -createdAt -updatedAt -price").populate({
         path:"Instructor",
        select:"username Profilepicture"
    })

    if(!searchResult.length>0)
    {
        throw new ApiError(400,"No matching courses found")
    }

    res.json(
        new ApiResponse(
            200,
            searchResult,
            "successfully fetched all the search results"
        )
    )
})



const GetCourseLectures=asyncHandler(async(req,res)=>{

const {courseId}=req.body;

if(!courseId)
{
    throw new ApiError(400,"courseId is required")
}


const CousreData=await Course.findById(courseId)


res.json(new ApiResponse(
    200,
    CousreData.lectures,
    "successfully fetched lectures"
))


})


const ViewCourseEnrollments=asyncHandler(async(req,res)=>{

    //teacher can see has someone enrolled in his course
    const courses=await Course.find({
      Instructor:req.user?._id
    })

    if(!courses.length)
    {
        throw new ApiError(400,"no courses found for this teacher")
    }

    const enrollments = await Promise.all(
        courses.map(async (course) => {
            return await CourseEnrollment.find({
                CourseId: course._id,
                status: "active"
            })
            .populate("StudentId", "username email")
            .populate("CourseId", "courseTitle");
        })
    );
 
  //destructuring to remove the double array
const [finalenrols]=enrollments


    res.json( new ApiResponse 
         (
         200,
        finalenrols,
        "successfully fetched enrollments"
    )
    )
})

module.exports={
    createCourse,
    addLectures,
    updateCourseDetails,
    GetAllCourses,
    searchCourse,
    GetCourseLectures,
    ViewCourseEnrollments
}