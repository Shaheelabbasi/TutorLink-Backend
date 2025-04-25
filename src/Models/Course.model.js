const mongoose=require("mongoose")
const CourseSchema=new mongoose.Schema({
    
    Instructor:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    courseTitle:{
      type:String,
      required:true
    },
    description:{
        type:String,
        required:true
      },
    Thumbnail:{
        type:String,
        default:"./CourseThumbnail/thumbnail.jpg",
        required:true
    },
    price:{
        type:Number,
        default:0,
        required:true
    },
    lectures:[
        {
            // pdf or ppt file for lecture
            content:{
              type:String,
              required:true
            }
        }
    ],
    durationInMonths:{
        type:Number,
        min:1,
        max:3,
        required:true
    },
    courselevel:{
        type:String,
        enum:["Beginner","Intermediate","Advanced"]
    },
     enrollmentStart:{
       type:Date, 
       required:true
     },
     enrollmentEnd:
     {
      type:Date,
      required:true
     }

},{timestamps:true})





const Course=mongoose.model("Course",CourseSchema)

module.exports={
    Course
}