import * as express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200);
    res.setHeader('Content-Type', 'text/plain');
    res.send("This is the home page!\n");
});

export default router;