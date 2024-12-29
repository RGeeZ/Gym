const request = require('supertest');
const app = require('../../../app');  // Import your Express app
const Product = require('../../models/product');  // Product model
const sinon = require('sinon');  // Import sinon for stubbing
const { expect } = require('@jest/globals');  // Use Jest's expect function

jest.setTimeout(10000);  // Set timeout to 10 seconds to handle long-running tests

describe('Product Routes', function () {
    describe('GET /products', function () {
        it.skip('should return 400 if required fields are missing', async () => {
            // test code
        });
        
        it('should render the products page with all products', async function () {
            const mockProducts = [
                {
                    Name: 'Whey Protein',
                    Description: 'High-quality whey protein',
                    RichDescription: 'This whey protein is perfect for muscle recovery.',
                    Image: '/images/whey-protein.jpg',
                    Images: ['/images/whey1.jpg', '/images/whey2.jpg'],
                    Price: 29.99,
                    ItemCount: 100,
                    Rating: 4.5,
                    IsFeatured: true
                },
                {
                    Name: 'Creatine',
                    Description: 'Creatine for muscle gain',
                    RichDescription: 'Increase muscle volume with our pure creatine.',
                    Image: '/images/creatine.jpg',
                    Images: ['/images/creatine1.jpg', '/images/creatine2.jpg'],
                    Price: 19.99,
                    ItemCount: 150,
                    Rating: 4.2,
                    IsFeatured: false
                }
            ];

            const findStub = sinon.stub(Product, 'find').returns(mockProducts);

            // Send the GET request to /products
            const res = await request(app)
                .get('/api/product')
                .expect(200);  // Expecting status 200 OK

            // Check if the response body contains the product data
            expect(res.text).toContain('Whey Protein');
            expect(res.text).toContain('Creatine');
            expect(res.text).toContain('29.99');
            expect(res.text).toContain('19.99');
            expect(res.text).toContain('High-quality whey protein');
            expect(res.text).toContain('Creatine for muscle gain');
            expect(res.text).toContain('Increase muscle volume with our pure creatine.');
            expect(res.text).toContain('/images/whey-protein.jpg');
            expect(res.text).toContain('/images/creatine.jpg');
            expect(res.text).toContain('4.5');
            expect(res.text).toContain('4.2');

            // Restore the original method after the test
            findStub.restore();
        });
    });
});
