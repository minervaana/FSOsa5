import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> calls correct function with correct props', async () => {
    const user = userEvent.setup()
    const createBlog = jest.fn()

    render(<BlogForm createBlog={createBlog}/>)

    const input = screen.getByPlaceholderText('write title here')
    const input1 = screen.getByPlaceholderText('write author here')
    const input2 = screen.getByPlaceholderText('write url here')
    const sendButton = screen.getByText('Add')

    await user.type(input, 'creating a title')
    await user.type(input1, 'creating an author')
    await user.type(input2, 'creating a url')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('creating a title')
    expect(createBlog.mock.calls[0][0].author).toBe('creating an author')
    expect(createBlog.mock.calls[0][0].url).toBe('creating a url')
})