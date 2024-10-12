const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
let server;

describe('Auth middleware', () => {
    beforeEach(() => { server = require('../../index') });
    afterEach(async () => {
        await server.close();
        await Genre.deleteMany();
    });
        let token;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: 'genre1' });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
        })

        it('Should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('Should return 400 if token is invalid', async () => {
        token = 'qw';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('Should return 200 if token is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
});

    