// import * as express from "express";
import trainings from "./routes/trainings";
import index from "./routes/index";
import distribute from "./routes/distribute";
import preview from "./routes/preview";
import login from "./routes/login";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as passport from "passport"
import {Strategy} from "passport-local"
import credentials from "./data/credentials"
import {User} from "./data/types.d"
import * as session from "express-session"
import {processDistribute} from "./routes/distribute"

let static_folder = (process.argv.length>2)?process.argv[2]:'public'

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use('local-login', new Strategy(
    function(username, password, cb) {
        if (username==credentials.web.username && password==credentials.web.password) {
            return cb(null, {
                id: 0,
                username: username,
                password: password
            })
        } else {
            return cb(null, false)
        }
    })
)

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user:User, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id:number, cb) {
    if (id==0) {
        cb(null, {
            id: 0,
            username: credentials.web.username,
            password: credentials.web.password
        })
    } else {
        cb({error: "User not found"})
    }    
})


var app = express();
app.set('view engine', 'pug');
app.set('views', './views');
app.use(bodyParser.json()); // for parsing application/json
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Initialize Passport and restore authentication state, if any, from the session.
app.use(session({ secret: 'orienteeringisthebestthingsever' })); // session secret
app.use(passport.initialize());
app.use(passport.session());

app.post('/send-the-weekly-email', (req, res, next) => {
    if (process.env.NO_AUTH=="1" || (req.query.username == credentials.web.username && req.query.password == credentials.web.password)) {
        processDistribute(req, res, (req.query.to)?req.query.to:credentials.email.defaultTo)
    } else {
        return next()
    }
})

app.use('/login', login); // login

// route middleware to make sure they are logged in
app.use((req, res, next) => {

	// if user is authenticated in the session, carry on
    // Authenticate with query string if we are in test mode
	if (req.isAuthenticated() || process.env.NO_AUTH=="1" || (process.env.TEST_ENVIRONMENT=="1" && req.query.username == credentials.web.username && req.query.password == credentials.web.password)) {
		return next();
    }

	// if they aren't redirect them to the login page
	res.redirect('/login');
})

app.use('/', express.static(static_folder));
app.use('/preview', preview); // trainings api
app.use('/trainings', trainings); // trainings api
app.use('/distribute', distribute); // distribution api

interface Error{
    status?: number;
    message?: string;
}

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err: Error, req: express.Request, res: express.Response, next :express.NextFunction) => {
        res.status(err['status'] || 500);
        res.setHeader('Content-Type', 'text/json');
        res.send({
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.status || 500);
    res.setHeader('Content-Type', 'text/json');
    res.send({
        message: err.message,
        error: {}
    });
});

export default app