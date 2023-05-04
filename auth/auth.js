const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

exports.init = function (app) {
	// Use passport-local strategy to authenticate users
	passport.use(
		new LocalStrategy(function (username, password, cb) {
			// Look up user
			userModel.lookup(username, function (err, user) {
				if (err) {
					console.log('Error looking up user', err);
					return cb(err);
				}
				// If user is not found, return false to the callback
				if (!user) {
					console.log('User ', username, ' not found');
					return cb(null, false, {
						message: 'Incorrect username or password.',
					});
				}
				// Compare provided password with stored password
				bcrypt.compare(password, user.password, function (err, result) {
					if (result) {
						// Returns user object if the password is correct
						cb(null, user);
						// Returns false if the password is wrong
					} else {
						cb(null, false, { message: 'Incorrect username or password.' });
					}
				});
			});
		})
	);
	// Serialize user into session
	passport.serializeUser(function (user, cb) {
		cb(null, user.user);
	});

	// Deserialize user  from session
	passport.deserializeUser(function (id, cb) {
		userModel.lookup(id, function (err, user) {
			if (err) {
				return cb(err);
			}
			cb(null, user);
		});
	});
	app.use(passport.initialize());
	app.use(passport.session());
};
exports.authenticate = function (redirect) {
	return passport.authenticate('local', {
		failureRedirect: redirect,
		failureFlash: true,
	});
};
