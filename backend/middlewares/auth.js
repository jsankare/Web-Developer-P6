// Import the jsonwebtoken library and the dotenv configuration module
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Export a middleware function that checks for a valid JWT token in the Authorization header
module.exports = (request, response, next) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = request.headers.authorization.split(' ')[1];
    // Decode the token to extract the user ID
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;
    // Attach the user ID to the request object for further use by downstream middleware
    request.auth = {
      userId,
    };
    next(); // Call the next middleware function in the chain
  } catch (error) {
    // Handle errors with invalid or missing JWT tokens
    response.status(401).json({error : `User not autorized`});
  }
};
