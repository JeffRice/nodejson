//load main app logic
function loadApp() {
  "use strict";


function buildTestNotes(response) {
  //get travelNotes
  $(".note-output").empty();
  console.log(response);
  var $travelNotes = response;
  //process travelNotes array
  $travelNotes.forEach(function(item) {
    console.log(item)
    if (item !== null) {
      var note = item.note;
      var created = item.created;
      //create each note's <p>
      var p = $("<p>");
      //add note text
      p.html(note);
      //append to DOM
      $(".note-output").append(p);
      $(".note-output").append('date item created: ' + created);
      var hr = $("<hr />");
      $(".note-output").append(hr);
    }
  });
}

  function buildPortfolio(userAmount) {
    console.log(userAmount)
    $(".portfolio-output").empty();
    var p = $("<p>");
    p.html(userAmount);
    $(".portfolio-output").append(p);
}





/*

    $(".note-input button").on("click", function() {
      //get values for new note
      var note_text = $(".note-input input").val();
      var created = new Date();
      //create new note
      var newNote = {"created":created, "note":note_text};
      //post new note to server
      $.post("testNotes", newNote, function (response) {
        console.log("server post response returned..." + +JSON.stringify(response));
      })
      //get notes
      getTestNotes();
    });
    */

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
      getTestUsers();
    });


    function getTestUsers() {
    $.getJSON("testUsers.json", function (userResponse) {
      console.log("test user response = "+JSON.stringify(userResponse));
      console.log(userResponse);
      var userAmount = userResponse[0].amount;
      buildPortfolio(userAmount);
    });
  }


      function getTestNotes() {
        $.getJSON("testNotes.json", function (response) {
          console.log("response = "+JSON.stringify(response));
          console.log(response);
          console.log(response.travelNotes);
          buildTestNotes(response);
        });
        }



      //load notes on page load
      getTestNotes();
      getTestUsers();




};
$(document).ready(loadApp);