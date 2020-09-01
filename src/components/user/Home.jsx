import React, { useState, useEffect, useLayoutEffect } from "react";
import PopularMovies from "./PopularMovies";
import TrailerPlayer from "./TrailerPlayer";
import Modal from "../utility/Modal";
import ReactionButton from "./ReactionButton";
import { FormatDuration } from "../../utilities/Functions";
import { connect } from "react-redux";
import WishlistButton from "./WishlistButton";
import Recommendations from "./Recommendations";
import PopularReviews from "./PopularReviews";
import RecentReviews from "./RecentReviews";
import { GetRecommendations } from "../../server/DatabaseApi";

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

function useWindowSize() {
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    function updateSize() {
      setHeight(window.innerHeight);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return height;
}

const Home = ({ publicUsers, ratings, user, settings, navbarHeight }) => {
  const height = useWindowSize();
  const [recommendedMovies, setRecommendedMovies] = useState([]);
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
  const [trailerIsEmpty, setTrailerIsEmpty] = useState(false);

  useEffect(() => {
    async function getData() {
      setBackgroundMovie(settings.current_bg_movie);
      if (settings.movies_api_key) {
        let res = await GetRecommendations(8);
        if (!res.error) {
          setRecommendedMovies(res);
        }
      }
    }
    getData();
  }, [settings]);

  return (
    <div className="row no-gutters" style={{ marginTop: `-${navbarHeight}px` }}>
      <div className="col-60">
        <div
          className="row no-gutters align-items-end position-relative overflow-hidden"
          style={{ height: height }}
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
          <Modal open={openTrailer} onClose={() => setOpenTrailer(false)}>
            <TrailerPlayer
              modalOpened={openTrailer}
              setIsEmpty={() => setTrailerIsEmpty(true)}
              movieId={backgroundMovie.id}
              onEnded={() => setOpenTrailer(false)}
            ></TrailerPlayer>
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
                alt={backgroundMovie.poster_path}
                className="d-block d-lg-none"
                width="100%"
                src={`https://image.tmdb.org/t/p/w500${backgroundMovie.poster_path}`}
              ></img>
              <img
                alt={backgroundMovie.poster_path}
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
              <div className="col-60 col-sm-40 col-lg-30 d-flex flex-column justify-content-end text-white">
                <div className="row no-gutters align-items-center">
                  <div className="col-auto mr-3">
                    <div
                      className="row no-gutters mb-2 text-title-lg align-items-center"
                      style={{
                        fontWeight: "700",
                      }}
                    >
                      {backgroundMovie.title}
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="row no-gutters align-items-center">
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
                            : []
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
                            : []
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
                            : []
                        }
                      ></ReactionButton>
                      <ReactionButton
                        className="mb-2"
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
                            : []
                        }
                      ></ReactionButton>
                    </div>
                  </div>
                </div>
                <div className="row no-gutters text-light mb-4 font-weight-300 text-clamp-6">
                  {backgroundMovie.overview}
                </div>
                <div className="row no-gutters mb-md-5 mb-4">
                  <div className="col-auto mr-2 d-flex">
                    {backgroundMovie.release_date.substring(0, 4)}
                    <strong className="px-3">•</strong>
                    <div>
                      <div className="d-none d-md-block">
                        {backgroundMovie.genres
                          .slice(0, 3)
                          .map((x) => x.name)
                          .join("/")}
                      </div>
                      <div className="d-block d-md-none">
                        {backgroundMovie.genres
                          .slice(0, 2)
                          .map((x) => x.name)
                          .join("/")}
                      </div>
                    </div>

                    <strong className="px-3">•</strong>
                    {FormatDuration(backgroundMovie.runtime)}
                  </div>
                </div>
                <div className="row no-gutters mb-md-4 mb-2">
                  {!trailerIsEmpty ? (
                    <div
                      className="col-auto mr-3 btn-custom btn-custom-primary btn-small"
                      onClick={() => setOpenTrailer(true)}
                    >
                      Play Trailer
                    </div>
                  ) : (
                    ""
                  )}
                  <WishlistButton
                    movie={backgroundMovie}
                    user={user}
                  ></WishlistButton>
                </div>
              </div>

              <div className="col-23 d-none d-lg-block">
                <div
                  className="row no-gutters h5 text-white"
                  style={{
                    padding: "6px 10px",
                    background:
                      "linear-gradient(to right, #ff0037, transparent)",
                    borderRadius: "4px 0 0 4px",
                    // marginLeft: "10px",
                    marginBottom: "11px",
                  }}
                >
                  Today's Recommendation
                </div>
                <Recommendations
                  movies={recommendedMovies}
                  user={user}
                  ratings={ratings}
                ></Recommendations>
              </div>
            </div>
          </div>
        </div>
        <div className="row no-gutters d-flex d-lg-none">
          <div className=" col-60 py-4 px-md-5 px-4 content-container">
            <div className="row no-gutters justify-content-end">
              <div className="col-60">
                <div
                  className="row no-gutters h5 text-white"
                  style={{
                    padding: "6px 10px",
                    background:
                      "linear-gradient(to right, #ff0037, transparent)",
                    borderRadius: "4px 0 0 4px",
                    // marginLeft: "10px",
                    marginBottom: "18px",
                  }}
                >
                  Todays's Recommendation
                </div>
                <Recommendations
                  movies={recommendedMovies}
                  user={user}
                  ratings={ratings}
                ></Recommendations>
              </div>
            </div>
          </div>
        </div>
        <PopularMovies apiKey={settings.movies_api_key}></PopularMovies>
        <PopularReviews></PopularReviews>
        <RecentReviews></RecentReviews>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    publicUser: state.publicUsers,
    ratings: state.ratings,
    settings: state.settings,
    user: state.user,
    navbarHeight: state.navbarSize.height,
    ...ownProps,
  };
}

export default connect(mapp)(Home);
