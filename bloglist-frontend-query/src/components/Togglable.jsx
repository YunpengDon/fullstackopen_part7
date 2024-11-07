import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

import { Button } from "@mui/material"

const Togglable = forwardRef((props, ref) => {
  Togglable.displayName = 'Togglable'
  const [visible, setVisible] = useState(false)
  const hideWhenVisble = { display: visible ? 'none' : '' }
  const showWhenVisble = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <div style={hideWhenVisble}>
        <Button onClick={toggleVisibility} variant="outlined">{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisble}>
        {props.children}
        <Button onClick={toggleVisibility} variant="outlined">cancel</Button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

export default Togglable
