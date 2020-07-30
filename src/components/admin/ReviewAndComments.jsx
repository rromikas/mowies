import React, { useState } from "react";
import Reviews from "./Reviews";
import Comments from "./Comments";

const ReviewsAndComments = ({
  setEditReview,
  setEditReviewSection,
  setEditCommentSection,
  setEditComment,
}) => {
  const [tab, setTab] = useState(0);

  return (
    <div className="row no-gutters p-md-5 p-4">
      <div className="col-60 border-bottom">
        <div className="row no-gutters justify-content-between">
          <div className="col-auto py-3">
            <div className="row no-gutters h3">Reviews & Comments</div>
            <div className="row no-gutters">
              Add, edit or delete reviews and comments
            </div>
          </div>
          <div className="col-auto py-3">
            <div className="row no-gutters cursor-pointer">
              <div
                style={{ width: "150px" }}
                onClick={() => setTab(0)}
                className={`rounded-left col table-btn${
                  tab === 0 ? " table-btn-selected" : ""
                }`}
              >
                Reviews
              </div>
              <div
                style={{ width: "150px" }}
                onClick={() => setTab(1)}
                className={`rounded-right col table-btn${
                  tab === 1 ? " table-btn-selected" : ""
                }`}
              >
                Comments
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-60">
        {tab === 0 ? (
          <Reviews
            setEditReviewSection={setEditReviewSection}
            setEditReview={setEditReview}
          ></Reviews>
        ) : (
          <Comments
            setEditComment={setEditComment}
            setEditCommentSection={setEditCommentSection}
          ></Comments>
        )}
      </div>
    </div>
  );
};

export default ReviewsAndComments;
