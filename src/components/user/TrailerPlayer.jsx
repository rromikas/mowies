import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "simplebar/dist/simplebar.min.css";
import { GetTrailers } from "../../server/MoviesApi";
import { connect } from "react-redux";

const TrailerPlayer = ({ movieId, settings, onEnded }) => {
  const [videoIds, setVideoIds] = useState([]);
  const [problem, setProblem] = useState("");

  useEffect(() => {
    async function getData() {
      if (movieId && settings.movies_api_key) {
        let trailers = await GetTrailers(movieId, settings.movies_api_key);
        if (!trailers.results || !trailers.results.length) {
          setProblem("We couldn't find trailer for this movie");
        } else {
          setVideoIds(trailers.results.map((x) => x.key));
        }
      }
    }

    getData();
  }, [movieId, settings.movies_api_key]);

  return (
    <div className="col-xl-33 col-lg-36 col-md-39 col-sm-42 col-60">
      <div className="row no-gutters">
        {videoIds.length ? (
          <div className="col-60">
            <div className="trailer-player-wrapper">
              <ReactPlayer
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
