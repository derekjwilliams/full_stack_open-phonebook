require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const Person = require('./models/person')
const cors = require('cors')

const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

// Morgan, Logging middleware
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
// Request error middleware, catch incorrect formatting of ids
const requestErrorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      next(error)
    })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.name === undefined && body.phoneNumber === undefined) {
    return response.status(400).json({ error: 'name and phoneNumber missing' })
  }
  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (body.phoneNumber === undefined) {
    return response.status(400).json({ error: 'phoneNumber missing' })
  }

  const person = new Person({
    name: body.name,
    phoneNumber: body.phoneNumber,
  })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  if (body.name === undefined && body.phoneNumber === undefined) {
    return response.status(400).json({ error: 'name and phoneNumber missing' })
  }
  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (body.phoneNumber === undefined) {
    return response.status(400).json({ error: 'phoneNumber missing' })
  }

  const update = { phoneNumber: body.phoneNumber }

  Person.findOneAndUpdate({_id: request.params.id}, update, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response) => {
  Person.find({}).then((persons) => {
    response.send(
      `<html><p>Phonebook has info for ${
        persons.length
      } people</p><p>${new Date().toUTCString()}</p></html>`
    )
  })
})

app.use(unknownEndpoint)
app.use(requestErrorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
