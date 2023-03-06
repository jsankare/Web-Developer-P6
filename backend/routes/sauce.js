const express = require('express')
const router = express.Router();

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config')

const sauceController = require('../controllers/sauce')

router.get('/sauces', auth, sauceController.readAllSauces);
router.get('/sauces/:id', auth, sauceController.readOneSauce);
router.post('/sauces', auth, multer, sauceController.createSauce);
router.post('/sauces/:id/like', auth, sauceController.likeSauce);
router.put('/sauces/:id', auth, multer, sauceController.updateSauce);
router.delete('/sauces/:id', auth, sauceController.deleteSauce);

module.exports = router;