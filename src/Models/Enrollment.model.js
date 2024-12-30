const mongoose=require("mongoose")
const EnrollmentSchema=new mongoose.Schema({
    
    StudentId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    CourseId:{
        type:mongoose.Types.ObjectId,
        ref:"Course",
        required:true
    },
    EnrollmentDate:{
        type: Date,
        default: Date.now,
        required: true,
      },
    status:{
        type:String,
        enum: ["active", "completed"],
        default: "active",
    },
    PaymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      }
  

},{timestamps:true})





const CourseEnrollment=mongoose.model("Enrollment",EnrollmentSchema)

module.exports={
  CourseEnrollment
}