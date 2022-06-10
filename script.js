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

// Display the movies
function displayMovies(moviesData) {
    moviesData.forEach(movie => {
        if (movie.poster_path != null) {
            movieGridDiv.innerHTML += `
                <div class="movie-card">
                    <img class="movie-poster" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
                    <p class="movie-votes">⭐ ${movie.vote_average}</p>
                    <p class="movie-title">${movie.title}</p>
                </div>
            ` 
        } else {
            movieGridDiv.innerHTML += `
                <div class="movie-card">
                    <img class="movie-poster" src="No_Poster.png"
                    <p class="movie-votes">⭐ ${movie.vote_average}</p>
                    <p class="movie-title">${movie.title}</p>
                </div>
            ` 
        }
        
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

window.onload = async function() {
    let results = await getCurrentMovies();
    displayMovies(results);
    loadMoreButton.classList.remove("hidden");
}