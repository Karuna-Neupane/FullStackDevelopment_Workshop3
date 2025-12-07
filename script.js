const API_URL = 'http://localhost:3000/movies';

const movieListDiv = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('add-movie-form');

let allMovies = []; // Stores the full, unfiltered list of movies

// Function to dynamically render movies to the HTML
function renderMovies(moviesToDisplay) {
    movieListDiv.innerHTML = '';
    if (moviesToDisplay.length === 0) {
        movieListDiv.innerHTML = '<p>No movies found matching your criteria.</p>';
        return;
    }

    moviesToDisplay.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-item');

        // Use data attributes for IDs and other properties
        movieElement.innerHTML = `
            <p><strong>${movie.title}</strong> (${movie.year}) - ${movie.genre}</p>
            <button class="edit-btn" 
                data-id="${movie.id}" 
                data-title="${movie.title}" 
                data-year="${movie.year}" 
                data-genre="${movie.genre}">Edit</button>
            <button class="delete-btn" data-id="${movie.id}">Delete</button>
        `;

        movieListDiv.appendChild(movieElement);
    });

    // Attach event listeners after rendering
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

// Function to fetch all movies and store them (READ)
function fetchMovies() {
    fetch(API_URL)
        .then(response => response.json())
        .then(movies => {
            allMovies = movies; // Store the full list
            renderMovies(allMovies); // Display the full list
        })
        .catch(error => console.error('Error fetching movies:', error));
}

fetchMovies(); // Initial load

// Search functionality
searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredMovies = allMovies.filter(movie => {
        const titleMatch = movie.title.toLowerCase().includes(searchTerm);
        const genreMatch = movie.genre.toLowerCase().includes(searchTerm);
        return titleMatch || genreMatch;
    });

    renderMovies(filteredMovies); // Display the filtered results
});

// Add new movie
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const newMovie = {
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        year: parseInt(document.getElementById('year').value)
    };

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie),
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to add movie');
        return response.json();
    })
    .then(() => {
        form.reset();
        fetchMovies(); // Refresh the list
    })
    .catch(error => console.error('Error adding movie:', error));
});

// Function to collect new data
function editMoviePrompt(id, currentTitle, currentYear, currentGenre) {
    const newTitle = prompt('Enter new Title:', currentTitle);
    const newYearStr = prompt('Enter new Year:', currentYear);
    const newGenre = prompt('Enter new Genre:', currentGenre);

    if (newTitle && newYearStr && newGenre) {
        const updatedMovie = {
            title: newTitle,
            year: parseInt(newYearStr),
            genre: newGenre
        };

        updateMovie(id, updatedMovie);
    }
}

// Function to send PUT request
function updateMovie(movieId, updatedMovieData) {
    fetch(`${API_URL}/${movieId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovieData),
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to update movie');
        return response.json();
    })
    .then(() => fetchMovies())
    .catch(error => console.error('Error updating movie:', error));
}

// Delete movie
function deleteMovie(movieId) {
    if (!confirm("Are you sure you want to delete this movie?")) return;

    fetch(`${API_URL}/${movieId}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) throw new Error('Failed to delete movie');
            fetchMovies();
        })
        .catch(error => console.error('Error deleting movie:', error));
}
