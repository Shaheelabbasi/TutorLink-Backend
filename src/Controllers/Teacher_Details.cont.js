const { EducationModel } = require("../Models/TeacherEducation.model.js")
const { asyncHandler } = require("../Utils/asyncHandler.js")
const ApiError = require("../Utils/ApiError.js")
const ApiResponse = require("../Utils/Apiresponse.js")




const addEducationalDetails = asyncHandler(async (req, res) => {

    console.log("education function called")
    const {
        fieldOfStudy,
        degreeLevel,
        Institute,
        startYear,
        endYear,
        grade
    } = req.body

    if ([fieldOfStudy, degreeLevel, Institute, startYear, endYear, grade].some((value) => value.trim() == "")) {
        throw new ApiError(400, "All the fields are required")
    }

    if (endYear < startYear) {
        throw new ApiError(400, "End year must be greater than start year")
    }
    const currentYear = new Date().getFullYear()


    if (degreeLevel == "Bachelors") {
        if (endYear - startYear != 4) {
            throw new ApiError(400, "Years must have a difference of four")
        }
        if (endYear > currentYear) {
            throw new ApiError(400, `Graduation must be completed before ${currentYear}`)
        }
    }

    if (degreeLevel == "Masters" && (endYear - startYear != 1)) {

        throw new ApiError(400, "please enter valid year values for Masters")
    }


    // find already existing educational details

    const existingEducationDetails = await EducationModel.findOne({
        TeacherId: req.Teacher._id
    })


    if (existingEducationDetails) {
        throw new ApiError(400, "Educational details are already added")
    }
    const addedEducation = await EducationModel.create({
        TeacherId: req.Teacher?._id,
        fieldOfStudy,
        degreeLevel,
        Institute,
        startYear,
        endYear,
        grade
    })
    return res.json(
        new ApiResponse(
            201,
            addedEducation,
            "educational details added successfully"
        )
    )
})



const updateEducationalDetails = asyncHandler(async (req, res) => {
    const {
        fieldOfStudy,
        degreeLevel,
        Institute,
        startYear,
        endYear,
        grade
    } = req.body

    if ([fieldOfStudy, degreeLevel, Institute, startYear, endYear, grade].some((value) => value?.trim() == "")) {
        throw new ApiError(400, "provide at least one value to update")
    }

    if (endYear < startYear) {
        throw new ApiError(400, "End year should be greater than start year")
    }
    const currentYear = new Date().getFullYear()


    if (degreeLevel == "Bachelors") {
        if (endYear - startYear != 4) {
            throw new ApiError(400, "Years must have a difference of four")
        }
        if (endYear > currentYear) {
            throw new ApiError(400, `Graduation must be completed before ${currentYear}`)
        }
    }

    if (degreeLevel == "Masters" && (endYear - startYear != 1)) {

        throw new ApiError(400, "please enter valid year values for Masters")
    }

    const updatedFields={}

    if(fieldOfStudy) updatedFields.fieldOfStudy=fieldOfStudy
    if(degreeLevel) updatedFields.degreeLevel=degreeLevel
    if(Institute) updatedFields.Institute=Institute
    if(startYear) updatedFields.startYear=startYear
    if(endYear) updatedFields.endYear=endYear
    if(grade) updatedFields.grade=grade
   
    const UpdatedDetails=await EducationModel.findOneAndUpdate(
        // filter find the document 
       { TeacherId:req.Teacher?._id},
        // object for update
        // $set updates the specific fields we specify and adds them if they dont exist
        // here we can pass multiple fields as well but we are passing single field
       { $set:updatedFields},
        {new:true}
    )

    if (!UpdatedDetails)
    {
        throw new ApiError(500,"Error updating details")
    }

    res.json(
        
           new ApiResponse(
                200,
                UpdatedDetails,
                "Educationals Details updated successfully"
            
        )
    )


})

const GetEducationalDetails=asyncHandler(async(req,res)=>{
    const EducationalDetails=await EducationModel.findOne({
        TeacherId:req.Teacher._id
    }).populate("TeacherId","-email -password -LinkedInProfile")
  res.json(
    new ApiResponse(
        200,
        EducationalDetails,
        "fetched details successfully"
    )
  )
})

module.exports = {
    addEducationalDetails,
    updateEducationalDetails,
    GetEducationalDetails
}