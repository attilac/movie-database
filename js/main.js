/*jshint esversion: 6 */
console.log('---Main---');

/**
 * ------------------------------------------------------------------------
 *  	Functions dealing with to process data and appending to the DOM
 *      Maybe these could be separated as Controller and View modules,
 *      and the database can serve as Model. 
 * ------------------------------------------------------------------------
*/

/*-------------------------------------------------------------------------
					Data fetching and JSON parsing		
--------------------------------------------------------------------------*/

/**
 * Fetch all movies from JSON file
 * @param {String} dataurl - the url to the JSON file
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
    for(let i = 0; i < arr.length; i++) {
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
				arr[i].posterurl,
				[i]);
		movieDatabase.addMovie(movie);
    }
 	onJSONCallback(movieDatabase);
};

/**
 * Callback for parseJSON
 * Call the append function and populate genre filters with values from database
 */
var onJSONCallback = function(movieDatabase){
	//testFunctions(movieDatabase);
	movieDatabase.setSortOrder('DESC');
	movieDatabase.setSortBy('averageRating');
	appendMovies(utils.sortObjectsByKey(movieDatabase.getMovies(), movieDatabase.getSortBy(), movieDatabase.getSortOrder()), 'movieContainer');
	getGenreFilters(movieDatabase.getMovies());
	appendSortControllers('sort-controllers');
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
	let total = movieDatabase.getMovies().length;
	let currentTotal = movies.length;
	//console.log(typeof(targetDiv));
	var movieList = `<div class="info-strip mb-3">
						<small class="text-muted">Displaying ${currentTotal} of ${total} movies</small>
						</div>
						<div class="row">`;
	movies.forEach(function(movie) {
		var poster = movie.poster || '' ? 'img/' + movie.poster : 'http://placehold.it/340x500/95a5a6/95a5a6';
		//console.log('titel: ' + movie.title + ' år: ' + movie.year);
	  	movieList += 	`<div class="col-lg-2 col-sm-3 col-6 movie-item" data-id="${movie.id}">
	  						<div class="mb-5">
			  					<div class="responsive-poster mb-3">
									<div class="responsive-poster-item">
										<img src="${poster}" class="img-fluid" alt="">
									</div>
									<div class="movie-update">
									  <button type="button" class="btn btn-options" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
									    <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
									  </button>
									  <div class="dropdown-menu">
										<a href="#" class="dropdown-item btn-edit-genres" data-id="${movie.id}">Edit Genres</a>										    
									  </div>
								 	</div>
								</div>

								<div class="movie-item-header mb-3">
									<h6 class="movie-title mb-1">${movie.title} <small>(${movie.year})</small></h6>
									<!-- <small class="genres text-muted">${movie.genres}</small> -->
									${getGenreLinksFromList(movie.genres)}
								</div>

				                <div class="rating-container">
				                  	<div class="rating-label d-flex justify-content-end">
				                    	<div class="mr-auto">
				                      		<small>Rate</small>
				                    	</div
		                      		<div class="rating-text">
				                        <small>		
				                        	<i class="fa fa-star text-yellow"></i>			                        	
				                        	<span class="text-yellow average-rating">${movie.averageRating}</span>
				                        	<span class="text-faded">/10</span>
				                        </small>
		                      		</div>
		                      		<div class="progress average-slider">
		                      			<div class="progress-bar bg-yellow" role="progressbar" aria-valuenow="${movie.averageRating * 10}" aria-valuemin="0" aria-valuemax="100" style="width: ${movie.averageRating * 10}%"></div>
		                      		</div>
									<div id="ratingSlider-${movie.id}" class="dragdealer progress rating-slider">
										<div class="handle">											
										</div>
										<div class="progress-bar bg-primary" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax="100">
										</div>
									</div>
								</div>
							</div>
						</div>`;
				

	});

	movieList += '</div>';
	targetDiv.innerHTML = movieList;
	addMovieBtnHandlers();
	addMovieGenreLinkHandlers();
	addRatingSliderHandlers();

	utils.columnConform('.movie-item-header');
	utils.columnConform('.movie-title');

	// Some test junk. Remove Me
	/*
	console.log('Least rated Movie: ' + movieDatabase.getLeastRatedMovie().title + ' Rating: ' + movieDatabase.getLeastRatedMovie().averageRating);
	console.log('Top rated Movie: ' + movieDatabase.getTopRatedMovie().title + ' Rating: ' + movieDatabase.getTopRatedMovie().averageRating);
	console.log('Movies from year 2017');
	console.log(movieDatabase.getMoviesByKey('year', 2016));
	*/
};

