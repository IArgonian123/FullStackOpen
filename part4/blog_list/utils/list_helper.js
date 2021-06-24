const _ = require('lodash')

const dummy = blogs => 1

const totalLikes = blogs => {
  reducer = (sum, blog) => sum + blog.likes
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = blogs => {
  const likesList = blogs.map(blog => blog.likes)
  const maxLikes = Math.max(...likesList)
  const favorite = blogs.find(blog => blog.likes === maxLikes)
  const { title, author, likes } = favorite
  return {title, author, likes} 
}

const mostBlogs = blogs => {
  const arrayResult = _(blogs)
    .countBy('author')
    .toPairs()
    .maxBy(_.last)

  const result = {
    author: arrayResult[0],
    blogs: arrayResult[1]
  }

  return result
}

const mostLikes = blogs => {
  const result = _(blogs)
    .map(blog => _.pick(blog, ['author', 'likes']))
    .groupBy('author')
    .map(author => ({
      author: author[0].author,
      likes: _.sum(author.map(author => author.likes))
    }))
    .maxBy('likes')

  return result
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}