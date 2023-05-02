const wellbeingDAO = require('../models/goalModel');
const userDao = require('../models/userModel.js');
const auth = require('../auth/auth.js');
const { ensureLoggedIn } = require('connect-ensure-login');
const db = new wellbeingDAO();
db.init(); //!remove

exports.showHome = function (req, res) {
	res.render('home', {
		title: 'Welcome Wellness',
		user: req.user,
	});
};

exports.showNutrition = function (req, res) {
	res.render('wellbeing/nutrition', {
		title: 'Nutrition',
		user: req.user,
	});
};

exports.showFitness = function (req, res) {
	res.render('wellbeing/fitness', {
		title: 'Fitness',
		user: req.user,
	});
};

exports.showLifestyle = function (req, res) {
	res.render('wellbeing/lifestyle', {
		title: 'Lifestyle',
		user: req.user,
	});
};

exports.createGoal = function (req, res) {
	res.render('goals/createGoal', {
		title: 'Create Goal',
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

exports.createEntry = function (req, res) {
	console.log('Creating new entry');
	const user = req.user.user;
	if (!user) {
		console.log('no user');
		response.status(400).send('Entries must have an author.');
		return;
	}
	db.addEntry(
		user,
		req.body.title,
		req.body.description,
		req.body.type,
		req.body.repetitions,
		req.body.date
	);
	res.redirect('/goals');
};

exports.getGoals = function (req, res) {
	let user = req.user.user;
	db.getGoals(user)
		.then((goals) => {
			res.render('goals/goals', {
				title: 'Goals',
				user: req.user,
				goals: goals,
			});
		})
		.catch((err) => {
			console.log('Error: ');
			console.log(JSON.stringify(err));
		});
};

exports.getCompleteGoals = function (req, res) {
	let user = req.user.user;
	db.getCompleteGoals(user)
		.then((complete) => {
			res.render('goals/completeGoals', {
				title: 'Complete Goals',
				user: req.user,
				complete: complete,
			});
		})
		.catch((err) => {
			console.log('Error: ');
			console.log(JSON.stringify(err));
		});
};
