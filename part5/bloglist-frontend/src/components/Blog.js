import React, { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, loggedUsername }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => setVisible(!visible)

  const incrementLikes = async () => {
    updateBlog({
      ...blog, likes: blog.likes + 1
    })
  }

  const owned = blog.user.username === loggedUsername

  return (
    <div className='blog' style={blogStyle}>
      <div className='blogOverview'>
        {blog.title} {blog.author} <button onClick={toggleVisibility} className='visibilityButton'> {visible ? 'hide' : 'view'} </button>
      </div>
      <div style={{ display: visible ? '' : 'none' }} className='blogBody'>
        <div>{blog.url}</div>
        <div className='likeDiv'>likes {blog.likes} <button onClick={incrementLikes} className='likeButton'>like</button></div>
        <div>{blog.user.name}</div>
        <button id='remove' style={{ display: owned ? '' : 'none' }} onClick={() => {deleteBlog(blog.id)}}>remove</button>
      </div>
    </div>
  )
}

export default Blog