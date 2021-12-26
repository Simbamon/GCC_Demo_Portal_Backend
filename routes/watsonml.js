const express = require('express');
const router = express.Router();
const path = require('path')
const fetch = require('node-fetch')
const app = express()

require('dotenv').config({ path: path.resolve(__dirname, './.env') })
router.use(express.json())

const api_key = process.env.API_KEY

var encodedData = {
    'grant_type': 'urn:ibm:params:oauth:grant-type:apikey',
    'apikey': api_key
};

var formBody = [];

for (var data in encodedData) {
    var encodedKey = encodeURIComponent(data);
    var encodedValue = encodeURIComponent(encodedData[data]);
    formBody.push(encodedKey + "=" + encodedValue);
}

formBody = formBody.join("&");

router.get("/token", async (req, res) => {
    console.log("get the token")
    const url = `https://iam.cloud.ibm.com/identity/token`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: formBody
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

var test = {
	"input_data": [
		{
			"fields": [
                "year",
				"month",
				"dayofweek",
				"borough",
				"min_humidity",
				"max_humidity",
				"min_temp",
				"max_temp",
				"max_wind_speed",
				"weather_description"
			],
			"values": [
				[
					2021,
                    1,
					2,
					3,
					1,
					1,
					1,
					1,
					12,
					13
				]
			]
		}
	]
}

router.post('/test', async (req, res) => {
    console.log("Response: " + req.body.token)
    const AuthToken = req.body.token
    const url = req.body.url
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthToken
        },
        body: JSON.stringify(test)
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

module.exports = router