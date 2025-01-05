
const GenerateLiveSessionRequestEmailText=(Instructorname,studentName,courseTitle,topic,requestedDate,requestedTime)=>
{
const emailtext = `
<html>
  <body>
 <p>Dear <strong>${Instructorname}</strong></p>,
    <p>You have received a new live session request from <strong>${studentName}</strong> for the course <strong>"${courseTitle}"</strong>. Below are the details:</p>
    <ul>
      <li><strong>Student Name:</strong> ${studentName}</li>
      <li><strong>Requested Topic:</strong> ${topic}</li>
      <li><strong>Requested Date:</strong> ${requestedDate}</li>
      <li><strong>Requested Time:</strong> ${requestedTime}</li>
    </ul>

    <p>Please review and respond to the request at your earliest convenience.</p>

    <p>Best regards,<br/>TutorLink</p>
  </body>
</html>
`;
return emailtext
}


const GenerateLiveSessionRequestStatusEmail=(status,studentName,courseTitle,topic,scheduledDate,scheduledTime,join_url)=>{
 
  if (status.toLowerCase() == "approved") {
    const emailtext = `
    <html>
  <body>
  <p>Dear <strong>${studentName}</strong>,</p>
  
  <p>We are excited to inform you that your live session request for the course <strong>"${courseTitle}"</strong> has been accepted and successfully scheduled. Below are the session details:</p>
  
  <ul>
    <li><strong>Requested Topic:</strong> ${topic}</li>
    <li><strong>Scheduled Date:</strong> ${scheduledDate}</li>
    <li><strong>Scheduled Time:</strong> ${scheduledTime}</li>
    <li><strong>Join Link:</strong> <a href="${join_url}" target="_blank">${join_url}</a></li>
  </ul>
  
  <p>Please ensure that you are available at the scheduled time. Click the above link to join the session at the scheduled time.</p>
  
  <p>We look forward to your participation in this interactive and enriching session. Thank you for choosing <strong>TutorLink</strong>.</p>
  
  <p>Best regards,</p>
  <p><strong>TutorLink Team</strong></p>
  </body>
  </html>
    `;
    return emailtext;
  }
  

  if(status.toLowerCase()=="rejected")
  {
    const emailtext=`
  <html>
<body>
  <p>Dear <strong>${studentName}</strong>,</p>
  
  <p>We regret to inform you that your live session request for the course <strong>"${courseTitle}"</strong> has been <strong>rejected</strong> due to availiability constraints.</p>
  
  <p>We appreciate your interest in scheduling a live session, and we encourage you to try again at a later time.</p>

  <p>Best regards,<br/> TutorLink Team</p>
</body>
</html>

    `
    return emailtext
  }

}

const GenerateTeacherSessionNotificationEmail = (Teachername,scheduledDate, scheduledTime, start_url) => {
  const emailtext = `
  <html>
  <body>
  <p>Dear ${Teachername},</p>
  
  <p>Your live session has been successfully scheduled. You can start the session by clicking the link below:</p>
  
  <ul>
    <li><strong>Scheduled Date:</strong> ${scheduledDate}</li>
    <li><strong>Scheduled Time:</strong> ${scheduledTime}</li>
    <li><strong>Start Link:</strong> <a href="${start_url}" target="_blank">${start_url}</a></li>
  </ul>

  <p>Best regards,<br/> TutorLink Team</p>
  </body>
  </html>
`;

  return emailtext;
};




module.exports={
  GenerateLiveSessionRequestEmailText,
  GenerateLiveSessionRequestStatusEmail,
  GenerateTeacherSessionNotificationEmail
}