// Import the express library
const express = require('express');

// Create an instance of the express router
const router = express.Router();

// Import middlewares
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

// Import the sauce controller module
const sauceController = require('../controllers/sauce');

// Define routes for handling HTTP requests and associate them with controller methods
router.post('/', auth, multer, sauceController.createSauce);
router.get('/', auth, sauceController.readAllSauces);
router.get('/:id', auth, sauceController.readOneSauce);
router.put('/:id', auth, multer, sauceController.updateSauce);
router.post('/:id/like', auth, sauceController.likeSauce);
router.delete('/:id', auth, sauceController.deleteSauce);

// Export the router for use in other modules
module.exports = router;