
var nodemailer = require('nodemailer');

const SendNotificationEmail=(EmailRecipent,Subject,emailtext)=>{

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tutorlink2025@gmail.com',
    pass: process.env.GOOGLE_APP_PASSWORD
  }
});

var mailOptions = {
  from: 'tutorlink2025@gmail.com',
  to: EmailRecipent,
  subject: Subject,
  html: emailtext
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
      console.log('Email sent: ' + info.response);
  }
});


return true

}



module.exports={SendNotificationEmail}