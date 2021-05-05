const app = require('../src/app')
const request = require('supertest');

const email = 'test-user-1@mail.com';
const invalidEmail = 'test-user-2@mail.com';
const password = 'test-password';

describe('User CRUD routes', () => {
    it('should create a new user', async () => {
        const res = await request(app)
            .post('/api/v1/user/')
            .send({
                email: email,
                password: password
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('User created');
    });
    it('should fail on duplicate user', async () => {
        const res = await request(app)
            .post('/api/v1/user/')
            .send({
                email: email,
                password: password
            });
        expect(res.statusCode).toEqual(400);
    })
    it('should fetch an existing user', async () => {
        const res = await request(app)
            .get('/api/v1/user/'+ email);
        expect(res.statusCode).toEqual(200);
    })
    it('should fail to fetch a none existing user', async () => {
        const res = await request(app)
            .get('/api/v1/user/'+ invalidEmail);
        expect(res.statusCode).toEqual(404);
    })
    it('should delete an existing user', async () => {
        const res = await request(app)
            .delete('/api/v1/user/'+ email);
        expect(res.statusCode).toEqual(202);
    })
});
