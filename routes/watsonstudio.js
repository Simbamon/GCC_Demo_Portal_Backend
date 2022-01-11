// Comment: Not using this API


// const express = require('express');
// const router = express.Router();
// const path = require('path')
// const fetch = require('node-fetch')
// // const util = require('util')

// require('dotenv').config({ path: path.resolve(__dirname, './.env') })
// router.use(express.json())

// const cp4dwmlurl = process.env.WMLURL
// const wml_password = process.env.WMLPASSWORD

// router.post("/wstoken", async(req, res) => {
//     console.log("Getting Watson Studio token")
//     const uname = req.body.uname
//     const upassword = wml_password
//     const url = cp4dwmlurl + `icp4d-api/v1/authorize`
//     const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//             "Cache-Control": "no-cache",
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             username: uname,
//             password: upassword
//         })
//     })
//     .then(res => res.text())
//     .catch(e => {
//         console.error({
//             "message": "Error",
//             error: e,
//         })
//         })
//     // console.log("RESPONSE: ", response)
//     res.send(response)  
// })

// router.post('/createproject', async (req, res) => {
//     console.log("Creating Watson Studio Project")
//     const AuthToken = req.body.token
//     const url = cp4dwmlurl + `transactional/v2/projects`
//     const username = req.body.uname
//     const projectName = req.body.project_title
//     const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + AuthToken
//         },
//         body: JSON.stringify({
//             name: projectName,
//             description: username + "의 프로젝트입니다.",
//             public: false,
//             enforce_members: true,
//             storage: {
//                 type: "assetfiles",
//                 guid: "aa817103-b634-4306-b412-7b96d9802564"
//     }
//         })
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

// module.exports = router