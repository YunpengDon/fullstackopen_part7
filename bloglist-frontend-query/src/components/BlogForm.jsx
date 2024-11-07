import { useState } from 'react'
import { InputLabel,Button, TextField, Typography } from "@mui/material"

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    })
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }
  return (
    <div>
      <Typography variant='h2'>create new</Typography>
      <form onSubmit={addBlog}>
        <InputLabel>
          <Typography variant='body1'>title{' '}</Typography>
          <TextField variant="filled" size="small"
            type="text"
            value={blogTitle}
            name="blogTitle"
            placeholder="Enter blog title"
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </InputLabel>
        <InputLabel>
          <Typography variant='body1'>author{' '}</Typography>

          <TextField variant="filled" size="small"
            type="text"
            value={blogAuthor}
            name="blogAuthor"
            placeholder="Enter blog author"
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </InputLabel>
        <InputLabel>
          <Typography variant='body1'>url{' '}</Typography>

          <TextField variant="filled" size="small"
            type="text"
            value={blogUrl}
            name="blogUrl"
            placeholder="Enter blog URL"
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </InputLabel>
        <Button type="submit" variant="contained">create</Button>
      </form>
    </div>
  )
}

export default BlogForm
