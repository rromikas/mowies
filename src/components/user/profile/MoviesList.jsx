import React, { useState } from "react";
import { MoviesGenresMap, SeriesGenresMap } from "../../../Data";
import history from "../../../History";
import WishlistButton from "../WishlistButton";
import { connect } from "react-redux";
import ReactionButton from "../ReactionButton";
import { BsHeart, BsEye } from "react-icons/bs";
import Paigination from "../../utility/Paigination";

const MoviesList = ({ movies, user, ratings }) => {
  const [hovered, setHovered] = useState(-1);
  const [page, setPage] = useState(1);
  const maxItemsPerPage = 12;

  return (
    <React.Fragment>
      <div className="row">
        {movies.map((x, i) => {
          let formatedMovie = {
            id: x.movie_id,
            title: x.movie_title,
            poster_path: x.movie_poster,
            genres: x.movie_genres,
          };
          return (
            <div
              key={`result-${i}`}
              className="col-lg-12 col-md-15 col-sm-20 col-60 p-3 text-white"
            >
              <div
                className="row no-gutters justify-content-end position-relative px-2 d-none d-sm-flex"
                style={{ marginBottom: "-51px", zIndex: 5 }}
              >
                <WishlistButton
                  movie={formatedMovie}
                  user={user}
                ></WishlistButton>
              </div>
              <div className="row no-gutters">
                <div className="col-sm-60 col-auto mr-3 mr-sm-0">
                  <div
                    onClick={() => history.push(`/movie/${formatedMovie.id}`)}
                    className="row no-gutters mb-2 position-relative movies-list-image"
                    onMouseOver={() => {
                      setHovered(i);
                    }}
                    onMouseLeave={() => setHovered(-1)}
                  >
                    <img
                      onClick={() => history.push(`/movie/${formatedMovie.id}`)}
                      width="100%"
                      style={{ borderRadius: "13px" }}
                      src={
                        formatedMovie.poster_path
                          ? `https://image.tmdb.org/t/p/w342${formatedMovie.poster_path}`
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
                            {ratings[formatedMovie.id]
                              ? ratings[formatedMovie.id].views
                              : 0}
                          </div>
                        </div>
                        <div className="col-60 text-center">
                          <div className="row no-gutters justify-content-center">
                            <BsHeart fontSize="45px"></BsHeart>
                          </div>
                          <div className="row no-gutters justify-content-center h2">
                            {ratings[formatedMovie.id]
                              ? ratings[formatedMovie.id].wishlisted
                              : 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-60 col">
                  <div className="row no-gutters text-title-md mb-0">
                    {formatedMovie.title}
                  </div>
                  <div className="row no-gutters text-muted mb-2">
                    <div className="text-truncate">
                      {formatedMovie.genres.length
                        ? formatedMovie.genres
                            .map(
                              (gid) => MoviesGenresMap[gid.id ? gid.id : gid]
                            )
                            .join("/")
                        : "unknown"}
                    </div>
                  </div>
                  <div className="row no-gutters mb-2">
                    <ReactionButton
                      selected={
                        user.ratings[formatedMovie.id]
                          ? user.ratings[formatedMovie.id].rate_type ===
                            "excellent_rate"
                          : false
                      }
                      movie={formatedMovie}
                      emoji="fire"
                      className="mr-1 mb-2"
                      value={
                        ratings[formatedMovie.id]
                          ? ratings[formatedMovie.id].excellent_rate
                          : 0
                      }
                    ></ReactionButton>
                    <ReactionButton
                      selected={
                        user.ratings[formatedMovie.id]
                          ? user.ratings[formatedMovie.id].rate_type ===
                            "good_rate"
                          : false
                      }
                      movie={formatedMovie}
                      emoji="heart"
                      className="mr-1 mb-2"
                      value={
                        ratings[formatedMovie.id]
                          ? ratings[formatedMovie.id].good_rate
                          : 0
                      }
                    ></ReactionButton>
                    <ReactionButton
                      selected={
                        user.ratings[formatedMovie.id]
                          ? user.ratings[formatedMovie.id].rate_type ===
                            "ok_rate"
                          : false
                      }
                      movie={formatedMovie}
                      className="mr-1 mb-2"
                      emoji="heavy_division_sign"
                      value={
                        ratings[formatedMovie.id]
                          ? ratings[formatedMovie.id].ok_rate
                          : 0
                      }
                    ></ReactionButton>
                    <ReactionButton
                      emoji="shit"
                      value={
                        ratings[formatedMovie.id]
                          ? ratings[formatedMovie.id].bad_rate
                          : 0
                      }
                      selected={
                        user.ratings[formatedMovie.id]
                          ? user.ratings[formatedMovie.id].rate_type ===
                            "bad_rate"
                          : false
                      }
                      movie={formatedMovie}
                    ></ReactionButton>
                  </div>
                  <div className="row no-gutters d-flex d-sm-none">
                    <WishlistButton
                      movie={formatedMovie}
                      user={user}
                    ></WishlistButton>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Paigination
        classNames={{
          notSelected: "input-dark",
          selected: "input-dark-selected",
        }}
        count={Math.ceil(movies.length / maxItemsPerPage)}
        current={page}
        setCurrent={setPage}
      ></Paigination>
    </React.Fragment>
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
