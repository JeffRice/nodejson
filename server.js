/* a simple Express server for Node.js
   comp 424 - appTest
*/

var express = require("express"),
    http = require("http"),
    bodyParser = require("body-parser"),
    jsonApp = express();
    mongoose = require('mongoose');

    var mongoDB = 'mongodb://127.0.0.1/testdb1';
    mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
  //  mongoose.connect('mongodb://localhost/424db1');


  //define Mongoose schema for testnotes, using specific collection
  var testNoteSchema = mongoose.Schema({
    "created": Date,
    "note": String
  }, { collection : 'testNotes' });


  //model note
  var testNote = mongoose.model("testNote", testNoteSchema);



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


//json get route - update for mongo
jsonApp.get("/notes.json", function(req, res) {
  Note.find({}, function (error, notes) {
   //add some error checking...
   res.json(notes);
  });
});

//json get route - update for mongo
jsonApp.get("/testNotes.json", function(req, res) {
  testNote.find({}, function (error, testNotes) {
   //add some error checking...
   res.json(testNotes);
  });
});


jsonApp.get("/user.json", function(req, res) {
  res.json(user);
});

//json post route - update for MongoDB
jsonApp.post("/testNotes", function(req, res) {
  var newNote = new testNote({
    "created":req.body.created,
    "note":req.body.note
  });
  newNote.save(function (error, result) {
    if (error !== null) {
      console.log(error);
      res.send("error reported");
    } else {
      testNote.find({}, function (error, result) {
        res.json(result);
      })
    }
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

