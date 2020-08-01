import React, { useState } from "react";
import ReactionButton from "./ReactionButton";
import history from "../../History";
import { TrendingMovies, MoviesGenresMap } from "../../Data";

const Recommendations = ({ movies, user, ratings }) => {
  const [hovered, setHovered] = useState(-1);
  return (
    <div className="row no-gutters">
      {movies.slice(1, 7).map((x, i) => (
        <div
          onMouseOver={() => setHovered(i)}
          onMouseLeave={() => setHovered(-1)}
          className="col-20 pr-2 pb-2 text-white position-relative"
          key={`recommended-today-movie-${i}`}
        >
          <div className="position-relative">
            <img
              onClick={() => history.push(`/movie/${x.id}`)}
              width="100%"
              style={{ borderRadius: "13px" }}
              src={`https://image.tmdb.org/t/p/w154${x.poster_path}`}
            ></img>
            <div
              className="d-flex flex-center"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.4)",
                transition: "opacity 0.3s",
                opacity: hovered === i ? 1 : 0,
              }}
            >
              <div style={{ width: "auto" }}>
                <ReactionButton
                  selected={
                    user.ratings[x.id]
                      ? user.ratings[x.id].rate_type === "excellent_rate"
                      : false
                  }
                  movie={x}
                  emoji="fire"
                  className="mr-2 mb-2"
                  value={ratings[x.id] ? ratings[x.id].excellent_rate : 0}
                ></ReactionButton>
                <ReactionButton
                  selected={
                    user.ratings[x.id]
                      ? user.ratings[x.id].rate_type === "good_rate"
                      : false
                  }
                  movie={x}
                  emoji="heart"
                  className="mr-2 mb-2"
                  value={ratings[x.id] ? ratings[x.id].good_rate : 0}
                ></ReactionButton>
                <ReactionButton
                  selected={
                    user.ratings[x.id]
                      ? user.ratings[x.id].rate_type === "ok_rate"
                      : false
                  }
                  movie={x}
                  className="mr-2 mb-2"
                  emoji="heavy_division_sign"
                  value={ratings[x.id] ? ratings[x.id].ok_rate : 0}
                ></ReactionButton>
                <ReactionButton
                  selected={
                    user.ratings[x.id]
                      ? user.ratings[x.id].rate_type === "bad_rate"
                      : false
                  }
                  movie={x}
                  emoji="shit"
                  value={ratings[x.id] ? ratings[x.id].bad_rate : 0}
                ></ReactionButton>
              </div>
            </div>
          </div>
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
