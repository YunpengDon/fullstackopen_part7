import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    saveUser(state, action) {
      return action.payload
    },
  },
})

export const { saveUser } = userSlice.actions
export default userSlice.reducer
