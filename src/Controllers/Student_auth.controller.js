const {Student}=require("../Models/Student.model.js")
const {asyncHandler}=require("../Utils/asyncHandler.js")
const ApiError=require("../Utils/ApiError.js")
const ApiResponse=require("../Utils/Apiresponse.js")

const studentSignUp=asyncHandler(async(req,res)=>{

    const { username, email, password } = req.body;


    if (!username || !email || !password)
    {
      throw new ApiError(400,"please provide all the fields")
    }
  if ([username, email, password].some((field) => field.trim() === "")) {
    throw new ApiError(400,"All fields are empty");
  }

  const existingStudent = await Student.findOne({
    $or: [{ username }, { email }]
  });
  if (existingStudent) {
    throw new ApiError(400, "Studentname or email already exists");
  }

  const newStudent = await Student.create({
    username,
    email,
    password
  });

  if (!newStudent) {
    throw new ApiError(500, "something went wrong while registering the Student");
  }

  const safeStudent = await Student.findById(newStudent._id).select("-password -email");

  return res.json(new ApiResponse(200, safeStudent, "Student created successfully"));


})


const StudentSignIn=asyncHandler(async(req,res)=>{

  const { email, password } = req.body;

  if (!email || ! password) {
    throw new ApiError(400, "email and password are required");
  }

  const existingStudent = await Student.findOne({
    email
  });
  if (!existingStudent) {
    throw new ApiError(400, "Student not found");
  }

  const passwordStatus = await existingStudent.IspasswordCorrect(password);

  if (!passwordStatus) {
    throw new ApiError(400, "Incorrect password");
  }

  const AccessToken = existingStudent.GenerateAccessToken();
  const safeStudent = await Student.findById(existingStudent._id).select("-password -email");


  // generate access Token in case of correct credentials
  
  return res.json(
    new ApiResponse(200, { AccessToken, safeStudent }, "logged in successfully")
  );

})


const StudentSignOut=asyncHandler(async(req,res)=>{

console.log("Here")

req.student=null


res.json(
  new ApiResponse(
    200,
    "Logged Out successfully"
  )
)

})




const TeacherSignup=asyncHandler(async(req,res)=>{

    const { Studentname, email, password } = req.body;

    if ([Studentname, email, password].some((field) => field.trim() === "")) {
      throw new ApiError(400,"All fields are required");
    }
  
    const existingTeacher = await Teacher.findOne({
      $or: [{ Studentname }, { email }]
    });
    if (existingTeacher) {
      throw new ApiError(400, "Studentname or email already exists");
    }
  
    const newTeacher = await Teacher.create({
      Studentname,
      email,
      password
    });
  
    if (!newTeacher) {
      throw new ApiError(500, "something went wrong while registering the Teacher");
    }
  
    const safeTeacher = await Teacher.findById(newTeacher._id).select("-password -email");
  
    return res.json(new ApiResponse(200, safeTeacher, "Teacher created successfully"));
    

})

module.exports={
    studentSignUp,
    StudentSignIn
    
}
