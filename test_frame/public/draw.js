
var c;
var ctx;
var paint = false;

var color = "#5fdaa5";

(function($) {

    $( document ).ready(function() {
        //console.log( "ready!" );
        var socket = io();
        //alert("ready");

        c = document.getElementById("myCanvas");
        ctx = c.getContext("2d");
        //c.width = screen.width - 2;
        /*ctx.fillStyle = "#FF0000";
        ctx.fillRect(0,0,150,75);*/

        // set some preferences for our line drawing.
        ctx.fillStyle = "solid";      
        ctx.strokeStyle = color;    
        ctx.lineWidth = 5;               
        ctx.lineCap = "round";

        // -------------------------DRAWING EVENTS-----------------------//
        $('#myCanvas').mousedown(function(e)
        {
            //console.log("[x, y]");
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            ctx.beginPath();
            ctx.moveTo(mouseX,mouseY);
            paint = true;
            socket.emit('beginDraw', mouseX, mouseY);
        });

        $('#myCanvas').mousemove(function(e){
             if(paint)    
             {
                var mouseX = e.pageX - this.offsetLeft;
                var mouseY = e.pageY - this.offsetTop;
                ctx.strokeStyle = color;
                ctx.lineTo(mouseX,mouseY);
                ctx.stroke();
                socket.emit('draw', mouseX, mouseY, color);
                // sending to all clients except sender
                //io.sockets.emit('draw', mouseX, mouseY);
                //socket.broadcast.emit('hi');
                //console.log("["+mouseX+","+mouseY+"]");
             }
        });

        $('#myCanvas').mouseup(function(e){
          paint = false;
          ctx.closePath();
          socket.emit('endDraw');
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
        socket.on('draw', function(x,y){
            console.log("["+x+","+y+"]");
            ctx.lineTo(x,y);
            ctx.stroke();
        });
        socket.on('draw', function(x,y, _color){
            console.log("["+x+","+y+"]");
            //var ol_color = color;
            ctx.strokeStyle = _color;
            ctx.lineTo(x,y);
            ctx.stroke();
            //ctx.strokeStyle = ol_color;
        });
        socket.on('beginDraw', function(x,y){
            console.log("begin: ["+x+","+y+"]");
            ctx.beginPath();
            ctx.moveTo(x,y);
            //paint = true;
        });

        socket.on('endDraw', function(){
            console.log("endDraw");
            //paint = false;
            ctx.closePath();
        });
        socket.on('clearDraw', function(){
            //console.log("endDraw");
            ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
            //paint = false;
            //ctx.closePath();
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