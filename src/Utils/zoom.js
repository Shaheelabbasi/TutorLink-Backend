require('dotenv').config({path:'../../.env'})
const {asyncHandler}=require("../Utils/asyncHandler.js")
const axios =require('axios')
const { Console } = require('console')
const qs=require('querystring')
// const {request}=require('undici')



const GenerateAccessToken=async()=>{

  try {
    
    const response=await axios.post(
      'https://zoom.us/oauth/token',
      qs.stringify({ grant_type: 'account_credentials', account_id: process.env.ZOOM_ACCOUNT_ID }),
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64')}`,
        }
      }
    );
    return response.data.access_token
  } 
catch (error) {
    console.log("the error in token generation is ",error)
}

}


// under this current setup i would be the host every time 

const CreateZoomMeeting=asyncHandler(async(req,res)=>{

  const access_token= await GenerateAccessToken();

  // console.log("token in create function is ",access_token)
   const meetingdata={
    topic: 'Instant Meeting',
    type: 1, // Instant meeting
    start_time: new Date().toISOString(), // Current time in ISO format
    duration: 30, // Duration in minutes
    timezone: 'UTC', // Set the timezone
    settings: {
        host_video: true,
        participant_video: true,
        join_before_host: true,
        mute_upon_entry: true,
        waiting_room: true
    }
   }

  const MeetingResponse=await axios.post('https://api.zoom.us/v2/users/me/meetings',meetingdata,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}` // Use your access token here
    }
    
  })

  console.log("meeting response is ",MeetingResponse.data.starturl)
  console.log("meeting response is ",MeetingResponse.data.joinul)

})



const ScheduleMeeting=async(topic,scheduledTime,scheduledDate)=>{

  
  
  
  try {
    const access_token= await GenerateAccessToken();
    const formatted_date=new Date(scheduledDate).toISOString().split("T")[0]
    const start_time = new Date(`${formatted_date}T${scheduledTime}:00.000+05:00`).toISOString()
    console.log("the starttime is ",start_time)

    
  const meetingdata={
    topic: topic,
    type: 2, // Scheduled meeting
    start_time: start_time, // ISO8601 format
    duration: 60, // In minutes
    timezone: "Asia/Karachi", // Teacher's timezone
    settings: {
      join_before_host: false, // Students cannot join before the teacher
      mute_upon_entry: true, // Mute all participants upon entry
      waiting_room: true, // Enable waiting room for security
    }

  }

  const MeetingResponse=await axios.post('https://api.zoom.us/v2/users/me/meetings',
  meetingdata,
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}` // Use your access token here
    }
})

// console.log("in zoom file body is ",MeetingResponse.data)``

return MeetingResponse.data
}

 


catch (error) {
  console.log("Meeting error is ",error)
  }


}

module.exports=

{
  ScheduleMeeting
}