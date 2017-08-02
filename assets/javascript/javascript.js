$(document).ready(function() {

  var rps = ["r", "p", "s"]
  var numAvatars = 6;

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
    console.log($("#char-name").val().trim());
    if($("#char-name").val().trim() != "") {
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
  
  $("#submit-chat").on("click", function() {
    event.preventDefault();
    var chatText = $("#chat-text").val().trim();
    if(chatText != "") {
      var newDiv = $("<div>");
      newDiv.text("Me: " + chatText);
      $("#chat-area").append(newDiv);
      $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);
      $("#chat-text").val("");
    }
  })


});