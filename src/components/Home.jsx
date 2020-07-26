import React, { useState, useEffect } from "react";
import { TrendingMovies, OfficialMoviesGenres } from "../Data";
import * as API from "../server/MoviesApi";
import history from "../History";
import Navbar from "./Navbar";
import PopularMovies from "./PopularMovies";
import Popover from "./utility/Popover";
import { MdPlaylistAdd } from "react-icons/md";
import TrailerPlayer from "./TrailerPlayer";
import Modal from "./utility/Modal";
import ReactionButton from "./ReactionButton";
import { FormatDuration } from "../utilities/Functions";

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

const Home = () => {
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
      console.log("Data", data);
      setBackgroundMovie(data);
    }
    getData();
  }, []);

  return (
    <div className="row no-gutters">
      <div className="col-60">
        <div
          className="row no-gutters justify-content-end position-relative overflow-hidden"
          style={{ height: window.innerHeight }}
        >
          <div
            className="col-60 position-absolute"
            style={{ top: 0, left: 0, zIndex: 5 }}
          >
            <Navbar></Navbar>
          </div>
          <div className="col-60 position-relative">
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
          <div
            className="col-60 position-absolute px-md-5 px-4 py-4"
            style={{
              bottom: 0,
              left: 0,
              right: 0,
              margin: "auto",
              maxWidth: "1500px",
            }}
          >
            <div className="row no-gutters justify-content-between position-relative">
              <div className="col-60 col-lg-30 col-xl-20 d-flex flex-column justify-content-end text-white">
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
                <Modal open={openTrailer} onClose={() => setOpenTrailer(false)}>
                  <TrailerPlayer movieId={backgroundMovie.id}></TrailerPlayer>
                </Modal>
                <div className="row no-gutters mb-4">
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
                    <div className="col-auto btn-custom btn-custom-iconic">
                      <MdPlaylistAdd
                        fontSize="34px"
                        style={{ marginRight: "-5px" }}
                      ></MdPlaylistAdd>
                    </div>
                  </Popover>
                </div>
                <div className="row no-gutters">
                  <ReactionButton
                    emoji="fire"
                    className="mr-2 mb-2"
                    value={999}
                  ></ReactionButton>
                  <ReactionButton
                    emoji="heart"
                    className="mr-2 mb-2"
                    value={195625}
                  ></ReactionButton>
                  <ReactionButton
                    className="mr-2 mb-2"
                    emoji="heavy_division_sign"
                    value={1515515}
                  ></ReactionButton>
                  <ReactionButton emoji="shit" value={0}></ReactionButton>
                </div>
              </div>

              <div className="col-20 d-none d-lg-block">
                <div className="row no-gutters h2 text-white">
                  Todays's Recommendation
                </div>
                <div className="row no-gutters">
                  {movies.slice(1, 7).map((x, i) => (
                    <div
                      className="col-20 pr-2 pb-2"
                      key={`recommended-today-movie-${i}`}
                    >
                      <img
                        onClick={() => history.push(`/movie/${x.id}`)}
                        width="100%"
                        style={{ borderRadius: "13px" }}
                        src={`https://image.tmdb.org/t/p/w154${x.poster_path}`}
                      ></img>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row no-gutters d-flex d-lg-none">
          <div
            className=" col-60 py-5 px-md-5 px-4"
            style={{ maxWidth: "1500px" }}
          >
            <div className="row no-gutters justify-content-end">
              <div className="col-60">
                <div className="row no-gutters h2 text-white">
                  Todays's Recommendation
                </div>
                <div className="row no-gutters">
                  {movies.slice(1, 7).map((x, i) => (
                    <div
                      className="col-20 pr-2 pb-2"
                      key={`recommended-today-movie-${i}`}
                    >
                      <img
                        onClick={() => history.push(`/movie/${x.id}`)}
                        width="100%"
                        style={{ borderRadius: "13px" }}
                        src={`https://image.tmdb.org/t/p/w154${x.poster_path}`}
                      ></img>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <PopularMovies></PopularMovies>
      </div>
    </div>
  );
};

export default Home;
