// Global Constants
const API_KEY = "d0ac7cd350bede061b35bf8b74555f70";

// Global Variables
let pageNum = 1;
let currentSearchTerm = "";

// Page Elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const movieGridDiv = document.getElementById('movies-grid');
const closeSearchButton = document.getElementById('close-search-btn');
const loadMoreButton = document.getElementById('load-more-movies-btn');
const movieGridTitle = document.getElementById('movie-grid-title');

// Get results from API for the now playing movies
async function getCurrentMovies() {
    let currentMoviesUrl = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + API_KEY +
    "&language=en-US" + "&page=" + pageNum;

    console.log("url",currentMoviesUrl);

    let response = await fetch(currentMoviesUrl);
    let responseData = await response.json();

    console.log("rd",responseData);
    console.log("responsedatadata", responseData.results);

    return responseData.results;
}

// Get results from API for searched movie
async function getSearchedMovies(searchTerm) {
    let searchMovieUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + API_KEY + 
    "&query=" + searchTerm + "&page=" + pageNum;

    console.log("surl",searchMovieUrl);

    let response = await fetch(searchMovieUrl);
    let responseData = await response.json();

    console.log("rd",responseData);
    console.log("responsedatadata", responseData.results);

    return responseData.results;
    
}

async function getMovieTrailers(movieID) {
    let trailerUrl = "https://api.themoviedb.org/3/movie/" + movieID + "/videos?api_key=" 
    + API_KEY + "&language=en-US";

    let response = await fetch(trailerUrl);
    let responseData = await response.json();

    console.log("trailer response data",responseData.results[0].key);
    return responseData.results[0].key;
}


// Display the movies
async function displayMovies(moviesData) {
    let posterPath = "";
    moviesData.forEach(async movie => {
        console.log("movie",movie);
        let trailerKey = await getMovieTrailers(movie.id);
        console.log("trailer",trailerKey);
        let backdrop = "";

        if (movie.poster_path != null) {
            posterPath = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
        } else {
            posterPath = "No_Poster.png";
        }

        console.log(trailerKey);
        if (trailerKey != null) {
            backdrop = `<iframe class="trailer" type="text/html"
                        src="https://www.youtube.com/embed/${trailerKey}?autoplay=1&loop=1"
                        frameborder="0">
                        </iframe>`;
        } else {
            backdrop=`<img class="backdrop-image" src="https://image.tmdb.org/t/p/w500/${movie.backdrop_path}">`
        }

        console.log("https://image.tmdb.org/t/p/w500/"+movie.backdrop_path);

        movieGridDiv.innerHTML += `
        
            <div class="movie-card ${movie.id}">
                <img class="movie-poster ${movie.id}" src=${posterPath}
                <p class="movie-votes ${movie.id}">⭐ ${movie.vote_average}</p>
                <p class="movie-title ${movie.id}">${movie.title}</p>
            </div>
        
            <div class="modal" id="modal-${movie.id}" >
                <div class="modal-content" id="modal-content'${movie.id}" >
                    <span class="close ${movie.id}" id="close-${movie.id}">&times;</span>
                    ${backdrop}
                    <h3 class="${movie.id}"> ${movie.title} </h3>
                    <p>⭐ ${movie.vote_average} / 10</p>
                    <p>Released: ${movie.release_date}</p>
                    <p>${movie.overview}<p>
                </div>
            </div>
        ` 

        
    });
    
}

async function handleFormSubmit(event) {
    event.preventDefault();
    movieGridDiv.innerHTML = "";
    currentSearchTerm = searchInput.value;
    console.log("sin",searchInput.value);
    pageNum=1;    
    movieGridTitle.innerHTML = `Results for: ${currentSearchTerm}`;
    let searchResults = await getSearchedMovies(currentSearchTerm);
    displayMovies(searchResults);
    searchInput.value = "";
    closeSearchButton.classList.remove("hidden");
    loadMoreButton.classList.remove("hidden");
}

// Event listener for when search movie form is submitted
searchForm.addEventListener("submit", handleFormSubmit);

async function handleCloseSearchButton(event) {
    event.preventDefault();
    movieGridDiv.innerHTML = "";
    pageNum = 1;
    closeSearchButton.classList.add("hidden");
    movieGridTitle.innerHTML = `Now Showing`;
    let results = await getCurrentMovies();
    displayMovies(results);
    loadMoreButton.classList.remove("hidden");
    currentSearchTerm = "";
}

// Event listener for when the "Back to now showing" button is clicked
closeSearchButton.addEventListener("click", handleCloseSearchButton);

async function handleLoadMoreClick(event) {
    loadMoreButton.classList.add("hidden");
    pageNum++;    
    if (currentSearchTerm == "") {
        let results = await getCurrentMovies();
        displayMovies(results);
    } else {
        let searchResults = await getSearchedMovies(currentSearchTerm);
        displayMovies(searchResults);
    }
    loadMoreButton.classList.remove("hidden");

}

loadMoreButton.addEventListener("click", handleLoadMoreClick);

// Get the modal


document.addEventListener("click", (event) => {
    if (event.target.matches(".movie-card") || event.target.matches(".movie-poster") || event.target.matches(".movie-title") || event.target.matches(".movie-votes")) {
        console.log("here", event.target.classList[1]);
        console.log("here2", "modal-"+event.target.classList[1])
        let modal = document.getElementById("modal-"+event.target.classList[1]);
        console.log("here", modal);
        modal.style.display = "block";
    }

    if(event.target.matches(".close") ) {
        let modal = document.getElementById("modal-"+event.target.classList[1]);
        modal.style.display = "none";

    }
}) 



window.onload = async function() {
    let results = await getCurrentMovies();
    displayMovies(results);
    loadMoreButton.classList.remove("hidden");
}
