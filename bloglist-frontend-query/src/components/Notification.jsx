import { useContext } from 'react'
import GeneralContext from './GeneralContext'

import { Alert } from "@mui/material"

const Notification = () => {
  const [message, dispatch] = useContext(GeneralContext)
  const clearNotification = (timeout) => {
    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, timeout)
  }

  if (message === null) {
    return null
  }
  if (message.type === 'error') {
    clearNotification(5000)
    return <Alert className="error" severity="error">{message.text}</Alert>
  }

  if (message.type === 'success') {
    clearNotification(5000)
    return <Alert className="success" severity="success">{message.text}</Alert>
  }
}

export default Notification
