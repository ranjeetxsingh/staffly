const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kumarpriyanshu762@gmail.com',
    pass: 'dhvm tywv onmj sycl' // or app password
  }
});

async function sendEventQrMail(toEmail, subject, htmlContent) {
  await transporter.sendMail({
    from: '"Aquameter" <kumarpriyanshu762@gmail.com>',
    to: toEmail,
    subject,
    html: htmlContent
  });
}

module.exports = { sendEventQrMail };
