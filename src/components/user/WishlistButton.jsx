import React, { useState } from "react";
import { MdPlaylistAdd } from "react-icons/md";
import store from "../../store/store";
import { AddToWishList, GetAllRatings } from "../../server/DatabaseApi";
import Popover from "../utility/Popover";
import Loader from "../utility/Loader";
import { connect } from "react-redux";
import RemoveIcon from "../../images/RemoveIcon";

const WishlistButton = ({ user, movie, apiKey }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async (message) => {
    try {
      console.log("movie id wishlist", movie.id);
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
            GetAllRatings((ratingsArr) => {
              let ratings = {};
              ratingsArr.forEach((x) => {
                ratings[x.tmdb_id] = x;
              });
              store.dispatch({ type: "SET_RATINGS", ratings });
            });
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
    } catch (error) {
      store.dispatch({
        type: "SET_NOTIFICATION",
        notification: {
          title: "Action failed",
          message: "Couldn't add movie to wishlist",
          type: "failure",
        },
      });
    }
  };

  const currentlyAdded =
    user.wishlist.findIndex((x) => x.movie_id === movie.id.toString()) !== -1;
  const isInWatchlist =
    user.watchedlist.findIndex((x) => x.movie_id === movie.id.toString()) !==
    -1;

  return !isInWatchlist ? (
    <Popover
      theme="dark"
      position="top"
      content={(w) => (
        <div className="px-3 py-2">
          {currentlyAdded ? "Remove from wishlist" : "Add to wishlist"}
        </div>
      )}
      trigger="mouseenter"
    >
      <div
        style={{ pointerEvents: "all" }}
        className={`btn-custom ${
          currentlyAdded
            ? "btn-custom-danger btn-custom-iconic"
            : "btn-custom-iconic btn-custom-iconic-primary"
        }`}
      >
        {loading ? (
          <Loader size={30} loading={loading} color={"white"}></Loader>
        ) : currentlyAdded ? (
          <RemoveIcon
            color={"white"}
            fill={"white"}
            onClick={() => handleClick("removed from")}
            size={28}
          ></RemoveIcon>
        ) : (
          <MdPlaylistAdd
            onClick={() => handleClick("added to")}
            className="text-title-xl"
            style={{ marginRight: "-5px" }}
          ></MdPlaylistAdd>
        )}
      </div>
    </Popover>
  ) : (
    ""
  );
};

function mapp(state, ownProps) {
  return {
    apiKey: state.settings.movies_api_key,
    ...ownProps,
  };
}

export default connect(mapp)(WishlistButton);
