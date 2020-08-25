import React, { useState, useEffect, useRef } from "react";
import MoviesList from "./MoviesList";
import { GetPopularMoviesByGenre } from "../../server/MoviesApi";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { connect } from "react-redux";

const genresPairs = [
  { name: "All", genresIds: [] },
  { name: "Suspense & Thriller", genresIds: [27, 53] },
  { name: "Action & Adventure", genresIds: [28, 12] },
  { name: "Romance", genresIds: [10749] },
  { name: "Crime & Drama", genresIds: [80, 18] },
  { name: "Sci-Fi", genresIds: [878] },
  { name: "History & Documentary", genresIds: [36, 99] },
];

const PopularMovies = ({ apiKey, settings, user }) => {
  const horizontalMenu = useRef();

  const [genresIds, setGenresIds] = useState([]);
  const [genreName, setGenreName] = useState("All");
  const [movies, setMovies] = useState([]);

  const [userWishList, setUserWishList] = useState([]);
  const [userWatchedList, setUserWatchedList] = useState([]);

  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    if (user) {
      setUserWishList(user.wishlist.map((x) => x.movie_id));
      setUserWatchedList(user.watchedlist.map((x) => x.movie_id));
    }
  }, [user]);

  useEffect(() => {
    async function getData() {
      if (apiKey && settings.no_popular_movies) {
        let data = await GetPopularMoviesByGenre(genresIds, apiKey);
        setMovies(data.results);
      }
    }
    getData();
  }, [genresIds, apiKey, settings]);

  useEffect(() => {
    horizontalMenu.current.recalculate();
  }, [movies]);

  useEffect(() => {
    if (movies) {
      setFilteredMovies(
        movies
          .filter(
            (x) =>
              !userWishList.includes(x.id.toString()) &&
              !userWatchedList.includes(x.id.toString())
          )
          .slice(0, settings.no_popular_movies)
      );
    }
  }, [userWatchedList, userWishList, movies]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="row no-gutters justify-content-center text-white">
      <div className="col-60 py-3 px-md-5 px-4 content-container">
        <div className="row no-gutters h5">
          <div
            className="col-auto"
            style={{
              padding: "6px 30px 6px 0px",
              background: "linear-gradient(to left, #ff0037, transparent)",
              borderRadius: "0 4px 4px 0",
            }}
          >
            Popular Movies
          </div>
        </div>
        <div className="row no-gutters text-light">
          Most watched movies in last 30 days
        </div>
        <div className="row no-gutters justify-content-end text-light align-items-center mb-4">
          <div className="col-auto">
            <SimpleBar
              ref={horizontalMenu}
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
          <MoviesList movies={filteredMovies}></MoviesList>
        </div>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    settings: state.settings,
    user: state.user,
    ...ownProps,
  };
}

export default connect(mapp)(PopularMovies);
