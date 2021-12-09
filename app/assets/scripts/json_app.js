//load main app logic
function loadApp() {
  "use strict";
  var currentPortfolio = [];
  var currentBalance = 0;
  var currentQuote = 0;
  var currentSymbol = '';
  var currentQuoteIndex = "";

function financial(x) {
  return Number.parseFloat(x).toFixed(2);
}

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

function buildPortfolio(response, balance) {
  $(".portfolio-output").empty();
  console.log(response);
  console.log('balance = ' + balance);
  currentBalance = balance;
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
      $(".portfolio-output").append('current stock value: $' + financial(shares * price));
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


    $("#sellButton").on("click", function() {
      //get values for new note
      var value = $("#sellInput").val();
      var numValue = Number(value);

      var currentStock = currentPortfolio[currentQuoteIndex];
      var currentShares = currentStock.shares;
      var priceOfTransaction = financial(numValue * currentQuote);

      var sellObject = {'symbol': currentStock.symbol, 'sellAmount': numValue, 'sellPrice': priceOfTransaction};
      console.log(currentStock.shares, currentStock.symbol)
      //if conditions for sale  are met
      if (numValue <= currentShares){
        console.log("ok to sell")
      }
      else {
        console.log("cant sell")
      }
      
      
      
      
      
      //sell
      sell();

      $.post("sell", sellObject, function (response) {
        console.log("server post response returned..." + +JSON.stringify(response));
        console.log(response);
      })
      //get portfolio
      getPortfolio();
    });

        $("#buyButton").on("click", function() {
          //get values for new note
          var value = $("#buyInput").val();
          var numValue = Number(value);

          var currentStock = currentPortfolio[currentQuoteIndex];
          var balance = currentBalance;

          var priceOfTransaction = financial(numValue * currentQuote);
          console.log(priceOfTransaction)
          var buyObject = {'symbol': currentSymbol, 'buyAmount': numValue, 'buyPrice': priceOfTransaction};

          //if conditions for sale  are met
          if (balance > priceOfTransaction){
            console.log("ok to buy")
            console.log(buyObject)
          }
          else {
            console.log("cant buy")
          }





          //sell
          buy();

          $.post("buy", buyObject, function (response) {
            console.log("server post response returned..." + +JSON.stringify(response));
            console.log(response);
          })
          //get notes
          getPortfolio();
        });


    $("#getQuote").on("click", function() {
      //get values for new note
      var stockSymbol = $("#quoteInput").val()


      getQuote(stockSymbol);



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
      buildPortfolio(userPortfolio, userAmount);
    });
  }

  function getQuote(stockSymbol) {
    var newQuote = 8.2;
    console.log(stockSymbol, newQuote);

    console.log(currentPortfolio);
    //check if user has any shares of the stock
    currentQuote = newQuote;
    currentSymbol = stockSymbol;
    //checkSharesOf()
      var existingShares = 0;
      currentPortfolio.forEach((element, index) => { 
        if(stockSymbol === element.symbol){
          console.log("Match!")
          console.log("Match at index: " + index)
          existingShares = element.shares;
          //updating for user Portfolio object
          currentQuoteIndex = index;
          //enable sell
          enableSell(element);
        }
        else {
          console.log("No Match!")
        }
       } )
       //no shares were found
    if (existingShares === 0){
          disableSell(stockSymbol);
        }

    }



    function enableSell(portfolioItem) {
      $("#existingShares").empty();
      $("#existingShares").append("Current price quote for " + portfolioItem.symbol  + " Stock: $" + 8.2 );

      //add this regardless of enable or disable
      $("#existingShares").append("<br />You currently own: " + portfolioItem.shares  + " of " + portfolioItem.symbol );
    }

    function disableSell(stockSymbol) {
      $("#existingShares").empty();
      $("#existingShares").append("Currently own no shares of " + stockSymbol);
  
       }

    function buy() {}

    function sell() {}





      //load notes on page load
      getPortfolio();
      getTransactions();

      console.log(currentPortfolio);




};
$(document).ready(loadApp);