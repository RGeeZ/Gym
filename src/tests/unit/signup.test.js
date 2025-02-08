
const mongoose = require('mongoose');
const User = require('../../models/user'); // Your User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../../../app');  // Import your Express app
const Product = require('../../models/product');  // Product model
const sinon = require('sinon');  // Import sinon for stubbing
const { expect, it } = require('@jest/globals');  // Use Jest's expect function
//jest.setTimeout(50000); // Set timeout to 10 seconds


// Mock environment variables
process.env.JWT_SECRET = 'testsecret';

// Mocking the database
// beforeAll(async () => {
//     const mongoURI = process.env.TEST_MONGO_URI; // Use a test database
//     await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
// });

// afterEach(async () => {
//     await User.deleteMany(); // Clear test data after each test
// });

// afterAll(async () => {
//     await mongoose.connection.close();
// });

describe('POST /signup', () => {
    it.skip('should return 400 if required fields are missing', async () => {
        // test code
    });

    it('Check for leading and trailing spaces', async() => {
        const response = await request(app)
                .post('/signup')
                .send({
                    name: ' amazon1 ',
                    age: 25,
                    // password: await bcrypt.hash('Pass123!', 10),
                    password: 'Pass123!',
                    email: ' amazon1@gmail.com ',
                    contact: ' 1234567890',
                    address: '123Street '
                })
            expect(response.status).toBe(400);
            expect(response.text).toBe('Inputs must not contain leading or trailing spaces');


    });

    it('should return 400 if required fields are missing', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                name: 'John Doe',
                email: 'john@example.com'
            });
        expect(response.status).toBe(400);
        expect(response.text).toBe('All fields are required.');
    });


    it('should return 409 if email is already registered', async () => {
        await User.create({
            name: 'amazon1',
            age: 25,
            password: await bcrypt.hash('Pass123!', 10),
            email: 'amazon1@gmail.com',
            contact: '1234567890',
            address: '123Street'
        });

        const response = await request(app)
            .post('/signup')
            .send({
                name: 'amazon1',
                age: 25,
                password: 'Pass123!',
                confirm_password: 'Pass123!',
                email: 'amazon1@gmail.com',
                contact: '1234567890',
                address: '123Street'
            });

        expect(response.status).toBe(400);
        expect(response.text).toBe('email already exists.');
    });

    it('should return 400 for invalid email format', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                name: 'John Doe',
                age: 25,
                password: 'Pass123!',
                confirm_password: 'Pass123!',
                email: 'invalid-email',
                contact: '1234567890',
                address: '123 Street'
            });
        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid email format.');
    });

    it('should return 400 for passwords that do not match', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                name: 'John Doe',
                age: 25,
                password: 'Pass123!',
                confirm_password: 'WrongPass123!',
                email: 'john@example.com',
                contact: '1234567890',
                address: '123 Street'
            });
        expect(response.status).toBe(400);
        expect(response.text).toBe('Passwords do not match.');
    });

    it('should return 400 for weak passwords', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                name: 'John Doe',
                age: 25,
                password: 'weakpass',
                confirm_password: 'weakpass',
                email: 'john@example.com',
                contact: '1234567890',
                address: '123 Street'
            });
        expect(response.status).toBe(400);
        expect(response.text).toBe('Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.');
    });

    it('should return 400 for invalid contact number', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                name: 'John Doe',
                age: 25,
                password: 'Pass123!',
                confirm_password: 'Pass123!',
                email: 'john@example.com',
                contact: '12345',
                address: '123 Street'
            });
        expect(response.status).toBe(400);
        expect(response.text).toBe('Contact must be a valid 10-digit number.');
    });
});
