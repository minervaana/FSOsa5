import PropTypes from 'prop-types'
import { useState } from "react"

const BlogForm = ({ createBlog }) => {

    const [newTitle, setTitle] = useState('')
    const [newAuthor, setAuthor] = useState('')
    const [newUrl, setUrl] = useState('')

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }

    const handleAuthorChange = (event) => {
        setAuthor(event.target.value)
    }

    const handleUrlChange = (event) => {
        setUrl(event.target.value)
    }

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: newTitle,
            author: newAuthor,
            url: newUrl
        })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <div>
                <h2>Add a blog</h2>
                <form onSubmit={addBlog}>
                    <div>
                        <div>
                            Title
                            <input id='title' value={newTitle} onChange={handleTitleChange} placeholder='write title here' />
                        </div><div>
                            Author
                            <input id='author' value={newAuthor} onChange={handleAuthorChange} placeholder='write author here' />
                        </div><div>
                            Url
                            <input id='url' value={newUrl} onChange={handleUrlChange} placeholder='write url here' />
                        </div>
                    </div>
                    <button id='addButton' type='submit'>Add</button>
                </form>
            </div>
        </div>
    )
}

BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
}

export default BlogForm