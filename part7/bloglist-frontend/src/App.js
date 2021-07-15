import React, { useState, useEffect, useRef } from 'react'

// Redux
import { useDispatch, useSelector } from 'react-redux'
//  Action creators
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { loadUser, login, logout } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'

// Routing
import { Switch, Route, Link } from 'react-router-dom'

// Components
import BlogList from './components/BlogList'
import Create from './components/Create'
import Login from './components/Login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import UserList from './components/UserList'
import User from './components/User'
import Blog from './components/Blog'

import {
  AppBar,
  Button,
  Toolbar,
  Paper,
  Container,
  Typography,
  Box
} from '@material-ui/core'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const user = useSelector(state => state.user)

  const blogFormRef = useRef()

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
    dispatch(loadUser())
  }, [dispatch])

  const notifyWith = (message, type='success') => {
    dispatch(setNotification({ message, type }, 5))
  }

  const handleLogin = event => {
    event.preventDefault()
    dispatch(login(username, password))
    notifyWith('welcome back!')
    setUsername('')
    setPassword('')
  }

  const handleLogout = () => {
    dispatch(logout())
    notifyWith('logged out')
  }

  if (!user) {
    return (
      <Container maxWidth={false} component={Paper}>
        <Notification />
        <Login
          handleLogin={handleLogin}
          usernameField={{ username, setUsername }}
          passwordField={{ password, setPassword }}
        />
      </Container>
    )
  }

  return (
    <Container maxWidth={false} component={Paper}>
      <AppBar position="sticky">
        <Toolbar>
          <Button color='inherit' component={Link} to='/'>blogs</Button>
          <Button color='inherit' component={Link} to='/users'>users</Button>
          <Typography color='inherit' style={{marginLeft:'auto'}}>
            {user.name} logged in 
          </Typography>
          <Button color='inherit' onClick={handleLogout}>
            logout
          </Button>
        </Toolbar>
      </AppBar>
      <Notification />
      <Box py={5}>
        <Switch>
          <Route path='/users/:id' children={<User />}/>
          <Route path='/users' children={<UserList />}/>
          <Route path='/blogs/:id' children={<Blog />}/>
          <Route path='/'>
            <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
              <Create 
                blogFormRef={blogFormRef}
              />
            </Togglable>
            <BlogList />
          </Route>
        </Switch>
      </Box>
    </Container>
  )
}


export default App