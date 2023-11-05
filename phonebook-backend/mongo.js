const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstackopenmongo:${password}@freestackopencluster.dhyth5u.mongodb.net/phonebookApp?retryWrites=true&w=majority`

// const url =
//   `mongodb+srv://fullstackopenmongo:${password}@freestackopencluster.dhyth5u.mongodb.net/noteApp?retryWrites=true&w=majority`

  ///mongodb+srv://<username>:<password>@freestackopencluster.dhyth5u.mongodb.net/?retryWrites=true&w=majority


  
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

Person.find({}).then(people => {
  people.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})

// const person = new Person({
//   name: 'Ringo',
//   number: '1-2-1234',
// })

// person.save().then(result => {
//   console.log('person saved!')
//   mongoose.connection.close()
// })
