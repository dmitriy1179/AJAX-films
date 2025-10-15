const API = "http://www.omdbapi.com";
const key = "888cc6de";
const ENDPOINT = `${API}/?apikey=${key}`;
const searchBtn = document.getElementById("searchBtn");
const form = document.getElementById("form");
const list = document.getElementById("list");


async function searchFilms(query, type) {
  try {
    const url = `${ENDPOINT}&s=${query}&type=${type}`
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText)
    };
    const resultFilms = await response.json();
    console.log("result", resultFilms)
    return resultFilms
  } catch (e) {
    console.error(e);
  };
}

searchBtn.onclick = async (e) => {
  const data = Object.fromEntries(new FormData(form))
  e.preventDefault();

  const query = form.query.value.trim();
  const type = form.category.value;
  if (!query) return;

  const films = await searchFilms(query, type);
  showFilms(films);
}

function showFilms(films) {
  films.Search.forEach(film => {
    list.innerHTML += `<li>${film.Title}</li>`
  })
}
