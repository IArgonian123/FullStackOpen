import React, { useState } from 'react'
import { createBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { Button, TextField, makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(3),
      display: 'grid'
    },
  },
}))

const Create = ({ blogFormRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const dispatch = useDispatch()
  const classes = useStyles()


  const handleCreate = event => {
    event.preventDefault()

    dispatch(createBlog({
      title, author, url
    }))

    setTitle('')
    setAuthor('')
    setUrl('')

    blogFormRef.current.toggleVisibility()
    dispatch(setNotification({message: `a new blog ${title} by ${author} added`, type: 'success'}, 5))
  }

  return (
    <div>
      <Typography variant="h5">Create a new blog</Typography>
      <form onSubmit={handleCreate} className={classes.root}>
        <TextField
          id="title"
          label="Title"
          type="text"
          variant="outlined"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <TextField
          id="author"
          type="text"
          label="Author"
          variant="outlined"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
        <TextField
          id="url"
          type="text"
          label="Url"
          variant="outlined"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
        <Button variant="contained" color="primary" id="create-button" type="submit">create</Button>
      </form>
    </div>
  )
}

export default Create