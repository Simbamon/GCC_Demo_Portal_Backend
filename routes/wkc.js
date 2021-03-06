const express = require('express');
const router = express.Router();
const path = require('path')
const fetch = require('node-fetch')
const redis = require('redis')
const util = require('util')

require('dotenv').config({ path: path.resolve(__dirname, './.env') })
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const cp4durl = process.env.URL
const uname = process.env.USERNAME
const password = process.env.PASSWORD
const redisHost = process.env.REDISHOST
const redisPort = process.env.REDISPORT
const redisPassword = process.env.REDISPASSWORD

//For Redis local
// const REDIS_PORT = "process.env.PORT || 6379"
// const redisClient = redis.createClient(REDIS_PORT)

const redisClient = redis.createClient({
    host: redisHost,
    port: redisPort,
    password: redisPassword
})

// router.get("/token", async(req, res) => {
//     redisClient.get("token", async(error, token) => {
//         if(error) throw error
//         if(token !== null) {
//             console.log("Token Cache Hit")
//             return res.json(JSON.parse(token))
//         }
//         else{
//             console.log("Getting WKC token")
//             const url = cp4durl + `icp4d-api/v1/authorize`
//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: {
//                     "Cache-Control": "no-cache",
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     username: uname,
//                     password: password
//                 })
//             })
//             .then(res => res.text())
//             .catch(e => {
//                 console.error({
//                     "message": "Error",
//                     error: e,
//                 })
//                 })
//             // console.log("RESPONSE: ", response)
//             redisClient.setex("token", 1800, response)
//             res.send(response)            
//         }
//     })
    
// })

router.get("/token", async(req, res) => {
    console.log("Getting WKC token")
    const url = cp4durl + `icp4d-api/v1/authorize`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: uname,
            password: password
        })
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

