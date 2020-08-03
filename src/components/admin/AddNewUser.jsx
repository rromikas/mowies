import React, { useState, useEffect } from "react";
import Select from "../utility/Select";
import { CreateUserForAdmin } from "../../server/DatabaseApi";
import store from "../../store/store";
import Loader from "../utility/Loader";

const AddNewUser = ({ getBack }) => {
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    display_name: "",
    email: "",
    username: "",
    password: "",
    re_password: "",
    status: "Active",
    role: "User",
  });

  const [problem, setProblem] = useState("");

  const [loading, setLoading] = useState(false);

  const validations = [
    {
      valid: newUser.email,
      error: "Email is required",
    },
    {
      valid: newUser.password,
      error: "Password is required",
    },
    {
      valid: /[^\w\s]/.test(newUser.password) || /\d/.test(newUser.password),
      error: "Password must contain number or symbol",
    },
    {
      valid: newUser.password === newUser.re_password,
      error: "Passwords don't match",
    },
    {
      valid: newUser.password.length >= 6,
      error: "Password must contain at least 6 characters",
    },
  ];

  const statuses = ["Active", "Inactive", "Blocked"];
  const roles = ["Administrator", "User"];

  return (
    <div className="row no-gutters p-md-5 p-4">
      <div className="col-60" style={{ maxWidth: "800px" }}>
        <div className="row no-gutters border-bottom py-3 mb-5">
          <div className="col-60 h3">Add User</div>
          <div className="col-60">Add brand new user</div>
        </div>
        <div className="row no-gutters">
          <div className="col-sm-30 col-60 pr-sm-3 mb-4">
            <div className="row no-gutters mb-1">First name</div>
            <div className="row no-gutters">
              <input
                spellCheck={false}
                value={newUser.first_name}
                onChange={(e) => {
                  e.persist();
                  setNewUser((prev) =>
                    Object.assign({}, prev, {
                      first_name: e.target.value,
                    })
                  );
                }}
                type="text"
                className="px-3 input-light w-100"
              ></input>
            </div>
          </div>
          <div className="col-sm-30 col-60 mb-4">
            <div className="row no-gutters mb-1">Last name</div>
            <div className="row no-gutters">
              <input
                spellCheck={false}
                value={newUser.last_name}
                onChange={(e) => {
                  e.persist();
                  setNewUser((prev) =>
                    Object.assign({}, prev, {
                      last_name: e.target.value,
                    })
                  );
                }}
                type="text"
                className="px-3 input-light w-100"
              ></input>
            </div>
          </div>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">Display name</div>
          <div className="col-60 mb-1">
            <input
              spellCheck={false}
              value={newUser.display_name}
              onChange={(e) => {
                e.persist();
                setNewUser((prev) =>
                  Object.assign({}, prev, {
                    display_name: e.target.value,
                  })
                );
              }}
              type="text"
              className="px-3 input-light w-100"
            ></input>
          </div>
          <div className="col-60 text-muted">
            This name will be visible for everyone
          </div>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">*Email</div>
          <div className="col-60">
            <input
              spellCheck={false}
              value={newUser.email}
              onChange={(e) => {
                e.persist();
                setNewUser((prev) =>
                  Object.assign({}, prev, {
                    email: e.target.value,
                  })
                );
              }}
              type="text"
              className="px-3 input-light w-100"
            ></input>
          </div>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">Username</div>
          <div className="col-60 mb-1">
            <input
              spellCheck={false}
              value={newUser.username}
              onChange={(e) => {
                e.persist();
                setNewUser((prev) =>
                  Object.assign({}, prev, {
                    username: e.target.value,
                  })
                );
              }}
              type="text"
              className="px-3 input-light w-100"
            ></input>
          </div>
          <div className="col-60 text-muted">
            Choose something you like, this cannot be changed
          </div>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">*Password</div>
          <div className="col-60 mb-1">
            <input
              spellCheck={false}
              value={newUser.password}
              onChange={(e) => {
                e.persist();
                setNewUser((prev) =>
                  Object.assign({}, prev, {
                    password: e.target.value,
                  })
                );
              }}
              type="text"
              className="px-3 input-light w-100"
            ></input>
          </div>
          <div className="col-60 text-muted">
            Must be at least 6 characters and must contain a number or symbol
          </div>
        </div>

        <div className="row no-gutters mb-4">
          <div className="col-60 mb-1">*Confirm Password</div>
          <div className="col-60 mb-1">
            <input
              spellCheck={false}
              value={newUser.re_password}
              onChange={(e) => {
                e.persist();
                setNewUser((prev) =>
                  Object.assign({}, prev, {
                    re_password: e.target.value,
                  })
                );
              }}
              type="text"
              className="px-3 input-light w-100"
            ></input>
          </div>
          <div className="col-60 text-muted">
            Must be at least 6 characters and must contain a number or symbol
          </div>
        </div>
        <div className="row no-gutters mb-4">
          <div className="col-sm-20 col-60 pr-sm-3 mb-4">
            <div className="row no-gutters">
              <div className="col-60 mb-1">Status</div>
              <Select
                popoverClass="w-100"
                onSelect={(index) =>
                  setNewUser((prev) =>
                    Object.assign({}, prev, {
                      status: statuses[index],
                    })
                  )
                }
                items={statuses}
                btnName={newUser.status ? newUser.status : "Select"}
                className="input-light px-3 col-60"
              ></Select>
            </div>
          </div>
          <div className="col-sm-20 col-60 mb-4">
            <div className="row no-gutters">
              <div className="col-60 mb-1">Role</div>
              <Select
                popoverClass="w-100"
                onSelect={(index) =>
                  setNewUser((prev) =>
                    Object.assign({}, prev, {
                      role: roles[index],
                    })
                  )
                }
                items={roles}
                btnName={newUser.role ? newUser.role : "Select"}
                className="input-light px-3 col-60"
              ></Select>
            </div>
          </div>
        </div>
        <div
          style={{ height: "50px", opacity: problem ? 1 : 0 }}
          className="row no-gutters align-items-center text-danger"
        >
          {problem}
        </div>
        <div className="row no-gutters">
          <div
            className="btn-custom btn-custom-secondary btn-small mr-sm-3 col-sm-auto col-60 mb-3"
            onClick={() => getBack()}
          >
            Cancel
          </div>
          <div
            className="btn-custom btn-custom-primary btn-small col-sm-auto col-60 mb-3"
            onClick={async () => {
              let invalid = validations.filter((x) => !x.valid);
              if (invalid.length) {
                setProblem(invalid[0].error);
              } else {
                setLoading(true);
                let res = await CreateUserForAdmin(newUser);
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
                      title: "User updated",
                      message: "User was successfully updated",
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
  );
};

export default AddNewUser;
