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
 * Fetch all movies from JSON file
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
			parseJSON(json);
			//return json;
		});
};

/**
 * Skapa en array med Movie objekt från en JSON-array och lägg till i movieDatabase
 * @param {array} arr - arrayen att parsa 
 */
var parseJSON = function(arr){
    for(var i = 0; i < arr.length; i++) {
		var movie = new Movie(arr[i].title,
				Number(arr[i].year),
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
 	onJSONCallback(movieDatabase);
};

/**
 * Callback for parseJSON
 */
var onJSONCallback = function(movieDatabase){
	//testFunctions(movieDatabase);
	appendMovies(utils.sortObjectsByKey(movieDatabase.getMovies(), 'title'), 'movieContainer');
	getGenreFilters(movieDatabase.getMovies());
};

/**
 * Append movies to DOM
 * @param {Array} movies
 * @param {String} target - the ID of the element to append to
 */
var appendMovies = function(movies, target){
	var targetDiv = document.getElementById(target);	
	//console.log(typeof(targetDiv));
	var movieList = '<div class="row">';
	movies.forEach(function(movie) {
		//console.log('titel: ' + movie.title + ' år: ' + movie.year);

	  	movieList += 	`<div class="col-lg-2 col-sm-3" data-title="${movie.title}">
	  						<div class="mb-3">
			  					<div class="responsive-poster mb-2">
									<div class="responsive-poster-item">
										<img src="img/${movie.poster}" class="figure-img img-fluid" alt="">
									</div>
								</div>
								<h6>${movie.title} <small>(${movie.year})</small></h6>
								<p><small>${movie.averageRating} / 10</small></p>
								<!--
								<div class=""> 
									<a href="#" class="btn btn-danger btn-sm btn-update mb-3" data-title="${movie.title}">Uppdatera</a>
									<a href="#" class="btn btn-warning btn-sm btn-delete mb-3" data-title="${movie.title}">Ta bort</a>
								</div>
								-->
							</div>
						</div>`;
						
	});
	movieList += '</div>';
	targetDiv.innerHTML = movieList;
	//addMovieBtnHandlers();
};

/**
 * Gets genres from database and populates buttons and checkboxes
 */
var getGenreFilters = function() {
	// Get genres from database 
	var moviePropertyGenres = movieDatabase.getMoviesPropertyList('genres');
	var genres = utils.sortArray(utils.getUniqueArray(utils.getConcatArray(moviePropertyGenres)));

	// Populate checkboxes with genres
	var genreCheckboxes = document.getElementById('genreCheckboxes');
	genreCheckboxes.innerHTML = populateGenreCheckboxes(genres);
	//console.log(utils.sortArray(utils.getUniqueArray(utils.getConcatArray(genres))));

	// Populate buttons with genres
	appendGenreFilterButtons(genres, 'genre-buttons', 'genre');
};

/**
 * Appends a group of filter buttons to the DOM
 * @param {Array} array - an array
 * @param {String} target - the element to append to
 * @param {String} key - name of the filter property
 */
var appendGenreFilterButtons = function(array, target, key){
    //console.log(Array.isArray(array));
    var buttonGroup = `<div class="filter-button-group" role="group" aria-label="filter-by-genre">`;
    array
    .forEach(function(item) {
        buttonGroup += `<button type="button" value="${item}" class="btn btn-outline-primary mb-3 mr-3 ${key}-filter">${item}</button>`;
    });
    buttonGroup += `</div>`;
    //console.log(buttonGroup);
    document.getElementsByClassName(target)[0].innerHTML = buttonGroup;
    addFilterButtonEventListeners(`${key}-filter`, filterBtnOnClick);
};

/**
 * Adds eventlisteners to buttons
 * @param {String} - the classname to apply the eventlisteners to
 * @param {Function} - the callback function
 */
var addFilterButtonEventListeners = function(className, functionName){
    //console.log(typeof(functionName));
    Array.from(document.getElementsByClassName(className))
    .forEach(function(item) {
        //console.log(item);
        item.addEventListener('click', functionName, false);
    });
};

/**
 * Click handler for filterbuttons
 * @param {Event} event - the event that was triggered
 */
var filterBtnOnClick = function(event){
    event.preventDefault();
    var activeList = [];
    if($(this).hasClass('active')){
        this.classList.toggle('active');
    } else {
        this.classList.toggle('active'); 
    }
    Array.prototype.slice.call(document.getElementsByClassName('filter-button-group')[0].getElementsByClassName('active'))
    .forEach(function(item) {
    	//console.log(item.value);
    	activeList.push(item.value);
    }); 
    //console.log(activeList);
    if(activeList.length > 0){
    	appendMovies(utils.sortObjectsByKey(movieDatabase.getMoviesByGenres(activeList), 'title'), 'movieContainer');
    } else {
 		appendMovies(utils.sortObjectsByKey(movieDatabase.getMovies(), 'title'), 'movieContainer');   	
    }
};

/**
 * Get input fields values
 * @return {Object} movie - a Movie object
 */
var getFormInputValues = function(){

	// get input values from form
	var title = ($('#movieTitle').val() || '' ? $('#movieTitle').val() : 'Titel');
	var year = ($('#titleYear').val() || '' ? $('#titleYear').val() : '');
	var poster = ($('#moviePoster').val() || '' ? $('#moviePoster').val() : '');
	var storyline = ($('#movieStoryline').val() || '' ? $('#movieStoryline').val() : '');

	// get array of checked checkboxes
	var selectedGenres = getCheckedInputValues();
	//console.log(selectedGenres);

	// Create Movie object
	var movie = new Movie(title, year, selectedGenres, [], poster,  '', '', '', 0, '', storyline, [], 0, '');
	//console.log(movie);	
	return movie;			
};						

/**
 * Returns an array of checked checkboxes
 * @return {Array} checkedValues - an array of values
 */
var getCheckedInputValues = function(){
	var checkboxes = Array.prototype.slice.call(document.getElementsByTagName('input'));
	var checkedValues = [];
	checkboxes.forEach(function(checkbox){
	    if (checkbox.type === 'checkbox' && checkbox.checked) {
	        // get value
	        checkedValues.push(checkbox.value);       
	    }
	});
	//console.log(checkedValues);
	return checkedValues;
};

/**
 * Returns a HTML chunk with checkboxes
 * @param {Array} genres - an array with values for the checkboxes
 * @return {String} checkboxes - a HTML string with checkboxes
 */
var populateGenreCheckboxes = function(genres){
	//console.log(genres);
	var checkboxes = '';
	genres
	.forEach(function(genre, index){
		//console.log(genre);
		checkboxes += `<div class="form-check form-check-inline">
					<label class="form-check-label">
    				<input class="form-check-input" type="checkbox" id="inlineCheckbox${index}" value="${genre}"> ${genre}</label></div>`;
	});
	//console.log(typeof(checkboxes));
	return checkboxes;
};

/**
 * Clears form input values
 */
var clearFormInputs = function() {
	$('#movieFormModal').find('input, textarea').val('');
	var submitBtn = document.getElementById('movieFormSubmit');
	submitBtn.removeEventListener('click', submitMovieValues, false);
};

/**
 * Event handler for submitbutton in add new movie-form
 * 
 */
var submitMovieValues = function(event) {
	event.preventDefault();
	var postData = getFormInputValues();
	console.log('Posting album to API..');
	console.log(postData);
	movieDatabase.addMovie(postData);
	appendMovies(utils.sortObjectsByKey(movieDatabase.getMovies(), 'title'), 'movieContainer');
	hideModal();
};

/**
 * Event handler for #addMovieBtn
 *
 */
var launchCreateMovieModal = function(event){
	event.preventDefault();
	var submitBtn = document.getElementById('movieFormSubmit');
	submitBtn.addEventListener('click', submitMovieValues, false);
	$('#movieFormModal').modal();

};

/**
 * Hides modal
 *
 */
var hideModal = function(){
	$('#movieFormModal').modal('hide');
};

/**
 * Callback on modal hidden
 */
$('#movieFormModal').on('hidden.bs.modal', function (e) {
	clearFormInputs();
});

/**
 *
 */
var testFunctions = function(movieDatabase){
	console.log('Movies in genre Crime');
	var moviesByGenres = movieDatabase.getMoviesByGenres(['Crime']);
	console.log(moviesByGenres);
  	
  	// date functions	
	var releaseDate = movieDatabase.getMovies()[0].releaseDate;
	console.log(formatDate(new Date(releaseDate)));
	//console.log(new Date(releaseDate).getFullYear());
	var titleYearDate = new Date(movieDatabase.getMovies()[0].year);
	var titleYear = titleYearDate.getFullYear();
	console.log(titleYear);

	var poster = movieDatabase.getMovies()[0].poster;
	var content = document.getElementsByClassName('content')[0];
	content.innerHTML = `<img src="img/${poster}">`;

	console.log(utils.sortArray(movieDatabase.getMoviesPropertyList('title')));

};

getMoviesFromJSON('/js/json/top-rated-movies-01.json');
//getMoviesFromJSON('/js/json/top-rated-movies-02.json');
//getMoviesFromJSON('/js/json/top-rated-indian-movies-01.json');
//getMoviesFromJSON('/js/json/top-rated-indian-movies-02.json');
//getMoviesFromJSON('/js/json/movies-coming-soon.json');
//getMoviesFromJSON('/js/json/movies-in-theaters.json');

var addMovieBtn = document.getElementById('addMovie');
addMovieBtn.addEventListener('click', launchCreateMovieModal, false);




