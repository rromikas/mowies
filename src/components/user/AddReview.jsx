import React, { useState } from "react";
import Modal from "../utility/Modal";
import ReactionButton from "./ReactionButton";
import { WriteReview, EditReview } from "../../server/DatabaseApi";
import store from "../../store/store";
import Loader from "../utility/Loader";
import { connect } from "react-redux";
import { useEffect } from "react";

const AddReview = ({
  open,
  onClose,
  movie,
  user,
  review,
  refreshReviews = () => {},
  settings,
  ratings,
  userHasWrittenReview,
}) => {
  const [newReview, setNewReview] = useState({
    review: "",
    rating: "",
  });
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (review) {
      setNewReview((prev) =>
        Object.assign({}, prev, {
          review: review.review,
          rating: review.rating,
        })
      );
    }
  }, [review]);
  return movie ? (
    <Modal open={open} onClose={onClose}>
      <div className="col-xl-42 p-4 bg-over-root-lighter rounded mx-4">
        <div className="row no-gutters h5 mb-4">
          {userHasWrittenReview ? "Edit" : "Add"} Review - {movie.title} (
          {movie.release_date.substring(0, 4)})
        </div>
        <div className="row no-gutters">
          <div className="col-auto pr-3 d-none d-md-block">
            <div
              className="square-70 rounded-circle bg-image"
              style={{ backgroundImage: `url(${user.photo})` }}
            ></div>
          </div>
          <div className="col">
            <div className="row no-gutters d-flex d-md-none mb-3 justify-content-between">
              <div className="col-auto pr-3">
                <div
                  className="square-70 rounded-circle bg-image"
                  style={{ backgroundImage: `url(${user.photo})` }}
                ></div>
              </div>
              <div
                className={`d-flex align-items-end col-auto ${
                  newReview.review.split(" ").length <=
                  settings.no_review_words - 1
                    ? "text-muted"
                    : "text-danger"
                }`}
              >
                {newReview.review
                  ? settings.no_review_words -
                    newReview.review.split(" ").length
                  : settings.no_review_words}{" "}
                words left
              </div>
            </div>
            <div className="row no-gutters mb-2" style={{ height: "150px" }}>
              <textarea
                onChange={(e) => {
                  e.persist();
                  let text = e.target.value;
                  if (text.split(" ").length <= settings.no_review_words) {
                    setNewReview((prev) =>
                      Object.assign({}, prev, { review: text })
                    );
                  }
                }}
                value={newReview.review}
                spellCheck={false}
                placeholder="Add your review..."
                style={{ resize: "none" }}
                className="w-100 h-100 textarea"
              ></textarea>
            </div>
            <div className="row no-gutters justify-content-between mb-2">
              <div className="col-auto">
                <div className="row no-gutters">
                  <ReactionButton
                    allowRate={true}
                    size={"big"}
                    onClick={() =>
                      setNewReview((prev) =>
                        Object.assign({}, prev, { rating: "excellent_rate" })
                      )
                    }
                    selected={newReview.rating === "excellent_rate"}
                    emoji="fire"
                    className={`mr-2 mb-2`}
                    value={
                      ratings[movie.id] ? ratings[movie.id].excellent_rate : 0
                    }
                  ></ReactionButton>
                  <ReactionButton
                    allowRate={true}
                    size={"big"}
                    onClick={() =>
                      setNewReview((prev) =>
                        Object.assign({}, prev, { rating: "good_rate" })
                      )
                    }
                    selected={newReview.rating === "good_rate"}
                    emoji="heart"
                    className={`mr-2 mb-2`}
                    value={ratings[movie.id] ? ratings[movie.id].good_rate : 0}
                  ></ReactionButton>
                  <ReactionButton
                    allowRate={true}
                    size={"big"}
                    onClick={() =>
                      setNewReview((prev) =>
                        Object.assign({}, prev, { rating: "ok_rate" })
                      )
                    }
                    selected={newReview.rating === "ok_rate"}
                    emoji="heavy_division_sign"
                    className={`mr-2 mb-2`}
                    value={ratings[movie.id] ? ratings[movie.id].ok_rate : 0}
                  ></ReactionButton>
                  <ReactionButton
                    allowRate={true}
                    size={"big"}
                    onClick={() =>
                      setNewReview((prev) =>
                        Object.assign({}, prev, { rating: "bad_rate" })
                      )
                    }
                    emoji="shit"
                    selected={newReview.rating === "bad_rate"}
                    className={`mr-2`}
                    value={ratings[movie.id] ? ratings[movie.id].bad_rate : 0}
                  ></ReactionButton>
                </div>
              </div>
              <div
                className={`d-none d-md-block col-auto ${
                  newReview.review.split(" ").length <=
                  settings.no_review_words - 1
                    ? "text-muted"
                    : "text-danger"
                }`}
              >
                {newReview.review
                  ? settings.no_review_words -
                    newReview.review.split(" ").length
                  : settings.no_review_words}{" "}
                words left
              </div>
            </div>
            <div
              className="row no-gutters align-items-center text-danger justify-content-end"
              style={{ height: "30px", opacity: problem ? 1 : 0 }}
            >
              {problem}
            </div>
            <div className="row no-gutters justify-content-md-end justify-content-center">
              <div
                className="btn-custom btn-custom-primary btn-small position-relative"
                onClick={async () => {
                  try {
                    if (!newReview.rating) {
                      setProblem("Select rating");
                    } else if (!newReview.review) {
                      setProblem("Review is empty");
                    } else {
                      setLoading(true);
                      let res = userHasWrittenReview
                        ? await EditReview(newReview, review, user._id)
                        : await WriteReview(
                            newReview,
                            movie.id,
                            user,
                            settings.movies_api_key
                          );
                      setLoading(false);
                      setNewReview({ review: "", rating: "" });
                      if (res.error) {
                        store.dispatch({
                          type: "SET_NOTIFICATION",
                          notification: {
                            title: `Couldn't ${
                              userHasWrittenReview ? "edit" : "add"
                            } review`,
                            type: "failure",
                            message: JSON.stringify(res.error).replace(
                              /"/g,
                              ""
                            ),
                          },
                        });
                      } else {
                        store.dispatch({
                          type: "SET_NOTIFICATION",
                          notification: {
                            title: `You successfully ${
                              userHasWrittenReview ? "edited" : "wrote"
                            } review`,
                            type: "success",
                            message: `Your review was successfully ${
                              userHasWrittenReview ? "edited" : "added"
                            }`,
                          },
                        });

                        store.dispatch({
                          type: "UPDATE_RATINGS",
                          rating: {
                            [movie.id]: res.rating,
                          },
                        });

                        if (!userHasWrittenReview) {
                          let watchedlist = [...user.watchedlist];
                          watchedlist.push({ movie_id: movie.id.toString() });
                          let reviewsList = [...user.reviews];
                          reviewsList.push(res.reviewId);
                          store.dispatch({
                            type: "UPDATE_USER",
                            userProperty: {
                              watchedlist,
                              reviews: reviewsList,
                            },
                          });
                        }

                        let userRatings = { ...user.ratings };
                        userRatings[movie.id] = {
                          movie_id: movie.id,
                          rate_type: newReview.rating,
                        };

                        store.dispatch({
                          type: "UPDATE_USER",
                          userProperty: {
                            ratings: userRatings,
                          },
                        });

                        onClose();
                        refreshReviews();
                      }
                    }
                  } catch (er) {}
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
                Submit
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  ) : (
    ""
  );
};

function mapp(state, ownProps) {
  return {
    settings: state.settings,
    ratings: state.ratings,
    ...ownProps,
  };
}

export default connect(mapp)(AddReview);
