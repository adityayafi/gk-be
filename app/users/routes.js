const router = require('express').Router();
const usersController = require('./controller.js');
const verifyToken = require('../../middlewares/verifyToken.js');
const roleAuth = require('../../middlewares/roleAuth.js');

// import express from 'express';
// import { profile, allUser, refreshToken, logout, register, login } from './controller.js';
// import verifyToken from '../../middlewares/verifyToken.js';

// const router = express.Router()

router.get('/profile', verifyToken, usersController.profile);
router.get('/users', verifyToken, roleAuth, usersController.allUser);
router.get('/token', verifyToken, usersController.refreshToken);
router.delete('/logout', verifyToken, usersController.logout)
router.post('/register', usersController.register);
router.post('/login', usersController.login);

module.exports = router;