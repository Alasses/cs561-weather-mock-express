const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const port = 8080

const data = require('./weather.json')

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get("/v1/hello", (req, res) => {
  res.status(200)
  res.header("Content-Type",'application/json')
  res.send("Hello There!")
})

app.get("/v1/weather", (req, res) => {
  res.status(200)
  res.header("Content-Type",'application/json')
  res.send(JSON.stringify(data))
})

app.post("/v1/auth", (req, res) => {
  if(req.body)
  {
    if(req.body.user == "John Doe" && req.body.password == "abc123")
    {
      res.status(200)
      res.header("Content-Type",'application/json')
      res.send({token : "asdasiluhafisdfnadapoh134POpohp123PHP"})
    }
    else
    {
      res.status(401)
      res.header("Content-Type",'application/json')
      res.send("Invalid Authorize Information")
    }
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

