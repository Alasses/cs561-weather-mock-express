const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const port = 3000

const data = require('./src/weather.json')

const authUser = {
  'John Doe': 'abc123'
}

//Json parser
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200);
  res.header("Content-Type", "text/plain");
  res.send('Hello World!');
});

app.get("/v1/hello", verifyAuth, (req, res) => {
  console.log("Verifying Authentication");

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err)
    {
      if(authData != 'undefined' || Date.now() > authData.exp * 1000)
      {
        res.status(403);
        res.header("Content-Type", "text/plain");
        res.send("Session Expired");
      }
      else
        res.sendStatus(403);
    }
    else
    {
      res.status(200);
      res.header("Content-Type", "application/json");
      res.send({
        "msg": "Hi",
        "secret": 114514
      });
    }
  });

});

app.get("/v1/weather", verifyAuth, (req, res) => {

  console.log("Verifying Authentication");
  console.log(req.authorization)

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err)
    {
      if(authData != 'undefined' || Date.now() > authData.exp * 1000)
      {
        res.status(403);
        res.header("Content-Type", "text/plain");
        res.send("Session Expired");
      }
      else
        res.sendStatus(403);
    }
    else
    {
      res.status(200);
      res.header("Content-Type", 'application/json');
      res.send(JSON.stringify(data));
    }
  });

});

app.post("/v1/auth", (req, res) => {

  console.log("Receiving authentication request")

  if(req.body)
  {
    if(req.body.user && authUser[req.body.user] == req.body.password)
    {
      console.log("Authentication Succeed\n")

      jwt.sign(req.body, 'secretkey', { expiresIn: 60 * 30 }, 
        (err, token) => {
          
        res.status(200);
        res.header("Content-Type", 'application/json');
        res.send({
          'auth': token
        });

        }
      );
    }
    else
    {
      console.log("Authentication Failed")
      console.log(req.body)

      res.status(403);
      res.header("Content-Type", "text/plain");
      res.send("User Not Found!");
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function verifyAuth(req, res, next){

  console.log("Extracting Authentication"); 
  const bearerHeader = req.headers['authorization'];

  if(bearerHeader != 'undefined')
  {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }
  else
  {
    res.sendStatus(403);
  }

}

