const router = require('express').Router();
const multer = require('multer');
const productController = require('./controller.js');
const verifyToken = require('../../middlewares/verifyToken.js');
const roleAuth = require('../../middlewares/roleAuth.js');
// import express from 'express';
// import multer from 'multer';
// import {store, update, index, destroy, restore} from './controller.js';

const upload = multer({dest: '../../public/images/products'})

router.post('/product', upload.single('imageUrl'), verifyToken, roleAuth, productController.store);
router.put('/product/:id', upload.single('imageUrl'), verifyToken, roleAuth, productController.update);
router.get('/product', productController.index);
router.delete('/product/:id', verifyToken, roleAuth, productController.destroy);
router.post('/product/restore/:id', verifyToken, roleAuth, productController.restore);

module.exports = router;