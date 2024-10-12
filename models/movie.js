const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trime: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
}));

function validateMovie(movie) {
    const schema = {
        title: Joi.string().required().min(5),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number().required()
    };
    return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;
