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

const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

const router = require('./routes/wellbeingRoutes');
app.use('/', router);

app.listen(process.env.PORT || 3000, () => {
	console.log('Server started on port 3000, ctrl^c to quit.');
});
