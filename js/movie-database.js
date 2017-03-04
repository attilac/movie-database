/*jshint esversion: 6 */
console.log('---Movie Database');
console.log( '-----Revealing Module Pattern-----');
/**
 * ------------------------------------------------------------------------
 *  	Revealing Module Pattern
 *      functions and variables that begins with _ are private    
 * ------------------------------------------------------------------------
*/

/**
 * Holds all data and has functions for filtering, adding and updating
 * 
 */
var movieDatabase = (function(movies) {
 	// our array of movies - private variable	
    var _movies = movies;
    // track selected movie
    var _currentMovie = 0;
    // track selected genres
    var currentGenres = [];
    var _sortOrder = 'DESC';
    var _sortBy = 'averageRating';

    const _sortByList = [
	    					{
	    						'key': 'title', 'displayName': 'Movie Title'
	    					},
	    					{
	    				 		'key': 'averageRating', 'displayName': 'Rating'
	    				 	},
	    					{	
	    						'key': 'year', 'displayName': 'Title Year'	
	    					},	    				 	
						 	{	
						 		'key': 'id', 'displayName': 'Date Added'
						 	}		
    					];
    const _sortOrderList  = [
	    					{
	    						'key': 'ASC', 'displayName': 'Low to High'
	    					},
	    					{
	    						'key': 'DESC', 'displayName': 'High to Low'
	    					}
							];

	/**
	 * Gets the _movie array
	 * @return {Array} _movies - an array of movie objects
	 */	
    var getMovies = function() {
    	return _movies;
    };

	/**
	 * Sets the entire _movies array
	 * @param {Array} movies - an array of movie objects
	 */	
    var setMovies = function(movies) {
        _movies = movies;
    };

	/**
	 * Pushes a new movie to the _movies array
	 * @param {Object} movie - a movie object
	 */	
    var addMovie = function(movie) {
    	//console.log(movie);
    	_movies.push(movie);
    };

	/**
	 * 
	 */
    var getSortOrder = function() {
    	return _sortOrder;
    };

	/**
	 * 
	 * @param {String}
	 */
    var setSortOrder = function(value) {
    	_sortOrder = value;
    };

	/**
	 * 
	 */
    var getSortBy = function() {
    	return _sortBy;
    }; 

	/**
	 * 
	 * @param {String}
	 */
    var setSortBy = function(property) {
    	_sortBy = property;
    };

	/**
	 * 
	 */
    var getSortByList = function() {
    	return _sortByList;
    }; 

	/**
	 * 
	 */
    var getSortOrderList = function() {
    	return _sortOrderList;
    }; 

	/**
	 * 
	 * 
	 */
    var getCurrentMovie = function() {
    	//console.log(_currentMovie);
    	return getMoviesByKey('id', Number(_currentMovie))[0];
    };

	/**
	 * 
	 * 
	 */
    var setCurrentMovie = function(id) {
    	_currentMovie = id;
    };    

	/**
	 * Returns an array of movies filtered by genre
	 * @param {Array} genres - the genres to filter by
	 * @return {Array} _movies - an array of movie objects 
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

	/*-------------------------------------------------------------------------
							Variants on genre filter. 
							these are just here to explore the 
							for, forEach and map scope differences
	--------------------------------------------------------------------------*/

	/**
	 * Returns an array of movies filtered by genre (forEach version)
	 * @param {Array} genres - the genres to filter by
	 * @return {Array} _movies - an array of movie objects 
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
	 * Returns an array of movies filtered by genre (for version)
	 * @param {Array} genres - the genres to filter by
	 * @return {Array} _movies - an array of movie objects 
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
	/*-------------------------------------------------------------------------*/

	/**
	 * Returns an array of movies filtered by a key
	 * @param {String} key - the name of the key to filter by
	 * @param {String} value - the value of the key
	 * @return {Array} _movies - an array of movie objects
	 */	
    var getMoviesByKey = function(key, value) {
    	return _movies
    	.filter(function(movie) {
    		return movie[key] === value;
    	});
    };

	/**
	 * Returns an array of movie property list
	 * @param {String} key - the property to list
	 * @return {Array} _movies - an array of movie objects
	 */	
    var getMoviesPropertyList = function(key) {
    	return _movies
    	.map(function(movie) {
    		return movie[key];
    	});
    };

	/**
	 * Adds rating to a moviesratings array. Wrapper for movie.setRating
	 */	
    var rateMovie = function(movie, rating) {
    	movie.setRating(rating);
    };

	/**
	 * Gets the highest rated movie
	 * @return {Object} - a Movie object
	 */	
    var getTopRatedMovie = function() {
    	return _getObjectByPropertyMax('averageRating');
    };

	/**
	 * Gets the least rated movie
	 * @return {Object} - a Movie object
	 */	
    var getLeastRatedMovie = function() {
    	return _getObjectByPropertyMin('averageRating', _movies);
    };

	/**
	 * 
	 */	
    _getObjectByPropertyMin = function(key, movies = _movies) {
		return movies
		.reduce(function(prevItem, currentItem) {
			return prevItem[key] < currentItem[key] ? prevItem : currentItem;
		});
	};

	/**
	 * 
	 */	
    _getObjectByPropertyMax = function(key, movies = _movies) {
		return movies
		.reduce(function(prevItem, currentItem) {
			return prevItem[key] > currentItem[key] ? prevItem : currentItem;
		});
	};

    // Reveal public pointers to
    // private functions and properties
    return {
        getMovies: getMovies,
        setMovies: setMovies,      
        addMovie: addMovie,
        rateMovie: rateMovie,
        getCurrentMovie: getCurrentMovie,
        setCurrentMovie: setCurrentMovie,
        getTopRatedMovie: getTopRatedMovie,
        getLeastRatedMovie: getLeastRatedMovie,
        getMoviesByKey: getMoviesByKey,
        getMoviesByGenres: getMoviesByGenres,
        getMoviesPropertyList: getMoviesPropertyList,
        currentGenres: currentGenres,
        setSortOrder: setSortOrder,
        setSortBy: setSortBy,
        getSortOrder: getSortOrder,
        getSortBy: getSortBy,
        getSortByList: getSortByList,
        getSortOrderList: getSortOrderList
    };
 
})(movies=[]);

/*-------------------------------------------------------------------------
							Usage examples
--------------------------------------------------------------------------*/
console.log('-----Usage examples-----');

/**
 *
 */
var testDatabaseFunctions = function(movieDatabase){
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
	console.log('Movies from year 2017');
	console.log(movieDatabase.getMoviesByKey('year', 2017));
	console.log('Least rated Movie: ' + movieDatabase.getLeastRatedMovie().title + ' Rating: ' + movieDatabase.getLeastRatedMovie().averageRating);
	console.log('Top rated Movie: ' + movieDatabase.getTopRatedMovie().title + ' Rating: ' + movieDatabase.getTopRatedMovie().averageRating);
};