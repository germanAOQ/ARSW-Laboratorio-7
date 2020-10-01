var Url = 'http://localhost:8080/cinemas/';
api = (function () {
    var f=[]
	var g=[]
    return {
        getFunctionsByCinema: function (name, callback) {
                $.get(Url+name,function(data){
                    f=data;
                });
                return callback(f[name])
        },
		getFunctionsByCinemaAndDate: function (name, date, callback) {
			
			//console.log(name);
			//console.log(date);
			
			$.getJSON(Url + name +"/"+ date, function (data) {
				callback(data);
			});
        },
		updateDateCinemaFunction: function (nombreCine, pelicula, cinemaFunction, callback){
			var nuevaFuncion = JSON.stringify(cinemaFunction);
			const promise = new Promise((resolve, reject) => {
            $.ajax({
                url: Url+nombreCine+"/"+pelicula,
                type: 'PUT',
                data: nuevaFuncion,
                contentType: "application/json"
            }).done(function () {
                resolve('SUCCESS');

            }).fail(function (msg) {
                reject('FAIL');
            });
        });
		
		promise
			.then(res => {
                callback();
            })
            .catch(error => {
                alert(error);
            });
		
		},
		
		insertDateCinemaFunction: function (_cineSeleccionado, cinemaFunction, callback){
			var nuevaFuncion = JSON.stringify(cinemaFunction);
			const promise = new Promise((resolve, reject) => {
            $.ajax({
                url: Url+_cineSeleccionado,
                type: 'POST',
                data: nuevaFuncion,
                contentType: "application/json"
            }).done(function () {
                resolve('SUCCESS');

            }).fail(function (msg) {
                reject('FAIL');
            });
        });
		
		promise
			.then(res => {
                callback();
            })
            .catch(error => {
                alert(error);
            });
		},
		
		deleteCinemaFunction: function(_cineSeleccionado, cinemaFunction, callback){
			var nuevaFuncion = JSON.stringify(cinemaFunction);
			console.log(nuevaFuncion);
			const promise = new Promise((resolve, reject) => {
            $.ajax({
                url: Url+_cineSeleccionado,
                type: 'DELETE',
                data: nuevaFuncion,
                contentType: "application/json"
            }).done(function () {
                resolve('SUCCESS');

            }).fail(function (msg) {
                reject('FAIL');
            });
        });
		
		promise
			.then(res => {
                callback();
            })
            .catch(error => {
                alert(error);
            });
		}
		
		
    };
})();