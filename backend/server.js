// Require the Node.js http module and the app module
const http = require('http');
const app = require('./app');
// Load environment variables from the .env file
require('dotenv').config();

// Define a function to normalize the port
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  // Return the port number if it is a valid number
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Set the app's port
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Define an error handler for the server
const errorHandler = (error) => {
  // Throw the error if it is not related to listen()
  if (error.syscall !== 'listen') {
    throw error;
  }
  // Get the server address and bind
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port: ${port}`;
  // Handle specific errors
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Create the server
const server = http.createServer(app);

// Handle server errors
server.on('error', errorHandler);
// Log a message when the server is listening
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;
  console.log(`Listening on ${bind}`);
});

// Start the server
server.listen(port);