/**
 * 
 */
var addRatingSliderHandlers = function(){
	Array.prototype.slice.call(document.getElementsByClassName('rating-container'))
	.forEach(function(slider){
		slider.addEventListener('mouseenter', sliderWrapperOnMouseEnter, false);
		slider.addEventListener('mouseleave', sliderWrapperOnMouseLeave, false);
	});
};

/**
 * 
 */
var sliderWrapperOnMouseEnter = function(){
	//console.log(this.querySelectorAll('.rating-slider')[0] instanceof Dragdealer);
	appendRatingSlider(this);
};

/**
 * 
 */
var sliderWrapperOnMouseLeave = function(){
	//console.log(this.querySelectorAll('.rating-slider')[0]);
	//$(this).find('.average-rating').removeClass('user-rating');
	//$(this).find('.rating-slider').hide();
	//$(this).find('.average-slider').show();

	/*
	this.querySelectorAll('.average-rating')[0].classList.remove('user-rating');
	this.querySelectorAll('.rating-slider')[0].style.display = 'none';
	this.querySelectorAll('.average-slider')[0].style.display = 'block';
	*/
};

/**
 * 
 */
var appendRatingSlider = function(sliderWrapper){
	//$(sliderWrapper).find('.average-rating').addClass('user-rating');
	//$(sliderWrapper).find('.average-slider').hide();
	//$(sliderWrapper).find('.rating-slider').show();

	sliderWrapper.querySelectorAll('.average-rating')[0].classList.add('user-rating');
	//sliderWrapper.querySelectorAll('.average-slider')[0].style.display = 'none';
	//sliderWrapper.querySelectorAll('.rating-slider')[0].style.display = 'block';

    [].map.call(sliderWrapper.querySelectorAll('.text-yellow'), function(el) {       
        el.classList.toggle('text-yellow');
        el.classList.toggle('text-primary');
    });

	if(!sliderWrapper.classList.contains('active')){
		sliderWrapper.classList.add('active');
		var rateSlider = new Dragdealer(sliderWrapper.querySelectorAll('.rating-slider')[0].id, {
			animationCallback: function(x, y) {
				sliderWrapper.querySelectorAll('.rating-slider .progress-bar')[0].style.left = Math.round(x * 100)+'%';
				sliderWrapper.parentNode.querySelectorAll('.rating-container .user-rating')[0].textContent = Math.round(x * 10);
				//console.log(this);
				//$('#' + sliderWrapper.id + ' .progress-bar').css('left', Math.round(x * 100)+'%');
				//$('#' + sliderWrapper.id).parent('.rating-container').find('.user-rating').text(Math.round(x * 10));
			} 
		});
		console.log(rateSlider instanceof Dragdealer);
	}
};

/**
 * Updates the view on movie after editing
 */
var updateMovieInstanceView = function(){
	//console.log(isMovieInActiveGenre());
	if(isMovieInActiveGenre() || movieDatabase.currentGenres.length === 0){
		//console.log('Movie in current genre or no genre selected. Update the DOM');
		
		//find the movie in DOM - jQuery version
		//$(getMovieInstance(movieDatabase.getCurrentMovie().id))
		//.find('.movie-genre-list')
		//.replaceWith(getGenreLinksFromList(movieDatabase.getCurrentMovie().genres));

		//find the movie in DOM  - vanilla JS
		getMovieInstance(movieDatabase.getCurrentMovie().id)
		.querySelectorAll('.movie-genre-list')[0]
		.outerHTML = getGenreLinksFromList(movieDatabase.getCurrentMovie().genres); // replace movie genre-list with updated for movieDatabase

		// add eventhandlers for genre-links
		addMovieGenreLinkHandlers();
	}else{
		//console.log('Movie not in current genre. Remove from DOM');
		//console.log(getMovieInstance(movieDatabase.getCurrentMovie().id));
		var currentMovie = getMovieInstance(movieDatabase.getCurrentMovie().id);
		//console.log(typeof(currentMovie));
		currentMovie.parentNode.removeChild(currentMovie);
	}
};

