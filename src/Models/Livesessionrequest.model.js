const mongoose = require("mongoose");

const LiveSessionRequestSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Types.ObjectId,
        ref: "User", // Reference to the Student user model
        required: true,
    },
    courseId: {
        type: mongoose.Types.ObjectId,
        ref: "Course", // Reference to the Course model
        required: true,
    },
    requestedDate: {
        type: Date, // Date for the requested session
        required: true,
    },
    requestedTime: {
        type: Date, // Preferred time for the session
        required: true,
    },
    topic: {
        type: String, // Topic for the session
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },
    //adding a live session refrence here for the approve requests
    liveSession:{
        type: mongoose.Types.ObjectId,
        ref: "LiveSession", 
    }
}, { timestamps: true });


const LiveSessionRequest = mongoose.model("LiveSessionRequest", LiveSessionRequestSchema);

module.exports = { LiveSessionRequest };
