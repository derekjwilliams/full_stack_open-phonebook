require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const Person = require('./models/person')
const cors = require('cors')
const { MongoServerError } = require('mongodb')
const { Error } = require('mongoose')

const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

// Morgan, Logging middleware
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
// Request error middleware, catch incorrect formatting of ids, and validation of data matching mongo schema
const requestErrorHandler = (error, request, response, next) => {
  if (error.name === MongoServerError.name) {
    Person.findOne({ name: error.keyValue.name }).then((person) => {
      response.header('Location', `api/persons/${person.id}`)
      return response.status(422).send({ error: error.message })
    })
  }
  else {
    if (error.name === Error.ValidationError.name) {
      return response.status(400).send({ error: error.message })
    }
    if (error.name === Error.CastError.name) {
      return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
  }
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/api/persons', (request, response) => {
  if (request.query.name === undefined) {
    Person.find({}).then((persons) => {
      response.json(persons)
    })
  } else {
    const name = request.query.name
    Person.findOne({ name: name }).then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
  }
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

// }
// .catch((error) => next(error))

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const update = { name: body.name, phoneNumber: body.phoneNumber }

  Person.findByIdAndUpdate(request.params.id, update, {
    new: true,
    runValidators: true,
    context: 'query',
  })
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
