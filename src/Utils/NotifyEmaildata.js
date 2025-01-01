
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
module.exports={
    GenerateLiveSessionRequestEmailText
}

