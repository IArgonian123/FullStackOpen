import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component

  let testBlog = {
    title: 'Test Blog',
    author: 'Blog tester',
    url: 'http://blogs.com/blogs/id_of_blog',
    user: {
      username: 'cool'
    }
  }

  beforeEach(() => {
    component = render(
      <Blog blog={testBlog} />
    )
  })

  test('at the start only the overview is displayed', () => {
    // Overview is displayed
    const overviewDiv = component.container.querySelector('.blogOverview')
    expect(overviewDiv).not.toHaveStyle('display: none')

    // Expanded content (Body) is not displayed
    const bodyDiv = component.container.querySelector('.blogBody')
    expect(bodyDiv).toHaveStyle('display: none')
  })

  test('when the show button is clicked, the body is displayed', () => {
    // Event: clicking button
    const visibilityButton = component.container.querySelector('.visibilityButton')
    fireEvent.click(visibilityButton)

    // Check if body is displayed
    const bodyDiv = component.container.querySelector('.blogBody')
    expect(bodyDiv).not.toHaveStyle('display: none')
  })

  test('if the like button is clicked twice, the event handler is called twice', () => {
    // Render blog with a mock handler
    const likeHandler = jest.fn()
    let component = render(<Blog 
      blog={testBlog}
      updateBlog={likeHandler}
    />)

    const likeButton = component.container.querySelector('.likeButton')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(likeHandler.mock.calls).toHaveLength(2)
  })
})