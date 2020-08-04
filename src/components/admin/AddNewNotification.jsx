import React, { useState, useEffect } from "react";
import Select from "../utility/Select";
import Autocomplete from "../utility/Autocomplete";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { BsCalendar, BsClock } from "react-icons/bs";
import TimePicker from "react-time-picker";
import date from "date-and-time";
import { connect } from "react-redux";
import Loader from "../utility/Loader";
import { CreateNotification } from "../../server/DatabaseApi";
import store from "../../store/store";

const AddNewNotification = ({ publicUsers, getBack }) => {
  const types = ["App", "Email"];
  const [notification, setNotification] = useState({
    type: "",
    subject: "",
    receivers: [],
    date: Date.now(),
    description: "",
  });

  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);

  const validations = [
    { valid: notification.subject, error: "Subject is required" },
    { valid: notification.type, error: "Select notification type" },
    {
      valid: notification.receivers.length,
      error: "Select at least one receiver",
    },
    { valid: notification.description, error: "Description is required" },
  ];

  return (
    <div className="row no-gutters p-sm-5 p-4">
      <div className="col-60 py-3 border-bottom mb-4">
        <div className="row no-gutters h3">Add new notification</div>
        <div className="row no-gutters">
          Create a brand new notification and add to this site
        </div>
      </div>
      <div className="col-60" style={{ maxWidth: "800px" }}>
        <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">Subject</div>
          <div className="col-60">
            <input
              type="text"
              className="w-100 input-light px-3"
              value={notification.subject}
              onChange={(e) => {
                e.persist();
                setNotification((prev) =>
                  Object.assign({}, prev, { subject: e.target.value })
                );
              }}
            ></input>
          </div>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">Type</div>
          <Select
            popoverClass="col-sm-30 col-60"
            className="input-light col-60"
            btnName={notification.type ? notification.type : "Select"}
            items={types}
            onSelect={(index) =>
              setNotification((prev) =>
                Object.assign({}, prev, { type: types[index] })
              )
            }
          ></Select>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">Notification to</div>
          <Autocomplete
            onChange={(e, val) => {
              console.log("val", val);
              setNotification((prev) =>
                Object.assign({}, prev, { receivers: val })
              );
            }}
            placeholder={"Search by username"}
            color={"primary"}
            className="col-md-30 col-60 input-light-resize"
            options={Object.values(publicUsers)}
            getOptionLabel={(option) => option.display_name}
          ></Autocomplete>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">Description</div>
          <div className="col-60">
            <textarea
              value={notification.description}
              onChange={(e) => {
                e.persist();
                let text = e.target.value;
                if (text.split(" ").length <= 500) {
                  setNotification((prev) =>
                    Object.assign({}, prev, { description: text })
                  );
                }
              }}
              className="textarea-light w-100"
              style={{ height: "150px" }}
            ></textarea>
          </div>

          <div
            className={`col-60 ${
              notification.description.split(" ").length <= 499
                ? "text-muted"
                : "text-danger"
            }`}
          >
            {notification.description
              ? 500 - notification.description.split(" ").length
              : 500}
            words left
          </div>
        </div>
        <div className="row no-gutters mb-5">
          <div className="col-xl-40 col-md-50 col-60">
            <div className="row no-gutters">
              <div className="col-sm-30 col-60 pr-sm-3 mb-4">
                <div className="row no-gutters">Start Date</div>
                <div className="row no-gutters">
                  <DayPickerInput
                    value={date.format(
                      new Date(notification.date),
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
                        let d = new Date(notification.date);
                        let fy = day.getFullYear();
                        let year = day.getFullYear();
                        let month = day.getMonth();
                        let niceDay = day.getDate();
                        d.setFullYear(year);
                        d.setMonth(month);
                        d.setDate(niceDay);
                        setNotification((prev) =>
                          Object.assign({}, prev, { date: d.getTime() })
                        );
                      }
                    }}
                  />
                </div>
              </div>
              <div className="col-sm-30 col-60 mb-2">
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
                          let newTime = new Date(notification.date);
                          newTime.setHours(h);
                          newTime.setMinutes(m);
                          setNotification((prev) =>
                            Object.assign({}, prev, {
                              date: newTime.getTime(),
                            })
                          );
                        }
                      }}
                      value={new Date(notification.date)}
                    ></TimePicker>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{ height: "50px", opacity: problem ? 1 : 0 }}
              className="row no-gutters align-items-center text-danger my-2"
            >
              {problem}
            </div>
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
                  let invalid = validations.filter((x) => !x.valid);
                  if (invalid.length) {
                    setProblem(invalid[0].error);
                  } else {
                    setLoading(true);
                    let res = await CreateNotification(notification);
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
                          title: "Notification created",
                          message: "Notification was successfully created",
                          type: "success",
                        },
                      });
                      getBack();
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
                Save
              </div>
            </div>
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

export default connect(mapp)(AddNewNotification);
