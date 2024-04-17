const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const port = 8080;
const filename = __dirname + "/profs.json";
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



app.get('/getAllCompanies', async (req, res) => {
    try {
        const documents = await mogodbFunctions.getAllDocuments();
        res.json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching data');
    }
});

app.post('/addNewCompany', async(req, res) => {
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


            console.log("Login successfuly");

    res.json("worked");
  } catch (error) {
                console.log("Login failed");

            console.log(error);

  }
});


app.listen(port, () => console.log(`Server listening on port ${port}!`));