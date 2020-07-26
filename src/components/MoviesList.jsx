import React from "react";
import {
  TrendingMovies,
  OfficialMoviesGenres,
  OfficialSeriesGenres,
} from "../Data";
import history from "../History";
import Popover from "./utility/Popover";
import { MdPlaylistAdd } from "react-icons/md";

const MoviesList = ({ movies }) => {
  return (
    <div className="row">
      {movies.map((x, i) => (
        <div
          key={`result-${i}`}
          className="col-xl-12 col-lg-15 col-md-20 col-sm-30 col-60 p-3"
        >
          <div
            className="row no-gutters justify-content-end position-relative px-2 d-none d-sm-flex"
            style={{ marginBottom: "-68px", zIndex: 5 }}
          >
            <Popover
              delay={1000}
              theme="dark"
              position="top"
              content={
                <div className="p-3 bg-over-root-lighter text-white">
                  Add to wishlist
                </div>
              }
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
            <div className="col-sm-60 col-auto mr-3 mr-sm-0">
              <div className="row no-gutters mb-2 position-relative movies-list-image">
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
              </div>
            </div>
            <div className="col-sm-60 col">
              <div className="row no-gutters h5 mb-0">
                {x.title ? x.title : x.name}
              </div>
              <div className="row no-gutters text-muted mb-2">
                <div className="text-truncate">
                  <small>
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
                  </small>
                </div>
              </div>
              <div className="row no-gutters d-flex d-sm-none">
                <div className="col-auto btn-custom btn-custom-iconic">
                  <MdPlaylistAdd
                    fontSize="34px"
                    style={{ marginRight: "-5px" }}
                  ></MdPlaylistAdd>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoviesList;
