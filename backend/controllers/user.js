// Import required modules and dependencies
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import User model
const User = require('../models/user');

// Handler function for user signup
exports.signup = async (request, response) => {
  try {
    const { password, email } = request.body;

    // Hash user password before saving to database
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hash,
    });

    // Save user to database and return success message
    try {
      await user.save();
      response.status(201).json({ message: 'utilisateur crée !' });
    } catch (error) {
      // Handle error when saving user to database
      response.status(400).json({ error });
    }
  } catch (error) {
    // Handle error when hashing user password
    response.status(500).json({ error });
  }
};

// Handler function for user login
exports.login = async (request, response) => {
  try {
    // Find user in database by email
    const user = await User.findOne({ email: request.body.email });
    // Handle case when user is not found
    if (user === null) {
      response.status(401).json({ message: 'Paire login/password incorrecte' });
    } else {
      try {
        // Compare user password with hashed password in database
        const valid = await bcrypt.compare(request.body.password, user.password);
        // Handle case when passwords don't match
        if (!valid) {
          response.status(401).json({ message: 'Paire login/password incorrecte' });
        } else {
          // Create and return JWT token with user ID and expiration date
          response.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET,
              { expiresIn: '24h' },
            ),
          });
        }
      } catch (error) {
        // Handle error when comparing passwords with bcrypt
        console.error('Issue with brcypt', error);
        response.status(500).json({ error });
      }
    }
  } catch (error) {
    // Handle error when finding user in MongoDB
    console.error('Issue with MongoDB', error);
    response.status(500).json({ error });
  }
};
