import blogService from "../services/blogs"

const byLikes = (b1, b2) => b2.likes - b1.likes

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT': 
      return action.data.sort(byLikes)
    case 'CREATE': 
      return [...state, action.data]
    case 'LIKE': 
      const liked = action.data
      return state.map(b => b.id === liked.id ? liked : b).sort(byLikes)
    case 'COMMENT':
      const commented = action.data
      return state.map(b => b.id === commented.id ? commented : b)
    case 'DELETE':
      const deletedId = action.data
      return state.filter(b => b.id !== deletedId)
    default: return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const data = await blogService.getAll()
    dispatch({
      type: 'INIT',
      data
    })
  }
}

export const createBlog = blog => {
  return async dispatch => {
    const data = await blogService.create(blog)
    dispatch({
      type: 'CREATE',
      data
    })
  }
} 

export const deleteBlog = id => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch({
      type: 'DELETE',
      data: id
    })
  }
}

export const likeBlog = blog => {
  return async dispatch => {
    const likedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    const data = await blogService.update(likedBlog)
    dispatch({
      type: 'LIKE',
      data
    })
  }
}

export const commentBlog = (blogId, content)=> {
  return async dispatch => {
    const data = await blogService.comment(blogId, { content })
    dispatch({
      type: 'COMMENT',
      data
    })
  }
}

export default reducer