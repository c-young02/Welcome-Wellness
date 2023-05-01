const wellbeingDAO = require('../models/goalModel');
const userDao = require('../models/userModel.js');
const auth = require('../auth/auth.js');
const { ensureLoggedIn } = require('connect-ensure-login');
const db = new wellbeingDAO();

exports.showHome = function (req, res) {
	res.render('home', {
		title: 'Welcome Wellness',
		user: req.user,
	});
};

exports.showNutrition = function (req, res) {
	res.render('protected/nutrition', {
		title: 'Nutrition',
		user: req.user,
	});
};

exports.showFitness = function (req, res) {
	res.render('protected/fitness', {
		title: 'Fitness',
		user: req.user,
	});
};

exports.showLifestyle = function (req, res) {
	res.render('protected/lifestyle', {
		title: 'Lifestyle',
		user: req.user,
	});
};

exports.showGoals = function (req, res) {
	res.render('protected/goals', {
		title: 'Goals',
		user: req.user,
	});
};

exports.showAbout = function (req, res) {
	res.render('about', {
		title: 'About',
		user: req.user,
	});
};

exports.showLogin = function (req, res) {
	res.render('user/login', {
		title: 'Sign in',
	});
};

exports.showRegister = function (req, res) {
	res.render('user/register', {
		title: 'Register',
	});
};

exports.showPrivacy = function (req, res) {
	res.render('privacy', {
		title: 'Privacy',
		user: req.user,
	});
};

exports.registerUser = function (req, res) {
	const user = req.body.username;
	const password = req.body.password;

	if (!user || !password) {
		res.send(401, 'No username or password');
		return;
	}
	userDao.lookup(user, function (err, u) {
		if (u) {
			res.send(401, 'User exists:', user);
			return;
		}
		userDao.create(user, password);
		console.log('Registered user', user, 'password', password);
		res.redirect('/login');
	});
};

exports.authorize = function (redirect) {
	return passport.authenticate('local', { failureRedirect: redirect });
};

exports.postLogin = function (req, res) {
	res.redirect('/');
};
