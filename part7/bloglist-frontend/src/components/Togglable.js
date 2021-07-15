import React, { useState, useImperativeHandle } from 'react'
import { Button, Box, Card } from '@material-ui/core'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none': '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <Box component={Card} padding={1}>
      <div onClick={toggleVisibility}>
        <Button style={hideWhenVisible} color="primary" variant="contained">
          {props.buttonLabel}
        </Button>
      </div>
      <Box style={showWhenVisible}>
        {props.children}
        <Button onClick={toggleVisibility} color="primary" variant="contained" size="small">
          cancel
        </Button>
      </Box>
    </Box>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable