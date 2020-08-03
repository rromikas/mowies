import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import MoviesList from "./MoviesList";
import { MoviesGenresMap } from "../../../Data";

const extractGenres = (movies) => {
  let genres = [];
  movies.forEach((x) => {
    x.movie_genres.forEach((g) => {
      if (g.name) {
        if (!genres.includes(g.name)) {
          genres.push(g.name);
        }
      } else {
        if (!genres.includes(MoviesGenresMap[g])) {
          genres.push(MoviesGenresMap[g]);
        }
      }
    });
  });
  return genres;
};

const Wishlist = ({ movies }) => {
  const [selectedGenre, setSelectedGenre] = useState(0);
  const genres = extractGenres(movies);
  return (
    <div className="col-60">
      <div className="row no-gutters justify-content-between text-light align-items-center mb-4">
        <div className="col-md col-60">
          <SimpleBar
            style={{
              padding: "14px 0",
              maxWidth: "100%",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {genres.map((x, i) => (
              <div
                onClick={() => {
                  setSelectedGenre(i);
                }}
                style={{ display: "inline-block" }}
                key={`genre-for-popular-movie-${i}`}
                className={`px-4 ${
                  selectedGenre === i
                    ? "btn-tertiary-selected text-white"
                    : "btn-tertiary text-light-white"
                }`}
              >
                {x}
              </div>
            ))}
          </SimpleBar>
        </div>
      </div>
      <MoviesList
        movies={movies.filter((x) =>
          x.movie_genres
            .map((x) => MoviesGenresMap[x.id ? x.id : x])
            .includes(genres[selectedGenre])
        )}
      ></MoviesList>
    </div>
  );
};

export default Wishlist;