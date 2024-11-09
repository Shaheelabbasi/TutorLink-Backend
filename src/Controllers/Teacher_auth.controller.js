const {Teacher}=require("../Models/Teacher.model.js")
const {asyncHandler}=require("../Utils/asyncHandler.js")
const ApiError=require("../Utils/ApiError.js")
const ApiResponse=require("../Utils/Apiresponse.js")
const { uploadOnCloudnary } = require("../Utils/cloudinary.js")

const TeacherSignUp=asyncHandler(async(req,res)=>{

    const { username, email, password,LinkedInProfile,Profilepicture} = req.body;

    if (!username || !email || !password || !LinkedInProfile)
    {
      throw new ApiError(400,"please provide all the fields")
    }
  if ([username, email, password,LinkedInProfile].some((field) => field.trim() === "")) {
    throw new ApiError(400,"All fields are empty");
  }

  const existingTeacher = await Teacher.findOne({
    $or: [{ username }, { email }]
  });
  if (existingTeacher) {
    throw new ApiError(400, "Teachername or email already exists");
  }

  const profile=await uploadOnCloudnary(req.file.path)
//   upload the picture to the cloud an then add the link to the database
  const newTeacher = await Teacher.create({
    username,
    email,
    password,
    LinkedInProfile,
    Profilepicture:profile?.url
  });

  if (!newTeacher) {
    throw new ApiError(500, "something went wrong while registering the Teacher");
  }

  const safeTeacher = await Teacher.findById(newTeacher._id).select("-password -email");

  return res.json(new ApiResponse(200, safeTeacher, "Teacher created successfully"));


})


const TeacherSignIn=asyncHandler(async(req,res)=>{
  
  const { email, password } = req.body;

  if (!email || ! password) {
    throw new ApiError(400, "email and password are required");
  }

  const existingTeacher = await Teacher.findOne({
    email
  });
  if (!existingTeacher) {
    throw new ApiError(400, "Teacher not found");
  }

  const passwordStatus = await existingTeacher.IspasswordCorrect(password);

  if (!passwordStatus) {
    throw new ApiError(400, "Incorrect password");
  }

  const AccessToken = existingTeacher.GenerateAccessToken();
  const safeTeacher = await Teacher.findById(existingTeacher._id).select("-password -email");


  // generate access Token in case of correct credentials
  
  return res.json(
    new ApiResponse(200, { AccessToken, safeTeacher }, "logged in successfully")
  );

})


const TeacherSignOut=asyncHandler(async(req,res)=>{

console.log("Here")

req.Teacher=null


res.json(
  new ApiResponse(
    200,
    "Logged Out successfully"
  )
)

})


module.exports={
    TeacherSignUp,
    TeacherSignIn,
    TeacherSignOut

}
