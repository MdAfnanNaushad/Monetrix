const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');

// Create a router object
const router = express.Router();

// Define routes
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;