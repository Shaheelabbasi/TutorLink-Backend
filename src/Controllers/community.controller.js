const { asyncHandler } = require("../Utils/asyncHandler.js")
const ApiError = require("../Utils/ApiError.js")
const ApiResponse = require("../Utils/Apiresponse.js")
const {CommunityQuestions}=require("../Models/question.model.js")
const { uploadOnCloudnary } = require("../Utils/cloudinary.js")
const { CommunityAnswers } = require("../Models/answer.model.js")
const{Course}=require("../Models/Course.model.js")
const{GenerateCommunityNotificationEmail}=require("../Utils/NotifyEmaildata.js")
const { SendNotificationEmail } = require("../Utils/NotifyEmail.js")



const askQuestion=asyncHandler(async(req,res)=>{
    //for the students to add the questions
    const {content,courseId}=req.body

    if(!content || !courseId)
        {
            throw new ApiError(400,"content and courseId are required")
        } 

        //for more than 1 file we use req.files object
        //optional media check for the questions 

const courseDetails=await Course.findById(courseId)
if(!courseDetails)
{
    throw new ApiError(400,"no course found")
}
        let questionMediaUrls=[]
        if(req.files['question_media'])
        {
            //now loop through the media files to and upload them to cloudinary
            for(let i=0;i<req.files["question_media"].length;i++)
            {
                const response=await uploadOnCloudnary(req.files["question_media"][i].path)
                questionMediaUrls.push({url:response.url})
            }
        }

        const createdQuestion=await CommunityQuestions.create({
            studentId:req.user?._id,
            courseId:courseId,
            content:content,
            media:questionMediaUrls.map((question)=>(question))
        })

       if(!createdQuestion)
       {
        throw new ApiError("something went wrong while adding the question")
       }
      //we can add the populated fields based on the requirement

      //here we can notify the teacher that question has been posted against your course
       const {courseTitle}=courseDetails
     const {username:Instructorname,email:Instructoremail}=courseDetails.Instructor
  const emailtext=GenerateCommunityNotificationEmail(null,Instructorname,courseTitle,false)

  const Isnotified=SendNotificationEmail(Instructoremail,"New Question posted",emailtext)
  if(!Isnotified)
    {
        throw new ApiError(500,"something went wrong while notifying the student")
    }

       const populatedQuestion=await CommunityQuestions.findById(createdQuestion._id).populate("studentId","fullname").populate("courseId","courseTitle")
     

       return res.json(new ApiResponse(
        201,
        populatedQuestion,
        "question added successfully"
       )
       )
})


const postAnswer=asyncHandler(async(req,res)=>{

const{questionId,content}=req.body

if(!content)
{
    throw new ApiError(400,"answer  content is required")
}

let answerMediaUrls=[]
if(req.files['answer_media'])
{
    //now loop through the media files to and upload them to cloudinary
    for(let i=0;i<req.files["answer_media"].length;i++)
    {
        const response=await uploadOnCloudnary(req.files["answer_media"][i].path)
        answerMediaUrls.push({url:response.url})
    }
}

//check that the questionID is valid or not

const validQuestion=await CommunityQuestions.findById(questionId).populate("studentId","username email").populate("courseId","courseTitle")

if(!validQuestion)
{

    throw new ApiError(400,"no question found")
}

const createdAnswer=await CommunityAnswers.create({
    teacherId:req.user?._id,
    questionId:questionId,
    content:content,
    media:answerMediaUrls ?.map((answers)=>(answers))

}) 
if(!createdAnswer)
    {
     throw new ApiError("something went wrong while adding the question")
    }


    //now refer this answer to the question id

    const refrencedQuestion=await CommunityQuestions.findById(questionId)

    if(!refrencedQuestion)
    {
        throw new ApiError(500,"no question found")
    }

    refrencedQuestion.answer=createdAnswer._id
   await refrencedQuestion.save()
//cst populatedAnswer=await CommunityAnswers.findById(createdAnswer._id).populate("teacherId","fullname").populate("questionId","content media created_at")
const{username:studentname,email:studentemail}=validQuestion.studentId
const{courseTitle}=validQuestion.courseId
//notify the student
const emailtext=GenerateCommunityNotificationEmail(studentname,null,courseTitle,true)
const Isnotified= SendNotificationEmail(studentemail,"Answer Submitted",emailtext)
if(!Isnotified)
{
    throw new ApiError(500,"something went wrong while notifying the student")
}
return res.json(new ApiResponse(
    201,
    createdAnswer,
    "answer added successfully"
   )
   )
})

//fetched all asnwwered questions 
const viewCommunity=asyncHandler(async(req,res)=>{
//fetch all the questions for a particular course 


const{courseId}=req.body
//getting the courseID from the courseTitle

if(!courseId)
{
    throw new ApiError(400,"courseId is required")
}

const questions=await CommunityQuestions.find({
courseId:courseId,
//answer:null
}).populate("studentId","username").
populate("answer","content media")

if(!questions)
{
    throw new ApiError(400,"no questions have been posted")
}

res.json(
    new ApiResponse(
        200,
        questions,
        "successfully fetched all the questions"
    )
)
})

// route for the teacher to view all the asked questions for a particular cousre
const ViewQuestions=asyncHandler(async(req,res)=>{
    const{courseId}=req.body
    //getting the courseID from the courseTitle
    
    if(!courseId)
    {
        throw new ApiError(400,"courseId is required")
    }
    
    const questions=await CommunityQuestions.find({
    courseId:courseId,
    answer:null
    }).populate("studentId","username")
    
    if(questions.length ==0)
    {
        res.json(
            new ApiResponse(
                200,
                {},
                "no unasnwered questions "
            )
        )
    }
    
    if(!questions)
    {
        throw new ApiError(400,"no questions have been posted")
    }
    
    res.json(
        new ApiResponse(
            200,
            questions,
            "successfully fetched all the questions"
        )
    )

})

//view asked questions with their answer if provided
// specific route for a student to view his own asked questions
//
const viewAskedQuestions=asyncHandler(async(req,res)=>{
const{courseId}=req.body

if(!courseId)
{
    throw new ApiError(400,"courseId is required")
}

const myquestions=await CommunityQuestions.find({
    studentId:req.user?._id,
    courseId:courseId
}).populate("answer","content media")

if(myquestions.length ==0)
{
    throw new ApiError(400,"you have not asked any question yet")
}

res.json(
    new ApiResponse(
        200,
        myquestions,
        "successfully fetched all the questions"
    )
)

})
module.exports={
    askQuestion,
    postAnswer,
    viewCommunity,
    ViewQuestions,
    viewAskedQuestions

}