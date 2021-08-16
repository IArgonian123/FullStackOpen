import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import Select from 'react-select'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [ name, setName ] = useState(null)
  const [ year, setYear ] = useState('')
  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const setBirthYear = event => {
    event.preventDefault()

    editAuthor({ variables: { name: name.value, setBornTo: Number(year) } })

    setName('')
    setYear('')
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h3>Set birth year</h3>
      <form onSubmit={setBirthYear}>
        <div>
          name
          <Select 
            defaultValue={name}
            onChange={setName} 
            options={authors.map(a => ({ value: a.name, label: a.name }))}
          />
        </div>
        <div>
          born
          <input 
            value={year}
            onChange={({ target}) => setYear(target.value)}
          />
        </div>
        <button type='sumbit'>update author</button>
      </form>
    </div>
  )
}

export default Authors
