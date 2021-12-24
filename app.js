//Client Center CP4D Setup
const express = require('express')
const app = express()
const port = 5001
const path = require('path')
const fetch = require('node-fetch')


require('dotenv').config({ path: path.resolve(__dirname, './.env') })
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.use(express.static(path.join(__dirname, 'build')))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const wkcRoute = require('./routes/wkc')

app.use('/wkc', wkcRoute)


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})