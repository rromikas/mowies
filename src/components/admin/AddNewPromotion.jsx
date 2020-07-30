import React, { useState, useEffect } from "react";
import Select from "../utility/Select";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { BsCalendar, BsClock, BsSearch } from "react-icons/bs";
import TimePicker from "react-time-picker";
import date from "date-and-time";
import { Reviews, Comments, PublicUsers } from "../../Data";
import Pagination from "../utility/Paigination";
import { Swipeable } from "react-swipeable";
import Checkbox from "../utility/Checkbox";
import { Emoji } from "emoji-mart";

const AddNewPromotion = () => {
  const [promotion, setPromotion] = useState({
    start_date: Date.now(),
    end_date: Date.now(),
  });
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");

  const [searchKey, setSearchKey] = useState("User");
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState([]);
  const searchKeys = ["User", "Review", "Comment", "Movie"];
  const [lastVisibleColumn, setLastVisibleColumn] = useState(0);

  useEffect(() => {
    let arr = [];
    if (searchKey === "User") {
      Reviews.forEach((x) => {
        if (PublicUsers[x.author].display_name.match(new RegExp(search, "i"))) {
          arr.push(x);
        }
      });

      Comments.forEach((x) => {
        if (PublicUsers[x.author].display_name.match(new RegExp(search, "i"))) {
          arr.push(x);
        }
      });
    } else if (searchKey === "Movie") {
      Reviews.forEach((x) => {
        if (x.movie_title.match(new RegExp(search, "i"))) {
          arr.push(x);
        }
      });

      Comments.forEach((x) => {
        if (x.movie_title.match(new RegExp(search, "i"))) {
          arr.push(x);
        }
      });
    } else if (searchKey === "Review") {
      Reviews.forEach((x) => {
        if (x.review.match(new RegExp(search, "i"))) {
          arr.push(x);
        }
      });
    } else if (searchKey === "Comment") {
      Comments.forEach((x) => {
        if (x.comment.match(new RegExp(search, "i"))) {
          arr.push(x);
        }
      });
    }
    setCandidates(arr.map((x) => Object.assign({}, x, { selected: false })));
  }, [search]);

  let boundaries = [(page - 1) * 5, (page - 1) * 5 + 5];
  if (boundaries[1] >= candidates.length) {
    boundaries[1] = boundaries[1] - (boundaries[1] - candidates.length);
  }

  const columns = ["Review or Comment", "Reported", "Movie Name", "Posted On"];

  return (
    <div className="row no-gutters p-sm-5 p-4">
      <div className="col-60 border-bottom mb-4">
        <div className="row no-gutters justify-content-between">
          <div className="col-auto py-3">
            <div className="row no-gutters h3">Promote Content</div>
            <div className="row no-gutters">Edit, add and delete promtions</div>
          </div>
        </div>
      </div>
      <div className="col-xl-40 col-md-50 col-60">
        <div className="row no-gutters mb-3">
          <Select
            onSelect={(index) => setSearchKey(searchKeys[index])}
            className="table-input-prepend-select col-auto bg-custom-primary text-white"
            items={searchKeys}
            btnName={`Search by ${searchKey}`}
          ></Select>
          <div className="col position-relative">
            <BsSearch
              fontSize="20px"
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                margin: "auto",
                right: "18px",
              }}
            ></BsSearch>
            <input
              value={search}
              onChange={(e) => {
                e.persist();
                setSearch(e.target.value);
              }}
              className="table-input pr-5 pl-3 w-100"
              style={{ minWidth: "300px" }}
            ></input>
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
      </div>
      <div className="col-60">
        <div className="row no-gutters">
          <Swipeable
            style={{ minWidth: "100%" }}
            onSwipedLeft={() => {
              setLastVisibleColumn(
                lastVisibleColumn + 1 < 4
                  ? lastVisibleColumn + 1
                  : lastVisibleColumn
              );
            }}
            onSwipedRight={() => {
              setLastVisibleColumn(
                lastVisibleColumn - 1 >= 0
                  ? lastVisibleColumn - 1
                  : lastVisibleColumn
              );
            }}
          >
            <div className="table-responsive">
              <table className="table bg-white border">
                <thead>
                  <tr>
                    <th className="text-center">
                      <Checkbox
                        color={"primary"}
                        checked={
                          candidates
                            .slice(boundaries[0], boundaries[1])
                            .filter((x) => x.selected).length ===
                          boundaries[1] - boundaries[0]
                        }
                        onChange={(e) => {
                          setCandidates((prev) => {
                            let arr = [...prev];
                            for (
                              let i = boundaries[0];
                              i < boundaries[1];
                              i++
                            ) {
                              arr[i].selected = e.target.checked;
                            }
                            return arr;
                          });
                        }}
                      ></Checkbox>
                    </th>
                    <th className="table-header text-truncate text-left">
                      Title
                    </th>
                    <th className="d-table-cell d-xl-none table-header text-truncate">
                      {columns[lastVisibleColumn]}
                    </th>
                    {columns.map((c) => (
                      <th className="d-none d-xl-table-cell table-header text-truncate">
                        <div>{c}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {candidates.length ? (
                    candidates
                      .slice((page - 1) * 5, (page - 1) * 5 + 5)
                      .map((x, i) => (
                        <tr
                          className="font-weight-600 bg-light"
                          key={`shortlist-item-${i}`}
                        >
                          <td className="text-center">
                            <Checkbox
                              color={"primary"}
                              checked={x.selected}
                              onChange={(e) => {
                                setCandidates((prev) => {
                                  let arr = [...prev];
                                  arr[(page - 1) * 5 + i].selected =
                                    e.target.checked;
                                  return arr;
                                });
                              }}
                            ></Checkbox>
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            <div className="d-inline-block mr-2">
                              <div
                                className="square-50 rounded-circle bg-image"
                                style={{
                                  backgroundImage: `url(${
                                    PublicUsers[x.author].photo
                                  })`,
                                }}
                              ></div>
                            </div>
                            <div className="d-none d-md-inline-block align-top">
                              <div className="h6 text-primary">
                                {PublicUsers[x.author].display_name}
                              </div>
                              <div>{PublicUsers[x.author].email}</div>
                            </div>
                          </td>
                          <td
                            className={`${
                              lastVisibleColumn === 0
                                ? "d-table-cell"
                                : "d-none d-xl-table-cell"
                            }`}
                          >
                            {x.review ? (
                              <div>
                                <div className="d-flex">
                                  <div className="mr-3">Rating:</div>
                                  <div style={{ marginBottom: "-6px" }}>
                                    <Emoji
                                      emoji={
                                        x.rating === "Excellent"
                                          ? "fire"
                                          : x.rating === "Good"
                                          ? "heart"
                                          : x.rating === "OK"
                                          ? "heavy_division_sign"
                                          : "shit"
                                      }
                                      set="facebook"
                                      size={24}
                                    />
                                  </div>
                                </div>
                                <div
                                  className="text-clamp-4 cursor-pointer user-select-none"
                                  onClick={(e) => {
                                    let target = e.currentTarget;
                                    if (
                                      target.classList.contains("text-clamp-4")
                                    ) {
                                      target.classList.remove("text-clamp-4");
                                    } else {
                                      target.classList.add("text-clamp-4");
                                    }
                                  }}
                                >
                                  {x.review}
                                </div>
                              </div>
                            ) : (
                              <div
                                className="text-clamp-4 cursor-pointer user-select-none"
                                onClick={(e) => {
                                  let target = e.currentTarget;
                                  if (
                                    target.classList.contains("text-clamp-4")
                                  ) {
                                    target.classList.remove("text-clamp-4");
                                  } else {
                                    target.classList.add("text-clamp-4");
                                  }
                                }}
                              >
                                {x.comment}
                              </div>
                            )}
                          </td>
                          <td
                            className={`${
                              !x.reported ? "text-green" : "text-danger"
                            } ${
                              lastVisibleColumn === 1
                                ? "d-table-cell"
                                : "d-none d-xl-table-cell"
                            }`}
                          >
                            {x.reported ? "Abused" : "Not Reported"}
                          </td>
                          <td
                            className={`${
                              lastVisibleColumn === 2
                                ? "d-table-cell"
                                : "d-none d-xl-table-cell"
                            }`}
                          >
                            {x.movie_title}
                          </td>
                          <td
                            className={`${
                              lastVisibleColumn === 3
                                ? "d-table-cell"
                                : "d-none d-xl-table-cell"
                            }`}
                          >
                            <div>
                              {date.format(new Date(x.date), "DD/MM/YYYY")}
                            </div>
                            <div>
                              {date.format(new Date(x.date), "@ hh:mm A")}
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={3} className=" text-center py-5">
                        0 results found
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <th className="text-center">
                      <Checkbox
                        color={"primary"}
                        checked={
                          candidates
                            .slice(boundaries[0], boundaries[1])
                            .filter((x) => x.selected).length ===
                          boundaries[1] - boundaries[0]
                        }
                        onChange={(e) => {
                          setCandidates((prev) => {
                            let arr = [...prev];
                            for (
                              let i = boundaries[0];
                              i < boundaries[1];
                              i++
                            ) {
                              arr[i].selected = e.target.checked;
                            }
                            return arr;
                          });
                        }}
                      ></Checkbox>
                    </th>
                    <th className="table-footer text-truncate text-left">
                      Title
                    </th>
                    <th className="d-table-cell d-xl-none table-header text-truncate">
                      {columns[lastVisibleColumn]}
                    </th>
                    {columns.map((c) => (
                      <th className="d-none d-xl-table-cell table-header text-truncate">
                        <div>{c}</div>
                      </th>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </Swipeable>
        </div>
        <div className="row no-gutters justify-content-center justify-content-sm-between">
          <div className="col-auto">
            <Pagination
              count={Math.ceil(candidates.length / 5)}
              current={page}
              setCurrent={setPage}
            ></Pagination>
          </div>
        </div>
        <div className="col-60 mt-5 px-0">
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
    </div>
  );
};

export default AddNewPromotion;
