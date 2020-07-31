import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "simplebar/dist/simplebar.min.css";
import { GetTrailers } from "../../server/MoviesApi";

const TrailerPlayer = ({ movieId }) => {
  console.log("MOVIE ID trailer", movieId);
  const [videoIds, setVideoIds] = useState([]);

  useEffect(() => {
    async function getData() {
      if (movieId) {
        let trailers = await GetTrailers(movieId);
        console.log("trailers", trailers);
        setVideoIds(trailers.results.map((x) => x.key));
      }
    }

    getData();
  }, [movieId]);

  return (
    <div className="col-xl-33 col-lg-36 col-md-39 col-sm-42 col-60">
      <div className="row no-gutters">
        {videoIds.length && (
          <div className="col-60">
            <div className="trailer-player-wrapper">
              <ReactPlayer
                playing
                className="trailer-player"
                controls
                width="100%"
                height="100%"
                url={`https://www.youtube.com/watch?v=${videoIds[0]}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrailerPlayer;
