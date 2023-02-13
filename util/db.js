const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(  {
  dialect: 'sqlite',
  storage: DATABASE_URL,
  Logging: true
  })

module.exports = { sequelize }