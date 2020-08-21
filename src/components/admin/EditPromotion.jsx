import React, { useEffect, useState } from "react";
import Select from "../utility/Select";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { BsCalendar, BsClock } from "react-icons/bs";
import TimePicker from "react-time-picker";
import date from "date-and-time";
import { Ratings } from "../../Data";
import store from "../../store/store";
import Loader from "../utility/Loader";
import { EditPromotion as Edit } from "../../server/DatabaseApi";

const EditPromotion = ({ currentPromotion, getBack }) => {
  const [promotion, setPromotion] = useState({
    review: "",
    comment: "",
    review_id: 1,
    comment_id: 1,
    content_type: "",
    publish_status: "",
    active_status: "",
    start_date: Date.now(),
    end_date: Date.now(),
    movie_title: "",
    movie_id: "",
    content: {},
    title: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPromotion((prev) => Object.assign({}, prev, currentPromotion));
  }, [currentPromotion]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const publishStatuses = ["Published", "Drafted", "Deleted"];

  return (
    <div className="row no-gutters p-md-5 p-4">
      <div className="col-60 py-3 border-bottom mb-4">
        <div className="row no-gutters admin-screen-title">Edit Promotions</div>
        <div className="row no-gutters">Edit existing promotion</div>
      </div>
      <div className="col-60">
        {/* <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">Type</div>
          <div className="col-xl-40 col-md-50 col-60">
            <div className="row no-gutters">
              <Select
                popoverClass="col-sm-30 col-60 pr-sm-3"
                onSelect={(index) =>
                  setPromotion((prev) =>
                    Object.assign({}, prev, { content_type: types[index] })
                  )
                }
                className="w-100 input-light px-3"
                items={types}
                btnName={
                  promotion.content_type ? promotion.content_type : "Select"
                }
              ></Select>
            </div>
          </div>
        </div> */}
        <div className="row no-gutters mb-4">
          <div className="col-xl-40 col-md-50 col-60">
            <div className="row no-gutters mb-1">Description</div>
            <div className="row no-gutters">
              <textarea
                value={promotion.description ? promotion.description : ""}
                onChange={(e) => {
                  e.persist();
                  setPromotion((prev) =>
                    Object.assign({}, prev, { description: e.target.value })
                  );
                }}
                className="textarea-light w-100"
                style={{ height: "150px" }}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-xl-40 col-md-50 col-60 mb-1">
            {promotion.content_type}
          </div>
          <div className="col-xl-40 col-md-50 col-60">
            <textarea
              value={
                promotion.content
                  ? promotion.content_type === "Review"
                    ? promotion.content.review
                    : promotion.content.comment
                  : ""
              }
              onChange={(e) => {
                e.persist();
                let text = e.target.value;
                if (text.split(" ").length <= 500) {
                  if (promotion.content_type === "Review") {
                    let newContent = { ...promotion.content };
                    newContent.review = text;
                    setPromotion((prev) =>
                      Object.assign({}, prev, { content: newContent })
                    );
                  } else {
                    let newContent = { ...promotion.content };
                    newContent.comment = text;
                    setPromotion((prev) =>
                      Object.assign({}, prev, { content: newContent })
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
              promotion.content_type
                ? promotion.content_type === "Review"
                  ? promotion.content.review.split(" ").length <= 499
                    ? "text-muted"
                    : "text-danger"
                  : promotion.content.comment.split(" ").length <= 499
                  ? "text-muted"
                  : "text-danger"
                : ""
            }`}
          >
            {promotion.content.review
              ? promotion.content.review.length
                ? 500 - promotion.content.review.split(" ").length
                : 500
              : promotion.content.comment
              ? promotion.content.comment.length
                ? 500 - promotion.content.comment.split(" ").length
                : 500
              : ""}{" "}
            words left
          </div>
        </div>
        {promotion.content_type === "Review" && (
          <div className="col-xl-40 col-md-50 col-60 mb-4 px-0">
            <div className="row no-gutters">
              <div className="col-60">Rating</div>
            </div>
            <div className="row no-gutters">
              <div className="col-sm-30 col-60 pr-sm-3">
                <div className="row no-gutters">
                  <Select
                    popoverClass="col-60"
                    className="input-light px-3"
                    btnName={
                      promotion.content.rating
                        ? Ratings.find(
                            (x) => x.name === promotion.content.rating
                          ).element
                        : "Select"
                    }
                    onSelect={(index) => {
                      let content = { ...promotion.content };
                      content.rating = Ratings[index].name;
                      setPromotion((prev) =>
                        Object.assign({}, prev, { content: content })
                      );
                    }}
                    items={Ratings.map((x) => x.element)}
                  ></Select>
                </div>
              </div>
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
                      value={new Date(promotion.start_date)}
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
                      value={new Date(promotion.end_date)}
                    ></TimePicker>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">Status</div>
          <div className="col-xl-40 col-md-50 col-60">
            <div className="row no-gutters">
              <div className="col-sm-30 col-60 pr-sm-3">
                <div className="row no-gutters">
                  <Select
                    popoverClass="col-60"
                    onSelect={(index) =>
                      setPromotion((prev) =>
                        Object.assign({}, prev, {
                          status: publishStatuses[index],
                        })
                      )
                    }
                    className="w-100 input-light px-3"
                    items={publishStatuses}
                    btnName={promotion.status ? promotion.status : "Select"}
                  ></Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-60 mt-2">
        <div className="row no-gutters">
          <div
            className="btn-custom btn-custom-secondary btn-small mr-sm-3 mb-3 col-60 col-sm-auto"
            onClick={getBack}
          >
            Cancel
          </div>
          <div
            className="btn-custom btn-custom-primary btn-small mb-3 col-60 col-sm-auto"
            onClick={async () => {
              setLoading(true);
              let res = await Edit(promotion);
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
                    title: "Promotion updated",
                    message: "Promotion was successfully updated",
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

export default EditPromotion;
