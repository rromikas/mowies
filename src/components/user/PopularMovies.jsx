import React, { useState, useEffect } from "react";
import MoviesList from "./MoviesList";
import { GetPopularMoviesByGenre } from "../../server/MoviesApi";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

const genresPairs = [
  { name: "All", genresIds: [] },
  { name: "Suspense & Thriller", genresIds: [27, 53] },
  { name: "Action & Adventure", genresIds: [28, 12] },
  { name: "Romance", genresIds: [10749] },
  { name: "Crime & Drama", genresIds: [80, 18] },
  { name: "Sci-Fi", genresIds: [878] },
  { name: "History & Documentary", genresIds: [36, 99] },
];

const PopularMovies = () => {
  const [genresIds, setGenresIds] = useState([]);
  const [genreName, setGenreName] = useState("All");
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    async function getData() {
      let data = await GetPopularMoviesByGenre(genresIds);
      setMovies(data.results.slice(0, 5));
    }
    getData();
  }, [genresIds]);

  return (
    <div className="row no-gutters justify-content-center text-white">
      <div className="col-60 py-5 px-md-5 px-4 content-container">
        <div className="row no-gutters h1">Popular Movies</div>
        <div className="row no-gutters justify-content-between text-light align-items-center mb-4">
          <div className="col-auto pr-5">Most watched movies by days</div>
          <div className="col-md col-60">
            <SimpleBar
              style={{
                padding: "14px 0",
                maxWidth: "100%",
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              {genresPairs.map((x, i) => (
                <div
                  onClick={() => {
                    setGenreName(x.name);
                    setGenresIds(x.genresIds);
                  }}
                  style={{ display: "inline-block" }}
                  key={`genre-for-popular-movie-${i}`}
                  className={`px-4 ${
                    genreName === x.name
                      ? "btn-tertiary-selected text-white"
                      : "btn-tertiary text-light-white"
                  }`}
                >
                  {x.name}
                </div>
              ))}
            </SimpleBar>
          </div>
        </div>
        <div className="row no-gutters">
          <MoviesList movies={movies}></MoviesList>
        </div>
      </div>
    </div>
  );
};

export default PopularMovies;
