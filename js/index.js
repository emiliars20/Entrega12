document.addEventListener("DOMContentLoaded", function() {
    let pelisData = [];
  
    // Cargar la información de la API cuando la página cargue
    fetch('https://japceibal.github.io/japflix_api/movies-data.json')
      .then(response => response.json())
      .then(data => {
        pelisData = data; // Guardar los datos en una variable
        localStorage.setItem('pelisData', JSON.stringify(data));
      })
      .catch(error => console.error('Error:', error));
  
    // Añadir evento al botón de búsqueda
    document.getElementById('btnBuscar').addEventListener('click', function() {
      const query = document.getElementById('inputBuscar').value.trim().toLowerCase();
      if (query) {
        // Filtrar las películas que coincidan con el término de búsqueda
        const pelisFiltradas = pelisData.filter(movie => 
          movie.title.toLowerCase().includes(query) ||
          movie.genres.some(genre => genre.name.toLowerCase().includes(query)) // Aquí se accede a genre.name
        );
  
        // Mostrar las películas filtradas
        mostrarPelis(pelisFiltradas);
      }
    });
  
    // Función para mostrar las películas filtradas
   // Añadir evento al elemento li para mostrar el offcanvas con detalles de la película
function mostrarPelis(movies) {
  const lista = document.getElementById('lista');
  lista.innerHTML = ''; // Limpiar resultados previos

  if (movies.length === 0) {
    const noResultsItem = document.createElement('li');
    noResultsItem.classList.add('list-group-item', 'bg-secondary', 'text-white', 'mb-2'); //boostrap
    noResultsItem.textContent = 'no results found';
    lista.appendChild(noResultsItem);
  } else {
    movies.forEach(movie => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item', 'bg-secondary', 'text-white', 'mb-2'); //boostrap
      listItem.innerHTML = `
        <h5>${movie.title}</h5>
        <p class='taglineColor'>${movie.tagline || 'no description'}</p>
        <p>${generateStars(movie.vote_average)}</p>
      `;
      
      // Añadir el evento para mostrar el offcanvas
      listItem.addEventListener('click', () => {
        mostrarDetallesPelicula(movie);
      });

      lista.appendChild(listItem);
    });
  }
}

// Función para mostrar detalles de la película en el offcanvas
function mostrarDetallesPelicula(movie) {
  const offcanvasLabel = document.getElementById('offcanvasPeliculaLabel');
  const peliculaOverview = document.getElementById('peliculaOverview');
  const peliculaGenres = document.getElementById('peliculaGenres');
  const peliculaAnio = document.getElementById('peliculaAnio');
  const peliculaDuracion = document.getElementById('peliculaDuracion');
  const peliculaPresupuesto = document.getElementById('peliculaPresupuesto');
  const peliculaGanancias = document.getElementById('peliculaGanancias');

  // Asignar los valores
  offcanvasLabel.textContent = movie.title;
  peliculaOverview.textContent = movie.overview || 'no description available';

  // Limpiar y agregar los géneros
  peliculaGenres.innerHTML = '';
  movie.genres.forEach(genre => {
    const li = document.createElement('li');
    li.classList.add('mb-2'); // Espaciado entre elementos
    li.innerHTML = `<span class="fa fa-star checked"></span> ${genre.name}`; // Estrella antes del género
    peliculaGenres.appendChild(li);
  });

  // Asignar los detalles del dropdown
  peliculaAnio.textContent = `Year: ${new Date(movie.release_date).getFullYear()}`;
  peliculaDuracion.textContent = `Runtime: ${movie.runtime} minutes`;
  peliculaPresupuesto.textContent = `Budget: $${movie.budget.toLocaleString()}`;
  peliculaGanancias.textContent = `Revenue: $${movie.revenue.toLocaleString()}`;

  // Mostrar el offcanvas
  const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasPelicula'));
  offcanvas.show();
}

    // Función para generar las estrellas de votación usando Font Awesome
function generateStars(voteAverage) {
    const starsOutOfFive = Math.round(voteAverage / 2); // Como la escala es de 10, la reducimos a 5
    let stars = '';
  
    for (let i = 0; i < 5; i++) {
      if (i < starsOutOfFive) {
        stars += '<span class="fa fa-star checked"></span>'; // Estrella llena (checked)
      } else {
        stars += '<span class="fa fa-star"></span>'; // Estrella vacía
      }
    }
    return stars;
  }
});