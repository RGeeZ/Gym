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

describe('POST /login',()=>{
    it.skip('should return 400 if required fields are missing', async () => {
        // test code
    });

    it('Check for leading and trailing spaces', async() => {
        const response = await request(app)
                .post('/login')
                .send({
                    // password: await bcrypt.hash('Pass123!', 10),
                    password: 'Pass123!',
                    email: ' amazon1@gmail.com '
                })
            expect(response.status).toBe(400);
            expect(response.text).toBe('Inputs must not contain leading or trailing spaces');
    });


    it('should return 400 if required fields are missing', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'john@example.com'
            });
        expect(response.status).toBe(400);
        expect(response.text).toBe('All fields are required.');
    });


    it('should return 400 for invalid email format', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                password: 'Pass123!',
                email: 'invalid-email',
            });
        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid email format.');
    });
    
    it('Test for if USer is present in DB or not', async() =>{
        await User.create({
            name: 'amazon1',
            age: 25,
            password: await bcrypt.hash('Pass123!', 10),
            email: 'amazon1@gmail.com',
            contact: '1234567890',
            address: '123Street'
        });
        const response = await request(app)
             .post('/login')
             .send({
                password: 'Pass123!',
                email: 'amzn1@gmail.com'
             });
        expect(response.status).toBe(401);
        expect(response.text).toBe('Invalid login credentials');

    });
    it('test if password is correct or not', async() =>{
        await User.create({
            name: 'amazon1',
            age: 25,
            password: await bcrypt.hash('Pass123!', 10),
            email: 'amazon1@gmail.com',
            contact: '1234567890',
            address: '123Street'
        });
        const response = await request(app)
             .post('/login')
             .send({
                password: await bcrypt.hash('Pass1234!', 10),
                email: 'amazon1@gmail.com'
             });
        expect(response.status).toBe(404);
        expect(response.text).toBe('Invalid credentials');
    });
});