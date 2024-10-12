const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    return res.status(200).send(movies);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    // const movie = movies.find(g => g.id === parseInt(req.params.id));
    if (!movie) return res.status(404).send("The given movie id wasn't found");
    return res.status(200).send(movie);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid Genre.');

    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();
    res.send(movie);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(404).send(error.details[0].message);
    }

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid Genre ID');
    // const movie = movies.find(g => g.id === parseInt(req.params.id));
    const movie = await Movie.findByIdAndUpdate(req.params.id,
        {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            }
        },
        { new: true });
    if (!movie) return res.status(404).send("The given movie id wasn't found");
    res.status(200).send(movie);
}); 

router.delete('/:id', [admin, auth], async (req, res) => {
    // const movie = movies.find(g => g.id === parseInt(req.params.id));
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).send("The given movie id wasn't found");
    // const index = movies.indexOf(movie);
    // movies.splice(index, 1);
    return res.status(200).send(movie);

});

module.exports = router;