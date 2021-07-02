import React from 'react'
import PropTypes from 'prop-types'

const Login = ({ handleLogin, usernameField, passwordField }) => (
  <div>
    <h2>Log in to application</h2>
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id="username"
          type="text"
          value={usernameField.username}
          onChange={({ target }) => usernameField.setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={passwordField.password}
          onChange={({ target }) => passwordField.setPassword(target.value)}
        />
      </div>
      <button
        id="login-button"
        type="submit"
      >
        login
      </button>
    </form>
  </div>
)

Login.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  usernameField: PropTypes.object.isRequired,
  passwordField: PropTypes.object.isRequired
}

export default Login