import React, { useState } from "react";
import Modal from "./utility/Modal";
import ReactionButton from "./ReactionButton";

const ReplyToReview = ({ open, onClose, reviewAuthor, user }) => {
  const [newReview, setNewReview] = useState({ review: "", rate: "" });

  return (
    <Modal open={open} onClose={onClose}>
      <div className="col-xl-42 p-4 bg-over-root-lighter rounded mx-4">
        <div className="row no-gutters h2 mb-4">
          Reply to {reviewAuthor.name}
        </div>
        <div className="row no-gutters">
          <div className="col-auto pr-3 d-none d-md-block">
            <div
              className="square-70 rounded-circle bg-image"
              style={{ backgroundImage: `url(${user.photo})` }}
            ></div>
          </div>
          <div className="col">
            <div className="row no-gutters d-flex d-md-none justify-content-between mb-3">
              <div className="col-auto pr-3">
                <div
                  className="square-70 rounded-circle bg-image"
                  style={{ backgroundImage: `url(${user.photo})` }}
                ></div>
              </div>
              <div
                className={`col-auto d-flex align-items-end ${
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
            <div className="row no-gutters justify-content-md-between justify-content-center">
              <div
                className={`col-auto d-none d-md-block ${
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
              <div className="btn-custom btn-custom-primary btn-small">
                Send
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReplyToReview;
