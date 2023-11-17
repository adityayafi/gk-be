'use strict';

const {v4: uuidv4} = require('uuid');
const chalk = import('chalk');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const data = [
  {
    fullname: 'admin',
    email: 'admin@mail.com',
    password: 'admin',
    role: 'admin'
  },
  {
    fullname: 'user',
    email: 'user@mail.com',
    password: 'user',
    role: 'user'
  }
]

// console.log(data.length, 'seed data user')
// console.log(`${chalk.green('[server]')} ${chalk.blue('Seed')}. ${chalk.cyan('Login account detail:')}`)
console.log('[server] Seed. Login account detail:')
data.map(data => console.log({
  email: data.email,
  password: data.password,
  role: data.role
}))

const formData = [];

if(data){
  for(let i = 0; i < data.length; i++){
    const item = data[i];
    const hashPassword = bcrypt.hashSync(data[i].password, saltRounds);

    formData.push({
      ...item,
      id: uuidv4(),
      password: hashPassword,
      createdAt: new Date(),
      updatedAt: new Date(),      
    })
  }
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', formData)
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
