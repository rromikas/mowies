import React, { useState, useEffect } from "react";
import Select from "../utility/Select";
import Checkbox from "../utility/Checkbox";
import Pagination from "../utility/Paigination";
import { BsSearch } from "react-icons/bs";
import date from "date-and-time";
import { Swipeable } from "react-swipeable";
import {
  GetNotifications,
  DeleteMultipleNotifications,
} from "../../server/DatabaseApi";
import store from "../../store/store";

const Notifications = ({
  setEditNotification,
  setEditNotificationSection,
  setAddNewNotificationSection,
}) => {
  const [action, setAction] = useState("");
  const [type, setType] = useState("");
  const [searchKey, setSearchKey] = useState("Subject");
  const [lastVisibleColumn, setLastVisibleColumn] = useState(0);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [mainFilter, setMainFilter] = useState({ key: "", value: "" });
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function getData() {
      let data = await GetNotifications();
      if (!data.error) {
        setNotifications(
          data.reverse().map((x) => Object.assign({}, x, { selected: false }))
        );
      }
    }

    getData();
  }, [refresh]);

  const types = ["App", "Email", "System"];

  useEffect(() => {
    let arr = [...notifications];
    if (notifications.length) {
      if (search) {
        if (searchKey === "Subject") {
          arr = arr.filter((x) =>
            x.subject.toLowerCase().includes(search.toLowerCase())
          );
        } else if (searchKey === "Description") {
          arr = arr.filter((x) =>
            x.description.toLowerCase().includes(search.toLowerCase())
          );
        }
      }

      if (typeFilter) {
        arr = arr.filter((x) => x.type === typeFilter);
      }

      if (mainFilter.key) {
        arr = arr.filter((x) => x[mainFilter.key] === mainFilter.value);
      }

      setFilteredNotifications(arr);
    }
  }, [search, typeFilter, notifications, mainFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  //boundaries for slicing reviews array. (pagination)
  let boundaries = [(page - 1) * 5, (page - 1) * 5 + 5];
  if (boundaries[1] >= filteredNotifications.length) {
    boundaries[1] =
      boundaries[1] - (boundaries[1] - filteredNotifications.length);
  }

  const statuses = ["Sent", "Drafted", "Deleted"];

  const handleApply = async (all = false) => {
    if (all) {
      setTypeFilter(type);
    }
    if (action === "Edit") {
      let selected = filteredNotifications.filter((x) => x.selected);
      if (selected.length) {
        setEditNotification(selected[0]);
        setEditNotificationSection();
      }
    } else if (action === "Delete") {
      let selected = filteredNotifications.filter((x) => x.selected);
      if (selected.length) {
        let res = await DeleteMultipleNotifications(
          selected.map((x) => x._id),
          { status: "Deleted" }
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
              title: "Selected notifications deleted",
              message: "Selected notifications were successfully deleted",
              type: "success",
            },
          });
          store.dispatch({
            type: "UPDATE_USER",
            userProperty: { update: Date.now() },
          });
        }
        setRefresh(!refresh);
      }
    }
  };

  return (
    <div className="row no-gutters admin-screen">
      <div className="col-60 border-bottom">
        <div className="row no-gutters justify-content-between pb-3 align-items-end">
          <div className="col-auto">
            <div className="row no-gutters admin-screen-title">
              Notifications
            </div>
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
              <div
                onClick={() => {
                  setTypeFilter("");
                  setType("");
                  setMainFilter({ key: "", value: "" });
                }}
                className={`col-auto cursor-pointer ${
                  !typeFilter && !mainFilter.key ? "text-primary" : "text-dark"
                }`}
              >
                All ({notifications.length})
              </div>
              {statuses.map((x, i) => (
                <React.Fragment key={`status-${i}`}>
                  <div className="col-auto px-2 text-muted">|</div>
                  <div
                    onClick={() =>
                      setMainFilter((prev) =>
                        Object.assign({ key: "status", value: x })
                      )
                    }
                    className={`col-auto cursor-pointer ${
                      mainFilter.key === "status" && mainFilter.value === x
                        ? "text-primary"
                        : "text-dark"
                    }`}
                  >
                    {x} ({notifications.filter((y) => y.status === x).length})
                  </div>
                </React.Fragment>
              ))}
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
                        onSelect={(index) => setType(types[index])}
                        items={types}
                        btnName={type ? type : "Select Type"}
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
                    onSelect={(index) =>
                      setSearchKey(["Subject", "Description"][index])
                    }
                    className="input-light col-60"
                    items={["Subject", "Description"]}
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
                      setSearchKey(["Subject", "Description"][index])
                    }
                    className="table-input-prepend-select col-auto"
                    items={["Subject", "Description"]}
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
                          Subject
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
                                <div className="mb-2">{x.subject}</div>
                                <div className="d-flex">
                                  <div
                                    className="text-primary underline-link"
                                    onClick={() => {
                                      setEditNotification(x);
                                      setEditNotificationSection();
                                    }}
                                  >
                                    Edit
                                  </div>
                                  <div className="px-2">|</div>
                                  <div
                                    className="text-danger underline-link"
                                    onClick={async () => {
                                      let res = await DeleteMultipleNotifications(
                                        [x._id],
                                        { status: "Deleted" }
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
                                            title: "Notification was deleted",
                                            message:
                                              "Notification was successfully deleted",
                                            type: "success",
                                          },
                                        });
                                        store.dispatch({
                                          type: "UPDATE_USER",
                                          userProperty: { update: Date.now() },
                                        });
                                      }
                                      setRefresh(!refresh);
                                    }}
                                  >
                                    Delete
                                  </div>
                                </div>
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
                                  style={{ minWidth: "200px" }}
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
                                    <div style={{ whiteSpace: "nowrap" }}>
                                      {date.format(
                                        new Date(x.start_date),
                                        "DD/MM/YYYY @ hh:mm A"
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex">
                                  <div style={{ width: "55px" }}>To:</div>
                                  <div>
                                    <div style={{ whiteSpace: "nowrap" }}>
                                      {date.format(
                                        new Date(x.end_date),
                                        "DD/MM/YYYY @ hh:mm A"
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
                          <td colSpan={6} className=" text-center py-5">
                            0 results found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Swipeable>
            </div>
            <div className="row no-gutters justify-content-center justify-content-sm-end">
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
