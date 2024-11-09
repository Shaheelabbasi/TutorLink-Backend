const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const jwt=require('jsonwebtoken')
const TeacherSchema=mongoose.Schema({
    
    username:{
        type:String,
        unique:true
    },
    email:{
      type:String,
      required:true
    },
    password:{
        type:String,
        required:true
      },
    LinkedInProfile:{
        type:String,
    },
    Profilepicture:{
        type:String,
        default:"../Public/profiles/user.jpg"
    } 

})

TeacherSchema.pre("save",async function(next){
    //this: Refers to the current Mongoose document instance that is being saved or updated.
        if(this.isModified("password"))
        {
            this.password=await bcrypt.hash(this.password,10);
           return  next();
        }
        next();    
    })
    
    
    TeacherSchema.methods.IspasswordCorrect=async function(password)
    {
        const status=await bcrypt.compare(password,this.password)
        return status;
    }
    
    TeacherSchema.methods.GenerateAccessToken=function () {
        return jwt.sign(
            {
            _id:this._id,
            email:this.email
        },
      process.env.JWT_SECRET,
        {
            expiresIn:"1d"
        }
        
    )
    }

const Teacher=mongoose.model("Teacher",TeacherSchema)

module.exports={
    Teacher
}