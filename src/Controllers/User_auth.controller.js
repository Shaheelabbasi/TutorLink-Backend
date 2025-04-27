const {User}=require("../Models/User.model.js")
const {asyncHandler}=require("../Utils/asyncHandler.js")
const ApiError=require("../Utils/ApiError.js")
const ApiResponse=require("../Utils/Apiresponse.js")
const { uploadOnCloudnary } = require("../Utils/cloudinary.js")
const {TeacherProfile}=require("../Models/Teacherprofile.model.js")


const GenerateUniqueUsername=(fullname)=>{

  let username=fullname.split(" ").join("").toLowerCase()
let randomNumber=Math.floor(Math.random()*1000)+1

username=username+"_"+randomNumber

return username


}

const UserSignUp=asyncHandler(async(req,res)=>{

    const {fullname, email, password,role} = req.body;



    if (!fullname || !email || !password || !role)
    {
      throw new ApiError(400,"please provide all the fields")
    }
  if ([fullname, email, password,role].some((field) => field.trim() === "")) {
    throw new ApiError(400,"All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ fullname }, { email }]
  });
  if (existingUser) {
    throw new ApiError(400, "fullname or email already exists");
  }
  let profile=null
if (req.file)
{
    profile=await uploadOnCloudnary(req.file.path)
}
console.log("profile here is ",profile)
// here we wil have to generate  a unique username for each user
let uniqueUsername=null
let Isunique=false

while(!Isunique)
  {
   uniqueUsername=GenerateUniqueUsername(fullname)
 const existingUsername=await User.findOne({username:uniqueUsername})

 //break the loop if nothing is found
 if(!existingUsername) {
   Isunique=true
 }
}

//   upload the picture to the cloud an then add the link to the database
  const newUser = await User.create({
    username:uniqueUsername,
    fullname,
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
  
  const { email, password ,role} = req.body;

  if (!email || ! password || !role) {
    throw new ApiError(400, "email ,password and role are required");
  }

  const existingUser = await User.findOne({
    email,
    role
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
  
  //maxage milli seconds was an issue
  const options={
    HttpOnly:true,
    maxAge:3600000
  }
  res.cookie("accessToken",AccessToken,options)
  .json(
    new ApiResponse(200, { AccessToken, safeUser }, "logged in successfully")
  );

})



const UserSignOut=asyncHandler(async(req,res)=>{

  const options={
    HttpOnly:true,
  }
res.clearCookie("accessToken",options).json(new ApiResponse(200,{},"loggedout successfully"))


})

const fetchUserDetails=asyncHandler(async(req,res)=>{

   const userId= req.query.userId
   if(!userId)
   {
    throw new ApiError(400,"user id is required")
   }

   const userdetails=await User.findById(userId).select("+password")

   if(!userdetails){
    throw new ApiError(400,"user not found")
   }

   return res.json(new ApiResponse(
    200,
    userdetails,
    "fetched user details successfully"
   ))
})


const UpdateUserDetails=asyncHandler(async(req,res)=>{

   const {fullname,email,userId}=req.body

   
   let profile=null
   if (req.file)
   {
       profile=await uploadOnCloudnary(req.file.path)
   }

   const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      fullname,
      email,
     Profilepicture:profile?.url
    },
    { new: true }
  )

  if(!updatedUser)
  {
    throw new ApiError(500,"something went wrong while updating profile")
  }

  return res.json(
    new ApiResponse(
      200,
      updatedUser,
      "user details updated successfully"
    )
  )
})

module.exports={
    UserSignUp,
    UserSignIn,
    UserSignOut,
    fetchUserDetails,
    UpdateUserDetails

}
