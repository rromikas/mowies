import React, { useState, useEffect, useRef } from "react";
import { GetMovie, GetCredits } from "../server/MoviesApi";
import { Movie as MovieData, Credits, Reviews } from "../Data";
import ReactionButton from "./ReactionButton";
import date from "date-and-time";
import { MdPlaylistAdd, MdMovieCreation } from "react-icons/md";
import Popover from "./utility/Popover";
import Modal from "./utility/Modal";
import TrailerPlayer from "./TrailerPlayer";
import MovieReviews from "./MovieReviews";
import { connect } from "react-redux";
import { FormatDuration } from "../utilities/Functions";
import Navbar from "./Navbar";
import { FindOrCreateMovie } from "../server/DatabaseApi";

const Movie = (props) => {
  const movieId = props.match.params.movieId;
  const ratings = props.ratings;
  //user will be needed to write comments on reviews and to add reviews
  const user = props.user;

  const [movie, setMovie] = useState({
    poster_path: "",
    genres: [],
    title: "",
    overview: "",
    director: "",
    cast: [],
    runtime: 0,
    release_date: "",
  });

  //boolean variable to display trailer modal or not.
  const [openTrailer, setOpenTrailer] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function getData() {
      if (movieId) {
        let data = await GetMovie(movieId);
        setMovie((prev) => Object.assign({}, prev, data));
        let credits = await GetCredits(movieId);
        let director = credits.crew.find((x) => x.job === "Director").name;
        let cast = credits.cast.map((x) => x.name);
        data.director = director;
        data.cast = cast;
        setMovie((prev) => Object.assign({}, prev, { director, cast }));
        // let storedMovie = await FindOrCreateMovie(data);
        // console.log("Stored movie", storedMovie);
      }
    }
    getData();
  }, [movieId]);

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
      <div className="col-60 bg-root" style={{ height: "72px" }}></div>
      <Navbar></Navbar>
      <Modal open={openTrailer} onClose={() => setOpenTrailer(false)}>
        <TrailerPlayer movieId={movieId}></TrailerPlayer>
      </Modal>
      <div className="col-60 text-white px-md-5 py-5 px-4 content-container">
        {/* <div className="row no-gutters border-bottom py-4">
          <div className="col-60 h1">Movie Details</div>
          <div className="col-60">
            Title, year, duration and all other details
          </div>
        </div> */}
        <div className="row no-gutters py-5 mb-5">
          <div className="col-auto pr-5 d-none d-lg-block">
            <img
              style={{ borderRadius: "25px" }}
              width="300px"
              src={`https://image.tmdb.org/t/p/w342/${movie.poster_path}`}
            ></img>
          </div>
          <div className="col position-relative">
            <div
              className="row no-gutters position-relative"
              style={{ zIndex: 5 }}
            >
              <div className="col-60">
                <div className="row no-gutters h1">
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
                    onClick={() => setOpenTrailer(true)}
                  >
                    Play Trailer
                  </div>
                  <Popover
                    theme="dark"
                    position="top"
                    content={<div className="p-3">Add to wishlist</div>}
                    trigger="mouseenter"
                  >
                    <div className="btn-custom btn-custom-iconic">
                      <MdPlaylistAdd
                        fontSize="34px"
                        style={{ marginRight: "-5px" }}
                      ></MdPlaylistAdd>
                    </div>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MovieReviews
          initialData={Reviews}
          movie={movie}
          user={user}
        ></MovieReviews>
      </div>
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

export default connect(mapp)(Movie);
