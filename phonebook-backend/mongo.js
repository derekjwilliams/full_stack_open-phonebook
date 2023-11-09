const mongoose = require('mongoose')

const logUsage = () => {
  console.log(`Usage:
    node mongo.js [password] [new name] [new number]
  if only password is provided lists the people in the phonebook`)
}

if (process.argv.length < 3) {
  logUsage()
  process.exit(1)
}

if (process.argv.length > 5) {
  console.log('Error, too many arguments')
  logUsage()
  process.exit(1)
}

if (process.argv.length === 4) {
  console.log('Error, both name and number are required')
  logUsage()
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstackopenmongo:${password}@freestackopencluster.dhyth5u.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
})

const Person = mongoose.model('Person', personSchema)

const addPerson = (name, phoneNumber) => {
  const person = new Person({
    name: name,
    phoneNumber: phoneNumber,
  })

  person.save().then((person) => {
    console.log(
      `added ${person.name} number ${person.phoneNumber} to phonebook`
    )
    mongoose.connection.close()
  })
}

const displayPeople = () => {
  console.log('phonebook:')
  Person.find({}).then((people) => {
    people.forEach((person) => {
      console.log(`${person.name} ${person.phoneNumber}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  addPerson(process.argv[3], process.argv[4])
}

if (process.argv.length === 3) {
  displayPeople()
}
