const {LiveSessionRequest}=require("../Models/Livesessionrequest.model")
const { asyncHandler } = require("../Utils/asyncHandler.js")
const ApiError = require("../Utils/ApiError.js")
const ApiResponse = require("../Utils/Apiresponse.js")
const { Course } = require("../Models/Course.model.js")




const RequestLiveSession=asyncHandler(async(req,res,next)=>{
//enrolled course id would be stored on frontend and included in each request
const { courseId, requestedDate, requestedTime, topic } = req.body;

if (!courseId || !requestedDate || !requestedTime || !topic) {
    throw new ApiError(400,"All fields are required")
}

const sessionRequest = await LiveSessionRequest.create({
    studentId: req.user._id,
    courseId,
    requestedDate,
    requestedTime,
    topic,
});

if(!sessionRequest)
{
    throw new ApiError(500,"something went wrong while submitting the request")
}

res.json(
    new ApiResponse(
        200,
        sessionRequest,
        "request sent successfully"
    )
)

})

const ViewLiveSessionRequests=asyncHandler(async(req,res)=>{


})

module.exports={
    RequestLiveSession,
    ViewLiveSessionRequests

}
