var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log(socket.conn.id);
    //console.log(socket.client.conn);
    //console.log(socket.conn);
    io.emit('chat message', {id: '', msg: 'new user connected with ID: '+socket.conn.id+ '</strong> from IP: '+ socket.client.conn.remoteAddress });
    socket.on('chat message', function(msg) {
        io.emit('chat message', {id: socket.conn.id, msg: msg });
        //io.emit('handshake', socket.conn);
        //io.emit('handshake', socket.handshake);
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});