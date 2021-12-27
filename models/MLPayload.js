const mongoose = require('mongoose')

const mlPayloadSchema = mongoose.Schema({
    fields: {
        type: [String],
        required: true
    },
    values: {
        type: [Number],
        required: true
    }
})


module.exports = mongoose.model('MLPayload', mlPayloadSchema)