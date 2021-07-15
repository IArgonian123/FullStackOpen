const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, id: 1 })

  res.json(blogs)
})

blogRouter.get('/:id', async (req, res) => {
  const blog = await Blog
    .findById(req.params.id).populate('user', { username: 1, name: 1, id: 1 })

  res.json(blog)
})


blogRouter.post('/', async (req, res) => {
  const body = req.body

  if (!req.user) {
    return res.status(401).json({ error: 'Not logged in' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author, 
    likes: body.likes,
    url: body.url,
    user: req.user._id
  })

  const result = await blog.save()
  req.user.blogs = req.user.blogs.concat(result._id)
  await req.user.save()

  const formattedBlog = await Blog
    .findById(result._id).populate('user', { username: 1, name: 1, id: 1 })

  res.json(formattedBlog)     
})

blogRouter.delete('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (!req.user) {
    return res.status(401).json({ error: 'Not logged in' })
  }
  if (!blog) {
    return res.status(404).json({ error: 'missing blog' })
  }
  if (blog.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ error: 'blog owner must be logged in' })
  }

  await blog.remove()
  return res.status(204).end()
})

blogRouter.put('/:id', async (req, res) => {
  const body = req.body

  const updatedBlog = await Blog
    .findByIdAndUpdate(req.params.id, body, { new: true })
    .populate('user', { username: 1, name: 1, id: 1 })
  res.json(updatedBlog)
})

blogRouter.post('/:id/comments', async (req, res) => {
  const body = req.body

  const updatedBlog = await Blog
    .findByIdAndUpdate(
      req.params.id,
      {
        $push: { comments: body }
      },
      { new: true }
    )
    .populate('user', { username: 1, name: 1, id: 1 })

  res.json(updatedBlog)
})

module.exports = blogRouter
