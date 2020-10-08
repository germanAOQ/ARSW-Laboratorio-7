var app = (function () {
	var apiu = "js/apiclient.js";
	
	// Para primera parte
	
	var _cineSeleccionado;
	
	var _fechaSeleccionada;
	
	var _listaFunciones = [];
	
	var cambiarNombreCinema = function (){
		_cineSeleccionado = nuevoNombre;
	};
	
	var cambiarFecha = function (){
		_fechaSeleccionada = nuevaFecha;
	};
	
	// Para segunda parte
	
	var _peliculaSeleccionada;
	
	var _generoSeleccionado;
	
	var _fechaSeleccionadaSaveUpdate;
	
	var _seatsSeleccionados = [[true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true]];
	
	// Para tercera parte
	var tipo;
	
	// Para laboratorio 7
	var posiciones = [];
	var c,ctx;
	var stompClient = null;
	var seats;
	var _fechaOriginal;
	var selectPelicula;
	var nombreCinema;
	var nombrePelicula;
	var fecha;
	var codigoGenerado;
	
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

	
    var getMousePosition = function (evt) {
    	var canvas = document.getElementById("myCanvas");
    	var x,y;
        $('#myCanvas').click(function (e) {
            var rect = canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            // console.info(x);
            // console.info(y);
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
    
    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);

        // subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe("/topic/"+codigoGenerado, function (eventbody) {
               //alert("Compra realizada");
               var theObject=JSON.parse(eventbody.body);
               updatePoint(theObject.row, theObject.col);
            });
        });

    };

    var updatePoint = function(row, col) {
    	c.width = c.width;
    	seats[row][col] = false;
    	nombreCinema = nombreCinema.replace(" ","%20");
    	nombrePelicula = nombrePelicula.replace(" ","%20");
    	$.getScript(apiu, function(){
			api.updateSeatsByCinemaAndMovie(nombreCinema, nombrePelicula, row, col, redibujarSala);
		});
    	//selectPelicula = false;
    	//redibujarSala();
	}
    
    var verifyAvailability = function (row,col) {
        var st = new Seat(row, col);
        if (seats[row][col]===true){
            seats[row][col]=false;
            updatePoint(row,col);
            // console.info("purchased ticket");
            stompClient.send("/topic/"+codigoGenerado, {}, JSON.stringify(st)); 
            updatePoint(st.row,st.col);
            // updateCanvas();
            
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
    
	/*
	 * function getFunctionsByCinema(){ _cineSeleccionado = $("#input").val();
	 * listaFunciones; apimock.getFunctionsByCinema(_cineSeleccionado,
	 * function(funcion){ listaFunciones = funcion.functions; }); for(int i=0; i<listaFunciones.length;
	 * i++){ movieName = listaFunciones[i].movie.name; gender =
	 * listaFunciones[i].movie.genre; hour =
	 * listaFunciones[i].date.substring(11, 16); disponibilidad =
	 * isDisponible(listaFunciones[i].seats); var row = '<tr><td>' +
	 * movieName + '</td><td>' + gender + '</td><td>' + hour + '</td><td>' +
	 * disponibilidad +'</tr>'; $("#table").append(row); } }
	 */
	
	function getFunctionsByCinemaAndDate() {
          _cineSeleccionado = $("#input").val();
          _fechaSeleccionada = $("#date").val();
		  $.getScript(apiu, function(){
				api.getFunctionsByCinemaAndDate(_cineSeleccionado, _fechaSeleccionada, convertElementsToObject);
			});          
		  
      }
	
	/**
	 * function dibujarSala(functions){
	 * 
	 * var mapFunctions = functions.map( function (f) { f.movie.name;
	 * f.movie.genre; f.date.substring(11, 16); f.seats;
	 * 
	 * }); var funcion = functions.filter(funct => funct.movie.name ==
	 * _peliculaSeleccionada); console.log() var asientos = funcion[0].seats;
	 * console.log(asientos); var c = document.getElementById("myCanvas"); var
	 * ctx = c.getContext("2d"); console.log(asientos); ctx.fillStyle =
	 * "#8D792C"; ctx.fillRect(30, 10, 450, 30);
	 * 
	 * var column = 10; for(var i = 0; i < asientos.length; i++){ var row = 10;
	 * var add = 0; for(var j = 0; j < asientos[i].length; j++){ if (j==2 ||
	 * j==10){ add+=20; } else{ add+=0; } if(asientos[i][j] == true){
	 * ctx.fillStyle = "#0043B2"; ctx.fillRect(row+5+add, column+100, 30, 30);
	 * }else{ ctx.fillStyle = "#FF0000"; ctx.fillRect(row+5+add, column+100, 30,
	 * 30); } row = row+40; } column = column+40; }
	 * 
	 * $("#sillas").text(conteoSillasLibres(asientos)); }
	 */
	var dibujarSala = function (functions) {
		var mapFunctions = functions.map(
		          function (f) {
		              f.movie.name;
		              f.movie.genre;
		              f.date.substring(11, 16);
					  f.seats;
					 
		          });
		var funcion =  functions.filter(funct => funct.movie.name == _peliculaSeleccionada);
		console.log()
		//if(selectPelicula){
		seats = funcion[0].seats;
		//}
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
        $("#sillas").text(conteoSillasLibres(seats));
    };
	
	
	function conteoSillasLibres(functions){
		var cont = 0;
		for(var i = 0; i < functions.length; i++){
			for(var j = 0; j < functions[i].length; j++){
				if(functions[i][j] == true){
					cont++;
				}
			}
		}
		return cont;
	}
	
	function asignarPelicula (functions, genero, fecha, puestos){
		_peliculaSeleccionada = functions;
		_generoSeleccionado = genero;
		_fechaSeleccionadaSaveUpdate = fecha;
		// _seatsSeleccionados = puestos;
		$("#movieSeleccionado").text(_peliculaSeleccionada);
	}
	
	function redibujarSala () {
		$.getScript(apiu, function(){
				api.getFunctionsByCinemaAndDate(_cineSeleccionado, _fechaSeleccionada, dibujarSala);
			});
	}
	
	function convertElementsToObject(functions) {
		//selectPelicula = true;
		$("table").find("tr:gt(0)").remove();
		$("#cinemaSeleccionado").text(_cineSeleccionado);
		
        
        var mapFunctions = functions.map(
          function (f) {
              f.movie.name;
              f.movie.genre;
              _fechaOriginal = f.date;
              f.date.substring(11, 16);
			  f.seats;
				
          });
		  
		  for(var i=0; i<functions.length; i++){
			movieName = functions[i].movie.name;
            gender = functions[i].movie.genre;
            hour = functions[i].date.substring(11, 16);
			fecha = functions[i].date;
			puestos = functions[i].seats;
			disponibilidad = isDisponible(functions[i].seats);
			var row = '<tr><td>' + movieName + '</td><td>' + gender + '</td><td>' + hour + '</td><td>' + true +'</td><td>'+"<button type='button' class='btn btn-primary'onclick='app.asignarPelicula(\""+ movieName +"\",\""+gender+"\",\""+fecha+"\",\""+puestos+"\"); app.redibujarSala();' > "+'</td><td>'+'</tr>';
			$("#table").append(row);
		}
		  

      }
	  
	function isDisponible(alist){
		var n = false;
		for(i = 0; i < alist.length; i++){
			n = n || alist[i].includes(true);
		}		
		return n;
	}		
	
	
	function updateTable(mapFunctions) {

          $("#cinemaSeleccionado").text(_cineSeleccionado);
          mapFunctions.map(function (film) {
              var row = '<tr><td>' + film.movieName + '</td><td>' + film.gender + '</td><td>' + film.hour + '</td><td>' + boton +'</tr>';
              $("#table").append(row);
          })
		  
		 
      }
	  
	function saveUpdate (){
		
		if(tipo == "actualizar"){
			_fechaNueva = $("#function").val();
			var cinemaFunction = {
			"movie": {"name": _peliculaSeleccionada, "genre": _generoSeleccionado},
			"seats": _seatsSeleccionados,
			"date": _fechaSeleccionada + " " +_fechaNueva
			};
			$.getScript(apiu, function(){
					api.updateDateCinemaFunction(_cineSeleccionado, _peliculaSeleccionada, cinemaFunction, actualizarLista);
				});
		}else if(tipo == "guardar"){
			_fechaNueva = $("#function").val();
			_peliculaSeleccionada2 = $("#nombrePelicula").val();
			_generoSeleccionado2 = $("#genre").val();
			var cinemaFunction = {
			"movie": {"name": _peliculaSeleccionada2, "genre": _generoSeleccionado2},
			"seats": _seatsSeleccionados,
			"date": _fechaSeleccionada + " " +_fechaNueva
			};
			$.getScript(apiu, function(){
					api.insertDateCinemaFunction(_cineSeleccionado, cinemaFunction, actualizarLista);
				});
		}
	}
	
	function actualizarLista(){
		$("table").find("tr:gt(0)").remove();
		$.getScript(apiu, function(){
				api.getFunctionsByCinemaAndDate(_cineSeleccionado, _fechaSeleccionada, convertElementsToObject);
			});    
	}
	
	function getFunctions (functions){		
		
	}
	
	function createFunction (){
		var desplegar = $("#desplegar");
        var labelMovieName = '<label id="labelMovieName" for="nombre">Movie name:</label>'
        var labelMovieGenre = '<label id="labelMovieGenre" for="nombre">Movie genre:</label>'
        var movieName = '<input type="text" id="nombrePelicula" name="nombrePelicula" placeholder="Movie name">';
        var genre = '<input type="text" id="genre" name="genre" placeholder="Genre">';
        var br1 = '<br id="br1">';
        var br2 = '<br id="br2">';

        desplegar.append(labelMovieName);
        desplegar.append(movieName);
        desplegar.append(br1);
        desplegar.append(labelMovieGenre);
        desplegar.append(genre);
        desplegar.append(br2);
		
	}
	
	function deleteFunction (){
		var cinemaFunction = {
			"movie": {"name": _peliculaSeleccionada, "genre": _generoSeleccionado},
			"seats": _seatsSeleccionados,
			"date": _fechaSeleccionada + " " +_fechaNueva
			};
			$.getScript(apiu, function(){
					api.deleteCinemaFunction(_cineSeleccionado, cinemaFunction, actualizarLista);
				});
	}
	  
	function actualizar() {
		if(tipo!="guardar"){
			tipo = "actualizar";
		}
	}
	
	function guardar() {
		tipo = "guardar";
	}

	
	
	return {
		init: function () {
            // var can = document.getElementById("canvas");
            // drawSeats();
            // websocket connection
            connectAndSubscribe();
        },
        conectar: function (){
        	nombreCinema = $("#nombreCinema").val();
        	nombrePelicula = $("#nombrePelicula").val();
        	fecha = $("#dateFuncion").val();
        	codigoGenerado = "buyticket."+nombreCinema+"."+fecha+"."+nombrePelicula;
        	console.log(codigoGenerado);
        	connectAndSubscribe();
        },
        availableClick: availableClick,
		cambiarNombreCinema: cambiarNombreCinema,
		cambiarFecha: cambiarFecha,
		getFunctionsByCinemaAndDate: getFunctionsByCinemaAndDate,
		asignarPelicula: asignarPelicula,
		redibujarSala: redibujarSala,
		saveUpdate: saveUpdate,
		createFunction: createFunction,
		actualizar: actualizar,
		guardar: guardar,
		deleteFunction: deleteFunction
	};
})();