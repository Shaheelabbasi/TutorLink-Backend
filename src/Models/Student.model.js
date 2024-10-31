const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const StudentSchema=new mongoose.Schema({
    
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
      } 

})


StudentSchema.pre("save",async function(next){
    //this: Refers to the current Mongoose document instance that is being saved or updated.
        if(this.isModified("password"))
        {
            this.password=await bcrypt.hash(this.password,10);
           return  next();
        }
        next();    
    })
    
    
    StudentSchema.methods.IspasswordCorrect=async function(password)
    {
        const status=await bcrypt.compare(password,this.password)
        return status;
    }
    
    StudentSchema.methods.GenerateAccessToken=function () {
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

const Student=mongoose.model("Student",StudentSchema)

module.exports={
    Student
}