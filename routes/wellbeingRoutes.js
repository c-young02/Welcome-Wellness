const express = require('express');
const router = express.Router();
const controller = require('../controllers/wellbeingControllers.js');
const auth = require('../auth/auth.js');
const { ensureLoggedIn } = require('connect-ensure-login');

router.get('/', controller.showHome);
router.get('/nutrition', controller.showNutrition);
router.get('/fitness', controller.showFitness);
router.get('/lifestyle', controller.showLifestyle);
router.get('/goals', controller.showGoals);
router.get('/about', controller.showAbout);
router.get('/login', controller.showLogin);
router.get('/register', controller.showRegister);
router.get('/privacy', controller.showPrivacy);

router.post('/register', controller.registerUser);
router.post('/login', auth.authorize('/login'), controller.postLogin);

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
