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
const port = 5000

app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

/**
 * API
 */

app.post('/api/readings/', (req, res) => {
  const data = req.body.data
  dataRef.doc(moment()).set(data).then(ref => {
    res.json({ success: true, ref: ref.id })
  }).catch(err => {
    res.json({ success: false, error: err })
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
