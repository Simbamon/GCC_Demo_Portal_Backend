const express = require('express')
const app = express()
const port = process.env.PORT || 5001
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config({ path: path.resolve(__dirname, './.env') })

app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'build')))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const wkcRoute = require('./routes/wkc')
const watsonmlRoute = require('./routes/watsonml')
const watsonStudioRoute = require('./routes/watsonstudio')

app.use('/wkc', wkcRoute)
app.use('/watsonml', watsonmlRoute)
// app.use('/watsonstudio', watsonStudioRoute)

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connected to db')
)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})