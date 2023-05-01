const express = require('express');
const app = express();
require('dotenv').config(); // loads data from .env file

app.use(
	express.urlencoded({
		extended: true,
	})
);

const path = require('path');
const public = path.join(__dirname, 'public');
app.use(express.static(public));

app.use('/css', express.static('./node_modules/bootstrap/dist/css'));

const session = require('express-session');
const auth = require('./auth/auth');
const passport = require('passport');

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());
auth.init(app);

const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

const router = require('./routes/wellbeingRoutes');
app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.warn(`App listening on http://localhost:${PORT}`);
});
