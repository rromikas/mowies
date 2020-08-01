import React, { useEffect, useState } from "react";
import Select from "../utility/Select";
import { Emoji } from "emoji-mart";
import { Ratings } from "../../Data";

const EditReview = ({ currentReview }) => {
  const [review, setReview] = useState({});

  useEffect(() => {
    setReview(currentReview);
  }, [currentReview]);

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
          <div className="col-60 mb-1">Message</div>
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
          <div className="60 mb-1">Movie name</div>
        </div>
        <div className="row no-gutters">
          <Select
            popoverClass="col-md-30 col-60"
            className="input-light px-3"
            btnName={review.movie_title ? review.movie_title : "Select"}
            onSelect={(index) => {
              setReview((prev) =>
                Object.assign({}, prev, {
                  movie_title: ["Venom", "Spongebob", "Simpsons"][index],
                })
              );
            }}
            items={["Venom", "Spongebob", "Simpsons"]}
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

export default EditReview;
