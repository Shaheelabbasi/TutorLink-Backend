const mongoose=require("mongoose")

const feedbackSchema=new mongoose.Schema({
    
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    CourseId:{
        type:mongoose.Types.ObjectId,
        ref:"Course",
        required:true
    },
    content:{
      type:String,
     required:true
    },
    stars:{
        type:Number,
        required:true,
        min:1,
        max:5
    }

})

const Feedback=mongoose.model("feedback",feedbackSchema)

module.exports={
    Feedback
}