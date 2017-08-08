var config = {
  apiKey: "AIzaSyCU1DcyCq1p8CHutmQ1Ao-f6izMQFoL9hI",
  authDomain: "rock-paper-scissors-fc667.firebaseapp.com",
  databaseURL: "https://rock-paper-scissors-fc667.firebaseio.com",
  projectId: "rock-paper-scissors-fc667",
  storageBucket: "",
  messagingSenderId: "102340478271"
};

firebase.initializeApp(config);

$(document).ready(function() {

  var numAvatars = 6;
  var charName;
  var myAvatar;

  var latestChat = [];
  var secondPlayerSat = false;
  var numGames = 0;
  var roomNumber = 0;

  var database = firebase.database();

  for(var i=1; i<=numAvatars; i++) {
    var newDiv = $("<div>");
    newDiv.addClass("col-xs-2")
    var newImg = $("<img>");
    newImg.addClass("avatar");
    newImg.attr("value", i);
    newImg.attr("src", "assets/images/avatar" + i + ".jpg");
    newDiv.html(newImg);
    $("#avatar-options").append(newDiv);
  }

  $(document).on("click", ".avatar", function() {
    charName = $("#char-name").val().trim();
    if(charName != "") {
      $("#start-screen").css("visibility", "hidden");
      myAvatar = $(this).attr("value")
    } else {
      $("#start-comment").html("<h1>Please enter name</h1>")
    }
  });

  function placeAvatar(avatarNumber, area) {
    var newImg = $("<img>");
    newImg.attr("src", "assets/images/avatar" + avatarNumber + ".jpg");
    $("#" + area + "-avatar").html(newImg);
    $("#" + area + "-name").text($("#char-name").val().trim());
  }

  function chatUpdater() {
    database.ref("room"+roomNumber).on("value", function(snapshot) {
        latestChat = snapshot.val().latestChat;
        if (latestChat[0]!="firebase-loading-text-value-changer" && latestChat[0] != "") {
          var newDiv = $("<div>");
          newDiv.text(latestChat[0] + ": " + latestChat[1]);
          $("#chat-area").append(newDiv);
          $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);
        }
    }, function(errorObject) {
      console.log(errorObject);
    });
  }

  $("#submit-chat").on("click", function() {
    event.preventDefault();
    var chatText = $("#chat-text").val().trim();
    if(chatText != "") {
      database.ref("room"+roomNumber).set({
        latestChat: ["firebase-loading-text-value-changer"]
      });
      database.ref("room"+roomNumber).set({
        myRoomNumber: roomNumber,
        latestChat: [charName, chatText]
      });
    }
    $("#chat-text").val("");
  });

  $("#rooms").empty();
  for(var i=1; i<=9; i++) {
    var newDiv = $("<div>");
    var joinChat = createButton("Join");
    newDiv.html("Room number: " + i);
    newDiv.append(joinChat);
    $("#rooms").append(newDiv);
  }

  function createButton(join) {
    var newButton = $("<button>");
    newButton.addClass("btn btn-default room-buttons");
    newButton.attr("value", i);
    newButton.text("Join Room");
    return newButton;
  }

  function disconnectPlayer() {
    database.ref("game"+roomNumber).onDisconnect().set({
      Player1: ""
    });
  }

  $(document).on("click", ".room-buttons", function() {
    $("#room-selection").css("visibility", "hidden");
    roomNumber = $(this).attr("value");
    database.ref("room" + roomNumber).set({ 
      latestChat: ["",""]
    });
    chatUpdater();
    disconnectPlayer();
  });

});