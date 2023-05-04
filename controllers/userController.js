const userDao = require('../models/userModel.js');
const auth = require('../auth/auth.js');

exports.showLogin = function (req, res) {
	const registered = req.flash('registered');
	res.render('user/login', {
		title: 'Sign in',
		message: registered,
	});
};

exports.showRegister = function (req, res) {
	const failureMsg = req.flash('failure');
	res.render('user/register', {
		title: 'Register',
		message: failureMsg,
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
			req.flash('failure', 'User already exists');
			res.redirect('/register');
			return;
		}
		userDao.create(user, password);
		console.log('Registered', user);
		req.flash('registered', 'Registration complete');
		res.redirect('/login');
	});
};

exports.authenticate = function () {
	return auth.passport.authenticate('local', {
		failureRedirect,
		failureFlash,
	});
};

exports.postLogin = function (req, res) {
	res.redirect('/');
};

exports.logout = function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
};

exports.checkNotAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/');
	}
	next();
};
