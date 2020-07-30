import React, { useEffect, useState } from "react";
import Select from "../utility/Select";
import { Emoji } from "emoji-mart";

const ratings = [
  {
    name: "Excellent",
    element: (
      <div className="text-center" style={{ marginBottom: "-6px" }}>
        <Emoji emoji="fire" set="facebook" size={24} />
      </div>
    ),
  },
  {
    name: "Good",
    element: (
      <div className="text-center" style={{ marginBottom: "-6px" }}>
        <Emoji emoji="heart" set="facebook" size={24} />
      </div>
    ),
  },
  {
    name: "OK",
    element: (
      <div className="text-center" style={{ marginBottom: "-6px" }}>
        <Emoji emoji="heavy_division_sign" set="facebook" size={24} />
      </div>
    ),
  },
  {
    name: "Bad",
    element: (
      <div className="text-center" style={{ marginBottom: "-6px" }}>
        <Emoji emoji="shit" set="facebook" size={24} />
      </div>
    ),
  },
];

const EditComment = ({ currentComment }) => {
  console.log("edit comment", currentComment);

  const [comment, setComment] = useState({});

  useEffect(() => {
    setComment(currentComment);
  }, [currentComment]);

  return (
    <div
      className="row no-gutters px-md-5 px-4 pb-4"
      style={{ maxWidth: "800px" }}
    >
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
            <input type="text" className="input-light w-100 px-3"></input>
          </div>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">Comment</div>
          <div className="col-60">
            <textarea
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
          <div className="btn-custom btn-custom-secondary btn-small mr-sm-3 mb-3 col-60 col-sm-auto">
            Cancel
          </div>
          <div className="btn-custom btn-custom-primary btn-small mb-3 col-60 col-sm-auto">
            Save
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditComment;
