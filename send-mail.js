const nodemailer = require('nodemailer');
const fs = require('fs');

function sendMail(mailOptions) {
	
	fs.readFile('credentials.json', (err, content) => {
		if (err) {
			console.log(err);
		} else {
			sendAuthorisedMessage(JSON.parse(content), mailOptions);
		}
	})
	
}

function sendAuthorisedMessage(credentials, mailOptions) {

	let transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			type: 'OAuth2',
			user: credentials.user,
			clientId: credentials.clientId,
			clientSecret: credentials.clientSecret,
			refreshToken: credentials.refreshToken,
			accessToken: credentials.accessToken,
			expires: credentials.expires
		}
	});

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
		console.log(error);
	  } else {
		console.log('Email sent: ' + info.response);
	  }
	});
}

module.exports.default = sendMail;