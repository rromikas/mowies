import React, { useState } from "react";
import Modal from "./utility/Modal";
import ReactionButton from "./ReactionButton";

const AddReview = ({ open, onClose, movie, user }) => {
  const [newReview, setNewReview] = useState({ review: "", rate: "" });

  return (
    <Modal open={open} onClose={onClose}>
      <div className="col-xl-42 p-4 bg-over-root-lighter rounded mx-4">
        <div className="row no-gutters h2 mb-4">
          Add Review - {movie.title} ({movie.release_date.substring(0, 4)})
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
                  newReview.review.split(" ").length <= 499
                    ? "text-muted"
                    : "text-danger"
                }`}
              >
                {newReview.review
                  ? 500 - newReview.review.split(" ").length
                  : 500}{" "}
                words left
              </div>
            </div>
            <div className="row no-gutters mb-4" style={{ height: "150px" }}>
              <textarea
                onChange={(e) => {
                  e.persist();
                  let text = e.target.value;
                  console.log("Asdasd", text.split(" ").length);
                  if (text.split(" ").length <= 500) {
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
            <div className="row no-gutters justify-content-between align-items-center mb-3">
              <div className="col-auto">
                <div className="row no-gutters">
                  <ReactionButton
                    onClick={() =>
                      setNewReview((prev) =>
                        Object.assign({}, prev, { rate: "Excellent" })
                      )
                    }
                    selected={newReview.rate === "Excellent"}
                    emoji="fire"
                    className={`mr-2 mb-2`}
                  ></ReactionButton>
                  <ReactionButton
                    onClick={() =>
                      setNewReview((prev) =>
                        Object.assign({}, prev, { rate: "Good" })
                      )
                    }
                    selected={newReview.rate === "Good"}
                    emoji="heart"
                    className={`mr-2 mb-2`}
                  ></ReactionButton>
                  <ReactionButton
                    onClick={() =>
                      setNewReview((prev) =>
                        Object.assign({}, prev, { rate: "OK" })
                      )
                    }
                    selected={newReview.rate === "OK"}
                    emoji="heavy_division_sign"
                    className={`mr-2 mb-2`}
                  ></ReactionButton>
                  <ReactionButton
                    onClick={() =>
                      setNewReview((prev) =>
                        Object.assign({}, prev, { rate: "Bad" })
                      )
                    }
                    emoji="shit"
                    selected={newReview.rate === "Bad"}
                    className={`mr-2`}
                  ></ReactionButton>
                </div>
              </div>
              <div
                className={`d-none d-md-block col-auto ${
                  newReview.review.split(" ").length <= 499
                    ? "text-muted"
                    : "text-danger"
                }`}
              >
                {newReview.review
                  ? 500 - newReview.review.split(" ").length
                  : 500}{" "}
                words left
              </div>
            </div>
            <div className="row no-gutters justify-content-md-end justify-content-center">
              <div className="btn-custom btn-custom-primary btn-small">
                Submit
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddReview;