/**
 * Gets a movie instance in the DOM-tree by data-attribute
 * @param {String} id - the data-attribute to filter by
 * @return {Object} Nodelist
 */
var getMovieInstance = function(id){
	//console.log(typeof(document.querySelectorAll(`[data-id="${id}"]`)));
	return document.querySelectorAll(`[data-id="${id}"]`)[0];
};

/**
 * Check if movie instance is in one of the active genres
 * @return {Boolean} hasGenre
 */
var isMovieInActiveGenre = function(){
	var hasGenre = false;
	// executed for each active genre
    movieDatabase.currentGenres
    .forEach(function(currentGenre) { 
    	//console.log(currentGenre);
    	// iterate over the current movies genres
    	movieDatabase.getCurrentMovie().genres
    	.forEach(function(movieGenre) {
    		//console.log(currentGenre.indexOf(movieGenre) >= 0);	
            if (currentGenre.indexOf(movieGenre) >= 0) {
                //console.log('in genre list'); // if this movie has this genre
                hasGenre = true;
            }
    	});
    	//console.log(hasGenre);
    }); 
	return hasGenre;
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
    Array.prototype.slice.call(document.getElementsByClassName('btn-rate-movie'))
    .forEach(function(item) {
		item.addEventListener('click', rateBtnClickHandler, false);
    }); 	

    Array.prototype.slice.call(document.getElementsByClassName('btn-edit-genres'))
    .forEach(function(item) {
		item.addEventListener('click', editGenreBtnClickHandler, false);
    }); 

};

/**
 * Add eventhandlers for genrelist buttons
 */
var addMovieGenreLinkHandlers = function(){
    Array.prototype.slice.call(document.getElementsByClassName('genre-link'))
    .forEach(function(item){
    	item.addEventListener('click', genreBtnClickHandler, false);
    });
};

/**
 * Event handler for rate buttons
 */
var rateBtnClickHandler = function(event){
	event.preventDefault();
	console.log(this.dataset.id);
	movieDatabase.setCurrentMovie(Number(this.dataset.id));
	console.log('function for adding rating');
};

/**
 * Event handler for edit genre buttons
 */
var editGenreBtnClickHandler = function(event){
	event.preventDefault();	
	movieDatabase.setCurrentMovie(Number(this.dataset.id));
	//console.log(this.dataset.id);
	//console.log(movieDatabase.getCurrentMovie());
	launchUpdateMovieModal();
	//console.log(movieDatabase.getCurrentMovie());
	//console.log(`function for editing the genres of ${movieDatabase.getCurrentMovie().title}`);
};

/**
 * Event handler for genre filter button on single movies
 */
