console.log('---Main---');

/*-------------------------------------------------------------------------
					Data fetching and JSON parsing		
--------------------------------------------------------------------------*/

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
 * Creates Movie objects from an array of JSON-data and adds to movieDatabase
 * This is main 'database' that we manipulate and add new movies to
 * @param {array} arr - the array to parse
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
 * Call the append function and get populate genre filters with values from database
 */
var onJSONCallback = function(movieDatabase){
	//testFunctions(movieDatabase);
	appendMovies(utils.sortObjectsByKey(movieDatabase.getMovies(), 'title'), 'movieContainer');
	getGenreFilters(movieDatabase.getMovies());
};


/*-------------------------------------------------------------------------
					DOM appending funcions	
--------------------------------------------------------------------------*/
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
		var poster = movie.poster || '' ? 'img/' + movie.poster : 'http://placehold.it/340x500/95a5a6/95a5a6';
		//console.log('titel: ' + movie.title + ' år: ' + movie.year);
	  	movieList += 	`<div class="col-lg-2 col-sm-3 col-6 movie-item" data-title="${movie.title}">
	  						<div class="mb-5">
			  					<div class="responsive-poster mb-3">
									<div class="responsive-poster-item">
										<img src="${poster}" class="figure-img img-fluid" alt="">
									</div>
									<div class="btn-group movie-update"> 
										<!-- <a href="#" class="btn btn-success btn-sm btn-rate-movie" data-title="${movie.title}">Rate</a> -->
										<a href="#" class="btn btn-success btn-sm btn-edit-genres" data-title="${movie.title}">Edit Genres</a>
									</div>										
								</div>
								<h6>${movie.title} <small>(${movie.year})</small></h6>
					                <div class="rating">
					                  <div class="d-flex justify-content-end">
					                    <div class="mr-auto">
					                      <small>Rating</small>
					                    </div
				                      	<div>
					                        <small><span class="text-yellow">${movie.averageRating}</span><span class="text-faded">/10</span>
					                        </small>
				                      	</div>
	                                 <div class="progress">
	  									<div class="progress-bar bg-yellow" style="width: ${movie.averageRating * 10}%" role="progressbar" aria-valuenow="${movie.averageRating * 10}" aria-valuemin="0" aria-valuemax="100"></div>
									</div>
								</div>
							</div>
						</div>`;
						
	});
	movieList += '</div>';
	targetDiv.innerHTML = movieList;
	addMovieBtnHandlers();
	utils.columnConform('.movie-item h6');
};

/**
 * ------------------------------------------------------------------------
 * Event handling for movie editing buttons
 * ------------------------------------------------------------------------
*/

/**
 * Add eventhandlers for single edit movie buttons
 */
var addMovieBtnHandlers = function(){
	//event.preventDefault();
    Array.prototype.slice.call(document.getElementsByClassName('btn-rate-movie'))
    .forEach(function(item) {
		//console.log(item.dataset.title);
		item.addEventListener('click', rateBtnClickHandler, false);
    }); 	

    Array.prototype.slice.call(document.getElementsByClassName('btn-edit-genres'))
    .forEach(function(item) {
		//console.log(item.dataset.title);
		item.addEventListener('click', editGenreBtnClickHandler, false);
    }); 
};

/**
 * Event handler for rate buttons
 */
var rateBtnClickHandler = function(event){
	event.preventDefault();
	console.log(this.dataset.title);
	console.log('function for add rating');
};

/**
 * Event handler for edit genre buttons
 */
var editGenreBtnClickHandler = function(event){
	event.preventDefault();	
	console.log(this.dataset.title);
	console.log('function for edit genres');
};

/**
 * ------------------------------------------------------------------------
 * Genre filter buttons
 * ------------------------------------------------------------------------
*/

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
        buttonGroup += `<button type="button" value="${item}" class="btn btn-outline-success mb-3 mr-3 ${key}-filter">${item}</button>`;
    });
    buttonGroup += `</div>`;
    //console.log(buttonGroup);
    document.getElementsByClassName(target)[0].innerHTML = buttonGroup;
    addFilterButtonEventListeners(`${key}-filter`, filterBtnOnClick);
};

/**
 * ------------------------------------------------------------------------
 * Event handlers for genre filter buttons
 * ------------------------------------------------------------------------
*/

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
 * ------------------------------------------------------------------------
 * Form handling
 * ------------------------------------------------------------------------
*/

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
 * ------------------------------------------------------------------------
 *  Modal functions
 * ------------------------------------------------------------------------
*/

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
 * ------------------------------------------------------------------------
 * Some junk test functions
 * ------------------------------------------------------------------------
*/

/**
 *
 */
var testFunctions = function(movieDatabase){
	console.log('Movies in genre Crime');
	var moviesByGenres = movieDatabase.getMoviesByGenres(['Crime']);
	console.log(moviesByGenres);
  	
  	// date functions	
	var releaseDate = movieDatabase.getMovies()[0].releaseDate;
	console.log(utils.formatDate(new Date(releaseDate)));
	//console.log(new Date(releaseDate).getFullYear());
	var titleYearDate = new Date(movieDatabase.getMovies()[0].year);
	var titleYear = titleYearDate.getFullYear();
	console.log(titleYear);

	var poster = movieDatabase.getMovies()[0].poster;
	var content = document.getElementsByClassName('content')[0];
	content.innerHTML = `<img src="img/${poster}">`;

	console.log(utils.sortArray(movieDatabase.getMoviesPropertyList('title')));

};

/**
 * ------------------------------------------------------------------------
 * Init
 * ------------------------------------------------------------------------
*/

getMoviesFromJSON('https://attilac.github.io/movie-database//js/json/top-rated-movies-01.json');
//getMoviesFromJSON('/js/json/top-rated-movies-02.json');
//getMoviesFromJSON('/js/json/top-rated-indian-movies-01.json');
//getMoviesFromJSON('/js/json/top-rated-indian-movies-02.json');
//getMoviesFromJSON('/js/json/movies-coming-soon.json');
//getMoviesFromJSON('/js/json/movies-in-theaters.json');

var addMovieBtn = document.getElementById('addMovie');
addMovieBtn.addEventListener('click', launchCreateMovieModal, false);




