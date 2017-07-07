import * as express from "express";
import * as dbread from "../data/read"

const router = express.Router();

router.get('/', (req, res) => {
    let filters: dbread.TrainingFilters = {
        after: (new Date()).getTime()/1000,
        before: null
    }

    dbread.getTrainings(filters, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200);
            res.render('weekly-email', {data});
        }
    })
});

export default router;