
var c;
var ctx;
var paint = false;

var color = "#5fdaa5";
//var color = "rgb(155, 102, 102)"; 

var c2;
var ctx2nd;

var monId;

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

(function($) {

    $( document ).ready(function() {
        //console.log( "ready!" );
        var socket = io();
        //testS = socket;
        //alert("ready");
        //socket.broadcast.emit('newuser');
        color = getRandomColor();
        // send to current request socket client
        socket.emit('newuser');
        //alert(socket);
        //console.log(socket.sessionid);

        c = document.getElementById("myCanvas");
        ctx = c.getContext("2d");

        c2 = $(".drawingCanvasServer").get( 0 );
        ctx2nd = c2.getContext("2d");

        //c.width = screen.width - 2;
        c.width = $( document ).width() - 2;
        c.height = $( document ).height() - 2;

        c2.width = $( document ).width() - 2;
        c2.height = $( document ).height() - 2;

        // set some preferences for our line drawing.
        ctx.fillStyle = "solid";      
        ctx.strokeStyle = color;    
        ctx.lineWidth = 5;               
        ctx.lineCap = "round";

        // set some preferences for our line drawing.
        ctx2nd.fillStyle = "solid";      
        ctx2nd.strokeStyle = color;    
        ctx2nd.lineWidth = 5;               
        ctx2nd.lineCap = "round";

        // -------------------------DRAWING EVENTS-----------------------//
        $('#myCanvas').mousedown(function(e)
        {
            //console.log("[x, y]");
            $( "canvas" ).each(function( ) {
              console.log($( this ).width() );
            });
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            ctx.beginPath();
            ctx.moveTo(mouseX,mouseY);
            paint = true;
            socket.emit('beginDraw', mouseX, mouseY, monId);
        });

        $('#myCanvas').mousemove(function(e){
             if(paint)    
             {
                var mouseX = e.pageX - this.offsetLeft;
                var mouseY = e.pageY - this.offsetTop;
                ctx.strokeStyle = color;
                ctx.lineTo(mouseX,mouseY);
                ctx.stroke();
                socket.emit('draw', mouseX, mouseY, color, monId);
                // sending to all clients except sender
                //io.sockets.emit('draw', mouseX, mouseY);
                //socket.broadcast.emit('hi');
                //console.log("["+mouseX+","+mouseY+"]");
             }
        });

        $('#myCanvas').mouseup(function(e){
          paint = false;
          ctx.closePath();
          socket.emit('endDraw', monId);
        });

        $('#myCanvas').mouseleave(function(e){
          paint = false;
        });

       $("#button_clear_canvas").click(function() {
	        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
	        socket.emit('clearDraw');
	        //alert("click");
	    });
        
        
        // -------------------------END DRAWING EVENTS-----------------------//

        
        // -------------------------- SOCKET FUNCTIONS --------------------------//
        socket.on('newuser', function(_userID){
            //alert("newuser: "+socket.id);
            //alert("newuser: "+_userID);
            //var newCanvas = $('<canvas/>',{'class':'drawingCanvasServer'});
            var newCanvas = 
                $('<canvas/>',{'class':'drawingCanvasServer'})
                .width($(document).width() - 2)
                .height($(document).height() - 2)
                .attr('id', _userID)
                .data('userID', {m_id: _userID});
            //newCanvas.set
            //ajouter un calque
            $("#layers").append(newCanvas);
        });

        socket.on('setID', function(id)
        {
            //alert(id);
            monId = id;
        });
        socket.on('draw', function(x,y){
            console.log("["+x+","+y+"]");
            ctx2nd.lineTo(x,y);
            ctx2nd.stroke();
        });
        socket.on('draw', function(x,y, _color){
            console.log("["+x+","+y+"]");
            //var ol_color = color;
            ctx2nd.strokeStyle = _color;
            ctx2nd.lineTo(x,y);
            ctx2nd.stroke();
            //ctx.strokeStyle = ol_color;
        });

        socket.on('beginDraw', function(x,y){
            console.log("begin: ["+x+","+y+"]");
            ctx2nd.beginPath();
            ctx2nd.moveTo(x,y);
            //paint = true;
        });

        socket.on('endDraw', function(){
            console.log("endDraw");
            //paint = false;
            ctx2nd.closePath();
        });

        socket.on('clearDraw', function(){
            //console.log("endDraw");
            ctx2nd.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
            //paint = false;
            //ctx.closePath();
        });

        // ------------------AVEC USER ID-----------------------//
        socket.on('draw', function(x,y, _color, userID){
            c2 = $("#"+userID);
            ctx2nd = c2.getContext("2d");
            ctx2nd.fillStyle = "solid";      
            ctx2nd.strokeStyle = color;    
            ctx2nd.lineWidth = 5;               
            ctx2nd.lineCap = "round";
            //console.log("["+x+","+y+"]");
            //var ol_color = color;
            ctx2nd.strokeStyle = _color;
            ctx2nd.lineTo(x,y);
            ctx2nd.stroke();
            //ctx.strokeStyle = ol_color;
        });

        socket.on('beginDraw', function(x,y,userID){
            c2 = $("#"+userID);
            ctx2nd = c2.getContext("2d");
            //console.log("begin: ["+x+","+y+"]");
            ctx2nd.beginPath();
            ctx2nd.moveTo(x,y);
            //paint = true;
        });

        socket.on('endDraw', function(userID){
            c2 = $("#"+userID);
            ctx2nd = c2.getContext("2d");
            //console.log("endDraw");
            //paint = false;
            ctx2nd.closePath();
        });
        // ----------------------- END SOCKET FUNCTIONS --------------------------//
        
        // -------------------------- COLORPICKER FUNCTIONS --------------------------//
        $('.color-box').colpick({
            colorScheme:'light',
            layout:'hex',
            color:'5fdaa5',
            onSubmit:function(hsb,hex,rgb,el) {
                $(el).css('background-color', '#'+hex);
                $(el).colpickHide();
                color = "#"+hex;
            },
            onChange:function(hsb,hex,rgb,el,bySetColor) {
              //$(el).css('border-color','#'+hex);
              // Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
              //if(!bySetColor) $(el).val(hex);
                color = "#"+hex;
                $(el).css('background-color', color);
                //console.log("#"+hex);
           }
        })
        .css('background-color', color);
        // -------------------------- END COLORPICKER FUNCTIONS --------------------------//
    });

})(jQuery);