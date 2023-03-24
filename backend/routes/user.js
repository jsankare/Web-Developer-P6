// Import the express library
const express = require('express');

// Create a new router object
const router = express.Router();
// Import the user controller
const userCtrl = require('../controllers/user');

// Route to sign up a user
router.post('/signup', userCtrl.signup);
// Route to log in a user
router.post('/login', userCtrl.login);

// Export the router object for use in other modules
module.exports = router;
