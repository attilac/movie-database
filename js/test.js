var movies = [
  { 
      title: "La La Land",
      year: 2016,
      cover: "http://pics.filmaffinity.com/la_la_land-262021831-large.jpg",
      genres: ['Drama', 'Comedy', 'Musical'],
      ratings: [9, 6],
      average: 0,
      actors: [
      {
      name: "Ryan Gosling"
      },
      {
      name: "Emma Stone"
      } 
    ]
  }
]; 

var showAllMoviesForEach = function(){
  var result ='';
  movies.forEach(function(movie) {             
    result += `<p>${movie.title}</p>
              <p>${movie.year}</p>
              <p><img src="${movie.cover}"></p>
              <p>${movie.genres}</p>
              <p>${movie.ratings}</p>
              <p>${movie.average}</p>  
              `;
                          
    movie.actors.forEach(function(actor){
      result += `<p>${actor.name}</p>`;
    });
            
  });
  return result;
};

var showAllMoviesMap = function(){
  return movies
  .map(function(movie) {             
    return  `<p>${movie.title}</p>
              <p>${movie.year}</p>
              <p><img src="${movie.cover}"></p>
              <p>${movie.genres}</p>
              <p>${movie.ratings}</p>
              <p>${movie.average}</p>  ` +

              movie.actors
              .map(function(actor){
                return `<p>${actor.name}</p>`;       
              });                          
  });
};

console.log(showAllMoviesForEach());
console.log(showAllMoviesMap()[0]);