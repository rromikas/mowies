import React, { useState, useEffect } from "react";
import { TrendingMovies, MoviesGenresMap } from "../../Data";
import * as API from "../../server/MoviesApi";
import history from "../../History";
import Navbar from "./Navbar";
import PopularMovies from "./PopularMovies";
import Popover from "../utility/Popover";
import MoviesList from "./MoviesList";
import TrailerPlayer from "./TrailerPlayer";
import Modal from "../utility/Modal";
import ReactionButton from "./ReactionButton";
import { FormatDuration } from "../../utilities/Functions";
import { connect } from "react-redux";
import store from "../../store/store";
import WishlistButton from "./WishlistButton";
import Recommendations from "./Recommendations";

const GetClosestValidWidth = () => {
  let backdropSizes = [300, 780, 1280];
  let closestSize = 1280;
  let minDifference = 1280;
  backdropSizes.forEach((x) => {
    let diff = Math.abs(window.innerWidth - x);
    if (diff < minDifference) {
      minDifference = diff;
      closestSize = x;
    }
  });
  return closestSize;
};

const Home = ({ publicUsers, ratings, user }) => {
  const backgroundMovieId = "516486";
  const [movies, setMovies] = useState(TrendingMovies.results);
  const [openTrailer, setOpenTrailer] = useState(false);
  const [backgroundMovie, setBackgroundMovie] = useState({
    backdrop_path: "",
    poster_path: "",
    runtime: 0,
    title: "",
    overview: "",
    id: "",
    release_date: "",
    genres: [],
  });
  useEffect(() => {
    async function getData() {
      let data = await API.GetMovie(backgroundMovieId);
      setBackgroundMovie(data);
    }
    getData();
  }, []);

  return (
    <div className="row no-gutters">
      <div className="col-60">
        <div
          className="row no-gutters align-items-end position-relative overflow-hidden"
          style={{ height: window.innerHeight }}
        >
          <div
            className="position-absolute w-100 h-100"
            style={{
              top: 0,
              left: 0,
              zIndex: 2,
              background: `linear-gradient(180deg, rgba(0, 0, 0, 0.3) 72%, black)`,
            }}
          ></div>
          <Navbar></Navbar>
          <Modal open={openTrailer} onClose={() => setOpenTrailer(false)}>
            <TrailerPlayer movieId={backgroundMovie.id}></TrailerPlayer>
          </Modal>
          <div
            className="col-60 position-absolute"
            style={{
              top: 0,
              left: 0,
              right: 0,
              maxWidth: "1200px",
              margin: "auto",
            }}
          >
            <div className="position-relative">
              <img
                className="d-block d-lg-none"
                width="100%"
                src={`https://image.tmdb.org/t/p/w500${backgroundMovie.poster_path}`}
              ></img>
              <img
                className="d-none d-lg-block"
                width="100%"
                src={`https://image.tmdb.org/t/p/w${GetClosestValidWidth(
                  "backdrop"
                )}${backgroundMovie.backdrop_path}`}
              ></img>
              <div
                className="position-absolute w-100 h-100"
                style={{
                  background:
                    "linear-gradient(rgba(0, 0, 0, 0.3) 90%, black), linear-gradient(to right, black, transparent, black)",
                  top: 0,
                  left: 0,
                }}
              ></div>
            </div>
          </div>
          <div
            className="col-60 px-md-5 px-4 py-4 position-relative mx-auto content-container"
            style={{
              zIndex: 5,
            }}
          >
            <div className="row no-gutters justify-content-between position-relative">
              <div className="col-60 col-lg-30 d-flex flex-column justify-content-end text-white">
                <div
                  className="row no-gutters mb-2"
                  style={{
                    fontSize: "calc(1.6em + 2vw)",
                    fontWeight: "600",
                  }}
                >
                  {backgroundMovie.title}
                </div>
                <div className="row no-gutters text-light mb-4">
                  {backgroundMovie.overview}
                </div>
                <div className="row no-gutters mb-5 font-weight-bold">
                  <div className="col-auto mr-2">
                    {backgroundMovie.release_date.substring(0, 4)}
                    <strong className="px-3">•</strong>
                    {backgroundMovie.genres.map((x) => x.name).join("/")}
                    <strong className="px-3">•</strong>
                    {FormatDuration(backgroundMovie.runtime)}
                  </div>
                  <div className="col-auto mr-2"></div>
                  <div className="col-auto mr-2"></div>
                </div>
                <div className="row no-gutters mb-4">
                  <div
                    className="col-auto mr-3 btn-custom btn-custom-primary btn-small"
                    onClick={() => setOpenTrailer(true)}
                  >
                    Play Trailer
                  </div>
                  <WishlistButton
                    movie={backgroundMovie}
                    user={user}
                  ></WishlistButton>
                </div>
                <div className="row no-gutters">
                  <ReactionButton
                    selected={
                      user.ratings[backgroundMovie.id]
                        ? user.ratings[backgroundMovie.id].rate_type ===
                          "excellent_rate"
                        : false
                    }
                    movie={backgroundMovie}
                    emoji="fire"
                    className="mr-2 mb-2"
                    value={
                      ratings[backgroundMovie.id]
                        ? ratings[backgroundMovie.id].excellent_rate
                        : 0
                    }
                  ></ReactionButton>
                  <ReactionButton
                    selected={
                      user.ratings[backgroundMovie.id]
                        ? user.ratings[backgroundMovie.id].rate_type ===
                          "good_rate"
                        : false
                    }
                    movie={backgroundMovie}
                    emoji="heart"
                    className="mr-2 mb-2"
                    value={
                      ratings[backgroundMovie.id]
                        ? ratings[backgroundMovie.id].good_rate
                        : 0
                    }
                  ></ReactionButton>
                  <ReactionButton
                    selected={
                      user.ratings[backgroundMovie.id]
                        ? user.ratings[backgroundMovie.id].rate_type ===
                          "ok_rate"
                        : false
                    }
                    movie={backgroundMovie}
                    className="mr-2 mb-2"
                    emoji="heavy_division_sign"
                    value={
                      ratings[backgroundMovie.id]
                        ? ratings[backgroundMovie.id].ok_rate
                        : 0
                    }
                  ></ReactionButton>
                  <ReactionButton
                    selected={
                      user.ratings[backgroundMovie.id]
                        ? user.ratings[backgroundMovie.id].rate_type ===
                          "bad_rate"
                        : false
                    }
                    movie={backgroundMovie}
                    emoji="shit"
                    value={
                      ratings[backgroundMovie.id]
                        ? ratings[backgroundMovie.id].bad_rate
                        : 0
                    }
                  ></ReactionButton>
                </div>
              </div>

              <div className="col-25 d-none d-lg-block">
                <div className="row no-gutters text-title-lg text-white mb-4">
                  Todays's Recommendation
                </div>
                <Recommendations
                  movies={movies}
                  user={user}
                  ratings={ratings}
                ></Recommendations>
              </div>
            </div>
          </div>
        </div>
        <div className="row no-gutters d-flex d-lg-none">
          <div className=" col-60 py-5 px-md-5 px-4 content-container">
            <div className="row no-gutters justify-content-end">
              <div className="col-60">
                <div className="row no-gutters text-title-xl text-white">
                  Todays's Recommendation
                </div>
                <MoviesList movies={movies.slice(1, 7)}></MoviesList>
              </div>
            </div>
          </div>
        </div>
        <PopularMovies></PopularMovies>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    publicUser: state.publicUsers,
    ratings: state.ratings,
    user: state.user,
    ...ownProps,
  };
}

export default connect(mapp)(Home);
