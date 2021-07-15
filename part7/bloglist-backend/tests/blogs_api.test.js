const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

jest.setTimeout(10000)

beforeAll(async () => {
  await User.deleteMany()

  const passwordHash = await bcrypt.hash('c0mplex', 10)
  testUser = new User ({ username: 'root', passwordHash })

  await testUser.save()
})

beforeEach(async () => {
  await Blog.deleteMany({})
  
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('blog fetching', () => {
  test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
  
  test('the id property exists', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body[0].id).toBeDefined()
  })
})

describe('creating blogs', () => {
  test('a valid blog can be added', async () => {
    const response = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'c0mplex'
      })
    const token = response.body.token

    const newBlog = {
      title: "Blog",
      author: "John Doe",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/dummy.html",
      likes: 10
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  })

  test('likes are defaulted if missing', async () => {
    const response = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'c0mplex'
      })
    const token = response.body.token

    const newBlog = {
      title: "New Blog",
      author: "Jane Doe",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/no_likes.html"
    }

    const res = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-type', /application\/json/)

    expect(res.body.likes).toBeDefined
  })

  test('handling of missing required fields', async () => {
    const response = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'c0mplex'
      })
    const token = response.body.token
    
    const newBlog = {
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/not_a_blog.html",
      likes: 10
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('blogs without a valid token are rejected', async () => {
    const newBlog = {
      title: "Blog",
      author: "John Doe",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/dummy.html",
      likes: 10
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'foo')
      .send(newBlog)
      .expect(401)
      .expect('Content-type', /application\/json/)
  })
})

afterAll(() => {
  mongoose.connection.close()
})