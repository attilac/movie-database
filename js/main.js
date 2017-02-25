console.log('---Main---');

/**
 * Skapa en array med Recipe-objekt från en JSON-array och lägg till i en RecipeList
 * @param {array} arr - arrayen att parsa ( ursäkta svengelskan :)
 */
function getmovieData(arr){
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
}

getmovieData(imdbTopRated);
console.log(movieDatabase.getMovies());
console.log('Movies in genre Crime');
var moviesByGenres = movieDatabase.getMoviesByGenres(['Crime']);
console.log(moviesByGenres);
