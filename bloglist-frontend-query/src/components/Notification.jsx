import { useContext } from 'react'
import GeneralContext from './NotificationContext'

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
    return <div className="error">{message.text}</div>
  }

  if (message.type === 'success') {
    clearNotification(5000)
    return <div className="success">{message.text}</div>
  }
}

export default Notification
