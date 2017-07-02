const sendMail = require('./send-mail').default;

sendMail({
  from: 'Ben Windsor<benwindsor@gmail.com>',
  to: 'Bla Person<benwindsor@gmail.com>',
  subject: 'Test message',
  text: 'Body text',
  html: '<b>Body</b> text'
});