import PropTypes from 'prop-types'
import { useState } from "react"
import '../blog.css'

const Blog = ({ user, blog, likeBlog, deleteBlog }) => {
  const authored = user.name === blog.user.name
  const [showDetails, setShowDetails] = useState(false)

  const showWhenAuthored = {display: authored ?'' : 'none'}

  const toggleDetails = () => {
    setShowDetails(!showDetails)
    
  }

  const handleLike = (event) => {
    event.preventDefault()
    likeBlog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user
    }, blog.id)
  }

  const handleDelete = (event) => {
    event.preventDefault()
    deleteBlog(blog.id, blog.title, blog.author)
  }

  return (
    <div>
      {showDetails && 
       <div className='blogExpanded'>
       {blog.title} {blog.author}
       <button onClick={toggleDetails}>hide</button>
       <br></br>
       {blog.url}
       <br></br>
       likes {blog.likes}
       <button id='likeButton' onClick={handleLike}>like</button>
       <br></br>
       {blog.user.name}
       <br></br>
       <button onClick={handleDelete} style={showWhenAuthored}>delete</button>
     </div>
      }
      {!showDetails && 
      <div className='blog'>
      {blog.title} {blog.author}
      <button onClick={toggleDetails}>view</button>
    </div>
      }
    </div>
  )
}

Blog.propTypes = {
  user: PropTypes.object.isRequired,
  blog: PropTypes.object.isRequired,
}

export default Blog