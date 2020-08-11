import React, { useState, useEffect } from "react";
import Select from "../utility/Select";
import Checkbox from "../utility/Checkbox";
import Pagination from "../utility/Paigination";
import { BsSearch } from "react-icons/bs";
import date from "date-and-time";
import { Swipeable } from "react-swipeable";
import {
  GetUsers,
  EditMultipleUsers,
  DeleteMultipleUsers,
} from "../../server/DatabaseApi";
import { format as TimeAgo } from "timeago.js";
import store from "../../store/store";
import { connect } from "react-redux";

const Users = ({
  setEditUser,
  setEditUserSection,
  setAddNewUserSection,
  publicUsers,
  ratings,
}) => {
  const [action, setAction] = useState("");
  const [role, setRole] = useState("");
  const [searchKey, setSearchKey] = useState("User");
  const [lastVisibleColumn, setLastVisibleColumn] = useState(0);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function getData() {
      let data = await GetUsers();
      setUsers(data.map((x) => Object.assign({}, x, { selected: false })));
    }

    getData();
  }, [refresh]);

  useEffect(() => {
    let arr = [...users];
    if (users.length) {
      if (search) {
        if (searchKey === "User") {
          arr = arr.filter((x) =>
            x.display_name.toLowerCase().includes(search.toLowerCase())
          );
        } else if (searchKey === "Email") {
          arr = arr.filter((x) =>
            x.email.toLowerCase().includes(search.toLowerCase())
          );
        }
      }

      if (roleFilter) {
        arr = arr.filter((x) => x.role === roleFilter);
      }

      if (statusFilter) {
        arr = arr.filter((x) => x.status === statusFilter);
      }
    }
    setFilteredUsers(arr);
  }, [search, roleFilter, users, statusFilter]);

  //boundaries for slicing reviews array. (pagination)
  let boundaries = [(page - 1) * 5, (page - 1) * 5 + 5];
  if (boundaries[1] >= filteredUsers.length) {
    boundaries[1] = boundaries[1] - (boundaries[1] - filteredUsers.length);
  }

  const handleApply = async (all = false) => {
    if (all) {
      setRoleFilter(role === "All" ? "" : role);
    }
    let selected = filteredUsers.filter((x) => x.selected);

    if (selected.length) {
      if (action === "Edit") {
        setEditUser(selected[0]);
        setEditUserSection();
      } else {
        let update = {};
        if (action === "Delete") {
          update["status"] = "Deleted";
        } else if (action === "Inactivate") {
          update["status"] = "Inactive";
        } else if (action === "Block") {
          update["status"] = "Blocked";
        } else if (action === "Activate") {
          update["status"] = "Active";
        }
        let res = await EditMultipleUsers(
          selected.map((x) => x._id),
          selected.map((x) => publicUsers[x._id]._id),
          update
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
              title: "Users updated",
              message: "User were successfully updated",
              type: "success",
            },
          });
          setRefresh(!refresh);
          let newPublicUsers = { ...publicUsers };
          selected.forEach((x) => {
            newPublicUsers[x._id].status = update["status"];
          });
          store.dispatch({
            type: "SET_PUBLICUSERS",
            publicUsers: newPublicUsers,
          });
        }
      }
    }
  };

  const editUsers = async (update, ids, pids) => {
    let res = await EditMultipleUsers(ids, pids, update);
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
          title: "Users updated",
          message: "User were successfully updated",
          type: "success",
        },
      });
      setRefresh(!refresh);
    }
  };
  const actions = ["Block", "Inactivate", "Activate", "Delete"];
  const statuses = ["Active", "Inactive", "Blocked"];
  const columns = ["Email", "Role", "Last login", "Activity", "Status"];
  return (
    <div className="row no-gutters admin-screen">
      <div className="col-60 border-bottom">
        <div className="row no-gutters justify-content-between pb-3 align-items-end">
          <div className="col-auto">
            <div className="row no-gutters admin-screen-title">Users</div>
            <div className="row no-gutters">Add, edit and delete users</div>
          </div>
          <div
            className="col-auto btn-custom btn-custom-primary btn-natural"
            onClick={() => setAddNewUserSection()}
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
                className={`col-auto ${
                  statusFilter ? "text-dark" : "text-primary"
                }`}
                onClick={() => setStatusFilter("")}
              >
                All ({users.length})
              </div>
              {statuses.map((x, i) => (
                <React.Fragment key={`status-${i}`}>
                  <div className="col-auto px-2 text-muted">|</div>
                  <div
                    className={`col-auto cursor-pointer ${
                      statusFilter === x ? "text-primary" : "text-dark"
                    }`}
                    onClick={() => setStatusFilter(x)}
                  >
                    {x} ({users.filter((y) => y.status === x).length})
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
                        onSelect={(index) => setAction(actions[index])}
                        items={actions}
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
                    onSelect={(index) => setSearchKey(["User", "Email"][index])}
                    className="input-light col-60"
                    items={["User", "Email"]}
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
                    onSelect={(index) => setSearchKey(["User", "Email"][index])}
                    className="table-input-prepend-select col-auto"
                    items={["User", "Email"]}
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
                              filteredUsers
                                .slice(boundaries[0], boundaries[1])
                                .filter((x) => x.selected).length ===
                              boundaries[1] - boundaries[0]
                            }
                            onChange={(e) => {
                              setFilteredUsers((prev) => {
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
                          <div className="d-none d-lg-block">Display Name</div>
                          <div className="d-block d-lg-none">Name</div>
                        </th>
                        <th className="d-table-cell d-xl-none table-header text-truncate">
                          {columns[lastVisibleColumn]}
                        </th>
                        {columns.map((c, j) => (
                          <th
                            className="d-none d-xl-table-cell table-header text-truncate"
                            key={`column-${j}`}
                          >
                            <div>{c}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length ? (
                        filteredUsers
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
                                    setFilteredUsers((prev) => {
                                      let arr = [...prev];
                                      arr[(page - 1) * 5 + i].selected =
                                        e.target.checked;
                                      return arr;
                                    });
                                  }}
                                ></Checkbox>
                              </td>
                              <td style={{ whiteSpace: "nowrap" }}>
                                <div>
                                  <div style={{ whiteSpace: "nowrap" }}>
                                    <div className="d-inline-block mr-2">
                                      <div
                                        className="square-50 rounded-circle bg-image"
                                        style={{
                                          backgroundImage: `url(${x.photo})`,
                                        }}
                                      ></div>
                                    </div>
                                    <div className="d-none d-md-inline-block align-top">
                                      <div className="text-primary mb-2">
                                        {x.display_name}
                                      </div>
                                      <div className="d-flex">
                                        <div
                                          className="text-primary underline-link"
                                          onClick={() => {
                                            setEditUser(x);
                                            setEditUserSection();
                                          }}
                                        >
                                          Edit
                                        </div>
                                        <div className="px-2">|</div>
                                        <div
                                          className="text-primary underline-link"
                                          onClick={() => {
                                            editUsers(
                                              { status: "Blocked" },
                                              [x._id],
                                              [publicUsers[x._id]._id]
                                            );
                                          }}
                                        >
                                          Block
                                        </div>
                                        <div className="px-2">|</div>
                                        <div
                                          className="text-danger underline-link"
                                          onClick={async () => {
                                            let res = await DeleteMultipleUsers(
                                              [x._id],
                                              [publicUsers[x._id]._id]
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
                                                  title: "Users deleted",
                                                  message:
                                                    "User were successfully deleted",
                                                  type: "success",
                                                },
                                              });
                                              setRefresh(!refresh);
                                              let newPublicUsers = {
                                                ...publicUsers,
                                              };
                                              newPublicUsers[x._id].status =
                                                "Deleted";

                                              store.dispatch({
                                                type: "SET_PUBLICUSERS",
                                                publicUsers: newPublicUsers,
                                              });
                                            }
                                          }}
                                        >
                                          Delete
                                        </div>
                                      </div>
                                    </div>
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
                                <div>{x.email}</div>
                              </td>
                              <td
                                className={`${
                                  lastVisibleColumn === 1
                                    ? "d-table-cell"
                                    : "d-none d-xl-table-cell"
                                }`}
                              >
                                {x.role}
                              </td>
                              <td
                                className={`${
                                  lastVisibleColumn === 2
                                    ? "d-table-cell"
                                    : "d-none d-xl-table-cell"
                                }`}
                              >
                                {x.last_login
                                  ? TimeAgo(x.last_login)
                                  : "No data"}
                              </td>
                              <td
                                className={`${
                                  lastVisibleColumn === 3
                                    ? "d-table-cell"
                                    : "d-none d-xl-table-cell"
                                }`}
                              >
                                {x.last_activity
                                  ? TimeAgo(x.last_activity)
                                  : "No data"}
                              </td>
                              <td
                                className={`${
                                  x.status === "Active"
                                    ? "text-green"
                                    : x.status === "Inactive"
                                    ? "text-orange"
                                    : "text-danger"
                                } ${
                                  lastVisibleColumn === 4
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
                          <td colSpan={7} className=" text-center py-5">
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
                  count={Math.ceil(filteredUsers.length / 5)}
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

function mapp(state, ownProps) {
  return {
    ratings: state.ratings,
    publicUsers: state.publicUsers,
    ...ownProps,
  };
}

export default connect(mapp)(Users);
