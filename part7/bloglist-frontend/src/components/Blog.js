import React from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, deleteBlog, commentBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useHistory } from 'react-router-dom'
import {
  Typography,
  Link,
  makeStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  TextField,
} from '@material-ui/core'
import { ThumbUp, Comment } from '@material-ui/icons'
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  section: {
    borderBottom: '1px solid',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
}))

const Blog = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { id } = useParams()
  const user = useSelector(state => state.user)
  const blog = useSelector(state => 
    state.blogs.find(b => 
      b.id === id
    )
  )
  const classes = useStyles()

  if (!blog) {
    return null
  }

  const handleLike = () => {
    dispatch(likeBlog(blog))
  }

  const handleDelete = () => {
    const userConfirmation = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (userConfirmation) {
      dispatch(deleteBlog(blog.id))
      dispatch(setNotification({message: `Deleted ${blog.title} successfully`, type: 'success'}, 5))
      history.push('/')
    }
  }

  const handleComment = event => {
    event.preventDefault()
    dispatch(commentBlog(blog.id, event.target.comment.value))
    event.target.comment.value = ''
  }

  const own = blog.user.username === user.username

  return (
    <div className={classes.root}>
      <Typography variant='h5'>{blog.title} {blog.author}</Typography>
      <Link variant='h5' href={blog.url}>{blog.url}</Link>
      {own&&
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        startIcon={<DeleteIcon />}
        onClick={handleDelete}
      >
        Delete
      </Button>}
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        startIcon={<ThumbUp />}
        onClick={handleLike}
      >
        {blog.likes} likes 
      </Button>
      <Typography variant='subtitle1'>Added by: {blog.user.name}</Typography>
      <Typography variant="body1">Comments</Typography>
      <form onSubmit={handleComment}>
        <TextField size="small" variant='filled' type='text' name='comment' />
        <Button size="big" color="primary">add comment</Button>
      </form>
      <List>
        {blog.comments.map(c => 
          <ListItem button key={c._id}>
            <ListItemIcon>
              <Comment/>
            </ListItemIcon>
            <ListItemText>{c.content}</ListItemText>
          </ListItem>  
        )}
      </List>
    </div>
  )
}

export default Blog