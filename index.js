var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis');
var client = redis.createClient();

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var ChatMessage = function(id, nickname, msg) {
    self = this;
    self.timestamp = getChatTimestamp();
    self.id = id;
    self.nickname = nickname;
    self.msg = msg;
}
var ServerMessage = function(msg) {
    self = this;
    self.timestamp = getChatTimestamp();
    self.msg = msg;
}

function getChatTimestamp() {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    return localISOTime.substr(2, 8) + ' ' + localISOTime.substr(11, 8);
}
io.on('connection', function(socket) {
    console.log(socket.conn.id + ' ' + socket.client.conn.remoteAddress);
    client.lrange("chatMessages", 0, -1, function(err, msgs) {
        // improved native for-loop works perfect with chronological chat history.
        for (var i = msgs.length - 1; i >= 0; i--) {
            msg = JSON.parse(msgs[i]);
            io.emit('chat message', msg);
        }
        connectionMessage = new ServerMessage('new user connected with ID: ' + socket.conn.id + ' from IP: ' + socket.client.conn.remoteAddress);
        io.emit('server message', connectionMessage);
    });

    socket.on('chat message', function(data) {
        chatMessage = new ChatMessage(socket.conn.id, data.nickname, data.msg);
        console.log(chatMessage);
        jsonChatMessage = JSON.stringify(chatMessage);
        client.lpush('chatMessages', jsonChatMessage);
        io.emit('chat message', chatMessage);
    });
});
http.listen(3000, function() {
    console.log('listening on *:3000');
});