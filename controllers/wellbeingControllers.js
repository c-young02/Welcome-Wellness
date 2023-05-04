//Renders the home page
exports.showHome = function (req, res) {
	res.render('home', {
		title: 'Welcome Wellness',
		user: req.user,
	});
};

//Renders the nutrition page
exports.showNutrition = function (req, res) {
	res.render('wellbeing/nutrition', {
		title: 'Nutrition',
		user: req.user,
	});
};

//Renders the fitness page
exports.showFitness = function (req, res) {
	res.render('wellbeing/fitness', {
		title: 'Fitness',
		user: req.user,
	});
};

//Renders the lifestyle page
exports.showLifestyle = function (req, res) {
	res.render('wellbeing/lifestyle', {
		title: 'Lifestyle',
		user: req.user,
	});
};

//Renders the about page
exports.showAbout = function (req, res) {
	res.render('about', {
		title: 'About',
		user: req.user,
	});
};
