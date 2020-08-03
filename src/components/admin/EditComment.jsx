import React, { useEffect, useState } from "react";
import Select from "../utility/Select";
import { connect } from "react-redux";
import store from "../../store/store";
import { EditCommentForAdmin } from "../../server/DatabaseApi";
import Loader from "../utility/Loader";

const EditComment = ({ currentComment, publicUsers, getBack }) => {
  const [comment, setComment] = useState({});
  const [user, setUser] = useState({ display_name: "", email: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentComment) {
      setComment(currentComment);
      setUser(publicUsers[currentComment.author]);
    }
  }, [currentComment]);

  return (
    <div className="row no-gutters p-md-5 p-4" style={{ maxWidth: "800px" }}>
      <div className="col-60 py-3 border-bottom mb-4">
        <div className="row no-gutters h3">Reviews & Comments</div>
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
          <div className="col-60 mb-1">Comment</div>
          <div className="col-60">
            <textarea
              value={comment.comment}
              onChange={(e) => {
                e.persist();
                setComment((prev) =>
                  Object.assign({}, prev, { comment: e.target.value })
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
          <div className="60 mb-1">Report status</div>
        </div>
        <div className="row no-gutters">
          <Select
            popoverClass="col-md-30 col-60"
            className="input-light px-3"
            btnName={comment.reported ? "Reported" : "Not Reported"}
            onSelect={(index) => {
              setComment((prev) =>
                Object.assign({}, prev, {
                  reported: index === 0 ? true : false,
                })
              );
            }}
            items={["Reported", "Not Reported"]}
          ></Select>
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
              let res = await EditCommentForAdmin(comment, user);
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
    ...ownProps,
  };
}

export default connect(mapp)(EditComment);
