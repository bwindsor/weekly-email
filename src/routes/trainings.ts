import * as express from "express";
import { TrainingSession } from "../data/types.d"
import * as dbcreate from '../data/create'
import * as dbupdate from '../data/update'
import * as dbdelete from '../data/delete'
import * as dbread from '../data/read'

const router = express.Router();

// Get a training by ID
router.get('/:id', (req, res) => {
    dbread.readTraining(req.params.id, (err: any, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(data[0]);
        }
    })
});

// Get trainings with query parameters
router.get('/', (req, res) => {
    let x: number
    let filters: dbread.TrainingFilters = {
        before: null,
        after: null,
        fields: ["id","date_start","location_name","start_lat","start_lon"]
    };
    if (req.query.after) {
         x = Number.parseInt(req.query.after);
         if (Number.isNaN(x)) {
            res.status(400).send("Invalid after query");
            return;
         }
        filters.after = req.query.after;
    }
    if (req.query.before) {
         x = Number.parseInt(req.query.before);
         if (Number.isNaN(x)) {
            res.status(400).send("Invalid before query");
            return;
         }
        filters.before = req.query.before;
    }
    dbread.getTrainings(filters, (err:any, data:any) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(data);
        }
    })
})

// Update a training
router.put('/:id', (req, res) => {
    if (req.body.id != req.params.id) {
        res.status(500).send({error: "ID of data must match ID of URL"});
        return;
    }
    dbupdate.updateTraining(req.body, (err:any) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send();
        }
    });
})

// Create a training
router.post('/', (req, res) => {
    dbcreate.createTraining(req.body, (err:any, createStatus) => {
        if (err) {
            res.status(500).send(err);
        } else {
            dbread.readTraining(createStatus.insertId, (err, data) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200);
                    res.send(data);
                }
            })
        }
    })
})

// Delete a training
router.delete('/:id', (req, res) => {
    dbdelete.deleteTraining(req.params.id, (err : any) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send();
        }
    });
})

export default router;