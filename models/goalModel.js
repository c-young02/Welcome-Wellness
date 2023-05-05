const nedb = require('nedb');
class Wellbeing {
	constructor(dbFilePath) {
		if (dbFilePath) {
			this.db = new nedb({ filename: dbFilePath, autoload: true });
			console.log('DB connected to ' + dbFilePath);
		} //If no db path is specified it is created in memory
		else {
			this.db = new nedb();
			console.log('Running DB in memory');
		}
	}

	//Inserts test data for test user
	init() {
		const testGoals = [
			{
				author: 'CYoung',
				title: 'Run',
				description: 'Go for a run',
				type: 'person-running',
				repetitions: 2,
				date: '2023-05-30',
				complete: false,
				compDate: '',
				_id: 't4jZE0tpeaJCHdSH',
			},
			{
				author: 'CYoung',
				title: 'Sleep',
				description: 'Get 8 hours sleep',
				type: 'heart-pulse',
				repetitions: '',
				date: '2023-05-29',
				complete: false,
				compDate: '',
				_id: 'Mkyb3oOPgZfPOSxl',
			},
			{
				author: 'CYoung',
				title: 'Eat',
				description: 'Eat some healthy food',
				type: 'apple-whole',
				repetitions: '',
				date: '12-05-22',
				complete: true,
				compDate: '2023-06-29',
				_id: '34hi5NulXCwneySdKkNrdf97',
			},
		];
		testGoals.forEach((goal) => {
			this.db.insert(goal);
		});
		console.log('Test goals inserted');
	}

	getEntries() {
		//Returns a Promise object, which can be resolved or rejected
		return new Promise((resolve, reject) => {
			//Finds the entries for the user currently logged in
			this.db.find({ author: user }, function (err, entries) {
				//If error occurs reject Promise
				if (err) {
					reject(err);
					//If no error resolve the promise and return the data
				} else {
					resolve(entries);
					console.log('getEntries() returns: ', entries);
				}
			});
		});
	}

	addEntry(user, title, description, type, repetitions, date) {
		//Sets what matches each field for the entry
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
		//Inserts the entry array into the DB
		this.db.insert(entry, function (err, doc) {
			if (err) {
				console.log('Error inserting document', title);
			} else {
				console.log('document inserted into the database', doc);
			}
		});
	}

	//Searches the DB for the users incomplete goals
	getGoals(user) {
		return new Promise((resolve, reject) => {
			this.db.find({ author: user, complete: false }, function (err, goals) {
				if (err) {
					reject(err);
				} else {
					resolve(goals);
				}
			});
		});
	}

	//Searches the DB for the users complete goals
	getCompleteGoals(user) {
		return new Promise((resolve, reject) => {
			this.db.find({ author: user, complete: true }, function (err, complete) {
				if (err) {
					reject(err);
				} else {
					resolve(complete);
				}
			});
		});
	}

	//Sets the goal completion status to complete
	completeGoal(goalId) {
		return new Promise((resolve, reject) => {
			this.db.update(
				{ _id: goalId },
				{
					$set: {
						complete: true,
						//sets the completion date to the current date
						compDate: new Date().toISOString().split('T')[0],
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

	//Searches for the users goals
	searchGoal(user, title, completion) {
		return new Promise((resolve, reject) => {
			//Uses regular expression to perform partial search, i makes it case insensitive
			const regExpression = new RegExp(title, 'i');
			this.db.find(
				{
					author: user,
					title: { $regex: regExpression },
					complete: completion,
				},
				function (err, goals) {
					if (err) {
						console.error(`Error searching goal: ${err}`);
						reject(err);
					} else {
						resolve(goals);
					}
				}
			);
		});
	}

	//finds the goal matching the user and goal ID
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

	//Updates the goal to the values in the updatedGoal array
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
						console.log(`updatedGoal: ${JSON.stringify(updatedGoal)}`);
						resolve(numUpdated);
					}
				}
			);
		});
	}

	//Deletes the goal matching the user and goal ID
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
