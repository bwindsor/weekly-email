# weekly-email
For sending the weekly email out for training nights.

## Setup
```sh
git clone https://github.com/bwindsor/weekly-email.git
npm install
npm run build
npm run setup
npm start
```

From [this stackoverflow question](https://stackoverflow.com/questions/26196467/sending-email-via-node-js-using-nodemailer-is-not-working):
1. Search "Gmail API" from the google API console and click "Enable"
2. Follow the steps [supplied by Google](https://developers.google.com/gmail/api/quickstart/nodejs). A slightly modified version of `quickstart.js` is already provided here. Use this one where the guide tells you to.
3. After following the steps in (2), the generated JSON file in your user directory will contain the `accessToken`, `refreshToken`, and `expires` attributes needed. The `clientId` and `clientSecret` are supplied in the `client_secret` JSON downloadable from the google API console.

Create a `credentials.json` file in the working directory of the project, which should look something like this:
```Json
{"email": {
    "user": "my-email@gmail.com",
    "clientId": "xxx.apps.googleusercontent.com",
    "clientSecret": "xxx",
    "refreshToken": "xxx",
    "accessToken": "xxx",
    "expires": 123,
    "from_address": "Ben Windsor<my-email@gmail.com>",
    "to_address": "Training List<their-email@lists.com>",
    "to_address_test": "Training List<my-test-email@lists.com>"
    },
"mysql": {
    "host": "localhost",
    "db_name": "trainings",
    "user": "training",
    "password": "password",
    "adminuser": "root",
    "adminpass": "password"
    }
}
```

## Running
Update `index.js` to contain the message you would like, then to run:
`npm start`

## Use as a module
```Javascript
const sendMail = require('./send-mail').default;

sendMail({
  from: 'My Name<my-name@gmail.com>',
  to: 'Your Name<your-name@gmail.com>',
  subject: 'Test message',
  text: 'Body text',
  html: '<b>Body</b> text'
});
```
where `mailOptions` is [as defined by nodemailer](https://nodemailer.com/message/)
