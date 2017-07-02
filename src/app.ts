// import * as express from "express";
import trainings from "./routes/trainings";
import index from "./routes/index";
import distribute from "./routes/distribute";
import * as bodyParser from "body-parser";
import * as express from "express";

var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use('/', express.static('public'));
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