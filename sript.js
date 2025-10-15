const API = "http://www.omdbai.com";
const key = "888cc6de";
const ENDPOINT = `${API}/?apikey=${key}`;
console.log("ENDPOINT", ENDPOINT);
const searchBtn = document.getElementById("searchBtn");
const form = document.getElementById("form");


async function searchFilms(query) {
  try {
    const url = `${ENDPOINT}&s=${query}`
    const response = await fetch(url);
    console.log("response", response)
    if (!response.ok) {
      throw new Error(response.statusText)
    };
    const resultFilms = await response.json();
    console.log("result", resultFilms)
  } catch (e) {
    console.log("error", e);
  };
}


searchBtn.onclick = (e) => {
  e.preventDefault();
  searchFilms(`matrix`);
}

