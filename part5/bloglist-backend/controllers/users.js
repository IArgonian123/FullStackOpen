const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
  const body = req.body

  if (body.password === undefined) {
    res.status(400).json({ error: 'missing password field' })
  }
  if (body.password.length < 3) {
    res.status(400).json({ error: 'password must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const newUser = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await newUser.save()

  res.json(savedUser)
})

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({}).populate('blogs', {url: 1, title: 1, author: 1, id: 1})

  res.json(users)
})

module.exports = usersRouter