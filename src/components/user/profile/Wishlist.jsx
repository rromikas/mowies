import React, { useState, useRef, useEffect } from "react";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import MoviesList from "./MoviesList";
import { MoviesGenresMap } from "../../../Data";

const extractGenres = (movies, ratings) => {
  let genres = ["All"];
  movies.forEach((x) => {
    if (ratings[x.movie_id]) {
      ratings[x.movie_id].movie_genres.forEach((g) => {
        if (g.name) {
          if (!genres.includes(g.name)) {
            genres.push(g.name);
          }
        } else {
          if (!genres.includes(g)) {
            genres.push(g);
          }
        }
      });
    }
  });
  return genres;
};

const Wishlist = ({ movies, owner, refreshProfile, ratings }) => {
  const horizontalMenu = useRef();
  const [selectedGenre, setSelectedGenre] = useState(0);
  const genres = extractGenres(movies, ratings);

  return (
    <div className="col-60 px-0">
      <div className="row no-gutters justify-content-end text-light align-items-center mb-4">
        <div className="col-auto">
          {genres.length > 1 ? (
            <SimpleBar
              style={{
                padding: "14px 0",
                width: "100%",
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
          ) : (
            ""
          )}
        </div>
      </div>
      <MoviesList
        refreshProfile={refreshProfile}
        owner={owner}
        listType="wishlist"
        movies={movies.filter(
          (x) =>
            (ratings[x.movie_id] &&
              ratings[x.movie_id].movie_genres.includes(
                genres[selectedGenre]
              )) ||
            genres[selectedGenre] === "All"
        )}
      ></MoviesList>
    </div>
  );
};

export default Wishlist;
