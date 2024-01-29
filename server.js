const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const port = 8080;
const filename = __dirname + "/profs.json";
const ldap = require('ldapjs');
const tls = require('tls');


//Middleware
app.use(express.json()); //for parsing application/json
app.use(cors()); //for configuring Cross-Origin Resource Sharing (CORS)
function log(req, res, next) {
    console.log(req.method + " Request at" + req.url);
    next();
}
app.use(log);

const ldapClient = ldap.createClient({
  url: 'ldap://localhost:10389',
});

ldapClient.on('error', (err) => {
  console.error('LDAP client error:', err);
});

app.post('/login2', (req, res) => {
  const { username, password } = req.body;
      //  username = "riemann";
       // password = 'password';
  // Construct the user's DN. The exact format can vary based on your LDAP server setup.
  //const userDN = `uid=${username},ou=mathematicians,dc=example,dc=com`;

  ldapClient.bind('cn=admin,dc=planetexpress,dc=com', 'GoodNewsEveryone', (err) => {
    if (err) {
        // Authentication failed
      console.log('Failed', err);

      res.status(401).send('Authentication failed');
    } else {
      // Authentication successful
        // Here, you can create a session or token as per your application's requirement
            console.log("Success");

      res.send('Authentication successful');
    }
  });
});



app.post('/login', async (req, res) => {
  try {
            console.log("Login successfuly");

    res.json("worked");
  } catch (error) {
  }
});
//Endpoints
// app.get("/profs", function (req, res) {
//     fs.readFile(filename, "utf8", function (err, data) {
//         res.writeHead(200, {
//             "Content-Type": "application/json",
//         });
//         res.end(data);
//     });
// });

// app.get("/profs/:id", function (req, res) {
//     fs.readFile(filename, "utf8", function (err, data) {
//         const dataAsObject = JSON.parse(data)[req.params.id];
//         res.writeHead(200, {
//             "Content-Type": "application/json",
//         });
//         res.end(JSON.stringify(dataAsObject));
//     });
// });

// app.put("/profs/:id", function (req, res) {
//     fs.readFile(filename, "utf8", function (err, data) {
//         let dataAsObject = JSON.parse(data);
//         dataAsObject[req.params.id].name = req.body.name;
//         dataAsObject[req.params.id].rating = req.body.rating;
//         fs.writeFile(filename, JSON.stringify(dataAsObject), () => {
//             res.writeHead(200, {
//                 "Content-Type": "application/json",
//             });
//             res.end(JSON.stringify(dataAsObject));
//         });
//     });
// });

// app.delete("/profs/:id", function (req, res) {
//     fs.readFile(filename, "utf8", function (err, data) {
//         let dataAsObject = JSON.parse(data);
//         dataAsObject.splice(req.params.id, 1);
//         fs.writeFile(filename, JSON.stringify(dataAsObject), () => {
//             res.writeHead(200, {
//                 "Content-Type": "application/json",
//             });
//             res.end(JSON.stringify(dataAsObject));
//         });
//     });
// });

// app.post("/profs", function (req, res) {
//     fs.readFile(filename, "utf8", function (err, data) {
//         let dataAsObject = JSON.parse(data);
//         dataAsObject.push({
//             id: dataAsObject.length,
//             name: req.body.name,
//             rating: req.body.rating,
//         });
//         fs.writeFile(filename, JSON.stringify(dataAsObject), () => {
//             res.writeHead(200, {
//                 "Content-Type": "application/json",
//             });
//             res.end(JSON.stringify(dataAsObject));
//         });
//     });
// });

app.listen(port, () => console.log(`Server listening on port ${port}!`));