const express = require('express')
const router = express.Router();

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config')

const sauceController = require('../controllers/sauce')

router.get('/', sauceController.readAllSauces);
// router.get('/:id', sauceController.readOneSauce);
router.post('/', multer, sauceController.createSauce);
// router.post('/:id/like', sauceController.likeSauce);
// router.put('/:id', multer, sauceController.updateSauce);
// router.delete('/:id', sauceController.deleteSauce);

module.exports = router;