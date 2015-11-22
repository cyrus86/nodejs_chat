var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log(socket.conn.id+' '+socket.client.conn.remoteAddress);
    io.emit('chat message', {id: '', nickname: '<strong class="text-warning">system</strong>', msg: 'new user connected with ID: '+socket.conn.id+ ' from IP: '+ socket.client.conn.remoteAddress });
    socket.on('chat message', function(data) {
        console.log(data);
        io.emit('chat message', {id: socket.conn.id, nickname: data.nickname,  msg: data.msg });
        //io.emit('handshake', socket.handshake);
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});