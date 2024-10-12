const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const { Genre, validate } = require('../models/genre');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', async (req, res, next) => { 
    // throw new Error('Could no get the genres.');
    const genres = await Genre.find().sort('name');
    return res.status(200).send(genres);
});

router.get('/:id', validateObjectId, async (req, res) => {

    const genre = await Genre.findById(req.params.id);
    // const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send("The given genre id wasn't found");
    return res.status(200).send(genre);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let genre = new Genre({ name: req.body.name });
    await genre.save();
    res.send(genre);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(404).send(error.details[0].message);
    }
    // const genre = genres.find(g => g.id === parseInt(req.params.id));
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!genre) return res.status(404).send("The given genre id wasn't found");
    res.status(200).send(genre);
}); 

router.delete('/:id', [auth, admin], async (req, res) => {
    // const genre = genres.find(g => g.id === parseInt(req.params.id));
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).send("The given genre id wasn't found");
    // const index = genres.indexOf(genre);
    // genres.splice(index, 1);
    return res.status(200).send(genre);

});

module.exports = router;