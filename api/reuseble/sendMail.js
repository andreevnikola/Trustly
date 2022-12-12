const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'quksolk@outlook.com',
    pass: 'NikolaAndreev_2008'
  }
});

function mail(reciever, subject, html){
    let mailOptions = {
        from: 'quksolk@outlook.com',
        to: reciever,
        subject: subject,
        html: html
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = { mail };