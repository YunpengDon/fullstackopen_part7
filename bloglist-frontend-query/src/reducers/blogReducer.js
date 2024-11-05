import { createSlice } from '@reduxjs/toolkit'

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    setBlog(state, action) {
      return action.payload
    },
    createBlog(state, action) {
      return [...state, action.payload]
    },
    changeBlog(state, action) {
      const id = action.payload.id
      return state
        .map((blog) =>
          blog.id === id
            ? { ...blog, likes: action.payload.newblog.likes }
            : blog
        )
        .sort((a, b) => b.likes - a.likes)
    },
    deleteBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload)
    },
  },
})

export const { setBlog, createBlog, changeBlog, deleteBlog } = blogSlice.actions
export default blogSlice.reducer
