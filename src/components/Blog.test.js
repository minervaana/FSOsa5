import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { getByText, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
    let blog
    let user

    beforeEach(() => {
        user = {
            username: 'minerwa',
            name: 'Mirka Väänänen',
            passwordHash: 'hkshkhdkjha',
            blogs: []
        }
        blog = {
            title: 'Hulluus',
            author: 'minerwa',
            url: 'www.wololoo.fi',
            likes: 0,
            user: user
        }
    })

    test('renders title and author', () => {
        render(<Blog blog={blog} user={user} />)

        const element = screen.getByText('Hulluus minerwa')
    })

    test('clicking the view button opens details', async () => {
    
        const { container } = render(<Blog blog={blog} user={user}/>)

        const screenUser = userEvent.setup()
        const button = screen.getByText('view')
        await screenUser.click(button)

        const div = container.querySelector('.blogExpanded')
        expect(div).toHaveTextContent('www.wololoo.fi')
        expect(div).toHaveTextContent('likes 0')
        expect(div).toHaveTextContent('Mirka Väänänen')
    })

    test('clicking the like button calls mockhandler twice', async () => {
        const mockhandler = jest.fn()

        render(<Blog blog={blog} user={user} likeBlog={mockhandler}/>)

        const testUser = userEvent.setup()
        const button = screen.getByText('like')
        await testUser.click(button)
        await testUser.click(button)

        expect(mockhandler.mock.calls).toHaveLength(2)
    })
})
