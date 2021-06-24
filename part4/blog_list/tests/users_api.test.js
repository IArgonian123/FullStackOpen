const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app.js')
const supertest = require('supertest')

const api = supertest(app)

const User = require('../models/user')

jest.setTimeout(10000)

beforeEach(async () => {
  await User.deleteMany()

  for (let user of helper.initialUsers) {
    let passwordHash = await bcrypt.hash(user.password, 10)

    user = {
      name: user.name,
      username: user.username,
      passwordHash
    }

    let userObject = new User(user)
    await userObject.save()
  }
})

describe('Creating users', () => {
  test('creation succeeds with fresh user', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails if username taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Random',
      username: 'usernamed',
      password: 'password123'
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)

    expect(res.body.error).toContain('`username` to be unique')

  })

  test('creation fails if password field is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Random',
      username: 'usd'
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)

    expect(res.body.error).toBe('missing password field')    
  })

  test('creation fails if password field is less than 3 char long', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Random',
      username: 'usd',
      password: '3d'
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)

    expect(res.body.error).toBe('password must be at least 3 characters long')
  })    
})

afterAll(() => {
  mongoose.connection.close()
})