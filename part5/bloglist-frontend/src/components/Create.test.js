import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Create from './Create'

describe('<Create />', () => {
  const testBlog = {
    title: 'Pyramid',
    author: 'Mark Borg',
    url: 'http://an_url.com/4343'
  }

  test('createBlog is called with the correct parameters', () => {
    const createBlog = jest.fn()

    const component = render(
      <Create createBlog={createBlog} />
    )

    const titleField = component.container.querySelector('#title')
    fireEvent.change(titleField, {
      target: { value: testBlog.title }
    })

    const authorField = component.container.querySelector('#author') 
    fireEvent.change(authorField, {
      target: { value: testBlog.author }
    })

    const urlField = component.container.querySelector('#url') 
    fireEvent.change(urlField, {
      target: { value: testBlog.url }
    })

    const form = component.container.querySelector('form')
    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual(testBlog)
  })
})