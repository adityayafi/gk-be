const path = require('path');
const fs = require('fs');
// const Product = require('./model.js');
const {product} = require('../../models');
const Product = product;
const { Op } = require('@sequelize/core');

// import path from 'path';
// import fs from 'fs';
// import Product from './model.js'
// import { Op } from '@sequelize/core'
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// console.log(__dirname)
// console.log(Product)

const store = async (req, res, next) => {
  const payload = req.body;

  if(req.file){
    let tmp_path = req.file.path;
    let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
    let filename = req.file.filename + '.' + originalExt;
    let target_path = path.resolve(__dirname, `../../public/images/products/${filename}`);

    const src = fs.createReadStream(tmp_path);
    const dest = fs.createWriteStream(target_path);
    src.pipe(dest);

    src.on('end', async () => {
      try {
        await Product.sync();
        let product = await Product.create({...payload, imageUrl: filename});
        res.json({
          code: 201,
          message: 'Success create a product',
          data: product
        })
      } catch (err) {
        fs.unlinkSync(target_path);
        if(err && err.name === 'ValidationError'){
          res.json({
            code: 500,
            message: 'Failed to save a product'
          })
        }
      }
    });

    src.on('error', async(err) => {
      next(err)
    })
  }
}

const update = (req, res, next) => {
  let payload = req.body;
  let {id} = req.params;

  if(req.file){
    let tmp_path = req.file.path;
    let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
    let filename = req.file.filename + '.' + originalExt;
    let target_path = path.resolve(__dirname, `../../public/images/products/${filename}`);

    const src = fs.createReadStream(tmp_path);
    const dest = fs.createWriteStream(target_path);
    src.pipe(dest);

    src.on('end', async () => {
      try {
        await Product.sync();
        let product = await Product.update({...payload, imageUrl: filename}, {
          where:{ id: id }
        });
        res.json({
          code: 201,
          message: 'Success update a product',
          data: product
        })
      } catch (err) {
        fs.unlinkSync(target_path);
        if(err && err.name === 'ValidationError'){
          res.json({
            code: 500,
            message: 'Failed to update a product'
          })
        }
      }
    });

    src.on('error', async(err) => {
      next(err)
    })
  }  
}

const index = async (req, res, next) => {
  try {
    let {skip = 0, limit = 0, q = ''} = req.query;

    let criteria = {};

    if(skip != 0){
      criteria = {
        ...criteria,
        offset : parseInt(skip)        
      }
    }

    if(limit != 0){
      criteria = {
        ...criteria,
        limit : parseInt(limit)
      }
    }

    if(q.length > 0){
      criteria = {
        ...criteria,
        where: {
          name: {[Op.like]: `%${q}%`}
        }
      }
    }

    let count = await Product.count()

    let product = await Product.findAll(criteria)
    res.json({
      code: 200,
      message: 'Success get the data',
      data: {
        product,
        count
      }
    })
  } catch (err) {
    next(err)
  }
}

const destroy = async (req, res, next) => {
  try {
    let {id} = req.params;
    let product = await Product.findOne({where: {id: id}});
    let deletedProduct = await Product.destroy({where:{id: id}});
    let currentImage =  path.resolve(__dirname, `../../public/images/product/${product.imageUrl}`);
    console.log(currentImage);
    if(fs.existsSync(currentImage)){
      fs.unlinkSync(currentImage)
    }
    res.json({
      code: 200,
      message: 'Success delete the data',
      data: deletedProduct
    })
  } catch (err) {
    next(err);
  }
}

const restore = async (req, res, next) => {
  try {
    const {id} = req.params;

    const restoredProduct = await Product.update({deletedAt: null}, {where: {id: id}, paranoid: false} )

    res.json({
      code: 200,
      message: 'Success restore the data',
      data: restoredProduct
    });
  } catch (err) {
    next(err)
  }
}

module.exports = {
  store,
  update,
  index,
  destroy,
  restore
}