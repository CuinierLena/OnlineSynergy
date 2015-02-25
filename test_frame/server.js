var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('public/views/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var myToDo = "";

io.sockets.on('connection',function(socket) {
    var me=false; //variable globale au contexte io.sockets.on()

    console.log('Nouveau utilisateur');

    //--------------TODO-LIST FUNCTIONS-----------------//
    socket.on('todo-list', function(message){
    console.log('message',message);
    message.user = me; //on va ajouter le nom de l'user au message
    io.sockets.emit('todo-list',message); //on emet un message 'newmsg' à destination des clients
    });

    socket.on('in-list', function(message){
    console.log('message',message);
    message.user = me; //on va ajouter le nom de l'user au message
    io.sockets.emit('in-list',message); //on emet un message 'newmsg' à destination des clients
    });
    
    socket.on('done-list', function(message){
    console.log('message',message);
    message.user = me; //on va ajouter le nom de l'user au message
    io.sockets.emit('done-list',message); //on emet un message 'newmsg' à destination des clients
    });
    //--------------END TODO-LIST FUNCTIONS-----------------//

    //----------------DRAWING FUNCTIONS-----------------//
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
    //--------------END DRAWING FUNCTIONS-----------------//

});