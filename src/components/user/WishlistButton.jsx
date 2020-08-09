import React, { useState } from "react";
import { MdPlaylistAdd, MdPlaylistAddCheck } from "react-icons/md";
import store from "../../store/store";
import { AddToWishList, GetAllRatings } from "../../server/DatabaseApi";
import Popover from "../utility/Popover";
import Loader from "../utility/Loader";
import { connect } from "react-redux";

const WishlistButton = ({ user, movie, apiKey }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async (message) => {
    if (user.display_name) {
      if (movie.id) {
        setLoading(true);
        let res = await AddToWishList(user, movie.id, apiKey);
        setLoading(false);
        if (res.updatedUser) {
          store.dispatch({
            type: "UPDATE_USER",
            userProperty: res.updatedUser,
          });
          store.dispatch({
            type: "SET_NOTIFICATION",
            notification: {
              title: `Movie ${message} wishlist`,
              message: `Movie successfully ${message} your wishlist`,
              type: "success",
            },
          });
          let ratingsArr = await GetAllRatings();
          let ratings = {};
          ratingsArr.forEach((x) => {
            ratings[x.tmdb_id] = x;
          });
          store.dispatch({ type: "SET_RATINGS", ratings });
        } else {
          store.dispatch({
            type: "SET_NOTIFICATION",
            notification: {
              title: "Error",
              message: JSON.stringify(res.error).replace(/\"/g, ""),
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

  const currentlyAdded =
    user.wishlist.findIndex((x) => x.movie_id === movie.id.toString()) !== -1;

  return (
    <Popover
      theme="dark"
      position="top"
      content={(w) => (
        <div className="p-3">
          {currentlyAdded ? "Movie is in your wishlist" : "Add to wishlist"}
        </div>
      )}
      trigger="mouseenter"
    >
      <div className="btn-custom btn-custom-iconic">
        {loading ? (
          <Loader size={30} loading={loading} color={"white"}></Loader>
        ) : currentlyAdded ? (
          <MdPlaylistAddCheck
            onClick={() => handleClick("removed from")}
            className="text-title-xl"
            style={{ marginRight: "-5px" }}
          ></MdPlaylistAddCheck>
        ) : (
          <MdPlaylistAdd
            onClick={() => handleClick("added to")}
            className="text-title-xl"
            style={{ marginRight: "-5px" }}
          ></MdPlaylistAdd>
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

export default connect(mapp)(WishlistButton);
