const { EducationModel } = require("../Models/TeacherEducation.model.js")
const { asyncHandler } = require("../Utils/asyncHandler.js")
const ApiError = require("../Utils/ApiError.js")
const ApiResponse = require("../Utils/Apiresponse.js")
const {uploadOnCloudnary}=require('../Utils/cloudinary.js')
const { Course } = require("../Models/Course.model.js")

const createCourse=asyncHandler(async(req,res)=>{
   const courseLimit=2

    if(!req.files['lectures'])
    {
        throw new ApiError(400,"You must add the lecture files")
    }

    const {
        Instructor,
        courseTitle,
        description,
        price,
        courselevel,
        enrollmentStart,
        enrollmentEnd,
        durationInMonths
    }=req.body
    

    if(!Instructor || !courseTitle || !description  || !price || !durationInMonths || !enrollmentStart || !enrollmentEnd){
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

    const courseCount=await Course.countDocuments({Instructor:req.user?._id})
 if(courseCount >=courseLimit)
 {
    throw new ApiError(400,"You can add only up to two courses")
 }
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
    })

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
        title
    }=req.body;

    const searchResult=await Course.find({
        courseTitle:{$regex:title,$options:"i"}
    })

    if(!searchResult)
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


module.exports={
    createCourse,
    addLectures,
    updateCourseDetails,
    GetAllCourses,
    searchCourse
}