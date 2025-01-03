
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


const GenerateLiveSessionRequestStatusEmail=(status,studentName,courseTitle,topic,scheduledDate,scheduledTime)=>{
 
  if(status.toLowerCase() == "approved")
  {
    const emailtext=`
  <html>
<body>
<p>Dear <strong>${studentName}</strong>,</p>

<p>We are pleased to inform you that your live session request for the course <strong>"${courseTitle}"</strong> has been approved. Below are the session details:</p>

<ul>
  <li><strong>Requested Topic:</strong> ${topic}</li>
  <li><strong>Scheduled Date:</strong> ${scheduledDate}</li>
  <li><strong>Scheduled Time:</strong> ${scheduledTime}</li>
</ul>

<p>Please ensure that you are available at the scheduled time. You will receive further details, including the session link, shortly.</p>

<p>Thank you for using <strong>TutorLink</strong>. We look forward to an engaging and productive session.</p>

<p>Best regards,</p>
<p><strong>TutorLink Team</strong></p>
</body>
</html>
    `
  return emailtext
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


module.exports={
  GenerateLiveSessionRequestEmailText,
  GenerateLiveSessionRequestStatusEmail
}