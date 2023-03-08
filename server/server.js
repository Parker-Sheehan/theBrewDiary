require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const {SERVER_PORT} = process.env
const {seed, dbSorted, getNamesAndIds, createPost} = require('./controller.js')

const path = require('path')
app.use(express.static('public'))

app.use(express.json())
app.use(cors())

app.post('/seed', seed)
app.post('/dbSorted', dbSorted)
app.get('/getNamesAndIds', getNamesAndIds)
app.post('/createPost', createPost)


app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public/list.html'))
})

app.get('/listjs', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public/list.js'))
})

app.get('/log-in', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public/log-in.html'))
})

app.get('/log-injs', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public/log-in.js'))
})

app.get('/css', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public/styles.css'))
})



app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))