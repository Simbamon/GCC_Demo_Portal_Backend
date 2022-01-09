const express = require('express');
const router = express.Router();
const path = require('path')
const fetch = require('node-fetch')
const redis = require('redis')
// const util = require('util')

require('dotenv').config({ path: path.resolve(__dirname, './.env') })
router.use(express.json())

const cp4dwmlurl = process.env.WMLURL
const wml_uname = process.env.WMLUSERNAME
const wml_password = process.env.WMLPASSWORD
const redisHost = process.env.REDISHOST
const redisPort = process.env.REDISPORT
const redisPassword = process.env.REDISPASSWORD

const redisClient = redis.createClient({
    host: redisHost,
    port: redisPort,
    password: redisPassword
})

router.get("/wstoken", async(req, res) => {
    redisClient.get("wstoken", async(error, token) => {
        if(error) throw error
        if(token !== null) {
            console.log("Watson Studio Token Cache Hit")
            return res.json(JSON.parse(token))
        }
        else{
            console.log("Getting Watson Studio token")
            const url = cp4dwmlurl + `icp4d-api/v1/authorize`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Cache-Control": "no-cache",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: wml_uname,
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
            redisClient.setex("wstoken", 1800, response)
            res.send(response)                        
        }
    })
})

module.exports = router