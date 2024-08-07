// Titles: https://omdbapi.com/?s=thor&page=1&apikey=fc1fef96
// details: http://www.omdbapi.com/?i=tt3896198&apikey=fc1fef96

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details) {
    const imdbId = details.imdbID;
    const title = details.Title;
    const type = details.Type; // get the type of the movie

    // Create the buttons HTML
    const buttonsHtml = `
    <div class="embed-buttons-container">
    <h3 style="color: red; text-align: center;">Servers:</h3>
        <div class="embed-buttons">
            <button class="superembed-btn">Superembed</button>
            <button class="autoembed-btn">Autoembed</button>
            <button class="vidsrc-btn">Vidsrc</button>
        </div>
    `;

    // Create the title HTML
    const titleHtml = `
        <div class="movie-poster">
            <img src="${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt="movie poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${title}</h3>
            <ul class="movie-misc-info">
                <li class="year">Year: ${details.Year}</li>
                <li class="rated">Ratings: ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
            </ul>
            <p class="genre"><b>Genre:</b> ${details.Genre}</p>
            <p class="writer"><b>Writer:</b> ${details.Writer}</p>
            <p class="actors"><b>Actors: </b>${details.Actors}</p>
            <p class="plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="language"><b>Language:</b> ${details.Language}</p>
            <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
            ${buttonsHtml}
            <div class="season-episode-inputs">
                <input id="season-number" type="number" placeholder="Season number">
                <input id="episode-number" type="number" placeholder="Episode number">
            </div>
        </div>
    `;

    // Get the result container element
    const resultContainer = document.querySelector('.result-container');
    resultContainer.innerHTML = titleHtml;

    // Add the selected-option class to the first button
    const buttons = resultContainer.querySelectorAll('.embed-buttons button');
    buttons.forEach((button) => {
        button.dataset.type = type; // set the data-type attribute for all buttons
    });

    // Call the separate function to handle the embedding
    handleEmbedding(imdbId);
}

// ...

function handleEmbedding(imdbId) {
    // Get the buttons elements
    const buttons = document.querySelectorAll('.embed-buttons button');

    // Add event listeners to the buttons
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            // Remove any existing iframe
            const existingIframe = document.querySelector('iframe');
            if (existingIframe) {
                existingIframe.remove();
            }

            let embedUrl;
            let type = button.dataset.type;

if (type === 'series') {
    const season = document.querySelector('#season-number').value;
    const episode = document.querySelector('#episode-number').value;
    if (button.classList.contains('superembed-btn')) {
        embedUrl = `https://parasgaming122.github.io/project-s/https://multiembed.mov/?video_id=${imdbId}&s=${season}&e=${episode}`;
    } else if (button.classList.contains('autoembed-btn')) {
        embedUrl = `https://parasgaming122.github.io/project-s/https://autoembed.co/tv/imdb/${imdbId}-${season}-${episode}`;
    } else if (button.classList.contains('vidsrc-btn')) {
        embedUrl = `https://parasgaming122.github.io/project-s//https://vidsrc.xyz/embed/tv?imdb=${imdbId}&season=${season}&episode=${episode}`;
    }
} else {
    if (button.classList.contains('superembed-btn')) {
        embedUrl = `https://parasgaming122.github.io/project-s/https://multiembed.mov/?video_id=${imdbId}`;
    } else if (button.classList.contains('autoembed-btn')) {
        embedUrl = `https://parasgaming122.github.io/project-s/https://autoembed.co/movie/imdb/${imdbId}`;
    } else if (button.classList.contains('vidsrc-btn')) {
        embedUrl = `https://parasgaming122.github.io/project-s/https://vidsrc.com/embed/imdb/${imdbId}`;
    }
}

            const iframe = document.createElement('iframe');
            iframe.src = embedUrl;
            iframe.width = '800';
            iframe.height = '600';
            iframe.style.border = 'none';
            iframe.style.display = 'block';
            iframe.style.margin = '0 auto';
            iframe.style.background = 'black';
            iframe.style.padding = '10px';

            const embedContainer = document.createElement('div');
            embedContainer.style.background = 'black';
            embedContainer.style.padding = '10px';
            embedContainer.appendChild(iframe);

            document.body.appendChild(embedContainer);
        });
    });
}

// Add some basic styling to the buttons
const buttons = document.querySelectorAll('.embed-buttons button');
buttons.forEach((button) => {
    button.style.background = 'black';
    button.style.color = 'white';
    button.style.padding = '10px 20px';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
});
window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});
