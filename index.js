var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log(socket.conn.id);
    //console.log(socket.client.conn);
    console.log(socket.conn);
    io.emit('chat message', 'new user with ID: '+socket.conn.id+ ' | IP: '+ socket.client.conn.remoteAddress)
    socket.on('chat message', function(msg) {
        io.emit('chat message', ""+socket.conn.id+": "+msg);
        io.emit('handshake', socket.handshake);
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});