/*jshint esversion: 6 */
console.log('Movie - Revealing Prototype Pattern');

/**
 * Movie constructor - Revealing Prototype Pattern
 * @param {String} title - the tiltle of the movie
 * @param {Number} year - the release year
 * @param {Array} genres - an array(strings) of genre names
 * @param {Array} ratings - an array(wholenumbers 1-10) of ratings for the movie
 * @param {String} poster - url to the movie poster
 */
var Movie = function (title, year, genres, ratings, poster, contentRating, duration, releaseDate) {
	this.title = title;
	this.year = year;
	this.contentRating = contentRating;
	this.duration = duration;
	this.genres = genres;
	this.releaseDate = releaseDate;
	this.ratings = ratings;
	this.poster = poster;
};

/**
 * 
 * 
 */
Movie.prototype = function(){
	var toString = function(){
		return `Movie: ${this.title}, Year: ${this.year}, Genres: ${this.genres}`;
	};
	var setRating = function(rating){
		this.ratings.push(rating);
	};
	var getRating = function(){
		return _getAverageRating(this.ratings);	
	};
	var _getAverageRating = function(ratings){
		//console.log(_getAverage(_getArraySum(ratings), ratings.length));
		return Math.round(_getAverage(_getArraySum(ratings), ratings.length)*10)/10;
	};
	var _getAverage = function(x, y){
		return x/y;
	};
	var _getArraySum = function(array){
		return array
		.reduce(function(previous, current) {
			return previous + current;
		}, 0);	
	};

	return {
		toString: toString,
		setRating: setRating,
		getRating: getRating
	};
}();
 
// Usage:
// We can create new instances of the movie
// new Movie(title, year, genres, ratings, poster, contentRating, duration, releaseDate)
var rougeOne = new Movie('Star Wars - Rouge One', 2016, ['Action', 'Adventure', 'Science Fiction'], [1, 3], '',  '11', 'PT133M');
var trainspotting2 = new Movie('T2 Trainspotting', 2017, ['Drama'], [1, 3, 7, 10], '',  'R', 'PT117M');
var theShack = new Movie('The Shack', 2017, ['Drama', 'Fantasy'], [1, 3, 7, 10], '',  'PG-13', 'PT132M');
// and then open our browser console to view the
// output of the methods being called on the movie
rougeOne.setRating(7);
rougeOne.setRating(5);
rougeOne.setRating(8);
console.log(rougeOne.toString());
//console.log(rougeOne);
console.log(rougeOne.getRating());
