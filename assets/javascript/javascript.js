var config = {
  apiKey: "AIzaSyD-d2LwLO29_1nU4Gc464BFEdlRqt4JLP0",
  authDomain: "medaman-e56d2.firebaseapp.com",
  databaseURL: "https://medaman-e56d2.firebaseio.com",
  projectId: "medaman-e56d2",
  storageBucket: "medaman-e56d2.appspot.com",
  messagingSenderId: "510235193408"
};

firebase.initializeApp(config);

$(document).ready(function() {

  var rps = ["r", "p", "s"]
  var numAvatars = 6;
  var charName;

  var initialLatestChat = [];
  var latestChat = initialLatestChat;
    
  var database = firebase.database();
  database.ref().set({
    latestChat: latestChat
  });


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
      placeAvatar($(this).attr("value"), "my");
    } else {
      $("#start-comment").html("<h1>Please enter name</h1>")
    }
  });

  function placeAvatar(number, area) {
    var newImg = $("<img>");
    newImg.attr("src", "assets/images/avatar" + number + ".jpg");
    $("#" + area + "-avatar").html(newImg);
    $("#" + area + "-name").text($("#char-name").val().trim());
  }

  database.ref().on("value", function(snapshot) {
    latestChat = snapshot.val().latestChat;
    if (latestChat[0] != charName && latestChat[0]!="firebase-loading-text-value-changer") {
      var newDiv = $("<div>");
      newDiv.text(latestChat[0] + ": " + latestChat[1]);
      $("#chat-area").append(newDiv);
      $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);
    }
  }, function(errorObject) {
    console.log(errorObject);
  });

  $("#submit-chat").on("click", function() {
    event.preventDefault();
    var chatText = $("#chat-text").val().trim();
    if(chatText != "") {
      var newDiv = $("<div>");
      newDiv.text("Me: " + chatText);
      $("#chat-area").append(newDiv);
      $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);
      $("#chat-text").val("");
      //this "firebase-loading" thing needs to be done in case the user types the same thing twice or more. If they type the same thing twice or more, the database value was not changing, so the text does not appear more than once. I had to put in this extra code, so everytime anything is added to chat, the value changes for sure. This will break if a user's name is "firebase-loading". That is why i tried to make it as complicated as possible.
      database.ref().set({
        latestChat: ["firebase-loading-text-value-changer"]
      });
      database.ref().set({
        latestChat: [charName, chatText]
      });
    }
  })

});