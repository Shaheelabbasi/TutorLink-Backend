const express = require('express');
const path = require("path");
const app = express();
const cors=require("cors")
const multer=require("multer")
// Set up CORS
app.use(cors({
    origin:"*",
    methods:['GET','POST','PUT','DELETE']
}))




// Set up JSON and URL-encoded form body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routers
const {StudentRouter}=require("./Routes/Student.router.js")
const {TeacherRouter}=require("./Routes/Teacher.router.js")
app.use("/api/Student",StudentRouter)
app.use("/api/Teacher",TeacherRouter)

module.exports = app;
