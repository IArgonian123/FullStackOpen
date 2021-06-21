require('dotenv').config()
const express = require('express')
// const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

// morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(express.static('build'))
app.use(express.json())
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'))

app.get('/api/persons', (req, res, next) => {
  Person
    .find({})
    .then(response => {
      res.json(response)
    }).catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person
    .find({})
    .then(result => {
      res.send(
        `<p>Phonebook has info for ${result.length} people.</p> 
        <p>${new Date()}</p>`
      )
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id).then(result => {
    res.status(204).end()
  }).catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const newPerson = new Person({
    name: body.name,
    number: body.number
  })

  newPerson.save().then(response => {
    res.json(newPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { context: 'query', runValidators: true, new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})