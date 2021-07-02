import React, { useState, useEffect, useRef } from 'react'

// Components
import Blog from './components/Blog'
import Create from './components/Create'
import Login from './components/Login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const notifyWith = (message, type='success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const createBlog = async newBlog => {
    try {
      blogFormRef.current.toggleVisibility()
      const serverBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(serverBlog))
      notifyWith(`a new blog ${serverBlog.title} by ${serverBlog.author} added`)
    } catch (exception) {
      notifyWith(exception.response.data.error, 'error')
    }
  }

  const updateBlog = async updatedBlog => {
    try {
      const serverBlog = await blogService.update({
        user: updatedBlog.user.id,
        title: updatedBlog.title,
        url: updatedBlog.url,
        likes: updatedBlog.likes,
        author: updatedBlog.author
      }, updatedBlog.id)
      setBlogs(blogs.map(blog => blog.id !== serverBlog.id ? blog : serverBlog))
    } catch (exception) {
      notifyWith(exception.response.data.error, 'error')
    }
  }

  const deleteBlog = async id => {
    const toDelete = blogs.find(blog => blog.id === id)
    const userComfirmation = window.confirm(`Remove blog ${toDelete.title} by ${toDelete.author}`)
    if (userComfirmation) {
      try {
        await blogService.remove(id)
        notifyWith(`Deleted ${toDelete.title} successfully`)
        setBlogs(blogs.filter(blog => blog.id !== id))
      } catch (exception) {
        setBlogs(blogs.filter(blog => blog.id !== id))
        notifyWith(exception.response.data.error, 'error')
      }
    }
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')

      notifyWith('logged in')
    } catch (exception) {
      notifyWith(exception.response.data.error, 'error')
    }
  }

  const handleLogout = async () => {
    window.localStorage.clear()
    setUser(null)
    notifyWith('logged out')
  }

  const sortedBlogs = blogs.sort((firstBlog, secondBlog) => secondBlog.likes - firstBlog.likes)

  return (
    <div>
      <Notification notification={notification}/>
      {
        user === null ?
          <Login
            handleLogin={handleLogin}
            usernameField={{ username, setUsername }}
            passwordField={{ password, setPassword }}
          /> :
          <div>
            <h2>blogs</h2>
            <p>
              {user.name} logged in
              <button onClick={handleLogout}>Logout</button>
            </p>
            <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
              <Create createBlog={createBlog}/>
            </Togglable>
            {sortedBlogs.map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                loggedUsername={user.username}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
              />
            )}
          </div>
      }
    </div>
  )
}

export default App