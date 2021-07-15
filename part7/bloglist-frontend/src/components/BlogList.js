import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { List, ListItem, ListItemText } from '@material-ui/core'

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)

  return (
    <List>
      {blogs.map(blog =>
        <ListItem component={Link} to={`/blogs/${blog.id}`} button key={blog.id} >
          <ListItemText primary={blog.title} secondary={blog.author}/>
        </ListItem>
      )}
    </List>
  )
}

export default BlogList