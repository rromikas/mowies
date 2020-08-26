import React, { useState } from "react";
import { MdRemoveRedEye } from "react-icons/md";
import Popover from "../utility/Popover";
import Loader from "../utility/Loader";
import { MoveMovieToWatchList } from "../../server/DatabaseApi";
import store from "../../store/store";
import { connect } from "react-redux";

const MoveToWatchedButton = ({
  user,
  movieId,
  refreshProfile = () => {},
  apiKey,
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (user.display_name) {
      if (movieId) {
        setLoading(true);
        let res = await MoveMovieToWatchList(user, movieId, apiKey);
        setLoading(false);
        if (res.updatedUser) {
          let wishlist = [...user.wishlist];
          let movieIndex = wishlist.findIndex((x) => x.movie_id === movieId);
          if (movieIndex !== -1) {
            wishlist.splice(movieIndex);
          }
          store.dispatch({
            type: "UPDATE_USER",
            userProperty: res.updatedUser,
          });
          store.dispatch({
            type: "SET_NOTIFICATION",
            notification: {
              title: `Movie marked as watched`,
              message: `Movie successfully added to your watched list`,
              type: "success",
            },
          });
          store.dispatch({
            type: "UPDATE_RATINGS",
            rating: {
              [movieId]: res.rating,
            },
          });
          refreshProfile();
        } else {
          store.dispatch({
            type: "SET_NOTIFICATION",
            notification: {
              title: "Error",
              message: JSON.stringify(res.error).replace(/"/g, ""),
              type: "failure",
            },
          });
        }
      }
    } else {
      store.dispatch({
        type: "SET_NOTIFICATION",
        notification: {
          title: "Action not allowed",
          message: "You need to login to add movie to wishlist",
          type: "failure",
        },
      });
    }
  };
  return (
    <Popover
      theme="dark"
      position="top"
      content={(w) => <div className="px-3 py-2">Mark as watched</div>}
      trigger="mouseenter"
    >
      <div
        className="btn-custom btn-custom-iconic"
        style={{ pointerEvents: "all" }}
      >
        {loading ? (
          <Loader size={30} loading={loading} color={"white"}></Loader>
        ) : (
          <MdRemoveRedEye
            onClick={handleClick}
            className="text-title-xl"
          ></MdRemoveRedEye>
        )}
      </div>
    </Popover>
  );
};

function mapp(state, ownProps) {
  return {
    apiKey: state.settings.movies_api_key,
    ...ownProps,
  };
}

export default connect(mapp)(MoveToWatchedButton);
