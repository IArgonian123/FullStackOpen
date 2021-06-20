import React from 'react'

const Filter = ({ setSearch, search }) => (
  <div> 
    Filter shown with <input value={search} onChange={event => setSearch(event.target.value)} />
  </div>
)

export default Filter
