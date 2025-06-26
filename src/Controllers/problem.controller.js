
const { Course } = require("../Models/Course.model.js")
const {Problem}=require("../Models/problem.model.js")
 const {asyncHandler}=require('../Utils/asyncHandler.js')
 const ApiError = require("../Utils/ApiError.js")
const ApiResponse = require("../Utils/Apiresponse.js")
const { User } = require("../Models/User.model.js")
const reportProblemForStudent=asyncHandler(async(req,res)=>{

    const { title, description, courseId } = req.body;

  if (!title || !description || !courseId) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const courseDetails = await Course.findById(courseId).populate('Instructor', 'fullname');

  if (!courseDetails || !courseDetails.Instructor) {
    res.status(404);
    throw new Error('Course or instructor not found');
  }

  const problem = await Problem.create({
    title,
    description,
    reportedBy: req.user._id,
    reportedAgainst: courseDetails.Instructor._id,
  });

  return res.json(
    new ApiResponse(
        200,
        problem,
        "problem reported successfully"
    )
  )

})

 const getAllReportedProblems = asyncHandler(async (req, res) => {
  const problems = await Problem.find()
    .populate('reportedBy', 'fullname role')
    .populate('reportedAgainst', 'fullname role')
    .sort({ createdAt: -1 });

  const formatted = problems.map((problem, index) => ({
    problemId: problem._id,
    title: problem.title,
    reportedBy: `${problem.reportedBy.fullname} (${problem.reportedBy.role})`,
    reportedAgainst: `${problem.reportedAgainst.fullname} (${problem.reportedAgainst.role})`,
    status: problem.status,
    reportedById:problem.reportedBy._id,
    reportedAgainstId:problem.reportedAgainst._id,
  }));


  return res.json(
    new ApiResponse(
      200,
      formatted,
      "fetched problems successfully"
    )
  )
});



const restrictUser = asyncHandler(async (req, res) => {
 // const userId = req.params.id;
  const { restrict,userId } = req.body; // true to restrict, false to unrestrict

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.IsRestricted = restrict;
  await user.save();

  return res.json(
    new ApiResponse(
      200,
      {},
      `User has been ${restrict ? "restricted" : "unrestricted"} successfully.`
    )
  )

});


module.exports={
    reportProblemForStudent,
    getAllReportedProblems,
    restrictUser

}