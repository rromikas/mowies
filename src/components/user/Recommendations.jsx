import React from "react";
import history from "../../History";

const Recommendations = ({ movies }) => {
  return (
    <div className="row no-gutters">
      {movies.map((x, i) => (
        <div
          className="col-sm-15 col-md-12 col-lg-15 col-60 pr-2 pb-2 text-white position-relative"
          key={`recommended-today-movie-${i}`}
        >
          <div className="row no-gutters">
            <div className="col-sm-60 col-auto mr-3 mr-sm-0">
              <img
                alt={x.movie_poster}
                className="img-clickable movies-list-image"
                onClick={() => history.push(`/movie/${x.movie_id}`)}
                width="100%"
                style={{
                  borderRadius: "13px",
                }}
                src={`https://image.tmdb.org/t/p/w154${x.movie_poster}`}
              ></img>
            </div>
            <div className="col-sm-60 col d-block d-sm-none">
              <div
                className="row no-gutters cursor-pointer"
                onClick={() => history.push(`/movie/${x.movie_id}`)}
              >
                {x.movie_title}
              </div>
              <div className="row no-gutters text-muted">
                <small className="text-truncate">{x.movie_genres}</small>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;
