console.log('---Main---');

/**
 *
 */
var formatDate = function(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};

/**
 * Fetch all albums from API
 * 
 */
var getMoviesFromJSON = function(dataUrl){
	fetch(dataUrl)
		.then(function(response){
			console.log('GET Response: ' + response.statusText);
			// returns response in json format
			return response.json();
		})	
		.catch(function(error){
			console.log('Error message: ' + error.message);
		})
		.then(function(json){
			//console.log(json);
			getmovieData(json);
			//return json;
		});
};

/**
 * Skapa en array med Movie objekt från en JSON-array och lägg till i movieDatabase
 * @param {array} arr - arrayen att parsa 
 */
var getmovieData = function(arr){
    for(var i = 0; i < arr.length; i++) {
		var movie = new Movie(arr[i].title,
				arr[i].year,
				arr[i].genres,
				arr[i].ratings,
				arr[i].poster,
				arr[i].contentRating,
				arr[i].duration,
				arr[i].releaseDate,
				arr[i].averageRating,
				arr[i].originalTitle,
				arr[i].storyline,
				arr[i].actors,
				arr[i].imdbRating,
				arr[i].posterurl);
		movieDatabase.addMovie(movie);
    }
 	dataCallback(movieDatabase);
};

/**
 *
 */
var dataCallback = function(movieDatabase){
	console.log('Movies in genre Crime');
	var moviesByGenres = movieDatabase.getMoviesByGenres(['Crime']);
	console.log(moviesByGenres);

	var releaseDate = movieDatabase.getMovies()[0].releaseDate;
	console.log(formatDate(new Date(releaseDate)));
	//console.log(new Date(releaseDate).getFullYear());
	var titleYearDate = new Date(movieDatabase.getMovies()[0].year);
	var titleYear = titleYearDate.getFullYear();
	console.log(titleYear);

	var poster = movieDatabase.getMovies()[5].poster;
	var content = document.getElementsByClassName('content')[0];
	content.innerHTML = `<img src="img/${poster}">`;

};

getMoviesFromJSON('/js/top-rated-movies-01.json');
getMoviesFromJSON('/js/top-rated-movies-02.json');
