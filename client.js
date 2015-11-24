var socket = io();

$(window).on('beforeunload', function() {
    socket.close();
});

$('form').submit(function() {
    socket.emit('chat message', {
        nickname: $('#nickname').val(),
        msg: $('#m').val()
    });
    $('#m').val('');
    return false;
});

/*socket.on('handshake', function(handshake) {
    console.log(handshake);
});*/

socket.on('chat message', function(data) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    var timestamp = localISOTime.substr(2, 8) + ' ' + localISOTime.substr(11, 8);
    data.nickname = !data.nickname ? 'anonymous' : data.nickname;
    $('#messages').prepend($('<li class="list-group-item">').html('<div class="row"><div class="col-xs-12 col-md-3">[' + timestamp + '] <strong>' + data.nickname + '</strong></div> <div class="col-xs-12 col-md-9 text-success">' + '<strong>' + data.msg + '</strong></div></div>'));
});