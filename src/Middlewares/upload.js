const multer=require("multer")
const path=require("path")
const fs=require("fs")

function setDestination(req, file, cb){  
  let uploadDir=null
// for handling the profile picture
 if (file.fieldname =="profile")
 {
  uploadDir=path.join(__dirname,'../../Public/Profiles')
   if (fs.existsSync(uploadDir))
   {
    // folder exists
    // upload the file 
      cb(null,uploadDir)
   }
   else 
   {
    console.log (" folder does not exists ")
    // uploadDir=path.join(__dirname,"../../Public/Profiles")
    fs.mkdirSync(uploadDir);
    cb(null,uploadDir)
   }
  }
   if (file.fieldname =="thumbnail")
   {
    uploadDir=path.join(__dirname,"../../Public/CourseThumbnail")
    if (fs.existsSync(uploadDir))
    {
      cb(null,uploadDir)
    }
    else
    {
      fs.mkdirSync(uploadDir)
      cb(null,uploadDir)
    }
   }
   if (file.fieldname =="lectures")
    {
     uploadDir=path.join(__dirname,"../../Public/Lectures")
     if (fs.existsSync(uploadDir))
     {
       cb(null,uploadDir)
     }
     else
     {
       fs.mkdirSync(uploadDir)
       cb(null,uploadDir)
     }
    }
    if(file.fieldname =="question_media")
    {
      uploadDir=path.join(__dirname,"../../Public/Questions")
     if (fs.existsSync(uploadDir))
     {
       cb(null,uploadDir)
     }
     else
     {
       fs.mkdirSync(uploadDir)
       cb(null,uploadDir)
     }
    }
    if(file.fieldname =="answers_media")
      {
        uploadDir=path.join(__dirname,"../../Public/Answers")
       if (fs.existsSync(uploadDir))
       {
         cb(null,uploadDir)
       }
       else
       {
         fs.mkdirSync(uploadDir)
         cb(null,uploadDir)
       }
      }

}
const storage = multer.diskStorage({
    destination: setDestination,
    filename: function (req, file, cb) {
    
      const uniqueSuffix = Date.now() + '-' 
      cb(null, uniqueSuffix + '-' + file.fieldname)
    }
  })
  

  const fileFilter=(req,file,cb)=>{

    const allowedImageTypes=["image/png", "image/jpeg", "image/jpg"]
    const allowedLectureTypes=[
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-powerpoint"
    ]
     if(file.fieldname =="lectures")
     { 
      if( !allowedLectureTypes.includes(file.mimetype))
      {
       return cb(new Error("For lectures only pdf and ppts are allowed"))
      }
     }
   

    else if(file.fieldname =="thumbnail" || file.fieldname =="profilepicture")
    {
      if(!allowedImageTypes.includes(file.mimetype))
        // reject the file and throw error
       return cb(new Error(`Only Images Png ,jpg and Jpeg are allowed for ${file.fieldname}`),false)
    }


    else if(file.fieldname =="question_media")
    {
      if(!allowedImageTypes.includes(file.mimetype))
        // reject the file and throw error
       return cb(new Error(`Only Images Png ,jpg and Jpeg are allowed for ${file.fieldname}`),false)
    }
    else if(file.fieldname =="answer_media")
      {
        if(!allowedImageTypes.includes(file.mimetype))
          // reject the file and throw error
         return cb(new Error(`Only Images Png ,jpg and Jpeg are allowed for ${file.fieldname}`),false)
      }

    // accept the file
    cb(null,true)
  }
  const fileUpload = multer({ 
  fileFilter:fileFilter,
  storage: storage,
  limits:{
    fileSize:15*1024*1024
  }
 })

module.exports={
    fileUpload
}