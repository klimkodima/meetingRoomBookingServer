const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DATABASE_URL,
  Logging: true
})

const umzug = new Umzug({
  migrations: { glob: 'migrations/*.js' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
})

const runMigrations = async () => {
  const migrations = await umzug.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.file),
  })
}

const downMigration = async () => {
  const migrations = await umzug.down()
  console.log('Migrations down to date', {
    files: migrations.map((mig) => mig.file),
  })
}

const connectToDatabase = async () => {
  try {
    await runMigrations()
    await sequelize.authenticate()
    console.log('database connected')
  } catch (err) {
    console.log('connecting database failed')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize, downMigration }