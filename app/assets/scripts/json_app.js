//load main app logic
function loadApp() {
  "use strict";

  function buildNote(response) {
      //get travelNotes
      var $travelNotes = response.travelNotes
      //process travelNotes array
      $travelNotes.forEach(function(item) {
        if (item !== null) {
          var note = item.note;
          //create each note's <p>
          var p = $("<p>");
          //add note text
          p.html(note);
          //append to DOM
          $(".note-output").append(p);
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
      $.post("notes", newNote, function (response) {
        console.log("server post response returned..." + JSON.stringify(response));
        console.log(newNote);
      })
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

    $.getJSON("notes.json", function (response) {
      console.log("response = "+JSON.stringify(response));
      console.log(response);
      console.log(response.travelNotes);
      buildNote(response);
    })

};
$(document).ready(loadApp);
