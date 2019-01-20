require('dotenv').config();
const PORT = process.env.PORT || 3000;

const express = require('express'),
	app = express(),
	axios = require('axios'),
	City = require('./models/city'),
	mongoose = require('mongoose'),
	url = process.env.DATABASEURL;

app.set('view engine', 'ejs');
app.use(express.static('public'));
mongoose.connect(
	url,
	{ useNewUrlParser: true }
);

app.get('/', (req, res) => {
	res.redirect('/1526273');
});

app.get('/search', (req, res) => {
	let noMatch = null;
	const regex = new RegExp(escapeRegex(req.query.search), 'gi');
	City.find({ name: regex }).exec((err, cities) => {
		if (err || !cities) {
			return res.redirect('back');
		}
		if (cities.length < 1) {
			noMatch = 'No cities match that query, please try again.';
		}
		res.render('search', {
			cities: cities,
			noMatch: noMatch
		});
	});
});

app.get('/:id', (req, res) => {
	axios
		.all([
			axios.get(
				'http://api.openweathermap.org/data/2.5/forecast?id=' +
					req.params.id +
					'&APPID=' +
					process.env.APPID +
					'&units=metric'
			),
			axios.get(
				'http://api.openweathermap.org/data/2.5/weather?id=' +
					req.params.id +
					'&APPID=' +
					process.env.APPID +
					'&units=metric'
			)
		])
		.then(
			axios.spread((forecast, data) => {
				res.render('home', { data: data.data, forecast: forecast.data });
			})
		)
		.catch(err => {
			console.log('ERRROR!!!' + err.message);
		});
});

app.get('*', (req, res) => {
	res.send('Wrong url, dude!');
});

app.listen(PORT, () => {
	console.log('Server has started on port ' + PORT);
});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
