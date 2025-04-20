const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const UserSchema=new mongoose.Schema({
    
    username:{
        type:String,
        unique:true
    },
    fullname:{
        type:String,
        required:true
    },
    email:{
      type:String,
      unique:true,
      required:true
    },
    password:{
        type:String,
        required:true
      },
    Profilepicture:{
        type:String,
        default:"/Profiles/user.jpg"
    },
    role:{
        type:String,
        enum:['admin','student','teacher'],
        required:true
    }

},{timestamps:true})


UserSchema.pre("save",async function(next){
    //this: Refers to the current Mongoose document instance that is being saved or updated.
        if(this.isModified("password"))
        {
            this.password=await bcrypt.hash(this.password,10);
           return  next();
        }
        next();    
    })
    
    
    UserSchema.methods.IspasswordCorrect=async function(password)
    {
        const status=await bcrypt.compare(password,this.password)
        return status;
    }
    
    UserSchema.methods.GenerateAccessToken=function () {
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

const User=mongoose.model("User",UserSchema)

module.exports={
    User
}