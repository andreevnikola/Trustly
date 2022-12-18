// const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail')
require('dotenv').config();

// const transporter = nodemailer.createTransport({
//   auth: {
//     user: 'trustly@mail.bg',
//     pass: 'NikolaAndreev_2008'
//   }
// });

function mail(reciever, subject, html){
  sgMail.setApiKey(process.env.SENDGRID_KEY)
  console.log(reciever)
  console.log(html)
  console.log(subject)
  const msg = {
    to: reciever, // Change to your recipient
    from: 'trustly@mail.bg', // Change to your verified sender
    subject: subject,
    html: html,
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
    // let mailOptions = {
    //     from: 'quksolk@outlook.com',
    //     to: reciever,
    //     subject: subject,
    //     html: html
    //   };
      
    //   transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });
}

module.exports = { mail };