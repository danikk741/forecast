const mongoose = require('mongoose');

let citySchema = new mongoose.Schema({
	id: Number,
	name: String,
	country: String
});

module.exports = mongoose.model('City', citySchema);
