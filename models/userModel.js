const Datastore = require('nedb');
const bcrypt = require('bcrypt');
const saltRounds = 10;
class UserDAO {
	constructor(dbFilePath) {
		if (dbFilePath) {
			//embedded
			this.db = new Datastore({ filename: dbFilePath, autoload: true });
		} else {
			//in memory
			this.db = new Datastore();
		}
	}

	//Inserts a test user mainly for using DB in memory
	init() {
		this.db.insert({
			user: 'CYoung',
			password: '$2a$10$UqmWOpwKJ//iEr8oCNYAH.loCxtjViSGjzMRciA6mMYHz06coZuky',
		});
		console.log('Inserted test user');
		return this;
	}

	//Creates a new user with the given username and the hashed password
	create(username, password) {
		const that = this;
		//Hashes the password using bcrypt
		bcrypt.hash(password, saltRounds).then(function (hash) {
			var entry = {
				user: username,
				password: hash,
			};
			//Inserts the user into the database
			that.db.insert(entry, function (err) {
				if (err) {
					console.log("Can't insert user: ", username);
				}
			});
		});
	}

	//Checks if the user already exists in the database
	lookup(user, cb) {
		this.db.find({ user: user }, function (err, entries) {
			if (err) {
				return cb(null, null);
			} else {
				if (entries.length == 0) {
					return cb(null, null);
				}
				return cb(null, entries[0]);
			}
		});
	}
}
const dao = new UserDAO();
dao.init();
module.exports = dao;
