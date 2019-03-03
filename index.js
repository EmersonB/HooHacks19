const admin = require('firebase-admin')
const express = require('express')
const path = require('path')
// const moment = require('moment')
const bodyParser = require('body-parser')

/**
 * Firebase
 */

admin.initializeApp({
  credential: admin.credential.applicationDefault()
})

const db = admin.firestore()

/**
 * Express
 */

const app = express()
const port = 8080

app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

app.use(bodyParser.json())

/**
 * API
 */

app.post('/api/readings/', (req, res) => {
  console.log(req.body)
  const data = req.body
  db.collection('data').add(data).then(ref => {
    res.json({ success: true, ref: ref.id })
  }).catch(err => {
    res.json({ success: false, error: err })
  })
})

const server = app.listen(port, () => {
  const serverHost = server.address().address
  const serverPort = server.address().port

  console.log(`Example app listening at http://${serverHost}:${serverPort}`)
})
