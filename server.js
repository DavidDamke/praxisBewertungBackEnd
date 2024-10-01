const express = require("express");
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const cors = require("cors");
const port = 8080;
const ldap = require('ldapjs');
const ldapauth = require('./ldapAuth/LDAP');
const mogodbFunctions = require('./mongoDb/mongoDbfunctions');
const tls = require('tls');
const { MongoClient } = require('mongodb');



app.use(express.json()); 
app.use(cors());

function log(req, res, next) {
    console.log(req.method + " Request at" + req.url);
    next();
}
app.use(log);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const secretKey = crypto.randomBytes(64).toString('hex');

app.use(session({
  secret: secretKey, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
}

app.get('/api/getAllCompanies', async (req, res) => { 
    try {
        const documents = await mogodbFunctions.getAllDocuments();
        res.json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching data');
    }
});

app.post('/api/addNewCompany',async (req, res) => {
  const newCompany = req.body;
   try {
        await mogodbFunctions.addNewCompany(newCompany);
    } catch (error) {
        console.error(error);
    }
  });

  app.post('/api/addUser',async (req, res) => {
    const user = req.body;
    
     try {
          await mogodbFunctions.addUser(user);
      } catch (error) {
          console.error(error);
      }
    });
  app.post('/api/getUser',async (req, res) => {
    const username = req.body;
     try {
      const documents =  await mogodbFunctions.getUser(username);
      res.json(documents);
      } catch (error) {
          console.error(error);
      }
    });
  app.post('/api/updateUser',async (req, res) => {
    const user = req.body;
     try {
      const documents =  await mogodbFunctions.updateUser(user);
      res.json(documents);
      } catch (error) {
          console.error(error);
      }
    });

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body; 
    await ldapauth(username, password).catch();


      req.session.user= username;
      console.log("Login successfuly");

    res.status(200).send( {message: "Login successfuly"});
  } catch (error) {
    if (error.name === "InvalidCredentialsError"|| error.message === "Invalid Credentials") {
      // Respond with 401 for authentication-related errors
      console.log(error)
      res.status(401).send({ message: "Invalid credentials" });
    } else {
      // For other types of errors, respond with a different status code
      console.log("An unexpected error occurred:", error);
      res.status(500).send({ message: "An unexpected error occurred. Please try again later." });
    }
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ message: 'Logout failed' });
    }
    res.status(200).send({ message: 'Logout successful' });
  });
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));