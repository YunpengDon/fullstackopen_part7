import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Notification from './components/Notification'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

import { showNotification } from './reducers/notificationReducer'
import {
  setBlog,
  createBlog,
  changeBlog,
  deleteBlog,
} from './reducers/blogReducer'
import { saveUser } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()
  const blogLists = useSelector((state) => state.blog)
  const user = useSelector((state) => state.user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    async function fetchData() {
      const allBlogs = await blogService.getAll()
      // sort the blog posts by the number of likes
      allBlogs.sort((a, b) => b.likes - a.likes)
      dispatch(setBlog(allBlogs))
    }
    fetchData()
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(saveUser(user))
    }
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      dispatch(saveUser(user))
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)
      console.log(`Successfully log in with ${user.username}`)
    } catch (exception) {
      dispatch(
        showNotification({
          type: 'error',
          text: 'Wrong username or password',
        })
      )
      console.log('Wrong credentials')
    }
  }

  const handleLogOut = (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogUser')
      dispatch(saveUser(null))
      console.log('Successfully log out')
    } catch (error) {
      console.error(error)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin} data-testid="loginForm">
      <div>
        username{' '}
        <input
          type="text"
          value={username}
          name="Username"
          data-testid="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password{' '}
        <input
          type="text"
          value={password}
          name="Password"
          data-testid="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const handleCreate = async (newBlogObject) => {
    try {
      const newblog = await blogService.create(newBlogObject)
      console.log(`create ${newblog.title}`)
      dispatch(createBlog(newblog))
      blogFormRef.current.toggleVisibility()
      dispatch(
        showNotification({
          type: 'success',
          text: `a new blog "${newblog.title}" by ${newblog.author} added`,
        })
      )
    } catch (error) {
      console.log(error)
      dispatch(
        showNotification({
          type: 'error',
          text: error.response.data.error,
        })
      )
    }
  }

  const handleChangeLike = async (id, newBlogObject) => {
    try {
      const newblog = await blogService.changeBlog(id, newBlogObject)
      dispatch(changeBlog({ id: id, newblog: newblog }))
    } catch (error) {
      console.log(error)
      dispatch(
        showNotification({
          type: 'error',
          text: error.response.data.error,
        })
      )
    }
  }

  const handleRemoveBlog = async (id) => {
    try {
      await blogService.deleteBlog(id)
      dispatch(deleteBlog(id))
    } catch (error) {
      console.log(error)
      dispatch(
        showNotification({
          type: 'error',
          text: error.response.data.error
            ? error.response.data.error
            : error.response.statusText,
        })
      )
    }
  }

  const blogFormRef = useRef()

  const createForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={handleCreate} />
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        {loginForm()}
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        <p>
          {user.name} logged in <button onClick={handleLogOut}>log out</button>
        </p>
      </div>
      {createForm()}
      {blogLists.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          changeBlog={handleChangeLike}
          removeBlog={handleRemoveBlog}
        />
      ))}
    </div>
  )
}

export default App
