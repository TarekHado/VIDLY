const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index') });
    afterEach(async () => {
        await server.close();
        await Genre.deleteMany();
    });
    
    // describe('GET /', () => {
    //     it('Should return all genres', async () => {
    //         await Genre.collection.insertMany([
    //             { name: 'genre1' },
    //             { name: 'genre2' }
    //         ]);

    //         const res = await request(server).get('/api/genres');
    //         expect(res.status).toBe(200);
    //         expect(res.body.length).toBe(2);
    //         expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
    //         expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
    //     });
    // });

    // describe('GET /:id', () => {
    //     it('Should return a genre if valid id is passed', async () => {
    //         const genre = new Genre({ name: 'genre3' });
    //         await genre.save();
    //         const res = await request(server).get('/api/genres/'+ genre._id);
    //         expect(res.status).toBe(200);
    //         expect(res.body).toHave('name', genre.name);
    //     });

    // it('Should return 404 if invalid id is passed', async () => {
    //     const res = await request(server).get('/api/genres1/');
    //     expect(res.status).toBe(404);
    // });

    // it('Should return 404 if invalid id is passed', async () => {
    //     const res = await request(server).get('/api/genres/' + mongoose.Types.ObjectId());
    //     expect(res.status).toBe(404);
    // });
    // });

    describe('Post /', () => {
        let name;
        let token;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        })

        it('Should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('Should return 400 if genre length is less than 5 chars', async () => {
            name = 'erjf';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('Should return 400 if genre length is more than 50 chars', async () => {
            name = 'erjf'.repeat(15);
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('Should save the genre if it is valid', async () => {
            await exec();
            const genre = await Genre.find({ name: 'genre1' });
            expect(genre).not.toBeNull();
        });

        it('Should return the genre if it is valid', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });

    describe('PUT /', () => {
        let name;
        let token;
        let id;

        beforeEach(async () => {
            id = new mongoose.Types.ObjectId();
            token = new User().generateAuthToken();
            await Genre.collection.insertOne({
                _id: id,
                name: 'genre'
            });
        });
        const exec = async () => {
            return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({ name });
        }

        it('Should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('Should return 404 if invalid id is passed', async () => {
            id = new mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('Should return 400 if genre length is less than 5 chars', async () => {
            name = 'jd';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('Should return 400 if genre length is more than 50 chars', async () => {
            name = 'kjlsw'.repeat(15);
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('Should save the genre if it is valid', async () => {
            name = 'genre2';
            await exec();
            const genre = await Genre.find({ name: 'genre2' });
            expect(genre).not.toBeNull();
        });

        it('Should return the genre if it is valid', async () => {
            name = 'genre2';
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre2');
        });
    });

    // describe('DELETE /', () => {
    //     let token;
    //     let id;

    //     beforeEach(async() => {
    //         id = new mongoose.Types.ObjectId();
    //         token = new User().generateAuthToken();
    //         await Genre.collection.insertOne({
    //             _id: id,
    //             name: 'genre'
    //         });
    //     });

    //     const exec = () => {
    //         return request(server)
    //             .delete('/api/genres/' + id)
    //             .set('x-auth-token', token);
    //     }

    //     it('Should return 401 if client is not logged in', async () => {
    //         token = '';
    //         const res = await exec();
    //         expect(res.status).toBe(401);
    //     });

    //     it('Should return 404 if invalid id is passed', async () => {
    //         id = new mongoose.Types.ObjectId();
    //         const res = await exec();
    //         expect(res.status).toBe(404);
    //     });

    //     it('should remove the genre if the id passed is valid', async () => {
    //         const res = await exec();
    //         expect(res.status).toBe(200);
    //     });
    // });
});

//===================================================

// const request = require('supertest');
// const express = require('express');

// const app = express();

// app.get('/api/genres/', function(req, res) {
//     res.status(200).json({ name: 'genre1' });
// });

// describe("GET /api/genres/get", () => {
//     it("should return all genres", async () => {

//         request(app)
//             .get('/api/genres/')
//             .expect(200)
//             .end(function(err, res) {
//                 if (err) throw err;
//             });
//     }, 30000);
// });