const sgMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendMail = async data => {
  const msg = { ...data, from: 'qseboy1998@gmail.com' };
  await sgMail.send(msg);
  return true;
};

module.exports = sendMail;
