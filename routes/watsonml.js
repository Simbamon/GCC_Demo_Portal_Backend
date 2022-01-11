const express = require('express');
const router = express.Router();
const path = require('path')
const fetch = require('node-fetch')
const Payload = require('../models/MLPayload')
const redis = require('redis')
// const util = require('util')

require('dotenv').config({ path: path.resolve(__dirname, './.env') })
router.use(express.json())

const cp4dwmlurl = process.env.WMLURL
// const wml_uname = process.env.WMLUSERNAME
const wml_password = process.env.WMLPASSWORD
const redisHost = process.env.REDISHOST
const redisPort = process.env.REDISPORT
const redisPassword = process.env.REDISPASSWORD

const redisClient = redis.createClient({
    host: redisHost,
    port: redisPort,
    password: redisPassword
})

//This is for Cloud CP4D WML
// const api_key = process.env.API_KEY

// var encodedData = {
//     'grant_type': 'urn:ibm:params:oauth:grant-type:apikey',
//     'apikey': api_key
// };

// var formBody = [];

// for (var data in encodedData) {
//     var encodedKey = encodeURIComponent(data);
//     var encodedValue = encodeURIComponent(encodedData[data]);
//     formBody.push(encodedKey + "=" + encodedValue);
// }

// formBody = formBody.join("&");

// router.get("/token", async (req, res) => {
//     console.log("get the token")
//     const url = `https://iam.cloud.ibm.com/identity/token`
//     const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Accept': 'application/json'
//         },
//         body: formBody
//     })
//     .then(res => res.text())
//     .catch(e => {
//         console.error({
//             "message": "Error",
//             error: e,
//         })
//         })
//     console.log("RESPONSE: ", response)
//     res.send(response)
// })

router.post("/wmltoken", async(req, res) => {
    redisClient.get("wmltoken", async(error, token) => {
        if(error) throw error
        if(token !== null) {
            console.log("Token Cache Hit")
            return res.json(JSON.parse(token))
        }
        else{
            console.log("Getting WML token")
            console.log(req.body.username)
            const url = cp4dwmlurl + `icp4d-api/v1/authorize`
            const username = req.body.username
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Cache-Control": "no-cache",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: wml_password
                })
            })
            .then(res => res.text())
            .catch(e => {
                console.error({
                    "message": "Error",
                    error: e,
                })
                })
            // console.log("RESPONSE: ", response)
            redisClient.setex("wmltoken", 1800, response)
            res.send(response)                        
        }
    })
})

router.post('/predict', async (req, res) => {
    // console.log("Response: " + req.body)
    const AuthToken = req.body.token
    const url = req.body.url
    const input_data = req.body.input_data
    const testing = {input_data}
    // This is for testing
    // console.log(util.inspect(req.body, false, null, true))
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthToken
        },
        body: JSON.stringify(testing)
    })
    .then(res => res.text())
    .catch(e => {
        console.error({
            "message": "Error",
            error: e,
        })
        })
    console.log("RESPONSE: ", response)
    res.send(response)
})


router.get('/payload', async (req, res) => {
    try {
        const payload = await Payload.find().select('-_id -__v');
        res.json(payload);
    } catch (error) {
        res.json({ message: error })
    }
})

router.post('/payload/add', async (req, res) => {
    console.log(req.body)
    const payload = new Payload({
        fields: req.body.fields,
        values: req.body.values
    })
    try {
        const savedPost = await payload.save()
        res.json(savedPost)
    }
    catch(err) {
        res.json({ message: err })
    }
})

router.get('/payload/:postID'  , async (req, res) => {
    try {
        const payload = await Payload.findById(req.params.postID).select('-_id -__v')
        res.json(payload)
    } catch (error) {
        res.json({ message: err })
    }
})

module.exports = router