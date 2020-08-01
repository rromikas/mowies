import React, { useState } from "react";
import {
  TrendingMovies,
  OfficialMoviesGenres,
  OfficialSeriesGenres,
} from "../../Data";
import history from "../../History";
import WishlistButton from "./WishlistButton";
import { connect } from "react-redux";
import ReactionButton from "./ReactionButton";
import { BsHeart, BsEye } from "react-icons/bs";

const MoviesList = ({ movies, user, ratings }) => {
  const [hovered, setHovered] = useState(-1);

  return (
    <div className="row">
      {movies.map((x, i) => (
        <div
          onMouseOver={() => {
            setHovered(i);
          }}
          onMouseLeave={() => setHovered(-1)}
          key={`result-${i}`}
          className="col-lg-12 col-md-15 col-sm-20 col-60 p-3 text-white"
        >
          <div
            className="row no-gutters justify-content-end position-relative px-2 d-none d-sm-flex"
            style={{ marginBottom: "-51px", zIndex: 5 }}
          >
            <WishlistButton movie={x} user={user}></WishlistButton>
          </div>
          <div className="row no-gutters">
            <div className="col-sm-60 col-auto mr-3 mr-sm-0">
              <div
                onClick={() => history.push(`/movie/${x.id}`)}
                className="row no-gutters mb-2 position-relative movies-list-image"
              >
                <img
                  onClick={() => history.push(`/movie/${x.id}`)}
                  width="100%"
                  style={{ borderRadius: "13px" }}
                  src={
                    x.poster_path
                      ? `https://image.tmdb.org/t/p/w342${x.poster_path}`
                      : "https://critics.io/img/movies/poster-placeholder.png"
                  }
                ></img>
                <div
                  className="col-60 h-100 text-white d-flex flex-column justify-content-center"
                  style={{
                    left: 0,
                    top: 0,
                    background: "rgba(0, 0, 0, 0.5)",
                    position: "absolute",
                    opacity: hovered === i ? 1 : 0,
                    zIndex: 4,
                    borderRadius: "13px",
                    transition: "opacity 0.3s",
                    border: "3px solid #00db54",
                  }}
                >
                  <div className="row no-gutters flex-grow-0 w-100 align-items-center">
                    <div className="col-60 mb-4 text-center">
                      <div className="row no-gutters justify-content-center">
                        <BsEye fontSize="45px"></BsEye>
                      </div>
                      <div className="row no-gutters justify-content-center h2">
                        {ratings[x.id] ? ratings[x.id].views : 0}
                      </div>
                    </div>
                    <div className="col-60 text-center">
                      <div className="row no-gutters justify-content-center">
                        <BsHeart fontSize="45px"></BsHeart>
                      </div>
                      <div className="row no-gutters justify-content-center h2">
                        {ratings[x.id] ? ratings[x.id].wishlisted : 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-60 col">
              <div className="row no-gutters text-title-md mb-0">
                {x.title ? x.title : x.name}
              </div>
              <div className="row no-gutters text-muted mb-2">
                <div className="text-truncate">
                  {x.genre_ids.length
                    ? x.genre_ids
                        .map((gid) =>
                          x.title // movies have title, series - name
                            ? OfficialMoviesGenres.find((g) => g.id === gid)
                                .name
                            : OfficialSeriesGenres.find((g) => g.id === gid)
                                .name
                        )
                        .join("/")
                    : "unknown"}
                </div>
              </div>
              <div className="row no-gutters mb-2">
                <ReactionButton
                  selected={
                    user.ratings[x.id]
                      ? user.ratings[x.id].rate_type === "excellent_rate"
                      : false
                  }
                  movie={x}
                  emoji="fire"
                  className="mr-1 mb-2"
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
                  className="mr-1 mb-2"
                  value={ratings[x.id] ? ratings[x.id].good_rate : 0}
                ></ReactionButton>
                <ReactionButton
                  selected={
                    user.ratings[x.id]
                      ? user.ratings[x.id].rate_type === "ok_rate"
                      : false
                  }
                  movie={x}
                  className="mr-1 mb-2"
                  emoji="heavy_division_sign"
                  value={ratings[x.id] ? ratings[x.id].ok_rate : 0}
                ></ReactionButton>
                <ReactionButton
                  emoji="shit"
                  value={ratings[x.id] ? ratings[x.id].bad_rate : 0}
                  selected={
                    user.ratings[x.id]
                      ? user.ratings[x.id].rate_type === "bad_rate"
                      : false
                  }
                  movie={x}
                ></ReactionButton>
              </div>
              <div className="row no-gutters d-flex d-sm-none">
                <WishlistButton movie={x} user={user}></WishlistButton>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    user: state.user,
    ratings: state.ratings,
    ...ownProps,
  };
}

export default connect(mapp)(MoviesList);
