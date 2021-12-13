//load main app logic
function loadApp() {
  "use strict";
  let currentPortfolio = [];
  let currentBalance = 0;
  let currentQuote = 0;
  let currentSymbol = '';
  let currentQuoteIndex = '';

function financial(x) {
  return Number.parseFloat(x).toFixed(2);
}

function buildTransactions(response) {
  //get travelNotes
  $(".note-output").empty();
  //process transactions array
  response.forEach(function(item) {
    if (item !== null) {
      let symbol = item.symbol;
      let created = item.time;
      let shares = item.shares;
      let price = item.price;
      let action = item.action;
      let change = item.change;
      //create each note's <p>
      const p = $("<p>");
      //add note text
      p.html(symbol);
      //append to DOM
      $(".note-output").append(p);
      $(".note-output").append('shares: ' + shares + '|');
      $(".note-output").append('price: ' + price + '|');
      $(".note-output").append('action: ' + action + '|');
      $(".note-output").append('date item created: ' + created + '');
      const hr = $("<hr />");
      $(".note-output").append(hr);
    }
  });
}

function buildPortfolio(response, balance) {
  $(".portfolio-output").empty();
  currentBalance = balance;
  let stockTotal = 0;
    response.forEach(function(item) {
    currentPortfolio.push(item);
    if (item !== null) {
      let symbol = item.symbol;
      let shares = item.shares;
      let price = 8.4;
      stockTotal += (shares * price); 
      //create each note's <p>
      const p = $("<p>");
      //add note text
      p.html(symbol);
      //append to DOM
      $(".portfolio-output").append(p);
      $(".portfolio-output").append('shares: ' + shares + ' | ');
      $(".portfolio-output").append('symbol: ' + symbol + ' | ');
      $(".portfolio-output").append('current stock quote: $' + price + ' | ');
      $(".portfolio-output").append('current stock value: $' + financial(shares * price));
      const hr = $("<hr />");
      $(".portfolio-output").append(hr);
    }
  });
      $(".portfolio-output").prepend('<br />Total Stock Holdings: $' + financial(stockTotal));
      $(".portfolio-output").prepend('Account Balance: $' + financial(balance));

}

  function showAmount(userAmount) {
    $(".portfolio-output").empty();
    const p = $("<p>");
    p.html(userAmount);
    $(".portfolio-output").append(p);
}


    $("#sellButton").on("click", function() {
      //get values for new note
      let value = $("#sellInput").val();
      let numValue = Number(value);

      let currentStock = currentPortfolio[currentQuoteIndex];
      let currentShares = currentStock.shares;
      let priceOfTransaction = financial(numValue * currentQuote);


      let sellObject = {'symbol': currentSymbol, 'sellAmount': numValue, 'sellPrice': priceOfTransaction};
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

      //create new transaction object
      let created = new Date()
      let newTransaction = {
        "time": created,
        "action": "Sell",
        "symbol": currentSymbol,
        "shares": numValue,
        "price": priceOfTransaction
        }
      return new Promise((resolve, reject) => {
        $.post("sell", sellObject)
            .done(function (response) {
                console.log("server post response returned..." +JSON.stringify(response));
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
   let value = $("#buyInput").val();
   let numValue = Number(value);

   let currentStock = currentPortfolio[currentQuoteIndex];
   let balance = currentBalance;

   let priceOfTransaction = financial(numValue * currentQuote);
   console.log(priceOfTransaction)
   let buyObject = {'symbol': currentSymbol, 'buyAmount': numValue, 'buyPrice': priceOfTransaction};

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

    //create new transaction object
    let created = new Date()
    let newTransaction = {
      "time": created,
      "action": "Buy",
      "symbol": currentSymbol,
      "shares": numValue,
      "price": priceOfTransaction
      }

     return new Promise((resolve, reject) => {
        $.post("buy", buyObject)
           .done(function (response) {
          console.log("server post response returned..." + JSON.stringify(response));
          console.log(response);

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
      let stockSymbol = $("#quoteInput").val()
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
                let userPortfolio = response[0].portfolio;
                let userAmount = response[0].amount;
                resolve(buildPortfolio(userPortfolio, userAmount));
        })
        .fail(function () {
            reject(alert(`Failed to fetch users portfolio`));
        });
    });
  }

  function getQuote(stockSymbol) {
    const newQuote = 8.2;
    //check if user has any shares of the stock
    currentQuote = newQuote;
    currentSymbol = stockSymbol;
    //checkSharesOf()
      let existingShares = 0;
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