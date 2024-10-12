const moment = require('moment');
const request = require('supertest');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie'); 
const mongoose = require('mongoose');

describe('/api/returns', () => {
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .send({ customerId, movieId })
            .set('x-auth-token', token);
    };

    beforeEach(async() => {
        server = require('../../index');

        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: 'Tarek',
                phone: '01015352431'
            },
            movie: {
                _id: movieId,
                title: 'Terminator',
                dailyRentalRate: 2
            }
        });
        await rental.save();

        movie = new Movie({
            _id: movieId,
            title: 'Terminator',
            genre: { name: 'Action' },
            dailyRentalRate: 2,
            numberInStock: 10
        });
        await movie.save();
    });

    afterEach(async () => {
        await server.close();
        await Rental.deleteMany({});
        await Movie.deleteMany({});
    });

    it('should return 401 if user is not logged in', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if customer id is not provided', async () => {
        customerId = '';
        const res = await exec()
        expect(res.status).toBe(400);
    });

    it('should return 400 if movie id is not provided', async () => {
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 404 if the movie and customer combination does not has a rental', async () => {
        await Rental.deleteMany({});
        // customerId = new mongoose.Types.ObjectId();
        // movieId = new mongoose.Types.ObjectId();
        const res = await exec();
        expect(res.status).toBe(404);
    });

    it('should return 400 if rental already processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if valid request', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });

    it('should return date if valid request', async () => {
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });

    it('should calculate the rental fee', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();
        await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });

    it('should increase the movie stock', async () => {
        await exec();
        const movieInDb = await Movie.findById(movieId)
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental', async () => {
        const res = await exec();
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned',
                'rentalFee', 'customer', 'movie']));
    });
})