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

    console.log('Nouveau utilisateur');

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
    socket.on('newuser', function(){
        socket.broadcast.emit("newuser", nbUserDrawing);
        socket.emit("setID", nbUserDrawing);
        nbUserDrawing ++;
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
    
    //-------------------Web RTC ----------------------//
	function log(){
		var array = [">>> Message from server: "];
	  for (var i = 0; i < arguments.length; i++) {
	  	array.push(arguments[i]);
	  }
	    socket.emit('log', array);
	}
	socket.on('message', function (message) {
		log('Got message: ', message);
    // For a real app, should be room only (not broadcast)
		socket.broadcast.emit('message', message);
	});
	socket.on('create or join', function (room) {
		//var numClients = io.sockets.clients(room).length;
        var numClients = roomCount(io.sockets.adapter.rooms[room]);
        
		log('Room ' + room + ' has ' + numClients + ' client(s)');
		log('Request to create or join room', room);

		if (numClients == 0){
			socket.join(room);
			socket.emit('created', room);
		} else if (numClients == 1) {
			io.sockets.in(room).emit('join', room);
			socket.join(room);
			socket.emit('joined', room);
		} else { // max two clients
			socket.emit('full', room);
		}
		socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
		socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);

	});
    function roomCount(room){
        localCount = 0;
        if (room) {
            for (var id in room) {
                localCount ++;
            }
        }
        return localCount;
    }
    //---------------Fin Web RTC ----------------------//

});