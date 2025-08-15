const express = require('express')
var morgan = require('morgan')

const app = express()

app.use(express.json())

morgan.token('content', req => {
  return JSON.stringify(req.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content"))

var data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
  ]  

app.get('/info', (req, res) => {
    let d = new Date()
    let size = data.length
    res.send(`Phonebook has info por ${size} people <br><br> ${d}`)
})

app.get('/api/persons', (req, res) => {
    res.json(data)
})

app.get('/api/persons/:id', (req, res) => {
    const query = req.params.id
    let entry = data.find(entry => entry.id === query)

    if (entry)
        res.json(entry)
    else
        res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    data = data.filter(entry => entry.id !== id)

    res.status(204).end()
})

app.post('/api/persons/', (req, res) => {
    const newEntry = req.body

    if(JSON.stringify(Object.keys(newEntry)) !== JSON.stringify(['name', 'number', 'id']))
    {
      res.status(400).end()
      return
    }

    if(data.find(entry => newEntry.name === entry.name))
    {
      res.status(400).end()
      return
    }

    if(data.find(entry => newEntry.id === entry.id))
    {
      res.status(422).end()
      return
    }
    data.push(newEntry)
    res.status(204).end()
})

const PORT = process.env.PORT || 3001 
app.listen(PORT, () => {
    console.log('Server running on port ', PORT)
})
