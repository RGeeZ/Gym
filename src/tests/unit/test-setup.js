// const app = require('../src/app');
// let server;

// beforeAll(async () => {
//   process.env.PORT = 4000; // Set port for testing
//   server = app.listen(process.env.PORT); // Start the server

//   const mongoURI = process.env.TEST_MONGO_URI; // Use a test database
//   await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// });

// afterAll(async () => {
//   server.close(); // Close the server after tests

//   await mongoose.connection.dropDatabase(); // Optionally, drop the database after tests
//   await mongoose.connection.close(); // Close the database connection
//   server.close(); // Close the server after all tests are done
// });
const app = require('../src/app');
let server;

beforeAll(async () => {
  process.env.PORT = 4000; // Set the port for testing
  server = app.listen(process.env.PORT, () => {
    console.log(`Test server running on port ${process.env.PORT}`);
  });

  const mongoURI = process.env.TEST_MONGO_URI; // Use a test database
  await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  if (server) {
    server.close(); // Close the server after tests
    console.log('Server closed.');
  }

  await mongoose.connection.dropDatabase(); // Optionally, drop the database after tests
  await mongoose.connection.close(); // Close the database connection
});

