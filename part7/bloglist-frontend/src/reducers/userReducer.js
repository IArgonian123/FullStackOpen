import loginService from "../services/login"
import storage from "../utils/storage"

const reducer = (state = null, action) => {
  switch (action.type) {
    case 'SET':
      return action.data
    case 'CLEAR':
      return null
    default: return state
  }
}

export const loadUser = () => {
  const data = storage.loadUser()

  return {
    type: 'SET',
    data
  }
}

export const login = (username, password) => {
  return async dispatch => {
    const user = await loginService.login({
      username, password
    })
    storage.saveUser(user)
    dispatch({
      type: 'SET',
      data: user
    })
  }
}

export const logout = () => {
  storage.logoutUser()
  return {
    type: 'CLEAR'
  }
}

export default reducer