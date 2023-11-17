const {users} = require('../../models');
const Users = users;
// const Users = require('./model.js')
const { generate } = require('generate-password');
const bcrypt = require('bcrypt');
const mailer = require('../../middlewares/nodemailer.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// console.log(users, 'ini users')
// import Users from './model.js';
// import Users from '../../models/users.js';
// import { generate } from 'generate-password';
// import bcrypt from 'bcrypt';
// import mailer from '../../middlewares/nodemailer.js';
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
dotenv.config();

const profile = async(req, res) => {
  if(!req.user){
    res.json({
      code : 403,
      message: `Unauthorized: You're not login or token expired`
    })
  }
  res.json(req.user)
}

const allUser = async(req, res) => {
  try {
    const result = await Users.findAll({
      attributes: ['id','fullname','email','role']
    })
    res.json({
      code : 200,
      message : 'success',
      data : result
    });
  } catch (err) {
    res.json({
      code : 500,
      message : err
    });
  }
}

const register = async (req, res) => {
  let password = generate({
    length: 10,
    numbers: true,
    uppercase: true,
    lowercase: true,
    symbols: true,    
  });
  const {fullname, email} = req.body;
  // console.log(fullname, email, password);
  
  const saltRounds = 10;
  const hashPassword = bcrypt.hashSync(password, saltRounds)

  try {
    // await Users.sync();
    // console.log('ini result');
    const result = await Users.create({
      fullname, email, password: hashPassword});
  
    // console.log(result, 'ini result');
    mailer(email, password)
    
    res.json({
      code: 201,
      status: "success",
      message: `User ${result.fullname} created successfully. User data details have been sent to registered email.`,
      data: result
    })
  } catch (err) {
    console.log(err)
    res.send(err)
  }
}

const login = async (req, res) => {

  try {
    // console.log(req.body.email)
    const user = await Users.findOne({
      where:{
        email: req.body.email
      }
    })
    
    if(!user) return res.json({
      code: 403,
      status: 'error',
      message: 'Invalid username or password'
    })

    const passMatch = await bcrypt.compare(req.body.password, user.password)
    if(!passMatch) return res.json ({
      code: 403,
      status: 'error',
      message: 'Invalid username or password'
    })

    const id = user.id;
    const name = user.fullname;
    const email = user.email;
    const role = user.role;
    const accessToken = jwt.sign({id, name, email, role}, process.env.SECRET_ACCESS_TOKEN,{
      expiresIn: '60m'
    });
    const refreshToken = jwt.sign({id, name, email}, process.env.SECRET_REFRESH_TOKEN,{
      expiresIn: '1d'
    });
    await Users.update({refreshToken: refreshToken}, {
      where:{
            id: id
          }
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    res.json({accessToken});
  } catch (err) {
    res.json({
      code: 404,
      status: 'error',
      message: err
    })
  }
}

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.json({
      code: 204,
      message: 'No Content'
    });
    const user = await Users.findOne({
      where:{
        refreshToken: refreshToken
      }
    });
    if (!user) return res.json({
      code: 204,
      message: 'No Content'
    });
    const id = user.id;
    await Users.update({refreshToken: null }, {
      where: {
        id: id
      }
    })
    res.clearCookie('refreshToken');
    res.json({
      code: 200,
      status: "success",
      message: "Logged out"
    })
  } catch (err) {
    console.log(err)
  }
}

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.json({
      code: 401,
      message: 'Unauthorized!'
    });
    const user = await Users.findOne({
      where:{
        refreshToken: refreshToken
      }
    });
    if (!user) return res.json({
      code: 401,
      message: 'Unauthorized!'
    });
    jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, (err, decoded) => {
      if (err) return res.json({
        code: 401,
        message: 'Unauthorized!'
      })
      const id = user.id;
      const name = user.fullname;
      const email = user.email;
      const accessToken = jwt.sign({id, name, email}, process.env.SECRET_ACCESS_TOKEN, {
        expiresIn: "60s"
      });
      res.json({accessToken});
    });
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  register,
  login,
  allUser,
  profile,
  logout,
  refreshToken,
}