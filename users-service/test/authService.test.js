require('dotenv').config();
const authService = require('../src/utils/authservice');

const validEmail = 'user@mail.com';
const validUserId = '123';

const invalidEmail = undefined;
const invalidUserId = undefined;

const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAbWFpbC5jb20iLCJ1c2VySWQiOiI2MDYyYjAwNjBlZTZkZjNjZmQyODEyMDgiLCJpYXQiOjE2MTcxNzA5OTksImV4cCI6MTYxNzE3MTU5OX0.ZoPgB_F1Bzvb7tPQFUSwxRH7lYiJFtHYYfFH66jTk_0';

describe('With valid credentials', () => {
    let token;
    test('can obtain JWT', () => {
        const token = authService.getToken(validEmail, validUserId);
        expect(token)
    })
})

describe('With in-valid credentials', () => {
    test("can't obtain JWT and throws error", () => {
        expect(() => {
            authService.getToken(invalidEmail, invalidUserId);
        }).toThrowError('Invalid credentials');
    })
})

describe('With a valid JWT', () => {
    test('can verify is still valid', () => {
        const response = authService.getToken(validEmail, validUserId);
        const { email, userId } = authService.verify(response.token);
        expect(email).toBe(validEmail);
        expect(userId).toBe(validUserId);
    })
})

describe('With an expired JWT', () => {
    test('got Authentication fail', () => {
        expect(() => {
            authService.verify(expiredToken);
        }).toThrowError();
    })
})