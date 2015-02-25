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

// listes acuelle pour les nouveaux utilisateurs
var myToDo = "";
var myIn = "";
var myDone = "";

var nbUserDrawing = 0;

io.sockets.on('connection',function(socket) {
    var me=false; //variable globale au contexte io.sockets.on()

    //------------TODO-LIST initialisation--------------//
    io.sockets.emit('todo-list',{ message: myToDo});
    io.sockets.emit('in-list',{ message: myIn});
    io.sockets.emit('done-list',{ message: myDone});
    //--------------TODO-LIST FUNCTIONS-----------------//
    socket.on('todo-list', function(message){
    console.log('message',message);
    myToDo=message.message;
    message.user = me; //on va ajouter le nom de l'user au message
    io.sockets.emit('todo-list',message); //on emet un message 'newmsg' à destination des clients
    });

    socket.on('in-list', function(message){
    console.log('message',message);
    myIn=message.message;
    message.user = me; //on va ajouter le nom de l'user au message
    io.sockets.emit('in-list',message); //on emet un message 'newmsg' à destination des clients
    });
    
    socket.on('done-list', function(message){
    console.log('message',message);
    myDone=message.message;
    message.user = me; //on va ajouter le nom de l'user au message
    io.sockets.emit('done-list',message); //on emet un message 'newmsg' à destination des clients
    });
    //--------------END TODO-LIST FUNCTIONS-----------------//

    //----------------DRAWING FUNCTIONS-----------------//
	socket.on('newuser', function(){
        socket.broadcast.emit("newuser", nbUserDrawing);
        socket.emit("setID", nbUserDrawing);
        nbUserDrawing ++;
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('draw', function(x,y){
        //console.log("coord: " + "["+x+","+y+"]");
        socket.broadcast.emit("draw", x, y);
    });
    socket.on('draw', function(x,y,_color){
        //console.log("coord: " + "["+x+","+y+"]");
        socket.broadcast.emit("draw", x, y, _color);
    });
    socket.on('beginDraw', function(x,y){
        //console.log("begin: ["+x+","+y+"]");
        socket.broadcast.emit("beginDraw", x, y);
    });
    socket.on('endDraw', function(){
        //console.log("endDraw");
        socket.broadcast.emit("endDraw");
    });
    socket.on('clearDraw', function(){
        socket.broadcast.emit("clearDraw");
    });

    socket.on('draw', function(x,y,_color, userID){
        socket.broadcast.emit("draw", x, y, _color, userID);
    });
    socket.on('beginDraw', function(x,y, userID){
        socket.broadcast.emit("beginDraw", x, y, userID);
    });
    socket.on('endDraw', function(userID){
        socket.broadcast.emit("endDraw", userID);
    });
    //--------------END DRAWING FUNCTIONS-----------------//

});