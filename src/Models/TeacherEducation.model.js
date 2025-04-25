const mongoose = require("mongoose")
const EducationSchema = new mongoose.Schema({

  TeacherId: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  fieldOfStudy: {
    type: String,
    required: true,
  },
  degreeLevel: {
    type: String,
    required: true,
    enum: ["Associate", "Bachelors", "Masters", "Doctorate", "Diploma",]
  },
  Institute: {
    type: String,
    required: true
  },
  startYear: {
    type: Date,
    required: true
  },
  endYear: {
    type: Date,
    required: true
  }
})

const EducationModel = mongoose.model("Teacher_Education", EducationSchema)

module.exports = {
  EducationModel
}