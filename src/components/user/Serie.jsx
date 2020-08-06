import React, { useState, useEffect, useRef } from "react";
import { GetMovie, GetTvShow, GetCredits } from "../../server/MoviesApi";
import ReactionButton from "./ReactionButton";
import date from "date-and-time";
import Modal from "../utility/Modal";
import TrailerPlayer from "./TrailerPlayer";
import MovieReviews from "./MovieReviews";
import { connect } from "react-redux";
import { FormatDuration } from "../../utilities/Functions";
import store from "../../store/store";
import { AddViewToMovie } from "../../server/DatabaseApi";
import WishlistButton from "./WishlistButton";
import Footer from "./Footer";
import { FaRegPaperPlane } from "react-icons/fa";
import history from "../../History";
import { BsPlayFill } from "react-icons/bs";

const Serie = (props) => {
  const movieId = props.match.params.movieId;
  const ratings = props.ratings;
  const apiKey = props.settings.movies_api_key;
  //user will be needed to write comments on reviews and to add reviews
  const user = props.user;

  const [addReviewTrigger, setAddReviewTrigger] = useState(-1);

  const [movie, setMovie] = useState({
    poster_path: "",
    genres: [],
    title: "",
    overview: "",
    director: "",
    cast: [],
    runtime: 0,
    release_date: "",
    id: "",
  });

  //boolean variable to display trailer modal or not.
  const [openTrailer, setOpenTrailer] = useState(false);

  useEffect(() => {
    //check if movie fetched from api
    if (movie.title) {
      AddViewToMovie(movie);
    }
  }, [movie.title]);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function getData() {
      if (movieId && apiKey) {
        let data = await GetTvShow(movieId, apiKey);
        setMovie((prev) =>
          Object.assign(
            {},
            prev,
            Object.assign({}, data, {
              title: data.name,
              release_date: data.first_air_date,
            })
          )
        );
        let credits = await GetCredits(movieId, apiKey);
        let directorObj = credits.crew
          ? credits.crew.find((x) => x.job === "Director")
          : null;
        let director = directorObj ? directorObj.name : "unknown";
        let cast = credits.cast ? credits.cast.map((x) => x.name) : [];
        data.director = director;
        data.cast = cast;
        setMovie((prev) => Object.assign({}, prev, { director, cast }));
      }
    }

    getData();
  }, [movieId, apiKey]);

  // const director = movie.credits.crew.find((x) => x.job === "Director");

  return (
    <div className="row no-gutters justify-content-center bg-movie-over-root position-relative">
      <div
        className="position-absolute w-100 d-block d-lg-none"
        style={{
          top: 0,
          left: 0,
        }}
      >
        <div
          className="position-relative"
          style={{ height: window.innerHeight, overflow: "hidden" }}
        >
          <div className="position-relative">
            <img
              width="100%"
              src={`https://image.tmdb.org/t/p/w342/${movie.poster_path}`}
            ></img>
            <div
              className="position-absolute w-100 h-100"
              style={{
                background: "linear-gradient(rgba(0, 0, 0, 0.3) 90%, black)",
                top: 0,
                left: 0,
              }}
            ></div>
          </div>
          <div
            className="position-absolute w-100 h-100"
            style={{
              background: "linear-gradient(rgb(0 0 0 / 30%), black)",
              top: 0,
              left: 0,
            }}
          ></div>
        </div>
      </div>
      <Modal open={openTrailer} onClose={() => setOpenTrailer(false)}>
        <TrailerPlayer
          movieId={movieId}
          onEnded={() => setOpenTrailer(false)}
        ></TrailerPlayer>
      </Modal>
      <div className="col-60 text-white px-md-5 py-5 px-4 content-container">
        <div className="row no-gutters py-5 mb-5">
          <div className="col-auto mr-5 d-none d-lg-block">
            <div className="w-100 position-relative">
              <img
                style={{ borderRadius: "25px" }}
                width="300px"
                src={`https://image.tmdb.org/t/p/w342/${movie.poster_path}`}
              ></img>
              <div
                onClick={() => history.push(`/movie/${movie.id}`)}
                className="col-60 h-100 text-white d-flex flex-center img-cover cursor-pointer"
                style={{
                  left: 0,
                  top: 0,
                  position: "absolute",
                  zIndex: 4,
                  borderRadius: "13px",
                }}
              >
                <div
                  className="square-60 rounded-circle d-flex flex-center play-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenTrailer(true);
                  }}
                >
                  <BsPlayFill
                    style={{
                      fontSize: "35px",
                      color: "white",
                      marginRight: "-5px",
                    }}
                  ></BsPlayFill>
                </div>
              </div>
            </div>
          </div>
          <div className="col position-relative">
            <div
              className="row no-gutters position-relative"
              style={{ zIndex: 5 }}
            >
              <div className="col-60">
                <div className="row no-gutters h5">
                  {movie.title} ({movie.release_date.substring(0, 4)})
                </div>
                <div className="row no-gutters text-movie-muted mb-2">
                  <div className="text-truncate">
                    {movie.genres.map((x) => x.name).join("/")}
                  </div>
                </div>
                <div className="row no-gutters mb-4">
                  <div className="col-auto font-weight-500 mr-2">Duration:</div>
                  <div className="col-auto text-movie-muted">
                    {FormatDuration(movie.runtime)}
                  </div>
                </div>
                <div className="row no-gutters mb-4 text-light">
                  {movie.overview}
                </div>
                <div className="row no-gutters mb-3">
                  <div className="col-auto">
                    <div className="row no-gutters">
                      <div className="col-auto mr-2">Director:</div>
                      <div className="col-auto mr-5 text-movie-muted">
                        {movie.director ? movie.director : "unknown"}
                      </div>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="row no-gutters">
                      <div className="col-auto mr-2">Cast:</div>
                      <div className="col">
                        <div className="row no-gutters">
                          <div
                            className="text-clamp-2 text-muted-light cursor-pointer"
                            onClick={(e) => {
                              if (
                                e.currentTarget.classList.contains(
                                  "text-clamp-2"
                                )
                              ) {
                                e.currentTarget.classList.remove(
                                  "text-clamp-2"
                                );
                              } else {
                                e.currentTarget.classList.add("text-clamp-2");
                              }
                            }}
                          >
                            {movie.cast.join("    ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row no-gutters mb-3">
                  <ReactionButton
                    selected={
                      user.ratings[movie.id]
                        ? user.ratings[movie.id].rate_type === "excellent_rate"
                        : false
                    }
                    movie={movie}
                    emoji="fire"
                    className="mr-2 mb-2"
                    value={
                      ratings[movie.id] ? ratings[movie.id].excellent_rate : 0
                    }
                  ></ReactionButton>
                  <ReactionButton
                    selected={
                      user.ratings[movie.id]
                        ? user.ratings[movie.id].rate_type === "good_rate"
                        : false
                    }
                    movie={movie}
                    emoji="heart"
                    className="mr-2 mb-2"
                    value={ratings[movie.id] ? ratings[movie.id].good_rate : 0}
                  ></ReactionButton>
                  <ReactionButton
                    selected={
                      user.ratings[movie.id]
                        ? user.ratings[movie.id].rate_type === "ok_rate"
                        : false
                    }
                    movie={movie}
                    className="mr-2 mb-2"
                    emoji="heavy_division_sign"
                    value={ratings[movie.id] ? ratings[movie.id].ok_rate : 0}
                  ></ReactionButton>
                  <ReactionButton
                    emoji="shit"
                    value={ratings[movie.id] ? ratings[movie.id].bad_rate : 0}
                    selected={
                      user.ratings[movie.id]
                        ? user.ratings[movie.id].rate_type === "bad_rate"
                        : false
                    }
                    movie={movie}
                  ></ReactionButton>
                </div>
                <div className="row no-gutters mb-5">
                  <div className="col-auto mr-2">Release date:</div>
                  <div className="col-auto text-movie-muted">
                    {date.format(new Date(movie.release_date), "MMMM DD, YYYY")}
                  </div>
                </div>
                <div className="row no-gutters justify-content-center justify-content-md-start">
                  <div
                    className="col-auto mr-3 btn-custom btn-custom-primary btn-small"
                    onClick={() => {
                      if (!user.token) {
                        store.dispatch({
                          type: "SET_NOTIFICATION",
                          notification: {
                            title: "Login required",
                            message: "You need to login to write review.",
                            type: "failure",
                          },
                        });
                      } else {
                        setAddReviewTrigger(addReviewTrigger + 1);
                      }
                    }}
                  >
                    Add Review
                    <FaRegPaperPlane
                      fontSize="20px"
                      className="ml-2"
                    ></FaRegPaperPlane>
                  </div>
                  <WishlistButton movie={movie} user={user}></WishlistButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MovieReviews
          movie={movie}
          user={user}
          addReviewTrigger={addReviewTrigger}
        ></MovieReviews>
      </div>
      <div className="col-60">
        <Footer></Footer>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    user: state.user,
    ratings: state.ratings,
    settings: state.settings,
    ...ownProps,
  };
}

export default connect(mapp)(Serie);
