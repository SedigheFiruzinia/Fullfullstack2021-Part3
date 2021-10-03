
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


//const urll = process.env.MONGODB_URI
const url = 'mongodb+srv://Mahmoodreza:Mahmoodreza@cluster0.gfsqg.mongodb.net/persons?retryWrites=true'

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, unique: true },
  number: { type: String, minlength: 8, validate: /(\d.*){8,}/ },
  idperson: String,
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)