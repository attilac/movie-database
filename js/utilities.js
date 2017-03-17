/*jshint esversion: 6 */
console.log('---Utilities');
console.log( '-----Revealing Module Pattern-----');

/*-------------------------------------------------------------------------
			Helper functions					
--------------------------------------------------------------------------*/

/**
 * Revealing Module Pattern
 * 
 */
var utils = (function(movies) {

	/**
	 * Return true if input is a number
	 * @param {Object} x - the value to check
	 * @return {Bool} true or false
	 */
	function _isNumber(x) {
	  return x!== undefined && typeof(x) === 'number' && !isNaN(x);
	}

	/**
	 * Returns a sorted array of objects by 
	 * @param {Array} array - the array to sort
	 * @param {String} key - the property to sort by
	 * @return {Array} array - the sorted array
	 */
	var sortObjectsByKey = function(array, key, sortOrder='ASC'){
		return array
		.sort(function (a, b) {
			//console.log(isNaN(a[key]));
			if(_isNumber(a[key])){
				if(sortOrder && sortOrder === 'DESC'){
					return b[key] - a[key];
				}else{
					return a[key] - b[key];
				}
			}else{
				var keyA = a[key].toUpperCase(); // ignore upper and lowercase
				var keyB = b[key].toUpperCase(); // ignore upper and lowercase
				if(sortOrder && sortOrder === 'DESC'){
					if (keyA < keyB) {
						return 1;
					}
					if (keyA > keyB) {
						return -1;
					}
				}else{
					if (keyA < keyB) {
						return -1;
					}
					if (keyA > keyB) {
						return 1;
					}					
				}
		  		// names must be equal
		  		return 0;		
			}
		});
	};

	/**
	 * Returns a sorted array
	 * @param {Array} array - the array to sort
	 * @return {Array} array - the sorted array
	 */
	var sortArray = function(array){
		return array
		.sort(function (a, b) {
			if(_isNumber(a)){
				return b - a;
			}else{
				var keyA = a.toUpperCase(); // ignore upper and lowercase
				var keyB = b.toUpperCase(); // ignore upper and lowercase
				if (keyA < keyB) {
					return -1;
				}
				if (keyA > keyB) {
					return 1;
				}
		  		// names must be equal
		  		return 0;		
			}
		});
	};

	/**
	 * Returns an array with unique values
	 * @param {Array} array - the array to process
	 * @return {Array} array - 
	 */	
	var getUniqueArray = function(array){
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
	var getConcatArray = function(array) {
		//console.log(key);
		return array
		.map(function(item) { 
			return item; 
		})
		.reduce(function(previous, current) {
			return previous.concat(current);
		}, []);		
	};

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
	* @description Sets divs on the same row to be the same height
	* 
	*/	
	var columnConform = function(target){
		var $elements = $(target); 
		 // first remove originalHeight data and reset height 
		$elements.removeData('originalHeight').height('auto'); 
		var currentTallest = 0;
		var currentRowStart = 0;
		var row = [];
		var col;
		var topPosition = 0;	
	
	 	// find the tallest DIV in the row, and set the heights of all of the DIVs to match it.
 		$(target).each(function(index) {
			col = $(this);
			topPosition = Math.round(col.offset().top);
			//col.append(topPosition);		
			if(currentRowStart != topPosition) {	
				// we just came to a new row.  Set all the heights on the completed row
				for (var i = 0; i < row.length; i++) {
   					row[i].height(currentTallest);
 				}
				// set the variables for the new row
				row = []; // empty the array
				currentRowStart = topPosition;
				currentTallest = col.height();
 				row.push(col);
			} else {
				//col.append(topPosition);
				// another div on the current row.  Add it to the list and check if it's taller
				row.push(col);
				//currentTallest = (currentTallest < col.height()) ? (col.height()) : (currentTallest);
				currentTallest = Math.max(currentTallest, col.height());
			}			
			// do the last row
			for (var j = 0; j < row.length; j++) {
				row[j].height(currentTallest);
				//col.append(currentTallest);
			}	
			//col.append(currentTallest);			
		});
	};

    // Reveal public pointers to
    // private functions and properties
    return {
        sortObjectsByKey: sortObjectsByKey,
        sortArray: sortArray,
        getUniqueArray: getUniqueArray,
        getConcatArray: getConcatArray,
        columnConform: columnConform,
        formatDate: formatDate
    };
 
})();