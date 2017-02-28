console.log('---Utilities');
console.log( '-----Revealing Module Pattern-----');

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
	var sortObjectsByKey = function(array, key){
		return array
		.sort(function (a, b) {
			//console.log(isNaN(a[key]));
			if(_isNumber(a[key])){
				return a[key] - b[key];
			}else{
				var keyA = a[key].toUpperCase(); // ignore upper and lowercase
				var keyB = b[key].toUpperCase(); // ignore upper and lowercase
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
	 * Returns a sorted array
	 * @param {Array} array - the array to sort
	 * @return {Array} array - the sorted array
	 */
	var sortArray = function(array){
		return array
		.sort(function (a, b) {
			if(_isNumber(a)){
				return a - b;
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
    // Reveal public pointers to
    // private functions and properties
    return {
        sortObjectsByKey: sortObjectsByKey,
        sortArray: sortArray,
        getUniqueArray: getUniqueArray,
        getConcatArray: getConcatArray
    };
 
})();