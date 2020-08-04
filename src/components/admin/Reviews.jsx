import React, { useState, useEffect } from "react";
import Select from "../utility/Select";
import Checkbox from "../utility/Checkbox";
import { Emoji } from "emoji-mart";
import Pagination from "../utility/Paigination";
import { BsSearch } from "react-icons/bs";
import date from "date-and-time";
import { Swipeable } from "react-swipeable";
import { GetReviews, DeleteMultipleReviews } from "../../server/DatabaseApi";
import { connect } from "react-redux";
import store from "../../store/store";

const Reviews = ({ setEditReviewSection, setEditReview, publicUsers }) => {
  const [action, setAction] = useState("");
  const [role, setRole] = useState("");
  const [searchKey, setSearchKey] = useState("User");
  const [lastVisibleColumn, setLastVisibleColumn] = useState(0);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");
  const [mainFilter, setMainFilter] = useState({ key: "", value: "" });
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    async function getData() {
      let res = await GetReviews();
      if (!res.error) {
        setReviews(res.map((x) => Object.assign({}, x, { selected: false })));
      }
    }
    getData();
  }, [refresh]);

  useEffect(() => {
    let arr = [...reviews];
    if (reviews.length) {
      if (search) {
        if (searchKey === "User") {
          arr = arr.filter((x) =>
            publicUsers[x.author].display_name.match(new RegExp(search, "i"))
          );
        } else if (searchKey === "Review") {
          arr = arr.filter((x) => x.review.match(new RegExp(search, "i")));
        } else if (searchKey === "Date") {
          arr = arr.filter((x) =>
            date.format(new Date(x.date), "DD/MM/YYYY").includes(search)
          );
        } else if (searchKey === "Movie") {
          arr = arr.filter((x) => x.movie_title.match(new RegExp(search, "i")));
        }
      }

      if (roleFilter) {
        arr = arr.filter((x) => publicUsers[x.author].role === roleFilter);
      }

      if (mainFilter.key && mainFilter.value) {
        arr = arr.filter((x) => x[mainFilter.key] === mainFilter.value);
      }

      setFilteredReviews(arr);
    }
  }, [search, roleFilter, reviews, mainFilter]);

  //boundaries for slicing reviews array. (pagination)
  let boundaries = [(page - 1) * 5, (page - 1) * 5 + 5];
  if (boundaries[1] >= filteredReviews.length) {
    boundaries[1] = boundaries[1] - (boundaries[1] - filteredReviews.length);
  }

  const handleApply = async (all = false) => {
    if (all) {
      setRoleFilter(role);
    }
    if (action === "Edit") {
      let selected = filteredReviews.filter((x) => x.selected);
      if (selected.length) {
        setEditReview(selected[0]);
        setEditReviewSection();
      }
    } else if (action === "Delete") {
      let selected = filteredReviews.filter((x) => x.selected);
      if (selected.length) {
        let res = await DeleteMultipleReviews(selected.map((x) => x._id));
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
              title: "Reviews were deleted",
              message: "Reviews were successfully deleted",
              type: "success",
            },
          });
        }
        setRefresh(!refresh);
      }
    }
  };

  return (
    <div className="row no-gutters">
      <div className="col-60 py-5">
        <div className="row no-gutters h6 mb-3">
          <div
            className={`col-auto cursor-pointer ${
              !mainFilter.key && !roleFilter ? "text-primary" : "text-dark"
            }`}
            onClick={() => {
              setMainFilter({ key: "", value: "" });
              setRoleFilter("");
            }}
          >
            All ({reviews.length})
          </div>
          <div className="col-auto px-2 text-muted">|</div>
          <div
            onClick={() =>
              setMainFilter((prev) =>
                Object.assign({}, prev, { key: "role", value: "Admin" })
              )
            }
            className={`cursor-pointer col-auto ${
              mainFilter.key === "role" && mainFilter.value === "Admin"
                ? "text-primary"
                : "text-dark"
            }`}
          >
            By Administrators (
            {Object.values(publicUsers).length
              ? reviews.filter((x) => publicUsers[x.author].role === "Admin")
                  .length
              : ""}
            )
          </div>
          <div className="col-auto px-2 text-muted">|</div>
          <div
            onClick={() =>
              setMainFilter((prev) =>
                Object.assign({}, prev, { key: "deleted", value: true })
              )
            }
            className={`cursor-pointer col-auto ${
              mainFilter.key === "deleted" && mainFilter.value === true
                ? "text-primary"
                : "text-dark"
            }`}
          >
            Deleted ({reviews.filter((x) => x.deleted).length})
          </div>
        </div>
        <div className="row no-gutters justify-content-between">
          <div className="col-sm-auto col-60">
            <div className="row no-gutters">
              <div className="col-60 col-sm-auto pb-3 mr-sm-3">
                <div className="row no-gutters">
                  <Select
                    popoverClass="col-60 col-sm-auto"
                    onSelect={(index) => setAction(["Edit", "Delete"][index])}
                    items={["Edit", "Delete"]}
                    btnName={action ? action : "Select Action"}
                    className="input-light px-3 col-auto "
                  ></Select>
                </div>
              </div>

              <div
                onClick={handleApply}
                className="d-none d-xl-block btn-custom btn-custom-primary col-auto mr-3 btn-xsmall mb-3"
              >
                Apply
              </div>
              <div className="col-60 col-sm-auto pb-3 mr-sm-3">
                <div className="row no-gutters">
                  <Select
                    popoverClass="col-60 col-sm-auto"
                    onSelect={(index) => setRole(["Admin", "User"][index])}
                    items={["Administrator", "User"]}
                    btnName={role ? role : "Select Role"}
                    className="input-light px-3 col-auto"
                  ></Select>
                </div>
              </div>

              <div
                className="d-none d-xl-block btn-custom btn-custom-primary col-auto mb-3 mr-3 btn-xsmall"
                onClick={() => setRoleFilter(role)}
              >
                Apply
              </div>
              <div
                onClick={() => handleApply(true)}
                className="d-block d-xl-none btn-custom btn-custom-primary col-60 col-sm-auto mb-3 mr-3 btn-xsmall"
              >
                Apply All
              </div>
            </div>
          </div>
          <div className="col-60 d-block d-sm-none">
            <div className="row no-gutters mb-3">
              <Select
                popoverClass="w-100"
                onSelect={(index) =>
                  setSearchKey(["User", "Review", "Movie", "Date"][index])
                }
                className="input-light col-60"
                items={["User", "Review", "Movie", "Date"]}
                btnName={`Search by ${searchKey}`}
              ></Select>
            </div>
            <div className="row no-gutters mb-3">
              <div className="col-60 position-relative">
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
                  className="input-light w-100 pr-5 pl-3"
                  value={search}
                  onChange={(e) => {
                    e.persist();
                    setSearch(e.target.value);
                  }}
                ></input>
              </div>
            </div>
          </div>
          <div className="col-auto mb-3 d-none d-sm-block">
            <div className="row no-gutters">
              <Select
                onSelect={(index) =>
                  setSearchKey(["User", "Review", "Movie", "Date"][index])
                }
                className="table-input-prepend-select col-auto"
                items={["User", "Review", "Movie", "Date"]}
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
                  className="table-input pr-5 pl-3"
                  style={{ minWidth: "300px" }}
                ></input>
              </div>
            </div>
          </div>
        </div>
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
                          reviews
                            .slice(boundaries[0], boundaries[1])
                            .filter((x) => x.selected).length ===
                          boundaries[1] - boundaries[0]
                        }
                        onChange={(e) => {
                          setFilteredReviews((prev) => {
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
                      {
                        ["Review", "Reported", "Movie Name", "Posted On"][
                          lastVisibleColumn
                        ]
                      }
                    </th>
                    <th className="d-none d-xl-table-cell table-header text-truncate">
                      <div>Review</div>
                    </th>
                    <th className="d-none d-xl-table-cell table-header text-truncate">
                      <div>Reported</div>
                    </th>
                    <th className="d-none d-xl-table-cell table-header text-truncate">
                      <div>Movie Name</div>
                    </th>
                    <th className="d-none d-xl-table-cell table-header text-truncate">
                      <div>Posted On</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.length ? (
                    filteredReviews
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
                                setFilteredReviews((prev) => {
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
                                    publicUsers[x.author].photo
                                  })`,
                                }}
                              ></div>
                            </div>
                            <div className="d-none d-md-inline-block align-top">
                              <div className="h6 text-primary">
                                {publicUsers[x.author].display_name}
                              </div>
                              <div>{publicUsers[x.author].email}</div>
                            </div>
                          </td>
                          <td
                            className={`${
                              lastVisibleColumn === 0
                                ? "d-table-cell"
                                : "d-none d-xl-table-cell"
                            }`}
                          >
                            <div>
                              <div className="d-flex">
                                <div className="mr-3">Rating:</div>
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
                          </td>
                          <td
                            className={`${
                              lastVisibleColumn === 1
                                ? "d-table-cell"
                                : "d-none d-xl-table-cell"
                            }`}
                          >
                            {x.reported ? (
                              <div className="text-danger">Abused</div>
                            ) : (
                              <div className="text-success">No</div>
                            )}
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
                          filteredReviews
                            .slice(boundaries[0], boundaries[1])
                            .filter((x) => x.selected).length ===
                          boundaries[1] - boundaries[0]
                        }
                        onChange={(e) => {
                          setFilteredReviews((prev) => {
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
                      <div className="d-none d-lg-block">Posted By</div>
                      <div className="d-block d-lg-none">By</div>
                    </th>
                    <th className="d-table-cell d-xl-none table-header text-truncate">
                      {
                        ["Review", "Reported", "Movie Name", "Posted On"][
                          lastVisibleColumn
                        ]
                      }
                    </th>
                    <th className="d-none d-xl-table-cell table-footer text-truncate">
                      <div>Review</div>
                    </th>
                    <th className="d-none d-xl-table-cell table-footer text-truncate">
                      <div>Reported</div>
                    </th>
                    <th className="d-none d-xl-table-cell table-footer text-truncate">
                      <div>Movie Name</div>
                    </th>
                    <th className="d-none d-xl-table-cell table-footer text-truncate">
                      <div>Posted On</div>
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Swipeable>
        </div>
        <div className="row no-gutters justify-content-center justify-content-sm-between">
          <div className="col-60 col-sm-auto">
            <div className="row no-gutters">
              <div className="col-60 col-sm-auto pb-3 mr-sm-3">
                <div className="row no-gutters">
                  <Select
                    popoverClass="col-60 col-sm-auto"
                    onSelect={(index) => setAction(["Edit", "Delete"][index])}
                    items={["Edit", "Delete"]}
                    btnName={action ? action : "Select Action"}
                    className="input-light px-3 col-auto"
                  ></Select>
                </div>
              </div>

              <div
                onClick={handleApply}
                className="btn-custom btn-custom-primary col60 col-sm-auto mr-sm-3 btn-xsmall mb-3"
              >
                Apply
              </div>
            </div>
          </div>
          <div className="col-auto">
            <Pagination
              count={Math.ceil(filteredReviews.length / 5)}
              current={page}
              setCurrent={setPage}
            ></Pagination>
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

export default connect(mapp)(Reviews);
