const mongoose = require("mongoose");

const LiveSessionSchema = new mongoose.Schema({
    course: {
        type: mongoose.Types.ObjectId,
        ref: "Course", // Reference to the Course model
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    sessionDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String, // e.g., "14:30" for 2:30 PM
        required: true
    },
    endTime: {
        type: String, // e.g., "15:30" for 3:30 PM
        required: true
    },
    Instructor: {
        type: mongoose.Types.ObjectId,
        ref: "User", // Reference to the User model for the instructor
        required: true
    },
    meetingLink: {
        type: String, // URL for the live session (e.g., Zoom/Google Meet link)
        required: true
    },
}, { timestamps: true });

const LiveSession = mongoose.model("LiveSession", LiveSessionSchema);

module.exports = {
    LiveSession
};
