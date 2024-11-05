import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
  case 'SHOW':
    return action.payload
  case 'CLEAR':
    return null
  default:
    return state
  }
}

const userReducer = (state, action) => {
  return action.payload
}

const GeneralContext = createContext()

export const GeneralContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  )

  const [user, userDispatch] = useReducer(userReducer, null)
  return (
    <GeneralContext.Provider value={[notification, notificationDispatch, user, userDispatch]}>
      {props.children}
    </GeneralContext.Provider>
  )
}

export const useNotificationDispatch = () => {
  return useContext(GeneralContext)[1]
}

export const useUser = () => {
  return useContext(GeneralContext)[2]
}

export const useUserDispatch = () => {
  return useContext(GeneralContext)[3]
}

export default GeneralContext
