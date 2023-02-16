const nodemailer = require('nodemailer');


const emailHelper = async (option) => {
    const transporter =  nodemailer.createTransport(
        {
         host: process.env.SMPT_HOST,
         port: process.env.SMPT_PORT,
         auth: {
           user: process.env.SMPT_USER, // generated ethereal user
           pass: process.env.SMPT_PASS, // generated ethereal password
         },
       });
       
        const message = {
           from: 'sheetal@gmail.com', // sender address
           to: option.email, // list of receivers
           subject: option.subject, // Subject line
           text: option.message, // plain text body 
            
        }
       
       // send mail with defined transport object
        await transporter.sendMail(message);
}

module.exports = emailHelper





