import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "simplebar/dist/simplebar.min.css";
import { GetTrailers } from "../../server/MoviesApi";
import { connect } from "react-redux";
import Loader from "../utility/Loader";

const TrailerPlayer = ({
  movieId,
  settings,
  onEnded,
  modalOpened,
  setIsEmpty = () => {},
}) => {
  const [videoIds, setVideoIds] = useState([]);
  const [problem, setProblem] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function getData() {
      if (movieId && settings.movies_api_key) {
        let trailers = await GetTrailers(
          movieId.toString(),
          settings.movies_api_key
        );
        if (!trailers.results || !trailers.results.length) {
          setProblem("We couldn't find trailer for this movie");
          setIsEmpty();
        } else {
          setVideoIds(trailers.results.map((x) => x.key));
        }
      }
    }

    getData();
  }, [movieId, settings.movies_api_key]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="col-xl-33 col-lg-36 col-md-39 col-sm-42 col-60">
      <div className="row no-gutters">
        {videoIds.length && modalOpened ? (
          <React.Fragment>
            <div className={`col-60${!isReady ? " d-none" : ""}`}>
              <div className="trailer-player-wrapper">
                <ReactPlayer
                  onReady={() => setIsReady(true)}
                  onEnded={onEnded}
                  config={{
                    youtube: {
                      playerVars: { showinfo: 0, iv_load_policy: 3 },
                    },
                  }}
                  playing
                  className="trailer-player"
                  controls
                  width="100%"
                  height="100%"
                  url={`https://www.youtube.com/watch?v=${videoIds[0]}`}
                />
              </div>
            </div>
            <div className={`col-60${isReady ? " d-none" : ""}`}>
              <Loader size={80} loading={true}></Loader>
            </div>
          </React.Fragment>
        ) : problem ? (
          <div className="text-white h4 m-auto">{problem}</div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    settings: state.settings,
    ...ownProps,
  };
}

export default connect(mapp)(TrailerPlayer);
