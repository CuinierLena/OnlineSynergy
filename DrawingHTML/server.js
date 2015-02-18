var express = require('express');
var app = express();


var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('public/views/drawing.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('draw', function(x,y){
        console.log("coord: " + "["+x+","+y+"]");
        socket.broadcast.emit("draw", x, y);
    });
    socket.on('draw', function(x,y,_color){
        console.log("coord: " + "["+x+","+y+"]");
        socket.broadcast.emit("draw", x, y, _color);
    });
    socket.on('beginDraw', function(x,y){
        //console.log("begin: ["+x+","+y+"]");
        socket.broadcast.emit("beginDraw", x, y);
        /*ctx.beginPath();
        ctx.moveTo(x,y);
        paint = true;*/
    });
    socket.on('endDraw', function(){
        //console.log("endDraw");
        socket.broadcast.emit("endDraw");
        /*paint = false;
        ctx.closePath();*/
    });
    socket.on('clearDraw', function(){
        //console.log("endDraw");
        socket.broadcast.emit("clearDraw");
        /*paint = false;
        ctx.closePath();*/
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});