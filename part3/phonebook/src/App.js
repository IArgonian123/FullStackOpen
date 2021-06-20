import React, { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ search, setSearch ] = useState('')
  const [ notification, setNotification ] = useState(null)

  useEffect(() => {
    phonebookService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const notifyWith = (message, type='success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  } 

  const addPerson = (event) => {
    event.preventDefault()

    const existing = persons.find(person => person.name === newName)
    if (existing) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = {...existing, number: newNumber}

        phonebookService
          .update(existing.id, updatedPerson)
          .then(newPerson => {
            setPersons(persons.map(person => person.id !== updatedPerson.id ? person : newPerson ))
            notifyWith(`Edited ${newPerson.name}'s number`)
          })
          .catch(error => {
            notifyWith(error.response.data.error, 'error')
          })
      }
    } else {
      const personObject = { name: newName, number: newNumber }

      phonebookService
        .create(personObject)
        .then(person => {
          setPersons(persons.concat(person))
          setNewName('')
          setNewNumber('')
          notifyWith(`Added ${person.name}`)
        })
        .catch(error => {
          notifyWith(error.response.data.error, 'error')
        })
    }
  }

  const deletePerson = (id) => {
    if (!window.confirm(`Delete ${persons.find(person => person.id === id).name} ?`)) {
      return;
    }

    const toDelete = persons.find(person => person.id === id)
    const updatedPhonebook = persons.filter(person => person.id !== id)

    phonebookService
      .remove(id)
      .then(() => {
        setPersons(updatedPhonebook)
        notifyWith(`Deleted ${toDelete.name}`)
      })
      .catch(() => {
        setPersons(updatedPhonebook)
        notifyWith(`Information of ${toDelete.name} had already been removed from the server`, 'error')
      })
  }

  const personsToShow = search
    ? persons.filter(person => person.name.toUpperCase().includes(search.toUpperCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification notification={notification} />

      <Filter
        search={search} 
        setSearch={setSearch} 
      />

      <h3>Add a new entry</h3>

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

export default App