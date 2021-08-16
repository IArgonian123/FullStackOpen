import React from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { USER, ALL_BOOKS } from '../queries'

const Recommendations = props => {
  const result = useQuery(USER)
  const [ getRecs, recs ] = useLazyQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  if (result.loading || recs.loading) {
    return <div>loading...</div>
  }

  const genre = result.data.me.favoriteGenre
  if (!recs.data) {
    getRecs({ variables: { genre } })

    return null
  }

  return (
    <div>
      <h3>Recommendations</h3>

      <p>books in your favorite genre <b>{genre}</b></p>

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
          {recs.data.allBooks.map(b =>
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  )
}

export default Recommendations