/* a simple Express server for Node.js
   comp 424 - appTest
*/

var express = require("express"),
    http = require("http"),
    bodyParser = require("body-parser"),
    jsonApp = express();




var notes = {
  "travelNotes": [{
  "created": "2015-10-12T00:00:00Z",
  "note": "Curral das Freiras..."
  }]
};

var user = {
  "amount": 10000,
  "portfolio": [],
  id: 0
};

//set as static file server...
jsonApp.use(express.static(__dirname + "/app"));



//parse jQuery JSON to useful JS object
jsonApp.use(bodyParser.urlencoded({ extended: false }));

//create http server
http.createServer(jsonApp).listen(3030);

//json get route
jsonApp.get("/notes.json", function(req, res) {
  res.json(notes);
});

jsonApp.get("/user.json", function(req, res) {
  res.json(user);
});

jsonApp.post("/notes", function(req, res) {
  //store new object in req.body
  var newNote = req.body;
  //push new note to JSON
  notes["travelNotes"].push(newNote);
  //return simple JSON object
  res.json({
    "message": "post complete to server"
  });
});

jsonApp.put("/userAmount", function(req, res) {
  //store new object in req.body
  var updatedUserAmount = req.body.amount;
  console.log(req.body)
  console.log(req.body.amount)
  console.log(user)
  console.log(user.amount)
  //push new note to JSON
  user.amount = updatedUserAmount;

  console.log(user)
  //return simple JSON object
  res.json({
    "newUserAmount": user.amount
  });
});

