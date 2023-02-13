const express = require('express')
require('express-async-errors')
const cors = require('cors')
const { sequelize } = require('./util/db')
const logger = require('./util/logger')
const { PORT } = require('./util/config')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const { 
  requestLogger,
  unknownEndpoint,
  errorHandler
} = require('./util/middleware')
const helmet = require('helmet')

const app = express()
app.use(helmet(({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
})))
app.use(cors())
app.use(express.static(__dirname + '/public'))
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)

app.use('/api/v2/user', usersRouter)
app.use('/api/v2/auth/login', loginRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
  })

