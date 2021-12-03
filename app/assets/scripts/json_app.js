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
    var p = $("<p>");
    p.html(userAmount);
    $(".portfolio-output").append(p);
}







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

    $("#upAmount").on("click", function() {
      //get values for new amount
      var sum = $("#updateInput").val();
      var pointNum = Number(sum)
      //put new amount to server
      $.ajax({
        url: 'userAmount',
        type: 'PUT',
        data: "amount=" + sum,
        success: function(data) {
          console.log(data);
          console.log(sum);
          console.log('put was performed.');
          buildPortfolio(data.newUserAmount);
        }
      });
    });

    $.getJSON("user.json", function (userResponse) {
      console.log("response = "+JSON.stringify(userResponse));
      console.log(userResponse);
      var userAmount = userResponse.amount;
      buildPortfolio(userAmount);
    })


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




};
$(document).ready(loadApp);