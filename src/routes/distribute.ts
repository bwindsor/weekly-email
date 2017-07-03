
import * as express from "express";
import * as dbread from "../data/read"
import * as pug from "pug"
import * as inlineCss from "inline-css"
import sendMail from "../send-mail"
import credentials from '../data/credentials'
import * as fs from 'fs'
var createTextVersion = require("textversionjs");

const FROM_ADDRESS = credentials.email.from_address;
const TO_ADDRESS = credentials.email.to_address;
const TO_ADDRESS_TEST = credentials.email.to_address_test;
const SUBJECT = 'Orienteering This Week';

const router = express.Router();

// Distribute a training
router.post('/', (req, res) => {
    dbread.getTrainings(null, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            pug.renderFile('./views/weekly-email.pug', {data, welcome_text: (req.body.welcome_text)?req.body.welcome_text:[]}, (err, html) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    inlineCss(html, {url: ' '}).then(inlinedHtml => {
                        sendMail({
                            from: FROM_ADDRESS,
                            to: (req.query.test==="0")?TO_ADDRESS:TO_ADDRESS_TEST,
                            subject: SUBJECT,
                            text: createTextVersion(html),
                            html: inlinedHtml
                        });
                        res.setHeader('Content-Type', 'text/html')
                        res.status(200).send(html)
                    }).catch(err => {
                        res.status(500).send(err);
                    })
                }
            })
        }
    })
});

export default router;