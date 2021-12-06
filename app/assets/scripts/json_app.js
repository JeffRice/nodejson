//load main app logic
function loadApp() {
  "use strict";
  var currentPortfolio = [];


function buildTransactions(response) {
  //get travelNotes
  $(".note-output").empty();
  console.log(response);
  //process travelNotes array
  response.forEach(function(item) {
    console.log(item)
    if (item !== null) {
      var symbol = item.symbol;
      var created = item.time;
      var shares = item.shares;
      var price = item.price;
      var action = item.action;
      var change = item.change;
      //create each note's <p>
      var p = $("<p>");
      //add note text
      p.html(symbol);
      //append to DOM
      $(".note-output").append(p);
      $(".note-output").append('shares: ' + shares + '|');
      $(".note-output").append('price: ' + price + '|');
      $(".note-output").append('action: ' + action + '|');
      $(".note-output").append('change: ' + change + '|');
      $(".note-output").append('date item created: ' + created + '');
      var hr = $("<hr />");
      $(".note-output").append(hr);
    }
  });
}

function buildPortfolio(response) {
  console.log(response);
  var stockTotal = 0;
    response.forEach(function(item) {
    console.log(item)
    currentPortfolio.push(item);
    if (item !== null) {
      var symbol = item.symbol;
      var shares = item.shares;
      var price = 8.4;
      stockTotal += (shares * price); 
      //create each note's <p>
      var p = $("<p>");
      //add note text
      p.html(symbol);
      //append to DOM
      $(".portfolio-output").append(p);
      $(".portfolio-output").append('shares: ' + shares + ' | ');
      $(".portfolio-output").append('symbol: ' + symbol + ' | ');
      $(".portfolio-output").append('current stock quote: $' + price + ' | ');
      $(".portfolio-output").append('current stock value: $' + (shares * price));
      var hr = $("<hr />");
      $(".portfolio-output").append(hr);
    }
  });
      $(".portfolio-output").prepend('Total Stock Holdings: $' + stockTotal);

}

  function showAmount(userAmount) {
    console.log(userAmount)
    $(".portfolio-output").empty();
    var p = $("<p>");
    p.html(userAmount);
    $(".portfolio-output").append(p);
}





    $(".note-input button").on("click", function() {
      //get values for new note
      var note_text = $(".note-input input").val();
      var created = new Date();
      //create new note
      var newTransaction = {
        "time": created,
        "transactionID": 3,
        "action": "Sell",
        "symbol": "MSFT",
        "shares": 43,
        "price": 8,
        "action": "Sell",
        "change": 134.2
        };
      //post new note to server
      $.post("Transactions", newTransaction, function (response) {
        console.log("server post response returned..." + +JSON.stringify(response));
      })
      //get notes
      getTestNotes();
    });



    $("#upAmount").on("click", function() {
      //get values for new note
      var value = $("#updateInput").val();
      var numValue = Number(value);
      var testPortfolio = [{"symbol": "TSLA", "shares": 18}, {"symbol": "AAPL", "shares": 11}];
      var jsonPortfolio = JSON.stringify(testPortfolio);
      //create new note
      var userObject = { 'portfolio':jsonPortfolio, "amount":numValue };
      //post new note to server
      $.post("testUsers", userObject, function (response) {
        console.log("server post response returned..." + +JSON.stringify(response));
        console.log(response);
      })
      //get notes
      getPortfolio();
    });



    function getTransactions() {
      $.getJSON("Transactions.json", function (response) {
        console.log("response = "+JSON.stringify(response));
        console.log(response);
   //     buildTestNotes(response);
          buildTransactions(response);
      });
      }


    function getPortfolio() {
    $.getJSON("Portfolio.json", function (response) {
      console.log("test user response = "+JSON.stringify(response));
      console.log(response);
      var userPortfolio = response[0].portfolio;
      var userAmount = response[0].amount;
   //   showAmount(userAmount);
      console.log(userPortfolio);
      buildPortfolio(userPortfolio);
    });
  }






      //load notes on page load
      getPortfolio();
      getTransactions();

      console.log(currentPortfolio);




};
$(document).ready(loadApp);