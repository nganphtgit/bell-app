const http = require('http').Server(app);
const io = require('socket.io')(http);
const express= require('express');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg) {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
  socket.on('ring bell', function(msg) {
    console.log('message: ' + msg);
    io.emit('ring bell', msg);
  });
  socket.on('count time', function(msg) {
    console.log('message: ' + msg);
    io.emit('count time', msg);
    if (msg == 0) {
      io.emit('stop');
    }
  });
  socket.broadcast.emit('hi');
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});