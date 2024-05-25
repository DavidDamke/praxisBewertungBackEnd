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


//Middleware
app.use(express.json()); //for parsing application/json
app.use(cors()); //for configuring Cross-Origin Resource Sharing (CORS)
function log(req, res, next) {
    console.log(req.method + " Request at" + req.url);
    next();
}
app.use(log);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const secretKey = crypto.randomBytes(64).toString('hex');

app.use(session({
  secret: secretKey, // Use the generated secret key here
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Use true if using HTTPS
}));

function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
}

app.get('/getAllCompanies', isAuthenticated, async (req, res) => {
    try {
        const documents = await mogodbFunctions.getAllDocuments();
        res.json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching data');
    }
});

app.post('/addNewCompany', isAuthenticated,async (req, res) => {
  const newCompany = req.body;
  console.log(newCompany);
   try {
        await mogodbFunctions.addNewCompany(newCompany);
    } catch (error) {
        console.error(error);
    }
  });

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body; 
     await ldapauth(username, password);

      req.session.user= username;
      console.log("Login successfuly");

    res.status(200).send( {message: "Login successfuly"});
  } catch (error) {
                console.log("Login failed");

            console.log(error);

  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ message: 'Logout failed' });
    }
    res.status(200).send({ message: 'Logout successful' });
  });
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));