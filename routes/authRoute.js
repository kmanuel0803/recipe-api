const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// registration
router.post('/signup',
  AuthController.validateSignup,
  AuthController.registerUser
);

// login
router.post('/login', 
  AuthController.loginUesr
);

module.exports = router;
