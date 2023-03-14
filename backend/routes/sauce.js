const express = require('express');

const router = express.Router();

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const sauceController = require('../controllers/sauce');

router.post('/', auth, multer, sauceController.createSauce);
router.get('/', auth, sauceController.readAllSauces);
router.get('/:id',auth, sauceController.readOneSauce);
// router.put('/:id',auth, multer, sauceController.updateSauce);
// router.post('/:id/like', auth, sauceController.likeSauce);
router.delete('/:id',auth, sauceController.deleteSauce);

module.exports = router;
