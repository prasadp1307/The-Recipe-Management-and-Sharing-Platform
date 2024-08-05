const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userAuthentecation = require('../middleware/authentiction');

router.post('/signup',userController.signupUser);
router.post('/login', userController.loginUser);

module.exports = router;
