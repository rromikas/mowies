// const apikey = "3a194d2f01cf050ac9ff97073d4a009c";
const origin = "https://api.themoviedb.org/3";

const FormatRequestUrl = (path, params = [], apiKey) => {
  return `${origin}${path}?api_key=${apiKey}&${["language=en-US"]
    .concat(params)
    .join("&")}`;
};

export const GetTrendingMovies = () => {
  return fetch(
    FormatRequestUrl(
      "/trending/movie/week",
      [],
      "3a194d2f01cf050ac9ff97073d4a009c"
    )
  ).then((res) => res.json());
};

export const GetPopularMoviesByGenre = (genres, apiKey) => {
  return fetch(
    FormatRequestUrl(
      "/discover/movie",
      ["sort_by=popularity.desc", `with_genres=${genres.join(",")}`],
      apiKey
    )
  ).then((res) => res.json());
};

export const GetTrailers = (movieId, apiKey) => {
  let finalId =
    movieId.substring(0, 6) === "serie-" ? movieId.substring(6) : movieId;
  return fetch(
    FormatRequestUrl(
      `/${
        movieId.substring(0, 6) === "serie-" ? "tv" : "movie"
      }/${finalId}/videos`,
      [],
      apiKey
    )
  ).then((res) => res.json());
};

export const GetOfficialMoviesGenres = () => {
  return fetch(FormatRequestUrl("/genre/movie/list")).then((res) => res.json());
};

export const GetTvShow = (movieId, apiKey) => {
  return fetch(FormatRequestUrl(`/tv/${movieId}`, [], apiKey)).then((res) =>
    res.json()
  );
};

export const GetMovie = (movieId, apiKey) => {
  return fetch(FormatRequestUrl(`/movie/${movieId}`, [], apiKey)).then((res) =>
    res.json()
  );
};

export const GetCredits = (movieId, apiKey) => {
  let finalId =
    movieId.substring(0, 6) === "serie-" ? movieId.substring(6) : movieId;
  return fetch(
    FormatRequestUrl(
      `/${
        movieId.substring(0, 6) === "serie-" ? "tv" : "movie"
      }/${finalId}/credits`,
      [],
      apiKey
    )
  ).then((res) => res.json());
};

export const SearchMovies = (query, apiKey) => {
  let url = FormatRequestUrl("/search/movie", [`query=${query}`], apiKey);
  return fetch(url).then((res) => res.json());
};

export const SearchSeries = (query, apiKey) => {
  let url = FormatRequestUrl(
    "/search/tv",
    [`query=${encodeURI(query)}`],
    apiKey
  );
  return fetch(url).then((res) => res.json());
};
