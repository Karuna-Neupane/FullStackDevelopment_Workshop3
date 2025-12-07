const movieListDiv = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('add-movie-form');

let allMovies = JSON.parse(localStorage.getItem('movies')) || []; // Load from localStorage

// Render movies to the HTML
function renderMovies(moviesToDisplay) {
    movieListDiv.innerHTML = '';
    if (moviesToDisplay.length === 0) {
        movieListDiv.innerHTML = '<p>No movies found matching your criteria.</p>';
        return;
    }

    moviesToDisplay.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-item');
        movieElement.innerHTML = `
            <p><strong>${movie.title}</strong> (${movie.year}) - ${movie.genre}</p>
            <button class="edit-btn" data-id="${movie.id}" data-title="${movie.title}" data-year="${movie.year}" data-genre="${movie.genre}">Edit</button>
            <button class="delete-btn" data-id="${movie.id}">Delete</button>
        `;
        movieListDiv.appendChild(movieElement);
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const title = btn.dataset.title;
            const year = btn.dataset.year;
            const genre = btn.dataset.genre;
            editMoviePrompt(id, title, year, genre);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            deleteMovie(id);
        });
    });
}

// Initial render
renderMovies(allMovies);

// Search functionality
searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredMovies = allMovies.filter(movie => {
        return movie.title.toLowerCase().includes(searchTerm) || movie.genre.toLowerCase().includes(searchTerm);
    });
    renderMovies(filteredMovies);
});

// Add new movie
form.addEventListener('submit', function(event) {
    event.preventDefault();
    const newMovie = {
        id: Date.now().toString(), // unique ID as string
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        year: parseInt(document.getElementById('year').value)
    };
    allMovies.push(newMovie);
    localStorage.setItem('movies', JSON.stringify(allMovies));
    form.reset();
    renderMovies(allMovies);
});

// Edit movie
function editMoviePrompt(id, currentTitle, currentYear, currentGenre) {
    const newTitle = prompt('Enter new Title:', currentTitle);
    const newYearStr = prompt('Enter new Year:', currentYear);
    const newGenre = prompt('Enter new Genre:', currentGenre);

    if (newTitle && newYearStr && newGenre) {
        const index = allMovies.findIndex(m => m.id === id);
        if (index !== -1) {
            allMovies[index] = { id, title: newTitle, year: parseInt(newYearStr), genre: newGenre };
            localStorage.setItem('movies', JSON.stringify(allMovies));
            renderMovies(allMovies);
        }
    }
}

// Delete movie
function deleteMovie(id) {
    if (!confirm("Are you sure you want to delete this movie?")) return;
    allMovies = allMovies.filter(m => m.id !== id);
    localStorage.setItem('movies', JSON.stringify(allMovies));
    renderMovies(allMovies);
}
