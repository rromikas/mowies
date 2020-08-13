import React, { useState, useEffect } from "react";
import Select from "../utility/Select";
import Checkbox from "../utility/Checkbox";
import { Emoji } from "emoji-mart";
import Pagination from "../utility/Paigination";
import { BsSearch } from "react-icons/bs";
import date from "date-and-time";
import Popover from "../utility/Popover";
import { Swipeable } from "react-swipeable";
import {
  GetComments,
  DeleteMultipleComments,
  GetReview,
} from "../../server/DatabaseApi";
import { connect } from "react-redux";
import store from "../../store/store";
import Loader from "../utility/Loader";
import history from "../../History";

const Comments = ({
  setEditCommentSection,
  setEditComment,
  publicUsers,
  ratings,
}) => {
  const [action, setAction] = useState("");
  const [role, setRole] = useState("");
  const [searchKey, setSearchKey] = useState("User");
  const [lastVisibleColumn, setLastVisibleColumn] = useState(0);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [mainFilter, setMainFilter] = useState({ key: "", value: "" });
  const [search, setSearch] = useState("");

  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [reviewOfComment, setReviewOfComment] = useState({
    _id: "",
    review: "",
  });

  useEffect(() => {
    async function getData() {
      let res = await GetComments();
      if (!res.error) {
        setComments(res.map((x) => Object.assign({}, x, { selected: false })));
      }
    }
    getData();
  }, [refresh]);

  useEffect(() => {
    let arr = [...comments];
    if (comments.length) {
      if (search) {
        if (searchKey === "User") {
          arr = arr.filter((x) =>
            publicUsers[x.author].display_name
              .toLowerCase()
              .includes(search.toLowerCase())
          );
        } else if (searchKey === "Comment") {
          arr = arr.filter((x) =>
            x.comment.toLowerCase().includes(search.toLowerCase())
          );
        }
      }

      if (roleFilter) {
        arr = arr.filter((x) => publicUsers[x.author].role === roleFilter);
      }

      if (mainFilter.key === "role" && mainFilter.value) {
        arr = arr.filter(
          (x) => publicUsers[x.author][mainFilter.key] === mainFilter.value
        );
      }

      if (mainFilter.key === "deleted" && mainFilter.value) {
        arr = arr.filter((x) => x["deleted"] === mainFilter.value);
      } else {
        arr = arr.filter((x) => !x["deleted"]);
      }

      setFilteredComments(arr);
    }
  }, [search, roleFilter, comments, mainFilter]);

  //boundaries for slicing comments array. (pagination)
  let boundaries = [(page - 1) * 5, (page - 1) * 5 + 5];
  if (boundaries[1] >= filteredComments.length) {
    boundaries[1] = boundaries[1] - (boundaries[1] - filteredComments.length);
  }

  const handleApply = async (all = false) => {
    if (all) {
      setRoleFilter(role === "All" ? "" : role);
    }
    let selected = filteredComments.filter((x) => x.selected);
    if (selected.length) {
      if (action === "Edit") {
        setEditComment(selected[0]);
        setEditCommentSection();
      } else {
        //delete review
        let res = await DeleteMultipleComments(selected.map((x) => x._id));
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
              title: "Comments were deleted",
              message: "Comments were successfully deleted",
              type: "success",
            },
          });
          setRefresh(!refresh);
        }
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
            All ({comments.filter((x) => !x.deleted).length})
          </div>
          <div className="col-auto px-2 text-muted">|</div>
          <div
            onClick={() =>
              setMainFilter((prev) =>
                Object.assign({}, prev, { key: "role", value: "Administrator" })
              )
            }
            className={`cursor-pointer col-auto ${
              mainFilter.key === "role" && mainFilter.value === "Administrator"
                ? "text-primary"
                : "text-dark"
            }`}
          >
            By Administrators (
            {Object.values(publicUsers).length
              ? comments.filter(
                  (x) =>
                    publicUsers[x.author].role === "Administrator" && !x.deleted
                ).length
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
            Deleted ({comments.filter((x) => x.deleted).length})
          </div>
        </div>
        <div className="row no-gutters justify-content-between">
          <div className="col-sm-auto col-60">
            <div className="row no-gutters">
              <div className="col-60 col-sm-auto pb-3 mr-sm-3">
                <div className="row no-gutters">
                  <Select
                    popoverClass="col-60 col-sm-auto"
                    onSelect={(index) => setAction(["Delete"][index])}
                    items={["Delete"]}
                    btnName={action ? action : "Select Action"}
                    className="input-light px-3 col-auto"
                  ></Select>
                </div>
              </div>
              <div className="col-60 col-sm-auto pb-3 mr-sm-3">
                <div className="row no-gutters">
                  <Select
                    popoverClass="col-60 col-sm-auto"
                    onSelect={(index) =>
                      setRole(["All", "Administrator", "User"][index])
                    }
                    items={["All", "Administrator", "User"]}
                    btnName={role ? role : "Select Role"}
                    className="input-light px-3 col-auto"
                  ></Select>
                </div>
              </div>
              <div
                onClick={() => handleApply(true)}
                className="btn-custom btn-custom-primary col-60 col-sm-auto mb-3 mr-3 btn-xsmall"
              >
                Apply
              </div>
            </div>
          </div>
          <div className="col-60 d-block d-sm-none">
            <div className="row no-gutters mb-3">
              <Select
                popoverClass="w-100"
                onSelect={(index) => setSearchKey(["User", "Comment"][index])}
                className="input-light col-60"
                items={["User", "Comment"]}
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
                onSelect={(index) => setSearchKey(["User", "Comment"][index])}
                className="table-input-prepend-select col-auto"
                items={["User", "Comment"]}
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
                          filteredComments
                            .slice(boundaries[0], boundaries[1])
                            .filter((x) => x.selected).length ===
                          boundaries[1] - boundaries[0]
                        }
                        onChange={(e) => {
                          setFilteredComments((prev) => {
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
                        ["Comment", "In Repsonse To", "Posted On", "Reported"][
                          lastVisibleColumn
                        ]
                      }
                    </th>
                    <th className="d-none d-xl-table-cell table-header text-truncate">
                      <div>Comment</div>
                    </th>
                    <th className="d-none d-xl-table-cell table-header text-truncate">
                      <div>In Response To</div>
                    </th>
                    <th className="d-none d-xl-table-cell table-header text-truncate">
                      <div>Posted On</div>
                    </th>
                    <th className="d-none d-xl-table-cell table-header text-truncate">
                      <div>Reported</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComments.length ? (
                    filteredComments
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
                                setFilteredComments((prev) => {
                                  let arr = [...prev];
                                  arr[(page - 1) * 5 + i].selected =
                                    e.target.checked;
                                  return arr;
                                });
                              }}
                            ></Checkbox>
                          </td>
                          <td>
                            <div>
                              {publicUsers[x.author] ? (
                                <div style={{ whiteSpace: "nowrap" }}>
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
                                    <div className="text-primary">
                                      {publicUsers[x.author].display_name}
                                    </div>
                                    <div className="mb-2">
                                      {publicUsers[x.author].email}
                                    </div>
                                    <div className="d-flex">
                                      <div
                                        className="text-primary underline-link"
                                        onClick={() => {
                                          setEditComment(x);
                                          setEditCommentSection();
                                        }}
                                      >
                                        Edit
                                      </div>
                                      <div className="px-2">|</div>
                                      <div
                                        className="text-danger underline-link"
                                        onClick={async () => {
                                          let res = await DeleteMultipleComments(
                                            [x._id]
                                          );
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
                                                title: "Comment was deleted",
                                                message:
                                                  "Comment was successfully deleted",
                                                type: "success",
                                              },
                                            });
                                          }
                                          setRefresh(!refresh);
                                        }}
                                      >
                                        Delete
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
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
                              <div
                                style={{ minWidth: "200px" }}
                                className="cursor-pointer user-select-none btn-link"
                                onClick={(e) => {
                                  history.push(
                                    `/movie/${x.movie_id}/${x.review_id}/${x._id}`
                                  );
                                }}
                              >
                                {x.comment}
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
                            <div>
                              Movie:{" "}
                              {ratings[x.movie_id]
                                ? ratings[x.movie_id].movie_title
                                : ""}
                            </div>
                            <div className="d-flex">
                              <div
                                onClick={async () => {
                                  history.push(
                                    `/movie/${x.movie_id}/${x.review_id}`
                                  );
                                }}
                                className="text-primary cursor-pointer"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                View Review
                              </div>
                            </div>
                          </td>
                          <td
                            className={`${
                              lastVisibleColumn === 2
                                ? "d-table-cell"
                                : "d-none d-xl-table-cell"
                            }`}
                          >
                            <div style={{ whiteSpace: "nowrap" }}>
                              {date.format(
                                new Date(x.date),
                                "DD/MM/YYYY @ hh:mm A"
                              )}
                            </div>
                          </td>
                          <td
                            className={`${
                              lastVisibleColumn === 3
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
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-5">
                        0 results found
                      </td>
                    </tr>
                  )}
                </tbody>
                {/* <tfoot>
                  <tr>
                    <th className="text-center">
                      <Checkbox
                        color={"primary"}
                        checked={
                          comments
                            .slice(boundaries[0], boundaries[1])
                            .filter((x) => x.selected).length ===
                          boundaries[1] - boundaries[0]
                        }
                        onChange={(e) => {
                          setFilteredComments((prev) => {
                            let arr = [...prev];
                            for (
                              let i = boundaries[0];
                              i < boundaries[1];
                              i++
                            ) {
                              arr[i].seleCted = e.target.checked;
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
                        [
                          "Posted By",
                          "Review",
                          "Reported",
                          "Movie Name",
                          "Posted On",
                        ][lastVisibleColumn]
                      }
                    </th>
                    <th className="d-none d-xl-table-cell table-footer text-truncate">
                      <div>Comment</div>
                    </th>
                    <th className="d-none d-xl-table-cell table-footer text-truncate">
                      <div>Reported</div>
                    </th>
                    <th className="d-none d-xl-table-cell table-footer text-truncate">
                      <div>In Response To</div>
                    </th>
                    <th className="d-none d-xl-table-cell table-footer text-truncate">
                      <div>Posted On</div>
                    </th>
                  </tr>
                </tfoot> */}
              </table>
            </div>
          </Swipeable>
        </div>
        <div className="row no-gutters justify-content-center justify-content-sm-end">
          <div className="col-auto">
            <Pagination
              count={Math.ceil(filteredComments.length / 5)}
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
    ratings: state.ratings,
    ...ownProps,
  };
}

export default connect(mapp)(Comments);
