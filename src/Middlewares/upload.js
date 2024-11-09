const multer=require("multer")
const path=require("path")
const fs=require("fs")

function setDestination(req, file, cb){

    //    
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


}
const storage = multer.diskStorage({
    destination: setDestination,
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' 
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  

  const fileFilter=(req,file,cb)=>{

    //  content length is string so we have to convert it
    // file .size is not avb here so we use this
    const ActualFileSize=parseInt(req.headers['content-length'])
    const allowedMimeTypes=["image/png","image/jpeg","application/pdf","image/jpg","application/vnd.openxmlformats-officedocument.presentationml.presentation" ]
     const maxFileSize= 15 * 1024 * 1024;
    if (allowedMimeTypes.includes(file.mimetype) && ActualFileSize <= maxFileSize)
    {
      // accept the file 
        cb(null,true)
    }

    else if(! allowedMimeTypes.includes(file.mimetype))
    {
        // reject the file and throw error
        cb(new Error("Only Images pdfs and ppts are allowed "),false)
    }
    else if (ActualFileSize >maxFileSize)
    {
      cb (new Error("File size should be less than 15 mb"))
    }
  }
  const fileUpload = multer({ 
  fileFilter:fileFilter,
  storage: storage
 })

module.exports={
    fileUpload
}