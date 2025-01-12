const mongoose= require("mongoose");

const answerSchema = new mongoose.Schema({
    teacherId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    questionId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Question', 
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
    created_at: { 
      type: Date, 
      default: Date.now 
    } 
  });
const CommunityAnswers=mongoose.model("Answer",answerSchema) 

module.exports={
    CommunityAnswers
}