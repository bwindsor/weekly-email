
import * as express from "express";
import * as dbread from "../data/read"
import * as pug from "pug"
import * as inlineCss from "inline-css"
import sendMail from "../send-mail"
import credentials from '../data/credentials'
import * as fs from 'fs'
import {} from ''
var createTextVersion = require("textversionjs");

const FROM_ADDRESS = credentials.email.from;
const TO_ADDRESS = credentials.email.to;
const TO_ADDRESS_TEST = credentials.email.toTest;
const SUBJECT = 'Orienteering This Week';

const router = express.Router();

// Distribute a training
router.post('/', (req, res) => {
    // Filter for only future data
    let filters: dbread.TrainingFilters = {
        after: (new Date()).getTime()/1000,
        before: null
    }

    dbread.getTrainings(filters, (err, data) => {
        if (err) {
            res.status(500).json({error: err});
            return;
        }
        if (req.query.limittoweek==="1") {
            let timeNow = (new Date()).getTime()/1000
            let midnightTonight = Math.ceil(timeNow/86400)*86400
            if (data.length == 0 || (data[0].date_start > (midnightTonight + 7*86400))) {
                res.status(200).json({info: "Email not sent because no data within a week"})
                return;
            }
        }

        pug.renderFile('./views/weekly-email.pug', {data, welcome_text: (req.body.welcome_text)?req.body.welcome_text:[]}, (err, html) => {
            if (err) {
                res.status(500).json({error: err});
            } else {
                inlineCss(html, {url: ' '}).then(inlinedHtml => {
                    if (process.env.TEST_ENVIRONMENT != "1") {
                        sendMail({
                            from: FROM_ADDRESS,
                            to: (req.query.test==="0")?TO_ADDRESS:TO_ADDRESS_TEST,
                            subject: SUBJECT,
                            text: createTextVersion(html),
                            html: inlinedHtml
                        }, (err, info) => {
                            if (err) {
                                res.status(500).json({error: err})
                            } else {
                                res.setHeader('Content-Type', 'text/html')
                                res.status(200).send(html)
                            }
                        });
                    } else {
                        res.status(200).send(html)
                    }
                }).catch(err => {
                    res.status(500).json({error: err});
                })
            }
        })
    })
});

export default router;