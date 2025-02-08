const mongoose = require('mongoose');
const User = require('../../models/user'); // Your User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../../../app');  // Import your Express app
const Product = require('../../models/product');  // Product model
const sinon = require('sinon');  // Import sinon for stubbing
const { expect, it } = require('@jest/globals');  // Use Jest's expect function


describe('Product Routes', function () {
    it.skip('should return 400 if required fields are missing', async () => {
        // test code
    });
});