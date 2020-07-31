import React, { useState } from "react";
import { MdPlaylistAdd, MdPlaylistAddCheck } from "react-icons/md";
import store from "../../store/store";
import { AddToWishList } from "../../server/DatabaseApi";
import Popover from "../utility/Popover";
import Loader from "../utility/Loader";

const WishlistButton = ({ user, movie }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async (message) => {
    if (user.display_name && movie.id) {
      setLoading(true);
      let res = await AddToWishList(user, movie);
      setLoading(false);
      console.log("response afte add to wishlsi", res);
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
  };

  const currentlyAdded =
    user.wishlist.findIndex((x) => x.movie_id === movie.id.toString()) !== -1;

  return (
    <Popover
      theme="dark"
      position="top"
      content={
        <div className="p-3">
          {currentlyAdded ? "Movie is in your wishlist" : "Add to wishlist"}
        </div>
      }
      trigger="mouseenter"
    >
      <div className="btn-custom btn-custom-iconic">
        {loading ? (
          <Loader size={30} loading={loading} color={"white"}></Loader>
        ) : currentlyAdded ? (
          <MdPlaylistAddCheck
            onClick={() => handleClick("removed from")}
            fontSize="34px"
            style={{ marginRight: "-5px" }}
          ></MdPlaylistAddCheck>
        ) : (
          <MdPlaylistAdd
            onClick={() => handleClick("added to")}
            fontSize="34px"
            style={{ marginRight: "-5px" }}
          ></MdPlaylistAdd>
        )}
      </div>
    </Popover>
  );
};

export default WishlistButton;