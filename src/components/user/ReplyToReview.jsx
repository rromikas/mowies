import React, { useState } from "react";
import Modal from "../utility/Modal";
import { WriteComment } from "../../server/DatabaseApi";
import Loader from "../utility/Loader";
import store from "../../store/store";

const ReplyToReview = ({
  open,
  onClose,
  user,
  review,
  movie,
  reviewAuthor,
  setComments,
  setReviewIdOfVisibleComments,
  refreshComments,
  refreshReviews,
}) => {
  const [newComment, setNewComment] = useState({ comment: "" });
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="col-xl-42 p-4 bg-over-root-lighter rounded mx-4">
        <div className="row no-gutters h2 mb-4">
          Reply to {reviewAuthor.display_name}
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
                  newComment.comment.split(" ").length <= 499
                    ? "text-muted"
                    : "text-danger"
                }`}
              >
                {newComment.comment
                  ? 500 - newComment.comment.split(" ").length
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
                    setNewComment((prev) =>
                      Object.assign({}, prev, { comment: text })
                    );
                  }
                }}
                value={newComment.comment}
                spellCheck={false}
                placeholder="Add your review..."
                style={{ resize: "none" }}
                className="w-100 h-100 textarea"
              ></textarea>
            </div>
            <div
              className="row no-gutters align-items-center text-danger justify-content-end"
              style={{ height: "50px", opacity: problem ? 1 : 0 }}
            >
              {problem}
            </div>
            <div className="row no-gutters justify-content-md-between justify-content-center">
              <div
                className={`col-auto d-none d-md-block ${
                  newComment.comment.split(" ").length <= 499
                    ? "text-muted"
                    : "text-danger"
                }`}
              >
                {newComment.comment
                  ? 500 - newComment.comment.split(" ").length
                  : 500}{" "}
                words left
              </div>
              <div
                className="btn-custom btn-custom-primary btn-small"
                onClick={async () => {
                  if (!newComment.comment) {
                    setProblem("Type comment");
                  } else {
                    if (user.token) {
                      let finalComment = Object.assign({}, newComment, {
                        author_name: user.display_name,
                        movie_title: movie.title,
                        movie_id: movie.id,
                        review_id: review._id,
                        review: review.review,
                        review_author: review.author,
                        notificationReceivers: review.notificationReceivers,
                      });
                      console.log("final comment", finalComment);
                      setNewComment({ comment: "" });
                      let res = await WriteComment(finalComment, user);
                      if (res.error) {
                        store.dispatch({
                          type: "SET_NOTIFICATION",
                          notification: {
                            title: "Couldn't add your comment",
                            type: "failure",
                            message: JSON.stringify(res.error).replace(
                              /\"/g,
                              ""
                            ),
                          },
                        });
                      } else {
                        store.dispatch({
                          type: "SET_NOTIFICATION",
                          notification: {
                            title: "You successfully writed comment",
                            type: "success",
                            message: "Your comment successfully added",
                          },
                        });
                        onClose();
                        setReviewIdOfVisibleComments(review._id);
                        refreshComments();
                        refreshReviews();
                      }
                    } else {
                      setProblem("You need to login to write comment");
                    }
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
