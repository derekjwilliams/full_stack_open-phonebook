const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url =
  process.env.MONGODB_URI_PREFIX +
  process.env.MONGODB_PASSWORD +
  process.env.MONGODB_URI_SUFFIX

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
    name: {
      type: String,
      required: true,
      minLength: 3,
      unique: true,
      dropDups: true
    },
    phoneNumber: {
      type: String,
      required: true,
      minLength: 8,
      validate: {
        validator: function(v) {
          return /\d{2,3}-\d+/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      },
    }
  })

  personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
