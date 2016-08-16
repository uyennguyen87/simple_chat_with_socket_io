var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var timers = require('timers');
var process = require('process');



app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//global_count = 0;
//
//timers.setInterval(() => {
//  var data = {},
//    turn = global_count % 3, 
//    level = turn == 0
//            ? 'NORMAL'
//            : turn == 1 
//              ? 'WARNING'
//              : 'ERROR';
//     
//
//  data.user = 'Server';
//  data.level = level;
//  data.msg = 'This is ' + level.toLowerCase() + ' message.';
//  
//  io.emit('global message', data);
//  global_count++;
//}, 20000);

io.on('connection', socket => {
  //console.log(' a user connected');
  socket.emit('chat message', {'user': 'Server', 'msg': 'welcome to the chat channel'});

  socket.emit('info', {
    ip: socket.handshake.address,
    nickname: socket.handshake.headers['user-agent']
  });

  io.emit('add avai persons', socket.handshake.address);

  socket.on('chat message', (msg) => {
    //console.log('message: ' + msg);
    socket.broadcast.emit('chat message', {'user': socket.handshake.address, 'msg': msg});
  });


  socket.on('disconnect', () => {
    //console.log('user disconnected');
  })
})

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', text => {
  var s = text.split('##');
  io.emit('global message', {
    'user': 'Server',
    'level': s[0],
    'msg': s[1]
  });
})

http.listen(3000, () => {
  console.log('listen on *:3000');
});
