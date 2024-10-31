
const asyncHandler=(fn)=>{
         
        return  async (req,res,next)=>{
               
            try {
                // next is necessary here when we cal midddlewares
                await fn(req,res,next)
            } catch (error) {
                console.log("the error is ",error)
    
                res.status(error.statuscode || 500).json({

                    success:false,
                    message:error.message
                    
                }
                )
            }


        }

}

module.exports= {asyncHandler}