var genreBtnClickHandler = function(event){
	event.preventDefault();
	//console.log($(this).children('small')[0].textContent);
	movieDatabase.currentGenres = [$(this).children('small')[0].textContent];
	//console.log(movieDatabase.currentGenres);
	genreBtnsOnAppChange();
	appendMovies(utils.sortObjectsByKey(movieDatabase.getMoviesByGenres(movieDatabase.currentGenres), movieDatabase.getSortBy(), movieDatabase.getSortOrder()), 'movieContainer');
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
 * 
 * @param {Array} genres - array of genres
 */
var getGenreLinksFromList = function(genres){
	genreList = '<ul class="list-inline movie-genre-list">';
	genres
	.forEach(function(genre){
		genreList += `<li class="list-inline-item movie-genre-item"><a class="genre-link" href="#"><small>${genre}</small></a></li>`;
	});
	return genreList + '</ul>';
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
    movieDatabase.currentGenres = [];
    if($(this).hasClass('active')){
        this.classList.toggle('active');
    } else {
        this.classList.toggle('active'); 
    }
    Array.prototype.slice.call(document.getElementsByClassName('filter-button-group')[0].getElementsByClassName('active'))
    .forEach(function(item) {
    	//console.log(item.value);
    	movieDatabase.currentGenres.push(item.value);
    }); 
    //console.log(movieDatabase.currentGenres);
    if(movieDatabase.currentGenres.length > 0){
    	appendMovies(utils.sortObjectsByKey(movieDatabase.getMoviesByGenres(movieDatabase.currentGenres), movieDatabase.getSortBy(), movieDatabase.getSortOrder()), 'movieContainer');
    } else {
 		appendMovies(utils.sortObjectsByKey(movieDatabase.getMovies(), movieDatabase.getSortBy(), movieDatabase.getSortOrder()), 'movieContainer');   	
    }

	document.getElementsByClassName('current-genres')[0].innerHTML =  movieDatabase.currentGenres.length > 0 ?  ' in ' + movieDatabase.currentGenres: '' ;   
	    
};

/**
 * Reset selected genre buttons and the .current-genres text
 * 
 */
var resetFilterBtns = function(){
	movieDatabase.currentGenres = [];
	Array.prototype.slice.call(document.getElementsByClassName('genre-filter'))
	.forEach(function(btn){
		btn.classList.remove('active');
		//console.log(btn.classList);
	});
	document.getElementsByClassName('current-genres')[0].innerHTML = '';
};

/**
 * Update filter buttons
 */
var genreBtnsOnAppChange = function(){
    Array.prototype.slice.call(document.getElementsByClassName('genre-filter'))
    .forEach(function(item) {
    	item.classList.remove('active');
    	if(movieDatabase.currentGenres[0] === item.value){
    		//console.log(item.value);
		    if(! item.classList.contains('active')){
		        item.classList.toggle('active');
		    }
    	}
    }); 
    document.getElementsByClassName('current-genres')[0].innerHTML = movieDatabase.currentGenres.length > 0 ? ' in ' + movieDatabase.currentGenres : '';	
};

/**
 * ------------------------------------------------------------------------
 *  Sort dropdown selects
 * ------------------------------------------------------------------------
*/

/**
 * Appends selects for sorting
 * @param {String} target - the element to append to 
 */
var appendSortControllers = function(target){
	var targetDiv = document.getElementsByClassName(target)[0];	
	// Sort by 
	sortControllers = `<label class="mr-2 text-muted" for="sortBySelect">Sort By</label>
						<select id="sortBySelect" class="form-control d-inline mr-3 sort-key-group sort-select">
							<option disabled>Sort By</option>`;

	movieDatabase.getSortByList().forEach(function(sortBy) {
		let selected = movieDatabase.getSortBy() === sortBy.key ? 'selected': '';
    	sortControllers += `<option ${selected} class="sort-key-item sort-item" value="${sortBy.key}">${sortBy.displayName}</option>`;
    });	
    sortControllers +=	'</select>'; // end sort by

    // Sort order 
	sortControllers += `<label class="mr-2 text-muted" for="sortOrderSelect">Order</label>
						<select id="sortOrderSelect" class="form-control d-inline sort-order-group sort-select">
							<option disabled>Sort Order</option>`;
	movieDatabase.getSortOrderList()
	.forEach(function(sortOrder) {
		let selected = movieDatabase.getSortOrder() === sortOrder.key ? 'selected': '';
    	sortControllers += `<option ${selected} class="sort-key-item sort-item" value="${sortOrder.key}">${sortOrder.displayName}</option>`;
	});
	sortControllers +=	'</select>'; // end sort order
	//console.log(sortControllers);
	targetDiv.innerHTML = sortControllers;
	addSortDropdownHandlers();
};

/**
 * Add eventhandlers for sort dropdown selects
 */
var addSortDropdownHandlers = function(){
    Array.prototype.slice.call(document.getElementsByClassName('sort-select'))
    .forEach(function(item) {
		item.addEventListener('change', sortDropdownOnChange, false);
    }); 	
};

/**
 * ------------------------------------------------------------------------
 * Event handlers for sort controls
 * ------------------------------------------------------------------------
*/

/**
 * Change handler for sort dropdown selects
 */
var sortDropdownOnChange = function(){

	// Set sort by value in movieDatabase 
    if($(this).hasClass('sort-key-group')){ 	
    	//console.log(this.options[this.selectedIndex].value);
    	movieDatabase.setSortBy(this.options[this.selectedIndex].value);		
    } 

    // Set sort order value in movieDatabase 
    if($(this).hasClass('sort-order-group')){	
    	//console.log(this.options[this.selectedIndex].value); 
		movieDatabase.setSortOrder(this.options[this.selectedIndex].value);
    }

    // Call appendMovies
    if(movieDatabase.currentGenres.length > 0){
    	appendMovies(utils.sortObjectsByKey(movieDatabase.getMoviesByGenres(movieDatabase.currentGenres), movieDatabase.getSortBy(), movieDatabase.getSortOrder()), 'movieContainer');
    } else {
 		appendMovies(utils.sortObjectsByKey(movieDatabase.getMovies(), movieDatabase.getSortBy(), movieDatabase.getSortOrder()), 'movieContainer');   	
    }

};

/**
 * ------------------------------------------------------------------------
 * Init app genre filters and sort selects
 * ------------------------------------------------------------------------
*/

/**
 * Init app genre filters and sort selects
 */
var updateAppControllers = function(){
 	sortSelectOnAppChange();
};

/**
 * Update sort dropdown selects
 */
var sortSelectOnAppChange = function(){
    Array.prototype.slice.call(document.getElementsByClassName('sort-key-group'))
    .forEach(function(item) {
    	Array.prototype.slice.call(item.options)
    	.forEach(function(option) {
    		//console.log(option.value);
    		option.selected = option.value === movieDatabase.getSortBy() ? true : false;
    	});	    		
    });

    Array.prototype.slice.call(document.getElementsByClassName('sort-order-group'))
    .forEach(function(item) {
    	Array.prototype.slice.call(item.options)
    	.forEach(function(option) {
    		//console.log(option.selected);
    		option.selected = option.value === movieDatabase.getSortOrder() ? true : false;
    	});	    		
    });
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
var getAddFormVals = function(){
	// get input values from form
	var title = ($('#movieTitle').val() || '' ? $('#movieTitle').val() : 'Default Title');
	var year = ($('#titleYear').val() || '' ? $('#titleYear').val() : '2017');
	var poster = ($('#moviePoster').val() || '' ? $('#moviePoster').val() : '');
	var storyline = ($('#movieStoryline').val() || '' ? $('#movieStoryline').val() : '');

	// get array of checked checkboxes
	var selectedGenres = getCheckedInputValues();
	//console.log(selectedGenres);
	var movieID = movieDatabase.getMovies().length-1 + 1;
	//console.log(typeof(movieID));

	// Create Movie object
	var movie = new Movie(title, year, selectedGenres, [], poster,  '', '', '', 0, '', storyline, [], 0, '', movieID);
	//console.log(movie);	
	return movie;			
};	

/**
 *
 * 
 */
var getUpdateFormVals = function(){
	return getCheckedInputValues();		
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
var populateGenreCheckboxes = function(genres, selectedGenres){
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
 * Get the genres for the current movie
 *
 */
var getGenresForCurrentMovie = function(genres){
	// Populate checkboxes with genres
	document.getElementById('genreCheckboxes').innerHTML = populateGenreCheckboxes(genres);
};

/**
 * Get the genres for all movies
 *
 */
var getGenresForMovies = function(){
	// Get genres from database 
	var moviePropertyGenres = movieDatabase.getMoviesPropertyList('genres');
	var genres = utils.sortArray(utils.getUniqueArray(utils.getConcatArray(moviePropertyGenres)));

	// Populate checkboxes with genres
	var genreCheckboxes = document.getElementById('genreCheckboxes');
	genreCheckboxes.innerHTML = populateGenreCheckboxes(genres);
};

/**
 * Checkes selected checkboxes
 * @param {Array} genres - the values to check
 */
var checkSelectedGenres = function(genres){
	var checkboxes = Array.prototype.slice.call(document.getElementsByTagName('input'));
	// iterate over checkboxes
	checkboxes.filter(function(checkbox) { 
	    	// iterate over genres array
	    	genres.map(function(genre) {
	            if (checkbox.value.indexOf(genre) >= 0) {
	            	//console.log(genre);
	                checkbox.checked = true; // if match check checkbox
	            }
	    	});
	    });   
};

/**
 * Clears form input values
 */
var clearFormInputs = function() {
	$('#movieFormModal').find('input, textarea').val('');
	var submitBtn = document.getElementById('movieFormSubmit');
	submitBtn.removeEventListener('click', submitAddNewForm, false);
	submitBtn.removeEventListener('click', submitUpdateForm, false);
};

/**
 * Event handler for submitbutton in add new movie-form
 * 
 */
var submitAddNewForm = function(event) {
	event.preventDefault();
	var postData = getAddFormVals();
	console.log('Posting movie to MovieDatabase');
	console.log(postData);

	movieDatabase.setSortBy('id');
	movieDatabase.setSortOrder('DESC');
	movieDatabase.addMovie(postData);

	movieDatabase.currentGenres = [];
	updateAppControllers();
	//resetFilterBtns();
	genreBtnsOnAppChange();

	appendMovies(utils.sortObjectsByKey(movieDatabase.getMovies(), movieDatabase.getSortBy(), movieDatabase.getSortOrder()), 'movieContainer');
	hideModal();
};

/**
 * Event handler for submitbutton in update movie-form
 * 
 */
var submitUpdateForm = function(event) {
	event.preventDefault();
	var postData = getUpdateFormVals();
	//console.log('Updating movie in MovieDatabase');
	movieDatabase.getCurrentMovie().genres = postData;
	updateMovieInstanceView();
	utils.columnConform('.movie-item-header');
	utils.columnConform('.movie-title');
	//movieDatabase.setCurrentMovie(0);
	hideModal();
};

/**
 * 
 */
var initUpdateForm = function(){
 	$('.group-movie-add').hide();
 	$('.modal-title').html('Update Genres for ' + movieDatabase.getCurrentMovie().title);
 	getGenresForMovies();
 	checkSelectedGenres(movieDatabase.getCurrentMovie().getGenres());
	var submitBtn = document.getElementById('movieFormSubmit');
	submitBtn.innerHTML = submitBtn.value = 'Update Movie Genres';
	submitBtn.addEventListener('click', submitUpdateForm, false);
};

/**
 * 
 */
var initAddNewForm = function(){
	$('.modal-title').html('Add new Movie');
	$('.group-movie-add').show();
	getGenresForMovies();
	var submitBtn = document.getElementById('movieFormSubmit');
	submitBtn.innerHTML = submitBtn.value = 'Add new Movie';
	submitBtn.addEventListener('click', submitAddNewForm, false);
};


/**
 * ------------------------------------------------------------------------
 *  Modal functions
 * ------------------------------------------------------------------------
*/

/**
 * Event handler for #addMovieBtn
 * Launch and init modal with 'add new' form
 */
var launchCreateMovieModal = function(event){
	event.preventDefault();
	initAddNewForm();
	$('#movieFormModal').modal();

};

/**
 * Launch and init modal with 'update' form
 *
 */
var launchUpdateMovieModal = function(){
	initUpdateForm();
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

getMoviesFromJSON('https://attilac.github.io/movie-database/js/json/top-rated-movies-01.json');
//getMoviesFromJSON('https://attilac.github.io/movie-database/js/json/top-rated-movies-02.json');
//getMoviesFromJSON('https://attilac.github.io/movie-database/js/json/top-rated-indian-movies-01.json');
//getMoviesFromJSON('https://attilac.github.io/movie-database/js/json/top-rated-indian-movies-02.json');
//getMoviesFromJSON('https://attilac.github.io/movie-database/js/json/movies-coming-soon.json');
//getMoviesFromJSON('https://attilac.github.io/movie-database/js/json/movies-in-theaters.json');

var addMovieBtn = document.getElementById('addMovie');
addMovieBtn.addEventListener('click', launchCreateMovieModal, false);





