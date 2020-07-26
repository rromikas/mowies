const apikey = "3a194d2f01cf050ac9ff97073d4a009c";
const origin = "https://api.themoviedb.org/3";

const FormatRequestUrl = (path, params) => {
  return `${origin}${path}?api_key=${apikey}&${["language=en-US"]
    .concat(params)
    .join("&")}`;
};

export const GetPopularMoviesByGenre = (genres) => {
  return fetch(
    FormatRequestUrl("/discover/movie", [
      "sort_by=popularity.desc",
      `with_genres=${genres.join(",")}`,
    ])
  ).then((res) => res.json());
};

export const GetTrailers = (movieId) => {
  return fetch(FormatRequestUrl(`/movie/${movieId}/videos`)).then((res) =>
    res.json()
  );
};

export const GetOfficialMoviesGenres = () => {
  return fetch(FormatRequestUrl("/genre/movie/list")).then((res) => res.json());
};

export const GetMovie = (movieId) => {
  return fetch(FormatRequestUrl(`/movie/${movieId}`)).then((res) => res.json());
};

export const GetCredits = (movieId) => {
  return fetch(FormatRequestUrl(`/movie/${movieId}/credits`)).then((res) =>
    res.json()
  );
};

export const SearchMovies = (query) => {
  let url = FormatRequestUrl("/search/movie", [`query=${query}`]);
  return fetch(url).then((res) => res.json());
};

export const SearchSeries = (query) => {
  let url = FormatRequestUrl("/search/tv", [`query=${encodeURI(query)}`]);
  return fetch(url).then((res) => res.json());
};
