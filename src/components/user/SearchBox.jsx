import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import store from "../../store/store";
import Select from "../utility/Select";
import history from "../../History";
import { BsSearch } from "react-icons/bs";
import { SearchReviews } from "../../server/DatabaseApi";
import { SearchMovies, SearchSeries } from "../../server/MoviesApi";
import MoviesListMinified from "./MoviesListMinified";
import ReviewsListMinified from "./ReviewsListMinified";

const SearchBox = (props) => {
  const categories = ["All", "Movies", "Series", "Reviews"];
  const category = props.search.category;
  const settings = props.settings;
  const [query, setQuery] = useState("");
  const [reviews, setReviews] = useState([]);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [populateBox, setPopulateBox] = useState(false);
  const queryCleaned = useRef(false);

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
      if (query) {
        setPopulateBox(true);
        queryCleaned.current = false;
        if (category === "Reviews" || category === "All") {
          let reviews = await SearchReviews(query);
          {
            if (!reviews.error) {
              if (!queryCleaned.current) {
                setReviews(reviews.slice(0, 5));
              }
            }
          }
        } else {
          setReviews([]);
        }

        if (category === "Movies" || category === "All") {
          let movies = await SearchMovies(query, settings.movies_api_key);

          if (movies.results) {
            if (!queryCleaned.current) {
              setMovies(movies.results.slice(0, 10));
            }
          } else {
            onFail();
          }
        } else {
          setMovies([]);
        }
        if (category === "Series" || category === "All") {
          let series = await SearchSeries(query, settings.movies_api_key);
          if (series.results) {
            if (!queryCleaned.current) {
              setSeries(series.results.slice(0, 10));
            }
          } else {
            onFail();
          }
        } else {
          setSeries([]);
        }
      } else {
        queryCleaned.current = true;
        setPopulateBox(false);
        setMovies([]);
        setSeries([]);
        setReviews([]);
      }
    }
    getData();
  }, [query, category]);

  return (
    <div className="row no-gutters w-100">
      <div className="col-60 position-relative">
        <div className="row no-gutters">
          <Select
            popoverClass="col-auto"
            items={categories}
            onSelect={(index) =>
              store.dispatch({
                type: "UPDATE_SEARCH",
                search: { category: categories[index] },
              })
            }
            popoverWidth={"150px"}
            className="col-auto input-prepend-select"
            btnName={category}
          ></Select>
          <div className="col position-relative">
            <input
              onBlur={async () => {
                await new Promise((resolve) => setTimeout(resolve, 500));
                setPopulateBox(false);
              }}
              onFocus={async () => setPopulateBox(true)}
              value={query}
              onKeyUp={(e) => {
                if (e.keyCode === 13) {
                  setQuery("");
                  store.dispatch({
                    type: "UPDATE_SEARCH",
                    search: { query },
                  });
                  history.push("/search");
                }
              }}
              onChange={(e) => {
                e.persist();
                setQuery(e.target.value);
              }}
              type="text"
              spellCheck={false}
              className={`w-100 input`}
            ></input>
            <BsSearch
              onClick={() => history.push("/search")}
              fontSize="24px"
              className="position-absolute text-white cursor-pointer"
              style={{ top: 0, bottom: 0, right: "20px", margin: "auto" }}
            ></BsSearch>
          </div>
        </div>
        <div
          className="row no-gutters position-absolute px-3 bg-white w-100 overflow-auto"
          style={{ top: `50px`, left: 0, maxHeight: "500px" }}
        >
          <div className="col-60">
            {populateBox ? (
              <React.Fragment>
                {movies.length ? (
                  <React.Fragment>
                    <div className="row no-gutters pt-3 pb-1 font-weight-bold">
                      Movies ({movies.length})
                    </div>
                    <MoviesListMinified
                      onClick={() => setQuery("")}
                      movies={movies}
                    ></MoviesListMinified>
                  </React.Fragment>
                ) : (
                  ""
                )}
                {series.length ? (
                  <React.Fragment>
                    <div className="row no-gutters pt-3 pb-1 font-weight-bold">
                      Series ({series.length})
                    </div>
                    <MoviesListMinified
                      movies={series}
                      onClick={() => setQuery("")}
                    ></MoviesListMinified>
                  </React.Fragment>
                ) : (
                  ""
                )}
                {reviews.length ? (
                  <React.Fragment>
                    <div className="row no-gutters pt-3 pb-1 font-weight-bold">
                      Reviews ({reviews.length})
                    </div>
                    <ReviewsListMinified
                      reviews={reviews}
                      onClick={() => setQuery("")}
                    ></ReviewsListMinified>
                  </React.Fragment>
                ) : (
                  ""
                )}
              </React.Fragment>
            ) : (
              ""
            )}
          </div>
          <div className="col-60"></div>
        </div>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    user: state.user,
    search: state.search,
    settings: state.settings,
    ...ownProps,
  };
}

export default connect(mapp)(SearchBox);
