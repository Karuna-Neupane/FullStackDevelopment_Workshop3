const movieListDiv = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('add-movie-form');

// Load from localStorage or initialize with sample movies
let allMovies = JSON.parse(localStorage.getItem('movies')) || [
    { id: '1', title: 'Inception', genre: 'Sci-Fi', year: 2010 },
    { id: '2', title: 'Pulp Fiction', genre: 'Crime', year: 1994 },
    { id: '3', title: 'Dune', genre: 'Sci-Fi', year: 2021 },
    { id: '4', title: 'KGF', genre: 'Action/Thriller', year: 2018 }
];

// Save to localStorage
localStorage.setItem('movies', JSON.stringify(allMovies));

function renderMovies(moviesToDisplay) {
    movieListDiv.innerHTML = '';
    if (moviesToDisplay.length === 0) {
        movieListDiv.innerHTML = '<p>No movies found.</p>';
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
            editMoviePrompt(
                btn.dataset.id,
                btn.dataset.title,
                btn.dataset.year,
                btn.dataset.genre
            );
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteMovie(btn.dataset.id));
    });
}

// Initial render
renderMovies(allMovies);

// Search
searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    const filtered = allMovies.filter(
        m => m.title.toLowerCase().includes(term) || m.genre.toLowerCase().includes(term)
    );
    renderMovies(filtered);
});

// Add new movie
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newMovie = {
        id: Date.now().toString(),
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        year: parseInt(document.getElementById('year').value)
    };
    allMovies.push(newMovie);
    localStorage.setItem('movies', JSON.stringify(allMovies));
    form.reset();
    renderMovies(allMovies);
});

// Edit
function editMoviePrompt(id, currentTitle, currentYear, currentGenre) {
    const newTitle = prompt('New Title:', currentTitle);
    const newYearStr = prompt('New Year:', currentYear);
    const newGenre = prompt('New Genre:', currentGenre);

    if (!newTitle || !newYearStr || !newGenre) return;

    const index = allMovies.findIndex(m => m.id === id);
    if (index !== -1) {
        allMovies[index] = { id, title: newTitle, year: parseInt(newYearStr), genre: newGenre };
        localStorage.setItem('movies', JSON.stringify(allMovies));
        renderMovies(allMovies);
    }
}

// Delete
function deleteMovie(id) {
    if (!confirm('Are you sure you want to delete this movie?')) return;
    allMovies = allMovies.filter(m => m.id !== id);
    localStorage.setItem('movies', JSON.stringify(allMovies));
    renderMovies(allMovies);
}
