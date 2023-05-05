//Import and initialize express
const express = require('express');
const app = express();

//Load environment variables from the .env file
require('dotenv').config();
//Import the express-flash package
const flash = require('express-flash');

app.use(
	express.urlencoded({
		extended: true,
	})
);

//Sets up the public folder
const path = require('path');
const public = path.join(__dirname, 'public');
app.use(express.static(public));

//Bootstrap
app.use('/css', express.static('./node_modules/bootstrap/dist/css'));

//Set up session management and authentication
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
app.use(flash());

//Sets mustache as the view engine
const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

//Sets up routes
const router = require('./routes/wellbeingRoutes');
app.use('/', router);

// Start the server on the .env port number or 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.warn(`App listening on http://localhost:${PORT}`);
});
