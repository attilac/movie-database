console.log('Movie Database - Revealing Module Pattern');
//var movies = [];
//movies.push(rougeOne);
//console.log(movies);

/**
 * Revealing Module Pattern
 * 
 */
var movieDatabase = (function(movies) {
 	
    var _movies = movies;

    // private functions

	// public functions

	/**
	 * 
	 */	
    var getMovies = function() {
    	return _movies;
    };

	/**
	 * 
	 */	
    var setMovies = function(movies) {
        _movies = movies;
    };

	/**
	 * 
	 */	
    var addMovie = function(movie) {
    	_movies.push(movie);
    };

	/**
	 * 
	 */
	var getMoviesByGenres = function(genres) {
	    return _movies
	    // executed for each movie
	    .filter(function(movie) { 
	    	// iterate over genre
	    	hasGenre = false;
	    	genres.map(function(genre) {
	    		//console.log(movie.genres.indexOf(genre) >= 0);	
	            if (movie.genres.indexOf(genre) >= 0) {
	            	//console.log(genre);
	            	//console.log(movie);
	                hasGenre = true; // if this movie has this genre
	            }
	    	});
	        return hasGenre;
	    });     
	};

	/**
	 * 
	 */
	var getMoviesByGenresForEach = function(genres) {
	    return _movies
	    // executed for each movie
	    .filter(function(movie) { 
	    	// iterate over genre
	    	hasGenre = false;
	    	genres.forEach(function(genre, index, genres) {
	    		//console.log(movie.genres.indexOf(genre) >= 0);	
	            if (movie.genres.indexOf(genre) >= 0) {
	            	//console.log(genre);
	            	//console.log(movie);
	            	//console.log(this);
	                hasGenre = true; // if this movie has this genre
	            }
	    	}); 
	        return hasGenre;
	    });     
	};

	/**
	 * 
	 */
	var getMoviesByGenresFor = function(genres) {
	    return _movies
	    // executed for each movie
	    .filter(function(movie) { 
	    	// iterate over genre   	
	        for(let i = 0; i < genres.length; i++) { 
	        	//console.log(movie.genres.indexOf(genres[i]) >= 0);
	            if (movie.genres.indexOf(genres[i]) >= 0) {
	            	console.log(genres[i]);
	            	//console.log(movie);
	            	//console.log(this);
	                return true; // if this movie has this genre
	            }
	        }
	        return false;
	    });     
	};

	/**
	 * 
	 */	
	var _getUniqueArray = function(array){
		return array
		.reduce(function(previousItem, currentItem){
			//console.log(currentItem);
			if (previousItem.indexOf(currentItem) < 0) previousItem.push(currentItem);
			return previousItem;
		}, []);
	};

	/**
	 * 
	 */	
    var getMoviesByYear = function(year) {
    	return _movies
    	.filter(function(movie) {
    		return movie.year === year;
    	});
    };

	/**
	 * 
	 */	
    var rateMovie = function(movie, rating) {
    	movie.setRating(rating);
    };

	/**
	 * 
	 */	
    var getTopRatedMovie = function() {

    };

	/**
	 * 
	 */	
    var getWorstRatedMovie = function() {

    };

    // Reveal public pointers to
    // private functions and properties
    return {
        getMovies: getMovies,
        setMovies: setMovies,      
        addMovie: addMovie,
        rateMovie: rateMovie,
        getTopRatedMovie: getTopRatedMovie,
        getWorstRatedMovie: getWorstRatedMovie,
        getMoviesByYear: getMoviesByYear,
        getMoviesByGenres: getMoviesByGenres
    };
 
})(movies=[]);

// Test
movieDatabase.addMovie(rougeOne);
movieDatabase.addMovie(trainspotting2);
movieDatabase.addMovie(theShack);
//console.log(movieDatabase);
var movieToEdit = movieDatabase.getMovies()[0];
movieDatabase.rateMovie(movieToEdit, 10);
//console.log(movieDatabase.getMovies());
console.log('Movies in genre Adventure, Drama and Science Fiction');
var moviesByGenres = movieDatabase.getMoviesByGenres(['Adventure', 'Drama', 'Science Fiction']);
console.log(moviesByGenres);
console.log('Movies in genre Drama');
moviesByGenres = movieDatabase.getMoviesByGenres(['Drama']);
console.log(moviesByGenres);
console.log('Movies in genre Science Fiction');
moviesByGenres = movieDatabase.getMoviesByGenres(['Science Fiction']);
console.log(moviesByGenres);
//console.log(movieDatabase.getMoviesByYear(2017));
