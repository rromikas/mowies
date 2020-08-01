import React, { useState } from "react";
import Navbar from "./Navbar";
import { connect } from "react-redux";
import { useEffect } from "react";
import { SearchMovies, SearchSeries } from "../../server/MoviesApi";
import MoviesList from "./MoviesList";

const SearchResults = ({ search }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function getData() {
      if (search.query) {
        if (search.category === "Movies") {
          let movies = await SearchMovies(search.query);
          setResults(movies.results);
        } else if (search.category === "Series") {
          let series = await SearchSeries(search.query);
          setResults(series.results);
        }
      }
    }
    getData();
  }, [search]);
  return (
    <div className="row no-gutters justify-content-center bg-over-root">
      <div className="col-60 bg-root">
        <Navbar></Navbar>
      </div>
      <div className="col-60 p-5 text-white " style={{ maxWidth: "1500px" }}>
        <div className="row no-gutters py-3 border-bottom">
          <div className="col-60">
            <div className="row no-gutters h1">Search Results</div>
            <div className="row no-gutters text-muted">Showing all results</div>
          </div>
        </div>
        <MoviesList movies={results}></MoviesList>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    search: state.search,
    ...ownProps,
  };
}

export default connect(mapp)(SearchResults);
