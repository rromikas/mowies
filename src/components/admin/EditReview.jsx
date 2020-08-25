import React, { useEffect, useState } from "react";
import Select from "../utility/Select";
import { Ratings } from "../../Data";
import { connect } from "react-redux";
import store from "../../store/store";
import { EditReviewForAdmin } from "../../server/DatabaseApi";
import Loader from "../utility/Loader";

const EditReview = ({ currentReview, publicUsers, getBack, ratings }) => {
  const [review, setReview] = useState({});
  const [user, setUser] = useState({ display_name: "", email: "" });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (currentReview) {
      setReview(currentReview);
      setUser(publicUsers[currentReview.author]);
    }
  }, [currentReview]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="row no-gutters p-md-5 p-4" style={{ maxWidth: "800px" }}>
      <div className="col-60 py-3 border-bottom mb-4">
        <div className="row no-gutters admin-screen-title">
          Reviews & Comments
        </div>
        <div className="row no-gutters">
          Add, edit and delete reviews and comments
        </div>
      </div>
      <div className="col-60">
        <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">Display name</div>
          <div className="col-60">
            <input
              type="text"
              className="input-light w-100 px-3"
              value={user.display_name}
              onChange={(e) => {
                e.persist();
                setUser((prev) =>
                  Object.assign({}, prev, { display_name: e.target.value })
                );
              }}
            ></input>
          </div>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">Message</div>
          <div className="col-60">
            <textarea
              value={review.review ? review.review : ""}
              onChange={(e) => {
                e.persist();
                setReview((prev) =>
                  Object.assign({}, prev, { review: e.target.value })
                );
              }}
              className="textarea-light w-100"
              style={{ height: "150px" }}
            ></textarea>
          </div>
        </div>
      </div>
      <div className="col-60 mb-4">
        <div className="row no-gutters">
          <div className="60 mb-1">Rating</div>
        </div>
        <div className="row no-gutters">
          <Select
            popoverClass="col-md-30 col-60"
            className="input-light px-3"
            btnName={
              review.rating
                ? Ratings.find((x) => x.name === review.rating).element
                : "Select"
            }
            onSelect={(index) => {
              setReview((prev) =>
                Object.assign({}, prev, { rating: Ratings[index].name })
              );
            }}
            items={Ratings.map((x) => x.element)}
          ></Select>
        </div>
      </div>
      <div className="col-60 mb-4">
        <div className="row no-gutters">
          <div className="60 mb-1">Report status</div>
        </div>
        <div className="row no-gutters">
          <Select
            popoverClass="col-md-30 col-60"
            className="input-light px-3"
            btnName={review.reported ? "Reported" : "Not Reported"}
            onSelect={(index) => {
              setReview((prev) =>
                Object.assign({}, prev, {
                  reported: index === 0 ? true : false,
                })
              );
            }}
            items={["Reported", "Not Reported"]}
          ></Select>
        </div>
      </div>
      <div className="col-60 mb-4">
        <div className="row no-gutters">
          <div className="60 mb-1">Title</div>
        </div>
        <div className="row no-gutters">
          <input
            value={ratings[currentReview.movie_id].movie_title}
            disabled
            className="input-light-disabled col-md-30 col-60 px-3"
          ></input>
        </div>
      </div>
      <div className="col-60 mt-5">
        <div className="row no-gutters">
          <div
            className="btn-custom btn-custom-secondary btn-small mr-sm-3 mb-3 col-60 col-sm-auto"
            onClick={() => getBack()}
          >
            Cancel
          </div>
          <div
            className="btn-custom btn-custom-primary btn-small mb-3 col-60 col-sm-auto"
            onClick={async () => {
              setLoading(true);
              let res = await EditReviewForAdmin(review, user);
              setLoading(false);
              if (res.error) {
                store.dispatch({
                  type: "SET_NOTIFICATION",
                  notification: {
                    title: "Error",
                    message: res.error,
                    type: "failure",
                  },
                });
              } else {
                store.dispatch({
                  type: "SET_NOTIFICATION",
                  notification: {
                    title: "Review updated",
                    message: "Review was successfully updated",
                    type: "success",
                  },
                });
                getBack();
              }
            }}
          >
            <Loader
              color={"white"}
              style={{
                position: "absolute",
                left: "10px",
                top: 0,
                bottom: 0,
                margin: "auto",
                display: "flex",
                alignItems: "center",
              }}
              loading={loading}
              size={20}
            ></Loader>
            Save
          </div>
        </div>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    publicUsers: state.publicUsers,
    ratings: state.ratings,
    ...ownProps,
  };
}

export default connect(mapp)(EditReview);
