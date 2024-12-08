const multer = require("multer")
const handleMulterError=(err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      // Specific error for file size limit exceeded
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: err.message
        });

      }
      if(err.code =="LIMIT_UNEXPECTED_FILE")
      {
        res.status(400).json({
          success:false,
          message:"cannot add more than 5 files"
        })
      }
    }
    else if (err) {
        // Handle other errors, including file type errors
        return res.status(400).json({
          success: false,
          message: err.message || 'An unexpected error occurred.'
        });
      }
    // for global level middlewrae next is must to call otherwise app sucks 
    next(err)
}

module .exports={
    handleMulterError
}