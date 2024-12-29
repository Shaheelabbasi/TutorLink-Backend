const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  StudentId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  CourseId: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  EnrollmentId: {
    type: mongoose.Types.ObjectId,
    ref: "Enrollment",
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "Debit Card", "PayPal", "Stripe", "Bank Transfer"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  transactionId: {
    type: String,
    unique: true, // Ensure each transaction is unique
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed", "Refunded"],
    default: "Pending",
    required: true,
  },
}, { timestamps: true });




const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = {
  Payment,
};
