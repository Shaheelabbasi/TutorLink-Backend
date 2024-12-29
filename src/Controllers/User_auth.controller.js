const {User}=require("../Models/User.model.js")
const {asyncHandler}=require("../Utils/asyncHandler.js")
const ApiError=require("../Utils/ApiError.js")
const ApiResponse=require("../Utils/Apiresponse.js")
const { uploadOnCloudnary } = require("../Utils/cloudinary.js")
const {TeacherProfile}=require("../Models/Teacherprofile.model.js")

const UserSignUp=asyncHandler(async(req,res)=>{

    const { username, email, password,Profilepicture,role} = req.body;

    if (!username || !email || !password || !role)
    {
      throw new ApiError(400,"please provide all the fields")
    }
  if ([username, email, password,role].some((field) => field.trim() === "")) {
    throw new ApiError(400,"All fields are empty");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });
  if (existingUser) {
    throw new ApiError(400, "Username or email already exists");
  }
  let profile=null
if (Profilepicture)
{
    profile=await uploadOnCloudnary(req.file.path)
}
//   upload the picture to the cloud an then add the link to the database
  const newUser = await User.create({
    username,
    email,
    password,
    Profilepicture:profile?.url,
    role
  });

  if (!newUser) {
    throw new ApiError(500, "something went wrong while registering the User");
  }

  if(role.toLowerCase() =="teacher")
  {
const teacherprofiledata={
  user:newUser?._id
}
const teacherProfile=await TeacherProfile.create(teacherprofiledata)
if(!teacherProfile)
{
  throw new ApiError(500, "something went wrong while creating teacher profile");
}
  }

  const safeUser = await User.findById(newUser._id).select("-password -email");

  return res.json(new ApiResponse(200, safeUser, "User created successfully"));


})



const UserSignIn=asyncHandler(async(req,res)=>{
  
  const { email, password } = req.body;

  if (!email || ! password) {
    throw new ApiError(400, "email and password are required");
  }

  const existingUser = await User.findOne({
    email
  });
  if (!existingUser) {
    throw new ApiError(400, "User not found");
  }

  const passwordStatus = await existingUser.IspasswordCorrect(password);

  if (!passwordStatus) {
    throw new ApiError(400, "Incorrect password");
  }

  // generate access Token in case of correct credentials
  const AccessToken = existingUser.GenerateAccessToken();
  const safeUser = await User.findById(existingUser._id).select("-password -email");
  
  return res.json(
    new ApiResponse(200, { AccessToken, safeUser }, "logged in successfully")
  );

})



const UserSignOut=asyncHandler(async(req,res)=>{

console.log("Here")

req.User=null


res.json(
  new ApiResponse(
    200,
    "Logged Out successfully"
  )
)

})


module.exports={
    UserSignUp,
    UserSignIn,
    UserSignOut

}
