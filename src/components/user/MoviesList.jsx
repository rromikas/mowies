import React, { useState } from "react";
import { OfficialMoviesGenres, OfficialSeriesGenres } from "../../Data";
import history from "../../History";
import WishlistButton from "./WishlistButton";
import { connect } from "react-redux";
import ReactionButton from "./ReactionButton";
import TrailerPlayer from "./TrailerPlayer";
import Modal from "../utility/Modal";
import { BsPlayFill } from "react-icons/bs";
import MoveToWatchedButton from "./MoveToWatchedButton";
import AddReview from "./AddReview";

const MoviesList = ({ movies, user, ratings, prefix = "" }) => {
  const [trailerMovieId, setTrailerMovieId] = useState("");
  const [openTrailer, setOpenTrailer] = useState(false);
  const [addReviewOpen, setAddReviewOpen] = useState(false);

  const [movie, setMovie] = useState(false); // movie to add review for
  return (
    <div className="row justify-content-end">
      <Modal open={openTrailer} onClose={() => setOpenTrailer(false)}>
        <TrailerPlayer
          modalOpened={openTrailer}
          movieId={trailerMovieId}
          onEnded={() => setOpenTrailer(false)}
        ></TrailerPlayer>
      </Modal>
      <AddReview
        open={addReviewOpen}
        onClose={() => setAddReviewOpen(false)}
        movie={movie}
        user={user}
      ></AddReview>
      {movies.map((x, i) => {
        return (
          <div
            key={`result-${i}`}
            style={{ alignSelf: "start" }}
            className="col-lg-12 col-md-15 col-sm-20 col-60 p-3 text-white"
          >
            <div
              className="row no-gutters justify-content-end position-relative px-2 d-none d-sm-flex"
              style={{
                marginBottom: "-51px",
                zIndex: 5,
                height: "44px",
                pointerEvents: "none",
              }}
            >
              <WishlistButton movie={x} user={user}></WishlistButton>
              <div className="pr-1"></div>
              <MoveToWatchedButton
                refreshProfile={() => {
                  setMovie(x);
                  setAddReviewOpen(true);
                }}
                user={user}
                movieId={x.id}
              ></MoveToWatchedButton>
            </div>
            <div className="row no-gutters">
              <div className="col-sm-60 col-auto mr-3 mr-sm-0">
                <div className="row no-gutters mb-2 position-relative movies-list-image">
                  <img
                    alt={x.poster_path}
                    width="100%"
                    style={{ borderRadius: "13px" }}
                    className="img-clickable"
                    src={
                      x.poster_path
                        ? `https://image.tmdb.org/t/p/w342${x.poster_path}`
                        : "https://critics.io/img/movies/poster-placeholder.png"
                    }
                  ></img>
                  <div
                    onClick={() =>
                      history.push(`/movie/${x.name ? `serie-${x.id}` : x.id}`)
                    }
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
                      className="square-50 rounded-circle d-flex flex-center play-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTrailerMovieId(x.id);
                        setOpenTrailer(true);
                      }}
                    >
                      <BsPlayFill
                        style={{
                          fontSize: "30px",
                          color: "white",
                          marginRight: "-5px",
                        }}
                      ></BsPlayFill>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-60 col">
                <div
                  className="row no-gutters text-title-md mb-0 cursor-pointer"
                  onClick={() => history.push(`/movie/${x.id}`)}
                >
                  <div className="text-truncate">
                    {x.title ? x.title : x.name}
                  </div>
                </div>
                <div className="row no-gutters text-muted mb-2">
                  <div className="text-truncate">
                    {x.genre_ids.length
                      ? x.genre_ids
                          .map((gid) => {
                            let genre = x.title // movies have title, series - name
                              ? OfficialMoviesGenres.find((g) => g.id === gid)
                              : OfficialSeriesGenres.find((g) => g.id === gid);

                            return genre ? genre.name : "unknown";
                          })
                          .join("/")
                      : "unknown"}
                  </div>
                </div>
                <div className="row no-gutters justify-content-sm-end mb-2">
                  <ReactionButton
                    selected={
                      user.ratings[x.id]
                        ? user.ratings[x.id].rate_type === "excellent_rate"
                        : false
                    }
                    movie={x}
                    emoji="fire"
                    className="mr-1 mb-2"
                    size="small"
                    value={ratings[x.id] ? ratings[x.id].excellent_rate : []}
                  ></ReactionButton>
                  <ReactionButton
                    size="small"
                    selected={
                      user.ratings[x.id]
                        ? user.ratings[x.id].rate_type === "good_rate"
                        : false
                    }
                    movie={x}
                    emoji="heart"
                    className="mr-1 mb-2"
                    value={ratings[x.id] ? ratings[x.id].good_rate : []}
                  ></ReactionButton>
                  <ReactionButton
                    size="small"
                    selected={
                      user.ratings[x.id]
                        ? user.ratings[x.id].rate_type === "ok_rate"
                        : false
                    }
                    movie={x}
                    className="mr-1 mb-2"
                    emoji="heavy_division_sign"
                    value={ratings[x.id] ? ratings[x.id].ok_rate : []}
                  ></ReactionButton>
                  <ReactionButton
                    size="small"
                    emoji="shit"
                    value={ratings[x.id] ? ratings[x.id].bad_rate : []}
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
                  <div className="pr-1"></div>
                  <MoveToWatchedButton
                    refreshProfile={() => {
                      setMovie(x);
                      setAddReviewOpen(true);
                    }}
                    user={user}
                    movieId={x.id}
                  ></MoveToWatchedButton>
                </div>
              </div>
            </div>
          </div>
        );
      })}
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
