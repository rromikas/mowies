import React, { useState, useEffect } from "react";
import Select from "../utility/Select";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { BsCalendar, BsClock, BsSearch } from "react-icons/bs";
import TimePicker from "react-time-picker";
import date from "date-and-time";
import Pagination from "../utility/Paigination";
import { Swipeable } from "react-swipeable";
import Checkbox from "../utility/Checkbox";
import { Emoji } from "emoji-mart";
import { GetReviews, CreatePromotions } from "../../server/DatabaseApi";
import { connect } from "react-redux";
import store from "../../store/store";
import Loader from "../utility/Loader";
import OkIcon from "../../images/OkIcon";

const AddNewPromotion = ({ publicUsers, getBack, ratings }) => {
  const [promotion, setPromotion] = useState({
    description: "",
    start_date: Date.now(),
    end_date: Date.now(),
    content_type: "",
    status: "Published",
  });
  const [page, setPage] = useState(1);

  const [problem, setProblem] = useState("");

  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("User");
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState([]);
  const searchKeys = ["User", "Movie", "Review"];
  const [lastVisibleColumn, setLastVisibleColumn] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function getData() {
      let rev = await GetReviews();
      if (!rev.error) {
        setReviews(rev);
      }

      // let com = await GetComments();
      // if (!com.error) {
      //   setComments(com);
      // }
    }

    getData();
  }, []);

  useEffect(() => {
    let arr = [];
    if (search) {
      if (searchKey === "User") {
        if (Object.values(publicUsers).length) {
          reviews.forEach((x) => {
            if (
              publicUsers[x.author].display_name
                .toLowerCase()
                .includes(search.toLowerCase())
            ) {
              arr.push(x);
            }
          });
        }
      } else if (searchKey === "Movie") {
        reviews.forEach((x) => {
          if (
            ratings[x.movie_id] &&
            ratings[x.movie_id].movie_title
              .toLowerCase()
              .includes(search.toLowerCase())
          ) {
            arr.push(x);
          }
        });
      } else if (searchKey === "Review") {
        reviews.forEach((x) => {
          if (x.review.toLowerCase().includes(search.toLowerCase())) {
            arr.push(x);
          }
        });
      }
    } else {
      arr = arr.concat([...reviews]);
    }

    setCandidates(arr.map((x) => Object.assign({}, x, { selected: false })));
  }, [search, reviews]); // eslint-disable-line react-hooks/exhaustive-deps

  let boundaries = [(page - 1) * 5, (page - 1) * 5 + 5];
  if (boundaries[1] >= candidates.length) {
    boundaries[1] = boundaries[1] - (boundaries[1] - candidates.length);
  }

  const columns = ["Movie Name", "Review", "Rating", "Posted On", "Reported"];

  const validations = [
    { valid: promotion.description, error: "Description is required" },
    {
      valid: promotion.start_date < promotion.end_date,
      error: "Start date must be before end date",
    },
    {
      valid: promotion.start_date !== promotion.end_date,
      error: "promotion duration is 0",
    },
    {
      valid: candidates.filter((x) => x.selected).length,
      error: "No content selected",
    },
  ];
  return (
    <div className="row no-gutters p-sm-5 p-4">
      <div className="col-60 border-bottom mb-4">
        <div className="row no-gutters justify-content-between">
          <div className="col-auto py-3">
            <div className="row no-gutters admin-screen-title">
              Promote Content
            </div>
            <div className="row no-gutters">
              Edit, add and delete promotions
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-40 col-md-50 col-60">
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
        <div className="row no-gutters">
          <div className="col-xl-40 col-md-50 col-60">
            <div className="row no-gutters">
              <div className="col-60 pr-sm-3 mb-4">
                <div className="row no-gutters">Start Date</div>
                <div className="row no-gutters">
                  <div className="col-auto mr-2" style={{ width: "182px" }}>
                    <DayPickerInput
                      value={date.format(
                        new Date(promotion.start_date),
                        "DD/MM/YYYY"
                      )}
                      component={(props) => (
                        <div className="position-relative">
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
                  <div
                    className="col-auto position-relative input-light"
                    style={{ width: "150px" }}
                  >
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
            </div>
            <div className="row no-gutters">
              <div className="col-60 mb-4">
                <div className="row no-gutters">End Date</div>
                <div className="row no-gutters">
                  <div className="col-auto mr-2" style={{ width: "182px" }}>
                    <DayPickerInput
                      value={date.format(
                        new Date(promotion.end_date),
                        "DD/MM/YYYY"
                      )}
                      component={(props) => (
                        <div className="position-relative">
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
                  <div
                    className="col-auto position-relative input-light"
                    style={{ width: "150px" }}
                  >
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
        <div className="row no-gutters mb-3 h6 mt-4">
          Select Content To Promote
        </div>
        <div className="row no-gutters mb-3">
          <Select
            onSelect={(index) => setSearchKey(searchKeys[index])}
            className="table-input-prepend-select col-auto bg-custom-primary text-white"
            items={searchKeys}
            btnName={`Search by ${searchKey}`}
          ></Select>
          <div className="col position-relative" style={{ maxWidth: "400px" }}>
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
            ></input>
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
                      <div className="d-none d-lg-block">Posted By</div>
                      <div className="d-block d-lg-none">By</div>
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
                                    Object.values(publicUsers).length
                                      ? publicUsers[x.author].photo
                                      : ""
                                  })`,
                                }}
                              ></div>
                            </div>
                            {Object.values(publicUsers).length ? (
                              <div className="d-none d-md-inline-block align-top">
                                <div className="h6 text-primary">
                                  {publicUsers[x.author].display_name}
                                </div>
                                <div>{publicUsers[x.author].email}</div>
                              </div>
                            ) : (
                              ""
                            )}
                          </td>
                          <td
                            className={`${
                              lastVisibleColumn === 0
                                ? "d-table-cell"
                                : "d-none d-xl-table-cell"
                            }`}
                          >
                            {ratings[x.movie_id]
                              ? ratings[x.movie_id].movie_title
                              : ""}
                          </td>
                          <td
                            className={`${
                              lastVisibleColumn === 1
                                ? "d-table-cell"
                                : "d-none d-xl-table-cell"
                            }`}
                          >
                            {!x.comment ? (
                              <div style={{ minWidth: "200px" }}>
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
                              lastVisibleColumn === 2
                                ? "d-table-cell"
                                : "d-none d-xl-table-cell"
                            }`}
                          >
                            {x.rating ? (
                              x.rating === "ok_rate" ? (
                                <div style={{ marginTop: "-4px" }}>
                                  <OkIcon size={24}></OkIcon>
                                </div>
                              ) : (
                                <div style={{ marginBottom: "-6px" }}>
                                  <Emoji
                                    emoji={
                                      x.rating === "excellent_rate"
                                        ? "fire"
                                        : x.rating === "good_rate"
                                        ? "heart"
                                        : x.rating === "ok_rate"
                                        ? "heavy_division_sign"
                                        : "shit"
                                    }
                                    set="facebook"
                                    size={24}
                                  />
                                </div>
                              )
                            ) : (
                              "-"
                            )}
                          </td>
                          <td
                            style={{ whiteSpace: "nowrap" }}
                            className={`${
                              lastVisibleColumn === 3
                                ? "d-table-cell"
                                : "d-none d-xl-table-cell"
                            }`}
                          >
                            <div>
                              {date.format(
                                new Date(x.date),
                                "DD/MM/YYYY @ hh:mm A"
                              )}
                            </div>
                          </td>
                          <td
                            className={`${
                              !x.reported ? "text-green" : "text-danger"
                            } ${
                              lastVisibleColumn === 4
                                ? "d-table-cell"
                                : "d-none d-xl-table-cell"
                            }`}
                          >
                            {x.reported ? "Abused" : "Not Reported"}
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
              </table>
            </div>
          </Swipeable>
        </div>
        <div className="row no-gutters justify-content-end">
          <div className="col-auto">
            <Pagination
              count={Math.ceil(candidates.length / 5)}
              current={page}
              setCurrent={setPage}
            ></Pagination>
          </div>
        </div>
        <div className="col-60 mt-1 px-0">
          <div
            style={{ height: "50px", opacity: problem ? 1 : 0 }}
            className="row no-gutters align-items-center text-danger mb-2"
          >
            {problem}
          </div>
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
                let invalid = validations.filter((x) => !x.valid);
                if (invalid.length) {
                  setProblem(invalid[0].error);
                } else {
                  let promos = candidates
                    .filter((x) => x.selected)
                    .map((x) =>
                      Object.assign({}, promotion, {
                        content_type: x.comment ? "Comment" : "Review",
                        content: x.comment
                          ? { comment: x.comment }
                          : { review: x.review, rating: x.rating },
                        content_id: x._id,
                        content_author: x.author,
                        movie_title: x.movie_title,
                        movie_genres: x.movie_genres,
                        movie_poster: x.movie_poster,
                        movie_release_date: x.movie_release_date,
                        movie_id: x.movie_id,
                      })
                    );
                  setLoading(true);
                  let res = await CreatePromotions(promos);
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
                        title: "Promotions created",
                        message: "Promotions were successfully created",
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
  );
};

function mapp(state, ownProps) {
  return {
    publicUsers: state.publicUsers,
    ratings: state.ratings,
    ...ownProps,
  };
}

export default connect(mapp)(AddNewPromotion);
