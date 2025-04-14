const mongoose = require("mongoose");

const TeacherProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
  
    education: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher_Education", // Reference to the Education model
        },
    ],
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course", // Reference to the Course model
        },
    ],
   feedback:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "feedback", // Reference to the Course model
    },
   ]
}, { timestamps: true }); 

const TeacherProfile = mongoose.model("Teacher_Profile", TeacherProfileSchema);

module.exports = {
    TeacherProfile,
};
