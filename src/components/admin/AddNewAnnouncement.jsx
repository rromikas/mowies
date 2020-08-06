import React, { useEffect, useState } from "react";
import Select from "../utility/Select";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { BsCalendar, BsClock } from "react-icons/bs";
import TimePicker from "react-time-picker";
import date from "date-and-time";
import { CreateAnnouncement, GetAnnouncements } from "../../server/DatabaseApi";
import store from "../../store/store";
import { connect } from "react-redux";
import Loader from "../utility/Loader";

const AddNewAnnouncement = ({ user, getBack }) => {
  const [announcement, setAnnouncement] = useState({
    description: "",
    type: "",
    start_date: Date.now(),
    end_date: Date.now(),
    status: "",
  });

  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);

  const types = ["Information", "Warning", "Error"];
  const statuses = ["Published", "Drafted", "Deleted"];

  const validations = [
    { valid: announcement.description, error: "Description is required" },
    { valid: announcement.type, error: "Type is required" },
    {
      valid: announcement.start_date < announcement.end_date,
      error: "Start date must be before end date",
    },
    {
      valid: announcement.start_date !== announcement.end_date,
      error: "Announcement duration is 0",
    },
  ];

  return (
    <div className="row no-gutters p-md-5 p-4">
      <div className="col-60 py-3 border-bottom mb-4">
        <div className="row no-gutters admin-screen-title">Announcements</div>
        <div className="row no-gutters">
          Creat a brand new announcement and add to this site
        </div>
      </div>
      <div className="col-60">
        <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">Type</div>
          <div className="col-xl-40 col-md-50 col-60">
            <div className="row no-gutters">
              <Select
                popoverClass="col-sm-30 col-60"
                onSelect={(index) =>
                  setAnnouncement((prev) =>
                    Object.assign({}, prev, { type: types[index] })
                  )
                }
                className="w-100 input-light px-3"
                items={types}
                btnName={announcement.type ? announcement.type : "Select"}
              ></Select>
            </div>
          </div>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">Description</div>
          <div className="col-60">
            <textarea
              value={announcement.description ? announcement.description : ""}
              onChange={(e) => {
                e.persist();
                setAnnouncement((prev) =>
                  Object.assign({}, prev, { description: e.target.value })
                );
              }}
              className="textarea-light w-100"
              style={{ height: "150px" }}
            ></textarea>
          </div>

          <div
            className={`col-60 ${
              announcement.description.split(" ").length <= 499
                ? "text-muted"
                : "text-danger"
            }`}
          >
            {announcement.description
              ? 500 - announcement.description.split(" ").length
              : 500}{" "}
            words left
          </div>
        </div>
        <div className="row no-gutters">
          <div className="col-xl-40 col-md-50 col-60">
            <div className="row no-gutters">
              <div className="col-sm-30 col-60 pr-sm-3 mb-4">
                <div className="row no-gutters">Start Date</div>
                <div className="row no-gutters">
                  <DayPickerInput
                    value={date.format(
                      new Date(announcement.start_date),
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
                        let d = new Date(announcement.start_date);
                        let fy = day.getFullYear();
                        let year = day.getFullYear();
                        let month = day.getMonth();
                        let niceDay = day.getDate();
                        d.setFullYear(year);
                        d.setMonth(month);
                        d.setDate(niceDay);
                        setAnnouncement((prev) =>
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
                      new Date(announcement.end_date),
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
                        let d = new Date(announcement.end_date);
                        let fy = day.getFullYear();
                        let year = day.getFullYear();
                        let month = day.getMonth();
                        let niceDay = day.getDate();
                        d.setFullYear(year);
                        d.setMonth(month);
                        d.setDate(niceDay);
                        setAnnouncement((prev) =>
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
                          let newTime = new Date(announcement.start_date);
                          newTime.setHours(h);
                          newTime.setMinutes(m);
                          setAnnouncement((prev) =>
                            Object.assign({}, prev, {
                              start_date: newTime.getTime(),
                            })
                          );
                        }
                      }}
                      value={new Date(announcement.start_date)}
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
                          let newTime = new Date(announcement.end_date);
                          newTime.setHours(h);
                          newTime.setMinutes(m);
                          setAnnouncement((prev) =>
                            Object.assign({}, prev, {
                              end_date: newTime.getTime(),
                            })
                          );
                        }
                      }}
                      value={new Date(announcement.end_date)}
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
              <Select
                popoverClass="col-sm-30 col-60"
                onSelect={(index) =>
                  setAnnouncement((prev) =>
                    Object.assign({}, prev, { status: statuses[index] })
                  )
                }
                className="w-100 input-light px-3"
                items={statuses}
                btnName={announcement.status ? announcement.status : "Select"}
              ></Select>
            </div>
          </div>
        </div>
      </div>

      <div className="col-60 mt-3">
        <div
          style={{ height: "50px", opacity: problem ? 1 : 0 }}
          className="row no-gutters align-items-center text-danger"
        >
          {problem}
        </div>
        <div className="row no-gutters mt-2">
          <div
            className="btn-custom btn-custom-secondary btn-small mr-sm-3 mb-3 col-60 col-sm-auto"
            onClick={() => getBack()}
          >
            Cancel
          </div>
          <div
            className="btn-custom btn-custom-primary btn-small mb-3 col-60 col-sm-auto"
            onClick={async () => {
              if (user._id) {
                let invalid = validations.filter((x) => !x.valid);
                if (invalid.length) {
                  setProblem(invalid[0].error);
                } else {
                  setLoading(true);
                  let res = await CreateAnnouncement(
                    Object.assign({}, announcement, { author: user._id })
                  );
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
                        title: "Announcement created",
                        message: "You successfully created announcement",
                        type: "success",
                      },
                    });
                    getBack();
                  }
                }
              } else {
                store.dispatch({
                  type: "SET_NOTIFICATION",
                  notification: {
                    title: "Login required",
                    message: "You need to login to create announcements",
                    type: "failure",
                  },
                });
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
    user: state.user,
    ...ownProps,
  };
}

export default connect(mapp)(AddNewAnnouncement);
