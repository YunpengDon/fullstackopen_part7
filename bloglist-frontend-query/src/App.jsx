import { useState, useEffect, useRef, useContext } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import Notification from './components/Notification'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

import { useNotificationDispatch, useUser, useUserDispatch } from './components/NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const user = useUser()
  const userDispatch = useUserDispatch()
  const notificationDispatch = useNotificationDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ payload: user })
    }
  }, [userDispatch])

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const allBlogs = await blogService.getAll()
      return allBlogs
    },
  })
  console.log(JSON.parse(JSON.stringify(result)))

  const showErrorNotification = (error) => {
    notificationDispatch({
      type: 'SHOW',
      payload: {
        type: 'error',
        text: error.response.data.error
          ? error.response.data.error
          : error.response.statusText,
      },
    })
  }

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      console.log(`create ${response.title}`)
      notificationDispatch({
        type: 'SHOW',
        payload: {
          type: 'success',
          text: `a new blog "${response.title}" by ${response.author} added`,
        },
      })
    },
    onError: (error) => {
      showErrorNotification(error)
    },
  })

  const likeBlogMutation = useMutation({
    mutationFn: blogService.changeBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: (error) => {
      showErrorNotification(error)
    },
  })

  const removeBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: (error) => {
      showErrorNotification(error)
    },
  })

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      userDispatch({ payload: user })
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)
      console.log(`Successfully log in with ${user.username}`)
    } catch (exception) {
      notificationDispatch({
        type: 'SHOW',
        payload: {
          type: 'error',
          text: 'Wrong username or password',
        },
      })
      console.log('Wrong credentials')
    }
  }

  const handleLogOut = (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogUser')
      userDispatch({ payload: null })
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
    newBlogMutation.mutate(newBlogObject)
    blogFormRef.current.toggleVisibility()
  }

  const handleChangeLike = async (id, newObject) => {
    likeBlogMutation.mutate({ id, newObject })
  }

  const handleRemoveBlog = async (id) => {
    removeBlogMutation.mutate(id)
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
      {result.isLoading ? (
        <div>loading data...</div>
      ) : (
        result.data.sort((a, b) => b.likes - a.likes).map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            changeBlog={handleChangeLike}
            removeBlog={handleRemoveBlog}
          />
        ))
      )}
    </div>
  )
}

export default App
