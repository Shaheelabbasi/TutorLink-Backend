const express = require("express")
const AdminRouter = express.Router()
const {getAllReportedProblems, restrictUser}=require("../Controllers/problem.controller")
const verifyJwt = require("../Middlewares/auth.middleware")


AdminRouter.get("/problems",getAllReportedProblems)
AdminRouter.post("/restrict-user",restrictUser)

module.exports={
    AdminRouter
}