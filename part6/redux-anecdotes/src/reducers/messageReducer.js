const initialState = {
  content: null,
  id: null
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return ({
        content: action.data.content,
        id: action.data.id
      })
    case 'REMOVE_MESSAGE':
      return initialState
    default: return state
  }
}

export const setMessage = (content, seconds) => {
  return async (dispatch, getState) => {
    const lastId = getState().message.id
    clearTimeout(lastId)
    const id = setTimeout(() => dispatch(removeMessage()), seconds * 1000)
    dispatch({
      type: 'SET_MESSAGE',
      data: {
        content,
        id
      }
    })
  }
}

export const removeMessage = () => {
  return ({
    type: 'REMOVE_MESSAGE'
  })
}

export default reducer