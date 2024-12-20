import { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import {
  BrowserRouter as Router,
  Link,
  Routes,
  Route,
  useMatch,
} from 'react-router-dom'
import Notification from './components/Notification'
import NavBar from './components/NavBar'
import Blog from './components/Blog'
import SingleBlogView from './components/SingleBlogView'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Users from './components/Users'
import User from './components/User'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import './index.css'
import { Button, Container, Typography, TextField, TableContainer, Table, TableBody, Paper} from "@mui/material"

import {
  useNotificationDispatch,
  useUser,
  useUserDispatch,
  useUserList,
  useUserListDispatch,
} from './components/GeneralContext'

const App = () => {
  const queryClient = useQueryClient()
  const user = useUser()
  const userDispatch = useUserDispatch()
  const notificationDispatch = useNotificationDispatch()
  const userList = useUserList()
  const userListDispatch = useUserListDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const matchUser = useMatch('/users/:id')
  const matchBlog = useMatch('/blogs/:id')
  const userMatchedByID = matchUser
    ? userList.find((user) => user.id === matchUser.params.id)
    : null

  const showErrorNotification = useCallback(
    (error) => {
      notificationDispatch({
        type: 'SHOW',
        payload: {
          type: 'error',
          text: error.response.data.error || error.response.statusText,
        },
      })
    },
    [notificationDispatch]
  )

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ payload: user })
    }
  }, [userDispatch])

  useEffect(() => {
    if (user !== null) {
      userService
        .getUsers()
        .then((response) => {
          userListDispatch({
            type: 'INIT',
            payload: response,
          })
        })
        .catch((error) => {
          console.log(error)
          showErrorNotification(error)
        })
    }
  }, [showErrorNotification, user, userListDispatch])

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const allBlogs = await blogService.getAll()
      return allBlogs
    },
  })
  console.log(JSON.parse(JSON.stringify(result)))

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

  const addCommentMutation = useMutation({
    mutationFn: blogService.addComment,
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
        <TextField label="User Name"
          type="text"
          value={username}
          name="Username"
          data-testid="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <TextField label="Password"
          type="text"
          value={password}
          name="Password"
          data-testid="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button type="submit" variant="contained">login</Button>
    </form>
  )

  const handleCreate = async (newBlogObject) => {
    newBlogMutation.mutate(newBlogObject)
    blogFormRef.current.toggleVisibility()
  }

  const handleChangeLike = async (id, newObject) => {
    likeBlogMutation.mutate({ id, newObject })
  }

  const handleAddComment = async (id, comment) => {
    console.log('handle add comment', comment)
    addCommentMutation.mutate({ id, comment })
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

  const BlogLists = () => (
    <>
      {createForm()}
      {result.isLoading ? (
        <div>loading data...</div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {result.data
                .sort((a, b) => b.likes - a.likes)
                .map((blog) => (
                  <Blog
                    key={blog.id}
                    blog={blog}
                    changeBlog={handleChangeLike}
                    removeBlog={handleRemoveBlog}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  )

  if (user === null) {
    return (
      <div>
        <Typography variant='h2'>Log in to application</Typography>
        <Notification />
        {loginForm()}
      </div>
    )
  }

  const blogMatchedByID =
    result.isSuccess && matchBlog
      ? result.data.find((blog) => blog.id === matchBlog.params.id)
      : null

  return (
    <Container>
      <NavBar>
        <em>{user.name} logged in </em><Button onClick={handleLogOut} color="inherit">log out</Button>
      </NavBar>
      <h2>Blogs App</h2>
      <Notification />

      <Routes>
        <Route path="/users/:id" element={<User user={userMatchedByID} />} />
        <Route path="/users" element={<Users users={userList} />} />
        <Route
          path="/blogs/:id"
          element={
            <SingleBlogView
              blog={blogMatchedByID}
              changeBlog={handleChangeLike}
              addComment={handleAddComment}
            />
          }
        />
        <Route path="/" element={<BlogLists />} />
      </Routes>
    </Container>
  )
}

export default App
