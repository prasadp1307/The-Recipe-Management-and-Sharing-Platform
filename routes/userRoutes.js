const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authentication = require('../middleware/authentiction');
const upload = require('../controllers/upload');

// Define routes
router.post('/uploadRecipes', authentication, upload.single('image'), userController.uploadRecipes);
router.get('/profile', authentication, userController.getProfile);
router.post('/save', authentication, userController.saveRecipe);
router.get('/:collectionName', authentication, userController.getsavedRcipes);

module.exports = router;
