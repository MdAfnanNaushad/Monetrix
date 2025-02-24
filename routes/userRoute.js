const express = require('express');
const { loginController, registerController } = require('../controllers/userController');

const router = express.Router();

//login User
router.post('/login' , loginController)


//register User
router.post('/register', registerController)

module.exports = router //bcz of ES6 module system