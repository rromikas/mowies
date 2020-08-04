import React, { useState } from "react";
import Navbar from "./Navbar";
import { connect } from "react-redux";
import { useEffect } from "react";
import { SearchMovies, SearchSeries } from "../../server/MoviesApi";
import MoviesList from "./MoviesList";
import Footer from "./Footer";
import Paigination from "../utility/Paigination";
import { SearchReviews } from "../../server/DatabaseApi";
import ReviewsList from "./ReviewsList";
import store from "../../store/store";

const maxResultsPerPage = 15;

const SearchResults = ({ search, settings }) => {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState([]);

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
        if (search.category === "Reviews") {
          let reviews = await SearchReviews(search.query);
          {
            if (!reviews.error) {
              setReviews(reviews);
            }
          }
        } else {
          let arr = [];
          if (search.category === "Movies" || search.category === "All") {
            let movies = await SearchMovies(
              search.query,
              settings.movies_api_key
            );
            if (movies.results) {
              arr = arr.concat(movies.results);
            } else {
              onFail();
            }
          }
          if (search.category === "Series" || search.category === "All") {
            let series = await SearchSeries(
              search.query,
              settings.movies_api_key
            );
            if (series.results) {
              arr = arr.concat(series.results);
            } else {
              onFail();
            }
          }
          setResults(arr);
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
        <div className="row no-gutters flex-grow-0">
          <div className="col-60" style={{ height: "100px" }}></div>
          <Navbar></Navbar>
        </div>
        <div className="row no-gutters flex-grow-1">
          <div className="col-60 d-flex flex-column">
            <div className="row no-gutters flex-grow-1 justify-content-center">
              <div className="col-60 p-5 text-white content-container d-flex flex-column">
                <div className="row no-gutters flex-grow-1">
                  <div className="col-60 mb-4">
                    <div className="row no-gutters h5">Search Results</div>
                    <div className="row no-gutters text-muted border-bottom pb-3">
                      Showing all results
                    </div>
                  </div>
                  <div className="col-60">
                    {search.category === "Reviews" ? (
                      <ReviewsList reviews={reviews}></ReviewsList>
                    ) : (
                      <MoviesList
                        movies={results.slice(
                          (page - 1) * maxResultsPerPage,
                          (page - 1) * maxResultsPerPage + maxResultsPerPage
                        )}
                      ></MoviesList>
                    )}
                  </div>
                </div>
                <div className="row no-gutters flex-grow-0">
                  <div className="col-60">
                    <div className="py-2"></div>
                    <Paigination
                      current={page}
                      setCurrent={setPage}
                      count={
                        search.category === "Reviews"
                          ? Math.ceil(reviews.length / maxResultsPerPage)
                          : Math.ceil(results.length / maxResultsPerPage)
                      }
                      classNames={{
                        notSelected: "input-dark",
                        selected: "input-dark-selected",
                      }}
                    ></Paigination>
                  </div>
                </div>
              </div>
            </div>
            <div className="row no-gutters flex-grow-0 align-items-end">
              <div className="col-60">
                <Footer></Footer>
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
