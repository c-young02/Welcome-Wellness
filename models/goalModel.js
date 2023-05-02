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
			type: 'Fitness',
			repetitions: 2,
			date: '12-05-22',
			complete: false,
			compDate: '',
		});
		//for later debugging
		console.log('Goal 1 inserted');

		this.db.insert({
			author: 'CYoung',
			title: 'Sleep',
			description: 'Get 8 hours sleep',
			type: 'Lifestyle',
			repetitions: '',
			date: '12-05-22',
			complete: false,
			compDate: '',
		});
		//for later debugging
		console.log('Goal 2 inserted');
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
	getEntriesByUser(authorName) {
		return new Promise((resolve, reject) => {
			this.db.find({ author: authorName }, function (err, entries) {
				if (err) {
					reject(err);
				} else {
					resolve(entries);
					console.log('getEntriesByUser returns: ', entries);
				}
			});
		});
	}
}
module.exports = Wellbeing;
