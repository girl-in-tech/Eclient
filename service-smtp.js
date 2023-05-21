const nodemailer = require("nodemailer");
// require('dotenv').config();
// async..await is not allowed in global scope, must use a wrapper
exports.sendEmail = async function (data
) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    // port: 587,
    // secure: false, 
    auth: {
        user: process.env.USER_POP,
        pass: process.env.PASSWORD_POP, // generated ethereal password
    },
  });

   let mailOptions = {};
   mailOptions["to"] = data.to;
   if(data.subject){
    mailOptions["subject"] = data.subject;
   }

   if(data.text){
    mailOptions["text"] = data.replyTo;
   }

   mailOptions["text"] = data.text;
   if(data.replyTo){
    mailOptions["replyTo"] = data.replyTo;
   }
    let fil = data.filename;
    if(fil.length==0) fil = null;
   if(data.filename){
    mailOptions["attachments"]=[]
    mailOptions["attachments"].push({
        filename:  data.filename,//'how_to_add_summernote_editor_in_laravel.png',
        path: `./attachments/${data.filename}` //'./u
    });
   }
  
  // send mail with defined transport object
  let info = await transporter.sendMail(
    mailOptions

  );

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

}


