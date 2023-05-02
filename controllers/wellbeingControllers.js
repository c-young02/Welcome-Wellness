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
		console.log('Registered user');
		req.flash('registered', 'Registration complete');
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
	const successMsg = req.flash('success');
	db.getGoals(user)
		.then((goals) => {
			res.render('goals/goals', {
				title: 'Goals',
				user: req.user,
				goals: goals,
				message: successMsg,
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

exports.completeGoal = function (req, res) {
	const goalId = req.params._id;
	db.completeGoal(goalId)
		.then(() => {
			req.flash('success', 'Goal marked as complete');
			res.redirect('/goals');
		})
		.catch((err) => {
			console.log('Error: ');
			console.log(JSON.stringify(err));
			res.status(500).send('Error marking goal as complete');
		});
};

exports.searchGoal = function (req, res) {
	console.log('searching title', req.body.title);
	let user = req.user.user;
	let title = req.body.title;
	db.searchGoal(user, title)
		.then((goals) => {
			if (goals.length > 0) {
				res.render('goals/goals', {
					title: 'Goals',
					goals: goals,
				});
			} else {
				res.render('goals/goals', {
					title: 'Goal Not Found',
					user: req.user,
					error: 'Goal not found',
				});
			}
		})
		.catch((err) => {
			console.log('error handling search', err);
		});
};

exports.searchCompGoal = function (req, res) {
	console.log('searching title', req.body.title);
	let user = req.user.user;
	let title = req.body.title;

	db.searchCompGoal(user, title)
		.then((complete) => {
			if (complete.length > 0) {
				res.render('goals/completeGoals', {
					title: 'Complete Goals',
					complete: complete,
				});
			} else {
				res.render('goals/completeGoals', {
					title: 'Goal Not Found',
					user: req.user,
					error: 'Goal not found',
				});
			}
		})
		.catch((err) => {
			console.log('error handling search', err);
		});
};

exports.showUpdate = function (req, res) {
	console.log(`Request to update goal with ID ${req.params._id}`);
	let user = req.user.user;
	const goalId = req.params._id;
	db.showUpdate(user, goalId)
		.then((goal) => {
			console.log(`Rendering goal: ${JSON.stringify(goal)}`);
			res.render('goals/updateGoal', {
				title: 'Update Goal',
				user: req.user,
				goal: goal,
			});
		})
		.catch((err) => {
			console.log('Error: ');
			console.log(JSON.stringify(err));
		});
};
