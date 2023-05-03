const nedb = require('nedb');
class Wellbeing {
	constructor(dbFilePath) {
		if (dbFilePath) {
			this.db = new nedb({ filename: dbFilePath, autoload: true });
			console.log('DB connected to ' + dbFilePath);
		} else {
			this.db = new nedb();
		}
	}

	init() {
		//!remove
		this.db.insert({
			author: 'CYoung',
			title: 'Run',
			description: 'go for a run',
			type: 'person-running',
			repetitions: 2,
			date: '2023-05-30',
			complete: false,
			compDate: '',
			_id: 'uerht9uhw',
		});
		//for later debugging
		console.log('Goal 1 inserted');

		this.db.insert({
			author: 'CYoung',
			title: 'Sleep',
			description: 'Get 8 hours sleep',
			type: 'heart-pulse',
			repetitions: '',
			date: '2023-05-29',
			complete: false,
			compDate: '',
			_id: 'dfgdfghtr563',
		});
		//for later debugging
		console.log('Goal 2 inserted');

		this.db.insert({
			author: 'CYoung',
			title: 'Eat',
			description: 'Eat some healthy food',
			type: 'apple-whole',
			repetitions: '',
			date: '12-05-22',
			complete: true,
			compDate: '2023-06-29',
			_id: '34hidf97',
		});
		//for later debugging
		console.log('Goal 3 inserted');
	}

	getEntries() {
		//return a Promise object, which can be resolved or rejected
		return new Promise((resolve, reject) => {
			//find(author:'Peter) retrieves the data,
			//with error first callback function, err=error, entries=data
			this.db.find({ author: user }, function (err, entries) {
				//if error occurs reject Promise
				if (err) {
					reject(err);
					//if no error resolve the promise and return the data
				} else {
					resolve(entries);
					//to see what the returned data looks like
					console.log('getEntries() returns: ', entries);
				}
			});
		});
	}

	addEntry(user, title, description, type, repetitions, date) {
		var entry = {
			author: user,
			title: title,
			description: description,
			type: type,
			repetitions: repetitions,
			date: date,
			complete: false,
			compDate: '',
		};
		console.log('entry created', entry);
		this.db.insert(entry, function (err, doc) {
			if (err) {
				console.log('Error inserting document', subject);
			} else {
				console.log('document inserted into the database', doc);
			}
		});
	}

	getGoals(user) {
		return new Promise((resolve, reject) => {
			this.db.find({ author: user, complete: false }, function (err, goals) {
				if (err) {
					reject(err);
				} else {
					resolve(goals);
					console.log('getGoals returns: ', goals);
				}
			});
		});
	}

	getCompleteGoals(user) {
		return new Promise((resolve, reject) => {
			this.db.find({ author: user, complete: true }, function (err, complete) {
				if (err) {
					reject(err);
				} else {
					resolve(complete);
					console.log('getCompleteGoals returns: ', complete);
				}
			});
		});
	}

	completeGoal(goalId) {
		return new Promise((resolve, reject) => {
			this.db.update(
				{ _id: goalId },
				{
					$set: {
						complete: true,
						compDate: new Date().toISOString().split('T')[0], //sets complete date to current date
					},
				},
				{},
				(err, numUpdated) => {
					if (err) {
						reject(err);
					} else {
						resolve(numUpdated);
					}
				}
			);
		});
	}

	//Uses regular expression to perform partial search, i makes it case insensitive
	searchGoal(user, title) {
		return new Promise((resolve, reject) => {
			const regExpression = new RegExp(title, 'i');
			this.db.find(
				{ author: user, title: { $regex: regExpression }, complete: false },
				function (err, goals) {
					if (err) {
						reject(err);
					} else {
						resolve(goals);
						console.log('Search returns: ', goals);
					}
				}
			);
		});
	}

	searchCompGoal(user, title) {
		return new Promise((resolve, reject) => {
			const regExpression = new RegExp(title, 'i');
			this.db.find(
				{ author: user, title: { $regex: regExpression }, complete: true },
				function (err, complete) {
					if (err) {
						reject(err);
					} else {
						resolve(complete);
						console.log('Search returns:', complete);
					}
				}
			);
		});
	}

	showUpdate(user, goalId) {
		return new Promise((resolve, reject) => {
			console.log(`Finding goal ${goalId} for user ${user}`);
			this.db.find({ author: user, _id: goalId }, function (err, goal) {
				if (err) {
					console.error(`Error finding goal: ${err}`);
					reject(err);
				} else {
					console.log(`Found goal: ${JSON.stringify(goal)}`);
					resolve(goal);
				}
			});
		});
	}

	updateGoal(goalId, updatedGoal) {
		return new Promise((resolve, reject) => {
			this.db.update(
				{ _id: goalId },
				{ $set: updatedGoal },
				{},
				(err, numUpdated) => {
					if (err) {
						reject(err);
					} else {
						console.log(`numUpdated: ${numUpdated}`);
						console.log(`updatedGoal: ${JSON.stringify(updatedGoal)}`);
						resolve(numUpdated);
					}
				}
			);
		});
	}

	deleteGoal(goalId, user) {
		console.log(
			`Attempting to delete goal with ID ${goalId} for user ${user}.`
		);
		return new Promise((resolve, reject) => {
			this.db.remove({ _id: goalId, author: user }, {}, (err, numRemoved) => {
				if (err) {
					console.log(`Error deleting goal: ${err}`);
					reject(err);
				} else {
					console.log(`numRemoved: ${numRemoved}`);
					resolve(numRemoved);
				}
			});
		});
	}
}

module.exports = Wellbeing;
