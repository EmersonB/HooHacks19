const admin = require('firebase-admin')
const express = require('express')
const path = require('path')
const moment = require('moment')

/**
 * Firebase
 */

admin.initializeApp({
  credential: admin.credential.applicationDefault()
})

const db = admin.firestore()
const dataRef = db.collection('data')

/**
 * Express
 */

const app = express()
const port = 8080

app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

/**
 * API
 */

app.post('/api/:name', (req, res) => {
  const data = req.body.data
  dataRef.doc(moment()).child(req.params.name).child('good').set(data).then(ref => {
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
