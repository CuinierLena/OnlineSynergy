var http = require('http');

httpServer = http.createServer(function(req,res) {
    console.log('une nouvelle connexion');
    res.end('Bienvenue');
});

httpServer.listen(8080);


var io = require('socket.io').listen(httpServer);

// supprimer un élément dans un tableau
Array.prototype.unset = function(val){
    var index = this.indexOf(val)
    if(index > -1){
        this.splice(index,1)
    }
}


var myToDo = "";
var myIn = "";
var myDone = "";

io.sockets.on('connection',function(socket) {
    var me=false; //variable globale au contexte io.sockets.on()

    console.log('Nouveau utilisateur');
    var data="";
    io.sockets.emit('todo-list',{ message: myToDo});
    io.sockets.emit('in-list',{ message: myIn});
    io.sockets.emit('done-list',{ message: myDone});

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
});