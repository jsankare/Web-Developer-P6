const express = require('express');

const router = express.Router();

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const sauceController = require('../controllers/sauce');

router.get('/', auth, sauceController.readAllSauces);
router.get('/:id',auth, sauceController.readOneSauce);
router.post('/', auth, multer, sauceController.createSauce);
// router.post('/:id/like', sauceController.likeSauce);
// router.put('/:id', multer, sauceController.updateSauce);
// router.delete('/:id', sauceController.deleteSauce);

module.exports = router;
