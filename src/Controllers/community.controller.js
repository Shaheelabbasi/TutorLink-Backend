const { asyncHandler } = require("../Utils/asyncHandler.js")
const ApiError = require("../Utils/ApiError.js")
const ApiResponse = require("../Utils/Apiresponse.js")
const {CommunityQuestions}=require("../Models/question.model.js")
const { uploadOnCloudnary } = require("../Utils/cloudinary.js")
const { CommunityAnswers } = require("../Models/answer.model.js")
const askQuestion=asyncHandler(async(req,res)=>{

    //for the students to add the questions
    const {content,courseId}=req.body

    if(!content || !courseId)
        {
            throw new ApiError(400,"content and courseId are required")
        } 

        //for more than 1 file we use req.files object
        //optional media check for the questions 
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

return res.json(new ApiResponse(
    201,
    createdAnswer,
    "answer added successfully"
   )
   )
})

const fetchAllQuestions=asyncHandler(async(req,res)=>{


})

module.exports={
    askQuestion,
    postAnswer
}