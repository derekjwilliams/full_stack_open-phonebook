const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

let url =
  process.env.MONGODB_URI_PREFIX +
  process.env.MONGODB_PASSWORD +
  process.env.MONGODB_URI_SUFFIX

url = 'mongodb+srv://fullstackopenmongo:798eAtLwEjv3GwJS@freestackopencluster.dhyth5u.mongodb.net/phonebookApp?retryWrites=true&w=majority'

console.log(
  'connecting to',
  process.env.MONGODB_URI_PREFIX + '[SECRET]' + process.env.MONGODB_URI_SUFFIX
)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
  })

  personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
