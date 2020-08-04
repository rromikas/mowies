import React, { useState, useEffect } from "react";
import { Notifications as data, PublicUsers } from "../../Data";
import Select from "../utility/Select";
import Checkbox from "../utility/Checkbox";
import { Emoji } from "emoji-mart";
import Pagination from "../utility/Paigination";
import { BsSearch } from "react-icons/bs";
import date from "date-and-time";
import { Swipeable } from "react-swipeable";
import { GetNotifications } from "../../server/DatabaseApi";

const Notifications = ({
  setEditNotification,
  setEditNotificationSection,
  setAddNewNotificationSection,
}) => {
  const [action, setAction] = useState("");
  const [role, setRole] = useState("");
  const [searchKey, setSearchKey] = useState("User");
  const [lastVisibleColumn, setLastVisibleColumn] = useState(0);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");

  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  useEffect(() => {
    async function getData() {
      let data = await GetNotifications();
      console.log("Data notifications", data);
      if (!data.error) {
        setNotifications(data);
      }
    }

    getData();
  }, []);

  useEffect(() => {
    let arr = [...notifications];
    if (notifications.length) {
      if (search) {
        if (searchKey === "User") {
          arr = arr.filter((x) =>
            PublicUsers[x.author].display_name.match(new RegExp(search, "i"))
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
        arr = arr.filter(
          (x) => PublicUsers[x.author].role === roleFilter.toLowerCase()
        );
      }

      setFilteredNotifications(arr);
    }
  }, [search, roleFilter, notifications]);

  //boundaries for slicing reviews array. (pagination)
  let boundaries = [(page - 1) * 5, (page - 1) * 5 + 5];
  if (boundaries[1] >= filteredNotifications.length) {
    boundaries[1] =
      boundaries[1] - (boundaries[1] - filteredNotifications.length);
  }

  const statuses = ["Sent", "Drafted", "Deleted"];
  return (
    <div className="row no-gutters p-md-5 p-4">
      <div className="col-60 border-bottom">
        <div className="row no-gutters justify-content-between">
          <div className="col-auto py-3">
            <div className="row no-gutters h3">Notifications</div>
            <div className="row no-gutters">
              Create, send and manage notifications
            </div>
          </div>
          <div
            className="col-auto btn-custom btn-custom-primary btn-natural"
            onClick={() => setAddNewNotificationSection()}
          >
            Add New
          </div>
        </div>
      </div>
      <div className="col-60">
        <div className="row no-gutters">
          <div className="col-60 py-5">
            <div className="row no-gutters h6 mb-3">
              <div className="col-auto">All ({notifications.length})</div>
              {statuses.map((x, i) => (
                <React.Fragment key={`status-${i}`}>
                  <div className="col-auto px-2 text-muted">|</div>
                  <div className="col-auto">
                    {x} ({notifications.filter((y) => y.status === x).length})
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="row no-gutters justify-content-between">
              <div className="col-sm-auto col-60">
                <div className="row no-gutters">
                  <div className="col-60 col-sm-auto pb-3">
                    <div className="row no-gutters">
                      <Select
                        popoverClass="col-60 col-sm-auto"
                        onSelect={(index) =>
                          setAction(["Edit", "Delete"][index])
                        }
                        items={["Edit", "Delete"]}
                        btnName={action ? action : "Select Action"}
                        className="input-light px-3 col-auto mr-sm-3"
                      ></Select>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      if (action === "Edit") {
                        let selected = filteredNotifications.filter(
                          (x) => x.selected
                        );
                        if (selected.length) {
                          setEditNotification(selected[0]);
                          setEditNotificationSection();
                        }
                      } else if (action === "Delete") {
                        //delete review
                      }
                    }}
                    className="d-none d-xl-block btn-custom btn-custom-primary col-auto mr-3 btn-xsmall mb-3"
                  >
                    Apply
                  </div>
                  <div className="col-60 col-sm-auto pb-3">
                    <div className="row no-gutters">
                      <Select
                        popoverClass="col-60 col-sm-auto"
                        onSelect={(index) =>
                          setRole(["Admin", "Co-admin", "Copywriter"][index])
                        }
                        items={["Admin", "Co-admin", "Copywriter"]}
                        btnName={role ? role : "Select Role"}
                        className="input-light px-3 col-auto mr-sm-3"
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
                    onClick={() => {
                      if (action === "Edit") {
                        let selected = filteredNotifications.filter(
                          (x) => x.selected
                        );
                        if (selected.length) {
                          setEditNotification(selected[0]);
                          setEditNotificationSection();
                        }
                      } else if (action === "Delete") {
                        //delete review
                      } else {
                        setRoleFilter(role);
                      }
                    }}
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
                              filteredNotifications
                                .slice(boundaries[0], boundaries[1])
                                .filter((x) => x.selected).length ===
                              boundaries[1] - boundaries[0]
                            }
                            onChange={(e) => {
                              setFilteredNotifications((prev) => {
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
                          {
                            ["Type", "Description", "Duration", "Status"][
                              lastVisibleColumn
                            ]
                          }
                        </th>
                        <th className="d-none d-xl-table-cell table-header text-truncate">
                          <div>Type</div>
                        </th>
                        <th className="d-none d-xl-table-cell table-header text-truncate">
                          <div>Description</div>
                        </th>
                        <th className="d-none d-xl-table-cell table-header text-truncate">
                          <div>Duration</div>
                        </th>
                        <th className="d-none d-xl-table-cell table-header text-truncate">
                          <div>Status</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNotifications.length ? (
                        filteredNotifications
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
                                    setFilteredNotifications((prev) => {
                                      let arr = [...prev];
                                      arr[(page - 1) * 5 + i].selected =
                                        e.target.checked;
                                      return arr;
                                    });
                                  }}
                                ></Checkbox>
                              </td>
                              <td style={{ whiteSpace: "nowrap" }}>
                                {x.title}
                              </td>
                              <td
                                className={`${
                                  lastVisibleColumn === 0
                                    ? "d-table-cell"
                                    : "d-none d-xl-table-cell"
                                }`}
                              >
                                <div>{x.type}</div>
                              </td>
                              <td
                                className={`${
                                  lastVisibleColumn === 1
                                    ? "d-table-cell"
                                    : "d-none d-xl-table-cell"
                                }`}
                              >
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
                                  {x.description}
                                </div>
                              </td>
                              <td
                                className={`${
                                  lastVisibleColumn === 2
                                    ? "d-table-cell"
                                    : "d-none d-xl-table-cell"
                                }`}
                              >
                                <div className="d-flex mb-2">
                                  <div style={{ width: "55px" }}>From:</div>
                                  <div>
                                    <div>
                                      {date.format(
                                        new Date(x.start_date),
                                        "DD/MM/YYYY"
                                      )}
                                    </div>
                                    <div>
                                      {date.format(
                                        new Date(x.start_date),
                                        "@ hh:mm A"
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex">
                                  <div style={{ width: "55px" }}>To:</div>
                                  <div>
                                    <div>
                                      {date.format(
                                        new Date(x.end_date),
                                        "DD/MM/YYYY"
                                      )}
                                    </div>
                                    <div>
                                      {date.format(
                                        new Date(x.end_date),
                                        "@ hh:mm A"
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td
                                className={`${
                                  lastVisibleColumn === 3
                                    ? "d-table-cell"
                                    : "d-none d-xl-table-cell"
                                }`}
                              >
                                {x.status}
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
                              filteredNotifications
                                .slice(boundaries[0], boundaries[1])
                                .filter((x) => x.selected).length ===
                              boundaries[1] - boundaries[0]
                            }
                            onChange={(e) => {
                              setFilteredNotifications((prev) => {
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
                            ["Type", "Description", "Duration", "Status"][
                              lastVisibleColumn
                            ]
                          }
                        </th>
                        <th className="d-none d-xl-table-cell table-footer text-truncate">
                          <div>Type</div>
                        </th>
                        <th className="d-none d-xl-table-cell table-footer text-truncate">
                          <div>Description</div>
                        </th>
                        <th className="d-none d-xl-table-cell table-footer text-truncate">
                          <div>Duration</div>
                        </th>
                        <th className="d-none d-xl-table-cell table-footer text-truncate">
                          <div>Status</div>
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
                  <div className="col-60 col-sm-auto pb-3">
                    <div className="row no-gutters">
                      <Select
                        popoverClass="col-60 col-sm-auto"
                        onSelect={(index) =>
                          setAction(["Edit", "Delete"][index])
                        }
                        items={["Edit", "Delete"]}
                        btnName={action ? action : "Select Action"}
                        className="input-light px-3 col-auto mr-sm-3"
                      ></Select>
                    </div>
                  </div>

                  <div
                    className="btn-custom btn-custom-primary col60 col-sm-auto mr-sm-3 btn-xsmall mb-3"
                    onClick={() => {
                      if (action === "Edit") {
                        let selected = filteredNotifications.filter(
                          (x) => x.selected
                        );
                        if (selected.length) {
                          setEditNotification(selected[0]);
                          setEditNotificationSection();
                        }
                      } else if (action === "Delete") {
                        //delete review
                      }
                    }}
                  >
                    Apply
                  </div>
                </div>
              </div>
              <div className="col-auto">
                <Pagination
                  count={Math.ceil(filteredNotifications.length / 5)}
                  current={page}
                  setCurrent={setPage}
                ></Pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
