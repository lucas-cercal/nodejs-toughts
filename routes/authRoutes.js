/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Controller
router.get('/login', AuthController.login);
router.post('/login', AuthController.loginPost);
router.get('/register', AuthController.register);
router.get('/logout', AuthController.logout);
router.post('/register', AuthController.registerPost);

module.exports = router;
