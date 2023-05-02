const express = require('express');
const router = express.Router();
const controller = require('../controllers/wellbeingControllers.js');
const auth = require('../auth/auth.js');
const { ensureLoggedIn } = require('connect-ensure-login');

router.get('/', controller.showHome);
router.get('/nutrition', ensureLoggedIn('/login'), controller.showNutrition);
router.get('/fitness', ensureLoggedIn('/login'), controller.showFitness);
router.get('/lifestyle', ensureLoggedIn('/login'), controller.showLifestyle);
router.get('/goals', ensureLoggedIn('/login'), controller.getGoals);
router.get('/complete', controller.showComplete);
router.get('/create', controller.createGoal);
router.get('/about', controller.showAbout);
router.get('/login', controller.checkNotAuthenticated, controller.showLogin);
router.get(
	'/register',
	controller.checkNotAuthenticated,
	controller.showRegister
);
router.post(
	'/register',
	controller.checkNotAuthenticated,
	controller.registerUser
);
router.post(
	'/login',
	controller.checkNotAuthenticated,
	auth.authorize('/login'),
	controller.postLogin
);
router.post('/create', ensureLoggedIn('/login'), controller.createEntry);

router.get('/logout', controller.logout);

router.use(function (req, res) {
	res.status(404);
	res.type('text/plain');
	res.send('404 Not found.');
});
router.use(function (err, req, res, next) {
	res.status(500);
	res.type('text/plain');
	res.send('Internal Server Error.');
});

module.exports = router;
