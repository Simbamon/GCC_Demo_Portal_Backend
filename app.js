const express = require('express')
const app = express()
const port = 5001
const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config({ path: path.resolve(__dirname, './.env') })
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'build')))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const wkcRoute = require('./routes/wkc')
const watsonmlRoute = require('./routes/watsonml')

app.use('/wkc', wkcRoute)
app.use('/watsonml', watsonmlRoute)

app.get(['/asdf', '/asdf/:ID'], function(req, res) {
    console.log("masdf")
    console.log(req.params.ID)
})

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connected to db')
)

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})