/*jshint esversion: 6 */
console.log('View');

/**
 * Controller and View for MovieDatabase
 * Functions dealing with fetching data from the database, appending to the DOM
 * and delegate user actions to change/add and update data.
 * 
*/
var MovieView = (function() {

	/**
	 * Init
	 */
	var init = function(){
		getMoviesFromJSON('https://attilac.github.io/movie-database/js/json/top-rated-movies-01.json');
		//getMoviesFromJSON('https://attilac.github.io/movie-database/js/json/top-rated-movies-02.json');
		//getMoviesFromJSON('https://attilac.github.io/movie-database/js/json/top-rated-indian-movies-01.json');
		//getMoviesFromJSON('https://attilac.github.io/movie-database/js/json/top-rated-indian-movies-02.json');
		//getMoviesFromJSON('https://attilac.github.io/movie-database/js/json/movies-coming-soon.json');
		//getMoviesFromJSON('https://attilac.github.io/movie-database/js/json/movies-in-theaters.json');
		//getMoviesFromJSON('https://movie-db-fend16.herokuapp.com/movies/');

		var addMovieBtn = document.getElementById('addMovie');
		addMovieBtn.addEventListener('click', launchCreateMovieModal, false);
	};

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
	 	onJSONCallback();
	};

	/**
	 * Callback for parseJSON
	 * Call the append function and populate genre filters with values from database
	 */
	var onJSONCallback = function(){
		//testFunctions();
		movieDatabase.setSortOrder('DESC');
		movieDatabase.setSortBy('averageRating');
		
		document.getElementsByClassName('genre-buttons')[0].innerHTML = appendGenreFilterButtons(getGenreFilters(), 'genre');
	 	addFilterButtonEventListeners(`genre-filter`, filterBtnOnClick);

		document.getElementsByClassName('sort-controllers')[0].innerHTML = appendSortControllers();
		addSortDropdownHandlers();

	    document.getElementsByClassName('year-links')[0].innerHTML = appendTitleYearButtons(getAllTitleYears());
	    addFilterButtonEventListeners(`year-filter`, titleYearButtonOnClick);

		appendFilteredMovies();
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
		let total = movieDatabase.getMovies().length;
		let currentTotal = movies.length;
		//console.log(typeof(targetDiv));
		var movieList = `<div class="info-strip mb-3">
							<small class="text-muted">Displaying ${currentTotal} of ${total} movies</small>
							</div>
							<div class="row">`;
		movies.forEach(function(movie) {
			let poster = movie.poster || '' ? 'img/' + movie.poster : '';
			if(poster === ''){
				poster =  movie.posterurl || '' ? movie.posterurl : 'http://placehold.it/340x500/95a5a6/95a5a6';
			}
			//console.log('titel: ' + movie.title + ' år: ' + movie.year);

		  	movieList += 	`<div class="movie-item col-lg-2 col-sm-3 col-6 mb-5" data-id="${movie.id}">
			  					<div class="responsive-poster mb-3">
									<div class="responsive-poster-item">
										<img src="${poster}" class="img-fluid" alt="">
									</div>
								</div>

								<div class="movie-item-header mb-3 mr-3">
									<h6 class="movie-title mb-1">${movie.title} <small>(${movie.year})</small></h6>
									${appendGenreLinkList(movie.genres)}

									<div class="movie-update btn-group dropup">
									  <button type="button" class="btn btn-options" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
									    <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
									  </button>
									  <div class="dropdown-menu dropdown-menu-right">
										<a href="#" class="dropdown-item btn-edit-genres" data-id="${movie.id}">Edit Genres</a>										    
									  </div>
								 	</div>

								</div>

				                <div class="user-rating" Title="Users rated this ${movie.averageRating}/10 (${movie.ratings.length} votes) - click slider to rate">
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
		                      		<div class="rating-container">
			                      		<div class="progress average-slider">
			                      			<div class="progress-bar bg-yellow" role="progressbar" aria-valuenow="${movie.averageRating * 10}" aria-valuemin="0" aria-valuemax="100" style="width: ${movie.averageRating * 10}%"></div>
			                      		</div>
										<div id="ratingSlider-${movie.id}" class="dragdealer progress rating-slider">
											<div class="handle">											
											</div>
											<div class="progress-bar bg-primary" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax="100">
											</div>
										</div>
										<div class="rating-toolbar text-right py-2">
											<a class="btn btn-sm btn-secondary submit-rating" href="#" data-id="${movie.id}">Submit rating</a>
										</div>		
									</div>							
								</div>
							</div>`;
					

		});

		movieList += '</div>';
		return movieList;		
	};

	/**
	 * 
	 * 
	 */
	var appendFilteredMovies = function(){
		var targetDiv = document.getElementById('movieContainer');
		// Check if year is selected
		var movies = movieDatabase.getTitleYear() === 0 ? movieDatabase.getMovies() : movieDatabase.getMoviesByKey('year', movieDatabase.getTitleYear());
		// Check if genre is selected	
		targetDiv.innerHTML = movieDatabase.currentGenres.length > 0 ? 
			appendMovies(utils.sortObjectsByKey(movieDatabase.getMoviesByGenres(movieDatabase.currentGenres, movies), movieDatabase.getSortBy(), movieDatabase.getSortOrder())) : 
			appendMovies(utils.sortObjectsByKey(movies, movieDatabase.getSortBy(), movieDatabase.getSortOrder()));
	
		// add event handlers
		addMovieBtnHandlers();
		addGenreLinkHandlers();

		// make columns the same height
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

	/*-------------------------------------------------------------------------
						Eventhandlers	
	--------------------------------------------------------------------------*/

	/**
	 * Event handlers for Movie ui buttons
	 */
	var addMovieBtnHandlers = function(){
		// Event handlers for rating-slider container
		Array.prototype.slice.call(document.getElementsByClassName('rating-container'))
		.forEach(function(ratingContainer){
			ratingContainer.addEventListener('mouseenter', ratingContainerOnMouseEnter, false);
			ratingContainer.addEventListener('mouseleave', ratingContainerOnMouseLeave, false);
		});
		// submit btn
		Array.prototype.slice.call(document.getElementsByClassName('submit-rating'))
		.forEach(function(btn){
			btn.addEventListener('click', submitRatingOnClick, false);
		});

		// genre dropdown links
	    Array.prototype.slice.call(document.getElementsByClassName('btn-edit-genres'))
	    .forEach(function(item) {
			item.addEventListener('click', genreDropdownItemOnClick, false);
	    }); 		
	};

	/**
	 * Add eventhandlers for genrelist buttons
	 */
	var addGenreLinkHandlers = function(){
	    Array.prototype.slice.call(document.getElementsByClassName('genre-link'))
	    .forEach(function(item){
	    	item.addEventListener('click', genreLinkOnClick, false);
	    });
	};

	/*-------------------------------------------------------------------------
			Internal database functions				
	--------------------------------------------------------------------------*/

	/**
	 * Gets genres from database and populates buttons and checkboxes
	 */
	var getGenreFilters = function() {
		// Get genres from database 
		var moviePropertyGenres = movieDatabase.getMoviesPropertyList('genres');
		return utils.sortArray(utils.getUniqueArray(utils.getConcatArray(moviePropertyGenres)));
	};

	/**
	 * Gets all years from database
	 */
	var getAllTitleYears = function() {
		// Get genres from database 
		let titleYears = movieDatabase.getMoviesPropertyList('year');
		return utils.sortArray(utils.getUniqueArray(utils.getConcatArray(titleYears)));
	};

	/**
	 * Gets a movie instance in the DOM-tree by data-attribute
	 * @param {String} id - the data-attribute to filter by
	 * @return {Object} Nodelist
	 */
	var getMovieInstance = function(id){
		//console.log(typeof(document.querySelectorAll(`[data-id="${id}"]`)));
		return document.querySelector(`[data-id="${id}"]`);
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
	 * ------------------------------------------------------
	 * Update functions on app change
	 * ------------------------------------------------------
	*/

	/**
	 * Update rating in the view of the current Movie
	 */
	var updateMovieInstanceRatings = function(){
		// Update title text
		let titleText = `Users rated this ${movieDatabase.getCurrentMovie().averageRating}/10 (${movieDatabase.getCurrentMovie().ratings.length} votes) - click slider to rate`;
		getMovieInstance(movieDatabase.getCurrentMovie().id)
		.querySelector('.user-rating').title = titleText;
		// Update slider valuenow
		getMovieInstance(movieDatabase.getCurrentMovie().id)
		.querySelector('.average-slider .progress-bar')
		.setAttribute('aria-valuenow', movieDatabase.getCurrentMovie().averageRating * 10);
		getMovieInstance(movieDatabase.getCurrentMovie().id)
		.querySelector('.average-slider .progress-bar')
		.setAttribute('style', `width:${movieDatabase.getCurrentMovie().averageRating * 10}%;"`);
	};

	/**
	 * Update the genrelinks in the view of the current Movie
	 */
	var updateMovieInstanceGenres = function(){
		//console.log(isMovieInActiveGenre());
		if(isMovieInActiveGenre() || movieDatabase.currentGenres.length === 0){
			//console.log('Movie in current genre or no genre selected. Update the DOM');	

			//find the movie in DOM - jQuery version
			//$(getMovieInstance(movieDatabase.getCurrentMovie().id))
			//.find('.movie-genre-list')
			//.replaceWith(appendGenreLinkList(movieDatabase.getCurrentMovie().genres));

			//find the movie in DOM  - vanilla JS
			getMovieInstance(movieDatabase.getCurrentMovie().id)
			.querySelector('.movie-genre-list')
			.outerHTML = appendGenreLinkList(movieDatabase.getCurrentMovie().genres); // replace movie genre-list with updated for movieDatabase

			// add eventhandlers for genre-links
			addGenreLinkHandlers();
		}else{
			//console.log('Movie not in current genre. Remove from DOM');
			var currentMovie = getMovieInstance(movieDatabase.getCurrentMovie().id);
			currentMovie.parentNode.removeChild(currentMovie);
		}
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
	 * ---------------------------------------------------------
	 * Init sort selects on app change
	 * ---------------------------------------------------------
	*/

	/**
	 * Init app genre filters and sort selects
	 */
	var updateSortControllers = function(){
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

	/*-----------------------------------------------
					UI Rating Slider
	------------------------------------------------*/

	/**
	 * Handler on mouseenter for ratingContainer
	 */
	var ratingContainerOnMouseEnter = function(){
		//console.log(this.parentNode.parentNode.dataset.id);
		let current = this;
		Array.prototype.slice.call(document.getElementsByClassName('rating-container'))	
		.forEach(function(ratingContainer){
			if(ratingContainer.parentNode.classList.contains('rating-hover') && ratingContainer.parentNode.parentNode.dataset.id !== current.parentNode.parentNode.dataset.id){
				hideRatingSlider(ratingContainer.parentNode);
				//console.log(ratingContainer.parentNode);
			}
		});


		if(!this.parentNode.classList.contains('rating-hover')){
			movieDatabase.setCurrentMovie(this.parentNode.parentNode.dataset.id);
			showRatingSlider(this.parentNode);
			appendRatingSlider(this.parentNode);

			if(this.parentNode.querySelector('.rating-hover').textContent !== '0'){
				this.querySelector('.rating-toolbar').classList.add('active');
			}
		}
	};

	/**
	 * Handler on mouseleave for ratingContainer
	 */
	var ratingContainerOnMouseLeave = function(){
		//console.log(this);
		this.querySelector('.rating-toolbar').classList.remove('active');
		hideRatingSlider(this.parentNode);
	};

	/**
	 * Shows the rating slider
	 * @param {String} target - thewrapper element
	 */
	var showRatingSlider = function(target){
		// Set class for rating textfields
		target.querySelector('.average-rating').classList.add('rating-hover');
	    [].map.call(target.querySelectorAll('.text-yellow'), function(el) {       
	        el.classList.toggle('text-yellow');
	        el.classList.toggle('text-primary');
	    });
	    // show rating slider
		if(!target.classList.contains('rating-hover')){
			target.classList.add('rating-hover');
		}
	};

	/**
	 * Hides the rating slider
	 * @param {String} target - the wrapper element
	 */
	var hideRatingSlider = function(target){
		// Set class for rating textfields
		target.querySelector('.average-rating').classList.remove('rating-hover');
		//target.querySelector('.rating-slider').classList.add('disabled');
		target.querySelector('.average-rating').textContent = movieDatabase.getCurrentMovie().averageRating;
	    [].map.call(target.querySelectorAll('.text-primary'), function(el) {       
	        el.classList.toggle('text-primary');
	        el.classList.toggle('text-yellow');
	    });

	   	 // hide rating slider 
		target.classList.remove('rating-hover');
		// hide the toolbar with submit button
		target.querySelector('.rating-toolbar').classList.remove('active');
	};


	/**
	 * Toggle visibilty for average bar and rating slider. Create Dragslider
	 * @param {String} target - the target wrapper element
	 */
	var appendRatingSlider = function(target){
		//console.log(target);

		var rateSlider = new Dragdealer(target.querySelector('.rating-slider').id, {
			animationCallback: function(x, y) {
				target.querySelector('.rating-slider .progress-bar').style.left = Math.round(x * 100)+'%';
				if(target.querySelector('.rating-hover.average-rating')){
					target.querySelector('.rating-hover.average-rating').textContent = Math.round(x * 10);
				}
				//console.log(this);
			},
			callback: function(x, y) {
				//let userRating = Math.round(x * 10);
				target.querySelector('.rating-toolbar').classList.add('active');
				//console.log(userRating);
			},
			dragStartCallback(x,y){	
				target.querySelector('.rating-container').removeEventListener('mouseleave', ratingContainerOnMouseLeave, false);		
			},
			dragStopCallback(x,y){
				//console.log(x);
				target.querySelector('.rating-container').addEventListener('mouseleave', ratingContainerOnMouseLeave, false);
			}
		});
	};

	/**
	 * Handler on click for submit-rating btn
	 */
	var submitRatingOnClick = function(event){
		event.preventDefault();
		// Set current movie
		movieDatabase.setCurrentMovie(this.dataset.id);
		// Set the user rating in movieDatabase
		if(this.parentNode.parentNode.parentNode.querySelector('.rating-hover.average-rating')){
			//console.log(this.parentNode.parentNode.parentNode.querySelector('.rating-hover.average-rating').textContent);
			let userRating = Number(this.parentNode.parentNode.parentNode.querySelector('.rating-hover.average-rating').textContent);
			movieDatabase.rateMovie(movieDatabase.getCurrentMovie(), userRating);
		}
		// Update view
		updateMovieInstanceRatings();
		// Hide rating slider
		hideRatingSlider(this.parentNode.parentNode.parentNode);
	};

	/**
	 * -------------------------------------------------
	 * Genre Edit and link-buttons for Movie instances. 
	 * -------------------------------------------------
	*/

	/**
	 * Event handler for genre dropdown links
	 */
	var genreDropdownItemOnClick = function(event){
		event.preventDefault();	
		movieDatabase.setCurrentMovie(Number(this.dataset.id));
		//console.log(this.dataset.id);
		//console.log(movieDatabase.getCurrentMovie());
		launchUpdateMovieModal();
		//console.log(movieDatabase.getCurrentMovie());
	};

	/**
	 * Event handler for genre filter button on single movies
	 */
	var genreLinkOnClick = function(event){
		event.preventDefault();
		//console.log(this.children[0].innerHTML);
		movieDatabase.currentGenres = [this.children[0].innerHTML];
		//console.log(movieDatabase.currentGenres);
		genreBtnsOnAppChange();
		appendFilteredMovies();
	};

	/**
	 * ------------------------------------------------------------------------
	 * Filter section. Select genres and sort controls
	 * ------------------------------------------------------------------------
	*/

	/**
	 * ----------------------------------------------
	 * Genre filter buttons
	 * ----------------------------------------------
	*/

	/**
	 * Appends a group of filter buttons to the DOM
	 * @param {Array} array - an array
	 * @param {String} key - name of the filter property
	 */
	var appendGenreFilterButtons = function(array, key){
	    //console.log(Array.isArray(array));
	    var buttonGroup = `<div class="filter-button-group" role="group" aria-label="filter-by-genre">`;
	    array
	    .forEach(function(item) {
	        buttonGroup += `<button type="button" value="${item}" class="btn btn-outline-success mb-3 mr-3 ${key}-filter">${item}</button>`;
	    });
	    buttonGroup += `</div>`;
	    //console.log(buttonGroup);
	    return buttonGroup;
	};

	/**
	 * Get genre links for Movie instance
	 * @param {Array} genres - array of genres
	 */
	var appendGenreLinkList = function(genres){
		genreList = '<ul class="list-inline movie-genre-list">';
		genres
		.forEach(function(genre){
			genreList += `<li class="list-inline-item movie-genre-item"><a class="genre-link" href="#"><small>${genre}</small></a></li>`;
		});
		return genreList + '</ul>';
	};

	/**
	 * ----------------------------------------------------
	 * Event handlers for genre filter buttons
	 * ----------------------------------------------------
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
	    if(this.classList.contains('active')){
	        this.classList.toggle('active');
	    } else {
	        this.classList.toggle('active'); 
	    }

	    Array.prototype.slice.call(document.getElementsByClassName('filter-button-group')[0]
	    .getElementsByClassName('active'))
	    .forEach(function(item) {
	    	//console.log(item.value);
	    	movieDatabase.currentGenres.push(item.value);
	    }); 

	    //console.log(movieDatabase.currentGenres);
	    appendFilteredMovies();

		document.getElementsByClassName('current-genres')[0].innerHTML =  movieDatabase.currentGenres.length > 0 ?  ' in ' + movieDatabase.currentGenres: '' ;   
		    
	};

	/**
	 * Appends Buttons with years
	 * @param {Array} titleYears - array of years
	 */
	var appendTitleYearButtons = function(titleYears){
	    //console.log(Array.isArray(titleYears));
	    let buttonGroup = `<div class="year-filter-button-group" role="group" aria-label="filter-by-year">`;
	    titleYears
	    .forEach(function(item) {
	        buttonGroup += `<button type="button" value="${item}" class="btn btn-link mb-3 mr-3 year-filter">${item}</button>`;
	    });
	    buttonGroup += `</div>`;
	    //console.log(buttonGroup);
	    return buttonGroup;
	};

	/**
	 * Add eventhandlers for title year button
	 */
	var addTitleYearButtonHandlers = function(className, callback){
		document.getElementsByClassName(className).addEventListener('click', callback, false);
	};

	/**
	 * Change handler for title year button
	 */
	var titleYearButtonOnClick = function(){
	    event.preventDefault();
	    movieDatabase.setTitleYear(0);
	    if(this.classList.contains('active')){
	        this.classList.remove('active');
	        //console.log('not active');
	    } else {
		    Array.prototype.slice.call(document.getElementsByClassName('year-filter-button-group')[0]
		    .getElementsByClassName('active'))
		    .forEach(function(item) {
		    	item.classList.remove('active'); 
		    }); 	  
	        this.classList.add('active'); 
	        //console.log('active');
	        movieDatabase.setTitleYear(Number(this.value));
	    }

	    // Call appendMovies    
	    appendFilteredMovies();

	};

	/**
	 * --------------------------------------------
	 *  Sort-selects dropdown-menu
	 * --------------------------------------------
	*/

	/**
	 * Appends selects for sorting
	 * @param {String} target - the element to append to 
	 */
	var appendSortControllers = function(){
		// Sort by 
		sortControllers = `<label class="mr-2 text-muted" for="sortBySelect">Sort By</label>
							<select id="sortBySelect" class="form-control d-inline mr-3 sort-key-group sort-select">
								<option disabled>Sort By</option>`;

		movieDatabase
		.getSortByList()
		.forEach(function(sortBy) {
			let selected = movieDatabase.getSortBy() === sortBy.key ? 'selected': '';
	    	sortControllers += `<option ${selected} class="sort-key-item sort-item" value="${sortBy.key}">${sortBy.displayName}</option>`;
	    });	
	    sortControllers +=	'</select>'; // end sort by

	    // Sort order 
		sortControllers += `<label class="mr-2 text-muted" for="sortOrderSelect">Order</label>
							<select id="sortOrderSelect" class="form-control d-inline sort-order-group sort-select">
								<option disabled>Sort Order</option>`;
								
		movieDatabase
		.getSortOrderList()
		.forEach(function(sortOrder) {
			let selected = movieDatabase.getSortOrder() === sortOrder.key ? 'selected': '';
	    	sortControllers += `<option ${selected} class="sort-key-item sort-item" value="${sortOrder.key}">${sortOrder.displayName}</option>`;
		});
		sortControllers +=	'</select>'; // end sort order
		//console.log(sortControllers);
		return sortControllers;
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
	 * ---------------------------------------------------
	 * Event handlers for sort controls
	 * ---------------------------------------------------
	*/

	/**
	 * Change handler for sort dropdown selects
	 */
	var sortDropdownOnChange = function(){

		// Set sort by value in movieDatabase 
		if(this.classList.contains('sort-key-group')){	
	    	//console.log(this.options[this.selectedIndex].value);
	    	movieDatabase.setSortBy(this.options[this.selectedIndex].value);		
	    } 

	    // Set sort order value in movieDatabase 
	    if(this.classList.contains('sort-order-group')){	
	    	//console.log(this.options[this.selectedIndex].value); 
			movieDatabase.setSortOrder(this.options[this.selectedIndex].value);
	    }

	    // Call appendMovies
	    appendFilteredMovies();
	};

	/**
	 * ------------------------------------------------------------------------
	 * Form handling on update, add and init
	 * ------------------------------------------------------------------------
	*/

	/**
	 * Get input fields values
	 * @return {Object} movie - a Movie object
	 */
	var getAddFormVals = function(){
		// get input values from form
		/* 
		jQuery version
		var title = ($('#movieTitle').val() || '' ? $('#movieTitle').val() : 'Default Title');
		var year = ($('#titleYear').val() || '' ? $('#titleYear').val() : '2017');
		var poster = ($('#moviePoster').val() || '' ? $('#moviePoster').val() : '');
		var storyline = ($('#movieStoryline').val() || '' ? $('#movieStoryline').val() : '');
		*/
		
		// Vanilla
		var title = document.querySelector('#movieTitle').value || '' ? document.querySelector('#movieTitle').value : 'Default Title';
		var year = document.querySelector('#titleYear').value || '' ? document.querySelector('#titleYear').value : '2017';
		var poster = document.querySelector('#moviePoster').value || '' ? document.querySelector('#moviePoster').value : '';
		var storyline = document.querySelector('#movieStoryline').value || '' ? document.querySelector('#movieStoryline').value : '';

		// get array of checked checkboxes
		var selectedGenres = getCheckedInputValues();
		//console.log(selectedGenres);
		var movieID = movieDatabase.getMovies().length-1 + 1;
		//console.log(typeof(movieID));

		// Create Movie object
		var movie = new Movie(title, year, selectedGenres, [], '',  '', '', '', 0, '', storyline, [], 0, poster, movieID);
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
	var getGenresFromDatabase = function(){
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
		            	//console.log(checkbox.value === genre);
		            	if(checkbox.value === genre){
		                	checkbox.checked = true; // if match check checkbox
		                }
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
		updateSortControllers();
		//resetFilterBtns();
		genreBtnsOnAppChange();

		appendFilteredMovies();
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
		updateMovieInstanceGenres();
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
	 	getGenresFromDatabase();
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
		getGenresFromDatabase();
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
	var testFunctions = function(){
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

    // Reveal public pointers to
    // private functions and properties
    return {
    	init: init,
    	getMoviesFromJSON: getMoviesFromJSON
    };
 
})();

MovieView.init();
