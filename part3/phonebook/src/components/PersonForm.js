import React from 'react'

const PersonForm = ({ addPerson, setNewName, setNewNumber, newName, newNumber }) => (
  <form onSubmit={addPerson}>
    <div>
      Name: <input value={newName} onChange={event => setNewName(event.target.value)} />
    </div>
    <div>
      Number: <input value={newNumber} onChange={event => setNewNumber(event.target.value)} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

export default PersonForm