const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
dotenv.config();

const EMAIL = process.env.AUTH_EMAIL;
const PASSWORD = process.env.AUTH_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL,
    pass: PASSWORD
  }
});

// transporter.verify((error, success) => {
//   if(error){
//     console.log(error)
//   }else{
//     console.log('Ready for messages');
//     console.log(success)
//   }
// })

function mailer(userEmail, plainPassword) {

  console.log('test')
  const mailOptions = {
    from: EMAIL, // sender address
    to: userEmail, // list of receivers
    subject: 'Congratulation, Your registration successfully',
    html: `<h1>Congratulation</h1><p>Your registration has been successful.</p><br/><b>
    <p>Here your detail account :</p></br>
    <p>Email : ${userEmail}</p></br>
    <p>Password : ${plainPassword}</p></br>`
  }

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
        res.send('Please try again');
      } else {
        console.log('Message sent: %s', info.messageId);
        res.send('Thanks for registering! Please check your email for detail account.')
  }});
}

module.exports = mailer;