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

var showAllMovies = function(){

            var result = '';
            var result1 = '';
            for(var i = 0; i < movies.length; i++){
                

                       result += `<p>${movies[i].title}</p>
                                  <p>${movies[i].year}</p>
                                  <p><img src="${movies[i].cover}"></p>
                                  <p>${movies[i].genres}</p>
                                  <p>${movies[i].ratings}</p>
                                  <p>${movies[i].average}</p>
                                  
                                  `;
                                    
                    movies[i].actors.forEach(function(actor){
                        result += `<p>${actor.name}</p>`;
                    });
                    

            }
            console.log(result);
};

showAllMovies();