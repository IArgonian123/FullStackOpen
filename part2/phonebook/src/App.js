import React, { useState, useEffect } from 'react'
import phonebookService from './services/phonebook.js'
import './App.css'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ search, setSearch ] = useState('')
  const [ notificationMessage, setNotificationMessage ] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)

  useEffect(() => {
    phonebookService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()

    const added = persons.some(person => person.name === newName)

    if (added) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newName)
        const updatedPerson = {...person, number: newNumber}

        phonebookService
          .update(person.id, updatedPerson)
          .then(newPerson => {
            setPersons(persons.map(person => person.id !== updatedPerson.id ? person : newPerson ))

            setNotificationMessage(`Edited ${newPerson.name}'s number`)
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })
      }
    } else {
      const personObject = { name: newName, number: newNumber }

      phonebookService
        .create(personObject)
        .then(person => {
          setPersons(persons.concat(person))
          setNewName('')

          setNotificationMessage(`Added ${person.name}`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
  }

  const deletePerson = (id) => {
    if (!window.confirm(`Delete ${persons.find(person => person.id === id).name} ?`)) {
      return;
    }

    phonebookService
      .erase(id)
      .then(() => {
        const updatedPhonebook = persons.filter(person => person.id !== id)
        setPersons(updatedPhonebook)
      })
      .catch(() => {
        const deletedPerson = persons.find(person => person.id === id)

        setErrorMessage(`Information of ${deletedPerson.name} has already been removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)

        const updatedPhonebook = persons.filter(person => person.id !== id)
        setPersons(updatedPhonebook)
      })
  }

  const personsToShow = search
    ? persons.filter(person => person.name.toUpperCase().includes(search.toUpperCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notificationMessage} messageType="notification" />
      <Notification message={errorMessage} messageType="error" />

      <Filter
        search={search} 
        setSearch={setSearch} 
      />

      <h3>Add a new</h3>

      <PersonForm 
        addPerson={addPerson} 
        setNewName={setNewName} 
        newName={newName}
        setNewNumber={setNewNumber} 
        newNumber={newNumber}
      />

      <h3>Numbers</h3>

      <Persons 
        personsToShow={personsToShow}
        deletePerson={deletePerson}   
      />
    </div>
  )
}

const Notification = ({ message, messageType }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={messageType}>
      {message}
    </div>
  )
}

const Filter = ({ setSearch, search }) => (
  <div> 
    filter shown with <input value={search} onChange={event => setSearch(event.target.value)} />
  </div>
)

const PersonForm = ({ addPerson, setNewName, setNewNumber, newName, newNumber }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={event => setNewName(event.target.value)} />
    </div>
    <div>
      number: <input value={newNumber} onChange={event => setNewNumber(event.target.value)} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ personsToShow, deletePerson }) => (
  <div>
    {personsToShow.map(person =>
      <Person 
        key={person.id} 
        name={person.name} 
        number={person.number}
        deletePerson={() => deletePerson(person.id)} 
      />
    )}
  </div>
)

const Person = ({ name, number, deletePerson }) => (
  <div> {name} {number} <button onClick={deletePerson}>delete</button> </div>
)

export default App