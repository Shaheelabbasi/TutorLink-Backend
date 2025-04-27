const mongoose = require("mongoose");

const LiveSessionSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Types.ObjectId,
        ref: "Course", // Reference to the Course model
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    scheduledTime: {
        type: Date,
        required: true
    },
    join_url: {
        type: String, // URL for the live students
        required: true
    },
    start_url:{
        type:String
    }
}, { timestamps: true });

const LiveSession = mongoose.model("LiveSession", LiveSessionSchema);

module.exports = {
    LiveSession
};