router.post("/getcatalogs", async (req, res) => {
    console.log("/getcatalog endpoint called")
    const WKC_TOK = req.body.token
    const url = cp4durl + `v2/catalogs`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + WKC_TOK
        }
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

// router.post("/getcataloginfo/:catalogID", async (req, res) => {
//     redisClient.get("cataloginfo", async(error, cataloginfo) => {
//         if(error) throw error
//         if(cataloginfo !== null) {
//             console.log("Catalog Info Cache Hit")
//             return res.json(JSON.parse(cataloginfo))
//         }
//         else{
//             console.log("/getcataloginfo endpoint called")
//             const WKC_TOK = req.body.token
//             const CP4D_CATALOG_ID = req.params.catalogID
//             console.log(CP4D_CATALOG_ID)
//             const url = cp4durl + `v2/catalogs/` + CP4D_CATALOG_ID
//             const response = await fetch(url, {
//                 method: 'GET',
//                 headers: {
//                     "Authorization": "Bearer " + WKC_TOK
//                 }
//             })
//             .then(res => res.text())
//             .catch(e => {
//                 console.error({
//                     "message": "Error",
//                     error: e,
//                 })
//                 })
//             console.log("RESPONSE: ", response)
//             redisClient.setex("cataloginfo", 1800, response)
//             res.send(response)
//         }
//     })
// })

router.post("/getcataloginfo/:catalogID", async (req, res) => {
    console.log("/getcataloginfo endpoint called")
    console.log(util.inspect(req.body, false, null, true))
    const WKC_TOK = req.body.wkc_token
    const CP4D_CATALOG_ID = req.params.catalogID
    console.log(CP4D_CATALOG_ID)
    const url = cp4durl + `v2/catalogs/` + CP4D_CATALOG_ID
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + WKC_TOK
        }
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



router.post("/getassetlist", async (req, res)=> {
    console.log("Getting asset list...")
    const WKC_TOK = req.body.token
    const url = cp4durl + `v2/asset_types/asset/search?catalog_id=c315ddd1-5711-46c2-b6e5-e919c089817d`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + WKC_TOK,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
            query: '*:*'
        })
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


// router.post("/getassetlistbyreview/:catalogID", async (req, res)=> {
//     redisClient.get("getassetlistbyreview", async(error, getassetlistbyreview) => {
//         if(error) throw error
//         if(getassetlistbyreview !== null) {
//             console.log("Asset list(review) Cache Hit")
//             return res.json(JSON.parse(getassetlistbyreview))
//         }
//         else{
//             console.log("Getting asset list by review...")
//             const WKC_TOK = req.body.token
//             const CP4D_CATALOG_ID = req.params.catalogID
//             const url = cp4durl + `v2/asset_types/asset/search?catalog_id=` + CP4D_CATALOG_ID
//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: {
//                     "Authorization": "Bearer " + WKC_TOK,
//                     'Content-Type': 'application/json',
//                     'Cache-Control': 'no-cache'
//                 },
//                 body: JSON.stringify({
//                     "limit": 5,
//                     "sort": "-asset.rating",
//                     "query": "(*:* OR *:*) AND NOT asset.asset_type:\"activity\" AND NOT asset.asset_type:\"activity_run\" AND NOT asset.asset_type:\"data_flow_run\" AND NOT asset.asset_type:\"data_flow\" AND NOT asset.description:\"Automatically transformed asset\" AND NOT asset.description:\"IBM COS Connection for Data Profile summary\" AND NOT asset.asset_category:\"SYSTEM\" AND asset.project_id:0",
//                     "include": "entity"
//                 })
//             })
//             .then(res => res.text())
//             .catch(e => {
//                 console.error({
//                     "message": "Error",
        
//                     error: e,
//                 })
//                 })
//             console.log("RESPONSE: ", response)
//             redisClient.setex("getassetlistbyreview", 1800, response)
//             res.send(response)
//         }        
//     })
// })


router.post("/getassetlistbyreview/:catalogID", async (req, res)=> {
    console.log("Getting asset list by review...")
            const WKC_TOK = req.body.wkc_token
            const CP4D_CATALOG_ID = req.params.catalogID
            const url = cp4durl + `v2/asset_types/asset/search?catalog_id=` + CP4D_CATALOG_ID
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Authorization": "Bearer " + WKC_TOK,
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({
                    "limit": 5,
                    "sort": "-asset.rating",
                    "query": "(*:* OR *:*) AND NOT asset.asset_type:\"activity\" AND NOT asset.asset_type:\"activity_run\" AND NOT asset.asset_type:\"data_flow_run\" AND NOT asset.asset_type:\"data_flow\" AND NOT asset.description:\"Automatically transformed asset\" AND NOT asset.description:\"IBM COS Connection for Data Profile summary\" AND NOT asset.asset_category:\"SYSTEM\" AND asset.project_id:0",
                    "include": "entity"
                })
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


// router.post("/getassetmeta", async (req, res)=> {
//     redisClient.get("getassetmeta", async(error, getassetmeta) => {
//         if(error) throw error
//         if(getassetmeta !== null) {
//             console.log("Asset Meta Cache Hit")
//             return res.json(JSON.parse(getassetmeta))
//         }
//         else{
//             console.log("Getting asset's meta data...")
//             const WKC_TOK = req.body.token
//             const CP4D_CATALOG_ID = req.body.catalog_id
//             const CP4D_ASSET_ID = req.body.asset_id
//             const url = cp4durl + `v2/assets/` + CP4D_ASSET_ID + `?catalog_id=` + CP4D_CATALOG_ID
//             const response = await fetch(url, {
//                 method: 'GET',
//                 headers: {
//                     "Authorization": "Bearer " + WKC_TOK
//                 }
//             })
//             .then(res => res.text())
//             .catch(e => {
//                 console.error({
//                     "message": "Error",
//                     error: e,
//                 })
//                 })
//             console.log("RESPONSE: ", response)
//             redisClient.setex("getassetmeta", 1800, response)
//             res.send(response)
//         }        
//     })
// })


router.post("/getassetmeta", async (req, res)=> {
    console.log("Getting asset's meta data...")
            const WKC_TOK = req.body.wkc_token
            const CP4D_CATALOG_ID = req.body.catalog_id
            const CP4D_ASSET_ID = req.body.asset_id
            const url = cp4durl + `v2/assets/` + CP4D_ASSET_ID + `?catalog_id=` + CP4D_CATALOG_ID
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + WKC_TOK
                }
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

router.post("/getassetreview", async (req, res)=> {
    console.log("Getting asset's review...")
    const WKC_TOK = req.body.token
    const url = cp4durl + `v2/assets/85bdfaed-d1c3-4d27-b508-696a72dbc732/ratings?catalog_id=64c25f35-eefb-4172-b6c3-38d8492fb4bb`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + WKC_TOK
        }
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


router.post("/getconnection", async (req, res)=> {
    console.log("Getting asset's connection...")
    const WKC_TOK = req.body.token
    const url = cp4durl + `v2/connections/791fc335-aa6c-4820-80d4-67f1bb2bec3e?catalog_id=64c25f35-eefb-4172-b6c3-38d8492fb4bb`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + WKC_TOK
        }
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


router.post("/getassetdata", async (req, res)=> {
    console.log("Getting asset's review...")
    const WKC_TOK = req.body.token
    const url = cp4durl + `v2/connections/assets/85bdfaed-d1c3-4d27-b508-696a72dbc732?catalog_id=64c25f35-eefb-4172-b6c3-38d8492fb4bb&fetch=data`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + WKC_TOK
        }
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