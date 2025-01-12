const mongoose=require("mongoose")
const questionSchema = new mongoose.Schema({
    studentId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    courseId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Course', 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    media:[{
        url:{
          type:String
        }
      } ],
    answer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Answer' 
    },
    created_at: { 
      type: Date, 
      default: Date.now 
    }
  });

const CommunityQuestions=mongoose.model("question",questionSchema)
module.exports={
   CommunityQuestions
}  