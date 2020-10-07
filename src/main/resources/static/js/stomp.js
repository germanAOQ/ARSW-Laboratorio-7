var app = (function () {

    var seats = [[true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true]];
    var posiciones = [];
    var c,ctx;
    
    class Seat {
        constructor(row, col) {
            this.row = row;
            this.col = col;
        }
    }
    
    class Posicion {
    	constructor(posX, posY, row, col)
		{
			this.posX = posX;
			this.posY = posY;
			this.row = row;
			this.col = col;
		}
    };

    var stompClient = null;

    //get the x, y positions of the mouse click relative to the canvas
    var getMousePosition = function (evt) {
    	var canvas = document.getElementById("myCanvas");
    	var x,y;
        $('#myCanvas').click(function (e) {
            var rect = canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            //console.info(x);
            //console.info(y);
            calcularAsiento(x,y);
        });
        
    };
    
    function calcularAsiento(x, y) {
        var row = Math.trunc(x/10);
        var col = Math.trunc(y/10);
        row = row*10;
        col = col*10;
        rowRes = 0;
        colRes = 0;
        for(i=0; i<posiciones.length; i++){
        	if(posiciones[i].posX == row && posiciones[i].posY == col){
        		rowRes = posiciones[i].row;
        		colRes = posiciones[i].col;
        	}
        }
        console.log("row: "+rowRes);
        console.log("col: "+colRes);
        verifyAvailability(rowRes,colRes);
    };
    
    var drawSeats = function (cinemaFunction) {
        c = document.getElementById("myCanvas");
        ctx = c.getContext("2d");
        ctx.fillStyle = "#001933";
        ctx.fillRect(100, 20, 300, 80);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "40px Arial";
        ctx.fillText("Screen", 180, 70);
        var row = 5;
        var col = 0;
        rowTemp=0;
        for (var i = 0; i < seats.length; i++) {
            row++;
            col = 0;
            colTemp=0;
            for (j = 0; j < seats[i].length; j++) {
                if (seats[i][j]) {
                    ctx.fillStyle = "#009900";
                } else {
                    ctx.fillStyle = "#FF0000";
                }
                col++;
                posiciones.push(new Posicion(20 * col, 20 * row, rowTemp, colTemp));
                ctx.fillRect(20 * col, 20 * row, 20, 20);
                col++;
                colTemp++;
            }
            row++;
            rowTemp++;
        }
        console.log(posiciones);
    };

    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);

        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/buyticket', function (eventbody) {
               alert("evento recibido");
               var theObject=JSON.parse(eventbody.body);
               updatePoint(theObject.row, theObject.col);
            });
        });

    };

    var updatePoint = function(row, col) {
    	c.width = c.width;
    	seats[row][col] = false;
    	drawSeats();
	}
    
    function updateCanvas() {
    	c.width = c.width;
    	drawSeats();
	}
    
    var verifyAvailability = function (row,col) {
        var st = new Seat(row, col);
        if (seats[row][col]===true){
            seats[row][col]=false;
            updatePoint(row,col);
            //console.info("purchased ticket");
            stompClient.send("/topic/buyticket", {}, JSON.stringify(st)); 
            updatePoint(st.row,st.col);
            //updateCanvas();
            
        }
        else{
            console.info("Ticket not available");
        }  

    };


    function availableClick(){
    	var canvas = document.getElementById("myCanvas");
    	getMousePosition(canvas.onclick = function() {
    	});
    };

    return {

        init: function () {
            var can = document.getElementById("canvas");
            drawSeats();
            //websocket connection
            connectAndSubscribe();
        },

        buyTicket: function (row, col) {
            console.info("buying ticket at row: " + row + "col: " + col);
            verifyAvailability(row,col);
            //buy ticket
        },
        
        availableClick: availableClick,

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        }
    };

})();