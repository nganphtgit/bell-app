$(function() {
  function onKeyDown(event) {
    event.preventDefault();
  }
  $('.btn-player').keydown(function(e) {
    e.preventDefault();
  });
  var socket = io();
  let intervalTime;
  let p1Score = 0,
    p2Score = 0,
    p3Score = 0,
    p4Score = 0,
    p5Score = 0;
  let p1Name = "player1",
    p2Name = "player2",
    p3Name = "player3",
    p4Name = "player4",
    p5Name = "player5";
  let cound1s = new Audio("../assets/sound/tick1s.mp3");
  let ontime = new Audio("../assets/sound/20.mp3");
  let bell = new Audio("../assets/sound/Chance.mp3");
  let wrong = new Audio("../assets/sound/Wrong.mp3");
  let right = new Audio("../assets/sound/Right.mp3");
  let time = 20;
  let bellPlayer;
  $("btn-player").keydown(false);
  $("#btnStart").on("click", function(e) {
    time = 20;
    $(".time").text(time);
    $.ajax({
      url: "/getQuestion",
      type: "GET",
      dataType: "json",
      success: data => {
        socket.emit("display question", data);
      }
    });
    socket.emit("start question", "");
  });
  $("#btnTime").on("click", function(e) {
    ontime = new Audio("../assets/sound/20.mp3");
    ontime.play();
    intervalTime = setInterval(function() {
      socket.emit("count time", time - 1);
      time--;
      if (time === -1) {
        ontime.pause();
      }
    }, 1000);
  });
  $("#btnRight").on("click", function(e) {
    right.play();
    if (bellPlayer === "player1") {
      p1Score = p1Score + 10;
      socket.emit("right answer", { player: bellPlayer, score: p1Score });
    }
    if (bellPlayer === "player2") {
      p2Score = p2Score + 10;
      socket.emit("right answer", { player: bellPlayer, score: p2Score });
    }
    if (bellPlayer === "player3") {
      p3Score = p3Score + 10;
      socket.emit("right answer", { player: bellPlayer, score: p3Score });
    }
    if (bellPlayer === "player4") {
      p4Score = p4Score + 10;
      socket.emit("right answer", { player: bellPlayer, score: p4Score });
    }
    if (bellPlayer === "player5") {
      p5Score = p5Score + 10;
      socket.emit("right answer", { player: bellPlayer, score: p5Score });
    }
  });
  $("#btnWrong").on("click", function(e) {
    wrong.play();
    ontime.play();
    intervalTime = setInterval(function() {
      socket.emit("count time wrong", time - 1);
      time--;
      if (time === -1) {
        ontime.pause();
      }
    }, 1000);
    socket.emit("Continous", bellPlayer);
  });
  $("#btnSync").on("click", function(e) {
    socket.emit("sync info", "");
  });
  $("#btn1").on("click", function(e) {
    e.preventDefault();
    socket.emit("ring bell", "player1");
  });
  $("#btn2").on("click", function(e) {
    e.preventDefault();
    socket.emit("ring bell", "player2");
  });
  $("#btn3").on("click", function(e) {
    e.preventDefault();
    socket.emit("ring bell", "player3");
  });
  $("#btn4").on("click", function(e) {
    e.preventDefault();
    socket.emit("ring bell", "player4");
  });
  $("#btn5").on("click", function(e) {
    e.preventDefault();
    socket.emit("ring bell", "player5");
  });
  socket.on("ring bell", function(msg) {
    ontime.pause();
    clearInterval(intervalTime);
    bellPlayer = msg;
    if (msg === "player1") {
      $("#btn1").removeClass("btn-danger");
      $("#btn1").addClass("btn-success");
      $("#player1-info").removeClass("player-info-waiting");
      $("#player1-info").addClass("player-info-bell");
      $("#player1-info .player-name").removeClass("player-waiting");
      $("#player1-info .player-name").addClass("player-bell");
      bell.play();
      $(".btn-player").addClass("disabled");
      $("#players-occur").text($("#players-occur").text() + "" + p1Name + "; ");
    } else if (msg === "player2") {
      $("#btn2").removeClass("btn-danger");
      $("#btn2").addClass("btn-success");
      $("#player2-info").removeClass("player-info-waiting");
      $("#player2-info").addClass("player-info-bell");
      $("#player2-info .player-name").removeClass("player-waiting");
      $("#player2-info .player-name").addClass("player-bell");
      bell.play();
      $(".btn-player").addClass("disabled");
      $("#players-occur").text($("#players-occur").text() + "" + p2Name + ";");
    } else if (msg === "player3") {
      $("#btn3").removeClass("btn-danger");
      $("#btn3").addClass("btn-success");
      $("#player3-info").removeClass("player-info-waiting");
      $("#player3-info").addClass("player-info-bell");
      $("#player3-info .player-name").removeClass("player-waiting");
      $("#player3-info .player-name").addClass("player-bell");
      bell.play();
      $(".btn-player").addClass("disabled");
      $("#players-occur").text($("#players-occur").text() + "" + p3Name + ";");
    } else if (msg === "player4") {
      $("#btn4").removeClass("btn-danger");
      $("#btn4").addClass("btn-success");
      $("#player4-info").removeClass("player-info-waiting");
      $("#player4-info").addClass("player-info-bell");
      $("#player4-info .player-name").removeClass("player-waiting");
      $("#player4-info .player-name").addClass("player-bell");
      bell.play();
      $(".btn-player").addClass("disabled");
      $("#players-occur").text($("#players-occur").text() + "" + p4Name + ";");
    } else if (msg === "player5") {
      $("#btn5").removeClass("btn-danger");
      $("#btn5").addClass("btn-success");
      $("#player5-info").removeClass("player-info-waiting");
      $("#player5-info").addClass("player-info-bell");
      $("#player5-info .player-name").removeClass("player-waiting");
      $("#player5-info .player-name").addClass("player-bell");
      bell.play();
      $(".btn-player").addClass("disabled");
      $("#players-occur").text($("#players-occur").text() + "" + p5Name + ";");
    }
  });
  socket.on("count time", function(msg) {
    $(".btn-player").removeClass("disabled");
    $(".time").text(msg);
    if (msg <= 0) {
      $(".btn-player").addClass("disabled");
    }
  });
  socket.on("count time wrong", function(msg) {
    $(".time").text(msg);
    if (msg <= 0) {
      $(".btn-player").addClass("disabled");
    }
  });
  socket.on("display question", function(msg) {
    $(".question").text(msg);
  });
  socket.on("stop", function(msg) {
    clearInterval(intervalTime);
  });
  socket.on("sync info", function(msg) {
    msg.forEach(function(el) {
      if (el.player === "player1") {
        $("#player1-name").text(el.name);
        $("#btn1").addClass("disabled");
        p1Name = el.name;
      }
      if (el.player === "player2") {
        $("#player2-name").text(el.name);
        $("#btn2").addClass("disabled");
        p2Name = el.name;
      }
      if (el.player === "player3") {
        $("#player3-name").text(el.name);
        $("#btn3").addClass("disabled");
        p3Name = el.name;
      }
      if (el.player === "player4") {
        $("#player4-name").text(el.name);
        $("#btn4").addClass("disabled");
        p4Name = el.name;
      }
      if (el.player === "player5") {
        $("#player5-name").text(el.name);
        $("#btn5").addClass("disabled");
        p5Name = el.name;
      }
    });
  });
  socket.on("Player1 LoggedIn", function(msg) {
    msg.forEach(function(el) {
      if (el.player === "player1") {
        $("#player1-name").text(el.name);
        $("#btn1").addClass("disabled");
      }
      if (el.player === "player2") {
        $("#player2-name").text(el.name);
        $("#btn2").addClass("disabled");
      }
      if (el.player === "player3") {
        $("#player3-name").text(el.name);
        $("#btn3").addClass("disabled");
      }
      if (el.player === "player4") {
        $("#player4-name").text(el.name);
        $("#btn4").addClass("disabled");
      }
      if (el.player === "player5") {
        $("#player5-name").text(el.name);
        $("#btn5").addClass("disabled");
      }
    });
  });
  socket.on("Player2 LoggedIn", function(msg) {
    msg.forEach(function(el) {
      if (el.player === "player1") {
        $("#player1-name").text(el.name);
        $("#btn1").addClass("disabled");
      }
      if (el.player === "player2") {
        $("#player2-name").text(el.name);
        $("#btn2").addClass("disabled");
      }
      if (el.player === "player3") {
        $("#player3-name").text(el.name);
        $("#btn3").addClass("disabled");
      }
      if (el.player === "player4") {
        $("#player4-name").text(el.name);
        $("#btn4").addClass("disabled");
      }
      if (el.player === "player5") {
        $("#player5-name").text(el.name);
        $("#btn5").addClass("disabled");
      }
    });
  });
  socket.on("Player3 LoggedIn", function(msg) {
    msg.forEach(function(el) {
      if (el.player === "player1") {
        $("#player1-name").text(el.name);
        $("#btn1").addClass("disabled");
      }
      if (el.player === "player2") {
        $("#player2-name").text(el.name);
        $("#btn2").addClass("disabled");
      }
      if (el.player === "player3") {
        $("#player3-name").text(el.name);
        $("#btn3").addClass("disabled");
      }
      if (el.player === "player4") {
        $("#player4-name").text(el.name);
        $("#btn4").addClass("disabled");
      }
      if (el.player === "player5") {
        $("#player5-name").text(el.name);
        $("#btn5").addClass("disabled");
      }
    });
  });
  socket.on("Player4 LoggedIn", function(msg) {
    msg.forEach(function(el) {
      if (el.player === "player1") {
        $("#player1-name").text(el.name);
        $("#btn1").addClass("disabled");
      }
      if (el.player === "player2") {
        $("#player2-name").text(el.name);
        $("#btn2").addClass("disabled");
      }
      if (el.player === "player3") {
        $("#player3-name").text(el.name);
        $("#btn3").addClass("disabled");
      }
      if (el.player === "player4") {
        $("#player4-name").text(el.name);
        $("#btn4").addClass("disabled");
      }
      if (el.player === "player5") {
        $("#player5-name").text(el.name);
        $("#btn5").addClass("disabled");
      }
    });
  });
  socket.on("Player5 LoggedIn", function(msg) {
    msg.forEach(function(el) {
      if (el.player === "player1") {
        $("#player1-name").text(el.name);
        $("#btn1").addClass("disabled");
      }
      if (el.player === "player2") {
        $("#player2-name").text(el.name);
        $("#btn2").addClass("disabled");
      }
      if (el.player === "player3") {
        $("#player3-name").text(el.name);
        $("#btn3").addClass("disabled");
      }
      if (el.player === "player4") {
        $("#player4-name").text(el.name);
        $("#btn4").addClass("disabled");
      }
      if (el.player === "player5") {
        $("#player5-name").text(el.name);
        $("#btn5").addClass("disabled");
      }
    });
  });
  socket.on("start question", function(msg) {
    $(".time").text(time);
    $(".btn-player").removeClass("btn-success");
    $(".btn-player").addClass("btn-danger");
    $(".player-name").addClass("player-waiting");
    $(".player-name").removeClass("player-bell");
    $(".player-name").removeClass("player-wrong");
    $(".player-info").addClass("player-info-waiting");
    $(".player-info").removeClass("player-info-bell");
    $(".player-info").removeClass("player-info-wrong");
    $("#players-occur").text("");
  });
  socket.on("right answer", function(msg) {
    if (msg.player === "player1") {
      $("#player1-score").text(msg.score);
    } else if (msg.player === "player2") {
      $("#player2-score").text(msg.score);
    } else if (msg.player === "player3") {
      $("#player3-score").text(msg.score);
    } else if (msg.player === "player4") {
      $("#player4-score").text(msg.score);
    } else if (msg.player === "player5") {
      $("#player5-score").text(msg.score);
    }
  });
  socket.on("Continous", function(msg) {
    let wrongPlayer = msg.wrongPlayer;
    if (wrongPlayer === "player1") {
      $("#player1-info").removeClass("player-info-bell");
      $("#player1-info").addClass("player-info-wrong");
      $("#player1-info .player-name").removeClass("player-bell");
      $("#player1-info .player-name").addClass("player-wrong");
    } else if (wrongPlayer === "player2") {
      $("#player2-info").removeClass("player-info-bell");
      $("#player2-info").addClass("player-info-wrong");
      $("#player2-info .player-name").removeClass("player-bell");
      $("#player2-info .player-name").addClass("player-wrong");
    } else if (wrongPlayer === "player3") {
      $("#player3-info").removeClass("player-info-bell");
      $("#player3-info").addClass("player-info-wrong");
      $("#player3-info .player-name").removeClass("player-bell");
      $("#player3-info .player-name").addClass("player-wrong");
    } else if (wrongPlayer === "player4") {
      $("#player4-info").removeClass("player-info-bell");
      $("#player4-info").addClass("player-info-wrong");
      $("#player4-info .player-name").removeClass("player-bell");
      $("#player4-info .player-name").addClass("player-wrong");
    } else if (wrongPlayer === "player5") {
      $("#player5-info").removeClass("player-info-bell");
      $("#player5-info").addClass("player-info-wrong");
      $("#player5-info .player-name").removeClass("player-bell");
      $("#player5-info .player-name").addClass("player-wrong");
    }
    msg.ablePlayer.forEach(function(el) {
      if (el === "player1") {
        $("#btn1").removeClass("disabled");
      } else if (el === "player2") {
        $("#btn2").removeClass("disabled");
      } else if (el === "player3") {
        $("#btn3").removeClass("disabled");
      } else if (el === "player4") {
        $("#btn4").removeClass("disabled");
      } else if (el === "player5") {
        $("#btn5").removeClass("disabled");
      }
    });
    if (msg.ablePlayer.length === 0) {
      ontime.pause();
      clearInterval(intervalTime);
    }
  });
});
