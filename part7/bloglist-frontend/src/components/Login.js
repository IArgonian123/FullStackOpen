import React from 'react'
import PropTypes from 'prop-types'

import { TextField, Button, Box, Typography } from '@material-ui/core'

const Login = ({ handleLogin, usernameField, passwordField }) => (
  <Box px={100}>
    <Typography variant="h5">Log in to BlogList</Typography>
    <form onSubmit={handleLogin}>
      <TextField
        label="username"
        name="username"
        id="username"
        type="text"
        value={usernameField.username}
        onChange={({ target }) => usernameField.setUsername(target.value)}
      />
      <TextField
        label="password"
        id="password"
        type="password"
        value={passwordField.password}
        onChange={({ target }) => passwordField.setPassword(target.value)}
      />
      <Box py={2}>
        <Button variant="contained" color="primary" type="submit" >
          login
        </Button>
      </Box>
    </form>
  </Box>
)

Login.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  usernameField: PropTypes.object.isRequired,
  passwordField: PropTypes.object.isRequired
}

export default Login