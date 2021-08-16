import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [filter, setFilter] = useState(null)
  const [getBooks, result] = useLazyQuery(ALL_BOOKS)
  const [genres, setGenres] = useState([])

  useEffect(() => {
    if (!filter) {
      getBooks()
    } else {
      getBooks({ variables: { genre: filter } })
    }
  }, [filter, getBooks])

  const filterGenre = g => {
    setFilter(g)
    result.refetch()
  }

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  const currentGenres = books.reduce((acc, book) => acc.concat(book.genres.filter(g => !acc.includes(g))), [])
  if (currentGenres.length > genres.length) {
    setGenres(currentGenres)
  } 

  return (
    <div>
      <h2>books</h2>

      {filter&&<p>in genre <b>{filter}</b></p>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(b =>
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      
      <div>
        {genres.map(genre => 
          <button key={genre} onClick={() => filterGenre(genre)}>{genre}</button>  
        )}
        {filter&&<button onClick={() => setFilter(null)}>all books</button>}
      </div>
    </div>
  )
}

export default Books