const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Session } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
  const body = req.body
  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.password)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET,{ expiresIn: 60*60*24*10 })
  await Session.create({ token: token, userId: user.id })
  res
    .status(200)
    .send({ accessToken:token })
})

router.delete('/', tokenExtractor, async (req, res) => {
  try {
    const session = await Session.findOne({
      where: {
        userId: req.decodedToken.id
      }
    })
    await session.destroy()
    res.status(200).send()
  } catch(error) {
    throw Error('ValidationError'+ error)
  }
})

module.exports = router