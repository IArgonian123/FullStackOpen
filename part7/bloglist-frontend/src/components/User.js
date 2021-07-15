import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Typography, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { ArrowRight } from '@material-ui/icons'

const User = () => {
  const { id } = useParams()

  const user = useSelector(state => 
    state.users.find(u =>
      u.id === id  
    )
  )

  if (!user) {
    return null
  }

  return (
    <div>
      <Typography variant="h5">{user.name}</Typography>
      <List>
        {user.blogs.map(b => 
          <ListItem button key={b.id}>
            <ListItemIcon><ArrowRight/></ListItemIcon>
            <ListItemText>{b.title}</ListItemText>
          </ListItem>
        )}
      </List>
    </div>
  )
}

export default User
