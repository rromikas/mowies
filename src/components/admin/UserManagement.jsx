import React, { useState } from "react";
import Select from "../utility/Select";

const UserManagement = () => {
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    display_name: "",
    email: "",
    username: "",
    password: "",
    re_password: "",
    status: "Active",
    role: "Administrator",
  });

  return (
    <div className="row no-gutters p-md-5 p-4">
      <div className="col-60" style={{ maxWidth: "800px" }}>
        <div className="row no-gutters border-bottom py-3 mb-5">
          <div className="col-60 h3">Add New User</div>
          <div className="col-60">
            Create a brand new user and add the to this site
          </div>
        </div>
        <div className="row no-gutters">
          <div className="col-sm-30 col-60 pr-sm-3 mb-4">
            <div className="row no-gutters mb-1">First name</div>
            <div className="row no-gutters">
              <input
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
          <div className="col-60 mb-1">Email</div>
          <div className="col-60">
            <input
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
          <div className="col-60 mb-1">Password</div>
          <div className="col-60 mb-1">
            <input
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
          <div className="col-60 mb-1">Confirm Password</div>
          <div className="col-60 mb-1">
            <input
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
                      status: ["Active", "Disabled"][index],
                    })
                  )
                }
                items={["Active", "Disabled"]}
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
                      role: ["Administrator", "User"][index],
                    })
                  )
                }
                items={["Administrator", "User"]}
                btnName={newUser.role ? newUser.role : "Select"}
                className="input-light px-3 col-60"
              ></Select>
            </div>
          </div>
        </div>
        <div className="row no-gutters">
          <div className="btn-custom btn-custom-secondary btn-small mr-sm-3 col-sm-auto col-60 mb-3">
            Cancel
          </div>
          <div className="btn-custom btn-custom-primary btn-small col-sm-auto col-60 mb-3">
            Save
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
