const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const usersRouter = require('./app/users/routes.js');
const productRouter = require('./app/product/routes.js');
// const sequelize = require('./config/database.js');
const db = require('./models')

// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import createError from 'http-errors';
// import path from 'path';
// import cookieParser from 'cookie-parser';
// import logger from 'morgan';
// import indexRouter from './routes/index.js';
// import usersRouter from './app/users/routes.js';
// import productRouter from './app/product/routes.js';
// import sequelize from './config/database.js';
// import db from './models/index.js';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const userRouter = require('./app/users')

var app = express();
dotenv.config();

const PORT = process.env.PORT || 8000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(cors({credentials:true, origin:'http://localhost:3000'}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/api', usersRouter);
app.use('/api', productRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

db.sequelize
  .authenticate()
  .then(
    () => console.log('Connection has been established successfully')
    )
  .catch((err) => console.error(`Unable to connect to the database: ${err}`))

// app.listen(PORT, () => console.log(`Server Listening on http://localhost:${PORT}`))

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
