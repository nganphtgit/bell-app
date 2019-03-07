<<<<<<< HEAD
const http = require('http').Server(app);
const io = require('socket.io')(http);
const express= require('express');
=======
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');
const mysql = require('mysql');
const bodyparser = require('body-parser');
const fs = require('fs');
const path = require('path');
let game = 3;
let loggedPlayer = [];
let ablePlayer = [];
let user;
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
>>>>>>> rto

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'rto',
    password: '12345678'
});
app.use(express.static(path.join(__dirname, 'public')));
con.connect((err) => {
    if (!err) {
        console.log('DB connection succeded');
    } else {
        console.log('DB Connection failed: ' + JSON.stringify(err, undefined, 2));
    }
});
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', function(socket){
  console.log(user + ' connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  socket.on('ring bell', function(msg) {
    console.log('message: ' + msg + ' is bell');
    io.emit('ring bell', msg);
  });
  socket.on('count time', function(msg) {
    console.log('message: ' + msg);
    io.emit('count time', msg);
    if (msg == 0) {
      io.emit('stop');
    }
  });
  socket.on('count time wrong', function(msg) {
    console.log('message: ' + msg);
    io.emit('count time wrong', msg);
    if (msg == 0) {
      io.emit('stop');
    }
  });
  socket.on('display question', function(msg) {
    console.log('message: ' + msg);
    io.emit('display question', msg);
  });
  socket.on('Player1 LoggedIn', function(msg) {
    con.query('SELECT * from tbl_users WHERE username = ?', msg, (err, row, fields)=> {
      let name = row[0].fullname;
      console.log(name);
      loggedPlayer.push({player: msg, name: name});
      console.log(loggedPlayer);
      io.emit('Player1 LoggedIn', loggedPlayer);
    });
  });
  socket.on('Player2 LoggedIn', function(msg) {
    con.query('SELECT * from tbl_users WHERE username = ?', msg, (err, row, fields)=> {
      let name = row[0].fullname;
      console.log(name);
      loggedPlayer.push({player: msg, name: name});
      console.log(loggedPlayer);
      io.emit('Player2 LoggedIn', loggedPlayer);
    });
  });
  socket.on('Player3 LoggedIn', function(msg) {
    con.query('SELECT * from tbl_users WHERE username = ?', msg, (err, row, fields)=> {
      let name = row[0].fullname;
      console.log(name);
      loggedPlayer.push({player: msg, name: name});
      console.log(loggedPlayer);
      io.emit('Player3 LoggedIn', loggedPlayer);
    });
  });
  socket.on('Player4 LoggedIn', function(msg) {
    con.query('SELECT * from tbl_users WHERE username = ?', msg, (err, row, fields)=> {
      let name = row[0].fullname;
      console.log(name);
      loggedPlayer.push({player: msg, name: name});
      console.log(loggedPlayer);
      io.emit('Player4 LoggedIn', loggedPlayer);
    });
  });
  socket.on('Player5 LoggedIn', function(msg) {
    con.query('SELECT * from tbl_users WHERE username = ?', msg, (err, row, fields)=> {
      let name = row[0].fullname;
      console.log(name);
      loggedPlayer.push({player: msg, name: name});
      console.log(loggedPlayer);
      io.emit('Player5 LoggedIn', loggedPlayer);
    });
  });
  socket.on('start question', function(msg) {
    ablePlayer = ['player1', 'player2', 'player3', 'player4', 'player5'];
    io.emit('start question', msg);
  });
  socket.on('right answer', function(msg) {
    io.emit('right answer', msg);
  });
  socket.on('Continous', function(msg) {
    console.log(ablePlayer);
    ablePlayer = ablePlayer.filter(function(el) {
      return el !== msg;
    });
    io.emit('Continous', {wrongPlayer: msg, ablePlayer: ablePlayer});
  });
  socket.on('sync info', function(msg) {
    io.emit('sync info', loggedPlayer);
  });
  socket.broadcast.emit('hi');
});
http.listen(8080, function(){
  console.log('listening on *:8080');
});

app.post('/login', (req, res)=> {
  con.query('SELECT * from tbl_users WHERE username = ? and password = ?', [req.body.username, req.body.password], (err, row, fields)=> {
    try {
      user = req.body.username;
      console.log(row[0].role);
      if (row[0].role === 1) {
        res.sendFile(__dirname + '/admin.html');
      } else if (row[0].role === 2) {
        res.sendFile(__dirname + '/viewer.html');
      } else if (row[0].role === 0) {
        let username = req.body.username;
        if (username === 'player1') {
          res.sendFile(__dirname + '/player/player1.html');
        } else if (username === 'player2') {
          res.sendFile(__dirname + '/player/player2.html');
        } else if (username === 'player3') {
          res.sendFile(__dirname + '/player/player3.html');
        } else if (username === 'player4') {
          res.sendFile(__dirname + '/player/player4.html');
        } else if (username === 'player5') {
          res.sendFile(__dirname + '/player/player5.html');
        }
      } 
    } catch(err) {
      console.error(err)
    }
  })
});
let count = 20;
let quesNum = 0;
app.get('/getQuestion/', (req,res)=> {
  con.query('SELECT content from tbl_questions WHERE id = ? and game = ?', [count, game], (err, row, fields) => {
    if (!err) {
      console.log(row[0].content);
      res.json("Câu " + quesNum + ". " + row[0].content);
      count++;
      quesNum++;
    } else {
      console.log(err);

    }
  })
});