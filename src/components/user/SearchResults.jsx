import React, { useState } from "react";
import { connect } from "react-redux";
import { useEffect } from "react";
import { SearchMovies, SearchSeries } from "../../server/MoviesApi";
import MoviesList from "./MoviesList";
import Footer from "./Footer";
import Paigination from "../utility/Paigination";
import { SearchReviews } from "../../server/DatabaseApi";
import ReviewsList from "./ReviewsList";
import store from "../../store/store";
import { Reviews } from "../../Data";

const maxResultsPerPage = 15;

const SearchResults = ({ search, settings }) => {
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);

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
          {
            if (!reviews.error) {
              setReviews(reviews);
            }
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
  }, [search]);
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
                      <React.Fragment>
                        <div className="row no-gutters h5 mb-2">
                          Movies ({movies.length})
                        </div>
                        <MoviesList movies={movies}></MoviesList>
                      </React.Fragment>
                    ) : (
                      ""
                    )}
                    {series.length ? (
                      <React.Fragment>
                        <div className="row no-gutters h5 mb-2">
                          Series ({series.length})
                        </div>
                        <MoviesList movies={series}></MoviesList>
                      </React.Fragment>
                    ) : (
                      ""
                    )}

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
