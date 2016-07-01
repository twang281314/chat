/**
 * created by anytao
 * 2016-07-01 10:23
 */
var express = require('express'); //引入express模块
var ioServer = require('socket.io'); //引入socket.io模块
var app = express();
var server = require('http').Server(app);
var io = new ioServer(server);
var users=[];

app.use('/static', express.static('www'));//静态资源

server.listen(8088, function() {
    console.log('server is start at port 8088');
});

app.get('/', function(req, res) {
     res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
    //new user login
    socket.on('login', function(nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');
        };
    });
    //user leaves
    socket.on('disconnect', function() {
        users.splice(socket.userIndex, 1);
        socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
    });
    //new message get
    socket.on('postMsg', function(msg, color) {
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });
    //new image get
    socket.on('img', function(imgData, color) {
        socket.broadcast.emit('newImg', socket.nickname, imgData, color);
    });
});