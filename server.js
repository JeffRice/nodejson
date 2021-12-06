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


    //define Mongoose schema for transactions, using specific collection
    var TransactionSchema = mongoose.Schema({
      "time": Date,
      "transactionID": Number,
      "symbol": String,
      "shares": Number,
      "price": Number,
      "action": String,
      "change": Number
    }, { collection : 'testUsers' });
  
  
    //model note
    var Transaction = mongoose.model("Transaction", TransactionSchema);

    //define Mongoose schema for testuser, using specific collection
    var testUserSchema = mongoose.Schema({
      "userid": Number,
      "amount": Number,
      "portfolio": Array
    }, { collection : 'testUsers' });
  
  
    //model user
    var testUser = mongoose.model("testUser", testUserSchema);


    //create default user if no entries
    testUser.find({}, function (error, testUsers) {
      numberOfEntries = testUsers.length;
      console.log(numberOfEntries)
      console.log('testUsers')
      console.log(testUsers)
      if(numberOfEntries === 0){
        console.log('empty')
        var newUser = new testUser({
          "amount": 10000,
          "portfolio": [],
          "userid": 1
        });
        newUser.save(function (error, result) {
        });
        var newTransaction = new Transaction({
          "transactionID": 0,
          "change": 10000
        });
        newTransaction.save(function (error, result) {
        });

      }
      else {
        console.log('have entries')


            /*
        testUser.find({"userid" : 1}).lean().exec(function(err, docObject) {
          console.log(docObject)
          console.log(docObject[0].portfolio)
        });
        */
      }
     });


//set as static file server...
jsonApp.use(express.static(__dirname + "/app"));



//parse jQuery JSON to useful JS object
jsonApp.use(bodyParser.urlencoded({ extended: false }));

//create http server
http.createServer(jsonApp).listen(3030);


//json get route - update for mongo
jsonApp.get("/testNotes.json", function(req, res) {
  testNote.find({ }, function (error, testNotes) {
   //add some error checking...
   res.json(testNotes);
  });
});

//json get route - update for mongo
jsonApp.get("/Transactions.json", function(req, res) {

  Transaction.find({   transactionID: { $gt: 0 }  }, function (error, Transactions) {
   //add some error checking...
   res.json(Transactions);
  });
});

//json get route - update for mongo
jsonApp.get("/Portfolio.json", function(req, res) {
  testUser.find({ userid: 1 }, function (error, testUsers) {
   //add some error checking...
   res.json(testUsers);
  });
});

//json post route - update for MongoDB
jsonApp.post("/Transactions", function(req, res) {

  // get the doc with the highest transactionID
  testUser.find({}).lean().sort([['transactionID', -1]]).limit(1).exec(function(err, docs) { 
    
    console.log(docs)
    


      console.log(docs[0]["transactionID"])
      console.log(docs[0].transactionID)
        // increment highest transactionID 
      var newTransactionID = (docs[0].transactionID + 1);


 
    //new transaction object
    var newTransaction = new Transaction({
      "time": req.body.time,
      "transactionID": newTransactionID,
      "symbol": req.body.symbol,
      "shares": req.body.shares,
      "price": req.body.price,
      "action": req.body.action,
      "change": req.body.change
  });

    //save transaction object
    newTransaction.save(function (error, result) {
      if (error !== null) {
        console.log(error);
        res.send("error reported");
      } else {
        Transaction.find({}, function (error, result) {
          res.json(result);
            })
           }
     });


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
                        "portfolio":portfolioObject, "userid": 1 }

  console.log(newUserObject)


  const query = { userid: 1 };

  testUser.findOneAndUpdate(query, newUserObject, {upsert: true}, function(err, doc) {
    if (err) return res.send(500, {error: err});
    return res.send('Succesfully saved.');
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