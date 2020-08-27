import React, { useState, useEffect } from "react";
import Modal from "../utility/Modal";
import { EditComment as editFn } from "../../server/DatabaseApi";
import Loader from "../utility/Loader";
import store from "../../store/store";
import { connect } from "react-redux";

const EditComment = ({
  open,
  onClose,
  user,
  comment,
  refreshComments,
  settings,
}) => {
  const [newComment, setNewComment] = useState({ comment: "" });
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (comment) {
      setNewComment((prev) => Object.assign({}, prev, comment));
    }
  }, [comment]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="col-xl-42 p-4 bg-over-root-lighter rounded mx-4">
        <div className="row no-gutters h5 mb-4">Edit comment</div>
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
                  newComment.comment.length <=
                  settings.no_comment_characters - 1
                    ? "text-muted"
                    : "text-danger"
                }`}
              >
                {newComment.comment
                  ? settings.no_comment_characters - newComment.comment.length
                  : settings.no_comment_characters}{" "}
                characters left
              </div>
            </div>
            <div className="row no-gutters mb-2" style={{ height: "150px" }}>
              <textarea
                onChange={(e) => {
                  e.persist();
                  let text = e.target.value;
                  if (text.length <= settings.no_comment_characters) {
                    setNewComment((prev) =>
                      Object.assign({}, prev, { comment: text })
                    );
                  }
                }}
                value={newComment.comment}
                spellCheck={false}
                placeholder="Add your comment..."
                style={{ resize: "none" }}
                className="w-100 h-100 textarea"
              ></textarea>
            </div>
            <div className="row no-gutters justify-content-md-end justify-content-center">
              <div className="col-60">
                <div className="row no-gutters justify-content-end">
                  <div
                    className={`col-auto d-none d-md-block ${
                      newComment.comment.length <=
                      settings.no_comment_characters - 1
                        ? "text-muted"
                        : "text-danger"
                    }`}
                  >
                    {newComment.comment
                      ? settings.no_comment_characters -
                        newComment.comment.length
                      : settings.no_comment_characters}{" "}
                    characters left
                  </div>
                </div>
              </div>
              <div className="col-60">
                <div
                  className="row no-gutters align-items-center text-danger justify-content-end"
                  style={{ height: "30px", opacity: problem ? 1 : 0 }}
                >
                  {problem}
                </div>
              </div>
              <div
                className="btn-custom btn-custom-primary btn-small"
                onClick={async () => {
                  if (!newComment.comment) {
                    setProblem("Type comment");
                  } else {
                    if (user.token) {
                      setLoading(true);
                      let res = await editFn(newComment, comment._id);
                      setLoading(false);
                      if (res.error) {
                        store.dispatch({
                          type: "SET_NOTIFICATION",
                          notification: {
                            title: "Couldn't edit your comment",
                            type: "failure",
                            message: res.error,
                          },
                        });
                      } else {
                        store.dispatch({
                          type: "SET_NOTIFICATION",
                          notification: {
                            title: "You successfully edited comment",
                            type: "success",
                            message: "Your comment successfully edited",
                          },
                        });
                        onClose();
                        refreshComments();
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
                Submit
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

function mapp(state, ownProps) {
  return {
    settings: state.settings,
    ...ownProps,
  };
}

export default connect(mapp)(EditComment);
