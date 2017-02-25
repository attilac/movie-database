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

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

getmovieData(imdbTopRated);
console.log(movieDatabase.getMovies());

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

