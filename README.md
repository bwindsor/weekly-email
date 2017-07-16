[![Build Status](https://travis-ci.org/bwindsor/weekly-email.svg?branch=master)](https://travis-ci.org/bwindsor/weekly-email)

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

[Amazon web services SES](https://aws.amazon.com/ses/) is used to send emails. You'll need to get your `accessKeyId`, `secretAccessKey` and `region` and put them into the credentials file.

Copy the a `credentials_template.json` file in the working directory of the project to `credentials.json` and populate it, which should look something like this:
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
