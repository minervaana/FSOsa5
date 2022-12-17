import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then(returned => {
      setBlogs(blogs.concat(returned))
      setErrorMessage(`A new blog ${returned.title} by ${returned.author} was added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })
  }

  const likeBlog = ( blogObject, id ) => {
    blogService
      .update(blogObject, id)
      .then(returned => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : { ...blog, likes: (blog.likes ?? 0) + 1 }))
      })
      .catch(error => {
        setErrorMessage('The blog has already been removed')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        
      })
  }

  const deleteBlog = (id, title, author) => {
    console.log(user)
    if (window.confirm(`Delete blog ${title} by ${author}?`)) {
        blogService.remove(id)
        .then(returned => {
          setErrorMessage(`Blog ${title} was deleted`)
          setBlogs(blogs.filter(blog => blog.id !== id))
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000)
        })
        .catch(error => {
          setErrorMessage("You don't have the rights to delete this blog")
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
    
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const loginForm = () => (

    < Togglable buttonLabel='log in' >
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleLogin={handleLogin} />
    </Togglable >
  )


  const blogListForm = () => (
    <div>
      <h2>All blogs</h2>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} user={user} blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog}/>
      )}
    </div>
  )

  const blogFormRef = useRef()

  const blogForm = () => (

    <Togglable buttonLabel='add a new blog' ref={blogFormRef}>
      <BlogForm
        createBlog={addBlog} />
    </Togglable>
  )

  return (
    <div>
      <Notification message={errorMessage} />
      <h2>Blogs</h2>
      {user === null ?
        loginForm() :
        <div>
          <p>Logged in as {user.name}
            <button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}
          {blogListForm()}

        </div>
      }
    </div>
  )
}

export default App
