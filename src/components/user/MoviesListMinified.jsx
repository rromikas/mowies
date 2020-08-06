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
import TrailerPlayer from "./TrailerPlayer";
import Modal from "../utility/Modal";
import { BsPlayFill } from "react-icons/bs";

const MoviesListMinified = ({ movies, onClick }) => {
  const [trailerMovieId, setTrailerMovieId] = useState("");
  const [openTrailer, setOpenTrailer] = useState(false);
  return (
    <div className="row">
      <Modal open={openTrailer} onClose={() => setOpenTrailer(false)}>
        <TrailerPlayer
          movieId={trailerMovieId}
          onEnded={() => setOpenTrailer(false)}
        ></TrailerPlayer>
      </Modal>
      {movies.map((x, i) => (
        <div
          key={`result-${i}`}
          className="p-2 movie-card-minified"
          style={{ flexBasis: "300px", flexGrow: 1 }}
          onClick={() => {
            history.push(`/${x.name ? "series" : "movie"}/${x.id}`);
            onClick();
          }}
        >
          <div className="row no-gutters">
            <div className="col-auto mr-3">
              <div className="row no-gutters mb-2 position-relative">
                <div
                  className="square-70 bg-image rounded"
                  style={{
                    backgroundImage: `url(${
                      x.poster_path
                        ? `https://image.tmdb.org/t/p/w342${x.poster_path}`
                        : "https://critics.io/img/movies/poster-placeholder.png"
                    })`,
                  }}
                ></div>
              </div>
            </div>
            <div className="col">
              <div
                className="row no-gutters mb-0 cursor-pointer"
                onClick={() => history.push(`/movie/${x.id}`)}
              >
                <div className="text-truncate">
                  {x.title ? x.title : x.name}
                </div>
              </div>
              <div className="row no-gutters text-muted mb-2">
                <div className="text-truncate" style={{ maxWidth: "100%" }}>
                  {x.genre_ids.length
                    ? x.genre_ids
                        .map((gid) => {
                          let movieGenre = OfficialMoviesGenres.find(
                            (g) => g.id === gid
                          );
                          let seriesGenre = OfficialSeriesGenres.find(
                            (g) => g.id === gid
                          );
                          return movieGenre // movies have title, series - name
                            ? movieGenre.name
                            : seriesGenre
                            ? seriesGenre.name
                            : "unkonwn";
                        })
                        .join("/")
                    : "unknown"}
                </div>
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

export default connect(mapp)(MoviesListMinified);
