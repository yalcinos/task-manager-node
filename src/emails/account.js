require("dotenv").config();
const sgMail = require("@sendgrid/mail");

const sendgridAPIKey = process.env.EMAIL_API_KEY;

sgMail.setApiKey(sendgridAPIKey);

sgMail.send({
  to: "yalcintatar41@gmail.com",
  from: "yalcintatar41@gmail.com",
  subject: "This is subject",
  text: "Text is Text",
});
