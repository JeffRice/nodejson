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
  //process transactions array
  response.forEach(function(item) {
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
      $(".note-output").append('date item created: ' + created + '');
      var hr = $("<hr />");
      $(".note-output").append(hr);
    }
  });
}

function buildPortfolio(response, balance) {
  $(".portfolio-output").empty();
  currentBalance = balance;
  var stockTotal = 0;
    response.forEach(function(item) {
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
      $(".portfolio-output").prepend('<br />Total Stock Holdings: $' + financial(stockTotal));
      $(".portfolio-output").prepend('Account Balance: $' + financial(balance));

}

  function showAmount(userAmount) {
    $(".portfolio-output").empty();
    var p = $("<p>");
    p.html(userAmount);
    $(".portfolio-output").append(p);
}


    $("#sellButton").on("click", function() {
      //get values for new note
      var value = $("#sellInput").val();
      var numValue = Number(value);

      var currentStock = currentPortfolio[currentQuoteIndex];
      var currentShares = currentStock.shares;
      var priceOfTransaction = financial(numValue * currentQuote);


      var sellObject = {'symbol': currentSymbol, 'sellAmount': numValue, 'sellPrice': priceOfTransaction};
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


      return new Promise((resolve, reject) => {
        $.post("sell", sellObject)
            .done(function (response) {
                console.log("server post response returned..." +JSON.stringify(response));
                //create new transaction object
                var created = new Date()
                var newTransaction = {
                  "time": created,
                  "action": "Sell",
                  "symbol": currentSymbol,
                  "shares": numValue,
                  "price": priceOfTransaction
                  }
                //post new transaction to server
                addTransaction(newTransaction)
                resolve(getPortfolio());

            })
           .fail(function () {
                reject(alert(`Failed to sell users transactions`));
            });
      });


 });

 function addTransaction (newTransaction) {
   return new Promise((resolve, reject) => {
     $.post("Transactions", newTransaction)
         .done(function (response) {
             console.log("server post response returned..." +JSON.stringify(response));
             resolve(getTransactions());
         })
        .fail(function () {
             reject(alert(`Failed to fetch users transactions`));
         });
   })
 }

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

   //buy
   // buy();

     return new Promise((resolve, reject) => {
        $.post("buy", buyObject)
           .done(function (response) {
          console.log("server post response returned..." + JSON.stringify(response));
          console.log(response);
                //create new transaction object
                var created = new Date()
                var newTransaction = {
                  "time": created,
                  "action": "Buy",
                  "symbol": currentSymbol,
                  "shares": numValue,
                  "price": priceOfTransaction
                  }
                //post new transaction to server
                addTransaction(newTransaction)
            resolve(getPortfolio());
           })

          .fail(function () {
              reject(alert(`Failed to fetch users portfolio`));
          });

   });


 });


    $("#getQuote").on("click", function() {
      //get values for new note
      var stockSymbol = $("#quoteInput").val()


      getQuote(stockSymbol);



    });



    function getTransactions() {
      return new Promise((resolve, reject) => {
      $.getJSON("Transactions.json")
       .done(function (response) {
        console.log("response = "+JSON.stringify(response));
        //     buildTestNotes(response);
        resolve(buildTransactions(response));

      })
       .fail(function () {
           reject(alert(`Failed to fetch users transactions`));
       });
    });
  }

    function getPortfolio() {
      return new Promise((resolve, reject) => {
        $.getJSON("Portfolio.json")
        .done(function (response) {
                var userPortfolio = response[0].portfolio;
                var userAmount = response[0].amount;
                resolve(buildPortfolio(userPortfolio, userAmount));
        })
        .fail(function () {
            reject(alert(`Failed to fetch users portfolio`));
        });
    });
  }

  function getQuote(stockSymbol) {
    var newQuote = 8.2;
    //check if user has any shares of the stock
    currentQuote = newQuote;
    currentSymbol = stockSymbol;
    //checkSharesOf()
      var existingShares = 0;
      currentPortfolio.forEach((element, index) => { 
        if(stockSymbol === element.symbol){
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


};
$(document).ready(loadApp);