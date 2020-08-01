import React, { useState } from "react";
import history from "../../History";
import { MoviesGenresMap } from "../../Data";

const Recommendations = ({ movies }) => {
  const [hovered, setHovered] = useState(-1);
  return (
    <div className="row no-gutters">
      {movies.slice(1, 7).map((x, i) => (
        <div
          className="col-20 pr-2 pb-2 text-white position-relative"
          key={`recommended-today-movie-${i}`}
        >
          <img
            className="img-clickable"
            onClick={() => history.push(`/movie/${x.id}`)}
            width="100%"
            style={{
              borderRadius: "13px",
            }}
            src={`https://image.tmdb.org/t/p/w154${x.poster_path}`}
          ></img>
          <div
            className="row no-gutters cursor-pointer"
            onClick={() => history.push(`/movie/${x.id}`)}
          >
            {x.title}
          </div>
          <div className="row no-gutters text-muted">
            <small className="text-truncate">
              {x.genre_ids.map((x) => MoviesGenresMap[x]).join("/")}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;
