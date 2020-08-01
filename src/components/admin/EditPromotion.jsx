import React, { useEffect, useState } from "react";
import Select from "../utility/Select";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { BsCalendar, BsClock } from "react-icons/bs";
import TimePicker from "react-time-picker";
import date from "date-and-time";
import { Ratings } from "../../Data";

const EditPromotion = ({ currentPromotion }) => {
  const [promotion, setPromotion] = useState({
    review: "",
    comment: "",
    review_id: 1,
    comment_id: 1,
    type: "review",
    status: "Sent",
    active_status: "Active",
    start_date: Date.now(),
    end_date: Date.now(),
    movie_title: "Venum",
    title: "",
  });

  useEffect(() => {
    setPromotion((prev) => Object.assign({}, prev, currentPromotion));
  }, [currentPromotion]);

  const types = ["Review", "Comment"];
  const statuses = ["Published", "Drafted", "Deleted"];

  return (
    <div className="row no-gutters px-md-5 px-4 pb-4">
      <div className="col-60 py-3 border-bottom mb-4">
        <div className="row no-gutters h3">Announcements</div>
        <div className="row no-gutters">Edit existing announcement</div>
      </div>
      <div className="col-60">
        <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">Type</div>
          <div className="col-xl-40 col-md-50 col-60">
            <div className="row no-gutters">
              <Select
                popoverClass="col-sm-30 col-60 pr-sm-3"
                onSelect={(index) =>
                  setPromotion((prev) =>
                    Object.assign({}, prev, { type: types[index] })
                  )
                }
                className="w-100 input-light px-3"
                items={types}
                btnName={promotion.type ? promotion.type : "Select"}
              ></Select>
            </div>
          </div>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">Description</div>
          <div className="col-60">
            <textarea
              value={
                promotion.type.toLowerCase() === "review"
                  ? promotion.review
                  : promotion.comment
              }
              onChange={(e) => {
                e.persist();
                let text = e.target.value;
                if (text.split(" ").length <= 500) {
                  if (promotion.type.toLowerCase() === "review") {
                    setPromotion((prev) =>
                      Object.assign({}, prev, { review: text })
                    );
                  } else {
                    setPromotion((prev) =>
                      Object.assign({}, prev, { comment: text })
                    );
                  }
                }
              }}
              className="textarea-light w-100"
              style={{ height: "150px" }}
            ></textarea>
          </div>

          <div
            className={`col-60 ${
              promotion.type.toLowerCase() === "review"
                ? promotion.review.split(" ").length <= 499
                  ? "text-muted"
                  : "text-danger"
                : promotion.comment.split(" ").length <= 499
                ? "text-muted"
                : "text-danger"
            }`}
          >
            {promotion.type.toLowerCase() === "review"
              ? promotion.review
                ? 500 - promotion.review.split(" ").length
                : 500
              : promotion.comment
              ? 500 - promotion.comment.split(" ").length
              : 500}{" "}
            words left
          </div>
        </div>
        {promotion.type.toLowerCase() === "review" && (
          <div className="col-xl-40 col-md-50 col-60 mb-4 px-0">
            <div className="row no-gutters">
              <div className="col-60">Rating</div>
            </div>
            <div className="row no-gutters">
              <Select
                popoverClass="col-sm-30 col-60 pr-sm-3"
                className="input-light px-3"
                btnName={
                  promotion.rating
                    ? Ratings.find((x) => x.name === promotion.rating).element
                    : "Select"
                }
                onSelect={(index) => {
                  setPromotion((prev) =>
                    Object.assign({}, prev, { rating: Ratings[index].name })
                  );
                }}
                items={Ratings.map((x) => x.element)}
              ></Select>
            </div>
          </div>
        )}

        <div className="row no-gutters">
          <div className="col-xl-40 col-md-50 col-60">
            <div className="row no-gutters">
              <div className="col-sm-30 col-60 pr-sm-3 mb-4">
                <div className="row no-gutters">Start Date</div>
                <div className="row no-gutters">
                  <DayPickerInput
                    value={date.format(
                      new Date(promotion.start_date),
                      "DD/MM/YYYY"
                    )}
                    component={(props) => (
                      <div className="position-relative w-100">
                        <BsCalendar
                          style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            margin: "auto",
                            left: "18px",
                          }}
                        ></BsCalendar>
                        <input
                          {...props}
                          className="input-light w-100 pl-5 pr-3"
                          placeholder="YYYY-MM-DD"
                        ></input>
                      </div>
                    )}
                    onDayChange={(day) => {
                      if (day) {
                        let d = new Date(promotion.start_date);
                        let fy = day.getFullYear();
                        let year = day.getFullYear();
                        let month = day.getMonth();
                        let niceDay = day.getDate();
                        d.setFullYear(year);
                        d.setMonth(month);
                        d.setDate(niceDay);
                        setPromotion((prev) =>
                          Object.assign({}, prev, { start_date: d.getTime() })
                        );
                      }
                    }}
                  />
                </div>
              </div>
              <div className="col-sm-30 col-60 mb-4">
                <div className="row no-gutters">End Date</div>
                <div className="row no-gutters">
                  <DayPickerInput
                    value={date.format(
                      new Date(promotion.end_date),
                      "DD/MM/YYYY"
                    )}
                    component={(props) => (
                      <div className="position-relative w-100">
                        <BsCalendar
                          style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            margin: "auto",
                            left: "18px",
                          }}
                        ></BsCalendar>
                        <input
                          {...props}
                          className="input-light w-100 pl-5 pr-3"
                          placeholder="YYYY-MM-DD"
                        ></input>
                      </div>
                    )}
                    onDayChange={(day) => {
                      if (day) {
                        let d = new Date(promotion.end_date);
                        let fy = day.getFullYear();
                        let year = day.getFullYear();
                        let month = day.getMonth();
                        let niceDay = day.getDate();
                        d.setFullYear(year);
                        d.setMonth(month);
                        d.setDate(niceDay);
                        setPromotion((prev) =>
                          Object.assign({}, prev, { end_date: d.getTime() })
                        );
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-sm-30 pr-sm-3 col-60 mb-4">
                <div className="row no-gutters">Start Time</div>
                <div className="row no-gutters">
                  <div className="col-60 position-relative input-light">
                    <BsClock
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        margin: "auto",
                        left: "18px",
                      }}
                    ></BsClock>
                    <TimePicker
                      clearIcon={null}
                      clockIcon={null}
                      className="w-100 pl-5"
                      onChange={(a) => {
                        if (a) {
                          let [h, m] = a.split(":");
                          let newTime = new Date(promotion.start_date);
                          newTime.setHours(h);
                          newTime.setMinutes(m);
                          setPromotion((prev) =>
                            Object.assign({}, prev, {
                              start_date: newTime.getTime(),
                            })
                          );
                        }
                      }}
                      value={date.format(
                        new Date(promotion.start_date),
                        "hh:mm"
                      )}
                    ></TimePicker>
                  </div>
                </div>
              </div>
              <div className="col-sm-30 col-60 mb-4">
                <div className="row no-gutters">End Time</div>
                <div className="row no-gutters">
                  <div className="col-60 position-relative input-light">
                    <BsClock
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        margin: "auto",
                        left: "18px",
                      }}
                    ></BsClock>
                    <TimePicker
                      clearIcon={null}
                      clockIcon={null}
                      className="w-100 pl-5"
                      onChange={(a) => {
                        if (a) {
                          let [h, m] = a.split(":");
                          let newTime = new Date(promotion.end_date);
                          newTime.setHours(h);
                          newTime.setMinutes(m);
                          setPromotion((prev) =>
                            Object.assign({}, prev, {
                              end_date: newTime.getTime(),
                            })
                          );
                        }
                      }}
                      value={date.format(new Date(promotion.end_date), "hh:mm")}
                    ></TimePicker>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">Type</div>
          <div className="col-xl-40 col-md-50 col-60">
            <div className="row no-gutters">
              <Select
                popoverClass="col-sm-30 col-60 pr-sm-3"
                onSelect={(index) =>
                  setPromotion((prev) =>
                    Object.assign({}, prev, { status: statuses[index] })
                  )
                }
                className="w-100 input-light px-3"
                items={statuses}
                btnName={promotion.status ? promotion.status : "Select"}
              ></Select>
            </div>
          </div>
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

export default EditPromotion;
