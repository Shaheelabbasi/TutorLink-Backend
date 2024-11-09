const mongoose=require("mongoose")
const StudentSchema=new mongoose.Schema({
    
    TeacherId:{
        type:mongoose.Types.ObjectId,
        ref:"Teacher"
    },
    fieldOfStudy: {
      type: String,
      required: true,
  },
  degreeLevel: {
    type: String,
    required: true,
    enum: ["Associate", "Bachelor", "Masters", "Doctorate", "Diploma", "Certification"]
},
Institute:{
      type:String,
      required:true
},
startYear:{
        type:String,
        required:true
      },
endYear:{
      type:String,
      required:true
    },
grade: {
      type: String,
      required:true 
      }
})

const EducationModel=mongoose.model("Teacher_Education",StudentSchema)

module.exports={
    EducationModel
}