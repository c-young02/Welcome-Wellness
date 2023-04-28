const wellbeingDAO = require('../models/goalModel');
const userDao = require('../models/userModel.js');

const db = new wellbeingDAO();
db.init();

exports.showHome = function (req, res) {
	res.render('home', {
		title: 'Home',
	});
};

exports.showAbout = function (req, res) {
	res.render('about', {
		title: 'About',
	});
};
