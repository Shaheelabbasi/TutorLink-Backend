const express = require('express');
const path = require("path");
const app = express();
const cors=require("cors")
const multer=require("multer")

const cookieparser=require("cookie-parser")

app.use(cookieparser())
// Set up CORS
app.use(cors({
    origin:["http://localhost:3000","http://localhost:3001","http://localhost:5173"],
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}))






// Set up JSON and URL-encoded form body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("Public"))
// Routers
const {StudentRouter}=require("./Routes/Student.router.js")
const {TeacherRouter}=require("./Routes/Teacher.router.js")
app.use("/api/Student",StudentRouter)
app.use("/api/Teacher",TeacherRouter)

module.exports = app;
