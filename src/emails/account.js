const sgMail = require("@sendgrid/mail");
const sendgridAPIKey =
  "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";

sgMail.setApiKey(sendgridAPIKey);

sgMail.send({
  to: "yalcintatar41@gmail.com",
  from: "yalcintatar41@gmail.com",
  subject: "This is subject",
  text: "Text is Text",
});
