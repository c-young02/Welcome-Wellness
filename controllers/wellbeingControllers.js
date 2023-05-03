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

exports.showAbout = function (req, res) {
	res.render('about', {
		title: 'About',
		user: req.user,
	});
};
