import { createContext, useReducer, useContext } from 'react'
import userService from '../services/users'

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

const userListReducer = (state, action) => {
  switch (action.type) {
  case 'INIT':
    return action.payload
  default:
    return state
  }
}

const GeneralContext = createContext()

export const GeneralContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  )
  const [user, userDispatch] = useReducer(userReducer, null)
  const [userList, userListDispatch] = useReducer(userListReducer, [])
  return (
    <GeneralContext.Provider
      value={[
        notification,
        notificationDispatch,
        user,
        userDispatch,
        userList,
        userListDispatch,
      ]}
    >
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

export const useUserList = () => {
  return useContext(GeneralContext)[4]
}

export const useUserListDispatch = () => {
  return useContext(GeneralContext)[5]
}

export default GeneralContext
