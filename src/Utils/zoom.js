require('dotenv').config({path:'../../.env'})
const {asyncHandler}=require("../Utils/asyncHandler.js")
const axios =require('axios')
const qs=require('querystring')
const {request}=require('undici')



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

CreateZoomMeeting();