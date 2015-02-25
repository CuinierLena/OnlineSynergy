    //var socket = io.connect('http://localhost:3000');
    var socket = io();
    function addTache()
    {
        var newline = document.createElement("LI")
        var list = document.getElementById("todo-list")

        var mytext = document.getElementById("todo-form-add").value.concat(" ")
        if(mytext != " ")
        {
            newline.appendChild(document.createTextNode(mytext))
            newline.setAttribute("id",list.childNodes.length)
            newline.setAttribute("class","todo-item")
            newline.setAttribute("draggable","true")

            list.appendChild(newline)

            document.getElementById("todo-form-add").value=""
            socket.emit('todo-list', { message: list.innerHTML});
        }
    }

    socket.on('todo-list', function(data){
    var list = document.getElementById("todo-list")
    list.innerHTML=data.message});
    socket.on('in-list', function(data){
    var list = document.getElementById("in-list")
    list.innerHTML=data.message});
    socket.on('done-list', function(data){
    var list = document.getElementById("done-list")
    list.innerHTML=data.message});

    document.getElementById("todo-list").addEventListener("dragstart",dragstartToDoChange ,false);
    document.getElementById("in-list").addEventListener("dragstart", dragstartInChange,false);
    document.getElementById("done-list").addEventListener("dragstart", dragstartDoneChange,false);

    document.getElementById("todo-list").addEventListener("dragover",dragOver ,false);
    document.getElementById("in-list").addEventListener("dragover", dragOver,false);
    document.getElementById("done-list").addEventListener("dragover", dragOver,false);
    
    document.getElementById("todo-list").addEventListener("drop",dropToDoChange ,false);
    document.getElementById("in-list").addEventListener("drop", dropInChange,false);
    document.getElementById("done-list").addEventListener("drop", dropDoneChange,false);
    
    var start="";
    function dragstartToDoChange(event){
        dragStart(event);
        start="todo-list";
    }
    function dragstartInChange(event){
        dragStart(event);
        start="in-list";
    }
    function dragstartDoneChange(event){
        dragStart(event);
        start="done-list";
    }
    
    var elements = [];
    function dragStart(event){
        event.dataTransfer.effectAllowed = 'move';

        var index = elements.indexOf(event.target);
        if (index == -1) {
            // not already existing in the array, add it now
            elements.push(event.target);
            index = elements.length - 1;
        }
        event.dataTransfer.setData('index', index);
    }


    function dragOver(event){
        event.preventDefault();
        return false;
    }

    function dropToDoChange(event){
        dragDrop(event);
        var list = document.getElementById('todo-list');
        socket.emit('todo-list', {message: list.innerHTML});
    }
    function dropInChange(event){
        dragDrop(event);
        var list = document.getElementById('in-list');
        socket.emit('in-list', {message: list.innerHTML});
    }
    function dropDoneChange(event){
        dragDrop(event);
        var list = document.getElementById('done-list');
        socket.emit('done-list', {message: list.innerHTML});
    }
    
    function dragDrop(event){
        var element = elements[event.dataTransfer.getData('index')];
        if(event.target.id ==="trash") element.parentNode.removeChild(element);
        else if(event.target.localName ==="li") event.target.parentElement.appendChild(element);
        else event.target.appendChild(element);

        var list = document.getElementById(start);
        socket.emit(start, {message: list.innerHTML});
        return false;
    }