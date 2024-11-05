import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    changeNotification(state, action) {
      return action.payload
    },
    removeNotification(state, action) {
      return null
    },
  },
})

export const { changeNotification, removeNotification } =
  notificationSlice.actions
export const showNotification = (message, displayTime = 5) => {
  return (dispatch) => {
    dispatch(changeNotification(message))
    setTimeout(() => {
      dispatch(removeNotification())
    }, displayTime * 1000)
  }
}
export default notificationSlice.reducer
