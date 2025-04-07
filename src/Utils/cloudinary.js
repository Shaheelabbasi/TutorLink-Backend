require("dotenv").config()
const cloudinary=require("cloudinary").v2;

const fs=require("fs");
         
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_CLOUD_APIKEY,
  api_secret: process.env.CLOUDINARY_CLOUD_APISECRET
});

const uploadOnCloudnary=async(localfilepath)=>{
try {
    if(!localfilepath) return null;
    console.log("the file paths are ",localfilepath)
    const response = await cloudinary.uploader.upload(localfilepath, { resource_type: "auto" });

    console.log("File uploaded successfully:");

    // Remove the file after successful upload
    fs.unlink(localfilepath,(err)=>{
      if (err) throw err
      console.log(`file with path ${localfilepath} has been deleted `)
    });
    return response;
  
} catch (error) {
  console.log(error)
  if (fs.existsSync(localfilepath)) {
    fs.unlink(localfilepath,(err)=>{
      if (err) throw err
      console.log(`file with path ${localfilepath} has been deleted `)
    });
  }
  return null
}

}




const deleteFromCloudinary=async(oldurl)=>{

  try {
    //removing file extension.
    const lastDotIndex = oldurl.lastIndexOf('.');
    oldurl=oldurl.substring(0,lastDotIndex)

    const id=oldurl.split("/").pop();
     const response=   await cloudinary.uploader.destroy(id).then((status)=>{
        console.log(status)
     }).catch((err)=>console.log(err));
    
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
}


module.exports={
  uploadOnCloudnary,
  deleteFromCloudinary
};