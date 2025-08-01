const express = require("express")
const AdminRouter = express.Router()
const {getAllReportedProblems, restrictUser, unRestrictUser}=require("../Controllers/problem.controller")
const verifyJwt = require("../Middlewares/auth.middleware")
const { allUsers } = require("../Controllers/User_auth.controller")


AdminRouter.get("/complains",getAllReportedProblems)
AdminRouter.post("/restrict-user",restrictUser)
AdminRouter.get("/users",allUsers)
AdminRouter.post("/unrestrict-user",unRestrictUser)
module.exports={
    AdminRouter
}