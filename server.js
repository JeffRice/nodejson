var express = require("express"),
    http = require("http"),
    bodyParser = require("body-parser"),
    jsonApp = express();
    mongoose = require('mongoose');

    var mongoDB = 'mongodb://127.0.0.1/testdb2';
    mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
  //  mongoose.connect('mongodb://localhost/424db1');


  //define Mongoose schema for testnotes, using specific collection
  var testNoteSchema = mongoose.Schema({
    "created": Date,
    "note": String
  }, { collection : 'testnotes' });


  //model note
  var testNote = mongoose.model("testNote", testNoteSchema);

    //define Mongoose schema for testnotes, using specific collection
    var testUserSchema = mongoose.Schema({
      "userid": Number,
      "amount": Number,
      "portfolio": Array
    }, { collection : 'testUsers' });
  
  
    //model note
    var testUser = mongoose.model("testUser", testUserSchema);


  



//set as static file server...
jsonApp.use(express.static(__dirname + "/app"));



//parse jQuery JSON to useful JS object
jsonApp.use(bodyParser.urlencoded({ extended: false }));

//create http server
http.createServer(jsonApp).listen(3030);


testUser.find({}, function (error, testUsers) {
  //add some error checking...
  console.log(error)
  console.log('testUsersEntry')
  console.log(testUsers)
}); 

testNote.find({}, function (error, testNotes) {
  //add some error checking...
  numberOfEntries = testNotes.length;
  console.log(numberOfEntries)
  console.log('testNotes')
  console.log(testNotes)
  if(numberOfEntries === 0){
    console.log('empty')
  }
  else {
    console.log('have entries')
  }
 });


//json get route - update for mongo
jsonApp.get("/testNotes.json", function(req, res) {
  testNote.find({ }, function (error, testNotes) {
   //add some error checking...
   res.json(testNotes);
  });
});

//json get route - update for mongo
jsonApp.get("/testUsers.json", function(req, res) {
  testUser.find({}, function (error, testUsers) {
   //add some error checking...
   res.json(testUsers);
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


//json post route - update for MongoDB
jsonApp.post("/testUsers", function(req, res) {
  console.log(req.body)
  
  portfolioObject = JSON.parse(req.body.portfolio);
  updatedAmount = Number(req.body.amount);


  console.log('p object')
  console.log(portfolioObject)

  console.log('amount')
  console.log(updatedAmount)

  var newUserObject = { "amount":updatedAmount, 
                        "portfolio":portfolioObject }

  console.log(newUserObject)
  res.json({
    newUserObject
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