require('dotenv').config()
const { response, request, json } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.static('build'))
app.use(express.json())
morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
const cors = require('cors')
app.use(cors())
//app.use(requestLogger)




const Person = require('./models/persons')


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons/:id', (request, response,next) => {
    const id = request.params.id
    Person.findById(request.params.id)
    .then(p=> {
        if (p){
            response.json(p)
        }else{
            response.status(404).end()
        }
    
    })
    .catch(error => next(error))
    //const person = persons.find(person => person.id === id)
   // person ? response.json(person) : response.status(404).end()

})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send('Phonebook has info for '
        + Person.length
        + ' people'
        + '<div>'
        + date
        + '</div>')
})


app.get('/api/persons', (request, response) => {
    Person.find({}).then(p => { response.json(p) })
})


app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndRemove(request.params.id)
        .then(p => {

            response.status(204).end()
        })
        .catch(error => {
            //response.status(400).send({ error: 'error' })
            next(error)
        })
    //persons = persons.filter(p => p.id !== id)
    //response.status(204).end()
})


//here.............................
app.post('/api/persons', (request, response, next) => {
    //const persontoset = { ...request.body }
    console.log('hiii')
    const persontoset = request.body
    //if (!persontoset.name || !persontoset.number) {
    // return response.status(400).json({
    // error: 'name or number missing'
    // })
    // }

    //const match = persons.find(p => p.name === persontoset.name)
    //if (match === null) {
    // return response.status(400).json({
    //  error: 'name must be unique!'
    // })
    //}
    //persontoset.id = Math.floor(Math.random() * (10000000000 - 1))
    const p = new Person({
        name: persontoset.name,
        number: persontoset.number,
        //id
    })
    //persons = persons.concat(persontoset)
    p.save()
    .then(savedPerson =>{ 
        response.json(savedPerson)
    })
    .catch(error => {next(error)})
})

app.put('/api/persons/:id', (request, response, next) => {
    console.log('puuuuttttt')
    const persontoupdate = { ...request.body}
    
    const p = {
        name: persontoupdate.name,
        number: persontoupdate.number,
    }


    Person.findByIdAndUpdate(request.params.id, p , {
        new: true, 
        runValidators: true,
        context: 'query',
      })
    .then(updatedPerson => {
        response.json(updatedPerson)
    })

    .catch(error => next(error))
})




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if(error.name === 'ValidationError'){
        return response.status(400).json({ error: error.message})
    }
    next(error)
}
// this has to be the last loaded middleware.
app.use(errorHandler)