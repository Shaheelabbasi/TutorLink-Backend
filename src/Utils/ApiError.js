class Apierror extends Error
{
    constructor(  statuscode, message="something went wrong", stack="")
    {
        //here the variables for the class are created as well as assinged values 
        super(message)
        this.statuscode=statuscode;
        this.data=null;
        // this.errors=errors;
        this.success=false;
        this.message=message;
        if(stack)
        {
            // It contains a list of function calls leading up to the point where the error occurred
            this.stack=stack;

        }
        else
        {
            // capture the stack automatically
            // captures only necessary details 
            // it excludes apierror internal details
            Error.captureStackTrace(this,this.constructor);
            // captures the extra details
            //  Error.captureStackTrace(this);
        }
    }

}

 //console.log("api error object ",new Apierror())
// stack representation
// the stack is  Error: Studentname or email already exists
//     at D:\TutorLink\src\Controllers\Student_auth.controller.js:23:11
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
//     at async D:\TutorLink\src\Utils\asyncHandler.js:8:17

// we can provide it on our own by as
// try {
    
// } catch (error) {
    
// new Apierror(400,"somemessage",["err1","err2"],error.stack)
// }

//  it captures the current state of the program, including the chain of function calls
//  leading up to where the error occurred.



// without using this extends we cannot find out the line of code where did the error occured
// class Apierror 
// {
//     constructor(  statuscode, message="something went wrong")
//     {
//         //here the variables for the class are created as well as assinged values 
//         this.statuscode=statuscode;
//         this.data=null;
//         this.success=false;
//         this.message=message;
//     }
     
// }


module.exports =Apierror

// Limited Inheritance: In JavaScript, the super call within a constructor primarily serves to initialize inherited methods and properties defined in the parent class. Since the Error class constructor traditionally only accepts a message, passing other arguments wouldn't make sense in this context.
// Error Class Behavior: The Error class likely handles properties like the status code or error details internally. It might have its own logic for assigning these values or capturing the call stack. Passing them explicitly to super wouldn't be part of the standard behavior.
// By calling super(message), you make your user-defined class (ApiError) a true subclass of the Error class. 
// This enables it to leverage the built-in functionalities and properties of Error,
//  making it a more robust and versatile error handling tool in your JavaScript application