const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const Fawn = require('fawn');
const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const auth = require('../middleware/auth');

// Fawn.init('mongodb://localhost/vidly');

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    return res.status(200).send(rentals);
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    // const movie = movies.find(g => g.id === parseInt(req.params.id));
    if (!rental) return res.status(404).send("The given rental id wasn't found");
    return res.status(200).send(rental);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid Customer.');
    
    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid Movie.');

    if(movie.numberInStock === 0)  return res.status(400).send('Movie is not in stock');

    let rental = new Rental({
        customer: {
            name: customer.name,
            phone: customer.phone,
            _id: customer._id
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
    });
    // rental = await rental.save();
    // movie.numberInStock--;
    // movie.save();
    // try {
    //     new Fawn.Task()
    //     .save('rentals', rental)
    //     .update('movies', { _id: movie._id }, {
    //     $inc: { numberInStock: -1 }
    //     })
    //     // .remove()
    //     .run();
    // res.send(rental);
    // } catch (ex) {
    //     res.status(500).send('Something Failed');
    // }
    const session = await mongoose.startSession();
    try {
    await session.withTransaction(async () => {
        const result = await rental.save();
        movie.numberInStock--;
        await movie.save();
        res.send(result);
    });

    session.endSession();
    console.log('success');
    } catch (error) {
    console.log('error', error.details[0].message);
    }
    
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.finfById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid Customer.');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid Movie.');

    const rental = await Rental.findByIdAndUpdate(req.params.id, {
        dateReturned: req.body.dateReturned,
        rentalFee: req.body.rentalFee
    });
    if (!rental) return res.status(404).send("The given rental id wasn't found");
    res.status(200).send(rental);
});

router.delete('/:id', auth, async (req, res) => {
    const rental = await Rental.findByIdAndDelete(req.params.id);
    if (!rental) return res.status(404).send("The given rental id wasn't found");
    return res.status(200).send(rental);
});

module.exports = router;