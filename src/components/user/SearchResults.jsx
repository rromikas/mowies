import React, { useState } from "react";
import { connect } from "react-redux";
import { useEffect } from "react";
import { SearchMovies, SearchSeries } from "../../server/MoviesApi";
import MoviesList from "./MoviesList";
import { SearchReviews } from "../../server/DatabaseApi";
import ReviewsList from "./ReviewsList";
import store from "../../store/store";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { OfficialMoviesGenres, OfficialSeriesGenres } from "../../Data";

const extractGenres = (movies) => {
  let genres = { 0: "All" };
  movies.forEach((x) => {
    x.genre_ids.forEach((gid) => {
      let genre = x.title // movies have title, series - name
        ? OfficialMoviesGenres.find((g) => g.id === gid)
        : OfficialSeriesGenres.find((g) => g.id === gid);
      if (genre && genre.name) {
        if (!(gid in genres)) {
          genres[gid] = genre.name;
        }
      } else {
      }
    });
  });
  return genres;
};

const SearchResults = ({ search, settings }) => {
  const [reviews, setReviews] = useState([]);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [selectedMovieGenre, setSelectedMovieGenre] = useState(0);
  const [selectedSerieGenre, setSelectedSerieGenre] = useState(0);
  const category = search.category;

  const onFail = () => {
    store.dispatch({
      type: "SET_NOTIFICATION",
      notification: {
        title: "Error",
        message: "You need to provide valid api key in admin dashboard",
        type: "failure",
      },
    });
  };

  useEffect(() => {
    async function getData() {
      if (search.query) {
        if (category === "Reviews" || category === "All") {
          let reviews = await SearchReviews(search.query);
          if (!reviews.error) {
            setReviews(reviews);
          }
        } else {
          setReviews([]);
        }
        if (category === "Movies" || category === "All") {
          let movies = await SearchMovies(
            search.query,
            settings.movies_api_key
          );
          if (movies.results) {
            setMovies(movies.results);
          } else {
            onFail();
          }
        } else {
          setMovies([]);
        }
        if (category === "Series" || category === "All") {
          let series = await SearchSeries(
            search.query,
            settings.movies_api_key
          );
          if (series.results) {
            setSeries(series.results);
          } else {
            onFail();
          }
        } else {
          setSeries([]);
        }
      }
    }
    getData();
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const moviesGenres = extractGenres(movies);
  const seriesGenres = extractGenres(series);
  return (
    <div
      className="row no-gutters justify-content-center bg-over-root"
      style={{ minHeight: window.innerHeight }}
    >
      <div className="col-60 d-flex flex-column">
        <div className="row no-gutters flex-grow-0"></div>
        <div className="row no-gutters flex-grow-1">
          <div className="col-60 d-flex flex-column">
            <div className="row no-gutters flex-grow-1 justify-content-center">
              <div className="col-60 p-5 text-white content-container d-flex flex-column">
                <div className="row no-gutters flex-grow-1">
                  <div className="col-60 mb-4">
                    <div className="row no-gutters h4">Search Results</div>
                    <div className="row no-gutters text-muted border-bottom pb-3">
                      Showing all results
                    </div>
                  </div>
                  <div className="col-60">
                    {movies.length ? (
                      <div className="row no-gutters h5 mb-2">
                        Movies ({movies.length})
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="row no-gutters justify-content-end text-light align-items-center mb-4">
                      <div className="col-auto">
                        {Object.keys(moviesGenres).length > 1 ? (
                          <SimpleBar
                            style={{
                              padding: "14px 0",
                              width: "100%",
                              overflowX: "auto",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {Object.keys(moviesGenres).map((x, i) => (
                              <div
                                onClick={() => {
                                  setSelectedMovieGenre(x);
                                }}
                                style={{ display: "inline-block" }}
                                key={`genre-for-popular-movie-${i}`}
                                className={`px-4 ${
                                  +selectedMovieGenre === +x
                                    ? "btn-tertiary-selected text-white"
                                    : "btn-tertiary text-light-white"
                                }`}
                              >
                                {moviesGenres[x]}
                              </div>
                            ))}
                          </SimpleBar>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-60">
                    {movies.length ? (
                      <React.Fragment>
                        <MoviesList
                          movies={movies.filter((x) => {
                            return (
                              x.genre_ids.includes(+selectedMovieGenre) ||
                              +selectedMovieGenre === 0
                            );
                          })}
                        ></MoviesList>
                      </React.Fragment>
                    ) : (
                      ""
                    )}
                    <div className="py-2 row no-gutters"></div>
                    <div className="row no-gutters">
                      <div className="col-60">
                        {series.length ? (
                          <div className="row no-gutters h5 mb-2">
                            Series ({series.length})
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="row no-gutters justify-content-end text-light align-items-center mb-4">
                          <div className="col-auto">
                            {Object.keys(seriesGenres).length > 1 ? (
                              <SimpleBar
                                style={{
                                  padding: "14px 0",
                                  width: "100%",
                                  overflowX: "auto",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {Object.keys(seriesGenres).map((x, i) => (
                                  <div
                                    onClick={() => {
                                      setSelectedSerieGenre(x);
                                    }}
                                    style={{ display: "inline-block" }}
                                    key={`genre-for-popular-movie-${i}`}
                                    className={`px-4 ${
                                      +selectedSerieGenre === +x
                                        ? "btn-tertiary-selected text-white"
                                        : "btn-tertiary text-light-white"
                                    }`}
                                  >
                                    {seriesGenres[x]}
                                  </div>
                                ))}
                              </SimpleBar>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {series.length ? (
                      <React.Fragment>
                        <MoviesList
                          movies={series.filter((x) => {
                            return (
                              x.genre_ids.includes(+selectedSerieGenre) ||
                              +selectedSerieGenre === 0
                            );
                          })}
                        ></MoviesList>
                      </React.Fragment>
                    ) : (
                      ""
                    )}
                    <div className="py-2 row no-gutters"></div>
                    {reviews.length ? (
                      <React.Fragment>
                        <div className="row no-gutters h5 mb-2">
                          Reviews ({reviews.length})
                        </div>
                        <ReviewsList reviews={reviews}></ReviewsList>
                      </React.Fragment>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    settings: state.settings,
    search: state.search,
    ...ownProps,
  };
}

export default connect(mapp)(SearchResults);
