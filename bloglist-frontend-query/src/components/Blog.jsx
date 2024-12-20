import { useState } from 'react'
import { Link } from 'react-router-dom'

import { TableRow, TableCell} from '@mui/material'

const Blog = ({ blog, changeBlog, removeBlog }) => {
  const [detailVisible, setDetailVisible] = useState(false)
  const hideWhenVisble = { display: detailVisible ? 'none' : '' }
  const showWhenVisble = { display: detailVisible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setDetailVisible(!detailVisible)
  }

  const handleLike = (event) => {
    event.preventDefault()
    const newBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    delete newBlog.id
    changeBlog(blog.id, newBlog)
    console.log(`likes of ${blog.title} +1 ✌️`)
  }

  const handleRemove = (event) => {
    event.preventDefault()
    let confirm = window.confirm(`Remove ${blog.title} by ${blog.author}`)
    if (confirm) {
      removeBlog(blog.id)
    }
  }

  return (
    <div >
      <TableRow>
        <TableCell>
          <Link to={`/blogs/${blog.id}`}>
            <span>{blog.title}</span>
          </Link>
        </TableCell>
        <TableCell>
          <span>{blog.author}</span>
          {/* <button style={hideWhenVisble} onClick={toggleVisibility}>
          view
        </button>
        <button style={showWhenVisble} onClick={toggleVisibility}>
          hide
        </button> */}
        </TableCell>
      </TableRow>
      <div style={showWhenVisble} className="blogDetails">
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button onClick={handleLike}>like</button>
        </div>
        <div>{blog.user.name}</div>
        <div>
          <button onClick={handleRemove}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog
