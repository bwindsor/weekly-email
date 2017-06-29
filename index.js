const sendMail = require('./send-mail').default;

sendMail({
  from: 'myaddress@gmail.com',
  to: 'myaddress@gmail.com',
  subject: 'Test message',
  text: 'Body text',
  html: '<b>Body</b> text'
});