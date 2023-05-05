const wellbeingDAO = require('../models/goalModel');
const db = new wellbeingDAO();
db.init(); //Initializes test data

//Renders create goal page
exports.createGoal = function (req, res) {
	res.render('goals/createGoal', {
		title: 'Create Goal',
		user: req.user,
	});
};

//Creates a goal entry
exports.createEntry = function (req, res) {
	console.log('Creating new entry');
	const user = req.user.user;
	if (!user) {
		console.log('no user');
		response.status(400).send('Entries must have an author.');
		return;
	}
	//Takes values from the form and passes them to the goal model
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

//Displays a list of incomplete goals for the user
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

//Displays a list of complete goals for the user
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

//Marks a goal as complete
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

//Renders searched incomplete goals
exports.searchGoal = function (req, res) {
	console.log('searching title', req.body.title);
	let user = req.user.user;
	let title = req.body.title;
	let completion = false;
	db.searchGoal(user, title, completion)
		.then((goals) => {
			if (goals.length > 0) {
				res.render('goals/goals', {
					title: 'Goals',
					goals: goals,
					user: req.user,
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

//Renders searched complete goals
exports.searchCompGoal = function (req, res) {
	console.log('searching title', req.body.title);
	let user = req.user.user;
	let title = req.body.title;
	let completion = true;
	db.searchGoal(user, title, completion)
		.then((goals) => {
			if (goals.length > 0) {
				res.render('goals/completeGoals', {
					title: 'Complete Goals',
					user: req.user,
					complete: goals,
				});
			} //if no goals are found displays a message letting the user know
			else {
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

//Renders a form to update a goal
exports.showUpdate = function (req, res) {
	console.log(`Attempting to update goal with ID ${req.params._id}`);
	let user = req.user.user;
	let goalId = req.params._id;

	db.showUpdate(user, goalId)
		.then((goal) => {
			res.render('goals/updateGoal', {
				title: 'Modify Goal',
				user: req.user,
				goal: goal,
			});
		})
		.catch((err) => {
			console.log(JSON.stringify(err));
		});
};

//Handles the form details for the goal update
exports.updateGoal = function (req, res) {
	const goalId = req.params._id;
	const updatedGoal = {
		title: req.body.title,
		description: req.body.description,
		type: req.body.type,
		repetitions: req.body.repetitions,
		date: req.body.date,
		compDate: req.body.compDate,
	};
	db.updateGoal(goalId, updatedGoal)
		.then(() => {
			req.flash('success', 'Goal updated');
			res.redirect('/goals');
		})
		.catch((err) => {
			console.log('Error: ');
			console.log(JSON.stringify(err));
			res.status(500).send('Error updating goal');
		});
};

//Deletes the goal
exports.deleteGoal = function (req, res) {
	const goalId = req.params._id;
	let user = req.user.user;
	db.deleteGoal(goalId, user)
		.then(() => {
			console.log(
				`Goal with ID ${goalId} successfully deleted for user ${user}.`
			);
			req.flash('success', 'Goal deleted');
			res.redirect('/goals');
		})
		.catch((err) => {
			console.log(JSON.stringify(err));
			res.status(500).send('Error deleting goal');
		});
};
