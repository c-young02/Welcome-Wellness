exports.showHome = function (req, res) {
	res.render('home', {
		title: 'Welcome Wellness',
	});
};

exports.showNutrition = function (req, res) {
	res.render('protected/nutrition', {
		title: 'Nutrition',
	});
};

exports.showFitness = function (req, res) {
	res.render('protected/fitness', {
		title: 'Fitness',
	});
};

exports.showLifestyle = function (req, res) {
	res.render('protected/lifestyle', {
		title: 'Lifestyle',
	});
};

exports.showGoals = function (req, res) {
	res.render('protected/goals', {
		title: 'Goals',
	});
};

exports.showAbout = function (req, res) {
	res.render('about', {
		title: 'About',
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

exports.showPrivacy = function (req, res) {
	res.render('privacy', {
		title: 'Privacy',
	});
};
