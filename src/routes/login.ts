import * as express from "express";
import * as passport from "passport"

const router = express.Router();

router.post('/', passport.authenticate('local-login', {
		successRedirect : '/', // redirect to the secure section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
}));

router.get('/', (req, res) => {
    res.status(200);
    res.render("login");
});
export default router;