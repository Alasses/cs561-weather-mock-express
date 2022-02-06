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
      res.header("Content-Type", "text/plain");
      res.send("Hello there, and Welcome!");
    }
  });

});

app.get("/v1/weather", verifyAuth, (req, res) => {

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
      res.header("Content-Type", 'application/json');
      res.send(JSON.stringify(data));
    }
  });

});

app.post("/v1/auth", (req, res) => {
  if(req.body)
  {
    if(req.body.user && authUser[req.body.user] == req.body.password)
    {
      jwt.sign(req.body, 'secretkey', { expiresIn: 60 * 30 }, 
        (err, token) => {
          res.json({
            'AuthToken': token
          });
        }
      );
    }
    else
    {
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
    const bearerToken = bearerHeader;
    req.token = bearerToken;
    next();
  }
  else
  {
    res.sendStatus(403);
  }

}

