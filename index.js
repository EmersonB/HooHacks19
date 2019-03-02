const express = require('express')
const path = require('path')
const app = express()

const port = 5000

app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

/**
 * API
 */



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
