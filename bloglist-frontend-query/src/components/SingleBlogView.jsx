const SingleBlogView = ({ blog, changeBlog }) => {
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

  return (
    <div>
      <h2><span>{blog.title}</span> <span>{blog.author}</span></h2>
      <div><a href={blog.url}>{blog.url}</a></div>
      <div>
        likes {blog.likes} <button onClick={handleLike}>like</button>
      </div>
      <div>{blog.user.name}</div>
    </div>
  )
}

export default SingleBlogView