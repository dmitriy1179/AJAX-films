const API = "http://www.omdbapi.com";
const key = "888cc6de";
const ENDPOINT = `${API}/?apikey=${key}`;
const searchBtn = document.getElementById("searchBtn");
const form = document.getElementById("form");
const list = document.getElementById("list");
const moreBtn = document.getElementById("moreBtn");
const filmDetails = document.getElementById("filmDetails");
const closeDetails = document.getElementById("closeDetails");
const filmDetailsContainer = document.getElementById("filmDetailsContainer")
let page = 1;

searchBtn.onclick = async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const query = form.query.value.trim();
  const type = form.category.value;
  if (!query) return;
  page = 1;
  const { films, total } = await searchFilms(query, type, page);
  showFilms(films, page, true);
  updateMoreBtn(total, page);
}

list.onclick = async (e) => {
  const li = e.target.closest("li");

  if (!li) return;

  const id = li.dataset.id;
  const film = await getFilmDetails(id);

  showFilm(film);
}

async function searchFilms(query, type, page = 1) {
  try {
    const url = `${ENDPOINT}&s=${query}&type=${type}&page=${page}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const result = await response.json();
    return { films: result.Search, total: result.totalResults };
  } catch (e) {
    console.error(e);
  }
}

async function getFilmDetails(id) {
  try {
    const url = `${ENDPOINT}&i=${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const film = await response.json();
    return film;
  } catch (e) {
    console.error(e);
  }
}

function showFilm(film) {
  const img = list.querySelector(`[data-id=${film.imdbID}] img`);

  filmDetailsContainer.replaceChildren(closeDetails);
  filmDetailsContainer.insertAdjacentHTML("beforeend", `
    <div>
      <h2 class="detailsTitle">${film.Title}</h2>
      <h3 class="detailsName">Actors</h3>
      <p class="detailsDescription">${film.Actors}</p>
      <h3 class="detailsName">Year</h3>
      <p class="detailsDescription">${film.Year}</p>
      <h3 class="detailsName">Released</h3>
      <p class="detailsDescription">${film.Released}</p>
      <h3 class="detailsName">Country</h3>
      <p class="detailsDescription">${film.Country}</p>
      <h3 class="detailsName">Writer</h3>
      <p class="detailsDescription">${film.Writer}</p>
      <h3 class="detailsName">Runtime</h3>
      <p class="detailsDescription">${film.Runtime}</p>
      <h3 class="detailsName">Language</h3>
      <p class="detailsDescription">${film.Language}</p>
    </div>
  `);
  filmDetailsContainer.insertAdjacentElement("afterbegin", img.cloneNode(true))

  closeDetails.onclick = () => {
    filmDetails.close()
  }
  filmDetails.showModal();
}

function showFilms(films, page, newQuery = false) {
  if (newQuery) {
    list.replaceChildren();
  }

  if (films?.length) {
    films.forEach(film => {
      list.innerHTML +=
        `<li class="movie" data-id=${film.imdbID}>
          <img class="moviePoster" src="${film.Poster}" alt="">
          <h3 class="movieTitle">${film.Title}</h3>
          <p class="movieYear">${film.Year}</p>
        </li>`;
    })

    list.children[page * 10 - 10].scrollIntoView(
      {
        behavior: "smooth",
      }
    )

  } else if (newQuery) {
    list.style.color = "#000000";
    list.style.fontSize = "36px";
    list.innerHTML = "No films found";
  }
}

function updateMoreBtn(total, page) {
  moreBtn.hidden = list.childCount == total || Math.ceil(total / 10) == page;

  moreBtn.onclick = async () => {
    const query = form.query.value.trim();
    const type = form.category.value;
    const { films, total } = await searchFilms(query, type, ++page);
    showFilms(films, page);
    updateMoreBtn(total, page);
  }
}


