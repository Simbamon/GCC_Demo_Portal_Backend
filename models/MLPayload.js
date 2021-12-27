const mongoose = require('mongoose')

const mlPayloadSchema = mongoose.Schema({
    fields: [],
    values: []
})


module.exports = mongoose.model('MLPayload', mlPayloadSchema)