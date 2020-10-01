var app = (function () {
	var apiu = "js/apiclient.js";
	
	//Para primera parte
	
	var _cineSeleccionado;
	
	var _fechaSeleccionada;
	
	var _listaFunciones = [];
	
	var cambiarNombreCinema = function (){
		_cineSeleccionado = nuevoNombre;
	};
	
	var cambiarFecha = function (){
		_fechaSeleccionada = nuevaFecha;
	};
	
	//Para segunda parte
	
	var _peliculaSeleccionada;
	
	var _generoSeleccionado;
	
	var _fechaSeleccionadaSaveUpdate;
	
	var _seatsSeleccionados = [[true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true, true, true]];
	
	//Para tercera parte
	var tipo;
	
	/*
	function getFunctionsByCinema(){
		_cineSeleccionado = $("#input").val();
		listaFunciones;
		apimock.getFunctionsByCinema(_cineSeleccionado, function(funcion){
			listaFunciones = funcion.functions;
		});
		for(int i=0; i<listaFunciones.length; i++){
			movieName = listaFunciones[i].movie.name;
            gender = listaFunciones[i].movie.genre;
            hour = listaFunciones[i].date.substring(11, 16);
			disponibilidad = isDisponible(listaFunciones[i].seats);
			var row = '<tr><td>' + movieName + '</td><td>' + gender + '</td><td>' + hour + '</td><td>' + disponibilidad +'</tr>';
			$("#table").append(row);
		}
		
		
		
	}
	*/
	
	function getFunctionsByCinemaAndDate() {
          _cineSeleccionado = $("#input").val();
          _fechaSeleccionada = $("#date").val();
		  $.getScript(apiu, function(){
				api.getFunctionsByCinemaAndDate(_cineSeleccionado, _fechaSeleccionada, convertElementsToObject);
			});          
		  
      }
	
	function dibujarSala(functions){
		
		var mapFunctions = functions.map(
          function (f) {
              f.movie.name;
              f.movie.genre;
              f.date.substring(11, 16);
			  f.seats;
			 
          });
		var funcion =  functions.filter(funct => funct.movie.name == _peliculaSeleccionada);
		console.log()
		var asientos = funcion[0].seats;
		console.log(asientos);
		var c = document.getElementById("myCanvas");
		var ctx = c.getContext("2d");
		console.log(asientos);
		ctx.fillStyle = "#8D792C";
		ctx.fillRect(30, 10, 450, 30);
		
		var column = 10;	
		for(var i = 0; i < asientos.length; i++){
			var row = 10;
			var add = 0;
			for(var j = 0; j < asientos[i].length; j++){
				if (j==2 ||  j==10){
					add+=20;
				}
				else{
					add+=0;
				}
				if(asientos[i][j] == true){
					ctx.fillStyle = "#0043B2";
					ctx.fillRect(row+5+add, column+100, 30, 30);
				}else{
					ctx.fillStyle = "#FF0000";
					ctx.fillRect(row+5+add, column+100, 30, 30);
				}
				row = row+40;
			}
			column = column+40;
		}
		
		$("#sillas").text(conteoSillasLibres(asientos));
	}
	
	
	
	
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
		//_seatsSeleccionados = puestos;
		$("#movieSeleccionado").text(_peliculaSeleccionada);
	}
	
	function redibujarSala () {
		$.getScript(apiu, function(){
				api.getFunctionsByCinemaAndDate(_cineSeleccionado, _fechaSeleccionada, dibujarSala);
			});
	}
	
	function convertElementsToObject(functions) {
		$("table").find("tr:gt(0)").remove();
		$("#cinemaSeleccionado").text(_cineSeleccionado);
		
        
        var mapFunctions = functions.map(
          function (f) {
              f.movie.name;
              f.movie.genre;
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