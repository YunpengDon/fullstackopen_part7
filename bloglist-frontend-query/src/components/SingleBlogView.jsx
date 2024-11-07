import { useState } from 'react'

const SingleBlogView = ({ blog, changeBlog, addComment }) => {
  const [commentInput, setCommentInput] = useState('')
  if (!blog) {
    return null
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

  const handleSubmitCommet = (event) => {
    event.preventDefault()
    addComment(blog.id, event.target.comment.value)
    event.target.comment.value = ''
  }

  return (
    <div>
      <h2>
        <span>{blog.title}</span> <span>{blog.author}</span>
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        likes {blog.likes} <button onClick={handleLike}>like</button>
      </div>
      <div>{blog.user.name}</div>
      <h3>comments</h3>
      <form onSubmit={handleSubmitCommet}>
        <input type="text" name="comment" />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment) => {
          return <li key={comment._id}>{comment.body}</li>
        })}
      </ul>
    </div>
  )
}

export default SingleBlogView
