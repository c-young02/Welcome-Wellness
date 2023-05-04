const userDao = require('../models/userModel.js');
const auth = require('../auth/auth.js');

//Renders the login page
exports.showLogin = function (req, res) {
	const registered = req.flash('registered');
	res.render('user/login', {
		title: 'Sign in',
		message: registered,
	});
};

//rRenders the register page
exports.showRegister = function (req, res) {
	const failureMsg = req.flash('failure');
	res.render('user/register', {
		title: 'Register',
		message: failureMsg,
	});
};

//Handles the user registering an account
exports.registerUser = function (req, res) {
	const user = req.body.username;
	const password = req.body.password;

	if (!user || !password) {
		res.send(401, 'No username or password');
		return;
	}
	//If the username is already used, displays an error message and prevents creation
	userDao.lookup(user, function (err, u) {
		if (u) {
			req.flash('failure', 'User already exists');
			res.redirect('/register');
			return;
		} //Registers the user and redirects to the home page
		userDao.create(user, password);
		console.log('Registered', user);
		req.flash('registered', 'Registration complete');
		res.redirect('/login');
	});
};

//Brings failed authentication attempts back to the login page with an error message
exports.authenticate = function () {
	return auth.passport.authenticate('local', {
		failureRedirect,
		failureFlash,
	});
};

//Redirects successful logins to the home page
exports.postLogin = function (req, res) {
	res.redirect('/');
};

//Logs the user out
exports.logout = function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
};

//Redirects the user to the home page if they are logged in
exports.checkNotAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/');
	}
	next();
};
