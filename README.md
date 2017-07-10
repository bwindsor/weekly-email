# weekly-email
For sending the weekly email out for training nights.

## Setup
You will need [MySQL server](https://dev.mysql.com/downloads/mysql/) installed, or access to a remote instance of it.
```sh
git clone https://github.com/bwindsor/weekly-email.git
npm install
npm run build
npm run setup
npm start
```

To specify a different static folder, use
```sh
node dist/index.js path/to/my/static/folder
```

From [this stackoverflow question](https://stackoverflow.com/questions/26196467/sending-email-via-node-js-using-nodemailer-is-not-working):
1. Search "Gmail API" from the google API console and click "Enable"
2. Follow the steps [supplied by Google](https://developers.google.com/gmail/api/quickstart/nodejs). A slightly modified version of `quickstart.js` is already provided here. Use this one where the guide tells you to.
3. After following the steps in (2), the generated JSON file in your user directory will contain the `accessToken`, `refreshToken`, and `expires` attributes needed. The `clientId` and `clientSecret` are supplied in the `client_secret` JSON downloadable from the google API console.

Create a `credentials.json` file in the working directory of the project, which should look something like this:
```Json
{
    "aws": {
        "accessKeyId": "aws-access-key-id",
        "secretAccessKey": "aws-secret-access-key",
        "region": "us-east-1"
    },
    "email": {
        "from": "Ben Windsor<mygmail@gmail.com>",
        "to": "Training List<theirgmail@lists.com>",
        "toTest": "Training List Test<myemail@gmail.com>"
    },
    "mysql": {
        "host": "localhost",
        "db_name": "trainings",
        "user": "username",
        "password": "password",
        "adminuser": "rootuser",
        "adminpass": "rootpass"
    },
    "web": {
        "username": "web-login-username",
        "password": "web-login-password"
    }
}
```

## Running
Update `index.js` to contain the message you would like, then to run:
`npm start`

## Testing
`npm run build` builds the source code including inline source maps and tests, outputting to the `build` directory
`npm run build-production` builds the source code without source maps or tests, outputting to the `dist` directory
`npm run test`

## Environment variables
`TEST_ENVIRONMENT` Setting this to `"1"` will mean the tests don't actually send the email (but do everything else) and will mean that the test table is used instead

`TABLE_NAME` To override the default table name of `trainings` then set this.

`NO_AUTH` to disable authorisation set this to `"1"`

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
