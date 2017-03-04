/*jshint esversion: 6 */
console.log('---Movie----');
console.log('-----Revealing Prototype Pattern-----');

/**
 * ------------------------------------------------------------------------
 *  	Revealing Prototype Pattern
 *      functions and variables that begins with _ are private       
 * ------------------------------------------------------------------------
*/

/**
 * Movie constructor - Revealing Prototype Pattern
 * @param {String} title - the title of the movie
 * @param {Number} year - the release year
 * @param {Array} genres - an array(strings) of genre names
 * @param {Array} ratings - an array(wholenumbers 1-10) of ratings for the movie
 * @param {String} poster - filename to poster image
 * @param {String} contentRating
 * @param {String} duration
 * @param {String} releaseDate
 * @param {Number} averageRating
 * @param {String} originalTitle
 * @param {String} storyline
 * @param {Array} actors
 * @param {Number} imdbRating - rating from imdb 
 * @param {String} posterurl - url to poster
 */
var Movie = function (title, 
						year, 
						genres, 
						ratings, 
						poster, 
						contentRating, 
						duration, 
						releaseDate,
						averageRating,
						originalTitle,
						storyline,
						actors,
						imdbRating,
						posterurl,
						id) {
	this.title = title;
	this.year = Number(year);
	this.contentRating = contentRating;
	this.duration = duration;
	this.genres = genres;
	this.releaseDate = releaseDate;
	this.ratings = ratings;
	this.poster = poster;
	this.averageRating = averageRating;
	this.originalTitle = originalTitle;
	this.storyline = storyline;
	this.actors = actors;
	this.imdbRating = imdbRating;
	this.posterurl = posterurl;
	this.id = Number(id);
	this.init();
};

/**
 * The Movie prototype functions. 
 * Revealing Prototype Pattern was chosen for ablitity to have private and public functions
 * 
 */
Movie.prototype = function(){

	/**
	 * Init function
	 */	
	var init = function(){
		//console.log(this.ratings.length);
		//console.log(this);
		if(this.ratings.length) {
			this.averageRating = _calcAverageRating(this.ratings);
		}
	};

	/**
	 * Prints a string with movie details
	 */	
	var toString = function(){
		return `Movie: ${this.title}, Year: ${this.year}, Genres: ${this.genres}`;
	};

	/**
	 * 
	 */
	var getTheID = function(){
		return this.id;
	};

	/**
	 * Adds rating to to the ratings array and calculates the average rating
	 */		
	var setRating = function(rating){
		this.ratings.push(rating);
		this.averageRating = _calcAverageRating(this.ratings);
		//console.log(this.averageRating);
	};

	/**
	 * Returns the movies genres
	 * @return {Array} genres - the genres attached to the movie
	 */		
	var getGenres = function(){
		return this.genres;	
	};

	/**
	 * Returns the computed average rating
	 * @return {Number} averageRating - the computed average rating
	 */		
	var getAverageRating = function(){
		return this.averageRating;	
	};

	/**
	 * Returns the calculated average rating
	 * @param {Array} the array that holds the ratings
	 * @return {Number} a number rounded to one decimal
	 */		
	var _calcAverageRating = function(ratings){
		//console.log(_getAverage(_getArraySum(ratings), ratings.length));
		return Math.round(_getAverage(_getArraySum(ratings), ratings.length)*10)/10;
	};

	/**
	 * Divides  x with y
	 */		
	var _getAverage = function(x, y){
		return x/y;
	};

	/**
	 * Returns the sum of an array
	 * @param {Array} array - the array to process
	 * @return {Array} the processed array
	 */		
	var _getArraySum = function(array){
		return array
		.reduce(function(previous, current) {
			return previous + current;
		}, 0);	
	};

	// Public pointers to functions
	return {
		toString: toString,
		getTheID: getTheID,
		setRating: setRating,
		getGenres: getGenres,
		getAverageRating: getAverageRating,
		init: init
    };
}();

/*------------------------------------------------------------------------- 
								Usage examples
/*-----------------------------------------------------------------------*/
console.log('-----Usage Examples-----');

/**
 *
 */
var testMovieFunctions = function(){

	// We can create new instances of the movie
	// new Movie(title, year, genres, ratings, poster, contentRating, duration, releaseDate)
	var rougeOne = new Movie('Star Wars - Rouge One', 2016, ['Action', 'Adventure', 'Science Fiction'], [1, 3], '',  '11', 'PT133M');
	var trainspotting2 = new Movie('T2 Trainspotting', 2017, ['Drama'], [1, 3, 7, 10], '',  'R', 'PT117M');
	var theShack = new Movie('The Shack', 2017, ['Drama', 'Fantasy'], [1, 3, 7, 10, 9], '',  'PG-13', 'PT132M');

	// and then open our browser console to view the
	// output of the methods being called on the movie

	rougeOne.setRating(7);
	rougeOne.setRating(5);
	rougeOne.setRating(8);
	console.log(rougeOne.toString());
	//console.log(rougeOne);
	console.log(`Average rating for ${rougeOne.title}: ${rougeOne.getAverageRating()}`);
};
//testMovieFunctions();
