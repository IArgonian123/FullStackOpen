import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography
} from '@material-ui/core'

const UserList = () => {
  const users = useSelector(state => state.users)

  return (
    <TableContainer component={Paper}>
      <Typography variant="h5">Users</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Blogs created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(u => 
            <TableRow key={u.id}>
              <TableCell button to={`/users/${u.id}`} component={Link}>{u.name}</TableCell>
              <TableCell>{u.blogs.length}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default UserList